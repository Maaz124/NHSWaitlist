import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertOnboardingResponseSchema, insertWeeklyAssessmentSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

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
      console.log(`[POST /api/reports] Generating report for userId: ${userId}`);
      
      const user = await storage.getUser(userId);
      console.log(`[POST /api/reports] User found:`, user ? `${user.firstName} ${user.lastName}` : 'null');
      
      const onboarding = await storage.getOnboardingResponse(userId);
      console.log(`[POST /api/reports] Onboarding found:`, onboarding ? 'yes' : 'no');
      
      const assessments = await storage.getWeeklyAssessments(userId);
      console.log(`[POST /api/reports] Assessments found:`, assessments.length);
      
      const modules = await storage.getAnxietyModules(userId);
      console.log(`[POST /api/reports] Modules found:`, modules.length);

      if (!user) {
        console.error(`[POST /api/reports] User not found for userId: ${userId}`);
        return res.status(404).json({ error: "User not found" });
      }

      if (!onboarding) {
        console.error(`[POST /api/reports] Onboarding data not found for userId: ${userId}`);
        return res.status(404).json({ error: "Onboarding data not found. Please complete the initial assessment first." });
      }

      const reportData = {
        user,
        onboarding,
        assessments,
        modules,
        generatedAt: new Date(),
      };

      console.log(`[POST /api/reports] Creating progress report...`);
      const report = await storage.createProgressReport({
        userId,
        reportData,
      });

      console.log(`[POST /api/reports] Report created successfully with id: ${report.id}`);
      res.json({ report });
    } catch (error: any) {
      console.error(`[POST /api/reports] Error:`, error);
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

  // Weekly Thought Records API (for weekly modules)
  app.post("/api/weekly-thought-records", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { moduleId, weekNumber, situation, emotion, intensity, physicalSensations, automaticThought, evidenceFor, evidenceAgainst, balancedThought, newEmotion, newIntensity, actionPlan, selectedDistortions } = req.body;
      
      console.log('[POST /api/weekly-thought-records] userId:', userId, 'moduleId:', moduleId, 'weekNumber:', weekNumber);
      
      const thoughtRecord = await storage.createWeeklyThoughtRecord({
        userId,
        moduleId,
        weekNumber,
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

  app.get("/api/weekly-thought-records/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const { moduleId } = req.query;
      const thoughtRecords = await storage.getWeeklyThoughtRecords(userId, moduleId as string);
      res.json(thoughtRecords);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/weekly-thought-records/single/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const thoughtRecord = await storage.getWeeklyThoughtRecord(id);
      
      if (!thoughtRecord) {
        return res.status(404).json({ error: "Weekly thought record not found" });
      }
      
      res.json(thoughtRecord);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/weekly-thought-records/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const thoughtRecord = await storage.updateWeeklyThoughtRecord(id, updates);
      res.json(thoughtRecord);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/weekly-thought-records/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteWeeklyThoughtRecord(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Mood Entries API
  app.post("/api/mood-entries", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { entryDate, mood, energy, anxiety, sleep, emotions, activities, thoughts, gratitude, challenges, wins, notes } = req.body;
      
      console.log('📥 POST /api/mood-entries received data:', {
        emotions,
        activities,
        gratitude,
        userId,
        entryDate
      });
      
      const moodEntry = await storage.createMoodEntry({
        userId,
        entryDate,
        mood,
        energy,
        anxiety,
        sleep,
        emotions,
        activities,
        thoughts,
        gratitude,
        challenges,
        wins,
        notes
      });

      console.log('📤 POST /api/mood-entries returning:', {
        emotions: moodEntry.emotions,
        activities: moodEntry.activities,
        gratitude: moodEntry.gratitude
      });

      res.json(moodEntry);
    } catch (error: any) {
      console.error('❌ POST /api/mood-entries error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/mood-entries/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const moodEntries = await storage.getMoodEntries(userId);
      res.json(moodEntries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/mood-entries/date/:userId/:date", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId, date } = req.params;
      const moodEntry = await storage.getMoodEntryByDate(userId, date);
      res.json(moodEntry);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/mood-entries/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      console.log('📥 PATCH /api/mood-entries/:id received data:', {
        id,
        emotions: updates.emotions,
        activities: updates.activities,
        gratitude: updates.gratitude
      });
      
      const moodEntry = await storage.updateMoodEntry(id, updates);
      
      console.log('📤 PATCH /api/mood-entries/:id returning:', {
        emotions: moodEntry.emotions,
        activities: moodEntry.activities,
        gratitude: moodEntry.gratitude
      });
      
      res.json(moodEntry);
    } catch (error: any) {
      console.error('❌ PATCH /api/mood-entries/:id error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/mood-entries/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMoodEntry(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Anxiety Guide API
  app.get("/api/anxiety-guide/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const anxietyGuide = await storage.getAnxietyGuide(userId);
      res.json(anxietyGuide);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/anxiety-guide", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { completedSections, personalNotes, symptomChecklist, copingToolsRating, worksheetEntries, quizAnswers, progressData } = req.body;
      
      const anxietyGuide = await storage.createAnxietyGuide({
        userId,
        completedSections,
        personalNotes,
        symptomChecklist,
        copingToolsRating,
        worksheetEntries,
        quizAnswers,
        progressData
      });

      res.json(anxietyGuide);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/anxiety-guide/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      
      const anxietyGuide = await storage.updateAnxietyGuide(userId, updates);
      res.json(anxietyGuide);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Sleep Assessment API
  app.get("/api/sleep-assessment/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const sleepAssessment = await storage.getSleepAssessment(userId);
      res.json(sleepAssessment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sleep-assessment", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const assessmentData = req.body;
      
      const sleepAssessment = await storage.createSleepAssessment({
        userId,
        ...assessmentData
      });

      res.json(sleepAssessment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/sleep-assessment/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      
      const sleepAssessment = await storage.updateSleepAssessment(userId, updates);
      res.json(sleepAssessment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Lifestyle Assessment API
  app.get("/api/lifestyle-assessment/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const lifestyleAssessment = await storage.getLifestyleAssessment(userId);
      res.json(lifestyleAssessment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/lifestyle-assessment", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const assessmentData = req.body;
      
      const lifestyleAssessment = await storage.createLifestyleAssessment({
        userId,
        ...assessmentData
      });

      res.json(lifestyleAssessment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/lifestyle-assessment/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      
      const lifestyleAssessment = await storage.updateLifestyleAssessment(userId, updates);
      res.json(lifestyleAssessment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Payment Plans API
  app.get("/api/payment-plans", async (req, res) => {
    try {
      const plans = await storage.getPaymentPlans();
      res.json({ plans });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/payment-plans/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await storage.getPaymentPlan(id);
      
      if (!plan) {
        return res.status(404).json({ error: "Payment plan not found" });
      }
      
      res.json({ plan });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Checkout Session
  app.post("/api/payments/create-checkout-session", requireAuth, async (req, res) => {
    try {
      const { planId, successUrl, cancelUrl } = req.body;
      const userId = req.session.userId;
      
      if (!planId || !successUrl || !cancelUrl) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get the payment plan
      const plan = await storage.getPaymentPlan(planId);
      if (!plan) {
        return res.status(404).json({ error: "Payment plan not found" });
      }

      // Get user info
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create or get Stripe customer
      let customerId: string;
      const existingSubscriptions = await storage.getUserSubscriptions(userId);
      const existingSubscription = existingSubscriptions.find(sub => sub.stripeCustomerId);
      
      if (existingSubscription?.stripeCustomerId) {
        customerId = existingSubscription.stripeCustomerId;
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          metadata: {
            userId: userId,
          },
        });
        customerId = customer.id;
      }

      // Create checkout session
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        customer: customerId,
        payment_method_types: ['card'],
        mode: plan.intervalType === 'one_time' ? 'payment' : 'subscription',
        line_items: [
          {
            price_data: {
              currency: plan.currency,
              product_data: {
                name: plan.name,
                description: plan.description,
              },
              unit_amount: plan.priceAmount,
              ...(plan.intervalType !== 'one_time' && {
                recurring: {
                  interval: plan.intervalType === 'month' ? 'month' : 'year',
                  interval_count: plan.intervalCount,
                },
              }),
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: userId,
          planId: planId,
        },
      };

      const session = await stripe.checkout.sessions.create(sessionParams);
      
      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // User Subscriptions API
  app.get("/api/subscriptions/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const subscriptions = await storage.getUserSubscriptions(userId);
      res.json({ subscriptions });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/subscriptions/active/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const subscriptions = await storage.getUserSubscriptions(userId);
      const activeSubscription = subscriptions.find(sub => sub.status === 'active');
      res.json({ subscription: activeSubscription });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Payment Transactions API
  app.get("/api/payments/transactions/:userId", requireAuth, validateUserAccess, async (req, res) => {
    try {
      const { userId } = req.params;
      const transactions = await storage.getPaymentTransactions(userId);
      res.json({ transactions });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Simple payment status update endpoint
  app.post("/api/payments/update-status", requireAuth, async (req, res) => {
    try {
      const currentUserId = req.session.userId;
      
      if (!currentUserId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      // Get the active payment plan to get the amount
      const paymentPlans = await storage.getPaymentPlans();
      const activePlan = paymentPlans.find(plan => plan.isActive);
      const amount = activePlan?.priceAmount || 14900; // Default to $149.00
      
      // Simply mark user as paid using session userId
      await storage.markUserAsPaid(currentUserId, amount, 'usd');

      console.log(`✅ Payment status updated for user ${currentUserId}`);
      res.json({ 
        success: true, 
        message: "Payment status updated successfully"
      });
    } catch (error: any) {
      console.error('Payment status update error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Manual payment verification (for testing/admin use)
  app.post("/api/payments/manual-verify", requireAuth, async (req, res) => {
    try {
      const { userId, amount = 14900, description = "Manual payment verification" } = req.body;
      const currentUserId = req.session.userId;
      
      // For now, allow any authenticated user to verify their own payment
      // In production, you'd want admin-only access
      const targetUserId = userId || currentUserId;
      
      if (targetUserId !== currentUserId) {
        return res.status(403).json({ error: "Can only verify your own payments" });
      }

      // Create a manual payment transaction
      const transaction = await storage.createPaymentTransaction({
        userId: targetUserId,
        amount: amount,
        currency: 'usd',
        status: 'succeeded',
        paymentMethod: 'manual',
        description: description,
        metadata: { verified_by: currentUserId, verified_at: new Date().toISOString() }
      });

      // Mark user as paid
      await storage.markUserAsPaid(targetUserId, amount, 'usd');

      console.log(`✅ Manual payment verification for user ${targetUserId}:`, transaction);
      res.json({ 
        success: true, 
        message: "Payment verified successfully",
        transaction 
      });
    } catch (error: any) {
      console.error('Manual payment verification error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Webhook
  app.post("/api/webhooks/stripe", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      return res.status(400).json({ error: "Missing signature or webhook secret" });
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.rawBody || req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: "Invalid signature" });
    }

    try {
      console.log('Received Stripe webhook:', event.type);

      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.payment_succeeded':
          await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook handler error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Webhook handlers
  async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    if (!userId || !planId) {
      console.error('Missing metadata in checkout session:', session.id);
      return;
    }

    console.log(`Processing checkout session completion for user ${userId}, plan ${planId}`);

    if (session.mode === 'subscription' && session.subscription) {
      // Handle subscription
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      await storage.createUserSubscription({
        userId,
        planId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: session.customer as string,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : undefined,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
      });
      // Mark user as paid for subscription
      await storage.markUserAsPaid(userId, session.amount_total || 0, session.currency || 'usd');
    } else if (session.mode === 'payment') {
      // Handle one-time payment
      await storage.createPaymentTransaction({
        userId,
        stripePaymentIntentId: session.payment_intent as string,
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'succeeded',
        paymentMethod: 'card',
        description: session.metadata?.description || 'One-time payment',
      });
      // Mark user as paid for one-time payment
      await storage.markUserAsPaid(userId, session.amount_total || 0, session.currency || 'usd');
    }
  }

  async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const existingSubscription = await storage.getUserSubscriptionByStripeId(subscription.id);
    
    if (existingSubscription) {
      await storage.updateUserSubscription(existingSubscription.id, {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      });
    }
  }

  async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const existingSubscription = await storage.getUserSubscriptionByStripeId(subscription.id);
    
    if (existingSubscription) {
      await storage.updateUserSubscription(existingSubscription.id, {
        status: 'canceled',
      });
    }
  }

  async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    if (invoice.subscription && invoice.payment_intent) {
      const existingSubscription = await storage.getUserSubscriptionByStripeId(invoice.subscription as string);
      
      if (existingSubscription) {
        await storage.createPaymentTransaction({
          userId: existingSubscription.userId,
          subscriptionId: existingSubscription.id,
          stripePaymentIntentId: invoice.payment_intent as string,
          stripeInvoiceId: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: 'succeeded',
          paymentMethod: 'card',
          description: `Subscription payment - ${invoice.description || 'Monthly subscription'}`,
        });
      }
    }
  }

  async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    if (invoice.subscription && invoice.payment_intent) {
      const existingSubscription = await storage.getUserSubscriptionByStripeId(invoice.subscription as string);
      
      if (existingSubscription) {
        await storage.createPaymentTransaction({
          userId: existingSubscription.userId,
          subscriptionId: existingSubscription.id,
          stripePaymentIntentId: invoice.payment_intent as string,
          stripeInvoiceId: invoice.id,
          amount: invoice.amount_due,
          currency: invoice.currency,
          status: 'failed',
          paymentMethod: 'card',
          description: `Failed subscription payment - ${invoice.description || 'Monthly subscription'}`,
        });
      }
    }
  }

  // =====================================================
  // ADMIN API ENDPOINTS
  // =====================================================

  // Admin: Get user's Stripe transactions
  app.get("/api/admin/user/:userId/stripe-transactions", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Import the StripeAdminService
      const { StripeAdminService } = await import("./stripe-admin");
      
      // Sync and get transactions
      const result = await StripeAdminService.syncUserTransactions(userId, user.email);
      
      res.json({
        userId,
        email: user.email,
        syncedTransactions: result.synced,
        transactions: result.transactions,
      });
    } catch (error: any) {
      console.error('Error fetching user Stripe transactions:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Get all recent Stripe transactions
  app.get("/api/admin/stripe-transactions", requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      
      // Import the StripeAdminService
      const { StripeAdminService } = await import("./stripe-admin");
      
      const transactions = await StripeAdminService.getAllPaymentIntents(limit);
      
      res.json({
        total: transactions.length,
        transactions,
      });
    } catch (error: any) {
      console.error('Error fetching all Stripe transactions:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Sync specific user's transactions
  app.post("/api/admin/user/:userId/sync-stripe", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Import the StripeAdminService
      const { StripeAdminService } = await import("./stripe-admin");
      
      const result = await StripeAdminService.syncUserTransactions(userId, user.email);
      
      // Also update local database with the transactions
      for (const transaction of result.transactions) {
        try {
          await storage.createPaymentTransaction({
            userId,
            stripePaymentIntentId: transaction.id,
            amount: transaction.amount,
            currency: transaction.currency,
            status: transaction.status === 'succeeded' ? 'succeeded' : 'failed',
            paymentMethod: 'card',
            description: transaction.description || `Stripe ${transaction.type}`,
            metadata: {
              stripeType: transaction.type,
              stripeCreated: new Date(transaction.created * 1000).toISOString(),
              receiptUrl: transaction.receipt_url || undefined,
            },
          });
        } catch (dbError) {
          // Transaction might already exist, continue with others
          console.log(`Transaction ${transaction.id} might already exist in database`);
        }
      }
      
      res.json({
        message: "Transactions synced successfully",
        userId,
        syncedCount: result.synced,
        transactions: result.transactions,
      });
    } catch (error: any) {
      console.error('Error syncing user transactions:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Get user payment summary
  app.get("/api/admin/user/:userId/payment-summary", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get local transactions
      const localTransactions = await storage.getPaymentTransactions(userId);
      
      // Get Stripe transactions
      const { StripeAdminService } = await import("./stripe-admin");
      const stripeResult = await StripeAdminService.syncUserTransactions(userId, user.email);
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          hasPaid: user.hasPaid,
        },
        localTransactions: {
          count: localTransactions.length,
          transactions: localTransactions,
        },
        stripeTransactions: {
          count: stripeResult.synced,
          transactions: stripeResult.transactions,
        },
        summary: {
          totalLocalTransactions: localTransactions.length,
          totalStripeTransactions: stripeResult.synced,
          totalAmount: stripeResult.transactions.reduce((sum, t) => sum + t.amount, 0),
          lastTransaction: stripeResult.transactions[0] || null,
        }
      });
    } catch (error: any) {
      console.error('Error fetching payment summary:', error);
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
