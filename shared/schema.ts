import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  nhsNumber: text("nhs_number"),
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
});

export const progressReports = pgTable("progress_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  reportData: jsonb("report_data").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertOnboardingResponseSchema = createInsertSchema(onboardingResponses).omit({ id: true, completedAt: true });
export const insertWeeklyAssessmentSchema = createInsertSchema(weeklyAssessments).omit({ id: true, completedAt: true });
export const insertAnxietyModuleSchema = createInsertSchema(anxietyModules).omit({ id: true, completedAt: true, lastAccessedAt: true });
export const insertProgressReportSchema = createInsertSchema(progressReports).omit({ id: true, generatedAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type OnboardingResponse = typeof onboardingResponses.$inferSelect;
export type InsertOnboardingResponse = z.infer<typeof insertOnboardingResponseSchema>;
export type WeeklyAssessment = typeof weeklyAssessments.$inferSelect;
export type InsertWeeklyAssessment = z.infer<typeof insertWeeklyAssessmentSchema>;
export type AnxietyModule = typeof anxietyModules.$inferSelect;
export type InsertAnxietyModule = z.infer<typeof insertAnxietyModuleSchema>;
export type ProgressReport = typeof progressReports.$inferSelect;
export type InsertProgressReport = z.infer<typeof insertProgressReportSchema>;
