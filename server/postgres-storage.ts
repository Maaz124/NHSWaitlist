import { eq, desc, and } from "drizzle-orm";
import { db, schema } from "./db";

// Check if database is available
if (!db) {
  throw new Error("Database connection not available. Please set DATABASE_URL environment variable.");
}

// Utility function to safely convert string dates to Date objects
function safeParseDates(obj: any, dateFields: string[]): any {
  const result = { ...obj };
  
  dateFields.forEach(field => {
    if (result[field] && typeof result[field] === 'string') {
      try {
        result[field] = new Date(result[field]);
      } catch (error) {
        console.warn(`Failed to parse date field ${field}:`, result[field]);
        delete result[field]; // Remove invalid date fields
      }
    }
  });
  
  return result;
}
import { 
  type User, 
  type InsertUser, 
  type OnboardingResponse, 
  type InsertOnboardingResponse, 
  type WeeklyAssessment, 
  type InsertWeeklyAssessment, 
  type AnxietyModule, 
  type InsertAnxietyModule, 
  type ProgressReport, 
  type InsertProgressReport,
  type ThoughtRecord,
  type InsertThoughtRecord,
  type MoodEntry,
  type InsertMoodEntry
} from "@shared/schema";
import { IStorage } from "./storage";

export class PostgresStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(schema.users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const result = await db.update(schema.users).set(updates).where(eq(schema.users.id, id)).returning();
    if (result.length === 0) throw new Error("User not found");
    return result[0];
  }

  // Onboarding
  async createOnboardingResponse(insertResponse: InsertOnboardingResponse): Promise<OnboardingResponse> {
    const processedResponse = safeParseDates(insertResponse, ['completedAt']);
    const result = await db.insert(schema.onboardingResponses).values(processedResponse).returning();
    return result[0];
  }

  async getOnboardingResponse(userId: string): Promise<OnboardingResponse | undefined> {
    const result = await db.select().from(schema.onboardingResponses).where(eq(schema.onboardingResponses.userId, userId)).limit(1);
    return result[0];
  }

  // Weekly assessments
  async createWeeklyAssessment(insertAssessment: InsertWeeklyAssessment): Promise<WeeklyAssessment> {
    const processedAssessment = safeParseDates(insertAssessment, ['completedAt']);
    const result = await db.insert(schema.weeklyAssessments).values(processedAssessment).returning();
    return result[0];
  }

  async getWeeklyAssessments(userId: string): Promise<WeeklyAssessment[]> {
    return await db.select().from(schema.weeklyAssessments)
      .where(eq(schema.weeklyAssessments.userId, userId))
      .orderBy(desc(schema.weeklyAssessments.weekNumber));
  }

  async getLatestWeeklyAssessment(userId: string): Promise<WeeklyAssessment | undefined> {
    const result = await db.select().from(schema.weeklyAssessments)
      .where(eq(schema.weeklyAssessments.userId, userId))
      .orderBy(desc(schema.weeklyAssessments.weekNumber))
      .limit(1);
    return result[0];
  }

  // Anxiety modules
  async createAnxietyModule(insertModule: InsertAnxietyModule): Promise<AnxietyModule> {
    const result = await db.insert(schema.anxietyModules).values(insertModule).returning();
    return result[0];
  }

  async getAnxietyModules(userId: string): Promise<AnxietyModule[]> {
    return await db.select().from(schema.anxietyModules)
      .where(eq(schema.anxietyModules.userId, userId))
      .orderBy(schema.anxietyModules.weekNumber);
  }

  async updateAnxietyModule(id: string, updates: Partial<AnxietyModule>): Promise<AnxietyModule> {
    const processedUpdates = safeParseDates(updates, ['completedAt', 'lastAccessedAt']);
    
    const result = await db.update(schema.anxietyModules)
      .set({ ...processedUpdates, lastAccessedAt: new Date() })
      .where(eq(schema.anxietyModules.id, id))
      .returning();
    if (result.length === 0) throw new Error("Module not found");
    return result[0];
  }

  async initializeAnxietyModules(userId: string): Promise<void> {
    const defaultModules = [
      {
        userId,
        weekNumber: 1,
        title: "Understanding Anxiety",
        description: "Learn what anxiety is, how it affects your body and mind, and why it happens. Build your foundation for recovery.",
        estimatedMinutes: 45,
        activitiesTotal: 4,
        activitiesCompleted: 0,
        minutesCompleted: 0,
        isLocked: false,
      },
      {
        userId,
        weekNumber: 2,
        title: "Breathing & Relaxation",
        description: "Master practical breathing techniques and progressive muscle relaxation to manage physical anxiety symptoms.",
        estimatedMinutes: 38,
        activitiesTotal: 5,
        activitiesCompleted: 0,
        minutesCompleted: 0,
        isLocked: false,
      },
      {
        userId,
        weekNumber: 3,
        title: "Cognitive Strategies",
        description: "Learn to identify and challenge anxious thoughts with cognitive behavioral techniques.",
        estimatedMinutes: 40,
        activitiesTotal: 3,
        activitiesCompleted: 0,
        minutesCompleted: 0,
        isLocked: false,
      },
      {
        userId,
        weekNumber: 4,
        title: "Mindfulness & Grounding",
        description: "Develop mindfulness skills and grounding techniques to stay present during anxious moments.",
        estimatedMinutes: 35,
        activitiesTotal: 4,
        activitiesCompleted: 0,
        minutesCompleted: 0,
        isLocked: false,
      },
      {
        userId,
        weekNumber: 5,
        title: "Behavioral Activation",
        description: "Build healthy routines and gradually expose yourself to anxiety-provoking situations in a safe way.",
        estimatedMinutes: 42,
        activitiesTotal: 4,
        activitiesCompleted: 0,
        minutesCompleted: 0,
        isLocked: false,
      },
      {
        userId,
        weekNumber: 6,
        title: "Relapse Prevention",
        description: "Create your personal toolkit for maintaining progress and preparing for NHS transition.",
        estimatedMinutes: 30,
        activitiesTotal: 4,
        activitiesCompleted: 0,
        minutesCompleted: 0,
        isLocked: false,
      },
    ];

    for (const moduleData of defaultModules) {
      await this.createAnxietyModule(moduleData);
    }
  }

  // Progress reports
  async createProgressReport(insertReport: InsertProgressReport): Promise<ProgressReport> {
    const result = await db.insert(schema.progressReports).values(insertReport).returning();
    return result[0];
  }

  async getProgressReports(userId: string): Promise<ProgressReport[]> {
    return await db.select().from(schema.progressReports)
      .where(eq(schema.progressReports.userId, userId))
      .orderBy(desc(schema.progressReports.generatedAt));
  }

  // Thought records
  async createThoughtRecord(insertRecord: InsertThoughtRecord): Promise<ThoughtRecord> {
    const result = await db.insert(schema.thoughtRecords).values(insertRecord).returning();
    return result[0];
  }

  async getThoughtRecords(userId: string): Promise<ThoughtRecord[]> {
    return await db.select().from(schema.thoughtRecords)
      .where(eq(schema.thoughtRecords.userId, userId))
      .orderBy(desc(schema.thoughtRecords.createdAt));
  }

  async getThoughtRecord(id: string): Promise<ThoughtRecord | null> {
    const result = await db.select().from(schema.thoughtRecords)
      .where(eq(schema.thoughtRecords.id, id))
      .limit(1);
    return result[0] || null;
  }

  async updateThoughtRecord(id: string, updates: Partial<InsertThoughtRecord>): Promise<ThoughtRecord> {
    const result = await db.update(schema.thoughtRecords)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.thoughtRecords.id, id))
      .returning();
    return result[0];
  }

  async deleteThoughtRecord(id: string): Promise<void> {
    await db.delete(schema.thoughtRecords).where(eq(schema.thoughtRecords.id, id));
  }

  // Mood Entries CRUD operations
  async createMoodEntry(insertEntry: InsertMoodEntry): Promise<MoodEntry> {
    const result = await db.insert(schema.moodEntries).values(insertEntry).returning();
    return result[0];
  }

  async getMoodEntries(userId: string): Promise<MoodEntry[]> {
    return await db.select().from(schema.moodEntries)
      .where(eq(schema.moodEntries.userId, userId))
      .orderBy(desc(schema.moodEntries.entryDate));
  }

  async getMoodEntry(id: string): Promise<MoodEntry | null> {
    const result = await db.select().from(schema.moodEntries)
      .where(eq(schema.moodEntries.id, id))
      .limit(1);
    return result[0] || null;
  }

  async getMoodEntryByDate(userId: string, entryDate: string): Promise<MoodEntry | null> {
    const result = await db.select().from(schema.moodEntries)
      .where(and(
        eq(schema.moodEntries.userId, userId),
        eq(schema.moodEntries.entryDate, entryDate)
      ))
      .limit(1);
    return result[0] || null;
  }

  async updateMoodEntry(id: string, updates: Partial<InsertMoodEntry>): Promise<MoodEntry> {
    const result = await db.update(schema.moodEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.moodEntries.id, id))
      .returning();
    return result[0];
  }

  async deleteMoodEntry(id: string): Promise<void> {
    await db.delete(schema.moodEntries).where(eq(schema.moodEntries.id, id));
  }
}
