import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertOnboardingResponseSchema, insertWeeklyAssessmentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  app.get("/api/users/:userId", async (req, res) => {
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

  app.patch("/api/users/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      const user = await storage.updateUser(userId, updates);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Onboarding
  app.post("/api/onboarding", async (req, res) => {
    try {
      const { userId, responses } = req.body;
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

  app.get("/api/onboarding/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const response = await storage.getOnboardingResponse(userId);
      res.json({ response });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Weekly assessments
  app.post("/api/assessments", async (req, res) => {
    try {
      const { userId, weekNumber, responses } = req.body;
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

  app.get("/api/assessments/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const assessments = await storage.getWeeklyAssessments(userId);
      res.json({ assessments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/assessments/:userId/latest", async (req, res) => {
    try {
      const { userId } = req.params;
      const assessment = await storage.getLatestWeeklyAssessment(userId);
      res.json({ assessment });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Anxiety modules
  app.get("/api/modules/:userId", async (req, res) => {
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

  app.patch("/api/modules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const module = await storage.updateAnxietyModule(id, updates);
      res.json({ module });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Dashboard data
  app.get("/api/dashboard/:userId", async (req, res) => {
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
  app.post("/api/reports", async (req, res) => {
    try {
      const { userId } = req.body;
      
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
