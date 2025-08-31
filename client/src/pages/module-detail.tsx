import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/ui/header";
import { TabNavigation } from "@/components/ui/tab-navigation";
import { CrisisBanner } from "@/components/ui/crisis-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  const weekNumber = parseInt((params as any)?.weekNumber || "1");
  const mockUserId = "user-1";
  
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [notes, setNotes] = useState("");
  const [reflections, setReflections] = useState<Record<string, string>>({});

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
    queryKey: ["/api/modules", mockUserId],
  });

  const updateModuleMutation = useMutation({
    mutationFn: async ({ moduleId, updates }: { moduleId: string; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/modules/${moduleId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules", mockUserId] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading module...</div>
      </div>
    );
  }

  const modules = (modulesData as any)?.modules || [];
  const module = modules.find((m: any) => m.weekNumber === weekNumber);

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

**Step 1: Life Areas**
Rate how important each area is to you (1-10):
• Family relationships
• Friendships
• Career/work
• Education/learning
• Health/fitness
• Recreation/fun
• Community involvement
• Spirituality/personal growth

**Step 2: Values in Each Area**
For your highest-rated areas, identify your core values:
Examples: Connection, growth, creativity, adventure, security, helping others

**Step 3: Current vs. Desired**
For each important area:
• How much are you currently living according to your values? (1-10)
• What would be different if you were living more aligned with your values?

**Step 4: Barriers**
What anxiety-related behaviors are keeping you from living according to your values?`,
              reflection_questions: [
                "What values have you been avoiding because of anxiety?",
                "What would you do differently if anxiety wasn't holding you back?",
                "What small step toward your values could you take this week?"
              ]
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
            estimatedMinutes: 15,
            isCompleted: false,
            content: {
              instructions: `Take time to reflect on your progress through this 6-week program:

**Skills Learned:**
Review each week and identify the most helpful techniques:
• Week 1: Understanding Anxiety - What insights were most valuable?
• Week 2: Breathing & Relaxation - Which techniques work best for you?
• Week 3: Cognitive Strategies - How has your thinking changed?
• Week 4: Mindfulness & Grounding - What mindfulness practices do you enjoy?
• Week 5: Behavioral Activation - What fears have you faced?

**Changes You've Noticed:**
• How do you handle anxiety differently now?
• What situations feel more manageable?
• How has your daily life improved?
• What are you most proud of achieving?

**Remaining Challenges:**
• What areas still feel difficult?
• What would you like to continue working on?
• Where might you need additional support?

**Rating Your Progress:**
• Anxiety management skills: 1-10
• Confidence in handling anxiety: 1-10
• Quality of life: 1-10
• Readiness for NHS transition: 1-10`,
              reflection_prompts: [
                "What is the biggest change you've made?",
                "Which week was most helpful and why?",
                "What would you tell someone starting this program?",
                "How do you want to continue growing?"
              ]
            }
          },
          {
            id: "personal-toolkit",
            type: "worksheet" as const,
            title: "Creating Your Personal Anxiety Toolkit",
            description: "Compile your most effective techniques into a personalized toolkit",
            estimatedMinutes: 20,
            isCompleted: false,
            content: {
              instructions: `Create a personalized toolkit with your most effective anxiety management strategies:

**Emergency Techniques (For Acute Anxiety):**
Choose 2-3 techniques that work quickly:
• Grounding techniques (5-4-3-2-1)
• Box breathing or diaphragmatic breathing
• Progressive muscle relaxation
• Mindful observation

**Daily Maintenance Strategies:**
Select ongoing practices to prevent anxiety buildup:
• Morning mindfulness routine
• Regular exercise or movement
• Evening relaxation practice
• Weekly values-based activities

**Thought Management Tools:**
Pick your favorite cognitive techniques:
• Thought record worksheet
• Challenging questions
• Balanced thinking strategies
• Mindful observation of thoughts

**Behavioral Strategies:**
Include gradual exposure and activation plans:
• Your exposure hierarchy
• Values-based goals
• Behavioral experiments
• Social connection activities

**Warning Signs & Action Plan:**
Identify early signs that anxiety is increasing:
• Physical signs (tension, sleep changes)
• Emotional signs (increased worry, irritability)
• Behavioral signs (avoiding activities, isolation)
• When you notice these signs, what will you do?`,
              template: {
                emergency_techniques: [],
                daily_practices: [],
                thought_tools: [],
                behavioral_strategies: [],
                warning_signs: [],
                action_plan: ""
              }
            }
          },
          {
            id: "relapse-prevention-plan",
            type: "worksheet" as const,
            title: "Relapse Prevention Plan",
            description: "Prepare strategies for managing setbacks and maintaining progress",
            estimatedMinutes: 15,
            isCompleted: false,
            content: {
              instructions: `Recovery isn't linear - there will be ups and downs. A relapse prevention plan helps you navigate difficult periods:

**Understanding Setbacks:**
Setbacks are normal and don't erase your progress. They're opportunities to practice your skills.

**High-Risk Situations:**
When might your anxiety be more challenging?
• Major life changes (job, relationship, health)
• Stressful periods (exams, deadlines, conflicts)
• Seasonal changes or anniversaries
• Physical illness or fatigue

**Early Warning System:**
How will you know if anxiety is becoming problematic again?
• Severity: Anxiety interfering with daily activities
• Duration: Anxiety lasting weeks without improvement
• Avoidance: Returning to old avoidance patterns
• Isolation: Withdrawing from support systems

**Action Steps for Setbacks:**
1. **Immediate Response:** Use your emergency toolkit
2. **Short-term:** Return to daily practices and review your progress
3. **Medium-term:** Seek additional support if needed
4. **Long-term:** Adjust your maintenance plan

**Support Network:**
Who can you turn to for support?
• Trusted friends or family members
• Mental health professionals
• Support groups or online communities
• NHS services

**Professional Support Triggers:**
When should you seek professional help?
• Suicidal thoughts or self-harm urges
• Inability to function in daily life for 2+ weeks
• Substance use to cope with anxiety
• Anxiety significantly worsening despite using tools`,
              emergency_contacts: [
                "Crisis Line: 116 123 (Samaritans)",
                "NHS 111 for urgent but non-emergency help",
                "999 for immediate emergency situations"
              ]
            }
          },
          {
            id: "nhs-transition-prep",
            type: "reading" as const,
            title: "Preparing for NHS Mental Health Services",
            description: "Get ready for your transition to NHS care with confidence",
            estimatedMinutes: 10,
            isCompleted: false,
            content: {
              text: `As you transition to NHS mental health services, you're in a much stronger position than when you started this program. Here's how to make the most of your NHS care:

**What to Expect from NHS Services:**
• Initial assessment with a mental health professional
• Treatment options may include therapy (CBT, counseling) or medication
• Waiting times vary, but you now have skills to manage during any wait
• You may be offered group therapy or individual sessions

**Preparing for Your Assessment:**
• Bring a summary of what you've learned in this program
• Share which techniques have been most helpful
• Discuss areas where you still need support
• Be honest about your current anxiety levels and functioning

**Questions to Ask:**
• What treatment options are available?
• How long is the typical treatment course?
• What should I do if I'm struggling while waiting for treatment?
• Are there any support groups I could join?

**Your Strengths Going Forward:**
• You understand anxiety and how it affects you
• You have a toolkit of proven techniques
• You've practiced facing your fears
• You know your values and what matters to you
• You have a relapse prevention plan

**Continuing Your Progress:**
• Keep using the techniques that work for you
• Continue with your exposure hierarchy
• Maintain your daily anxiety management practices
• Stay connected with your support network

**Remember:** You're not starting from scratch. You're building on a strong foundation of skills and self-awareness.`
            }
          }
        ]
      }
    };
    
    return contents[weekNumber as keyof typeof contents] || contents[1];
  };

  const moduleContent = getModuleContent(weekNumber);
  const activities: ModuleActivity[] = moduleContent.activities;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleActivityComplete = (activityId: string) => {
    // In real implementation, this would update the backend
    console.log(`Completed activity: ${activityId}`);
  };

  const handleStartActivity = (activityId: string) => {
    setCurrentActivity(activityId);
    setIsTimerRunning(true);
    setTimer(0);
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
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Track
            </Button>
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
                                      <Checkbox id={`${category.category}-${itemIdx}`} />
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
                                  onChange={(e) => setReflections(prev => ({
                                    ...prev,
                                    [`${activity.id}-${idx}`]: e.target.value
                                  }))}
                                  data-testid={`textarea-reflection-${activity.id}-${idx}`}
                                />
                              </div>
                            ))}
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
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
                data-testid="textarea-module-notes"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}