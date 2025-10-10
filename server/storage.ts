import { type User, type InsertUser, type OnboardingResponse, type InsertOnboardingResponse, type WeeklyAssessment, type InsertWeeklyAssessment, type AnxietyModule, type InsertAnxietyModule, type ProgressReport, type InsertProgressReport } from "@shared/schema";
import { randomUUID } from "crypto";
import { PostgresStorage } from "./postgres-storage";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // Onboarding
  createOnboardingResponse(response: InsertOnboardingResponse): Promise<OnboardingResponse>;
  getOnboardingResponse(userId: string): Promise<OnboardingResponse | undefined>;

  // Weekly assessments
  createWeeklyAssessment(assessment: InsertWeeklyAssessment): Promise<WeeklyAssessment>;
  getWeeklyAssessments(userId: string): Promise<WeeklyAssessment[]>;
  getLatestWeeklyAssessment(userId: string): Promise<WeeklyAssessment | undefined>;

  // Anxiety modules
  createAnxietyModule(module: InsertAnxietyModule): Promise<AnxietyModule>;
  getAnxietyModules(userId: string): Promise<AnxietyModule[]>;
  updateAnxietyModule(id: string, updates: Partial<AnxietyModule>): Promise<AnxietyModule>;
  initializeAnxietyModules(userId: string): Promise<void>;

  // Progress reports
  createProgressReport(report: InsertProgressReport): Promise<ProgressReport>;
  getProgressReports(userId: string): Promise<ProgressReport[]>;

  // Mood entries
  createMoodEntry(entry: any): Promise<any>;
  getMoodEntries(userId: string): Promise<any[]>;
  getMoodEntry(id: string): Promise<any | null>;
  getMoodEntryByDate(userId: string, entryDate: string): Promise<any | null>;
  updateMoodEntry(id: string, updates: any): Promise<any>;
  deleteMoodEntry(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private onboardingResponses: Map<string, OnboardingResponse>;
  private weeklyAssessments: Map<string, WeeklyAssessment>;
  private anxietyModules: Map<string, AnxietyModule>;
  private progressReports: Map<string, ProgressReport>;
  private moodEntries: Map<string, any>;

  constructor() {
    this.users = new Map();
    this.onboardingResponses = new Map();
    this.weeklyAssessments = new Map();
    this.anxietyModules = new Map();
    this.progressReports = new Map();
    this.moodEntries = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      nhsNumber: insertUser.nhsNumber || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createOnboardingResponse(insertResponse: InsertOnboardingResponse): Promise<OnboardingResponse> {
    const id = randomUUID();
    const response: OnboardingResponse = { ...insertResponse, id, completedAt: new Date() };
    this.onboardingResponses.set(id, response);
    return response;
  }

  async getOnboardingResponse(userId: string): Promise<OnboardingResponse | undefined> {
    return Array.from(this.onboardingResponses.values()).find(response => response.userId === userId);
  }

  async createWeeklyAssessment(insertAssessment: InsertWeeklyAssessment): Promise<WeeklyAssessment> {
    const id = randomUUID();
    const assessment: WeeklyAssessment = { 
      ...insertAssessment, 
      id, 
      completedAt: new Date(),
      needsEscalation: insertAssessment.needsEscalation || false
    };
    this.weeklyAssessments.set(id, assessment);
    return assessment;
  }

  async getWeeklyAssessments(userId: string): Promise<WeeklyAssessment[]> {
    return Array.from(this.weeklyAssessments.values())
      .filter(assessment => assessment.userId === userId)
      .sort((a, b) => b.weekNumber - a.weekNumber);
  }

  async getLatestWeeklyAssessment(userId: string): Promise<WeeklyAssessment | undefined> {
    const assessments = await this.getWeeklyAssessments(userId);
    return assessments[0];
  }

  async createAnxietyModule(insertModule: InsertAnxietyModule): Promise<AnxietyModule> {
    const id = randomUUID();
    const module: AnxietyModule = { 
      ...insertModule, 
      id, 
      completedAt: null, 
      lastAccessedAt: null,
      activitiesCompleted: insertModule.activitiesCompleted || 0,
      minutesCompleted: insertModule.minutesCompleted || 0,
      isLocked: insertModule.isLocked !== undefined ? insertModule.isLocked : true,
      contentData: insertModule.contentData || null,
      userProgress: insertModule.userProgress || null
    };
    this.anxietyModules.set(id, module);
    return module;
  }

  async getAnxietyModules(userId: string): Promise<AnxietyModule[]> {
    return Array.from(this.anxietyModules.values())
      .filter(module => module.userId === userId)
      .sort((a, b) => a.weekNumber - b.weekNumber);
  }

  async updateAnxietyModule(id: string, updates: Partial<AnxietyModule>): Promise<AnxietyModule> {
    const module = this.anxietyModules.get(id);
    if (!module) throw new Error("Module not found");
    const updatedModule = { ...module, ...updates, lastAccessedAt: new Date() };
    this.anxietyModules.set(id, updatedModule);
    return updatedModule;
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

  async createProgressReport(insertReport: InsertProgressReport): Promise<ProgressReport> {
    const id = randomUUID();
    const report: ProgressReport = { ...insertReport, id, generatedAt: new Date() };
    this.progressReports.set(id, report);
    return report;
  }

  async getProgressReports(userId: string): Promise<ProgressReport[]> {
    return Array.from(this.progressReports.values())
      .filter(report => report.userId === userId)
      .sort((a, b) => b.generatedAt!.getTime() - a.generatedAt!.getTime());
  }

  // Mood entries
  async createMoodEntry(insertEntry: any): Promise<any> {
    const id = randomUUID();
    const entry = { 
      ...insertEntry, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.moodEntries.set(id, entry);
    return entry;
  }

  async getMoodEntries(userId: string): Promise<any[]> {
    return Array.from(this.moodEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
  }

  async getMoodEntry(id: string): Promise<any | null> {
    return this.moodEntries.get(id) || null;
  }

  async getMoodEntryByDate(userId: string, entryDate: string): Promise<any | null> {
    return Array.from(this.moodEntries.values())
      .find(entry => entry.userId === userId && entry.entryDate === entryDate) || null;
  }

  async updateMoodEntry(id: string, updates: any): Promise<any> {
    const entry = this.moodEntries.get(id);
    if (!entry) throw new Error("Mood entry not found");
    const updatedEntry = { ...entry, ...updates, updatedAt: new Date() };
    this.moodEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteMoodEntry(id: string): Promise<void> {
    this.moodEntries.delete(id);
  }
}

// Use PostgreSQL storage if DATABASE_URL is available, otherwise use in-memory storage
export const storage = process.env.DATABASE_URL 
  ? new PostgresStorage() 
  : new MemStorage();
