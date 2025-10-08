import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { Header } from "@/components/ui/header";
import { useUser } from "@/contexts/UserContext";
import { TabNavigation } from "@/components/ui/tab-navigation";
import { CrisisBanner } from "@/components/ui/crisis-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ValuesWorksheet } from "@/components/ValuesWorksheet";
import { ProgressTracker } from "@/components/ProgressTracker";
import { ToolkitBuilder } from "@/components/ToolkitBuilder";
import { RelapsePlanner } from "@/components/RelapsePlanner";
import { NhsPrepGuide } from "@/components/NhsPrepGuide";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Circle, 
  Play, 
  Pause,
  BookOpen,
  Brain,
  Heart,
  MessageSquare,
  Target,
  Award,
  Timer,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ModuleActivity {
  id: string;
  type: 'reading' | 'exercise' | 'reflection' | 'breathing' | 'worksheet' | 'assessment';
  title: string;
  description: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  content: any;
}

const activityIcons = {
  reading: BookOpen,
  exercise: Target,
  reflection: MessageSquare,
  breathing: Heart,
  worksheet: Brain,
  assessment: Award
};

export default function ModuleDetail() {
  const [match, params] = useRoute("/anxiety-track/module/:weekNumber");
  const [, setLocation] = useLocation();
  const weekNumber = parseInt((params as any)?.weekNumber || "1");
  const { user, isLoading: userLoading, isAuthenticated } = useUser();

  // Redirect if not authenticated
  useEffect(() => {
    if (userLoading) return; // Still loading
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, userLoading, setLocation]);
  
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [notes, setNotes] = useState("");
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [worksheetData, setWorksheetData] = useState<{[key: string]: {[key: string]: boolean}}>({});
  const [moduleCompleted, setModuleCompleted] = useState(false);
  const [reflectionSaving, setReflectionSaving] = useState(false);
  const [notesSaving, setNotesSaving] = useState(false);
  const [toolkitDataGetter, setToolkitDataGetter] = useState<(() => any) | null>(null);
  const [relapseDataGetter, setRelapseDataGetter] = useState<(() => any) | null>(null);
  const [nhsDataGetter, setNhsDataGetter] = useState<(() => any) | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const { data: modulesData, isLoading } = useQuery({
    queryKey: ["/api/modules", user?.id],
    enabled: !!user?.id,
  });

  const updateModuleMutation = useMutation({
    mutationFn: async ({ moduleId, updates }: { moduleId: string; updates: any }) => {
      console.log('🚀 updateModuleMutation called with:', { moduleId, updates });
      const response = await apiRequest("PATCH", `/api/modules/${moduleId}`, updates);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Module update failed:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      console.log('✅ Module update successful:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('✅ updateModuleMutation onSuccess:', data);
      queryClient.invalidateQueries({ queryKey: ["/api/modules", user?.id] });
    },
    onError: (error: any) => {
      console.error('❌ updateModuleMutation onError:', error);
      alert(`Failed to update module: ${error.message}`);
    },
  });

  const modules = (modulesData as any)?.modules || [];
  const module = modules.find((m: any) => m.weekNumber === weekNumber);

  // Load existing worksheet data when module changes
  useEffect(() => {
    if (module?.userProgress) {
      const loadedWorksheetData: {[key: string]: {[key: string]: boolean}} = {};
      const loadedReflectionData: Record<string, string> = {};
      
      Object.keys(module.userProgress).forEach(activityId => {
        const progress = module.userProgress[activityId];
        if (progress.worksheetData) {
          loadedWorksheetData[activityId] = progress.worksheetData;
        }
        if (progress.reflectionData) {
          Object.assign(loadedReflectionData, progress.reflectionData);
        }
      });
      
      setWorksheetData(loadedWorksheetData);
      setReflections(loadedReflectionData);
    }
    
    // Load module notes if they exist, otherwise reset to empty
    if (module?.userProgress?.moduleNotes) {
      setNotes(module.userProgress.moduleNotes);
    } else {
      setNotes(""); // Reset notes when switching modules or no notes exist
    }
    
    // Reset saving states when module changes
    setReflectionSaving(false);
    setNotesSaving(false);
  }, [module]);

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Show loading state if not authenticated (redirect will happen)
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Redirecting...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading module...</div>
      </div>
    );
  }

  // Function to merge static content with user progress
  const getModuleContentWithProgress = (weekNumber: number, moduleData: any) => {
    const staticContent = getModuleContent(weekNumber);
    const userProgress = moduleData?.userProgress || {};
    
    // Merge activity completion status with user progress
    const activitiesWithProgress = staticContent.activities.map((activity: any) => ({
      ...activity,
      isCompleted: userProgress[activity.id]?.completed || false,
      completedAt: userProgress[activity.id]?.completedAt || null
    }));
    
    return {
      ...staticContent,
      activities: activitiesWithProgress
    };
  };

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Module not found for week {weekNumber}</p>
          <p className="text-sm text-muted-foreground mt-2">Available modules: {modules.length}</p>
          <Link href="/anxiety-track">
            <Button variant="outline" className="mt-4">Back to Anxiety Track</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getModuleContent = (weekNumber: number) => {
    const contents = {
      1: {
        title: "Understanding Anxiety",
        description: "Learn about anxiety, its symptoms, and how it affects your body and mind",
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
            type: "reading" as const,
            title: "What is Anxiety?",
            description: "Understanding the basics of anxiety and why it exists",
            estimatedMinutes: 8,
            isCompleted: false,
            content: {
              text: `Anxiety is your body's natural alarm system. It's designed to keep you safe by alerting you to potential dangers. When you perceive a threat, your body releases stress hormones like adrenaline and cortisol, preparing you to either fight the danger, run away from it, or freeze.

This "fight-flight-freeze" response was crucial for our ancestors who faced physical dangers like wild animals. Today, our brains often react to psychological threats (like job interviews or social situations) in the same way they would to physical dangers.

**Key Points:**
• Anxiety is normal and serves a protective function
• Everyone experiences anxiety sometimes
• It becomes a problem when it's excessive or interferes with daily life
• Understanding anxiety is the first step to managing it effectively

**Remember:** Having anxiety doesn't mean you're weak or broken. It means you're human.`
            }
          },
          {
            id: "symptoms-check",
            type: "worksheet" as const,
            title: "Your Anxiety Symptoms",
            description: "Identify how anxiety shows up in your body and mind",
            estimatedMinutes: 12,
            isCompleted: false,
            content: {
              checklist: [
                { category: "Physical", items: ["Racing heart", "Sweating", "Trembling", "Shortness of breath", "Dizziness", "Nausea", "Muscle tension", "Fatigue"] },
                { category: "Emotional", items: ["Worry", "Fear", "Panic", "Irritability", "Restlessness", "Feeling overwhelmed", "Dread", "Helplessness"] },
                { category: "Behavioral", items: ["Avoidance", "Procrastination", "Checking behaviors", "Seeking reassurance", "Fidgeting", "Pacing", "Difficulty concentrating", "Sleep problems"] },
                { category: "Mental", items: ["Racing thoughts", "Catastrophizing", "Mind going blank", "Difficulty making decisions", "Negative self-talk", "Imagining worst-case scenarios"] }
              ]
            }
          },
          {
            id: "trigger-identification",
            type: "reflection" as const,
            title: "Identifying Your Triggers",
            description: "Discover what situations, thoughts, or feelings tend to trigger your anxiety",
            estimatedMinutes: 15,
            isCompleted: false,
            content: {
              prompts: [
                "What situations make you feel most anxious?",
                "Are there specific times of day when anxiety is worse?",
                "What thoughts tend to spiral into anxiety?",
                "Are there physical sensations that trigger anxious feelings?",
                "How do other people or social situations affect your anxiety?"
              ]
            }
          },
          {
            id: "anxiety-diary",
            type: "exercise" as const,
            title: "Start Your Anxiety Awareness Journal",
            description: "Begin tracking your anxiety patterns to build self-awareness",
            estimatedMinutes: 10,
            isCompleted: false,
            content: {
              instructions: `For the next week, keep a simple anxiety diary. Each time you notice anxiety, write down:

**When:** Date and time
**Where:** Location and situation  
**What:** What was happening or what were you thinking about?
**How intense:** Rate your anxiety from 1-10
**How long:** How long did the anxious feelings last?
**What helped:** What (if anything) helped you feel better?

This isn't about judgment - it's about awareness. The more you understand your patterns, the better you can manage them.`,
              template: {
                date: "",
                time: "",
                location: "",
                situation: "",
                thoughts: "",
                intensity: 0,
                duration: "",
                whatHelped: ""
              }
            }
          }
        ]
      },
      2: {
        title: "Breathing & Relaxation",
        description: "Master breathing techniques and progressive muscle relaxation",
        objectives: [
          "Master diaphragmatic breathing technique",
          "Learn progressive muscle relaxation",
          "Practice box breathing for acute anxiety",
          "Create a personalized relaxation routine"
        ],
        activities: [
          {
            id: "breathing-basics",
            type: "reading" as const,
            title: "The Power of Breath",
            description: "Understanding how breathing affects anxiety and stress",
            estimatedMinutes: 6,
            isCompleted: false,
            content: {
              text: `Your breath is one of the most powerful tools for managing anxiety. Unlike your racing heart or sweaty palms, your breathing is something you can control directly.

**Why Breathing Works:**
• Slow, deep breathing activates your parasympathetic nervous system (the "rest and digest" response)
• It signals to your brain that you're safe
• Proper breathing increases oxygen flow to your brain, improving clarity
• It gives your mind something specific to focus on

**The Problem with Anxiety Breathing:**
When anxious, people often breathe rapidly and shallowly from their chest. This can actually make anxiety worse by:
• Reducing carbon dioxide in your blood
• Creating physical sensations like dizziness or tingling
• Sending danger signals to your brain

**The Solution:**
Learning to breathe slowly and deeply from your diaphragm (belly breathing) can quickly calm your nervous system.`
            }
          },
          {
            id: "diaphragmatic-breathing",
            type: "breathing" as const,
            title: "Diaphragmatic Breathing Practice",
            description: "Learn the fundamental breathing technique for anxiety management",
            estimatedMinutes: 15,
            isCompleted: false,
            content: {
              instructions: [
                "Find a comfortable position, either sitting or lying down",
                "Place one hand on your chest and one hand on your belly",
                "Breathe in slowly through your nose for 4 counts",
                "The hand on your belly should rise more than the hand on your chest",
                "Hold your breath for 2 counts",
                "Breathe out slowly through your mouth for 6 counts",
                "The hand on your belly should fall as you exhale",
                "Repeat for 5-10 breaths"
              ],
              guidance: "If you feel dizzy, slow down or take a break. This is normal when learning - your body is adjusting to breathing more efficiently."
            }
          },
          {
            id: "box-breathing",
            type: "breathing" as const,
            title: "Box Breathing for Acute Anxiety",
            description: "A powerful technique for managing anxiety attacks and high stress moments",
            estimatedMinutes: 10,
            isCompleted: false,
            content: {
              pattern: "4-4-4-4",
              instructions: [
                "Breathe in for 4 counts",
                "Hold your breath for 4 counts", 
                "Breathe out for 4 counts",
                "Hold empty for 4 counts",
                "Repeat the cycle 4-8 times"
              ],
              tips: "Visualize drawing a box as you breathe. This technique is used by Navy SEALs and first responders to stay calm under pressure."
            }
          },
          {
            id: "progressive-relaxation",
            type: "exercise" as const,
            title: "Progressive Muscle Relaxation",
            description: "Learn to release physical tension and promote deep relaxation",
            estimatedMinutes: 20,
            isCompleted: false,
            content: {
              script: `Progressive Muscle Relaxation (PMR) helps you learn the difference between tension and relaxation. You'll tense and then release different muscle groups.

**Full Body PMR Script:**

1. **Feet & Calves**: Point your toes and tighten your calf muscles. Hold for 5 seconds, then release and notice the relaxation.

2. **Thighs & Glutes**: Squeeze your thigh muscles and buttocks. Hold for 5 seconds, then release.

3. **Abdomen**: Tighten your stomach muscles as if someone were about to punch you. Hold for 5 seconds, then release.

4. **Hands & Arms**: Make fists and tighten your arm muscles. Hold for 5 seconds, then release and let your arms go limp.

5. **Shoulders**: Raise your shoulders up to your ears. Hold for 5 seconds, then let them drop.

6. **Face**: Scrunch up your entire face - forehead, eyes, cheeks, jaw. Hold for 5 seconds, then release completely.

Take a moment after each muscle group to notice the contrast between tension and relaxation.`
            }
          }
        ]
      },
      3: {
        title: "Cognitive Strategies",
        description: "Learn to identify and challenge anxious thoughts with cognitive behavioral techniques",
        objectives: [
          "Understand the connection between thoughts, feelings, and behaviors",
          "Learn to identify anxious thinking patterns",
          "Master cognitive restructuring techniques",
          "Practice challenging unhelpful thoughts"
        ],
        activities: [
          {
            id: "thought-feelings-connection",
            type: "reading" as const,
            title: "Understanding Thoughts, Feelings, and Behaviors",
            description: "Learn how your thoughts directly influence your emotions and actions",
            estimatedMinutes: 8,
            isCompleted: false,
            content: {
              text: `One of the most powerful discoveries in psychology is understanding how our thoughts, feelings, and behaviors are interconnected. This is called the cognitive triangle.

**The Cognitive Triangle:**
• **Thoughts** influence how we **feel**
• **Feelings** influence how we **behave**
• **Behaviors** influence how we **think**

**Example:**
*Thought:* "I'm going to fail this presentation"
*Feeling:* Anxious, nervous, scared
*Behavior:* Avoid preparing, procrastinate, or cancel

**The Good News:**
Since these three elements are connected, changing any one of them can influence the others. The easiest place to start is often with your thoughts.

**Common Anxious Thinking Patterns:**
• **Catastrophizing:** Imagining the worst possible outcome
• **All-or-nothing thinking:** Seeing things in black and white
• **Mind reading:** Assuming you know what others are thinking
• **Fortune telling:** Predicting negative outcomes
• **Personalization:** Blaming yourself for things outside your control`
            }
          },
          {
            id: "thought-record",
            type: "worksheet" as const,
            title: "Thought Record Practice",
            description: "Learn to identify and examine your anxious thoughts",
            estimatedMinutes: 20,
            isCompleted: false,
            content: {
              instructions: `When you notice anxiety rising, use this thought record to examine what's happening in your mind:

**Step 1: Situation**
What was happening when you felt anxious?

**Step 2: Emotion**
What emotion did you feel? Rate intensity 1-10.

**Step 3: Automatic Thought**
What thoughts went through your mind?

**Step 4: Evidence For**
What evidence supports this thought?

**Step 5: Evidence Against**
What evidence contradicts this thought?

**Step 6: Balanced Thought**
What's a more balanced, realistic way to think about this?

**Step 7: New Emotion**
How do you feel now? Rate intensity 1-10.`,
              template: {
                situation: "",
                emotion: "",
                intensity_before: 0,
                automatic_thought: "",
                evidence_for: "",
                evidence_against: "",
                balanced_thought: "",
                new_emotion: "",
                intensity_after: 0
              }
            }
          },
          {
            id: "challenging-thoughts",
            type: "exercise" as const,
            title: "Challenging Anxious Thoughts",
            description: "Practice questioning and reframing unhelpful thinking patterns",
            estimatedMinutes: 12,
            isCompleted: false,
            content: {
              instructions: `Use these questions to challenge anxious thoughts:

**Testing Reality:**
• Is this thought realistic?
• What evidence do I have that this thought is true?
• What evidence do I have that this thought is not true?

**Looking for Alternatives:**
• Are there other ways to look at this situation?
• What would I tell a friend in this situation?
• What's the worst that could realistically happen?
• What's the best that could happen?
• What's most likely to happen?

**Considering Consequences:**
• If this thought were true, how would I cope?
• Will this matter in 1 year? 5 years?
• Am I making this bigger than it needs to be?

**Practice Scenarios:**
1. "Everyone will notice I'm anxious"
2. "I can't handle this situation"
3. "Something terrible is going to happen"
4. "I always mess things up"`
            }
          }
        ]
      },
      4: {
        title: "Mindfulness & Grounding",
        description: "Develop mindfulness skills and grounding techniques to stay present during anxious moments",
        objectives: [
          "Learn the principles of mindfulness",
          "Master grounding techniques for anxiety",
          "Practice present-moment awareness",
          "Develop a personal mindfulness routine"
        ],
        activities: [
          {
            id: "mindfulness-intro",
            type: "reading" as const,
            title: "Introduction to Mindfulness",
            description: "Understanding how mindfulness can help with anxiety",
            estimatedMinutes: 7,
            isCompleted: false,
            content: {
              text: `Mindfulness is the practice of paying attention to the present moment without judgment. For people with anxiety, this can be incredibly powerful.

**Why Mindfulness Helps Anxiety:**
• Anxiety often involves worrying about the future or ruminating about the past
• Mindfulness brings you back to the present moment
• It helps you observe anxious thoughts without being overwhelmed by them
• Regular practice can reduce overall anxiety levels

**The Mindful Approach to Anxiety:**
Instead of fighting anxious thoughts, mindfulness teaches you to:
• Notice them without judgment
• Observe them like clouds passing in the sky
• Let them come and go naturally
• Focus on what's actually happening right now

**Common Mindfulness Myths:**
❌ "I need to empty my mind" - Mindfulness isn't about stopping thoughts
❌ "I'm bad at meditation" - There's no "perfect" way to be mindful
❌ "It takes years to work" - Benefits can be felt immediately
❌ "I don't have time" - Even 2-3 minutes can be helpful

**Starting Small:**
You don't need to meditate for hours. Start with just a few minutes of mindful breathing or awareness.`
            }
          },
          {
            id: "grounding-techniques",
            type: "exercise" as const,
            title: "5-4-3-2-1 Grounding Technique",
            description: "Learn a powerful technique to anchor yourself in the present moment",
            estimatedMinutes: 10,
            isCompleted: false,
            content: {
              instructions: `When anxiety hits, use this grounding technique to reconnect with the present moment:

**5 Things You Can See**
Look around and name 5 things you can see. Really focus on them - their colors, shapes, textures.

**4 Things You Can Touch**
Notice 4 things you can feel - your feet on the floor, the temperature of the air, the texture of your clothes.

**3 Things You Can Hear**
Listen for 3 different sounds - maybe traffic, birds, your own breathing, the hum of electronics.

**2 Things You Can Smell**
Notice 2 scents around you - coffee, fresh air, cleaning products, your perfume.

**1 Thing You Can Taste**
Focus on 1 taste in your mouth - maybe from something you drank, mint, or just the taste of your mouth.

**Tips:**
• Speak each item out loud if possible
• Take your time with each sense
• If your mind wanders, gently bring it back
• Use this technique anywhere, anytime`,
              guidance: "This technique works by engaging your senses and pulling your attention away from anxious thoughts back to your immediate physical environment."
            }
          },
          {
            id: "body-scan-meditation",
            type: "breathing" as const,
            title: "Progressive Body Scan",
            description: "A guided relaxation to release tension and increase body awareness",
            estimatedMinutes: 15,
            isCompleted: false,
            content: {
              instructions: [
                "Lie down comfortably or sit in a supportive chair",
                "Close your eyes and take three deep breaths",
                "Start at the top of your head - notice any sensations",
                "Slowly move your attention down to your forehead, eyes, jaw",
                "Continue down through your neck and shoulders",
                "Notice your arms, hands, and fingers",
                "Move to your chest and breathing",
                "Scan your abdomen and lower back",
                "Focus on your hips and pelvis",
                "Notice your thighs, knees, and calves",
                "End with your feet and toes",
                "Take a moment to notice your whole body"
              ],
              guidance: "Don't try to change anything - just notice. If you find areas of tension, simply acknowledge them with kindness."
            }
          },
          {
            id: "mindful-daily-activities",
            type: "exercise" as const,
            title: "Mindful Daily Activities",
            description: "Practice bringing mindfulness into everyday activities",
            estimatedMinutes: 10,
            isCompleted: false,
            content: {
              instructions: `Choose one routine activity to practice mindfully each day:

**Mindful Eating:**
• Notice the colors, textures, and smells of your food
• Chew slowly and taste each bite
• Pay attention to hunger and fullness cues

**Mindful Walking:**
• Feel your feet touching the ground
• Notice the rhythm of your steps
• Observe your surroundings without judgment

**Mindful Breathing:**
• Focus on the sensation of breath entering and leaving your body
• Notice the rise and fall of your chest or belly
• When your mind wanders, gently return to the breath

**Mindful Listening:**
• Give someone your full attention when they speak
• Listen without planning your response
• Notice the tone, pace, and emotion in their voice

**Start with just 2-3 minutes of mindful activity each day.**`,
              tips: "The goal isn't perfection - it's practice. Every time you notice your mind has wandered and bring it back, you're strengthening your mindfulness muscle."
            }
          }
        ]
      },
      5: {
        title: "Behavioral Activation",
        description: "Build healthy routines and gradually expose yourself to anxiety-provoking situations in a safe way",
        objectives: [
          "Understand the role of behavior in maintaining anxiety",
          "Learn about gradual exposure techniques",
          "Create a behavioral activation plan",
          "Build confidence through small wins"
        ],
        activities: [
          {
            id: "behavior-anxiety-cycle",
            type: "reading" as const,
            title: "Breaking the Avoidance Cycle",
            description: "Understanding how avoidance maintains anxiety and what to do instead",
            estimatedMinutes: 8,
            isCompleted: false,
            content: {
              text: `Avoidance is anxiety's best friend. When we avoid things that make us anxious, we feel better temporarily, but we actually make our anxiety stronger in the long run.

**The Avoidance Cycle:**
1. **Trigger:** Something makes you anxious
2. **Avoidance:** You avoid or escape the situation
3. **Relief:** You feel better immediately
4. **Reinforcement:** Your brain learns "avoiding = safety"
5. **Increased Anxiety:** Next time, the anxiety is stronger

**Breaking the Cycle:**
Instead of avoiding, we can use **gradual exposure** - slowly and safely facing our fears in small, manageable steps.

**Behavioral Activation Principles:**
• **Start small:** Begin with the easiest version of what you're avoiding
• **Be consistent:** Regular practice is more important than perfection
• **Celebrate wins:** Acknowledge every step forward, no matter how small
• **Expect discomfort:** Anxiety during exposure is normal and temporary

**Common Avoidance Behaviors:**
• Canceling social plans
• Avoiding phone calls or emails
• Staying home instead of going out
• Procrastinating on important tasks
• Using substances to cope
• Constantly seeking reassurance

**The Goal:**
Not to eliminate anxiety completely, but to do meaningful activities despite feeling anxious.`
            }
          },
          {
            id: "values-assessment",
            type: "worksheet" as const,
            title: "Identifying Your Values",
            description: "Discover what matters most to you to guide your behavioral changes",
            estimatedMinutes: 15,
            isCompleted: false,
            content: {
              instructions: `Values are what give your life meaning and direction. When anxiety makes you avoid things, you often move away from your values. Let's reconnect with what matters to you:

**Understanding Values vs. Goals:**
• **Values** are ongoing directions (like "being a loving parent")
• **Goals** are specific achievements (like "help my child with homework tonight")
• Values guide your goals and give them meaning

**Step 1: Life Areas Assessment**
Rate how important each area is to you (1-10):

**Relationships & Connection:**
• Family relationships (spouse, children, parents, siblings)
• Friendships and social connections
• Intimate relationships and romance
• Community involvement and belonging

**Personal Growth & Achievement:**
• Career and work life
• Education and learning
• Personal development and self-improvement
• Creativity and self-expression

**Health & Well-being:**
• Physical health and fitness
• Mental and emotional well-being
• Recreation, fun, and leisure
• Self-care and relaxation

**Meaning & Purpose:**
• Spirituality or life philosophy
• Contributing to causes you care about
• Leaving a positive impact
• Living authentically

**Step 2: Identifying Core Values**
For your highest-rated life areas, identify your underlying values. Here are some examples:

**Connection Values:** Love, intimacy, friendship, belonging, trust, loyalty, support
**Growth Values:** Learning, creativity, achievement, mastery, adventure, curiosity
**Contribution Values:** Helping others, making a difference, justice, compassion, service
**Authenticity Values:** Honesty, integrity, being true to yourself, independence
**Security Values:** Safety, stability, predictability, financial security
**Fun Values:** Playfulness, humor, enjoyment, spontaneity, celebration

**Step 3: Values Clarification Exercise**
Complete these sentences:
• "I feel most alive and energized when I am..."
• "The people I most admire tend to be..."
• "If I had unlimited time and resources, I would spend my time..."
• "When I look back on my life, I want to be remembered for..."
• "The times I feel most proud of myself are when I..."

**Step 4: Current vs. Desired Alignment**
For each important life area and its associated values:
• How much are you currently living according to these values? (1-10)
• What specific behaviors demonstrate these values?
• What would you be doing differently if you were fully aligned with these values?
• What small actions could move you closer to your values?

**Step 5: Anxiety as a Barrier**
Identify how anxiety interferes with your values:
• What value-driven activities do you avoid due to anxiety?
• How does anxiety-driven behavior conflict with your values?
• When has anxiety caused you to act against your values?

**Examples of Values in Action:**
• **Connection:** Reaching out to an old friend despite social anxiety
• **Growth:** Taking a course even though you're afraid of looking stupid
• **Authenticity:** Speaking up about something important despite fear of conflict
• **Health:** Going to the gym even when you feel self-conscious
• **Contribution:** Volunteering despite anxiety about meeting new people

**Values-Based Goal Setting:**
Choose one core value and identify:
• One thing you could do today that aligns with this value
• One thing you could do this week
• One thing you could work toward this month
• How you'll handle anxiety that arises while pursuing these value-driven actions

**Step 6: Creating Your Values Action Plan**
Now that you've identified your core values, let's create a concrete plan:

**Your Top 3 Values:**
1. ________________________
2. ________________________
3. ________________________

**For Each Value, Answer:**
• How does this value show up in your life currently?
• What would living this value more fully look like?
• What anxiety-related barrier is holding you back?
• What's one small action you could take this week?

**Values vs. Anxiety Decision Matrix:**
When facing a decision, ask yourself:
• What would I do if I were guided by my values?
• What would I do if I were guided by my anxiety?
• How can I take a step toward my values despite feeling anxious?

**Daily Values Check-In:**
Each evening, reflect:
• How did I honor my values today?
• When did anxiety pull me away from my values?
• What's one way I can live more aligned with my values tomorrow?

**Values-Based Motivation:**
When anxiety makes you want to avoid something, remind yourself:
• "This aligns with my value of ___________"
• "By doing this, I'm being the person I want to be"
• "I can feel anxious AND still act according to my values"
• "This matters to me because ___________"

**Worksheet Instructions:**
Complete the interactive worksheet below to identify your personal values and create your action plan. Take your time with each section and be honest about what truly matters to you.`,
              reflection_questions: [
                "Which values feel most important to you right now?",
                "What value-driven activities have you been avoiding because of anxiety?",
                "How would your life look different if you let your values guide your decisions instead of your anxiety?",
                "What's one small step toward your values you could take this week, even if it makes you anxious?",
                "How can you use your values to motivate yourself when anxiety makes you want to avoid something?"
              ],
              worksheet_template: {
                life_areas: [
                  { area: "Family relationships", importance: 0, current_alignment: 0, values: "", barriers: "" },
                  { area: "Friendships", importance: 0, current_alignment: 0, values: "", barriers: "" },
                  { area: "Career/work", importance: 0, current_alignment: 0, values: "", barriers: "" },
                  { area: "Education/learning", importance: 0, current_alignment: 0, values: "", barriers: "" },
                  { area: "Health/fitness", importance: 0, current_alignment: 0, values: "", barriers: "" },
                  { area: "Recreation/fun", importance: 0, current_alignment: 0, values: "", barriers: "" },
                  { area: "Community involvement", importance: 0, current_alignment: 0, values: "", barriers: "" },
                  { area: "Spirituality/personal growth", importance: 0, current_alignment: 0, values: "", barriers: "" }
                ],
                top_3_values: ["", "", ""],
                values_in_action: {
                  today: "",
                  this_week: "",
                  this_month: "",
                  anxiety_management: ""
                },
                completion_statements: {
                  most_alive: "",
                  admire_others: "",
                  unlimited_resources: "",
                  remembered_for: "",
                  feel_proud: ""
                }
              }
            }
          },
          {
            id: "exposure-hierarchy",
            type: "exercise" as const,
            title: "Building Your Exposure Ladder",
            description: "Create a step-by-step plan to gradually face your fears",
            estimatedMinutes: 20,
            isCompleted: false,
            content: {
              instructions: `Create a personalized exposure hierarchy - a ladder of increasingly challenging but manageable steps:

**Step 1: Choose Your Target**
Pick one specific fear or avoidance behavior to work on first.

**Step 2: Brainstorm Exposures**
Think of different ways to approach your fear, from very easy to very challenging.

**Step 3: Rate Anxiety Levels**
Rate each exposure from 0-10 for expected anxiety level.

**Step 4: Build Your Ladder**
Arrange exposures from lowest to highest anxiety rating.

**Example - Social Anxiety:**
1. (2/10) Make eye contact with a cashier
2. (3/10) Say "good morning" to a neighbor
3. (4/10) Ask a store employee where something is
4. (5/10) Call a restaurant to ask their hours
5. (6/10) Attend a small social gathering for 30 minutes
6. (7/10) Introduce yourself to someone new
7. (8/10) Give a brief presentation at work
8. (9/10) Host a dinner party

**Exposure Rules:**
• Start with 2-3/10 anxiety level
• Stay in the situation until anxiety decreases
• Repeat each step until it feels manageable
• Move up the ladder gradually`,
              template: {
                target_fear: "",
                exposures: [
                  { situation: "", anxiety_rating: 0, completed: false },
                  { situation: "", anxiety_rating: 0, completed: false },
                  { situation: "", anxiety_rating: 0, completed: false }
                ]
              }
            }
          },
          {
            id: "behavioral-experiments",
            type: "exercise" as const,
            title: "Behavioral Experiments",
            description: "Test your anxious predictions against reality",
            estimatedMinutes: 12,
            isCompleted: false,
            content: {
              instructions: `Behavioral experiments help you test whether your anxious thoughts are accurate. Instead of assuming the worst will happen, you gather evidence.

**How to Design an Experiment:**

**1. Identify the Prediction**
What specific thing do you think will happen?
Example: "If I ask a question in the meeting, everyone will think I'm stupid."

**2. Design the Test**
What could you do to test this prediction?
Example: "Ask one question in tomorrow's team meeting."

**3. Predict the Outcome**
What exactly do you think will happen?
Example: "People will laugh, I'll turn red, my boss will think less of me."

**4. Rate Your Belief**
How much do you believe your prediction? (0-100%)
Example: 85%

**5. Conduct the Experiment**
Do the behavior and observe what actually happens.

**6. Evaluate the Results**
What actually happened? How does this compare to your prediction?

**7. Update Your Belief**
Based on the evidence, how much do you believe the original prediction now?

**Common Experiment Ideas:**
• Making small talk with a colleague
• Expressing a different opinion
• Asking for help
• Making a minor mistake and seeing what happens
• Not checking something multiple times`,
              reminder: "The goal isn't to prove you wrong, but to gather real evidence about what actually happens when you take small risks."
            }
          }
        ]
      },
      6: {
        title: "Relapse Prevention & NHS Transition",
        description: "Create your personal toolkit for maintaining progress and preparing for NHS transition",
        objectives: [
          "Develop a personalized anxiety management toolkit",
          "Create a relapse prevention plan",
          "Prepare for NHS mental health services transition",
          "Build long-term resilience strategies"
        ],
        activities: [
          {
            id: "progress-review",
            type: "assessment" as const,
            title: "Progress Assessment & Reflection",
            description: "Review your journey and celebrate your achievements",
            estimatedMinutes: 20,
            isCompleted: false,
            content: {
              instructions: `Take time to reflect on your progress through this 6-week program:

**Part 1: Skills Learned**
For each week, rate how helpful it was (1-10) and identify your key takeaways:

**Week 1: Understanding Anxiety**
• What insights about anxiety were most valuable to you?
• How has understanding the fight-flight-freeze response helped?
• What anxiety triggers have you identified?
• Helpfulness rating: ___/10

**Week 2: Breathing & Relaxation**
• Which breathing techniques work best for you?
• How often do you use relaxation skills now?
• When do you most rely on these techniques?
• Helpfulness rating: ___/10

**Week 3: Cognitive Strategies**
• How has your thinking about anxious thoughts changed?
• What cognitive tools do you use most often?
• Can you challenge anxious thoughts more effectively now?
• Helpfulness rating: ___/10

**Week 4: Mindfulness & Grounding**
• What mindfulness practices have you incorporated into daily life?
• How does the 5-4-3-2-1 technique work for you?
• When do you feel most present and grounded?
• Helpfulness rating: ___/10

**Week 5: Behavioral Activation**
• What fears or avoidance behaviors have you faced?
• How have your values guided your actions?
• What exposure exercises have you tried?
• Helpfulness rating: ___/10

**Part 2: Changes You've Noticed**
Rate each area before starting the program vs. now (1-10):

**Anxiety Management:**
• Before: ___/10  |  Now: ___/10
• What specific changes have you noticed?

**Daily Functioning:**
• Before: ___/10  |  Now: ___/10  
• How has your daily life improved?

**Confidence:**
• Before: ___/10  |  Now: ___/10
• What situations feel more manageable now?

**Relationships:**
• Before: ___/10  |  Now: ___/10
• How have your relationships been affected?

**Work/School Performance:**
• Before: ___/10  |  Now: ___/10
• What changes have you noticed in your performance?

**Overall Quality of Life:**
• Before: ___/10  |  Now: ___/10
• What are you most proud of achieving?

**Part 3: Current Challenges Assessment**
• What anxiety symptoms do you still struggle with?
• What situations remain difficult for you?
• Which coping strategies need more practice?
• What would you like to continue working on?
• Where might you need additional support?

**Part 4: Future Readiness**
Rate your readiness in each area (1-10):
• Using anxiety management tools independently: ___/10
• Handling setbacks without professional support: ___/10
• Maintaining progress during stressful periods: ___/10
• Transitioning to NHS mental health services: ___/10
• Continuing your anxiety management journey: ___/10

**Part 5: Key Insights & Wisdom**
• What is the most important thing you've learned about yourself?
• What would you tell someone just starting this program?
• What keeps you motivated to continue working on anxiety management?
• How do you want to continue growing after this program?

**Part 6: Success Stories**
Describe 2-3 specific situations where you:
1. Used your new skills successfully
2. Did something you previously avoided due to anxiety
3. Felt proud of how you handled an anxious moment`,
              reflection_prompts: [
                "What is the biggest change you've made during this program?",
                "Which week was most helpful and why?",
                "What advice would you give to someone starting this journey?",
                "How do you want to continue growing after this program ends?",
                "What are you most proud of achieving in these 6 weeks?",
                "How will you remember and apply what you've learned?"
              ],
              progress_tracking: {
                weekly_ratings: [
                  { week: 1, helpfulness: 0, key_takeaway: "" },
                  { week: 2, helpfulness: 0, key_takeaway: "" },
                  { week: 3, helpfulness: 0, key_takeaway: "" },
                  { week: 4, helpfulness: 0, key_takeaway: "" },
                  { week: 5, helpfulness: 0, key_takeaway: "" }
                ],
                before_after_ratings: {
                  anxiety_management: { before: 0, after: 0 },
                  daily_functioning: { before: 0, after: 0 },
                  confidence: { before: 0, after: 0 },
                  relationships: { before: 0, after: 0 },
                  work_performance: { before: 0, after: 0 },
                  quality_of_life: { before: 0, after: 0 }
                },
                readiness_ratings: {
                  independent_tools: 0,
                  handle_setbacks: 0,
                  maintain_progress: 0,
                  nhs_transition: 0,
                  continue_journey: 0
                }
              }
            }
          },
          {
            id: "personal-toolkit",
            type: "worksheet" as const,
            title: "Creating Your Personal Anxiety Toolkit",
            description: "Compile your most effective techniques into a personalized toolkit",
            estimatedMinutes: 25,
            isCompleted: false,
            content: {
              instructions: `Create a comprehensive, personalized toolkit with your most effective anxiety management strategies. This will be your go-to resource for managing anxiety independently.

**Section 1: Emergency Techniques (For Acute Anxiety)**
Choose 3-5 techniques that work quickly when anxiety is high:

**Breathing Techniques:**
□ Box breathing (4-4-4-4 pattern)
□ Diaphragmatic breathing (belly breathing)
□ 4-7-8 breathing (inhale 4, hold 7, exhale 8)
□ Quick coherent breathing (5 seconds in, 5 seconds out)

**Grounding Techniques:**
□ 5-4-3-2-1 sensory grounding
□ Physical grounding (feel feet on floor, hold an object)
□ Mental grounding (count backwards from 100 by 7s)
□ Cold water on wrists or face

**Rapid Relaxation:**
□ Progressive muscle relaxation (quick version)
□ Visualization of calm place
□ Mindful observation without judgment
□ Positive self-talk phrases

**Your Top 3 Emergency Techniques:**
1. ________________________________
2. ________________________________
3. ________________________________

**Section 2: Daily Maintenance Strategies**
Select ongoing practices to prevent anxiety buildup:

**Morning Routine (Choose 2-3):**
□ 5-minute mindfulness meditation
□ Gratitude journaling (3 things)
□ Gentle stretching or yoga
□ Intention setting for the day
□ Breathing exercise while having coffee/tea
□ Review daily goals aligned with values

**Throughout the Day (Choose 2-3):**
□ Hourly breathing check-ins
□ Mindful transitions between activities
□ Regular movement breaks
□ Anxiety level check-ins (1-10 scale)
□ Values-based decision making
□ Positive self-talk reminders

**Evening Routine (Choose 2-3):**
□ Reflection on the day's successes
□ Progressive muscle relaxation
□ Worry time (scheduled 15 minutes)
□ Gratitude practice
□ Preparation for tomorrow to reduce morning anxiety
□ Reading or calming activity

**Weekly Practices (Choose 1-2):**
□ Values assessment and goal adjustment
□ Exposure practice (facing a small fear)
□ Social connection activity
□ Nature time or outdoor activity
□ Review and update anxiety management goals

**Your Daily Maintenance Plan:**
Morning: ________________________________
During Day: ______________________________
Evening: ________________________________
Weekly: _________________________________

**Section 3: Thought Management Tools**
Pick your favorite cognitive techniques:

**For Identifying Anxious Thoughts:**
□ Thought records and journaling
□ Mindful awareness of thinking patterns
□ Anxiety symptom tracking
□ Trigger identification logs

**For Challenging Thoughts:**
□ Evidence for/against worksheets
□ Alternative perspective questions
□ Probability estimation exercises
□ Worst case/best case/most likely scenarios

**For Balanced Thinking:**
□ Reframing negative thoughts
□ Self-compassion phrases
□ Perspective-taking exercises
□ Reality testing questions

**Your Top 3 Thought Tools:**
1. ________________________________
2. ________________________________
3. ________________________________

**Quick Thought Challenge Questions:**
• Is this thought realistic?
• What evidence supports/contradicts this?
• What would I tell a friend in this situation?
• Will this matter in 5 years?

**Section 4: Behavioral Strategies**
Include gradual exposure and activation plans:

**Exposure Practice:**
□ Continue working through your exposure hierarchy
□ Regular practice of anxiety-provoking situations
□ Gradual increase in challenge level
□ Behavioral experiments to test anxious predictions

**Values-Based Actions:**
□ Weekly goals aligned with your core values
□ Regular review of values vs. anxiety-driven decisions
□ Social activities that matter to you
□ Work/hobby activities that bring meaning

**Behavioral Activation:**
□ Scheduling enjoyable activities
□ Maintaining social connections
□ Physical exercise routine
□ Engaging in meaningful projects

**Your Behavioral Strategy Plan:**
Weekly exposure goal: ________________________
Values-based activity: _______________________
Social connection goal: ______________________
Physical activity plan: ______________________

**Section 5: Warning Signs & Early Intervention**

**Physical Warning Signs:**
□ Muscle tension (especially shoulders, jaw, back)
□ Sleep changes (difficulty falling asleep, frequent waking)
□ Appetite changes
□ Headaches or stomach issues
□ Fatigue or restlessness
□ Heart racing or feeling short of breath

**Emotional Warning Signs:**
□ Increased worry or racing thoughts
□ Irritability or mood swings
□ Feeling overwhelmed or hopeless
□ Difficulty concentrating
□ Increased sensitivity to criticism
□ Feeling disconnected from others

**Behavioral Warning Signs:**
□ Avoiding activities you usually enjoy
□ Procrastinating on important tasks
□ Isolating from friends and family
□ Increased use of substances or unhealthy coping
□ Changes in work or school performance
□ Seeking excessive reassurance

**Your Personal Warning Signs:**
1. ________________________________
2. ________________________________
3. ________________________________

**Early Intervention Action Plan:**
When I notice 1-2 warning signs:
• ________________________________
• ________________________________

When I notice 3+ warning signs:
• ________________________________
• ________________________________
• Consider reaching out to: _______________

**Section 6: Support Network & Resources**

**Personal Support:**
• Trusted friend: ________________________
• Family member: _______________________
• Professional contact: ___________________

**Crisis Resources:**
• Crisis Text Line: Text HOME to 741741
• Samaritans: 116 123 (free, 24/7)
• NHS 111 for urgent but non-emergency help
• 999 for immediate emergency situations

**Self-Help Resources:**
• Apps I find helpful: ____________________
• Books or websites: ____________________
• Online communities: ___________________

**Section 7: Toolkit Quick Reference Card**
Create a summary card to keep with you:

**When anxiety hits, try:**
1. ________________________________
2. ________________________________
3. ________________________________

**Daily practices:**
________________________________

**Emergency contacts:**
________________________________

**Reminder phrases:**
• ________________________________
• ________________________________`,
              toolkit_builder: {
                emergency_techniques: {
                  breathing: [],
                  grounding: [],
                  relaxation: [],
                  selected: []
                },
                daily_practices: {
                  morning: [],
                  throughout_day: [],
                  evening: [],
                  weekly: []
                },
                thought_tools: {
                  identifying: [],
                  challenging: [],
                  balancing: [],
                  quick_questions: []
                },
                behavioral_strategies: {
                  exposure_goal: "",
                  values_activity: "",
                  social_goal: "",
                  physical_plan: ""
                },
                warning_signs: {
                  physical: [],
                  emotional: [],
                  behavioral: [],
                  personal_top3: []
                },
                action_plan: {
                  early_signs: [],
                  multiple_signs: [],
                  emergency_contact: ""
                },
                support_network: {
                  trusted_friend: "",
                  family_member: "",
                  professional: "",
                  helpful_apps: "",
                  resources: ""
                },
                quick_reference: {
                  emergency_steps: [],
                  daily_practice: "",
                  emergency_contact: "",
                  reminder_phrases: []
                }
              }
            }
          },
          {
            id: "relapse-prevention-plan",
            type: "worksheet" as const,
            title: "Relapse Prevention Plan",
            description: "Prepare strategies for managing setbacks and maintaining progress",
            estimatedMinutes: 20,
            isCompleted: false,
            content: {
              instructions: `Recovery isn't linear - there will be ups and downs. A comprehensive relapse prevention plan helps you navigate difficult periods and maintain your progress long-term.

**Section 1: Understanding Setbacks**
Setbacks are a normal part of recovery and don't erase your progress. They're opportunities to practice your skills and learn more about yourself.

**What a Setback IS:**
• A temporary return of stronger anxiety symptoms
• Using old coping patterns during stress
• Feeling like you've "lost" some progress
• Having a particularly difficult day, week, or period

**What a Setback IS NOT:**
• A sign that you've failed or the program didn't work
• Permanent loss of all your progress
• A reason to give up on your anxiety management
• Evidence that you "can't get better"

**Setback Mindset Reframe:**
Instead of: "I'm back to square one"
Try: "I'm having a tough time and can use this as practice"

Instead of: "This proves I can't handle anxiety"
Try: "This shows I'm human and need to use my tools more consistently"

**Section 2: High-Risk Situations**
Identify when your anxiety might be more challenging:

**Life Transitions:**
□ Starting a new job or school
□ Moving to a new home
□ Relationship changes (marriage, breakup, divorce)
□ Health issues (yours or family members)
□ Financial stress or changes
□ Loss or grief

**Stressful Periods:**
□ Work deadlines or high-pressure projects
□ Exam periods or important presentations
□ Family conflicts or relationship problems
□ Holiday seasons or special events
□ Anniversary dates of difficult events
□ Legal issues or major decisions

**Physical Factors:**
□ Illness or injury
□ Hormonal changes
□ Sleep deprivation
□ Medication changes
□ Substance use
□ Poor nutrition or dehydration

**Environmental Factors:**
□ Seasonal changes (especially winter)
□ Weather extremes
□ Major world events or news
□ Changes in living situation
□ Social isolation
□ Information overload

**Your Personal High-Risk Situations:**
1. ________________________________
2. ________________________________
3. ________________________________
4. ________________________________

**Section 3: Early Warning System**
Recognize when anxiety is becoming problematic again:

**Level 1 - Yellow Alert (Mild Increase):**
□ Slight increase in worry or tension
□ Occasional difficulty sleeping
□ Minor avoidance of some activities
□ Feeling slightly more stressed than usual
□ Forgetting to use coping strategies occasionally

**Level 2 - Orange Alert (Moderate Increase):**
□ Noticeable increase in physical anxiety symptoms
□ Sleep problems several times per week
□ Avoiding important activities more frequently
□ Difficulty concentrating at work or school
□ Feeling overwhelmed by daily tasks
□ Increased irritability or mood changes

**Level 3 - Red Alert (Significant Increase):**
□ Severe anxiety symptoms interfering with daily life
□ Sleep problems most nights
□ Avoiding multiple important activities
□ Unable to function normally at work/school/home
□ Complete abandonment of coping strategies
□ Thoughts of self-harm or substance use

**Your Personal Warning Signs:**
Early signs (Yellow): ________________________
Moderate signs (Orange): ____________________
Severe signs (Red): _________________________

**Section 4: Action Plans for Each Level**

**Yellow Alert Response Plan:**
□ Increase daily mindfulness/breathing practice
□ Review and restart neglected coping strategies
□ Ensure good sleep hygiene and self-care
□ Reach out to a friend or family member
□ Schedule enjoyable or meaningful activities
□ Review your personal toolkit

Your specific Yellow Alert plan:
1. ________________________________
2. ________________________________
3. ________________________________

**Orange Alert Response Plan:**
□ Implement emergency techniques more frequently
□ Temporarily reduce non-essential commitments
□ Increase social support and check-ins
□ Consider speaking with a healthcare provider
□ Review and adjust your routine
□ Use your support network more actively

Your specific Orange Alert plan:
1. ________________________________
2. ________________________________
3. ________________________________

**Red Alert Response Plan:**
□ Seek professional help immediately
□ Inform trusted people about your struggles
□ Consider time off work/school if possible
□ Use crisis resources if needed
□ Return to basics: sleep, eat, breathe, move
□ Remove additional stressors temporarily

Your specific Red Alert plan:
1. ________________________________
2. ________________________________
3. ________________________________

**Section 5: Building Resilience**
Strengthen your ability to bounce back:

**Daily Resilience Habits:**
□ Consistent sleep schedule (even on weekends)
□ Regular physical activity or movement
□ Healthy eating patterns
□ Daily mindfulness or relaxation practice
□ Social connection (even brief check-ins)
□ Time in nature or outdoors
□ Engaging in meaningful activities

**Weekly Resilience Activities:**
□ Values assessment and goal adjustment
□ Social activities with friends or family
□ Hobbies or creative activities
□ Planning and preparation for the week ahead
□ Review of what's working and what needs adjustment
□ Time for rest and recovery

**Monthly Resilience Review:**
□ Assess overall mental health and progress
□ Adjust goals and strategies as needed
□ Plan for upcoming stressors or challenges
□ Celebrate achievements and progress
□ Connect with healthcare providers if needed

**Section 6: Support Network Planning**

**Primary Support Person:**
Name: _________________________________
Relationship: ____________________________
Phone: ________________________________
When to contact: ________________________

**Secondary Support People:**
Name: _________________________________
Name: _________________________________
Name: _________________________________

**Professional Support:**
GP: ___________________________________
Mental health professional: ________________
Crisis contact: ____________________________

**Support Group/Community:**
Online community: _______________________
Local group: ____________________________
Mental health charity: ____________________

**Section 7: Professional Help Triggers**
Seek professional help when:

**Immediate/Crisis Situations:**
□ Thoughts of suicide or self-harm
□ Inability to ensure personal safety
□ Severe panic attacks lasting hours
□ Psychotic symptoms (hallucinations, delusions)
□ Substance abuse to cope with anxiety

**Urgent Situations (Within 1-2 weeks):**
□ Inability to function at work/school for 1+ weeks
□ Complete isolation from friends and family
□ Severe sleep deprivation (less than 4 hours for several nights)
□ Anxiety preventing basic self-care
□ Significant increase in physical symptoms

**Non-Urgent Professional Support:**
□ Moderate symptoms persisting for 3+ weeks
□ Feeling stuck despite using all your tools
□ Wanting to learn additional coping strategies
□ Major life changes requiring extra support
□ Medication review or adjustment needed

**Section 8: Long-Term Success Strategies**

**3-Month Goals:**
□ Maintain daily anxiety management routine
□ Continue practicing exposure exercises
□ Build and maintain social connections
□ Monitor and adjust strategies as needed

**6-Month Goals:**
□ Handle minor setbacks independently
□ Pursue values-based goals despite anxiety
□ Maintain progress during stressful periods
□ Develop additional coping strategies

**1-Year Goals:**
□ Integrate anxiety management into lifestyle
□ Support others with similar struggles
□ Pursue major life goals without anxiety interference
□ Maintain overall life satisfaction and well-being

**Your Personal Long-Term Goals:**
3 months: ______________________________
6 months: ______________________________
1 year: ________________________________

**Section 9: Emergency Crisis Resources**

**UK Crisis Contacts:**
• **Samaritans:** 116 123 (free, 24/7)
• **Crisis Text Line:** Text SHOUT to 85258
• **NHS 111:** For urgent but non-emergency help
• **999:** For immediate emergency situations

**Mental Health Helplines:**
• **Mind Info Line:** 0300 123 3393
• **Anxiety UK:** 03444 775 774
• **Rethink Mental Illness:** 0300 5000 927
• **CALM (Campaign Against Living Miserably):** 0800 58 58 58

**Online Resources:**
• **NHS Mental Health Services:** nhs.uk/mental-health
• **Mind:** mind.org.uk
• **Anxiety UK:** anxietyuk.org.uk
• **Mental Health Foundation:** mentalhealth.org.uk

**Apps for Support:**
• **SilverCloud:** NHS-approved therapy platform
• **Sanvello:** Anxiety and mood tracking
• **Headspace:** Mindfulness and meditation
• **Calm:** Sleep and relaxation

**Section 10: Relapse Prevention Checklist**
□ I've identified my personal high-risk situations
□ I know my early warning signs
□ I have action plans for different levels of difficulty
□ I've built a strong support network
□ I know when to seek professional help
□ I have crisis resources easily accessible
□ I've set realistic long-term goals
□ I understand that setbacks are normal
□ I'm committed to ongoing self-care and practice`,
              relapse_prevention: {
                high_risk_situations: [],
                warning_signs: {
                  yellow: [],
                  orange: [],
                  red: []
                },
                action_plans: {
                  yellow: [],
                  orange: [],
                  red: []
                },
                support_network: {
                  primary_contact: "",
                  secondary_contacts: [],
                  professional_contacts: [],
                  community_resources: []
                },
                long_term_goals: {
                  three_months: "",
                  six_months: "",
                  one_year: ""
                },
                resilience_habits: {
                  daily: [],
                  weekly: [],
                  monthly: []
                }
              }
            }
          },
          {
            id: "nhs-transition-prep",
            type: "reading" as const,
            title: "Preparing for NHS Mental Health Services",
            description: "Get ready for your transition to NHS care with confidence",
            estimatedMinutes: 15,
            isCompleted: false,
            content: {
              text: `As you transition to NHS mental health services, you're in a much stronger position than when you started this program. Here's your comprehensive guide to making the most of NHS care:

**Section 1: Understanding NHS Mental Health Services**

**Primary Mental Health Team (PMHT):**
• Often the first point of contact for mental health support
• Provides assessments, brief interventions, and treatment planning
• May offer cognitive behavioral therapy (CBT), counseling, or other therapies
• Can refer to more specialist services if needed

**Community Mental Health Teams (CMHT):**
• For people with more complex or severe mental health needs
• Multi-disciplinary teams including psychiatrists, nurses, social workers
• Provide ongoing support and treatment in the community
• Coordinate care between different services

**IAPT Services (Improving Access to Psychological Therapies):**
• Focus on evidence-based psychological treatments
• Primarily for anxiety and depression
• Often shorter-term, structured therapy programs
• May include group therapy options

**Crisis Services:**
• For urgent mental health support
• Available 24/7 in most areas
• Include crisis teams, safe havens, and crisis cafes
• Alternative to A&E for mental health emergencies

**Section 2: What to Expect from Your Assessment**

**The Initial Assessment Process:**
• Usually 1-2 hours with a mental health professional
• Discussion of your current symptoms and their impact
• Review of your mental health history
• Assessment of risk factors and support systems
• Development of initial treatment recommendations

**What They'll Ask About:**
• Current anxiety symptoms and triggers
• How anxiety affects your daily life
• Previous mental health treatment or support
• Physical health and medication
• Social support and relationships
• Work, education, and housing situation
• Risk factors and safety concerns

**Section 3: Preparing for Your Assessment**

**Documents to Bring:**
□ GP referral letter (if you have one)
□ List of current medications
□ Summary of this 6-week program and what you've learned
□ Your personal anxiety toolkit
□ Any previous mental health records
□ List of questions you want to ask

**Your 6-Week Program Summary:**
Create a one-page summary including:
• Techniques that have been most helpful
• Situations you've successfully managed
• Areas where you still need support
• Your current anxiety levels and functioning
• Goals for ongoing treatment

**Information to Share:**
□ Specific anxiety symptoms and their frequency
□ Triggers you've identified
□ Coping strategies you've developed
□ Progress you've made and challenges remaining
□ Your values and treatment goals
□ Support systems you have in place

**Section 4: Treatment Options You Might Be Offered**

**Cognitive Behavioral Therapy (CBT):**
• Evidence-based treatment for anxiety disorders
• Focuses on changing unhelpful thought and behavior patterns
• Usually 12-20 sessions over several months
• May be individual or group therapy
• Builds on skills you've already learned in this program

**Other Psychological Therapies:**
• **Acceptance and Commitment Therapy (ACT):** Focus on accepting anxiety while pursuing values
• **Mindfulness-Based Therapies:** Structured mindfulness programs
• **Counseling:** Supportive talking therapy to explore feelings and experiences
• **EMDR:** For anxiety related to trauma or specific incidents

**Medication Options:**
• **SSRIs (Selective Serotonin Reuptake Inhibitors):** Common first-line treatment
• **SNRIs:** Alternative antidepressants that can help with anxiety
• **Beta-blockers:** For physical symptoms of anxiety
• **Short-term options:** Rarely prescribed, only for severe cases

**Group Therapy Options:**
• Anxiety management groups
• Social anxiety groups
• Mindfulness or relaxation groups
• Peer support groups

**Section 5: Questions to Ask During Your Assessment**

**About Treatment Options:**
• What treatment approaches do you recommend for my specific type of anxiety?
• How long is the typical treatment course?
• What are the benefits and potential side effects of recommended treatments?
• Are there group therapy options available?
• What happens if the first treatment approach doesn't work?

**About Waiting Times:**
• How long is the wait for treatment to begin?
• What support is available while I'm waiting?
• Can I continue using the skills I've learned in this program?
• Are there any resources or support groups I can access immediately?

**About Ongoing Support:**
• What should I do if I'm struggling between appointments?
• How often will I be seen once treatment begins?
• What crisis support is available if I need it?
• How will my progress be monitored?

**About Your Role:**
• What can I do to prepare for treatment?
• How can I make the most of therapy sessions?
• What should I do between sessions?
• How involved will my family or friends be in treatment?

**Section 6: Your Strengths Going Forward**

**Skills You've Developed:**
□ Understanding of anxiety and how it affects you
□ Toolkit of proven anxiety management techniques
□ Experience with breathing and relaxation exercises
□ Cognitive strategies for challenging anxious thoughts
□ Mindfulness and grounding skills
□ Values-based decision making
□ Exposure and behavioral activation experience
□ Relapse prevention planning

**Personal Insights:**
□ Knowledge of your anxiety triggers
□ Understanding of your warning signs
□ Awareness of your personal values
□ Recognition of your support systems
□ Experience with what works and what doesn't

**Progress You've Made:**
□ Situations you can now handle that you couldn't before
□ Improved confidence in managing anxiety
□ Better understanding of yourself and your needs
□ Stronger sense of what you want from life

**Section 7: Continuing Your Progress While Waiting**

**Maintain Your Daily Practices:**
□ Continue using breathing and relaxation techniques
□ Keep practicing mindfulness and grounding
□ Maintain your values-based goal setting
□ Use your personal anxiety toolkit regularly

**Stay Connected:**
□ Keep in touch with your support network
□ Continue social activities and relationships
□ Engage with online communities if helpful
□ Consider peer support groups

**Keep Learning:**
□ Read self-help books on anxiety management
□ Use mental health apps for additional support
□ Practice the skills you've learned consistently
□ Try new anxiety management techniques

**Monitor Your Progress:**
□ Keep track of your anxiety levels and triggers
□ Note what techniques are working well
□ Document any new challenges or successes
□ Prepare updates for your first NHS appointment

**Section 8: Making the Most of NHS Treatment**

**Be an Active Participant:**
• Come prepared to sessions with questions and updates
• Practice techniques between sessions
• Be honest about what's working and what isn't
• Ask for clarification if you don't understand something

**Set Clear Goals:**
• Work with your therapist to set specific, achievable goals
• Regularly review and adjust goals as you progress
• Celebrate small wins along the way
• Be patient with the process

**Use Your Existing Skills:**
• Share the techniques you've learned in this program
• Build on the foundation you've already created
• Integrate new skills with what you already know
• Maintain the progress you've made

**Section 9: Advocacy and Self-Advocacy**

**Know Your Rights:**
• You have the right to be involved in decisions about your care
• You can ask for a second opinion if needed
• You can request a different therapist if the fit isn't right
• You can access your medical records

**Speak Up for Yourself:**
• Express your preferences for treatment approaches
• Share what you've learned about yourself
• Ask questions if something isn't clear
• Request additional support if you need it

**Get Support with Advocacy:**
• Bring a trusted friend or family member to appointments
• Contact mental health charities for advocacy support
• Use patient advice and liaison services (PALS) if needed
• Join patient groups or forums for peer support

**Section 10: Emergency and Crisis Support**

**When to Seek Urgent Help:**
□ Thoughts of suicide or self-harm
□ Severe panic attacks that won't subside
□ Inability to function or care for yourself
□ Substance use to cope with anxiety
□ Feeling unsafe or out of control

**How to Access Crisis Support:**
• **NHS 111:** For urgent but non-emergency mental health needs
• **Crisis Team:** Contact through your GP or NHS 111
• **A&E:** For immediate emergencies
• **Samaritans:** 116 123 for emotional support anytime

**Crisis Planning:**
• Have emergency numbers easily accessible
• Identify early warning signs of crisis
• Plan who to contact and when
• Know where your nearest crisis services are located

**Section 11: Long-Term Success with NHS Services**

**Building a Good Relationship with Your Mental Health Team:**
• Be honest and open about your experiences
• Follow through with agreed plans and homework
• Communicate any concerns or difficulties
• Appreciate that building therapeutic relationships takes time

**Continuing Self-Care:**
• Maintain the healthy habits you've developed
• Keep using your anxiety management toolkit
• Stay connected with your support network
• Continue pursuing your values and goals

**Planning for the Future:**
• Work towards independence in managing your anxiety
• Develop a long-term maintenance plan
• Know how to access support if you need it again
• Consider how you might help others with similar struggles

**Remember: You're Not Starting from Scratch**
You're building on a strong foundation of:
• Self-awareness and understanding
• Proven anxiety management skills
• Personal insights and strategies
• Progress and achievements
• Resilience and determination

**Your Next Steps:**
1. Complete your program summary document
2. Gather any relevant medical records
3. Prepare your list of questions
4. Continue practicing your anxiety management skills
5. Stay connected with your support network
6. Approach NHS services with confidence in what you've already achieved

You're ready for this next phase of your mental health journey. Trust in the progress you've made and the skills you've developed. NHS services will build on this strong foundation to support your continued growth and recovery.`
            }
          }
        ]
      }
    };
    
    return contents[weekNumber as keyof typeof contents] || contents[1];
  };

  const moduleContent = getModuleContentWithProgress(weekNumber, module || {});
  const activities: ModuleActivity[] = moduleContent.activities;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleActivityComplete = (activityId: string) => {
    if (!module) return;
    
    // Get current module content with progress
    const moduleContent = getModuleContentWithProgress(module.weekNumber, module);
    const activity = moduleContent.activities.find((a: any) => a.id === activityId);
    if (!activity) return;
    
    // Toggle completion status
    const newCompletionStatus = !activity.isCompleted;
    
    // Calculate new progress counters
    const updatedUserProgress = {
      ...(module.userProgress || {}),
      [activityId]: {
        ...(module.userProgress?.[activityId] || {}), // Preserve existing data like worksheetData
        completed: newCompletionStatus,
        completedAt: newCompletionStatus ? new Date().toISOString() : null
      }
    };
    
    // Special handling for personal-toolkit: ensure any current toolkit data is saved
    if (activityId === 'personal-toolkit' && newCompletionStatus) {
      console.log('🎯 Marking personal-toolkit as complete - ensuring data is saved');
      
      // Get the current toolkit data from the component if available
      let toolkitData = module.userProgress?.['personal-toolkit']?.worksheetData;
      
      // If we have a data getter from the component, use the most current data
      if (toolkitDataGetter) {
        const currentToolkitData = toolkitDataGetter();
        console.log('💾 Getting current toolkit data from component:', currentToolkitData);
        toolkitData = currentToolkitData;
      }
      
      if (toolkitData) {
        console.log('💾 Toolkit data found, ensuring it\'s saved before completion');
        updatedUserProgress['personal-toolkit'] = {
          ...updatedUserProgress['personal-toolkit'],
          worksheetData: toolkitData,
          lastUpdated: new Date().toISOString()
        };
      }
    }

    // Special handling for relapse-prevention-plan: ensure any current relapse data is saved
    if (activityId === 'relapse-prevention-plan' && newCompletionStatus) {
      console.log('🎯 Marking relapse-prevention-plan as complete - ensuring data is saved');
      
      // Get the current relapse data from the component if available
      let relapseData = module.userProgress?.['relapse-prevention-plan']?.worksheetData;
      
      // If we have a data getter from the component, use the most current data
      if (relapseDataGetter) {
        const currentRelapseData = relapseDataGetter();
        console.log('💾 Getting current relapse data from component:', currentRelapseData);
        relapseData = currentRelapseData;
      }
      
      // If we have relapse data, ensure it's saved before completion
      if (relapseData) {
        console.log('💾 Relapse data found, ensuring it\'s saved before completion');
        updatedUserProgress['relapse-prevention-plan'] = {
          ...updatedUserProgress['relapse-prevention-plan'],
          worksheetData: relapseData,
          lastUpdated: new Date().toISOString()
        };
      }
    }

    // Special handling for nhs-transition-prep: ensure any current NHS data is saved
    if (activityId === 'nhs-transition-prep' && newCompletionStatus) {
      console.log('🎯 Marking nhs-transition-prep as complete - ensuring data is saved');
      
      // Get the current NHS data from the component if available
      let nhsData = module.userProgress?.['nhs-transition-prep']?.worksheetData;
      
      // If we have a data getter from the component, use the most current data
      if (nhsDataGetter) {
        const currentNhsData = nhsDataGetter();
        console.log('💾 Getting current NHS data from component:', currentNhsData);
        nhsData = currentNhsData;
      }
      
      // If we have NHS data, ensure it's saved before completion
      if (nhsData) {
        console.log('💾 NHS data found, ensuring it\'s saved before completion');
        updatedUserProgress['nhs-transition-prep'] = {
          ...updatedUserProgress['nhs-transition-prep'],
          worksheetData: nhsData,
          lastUpdated: new Date().toISOString()
        };
      }
    }
    
    // Count completed activities and minutes using the updated progress
    const completedActivities = moduleContent.activities.filter((a: any) => {
      const activityProgress = updatedUserProgress[a.id];
      return activityProgress?.completed || false;
    });
    
    const newActivitiesCompleted = completedActivities.length;
    const calculatedMinutes = completedActivities.reduce((total: number, a: any) => {
      return total + (a.estimatedMinutes || 0);
    }, 0);
    
    // Cap minutesCompleted at the module's estimatedMinutes to prevent >100% completion
    const newMinutesCompleted = Math.min(calculatedMinutes, module.estimatedMinutes);
    
    // Update module progress
    const updates = {
      activitiesCompleted: newActivitiesCompleted,
      minutesCompleted: newMinutesCompleted,
      userProgress: updatedUserProgress
    };
    
    console.log('🎯 Activity completion update:', { activityId, newCompletionStatus, updates });
    
    // Save to backend
    updateModuleMutation.mutate({
      moduleId: module.id,
      updates,
    });
  };

  const handleStartActivity = (activityId: string) => {
    setCurrentActivity(activityId);
    setIsTimerRunning(true);
    setTimer(0);
  };

  const handleWorksheetCheckboxChange = (activityId: string, category: string, itemIndex: number, checked: boolean) => {
    const newWorksheetData = {
      ...worksheetData,
      [activityId]: {
        ...worksheetData[activityId],
        [`${category}-${itemIndex}`]: checked
      }
    };
    
    setWorksheetData(newWorksheetData);
    
    // Auto-save worksheet data when checkbox changes
    if (module) {
      const updatedUserProgress = {
        ...(module.userProgress || {}),
        [activityId]: {
          ...(module.userProgress?.[activityId] || {}),
          worksheetData: newWorksheetData[activityId] || {}
        }
      };
      
      // Save to backend immediately
      updateModuleMutation.mutate({
        moduleId: module.id,
        updates: {
          userProgress: updatedUserProgress
        },
      });
    }
  };

  const getWorksheetCheckboxState = (activityId: string, category: string, itemIndex: number) => {
    return worksheetData[activityId]?.[`${category}-${itemIndex}`] || false;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CrisisBanner />
      <TabNavigation />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/anxiety-track">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Track
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Week {weekNumber}: {moduleContent.title}
              </h1>
              <p className="text-muted-foreground">{moduleContent.description}</p>
            </div>
          </div>

          {/* Progress & Timer */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Session Time: {formatTime(timer)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    data-testid={isTimerRunning ? "button-pause-timer" : "button-start-timer"}
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isTimerRunning ? "Pause" : "Start"}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activities.filter(a => a.isCompleted).length} of {activities.length} activities completed
                </div>
              </div>
              <Progress 
                value={(activities.filter(a => a.isCompleted).length / activities.length) * 100} 
                className="mt-3"
              />
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {moduleContent.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                    <span className="text-sm">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Activities */}
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const IconComponent = activityIcons[activity.type];
              const isActive = currentActivity === activity.id;
              
              return (
                <Card key={activity.id} className={cn("transition-all", isActive && "border-primary")}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          activity.isCompleted ? "bg-accent" : "bg-muted"
                        )}>
                          {activity.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-accent-foreground" />
                          ) : (
                            <IconComponent className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{activity.title}</CardTitle>
                          <p className="text-muted-foreground text-sm mt-1">{activity.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              <Timer className="w-3 h-3 mr-1" />
                              {activity.estimatedMinutes} min
                            </Badge>
                            <Badge variant="outline" className="text-xs capitalize">
                              {activity.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {!activity.isCompleted && (
                          <Button
                            size="sm"
                            onClick={() => handleStartActivity(activity.id)}
                            data-testid={`button-start-activity-${activity.id}`}
                          >
                            Start
                          </Button>
                        )}
                        <Checkbox
                          checked={activity.isCompleted}
                          onCheckedChange={() => handleActivityComplete(activity.id)}
                          data-testid={`checkbox-complete-activity-${activity.id}`}
                        />
                      </div>
                    </div>
                  </CardHeader>

                  {/* Activity Content (expanded when active) */}
                  {isActive && (
                    <CardContent className="border-t">
                      <div className="pt-4">
                        {activity.type === 'reading' && (
                          <div className="prose prose-sm max-w-none">
                            <div 
                              className="whitespace-pre-line text-sm leading-relaxed"
                              dangerouslySetInnerHTML={{ 
                                __html: activity.content.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                              }}
                            />
                          </div>
                        )}
                        
                        {activity.type === 'breathing' && (
                          <div className="space-y-4">
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">Instructions:</h4>
                              <ol className="list-decimal list-inside space-y-1 text-sm">
                                {activity.content.instructions.map((instruction: string, idx: number) => (
                                  <li key={idx}>{instruction}</li>
                                ))}
                              </ol>
                            </div>
                            {activity.content.guidance && (
                              <p className="text-sm text-muted-foreground italic">
                                💡 {activity.content.guidance}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {activity.type === 'worksheet' && activity.content.checklist && (
                          <div className="space-y-4">
                            {activity.content.checklist.map((category: any, idx: number) => (
                              <div key={idx}>
                                <h4 className="font-medium mb-2">{category.category} Symptoms:</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {category.items.map((item: string, itemIdx: number) => (
                                    <div key={itemIdx} className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`${category.category}-${itemIdx}`}
                                        checked={getWorksheetCheckboxState(activity.id, category.category, itemIdx)}
                                        onCheckedChange={(checked) => 
                                          handleWorksheetCheckboxChange(activity.id, category.category, itemIdx, !!checked)
                                        }
                                        data-testid={`checkbox-${activity.id}-${category.category}-${itemIdx}`}
                                      />
                                      <label 
                                        htmlFor={`${category.category}-${itemIdx}`}
                                        className="text-sm"
                                      >
                                        {item}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                            <div className="pt-4 border-t">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // Save worksheet data to module progress
                                  const updatedUserProgress = {
                                    ...module.userProgress,
                                    [activity.id]: {
                                      ...module.userProgress?.[activity.id],
                                      worksheetData: worksheetData[activity.id] || {}
                                    }
                                  };
                                  
                                  // Recalculate progress counters
                                  const moduleContent = getModuleContentWithProgress(module.weekNumber, module);
                                  const completedActivities = moduleContent.activities.filter((a: any) => {
                                    const activityProgress = updatedUserProgress[a.id];
                                    return activityProgress?.completed || false;
                                  });
                                  
                                  const newActivitiesCompleted = completedActivities.length;
                                  const newMinutesCompleted = completedActivities.reduce((total: number, a: any) => {
                                    return total + (a.estimatedMinutes || 0);
                                  }, 0);
                                  
                                  const updates = {
                                    activitiesCompleted: newActivitiesCompleted,
                                    minutesCompleted: newMinutesCompleted,
                                    userProgress: updatedUserProgress
                                  };
                                  
                                  updateModuleMutation.mutate({
                                    moduleId: module.id,
                                    updates,
                                  });
                                }}
                              >
                                Save Worksheet
                              </Button>
                            </div>
                          </div>
                        )}

                        {activity.type === 'worksheet' && activity.id === 'values-assessment' && (
                          <div className="mt-6">
                            <ValuesWorksheet 
                              initialData={module?.userProgress?.['values-assessment']?.worksheetData}
                              onDataChange={(data) => {
                                // Auto-save worksheet data when it changes
                                console.log('💾 Values Worksheet onDataChange called with:', data);
                                if (module) {
                                  const updatedUserProgress = {
                                    ...(module.userProgress || {}),
                                    'values-assessment': {
                                      ...(module.userProgress?.['values-assessment'] || {}),
                                      worksheetData: data,
                                      lastUpdated: new Date().toISOString()
                                    }
                                  };
                                  
                                  console.log('💾 Updated userProgress structure:', updatedUserProgress);
                                  
                                  // Debounce the save to avoid too many API calls
                                  clearTimeout((window as any).valuesWorksheetSaveTimeout);
                                  (window as any).valuesWorksheetSaveTimeout = setTimeout(() => {
                                    console.log('💾 Saving Values Worksheet data to module:', module.id);
                                    updateModuleMutation.mutate({
                                      moduleId: module.id,
                                      updates: { userProgress: updatedUserProgress },
                                    });
                                  }, 1000);
                                }
                              }}
                            />
                          </div>
                        )}

                        {activity.type === 'assessment' && activity.id === 'progress-review' && (
                          <div className="mt-6">
                            <ProgressTracker 
                              initialData={module?.userProgress?.['progress-review']?.worksheetData}
                              onDataChange={(data) => {
                                // Auto-save worksheet data when it changes
                                if (module) {
                                  const updatedUserProgress = {
                                    ...(module.userProgress || {}),
                                    'progress-review': {
                                      ...(module.userProgress?.['progress-review'] || {}),
                                      worksheetData: data
                                    }
                                  };
                                  
                                  // Debounce the save to avoid too many API calls
                                  clearTimeout((window as any).progressTrackerSaveTimeout);
                                  (window as any).progressTrackerSaveTimeout = setTimeout(() => {
                                    updateModuleMutation.mutate({
                                      moduleId: module.id,
                                      updates: { userProgress: updatedUserProgress },
                                    });
                                  }, 1000);
                                }
                              }}
                            />
                          </div>
                        )}

                        {activity.type === 'worksheet' && activity.id === 'personal-toolkit' && (
                          <div className="mt-6">
                            <ToolkitBuilder 
                              initialData={module?.userProgress?.['personal-toolkit']?.worksheetData}
                              onGetCurrentData={(getData) => {
                                console.log('📋 Toolkit Builder data getter registered');
                                setToolkitDataGetter(() => getData);
                              }}
                              onSave={(data) => {
                                console.log('🔘 Manual save triggered for Toolkit Builder');
                                if (module) {
                                  const updatedUserProgress = {
                                    ...(module.userProgress || {}),
                                    'personal-toolkit': {
                                      ...(module.userProgress?.['personal-toolkit'] || {}),
                                      worksheetData: data,
                                      lastUpdated: new Date().toISOString()
                                    }
                                  };
                                  
                                  console.log('🔘 Manual save - Updated userProgress:', updatedUserProgress);
                                  
                                  updateModuleMutation.mutate({
                                    moduleId: module.id,
                                    updates: { userProgress: updatedUserProgress },
                                  });
                                }
                              }}
                              onDataChange={(data) => {
                                // Auto-save worksheet data when it changes
                                console.log('💾 Toolkit Builder onDataChange called with:', data);
                                if (module) {
                                  const updatedUserProgress = {
                                    ...(module.userProgress || {}),
                                    'personal-toolkit': {
                                      ...(module.userProgress?.['personal-toolkit'] || {}),
                                      worksheetData: data,
                                      lastUpdated: new Date().toISOString()
                                    }
                                  };
                                  
                                  console.log('💾 Updated userProgress structure for toolkit:', updatedUserProgress);
                                  
                                  // Debounce the save to avoid too many API calls
                                  console.log('⏰ Clearing previous timeout and setting new one...');
                                  clearTimeout((window as any).toolkitBuilderSaveTimeout);
                                  (window as any).toolkitBuilderSaveTimeout = setTimeout(() => {
                                    console.log('💾 Saving Toolkit Builder data to module:', module.id);
                                    console.log('💾 Final data being saved:', updatedUserProgress);
                                    updateModuleMutation.mutate({
                                      moduleId: module.id,
                                      updates: { userProgress: updatedUserProgress },
                                    });
                                  }, 1000);
                                  console.log('⏰ Timeout set, will save in 1000ms');
                                }
                              }}
                            />
                          </div>
                        )}

                        {activity.type === 'worksheet' && activity.id === 'relapse-prevention-plan' && (
                          <div className="mt-6">
                            <RelapsePlanner 
                              initialData={module?.userProgress?.['relapse-prevention-plan']?.worksheetData}
                              onGetCurrentData={(getData) => {
                                console.log('📋 Relapse Planner data getter registered');
                                setRelapseDataGetter(() => getData);
                              }}
                              onDataChange={(data) => {
                                // Auto-save worksheet data when it changes
                                if (module) {
                                  const updatedUserProgress = {
                                    ...(module.userProgress || {}),
                                    'relapse-prevention-plan': {
                                      ...(module.userProgress?.['relapse-prevention-plan'] || {}),
                                      worksheetData: data
                                    }
                                  };
                                  
                                  // Debounce the save to avoid too many API calls
                                  clearTimeout((window as any).relapsePlannerSaveTimeout);
                                  (window as any).relapsePlannerSaveTimeout = setTimeout(() => {
                                    updateModuleMutation.mutate({
                                      moduleId: module.id,
                                      updates: { userProgress: updatedUserProgress },
                                    });
                                  }, 1000);
                                }
                              }}
                            />
                          </div>
                        )}

                        {activity.type === 'reading' && activity.id === 'nhs-transition-prep' && (
                          <div className="mt-6">
                            <NhsPrepGuide 
                              initialData={module?.userProgress?.['nhs-transition-prep']?.worksheetData}
                              onGetCurrentData={(getData) => {
                                console.log('📋 NHS Prep Guide data getter registered');
                                setNhsDataGetter(() => getData);
                              }}
                              onDataChange={(data) => {
                                // Auto-save worksheet data when it changes
                                if (module) {
                                  const updatedUserProgress = {
                                    ...(module.userProgress || {}),
                                    'nhs-transition-prep': {
                                      ...(module.userProgress?.['nhs-transition-prep'] || {}),
                                      worksheetData: data
                                    }
                                  };
                                  
                                  // Debounce the save to avoid too many API calls
                                  clearTimeout((window as any).nhsPrepSaveTimeout);
                                  (window as any).nhsPrepSaveTimeout = setTimeout(() => {
                                    updateModuleMutation.mutate({
                                      moduleId: module.id,
                                      updates: { userProgress: updatedUserProgress },
                                    });
                                  }, 1000);
                                }
                              }}
                            />
                          </div>
                        )}
                        
                        {activity.type === 'reflection' && (
                          <div className="space-y-4">
                            {activity.content.prompts.map((prompt: string, idx: number) => (
                              <div key={idx} className="space-y-2">
                                <label className="text-sm font-medium">{prompt}</label>
                                <Textarea
                                  placeholder="Write your thoughts here..."
                                  value={reflections[`${activity.id}-${idx}`] || ""}
                                  onChange={(e) => {
                                    const newReflections = {
                                      ...reflections,
                                      [`${activity.id}-${idx}`]: e.target.value
                                    };
                                    setReflections(newReflections);
                                    
                                    // Auto-save reflection data when user types
                                    if (module) {
                                      const updatedUserProgress = {
                                        ...(module.userProgress || {}),
                                        [activity.id]: {
                                          ...(module.userProgress?.[activity.id] || {}),
                                          reflectionData: Object.keys(newReflections)
                                            .filter(key => key.startsWith(activity.id))
                                            .reduce((acc, key) => {
                                              acc[key] = newReflections[key];
                                              return acc;
                                            }, {} as Record<string, string>)
                                        }
                                      };
                                      
                                      // Debounce the save to avoid too many API calls
                                      clearTimeout((window as any).reflectionSaveTimeout);
                                      (window as any).reflectionSaveTimeout = setTimeout(() => {
                                        setReflectionSaving(true);
                                        updateModuleMutation.mutate({
                                          moduleId: module.id,
                                          updates: { userProgress: updatedUserProgress },
                                        }, {
                                          onSuccess: () => {
                                            setReflectionSaving(false);
                                          },
                                          onError: () => {
                                            setReflectionSaving(false);
                                          }
                                        });
                                      }, 1000); // Save 1 second after user stops typing
                                    }
                                  }}
                                  data-testid={`textarea-reflection-${activity.id}-${idx}`}
                                />
                              </div>
                            ))}
                            
                            {/* Auto-save indicator */}
                            {reflectionSaving && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                                Auto-saving...
                              </div>
                            )}
                            
                            <div className="pt-4 border-t">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // Save reflection data to module progress
                                  const updatedUserProgress = {
                                    ...module.userProgress,
                                    [activity.id]: {
                                      ...module.userProgress?.[activity.id],
                                      reflectionData: Object.keys(reflections)
                                        .filter(key => key.startsWith(activity.id))
                                        .reduce((acc, key) => {
                                          acc[key] = reflections[key];
                                          return acc;
                                        }, {} as Record<string, string>)
                                    }
                                  };
                                  
                                  // Recalculate progress counters
                                  const moduleContent = getModuleContentWithProgress(module.weekNumber, module);
                                  const completedActivities = moduleContent.activities.filter((a: any) => {
                                    const activityProgress = updatedUserProgress[a.id];
                                    return activityProgress?.completed || false;
                                  });
                                  
                                  const newActivitiesCompleted = completedActivities.length;
                                  const newMinutesCompleted = completedActivities.reduce((total: number, a: any) => {
                                    return total + (a.estimatedMinutes || 0);
                                  }, 0);
                                  
                                  const updates = {
                                    activitiesCompleted: newActivitiesCompleted,
                                    minutesCompleted: newMinutesCompleted,
                                    userProgress: updatedUserProgress
                                  };
                                  
                                  updateModuleMutation.mutate({
                                    moduleId: module.id,
                                    updates,
                                  });
                                }}
                              >
                                Save Reflections
                              </Button>
                            </div>
                          </div>
                        )}

                        {activity.type === 'exercise' && (
                          <div className="space-y-4">
                            <div className="prose prose-sm max-w-none">
                              <div 
                                className="whitespace-pre-line text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{ 
                                  __html: activity.content.instructions?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') ||
                                         activity.content.script?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Notes Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Personal Notes & Reflections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write down any insights, questions, or thoughts about this module..."
                value={notes}
                onChange={(e) => {
                  const newNotes = e.target.value;
                  setNotes(newNotes);
                  
                  // Auto-save notes when user types
                  if (module) {
                    const updatedUserProgress = {
                      ...(module.userProgress || {}),
                      moduleNotes: newNotes
                    };
                    
                    // Debounce the save to avoid too many API calls
                    clearTimeout((window as any).notesSaveTimeout);
                    (window as any).notesSaveTimeout = setTimeout(() => {
                      setNotesSaving(true);
                      updateModuleMutation.mutate({
                        moduleId: module.id,
                        updates: { userProgress: updatedUserProgress },
                      }, {
                        onSuccess: () => {
                          setNotesSaving(false);
                        },
                        onError: () => {
                          setNotesSaving(false);
                        }
                      });
                    }, 1000); // Save 1 second after user stops typing
                  }
                }}
                className="min-h-[100px]"
                data-testid="textarea-module-notes"
              />
              
              {/* Auto-save indicator for notes */}
              {notesSaving && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Auto-saving notes...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Module Completion Section */}
          <Card className="mt-6 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {module?.activitiesCompleted >= module?.activitiesTotal 
                        ? "Ready to Complete Module!" 
                        : "Keep Going!"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {module?.activitiesCompleted || 0} of {module?.activitiesTotal || 0} activities completed
                    </p>
                  </div>
                </div>
                
                {(() => {
                  // Calculate actual completion status based on user progress
                  const moduleContent = getModuleContentWithProgress(weekNumber, module || {});
                  const actualCompletedActivities = moduleContent.activities.filter((a: any) => a.isCompleted).length;
                  const actualTotalActivities = moduleContent.activities.length;
                  const isActuallyComplete = actualCompletedActivities >= actualTotalActivities;
                  
                  return isActuallyComplete ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Great job! You've completed all {actualTotalActivities} activities in this module. You can now mark it as complete.
                      </p>
                      <Button 
                        size="lg" 
                        onClick={() => {
                          if (!module) return;
                          
                          // Recalculate final progress to ensure accuracy
                          const moduleContent = getModuleContentWithProgress(weekNumber, module);
                          const completedActivities = moduleContent.activities.filter((a: any) => a.isCompleted);
                          const finalActivitiesCompleted = completedActivities.length;
                          const finalMinutesCompleted = completedActivities.reduce((total: number, a: any) => {
                            return total + (a.estimatedMinutes || 0);
                          }, 0);
                          
                          const updates = {
                            completedAt: new Date().toISOString(),
                            minutesCompleted: finalMinutesCompleted,
                            activitiesCompleted: finalActivitiesCompleted
                            // Don't send userProgress here - let the backend preserve existing data
                          };
                          
                          updateModuleMutation.mutate({
                            moduleId: module.id,
                            updates,
                          }, {
                            onSuccess: () => {
                              // Show success state
                              setModuleCompleted(true);
                              
                              // Redirect to anxiety track page after successful completion
                              setTimeout(() => {
                                setLocation("/anxiety-track");
                              }, 1500); // Show success message for 1.5 seconds
                            }
                          });
                        }}
                        disabled={updateModuleMutation.isPending || moduleCompleted}
                        className="px-8"
                        data-testid="button-finish-module"
                      >
                        {moduleCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Module Completed! Redirecting...
                          </>
                        ) : updateModuleMutation.isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Completing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Finish Module
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Complete all activities above to finish this module.
                      </p>
                      <Progress 
                        value={actualCompletedActivities / actualTotalActivities * 100} 
                        className="w-full max-w-xs mx-auto h-2"
                      />
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}