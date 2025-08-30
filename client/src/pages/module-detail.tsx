import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
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
  const [match] = useRoute("/anxiety-track/module/:weekNumber");
  const weekNumber = parseInt((match?.params as any)?.weekNumber || "1");
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
        <div className="text-center">Module not found</div>
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
      }
      // Additional weeks would continue with similar detailed content...
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