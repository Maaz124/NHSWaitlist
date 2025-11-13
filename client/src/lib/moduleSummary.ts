export type ModuleActivityType = "reading" | "worksheet" | "reflection" | "exercise" | "breathing" | "assessment";

export interface ModuleActivitySummary {
  id: string;
  title: string;
  description: string;
  type: ModuleActivityType;
  estimatedMinutes: number;
}

export interface ModuleSummary {
  weekNumber: number;
  title: string;
  description: string;
  objectives: string[];
  activities: ModuleActivitySummary[];
}

const MODULE_SUMMARIES: Record<number, ModuleSummary> = {
  1: {
    weekNumber: 1,
    title: "Understanding Anxiety",
    description: "Learn what anxiety is, how it affects your body and mind, and why it happens.",
    objectives: [
      "Understand what anxiety is and how it affects you",
      "Recognize your personal anxiety symptoms",
      "Learn about the fight-flight-freeze response",
      "Identify your anxiety triggers",
      "Create your personal anxiety profile"
    ],
    activities: [
      {
        id: "anxiety-intro",
        title: "What is Anxiety?",
        description: "Understand the basics of anxiety and why your body reacts the way it does.",
        type: "reading",
        estimatedMinutes: 8
      },
      {
        id: "symptoms-check",
        title: "Your Anxiety Symptoms",
        description: "Map the physical, emotional, behavioral, and mental signs you experience.",
        type: "worksheet",
        estimatedMinutes: 12
      },
      {
        id: "trigger-identification",
        title: "Identifying Your Triggers",
        description: "Reflect on the situations, thoughts, and feelings that spark anxiety.",
        type: "reflection",
        estimatedMinutes: 15
      },
      {
        id: "anxiety-diary",
        title: "Anxiety Awareness Journal",
        description: "Start logging anxious moments to notice patterns and helpful responses.",
        type: "exercise",
        estimatedMinutes: 10
      }
    ]
  },
  2: {
    weekNumber: 2,
    title: "Breathing & Relaxation",
    description: "Master practical breathing techniques and progressive muscle relaxation.",
    objectives: [
      "Master diaphragmatic breathing technique",
      "Learn progressive muscle relaxation",
      "Practice box breathing for acute anxiety",
      "Create a personalized relaxation routine"
    ],
    activities: [
      {
        id: "breathing-basics",
        title: "The Power of Breath",
        description: "Discover why breathwork is a fast, reliable way to calm your nervous system.",
        type: "reading",
        estimatedMinutes: 6
      },
      {
        id: "diaphragmatic-breathing",
        title: "Diaphragmatic Breathing Practice",
        description: "Learn the core belly-breathing technique for daily anxiety management.",
        type: "breathing",
        estimatedMinutes: 15
      },
      {
        id: "box-breathing",
        title: "Box Breathing",
        description: "Use this 4-4-4-4 pattern to steady yourself during intense moments.",
        type: "breathing",
        estimatedMinutes: 10
      },
      {
        id: "progressive-relaxation",
        title: "Progressive Muscle Relaxation",
        description: "Systematically tense and release muscle groups to release stored tension.",
        type: "exercise",
        estimatedMinutes: 20
      }
    ]
  },
  3: {
    weekNumber: 3,
    title: "Cognitive Strategies",
    description: "Identify and challenge anxious thoughts with cognitive behavioral tools.",
    objectives: [
      "Understand the connection between thoughts, feelings, and behaviors",
      "Learn to identify anxious thinking patterns",
      "Master cognitive restructuring techniques",
      "Practice challenging unhelpful thoughts"
    ],
    activities: [
      {
        id: "thought-feelings-connection",
        title: "Thoughts, Feelings, Behaviors",
        description: "Explore the cognitive triangle and how it maintains anxious cycles.",
        type: "reading",
        estimatedMinutes: 8
      },
      {
        id: "thought-record",
        title: "Thought Record Practice",
        description: "Use a structured worksheet to examine and reframe anxious thoughts.",
        type: "worksheet",
        estimatedMinutes: 20
      },
      {
        id: "challenging-thoughts",
        title: "Challenging Anxious Thoughts",
        description: "Practice questioning and balancing unhelpful predictions.",
        type: "exercise",
        estimatedMinutes: 12
      }
    ]
  },
  4: {
    weekNumber: 4,
    title: "Mindfulness & Grounding",
    description: "Develop mindfulness skills and grounding techniques to stay present.",
    objectives: [
      "Learn the principles of mindfulness",
      "Master grounding techniques for anxiety",
      "Practice present-moment awareness",
      "Develop a personal mindfulness routine"
    ],
    activities: [
      {
        id: "mindfulness-intro",
        title: "Introduction to Mindfulness",
        description: "See how mindful awareness helps you relate to anxious thoughts differently.",
        type: "reading",
        estimatedMinutes: 7
      },
      {
        id: "grounding-techniques",
        title: "5-4-3-2-1 Grounding",
        description: "Anchor yourself with a sensory walk-through when anxiety spikes.",
        type: "exercise",
        estimatedMinutes: 10
      },
      {
        id: "body-scan-meditation",
        title: "Progressive Body Scan",
        description: "Release tension and increase body awareness with a guided scan.",
        type: "breathing",
        estimatedMinutes: 15
      },
      {
        id: "mindful-daily-activities",
        title: "Mindful Daily Activities",
        description: "Bring mindful attention into everyday routines to build resilience.",
        type: "exercise",
        estimatedMinutes: 10
      }
    ]
  },
  5: {
    weekNumber: 5,
    title: "Behavioral Activation",
    description: "Build healthy routines and gradually face anxiety-provoking situations.",
    objectives: [
      "Understand the role of behavior in maintaining anxiety",
      "Learn about gradual exposure techniques",
      "Create a behavioral activation plan",
      "Build confidence through small wins"
    ],
    activities: [
      {
        id: "behavior-anxiety-cycle",
        title: "Breaking the Avoidance Cycle",
        description: "Understand how avoidance maintains anxiety and how to interrupt it.",
        type: "reading",
        estimatedMinutes: 8
      },
      {
        id: "values-assessment",
        title: "Identifying Your Values",
        description: "Clarify what matters most so your goals align with your values.",
        type: "worksheet",
        estimatedMinutes: 15
      },
      {
        id: "exposure-hierarchy",
        title: "Building Your Exposure Ladder",
        description: "Design a graded plan to face fears steadily and safely.",
        type: "exercise",
        estimatedMinutes: 20
      },
      {
        id: "behavioral-experiments",
        title: "Behavioral Experiments",
        description: "Test anxious predictions against real-world evidence.",
        type: "exercise",
        estimatedMinutes: 12
      }
    ]
  },
  6: {
    weekNumber: 6,
    title: "Relapse Prevention & NHS Transition",
    description: "Create your personal toolkit and prepare for the NHS transition.",
    objectives: [
      "Develop a personalized anxiety management toolkit",
      "Create a relapse prevention plan",
      "Prepare for NHS mental health services transition",
      "Build long-term resilience strategies"
    ],
    activities: [
      {
        id: "progress-review",
        title: "Progress Review",
        description: "Reflect on your journey and identify growth and remaining needs.",
        type: "assessment",
        estimatedMinutes: 20
      },
      {
        id: "personal-toolkit",
        title: "Personal Anxiety Toolkit",
        description: "Compile the techniques that help you most into a ready reference.",
        type: "worksheet",
        estimatedMinutes: 25
      },
      {
        id: "relapse-prevention-plan",
        title: "Relapse Prevention Plan",
        description: "Plan for setbacks so you can respond quickly and effectively.",
        type: "worksheet",
        estimatedMinutes: 20
      },
      {
        id: "nhs-transition-prep",
        title: "NHS Transition Preparation",
        description: "Organize information and questions for your upcoming NHS care.",
        type: "worksheet",
        estimatedMinutes: 18
      }
    ]
  }
};

export function getModuleSummary(weekNumber: number): ModuleSummary {
  return MODULE_SUMMARIES[weekNumber] || MODULE_SUMMARIES[1];
}

export function getActivitySummary(activityId: string): ModuleActivitySummary | undefined {
  for (const summary of Object.values(MODULE_SUMMARIES)) {
    const match = summary.activities.find((activity) => activity.id === activityId);
    if (match) return match;
  }
  return undefined;
}
