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

  // Anxiety Guide methods
  async createAnxietyGuide(insertGuide: any): Promise<any> {
    const result = await db.insert(schema.anxietyGuides).values(insertGuide).returning();
    return result[0];
  }

  async getAnxietyGuide(userId: string): Promise<any | null> {
    const result = await db.select().from(schema.anxietyGuides)
      .where(eq(schema.anxietyGuides.userId, userId))
      .limit(1);
    return result[0] || null;
  }

  async updateAnxietyGuide(userId: string, updates: any): Promise<any> {
    // Check if guide exists
    const existing = await this.getAnxietyGuide(userId);
    if (existing) {
      // Update existing guide
      const result = await db.update(schema.anxietyGuides)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(schema.anxietyGuides.id, existing.id))
        .returning();
      return result[0];
    } else {
      // Create new guide
      const result = await db.insert(schema.anxietyGuides)
        .values({ userId, ...updates })
        .returning();
      return result[0];
    }
  }

  // Sleep Assessment methods
  async createSleepAssessment(insertAssessment: any): Promise<any> {
    // Flatten the nested data structure to match database schema
    const flattenedData = {
      userId: insertAssessment.userId,
      bedTime: insertAssessment.sleepAssessment?.bedTime || null,
      wakeTime: insertAssessment.sleepAssessment?.wakeTime || null,
      sleepLatency: insertAssessment.sleepAssessment?.sleepLatency || null,
      nightWakes: insertAssessment.sleepAssessment?.nightWakes || null,
      sleepQuality: insertAssessment.sleepAssessment?.sleepQuality || null,
      daytimeEnergy: insertAssessment.sleepAssessment?.daytimeEnergy || null,
      anxietyLevel: insertAssessment.sleepAssessment?.anxietyLevel || null,
      sleepEnvironment: insertAssessment.sleepAssessment?.sleepEnvironment || null,
      preSleepRoutine: insertAssessment.sleepAssessment?.preSleepRoutine || null,
      hindrances: insertAssessment.sleepAssessment?.hindrances || null,
      personalPlan: insertAssessment.personalPlan || null,
      additionalNotes: insertAssessment.additionalNotes || null,
      completedSections: insertAssessment.completedSections || null,
      progressData: insertAssessment.progressData || null
    };
    
    const result = await db.insert(schema.sleepAssessments).values(flattenedData).returning();
    return result[0];
  }

  async getSleepAssessment(userId: string): Promise<any | null> {
    console.log('🔍 getSleepAssessment called with userId:', userId);
    const result = await db.select().from(schema.sleepAssessments)
      .where(eq(schema.sleepAssessments.userId, userId))
      .limit(1);
    
    console.log('📥 Raw database result:', result[0]);
    
    if (!result[0]) return null;
    
    const assessment = result[0];
    
    // Return data in nested format that frontend expects
    const nestedData = {
      sleepAssessment: {
        bedTime: assessment.bedTime || '',
        wakeTime: assessment.wakeTime || '',
        sleepLatency: assessment.sleepLatency || 30,
        nightWakes: assessment.nightWakes || 1,
        sleepQuality: assessment.sleepQuality || 5,
        daytimeEnergy: assessment.daytimeEnergy || 5,
        anxietyLevel: assessment.anxietyLevel || 5,
        sleepEnvironment: assessment.sleepEnvironment || [],
        preSleepRoutine: assessment.preSleepRoutine || [],
        hindrances: assessment.hindrances || []
      },
      personalPlan: assessment.personalPlan || [],
      personalNotes: assessment.personalNotes || {},
      additionalNotes: assessment.additionalNotes || '',
      completedSections: assessment.completedSections || [],
      progressData: assessment.progressData || {}
    };
    
    console.log('📤 Returning nested data:', nestedData);
    return nestedData;
  }

  async updateSleepAssessment(userId: string, updates: any): Promise<any> {
    console.log('🔄 updateSleepAssessment called with:', { userId, updates });
    console.log('🔄 personalNotes in updates:', updates.personalNotes);
    console.log('🔄 personalNotes[section0]:', updates.personalNotes?.section0);
    // Flatten the nested data structure to match database schema
    const flattenedData = {
      bedTime: updates.sleepAssessment?.bedTime || null,
      wakeTime: updates.sleepAssessment?.wakeTime || null,
      sleepLatency: updates.sleepAssessment?.sleepLatency || null,
      nightWakes: updates.sleepAssessment?.nightWakes || null,
      sleepQuality: updates.sleepAssessment?.sleepQuality || null,
      daytimeEnergy: updates.sleepAssessment?.daytimeEnergy || null,
      anxietyLevel: updates.sleepAssessment?.anxietyLevel || null,
      sleepEnvironment: updates.sleepAssessment?.sleepEnvironment || null,
      preSleepRoutine: updates.sleepAssessment?.preSleepRoutine || null,
      hindrances: updates.sleepAssessment?.hindrances || null,
      personalPlan: updates.personalPlan || null,
      personalNotes: updates.personalNotes || null,
      additionalNotes: updates.additionalNotes || null,
      completedSections: updates.completedSections || null,
      progressData: updates.progressData || null,
      updatedAt: new Date()
    };

    console.log('📊 Flattened data:', flattenedData);

    // Check if assessment exists - get raw database record, not nested data
    const existing = await db.select().from(schema.sleepAssessments)
      .where(eq(schema.sleepAssessments.userId, userId))
      .limit(1);
    
    console.log('🔍 Existing assessment raw record:', existing[0]);
    
    if (existing && existing.length > 0) {
      // Update existing assessment
      const existingRecord = existing[0];
      console.log('📝 Updating existing assessment with ID:', existingRecord.id);
      try {
        const result = await db.update(schema.sleepAssessments)
          .set(flattenedData)
          .where(eq(schema.sleepAssessments.id, existingRecord.id))
          .returning();
        
        console.log('✅ Update result:', result);
        
        if (result && result.length > 0) {
          return result[0];
        } else {
          console.log('⚠️ Update returned empty result, fetching updated record');
          // If update doesn't return data, fetch the updated record
          const updated = await this.getSleepAssessment(userId);
          return updated || existingRecord;
        }
      } catch (error) {
        console.error('❌ Update failed:', error);
        throw error;
      }
    } else {
      // Create new assessment
      console.log('🆕 Creating new assessment');
      try {
        const result = await db.insert(schema.sleepAssessments)
          .values({ userId, ...flattenedData })
          .returning();
        
        console.log('✅ Insert result:', result);
        return result[0];
      } catch (error) {
        console.error('❌ Insert failed:', error);
        throw error;
      }
    }
  }

  // Lifestyle Assessment methods
  async createLifestyleAssessment(insertAssessment: any): Promise<any> {
    // Flatten the nested data structure to match database schema
    const flattenedData = {
      userId: insertAssessment.userId,
      exerciseFrequency: insertAssessment.assessment?.exerciseFrequency || null,
      exerciseTypes: insertAssessment.assessment?.exerciseTypes || null,
      dietQuality: insertAssessment.assessment?.dietQuality || null,
      socialConnections: insertAssessment.assessment?.socialConnections || null,
      stressManagement: insertAssessment.assessment?.stressManagement || null,
      sleepQuality: insertAssessment.assessment?.sleepQuality || null,
      screenTime: insertAssessment.assessment?.screenTime || null,
      outdoorTime: insertAssessment.assessment?.outdoorTime || null,
      hobbies: insertAssessment.assessment?.hobbies || null,
      barriers: insertAssessment.assessment?.barriers || null,
      eatingHabits: insertAssessment.assessment?.eatingHabits || null,
      nutritionChallenges: insertAssessment.assessment?.nutritionChallenges || null,
      socialSupport: insertAssessment.assessment?.socialSupport || null,
      socialChallenges: insertAssessment.assessment?.socialChallenges || null,
      personalGoals: insertAssessment.personalGoals || null,
      personalNotes: insertAssessment.personalNotes || null,
      completedSections: insertAssessment.completedSections || null,
      progressData: insertAssessment.progressData || null
    };
    
    const result = await db.insert(schema.lifestyleAssessments).values(flattenedData).returning();
    return result[0];
  }

  async getLifestyleAssessment(userId: string): Promise<any | null> {
    console.log('🔍 getLifestyleAssessment called with userId:', userId);
    const result = await db.select().from(schema.lifestyleAssessments)
      .where(eq(schema.lifestyleAssessments.userId, userId))
      .limit(1);
    
    console.log('📥 Raw database result:', result[0]);
    
    if (!result[0]) return null;
    
    const assessment = result[0];
    
    // Return data in nested format that frontend expects
    const nestedData = {
      assessment: {
        exerciseFrequency: assessment.exerciseFrequency || 2,
        exerciseTypes: assessment.exerciseTypes || [],
        dietQuality: assessment.dietQuality || 5,
        socialConnections: assessment.socialConnections || 5,
        stressManagement: assessment.stressManagement || [],
        sleepQuality: assessment.sleepQuality || 5,
        screenTime: assessment.screenTime || 6,
        outdoorTime: assessment.outdoorTime || 1,
        hobbies: assessment.hobbies || [],
        barriers: assessment.barriers || [],
        eatingHabits: assessment.eatingHabits || [],
        nutritionChallenges: assessment.nutritionChallenges || [],
        socialSupport: assessment.socialSupport || [],
        socialChallenges: assessment.socialChallenges || []
      },
      personalGoals: assessment.personalGoals || [],
      personalNotes: assessment.personalNotes || {},
      completedSections: assessment.completedSections || [],
      progressData: assessment.progressData || {}
    };
    
    console.log('📤 Returning nested data:', nestedData);
    return nestedData;
  }

  async updateLifestyleAssessment(userId: string, updates: any): Promise<any> {
    console.log('🔄 updateLifestyleAssessment called with:', { userId, updates });
    console.log('🔄 personalNotes in updates:', updates.personalNotes);
    console.log('🔄 personalNotes[section0]:', updates.personalNotes?.section0);
    console.log('🔄 assessment in updates:', updates.assessment);
    console.log('🔄 eatingHabits in updates:', updates.assessment?.eatingHabits);
    console.log('🔄 eatingHabits length in updates:', updates.assessment?.eatingHabits?.length);
    console.log('🔄 nutritionChallenges in updates:', updates.assessment?.nutritionChallenges);
    console.log('🔄 nutritionChallenges length in updates:', updates.assessment?.nutritionChallenges?.length);
    console.log('🔄 socialSupport in updates:', updates.assessment?.socialSupport);
    console.log('🔄 socialSupport length in updates:', updates.assessment?.socialSupport?.length);
    console.log('🔄 socialChallenges in updates:', updates.assessment?.socialChallenges);
    console.log('🔄 socialChallenges length in updates:', updates.assessment?.socialChallenges?.length);
    
    // Flatten the nested data structure to match database schema
    const flattenedData = {
      exerciseFrequency: updates.assessment?.exerciseFrequency || null,
      exerciseTypes: updates.assessment?.exerciseTypes || null,
      dietQuality: updates.assessment?.dietQuality || null,
      socialConnections: updates.assessment?.socialConnections || null,
      stressManagement: updates.assessment?.stressManagement || null,
      sleepQuality: updates.assessment?.sleepQuality || null,
      screenTime: updates.assessment?.screenTime || null,
      outdoorTime: updates.assessment?.outdoorTime || null,
      hobbies: updates.assessment?.hobbies || null,
      barriers: updates.assessment?.barriers || null,
      eatingHabits: updates.assessment?.eatingHabits || null,
      nutritionChallenges: updates.assessment?.nutritionChallenges || null,
      socialSupport: updates.assessment?.socialSupport || null,
      socialChallenges: updates.assessment?.socialChallenges || null,
      personalGoals: updates.personalGoals || null,
      personalNotes: updates.personalNotes || null,
      completedSections: updates.completedSections || null,
      progressData: updates.progressData || null,
      updatedAt: new Date()
    };

    console.log('📊 Flattened data:', flattenedData);

    // Check if assessment exists - get raw database record, not nested data
    const existing = await db.select().from(schema.lifestyleAssessments)
      .where(eq(schema.lifestyleAssessments.userId, userId))
      .limit(1);
    
    console.log('🔍 Existing assessment raw record:', existing[0]);
    
    if (existing && existing.length > 0) {
      // Update existing assessment
      const existingRecord = existing[0];
      console.log('📝 Updating existing assessment with ID:', existingRecord.id);
      try {
        const result = await db.update(schema.lifestyleAssessments)
          .set(flattenedData)
          .where(eq(schema.lifestyleAssessments.id, existingRecord.id))
          .returning();
        
        console.log('✅ Update result:', result);
        
        if (result && result.length > 0) {
          return result[0];
        } else {
          console.log('⚠️ Update returned empty result, fetching updated record');
          // If update doesn't return data, fetch the updated record
          const updated = await this.getLifestyleAssessment(userId);
          return updated || existingRecord;
        }
      } catch (error) {
        console.error('❌ Update failed:', error);
        throw error;
      }
    } else {
      // Create new assessment
      console.log('🆕 Creating new assessment');
      try {
        const result = await db.insert(schema.lifestyleAssessments)
          .values({ userId, ...flattenedData })
          .returning();
        
        console.log('✅ Insert result:', result);
        return result[0];
      } catch (error) {
        console.error('❌ Insert failed:', error);
        throw error;
      }
    }
  }
}
