import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean, date, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phoneNumber: text("phone_number"),
  nhsNumber: text("nhs_number"),
  hasPaid: boolean("has_paid").default(false),
  paidAmount: integer("paid_amount").default(0), // Amount in cents (e.g., 14900 = $149.00)
  paidCurrency: text("paid_currency").default("usd"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const onboardingResponses = pgTable("onboarding_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  responses: jsonb("responses").notNull(), // Store all questionnaire responses
  riskScore: integer("risk_score").notNull(),
  baselineAnxietyLevel: text("baseline_anxiety_level").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const weeklyAssessments = pgTable("weekly_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  weekNumber: integer("week_number").notNull(),
  responses: jsonb("responses").notNull(), // PHQ-4 and additional questions
  riskScore: integer("risk_score").notNull(),
  riskLevel: text("risk_level").notNull(), // "low", "moderate", "high", "crisis"
  needsEscalation: boolean("needs_escalation").default(false),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const anxietyModules = pgTable("anxiety_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  weekNumber: integer("week_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull(),
  activitiesTotal: integer("activities_total").notNull(),
  activitiesCompleted: integer("activities_completed").default(0),
  minutesCompleted: integer("minutes_completed").default(0),
  isLocked: boolean("is_locked").default(true),
  completedAt: timestamp("completed_at"),
  lastAccessedAt: timestamp("last_accessed_at"),
  contentData: jsonb("content_data"), // Detailed module content, activities, and exercises
  userProgress: jsonb("user_progress"), // User notes, reflections, completed activities
});

export const moduleActivities = pgTable("module_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").references(() => anxietyModules.id).notNull(),
  activityType: text("activity_type").notNull(), // "reading", "exercise", "reflection", "breathing", "worksheet"
  title: text("title").notNull(),
  description: text("description"),
  content: jsonb("content").notNull(), // Activity-specific content and instructions
  estimatedMinutes: integer("estimated_minutes").notNull(),
  orderIndex: integer("order_index").notNull(),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  userResponse: jsonb("user_response"), // User inputs, answers, reflections
});

export const progressReports = pgTable("progress_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  reportData: jsonb("report_data").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
});

