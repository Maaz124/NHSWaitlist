import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertOnboardingResponseSchema, insertWeeklyAssessmentSchema } from "@shared/schema";
import bcrypt from "bcrypt";

function requireAuth(req: any, res: any, next: any) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function validateUserAccess(req: any, res: any, next: any) {
  const requestedUserId = req.params.userId;
  const sessionUserId = req.session?.userId;
  
  if (!sessionUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  if (requestedUserId && requestedUserId !== sessionUserId) {
    return res.status(403).json({ error: "Forbidden: Access denied" });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const userWithHashedPassword = { ...userData, password: hashedPassword };
      
      const user = await storage.createUser(userWithHashedPassword);
      await storage.initializeAnxietyModules(user.id);
      (req as any).session.userId = user.id;
      
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email) return res.status(400).json({ error: "Email is required" });
      if (!password) return res.status(400).json({ error: "Password is required" });
      
      const user = await storage.getUserByEmail(email);
      if (!user) return res.status(401).json({ error: "Invalid email or password" });
      
      // Verify the password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      (req as any).session.userId = user.id;
      
      // Don't return the password in the response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session?.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req: any, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    
    // Don't return the password in the response
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  // User registration/login (simplified for MVP)
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const user = await storage.createUser(userData);
      await storage.initializeAnxietyModules(user.id);
      
      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/users/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      
      // Remove email from updates to prevent email changes
      const { email, ...allowedUpdates } = updates;
      
      const user = await storage.updateUser(userId, allowedUpdates);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Onboarding
  app.post("/api/onboarding", requireAuth, async (req, res) => {
    try {
      const { responses } = req.body;
      const userId = req.session.userId;
      
      // Check if user has already completed onboarding
      const existingResponse = await storage.getOnboardingResponse(userId);
      if (existingResponse) {
        return res.status(400).json({ error: "Onboarding already completed" });
      }
      
      const riskScore = calculateRiskScore(responses);
      const baselineAnxietyLevel = determineRiskLevel(riskScore);

      const onboardingData = insertOnboardingResponseSchema.parse({
        userId,
        responses,
        riskScore,
        baselineAnxietyLevel,
      });

      const response = await storage.createOnboardingResponse(onboardingData);
      res.json({ response });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/onboarding/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const response = await storage.getOnboardingResponse(userId);
      res.json({ response });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Weekly assessments
  app.post("/api/assessments", requireAuth, async (req, res) => {
    try {
      const { weekNumber, responses } = req.body;
      const userId = req.session.userId;
      const riskScore = calculateRiskScore(responses);
      const riskLevel = determineRiskLevel(riskScore);
      const needsEscalation = riskLevel === "crisis" || riskLevel === "high";

      const assessmentData = insertWeeklyAssessmentSchema.parse({
        userId,
        weekNumber,
        responses,
        riskScore,
        riskLevel,
        needsEscalation,
      });

      const assessment = await storage.createWeeklyAssessment(assessmentData);
      res.json({ assessment });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/assessments/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const assessments = await storage.getWeeklyAssessments(userId);
      res.json({ assessments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/assessments/:userId/latest", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const assessment = await storage.getLatestWeeklyAssessment(userId);
      res.json({ assessment });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Anxiety modules
  app.get("/api/modules/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      let modules = await storage.getAnxietyModules(userId);
      
      // Initialize modules if none exist
      if (modules.length === 0) {
        await storage.initializeAnxietyModules(userId);
        modules = await storage.getAnxietyModules(userId);
      }
      
      res.json({ modules });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/modules/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Verify the module belongs to the authenticated user
      const module = await storage.getAnxietyModules(req.session.userId);
      const targetModule = module.find(m => m.id === id);
      if (!targetModule) {
        return res.status(403).json({ error: "Forbidden: Module not found or access denied" });
      }
      
      const updatedModule = await storage.updateAnxietyModule(id, updates);
      res.json({ module: updatedModule });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Dashboard data
  app.get("/api/dashboard/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      
      const modules = await storage.getAnxietyModules(userId);
      const latestAssessment = await storage.getLatestWeeklyAssessment(userId);
      const onboarding = await storage.getOnboardingResponse(userId);

      const totalMinutes = modules.reduce((sum, module) => sum + (module.minutesCompleted || 0), 0);
      const totalEstimatedMinutes = modules.reduce((sum, module) => sum + module.estimatedMinutes, 0);
      const completionRate = totalEstimatedMinutes > 0 ? Math.round((totalMinutes / totalEstimatedMinutes) * 100) : 0;
      
      const currentWeek = modules.filter(m => !m.isLocked && m.completedAt).length + 1;
      
      const dashboardData = {
        currentWeek: Math.min(currentWeek, 6),
        riskLevel: latestAssessment?.riskLevel || onboarding?.baselineAnxietyLevel || "unknown",
        completionRate,
        totalMinutes,
        nextCheckInDue: latestAssessment ? 
          new Date(latestAssessment.completedAt!.getTime() + 7 * 24 * 60 * 60 * 1000) : 
          new Date(),
      };

      res.json({ dashboardData });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Progress report generation
  app.post("/api/reports", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      
      const user = await storage.getUser(userId);
      const onboarding = await storage.getOnboardingResponse(userId);
      const assessments = await storage.getWeeklyAssessments(userId);
      const modules = await storage.getAnxietyModules(userId);

      if (!user || !onboarding) {
        return res.status(404).json({ error: "User data not found" });
      }

      const reportData = {
        user,
        onboarding,
        assessments,
        modules,
        generatedAt: new Date(),
      };

      const report = await storage.createProgressReport({
        userId,
        reportData,
      });

      res.json({ report });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Thought Records API
  app.post("/api/thought-records", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { situation, emotion, intensity, physicalSensations, automaticThought, evidenceFor, evidenceAgainst, balancedThought, newEmotion, newIntensity, actionPlan, selectedDistortions } = req.body;
      
      // Debug log to help diagnose auth/body issues
      console.log('[POST /api/thought-records] userId:', userId, 'body keys:', Object.keys(req.body || {}));
      
      const thoughtRecord = await storage.createThoughtRecord({
        userId,
        situation,
        emotion,
        intensity,
        physicalSensations,
        automaticThought,
        evidenceFor,
        evidenceAgainst,
        balancedThought,
        newEmotion,
        newIntensity,
        actionPlan,
        selectedDistortions
      });

      res.json(thoughtRecord);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/thought-records/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const thoughtRecords = await storage.getThoughtRecords(userId);
      res.json(thoughtRecords);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/thought-records/single/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const thoughtRecord = await storage.getThoughtRecord(id);
      
      if (!thoughtRecord) {
        return res.status(404).json({ error: "Thought record not found" });
      }
      
      res.json(thoughtRecord);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/thought-records/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const thoughtRecord = await storage.updateThoughtRecord(id, updates);
      res.json(thoughtRecord);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/thought-records/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteThoughtRecord(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Risk calculation functions (shared with frontend)
function calculateRiskScore(responses: any): number {
  // PHQ-4 based scoring (0-12 scale)
  // Questions about anxiety and depression frequency
  let score = 0;
  
  if (responses.anxietyFrequency !== undefined) score += parseInt(responses.anxietyFrequency);
  if (responses.worryFrequency !== undefined) score += parseInt(responses.worryFrequency);
  if (responses.depressionFrequency !== undefined) score += parseInt(responses.depressionFrequency);
  if (responses.anhedoniaFrequency !== undefined) score += parseInt(responses.anhedoniaFrequency);
  
  // Additional factors
  if (responses.sleepQuality === "poor") score += 1;
  if (responses.suicidalThoughts === "yes") score += 5; // Major escalation factor
  if (responses.selfHarm === "yes") score += 3;
  if (responses.substanceUse === "increased") score += 2;
  
  return Math.min(score, 15); // Cap at 15 for our scale
}

function determineRiskLevel(score: number): string {
  if (score >= 12) return "crisis";
  if (score >= 8) return "high";
  if (score >= 5) return "moderate";
  return "low";
}