export const thoughtRecords = pgTable("thought_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  situation: text("situation").notNull(),
  emotion: text("emotion").notNull(),
  intensity: integer("intensity").notNull(), // 1-10 scale
  physicalSensations: text("physical_sensations"),
  automaticThought: text("automatic_thought"),
  evidenceFor: text("evidence_for"),
  evidenceAgainst: text("evidence_against"),
  balancedThought: text("balanced_thought"),
  newEmotion: text("new_emotion"),
  newIntensity: integer("new_intensity"), // 1-10 scale
  actionPlan: text("action_plan"),
  selectedDistortions: jsonb("selected_distortions"), // Array of cognitive distortion names
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const weeklyThoughtRecords = pgTable("weekly_thought_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  moduleId: varchar("module_id").references(() => anxietyModules.id).notNull(),
  weekNumber: integer("week_number").notNull(),
  situation: text("situation").notNull(),
  emotion: text("emotion").notNull(),
  intensity: integer("intensity").notNull(), // 1-10 scale
  physicalSensations: text("physical_sensations"),
  automaticThought: text("automatic_thought"),
  evidenceFor: text("evidence_for"),
  evidenceAgainst: text("evidence_against"),
  balancedThought: text("balanced_thought"),
  newEmotion: text("new_emotion"),
  newIntensity: integer("new_intensity"), // 1-10 scale
  actionPlan: text("action_plan"),
  selectedDistortions: jsonb("selected_distortions"), // Array of cognitive distortion names
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const moodEntries = pgTable("mood_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  entryDate: date("entry_date").notNull(), // The date this mood entry is for
  mood: integer("mood").notNull(), // 1-10 scale
  energy: integer("energy").notNull(), // 1-10 scale
  anxiety: integer("anxiety").notNull(), // 1-10 scale
  sleep: integer("sleep").notNull(), // 1-10 scale
  emotions: jsonb("emotions"), // Array of emotion strings
  activities: jsonb("activities"), // Array of activity strings
  thoughts: text("thoughts"),
  gratitude: jsonb("gratitude"), // Array of gratitude strings
  challenges: text("challenges"),
  wins: text("wins"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const anxietyGuides = pgTable("anxiety_guides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  completedSections: jsonb("completed_sections"), // Array of completed section IDs
  personalNotes: jsonb("personal_notes"), // Object with section notes
  symptomChecklist: jsonb("symptom_checklist"), // Object with checked symptoms
  copingToolsRating: jsonb("coping_tools_rating"), // Object with tool ratings
  worksheetEntries: jsonb("worksheet_entries"), // Array of worksheet entries
  quizAnswers: jsonb("quiz_answers"), // Object with quiz responses
  actionPlanData: jsonb("action_plan_data"), // Object with selected goals and notes
  symptomTrackingWorksheet: jsonb("symptom_tracking_worksheet"), // Object with symptoms and triggers
  personalManagementPlan: jsonb("personal_management_plan"), // Object with strategies, goals, and warning signs
  progressData: jsonb("progress_data"), // Overall progress tracking
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sleepAssessments = pgTable("sleep_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  bedTime: varchar("bed_time"), // Time format
  wakeTime: varchar("wake_time"), // Time format
  sleepLatency: integer("sleep_latency"), // Minutes
  nightWakes: integer("night_wakes"),
  sleepQuality: integer("sleep_quality"), // 1-10 scale
  daytimeEnergy: integer("daytime_energy"), // 1-10 scale
  anxietyLevel: integer("anxiety_level"), // 1-10 scale
  sleepEnvironment: jsonb("sleep_environment"), // Array of selected items
  preSleepRoutine: jsonb("pre_sleep_routine"), // Array of selected items
  hindrances: jsonb("hindrances"), // Array of selected items
  personalPlan: jsonb("personal_plan"), // Array of action plan items
  personalNotes: jsonb("personal_notes"), // Object with section notes
  additionalNotes: text("additional_notes"),
  completedSections: jsonb("completed_sections"), // Array of completed section IDs
  progressData: jsonb("progress_data"), // Overall progress tracking
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const lifestyleAssessments = pgTable("lifestyle_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  exerciseFrequency: decimal("exercise_frequency", { precision: 3, scale: 1 }), // 0-7 days per week
  exerciseTypes: jsonb("exercise_types"), // Array of activity types
  dietQuality: decimal("diet_quality", { precision: 3, scale: 1 }), // 1-10 scale
  socialConnections: decimal("social_connections", { precision: 3, scale: 1 }), // 1-10 scale
  stressManagement: jsonb("stress_management"), // Array of techniques
  sleepQuality: decimal("sleep_quality", { precision: 3, scale: 1 }), // 1-10 scale
  screenTime: decimal("screen_time", { precision: 4, scale: 1 }), // Hours per day
  outdoorTime: decimal("outdoor_time", { precision: 3, scale: 1 }), // Hours per day
  hobbies: jsonb("hobbies"), // Array of hobbies
  barriers: jsonb("barriers"), // Array of barriers
  eatingHabits: jsonb("eating_habits"), // Array of eating habits
  nutritionChallenges: jsonb("nutrition_challenges"), // Array of nutrition challenges
  socialSupport: jsonb("social_support"), // Array of social support types
  socialChallenges: jsonb("social_challenges"), // Array of social challenges
  personalGoals: jsonb("personal_goals"), // Array of user goals
  personalNotes: jsonb("personal_notes"), // Object with section notes
  completedSections: jsonb("completed_sections"), // Array of completed section IDs
  progressData: jsonb("progress_data"), // Overall progress tracking
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Billing tables for Stripe integration
export const paymentPlans = pgTable("payment_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  priceAmount: integer("price_amount").notNull(), // amount in smallest unit (e.g., cents)
  currency: varchar("currency", { length: 3 }).default("usd"),
  intervalType: varchar("interval_type", { length: 20 }), // 'month' | 'year' | 'one_time'
  intervalCount: integer("interval_count").default(1),
  stripePriceId: varchar("stripe_price_id"),
  stripeProductId: varchar("stripe_product_id"),
  isActive: boolean("is_active").default(true),
  features: jsonb("features"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planId: varchar("plan_id").references(() => paymentPlans.id).notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id").unique(),
  stripeCustomerId: varchar("stripe_customer_id"),
  status: varchar("status", { length: 20 }).notNull(), // 'active' | 'canceled' | 'past_due' | 'incomplete'
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const paymentTransactions = pgTable("payment_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  subscriptionId: varchar("subscription_id").references(() => userSubscriptions.id),
  stripePaymentIntentId: varchar("stripe_payment_intent_id").unique(),
  stripeInvoiceId: varchar("stripe_invoice_id"),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("usd"),
  status: varchar("status", { length: 20 }).notNull(), // 'succeeded' | 'failed' | 'processing'
  paymentMethod: varchar("payment_method", { length: 50 }),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPaymentMethods = pgTable("user_payment_methods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  stripePaymentMethodId: varchar("stripe_payment_method_id").unique(),
  type: varchar("type", { length: 20 }).notNull(), // 'card' | 'bank_account'
  cardBrand: varchar("card_brand", { length: 20 }),
  cardLast4: varchar("card_last4", { length: 4 }),
  cardExpMonth: integer("card_exp_month"),
  cardExpYear: integer("card_exp_year"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertOnboardingResponseSchema = createInsertSchema(onboardingResponses).omit({ id: true, completedAt: true });
export const insertWeeklyAssessmentSchema = createInsertSchema(weeklyAssessments).omit({ id: true, completedAt: true });
export const insertAnxietyModuleSchema = createInsertSchema(anxietyModules).omit({ id: true, completedAt: true, lastAccessedAt: true });
export const insertLifestyleAssessmentSchema = createInsertSchema(lifestyleAssessments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSleepAssessmentSchema = createInsertSchema(sleepAssessments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertModuleActivitySchema = createInsertSchema(moduleActivities).omit({ id: true, completedAt: true });
export const insertProgressReportSchema = createInsertSchema(progressReports).omit({ id: true, generatedAt: true });
export const insertThoughtRecordSchema = createInsertSchema(thoughtRecords).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWeeklyThoughtRecordSchema = createInsertSchema(weeklyThoughtRecords).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAnxietyGuideSchema = createInsertSchema(anxietyGuides).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPaymentPlanSchema = createInsertSchema(paymentPlans).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({ id: true, createdAt: true });
export const insertUserPaymentMethodSchema = createInsertSchema(userPaymentMethods).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type OnboardingResponse = typeof onboardingResponses.$inferSelect;
export type InsertOnboardingResponse = z.infer<typeof insertOnboardingResponseSchema>;
export type WeeklyAssessment = typeof weeklyAssessments.$inferSelect;
export type InsertWeeklyAssessment = z.infer<typeof insertWeeklyAssessmentSchema>;
export type AnxietyModule = typeof anxietyModules.$inferSelect;
export type InsertAnxietyModule = z.infer<typeof insertAnxietyModuleSchema>;
export type ModuleActivity = typeof moduleActivities.$inferSelect;
export type InsertModuleActivity = z.infer<typeof insertModuleActivitySchema>;
export type ProgressReport = typeof progressReports.$inferSelect;
export type InsertProgressReport = z.infer<typeof insertProgressReportSchema>;
export type ThoughtRecord = typeof thoughtRecords.$inferSelect;
export type InsertThoughtRecord = z.infer<typeof insertThoughtRecordSchema>;
export type WeeklyThoughtRecord = typeof weeklyThoughtRecords.$inferSelect;
export type InsertWeeklyThoughtRecord = z.infer<typeof insertWeeklyThoughtRecordSchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type AnxietyGuide = typeof anxietyGuides.$inferSelect;
export type InsertAnxietyGuide = z.infer<typeof insertAnxietyGuideSchema>;
export type SleepAssessment = typeof sleepAssessments.$inferSelect;
export type InsertSleepAssessment = z.infer<typeof insertSleepAssessmentSchema>;
export type LifestyleAssessment = typeof lifestyleAssessments.$inferSelect;
export type InsertLifestyleAssessment = z.infer<typeof insertLifestyleAssessmentSchema>;
export type PaymentPlan = typeof paymentPlans.$inferSelect;
export type InsertPaymentPlan = z.infer<typeof insertPaymentPlanSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = z.infer<typeof insertPaymentTransactionSchema>;
export type UserPaymentMethod = typeof userPaymentMethods.$inferSelect;
export type InsertUserPaymentMethod = z.infer<typeof insertUserPaymentMethodSchema>;
