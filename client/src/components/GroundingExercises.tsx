import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Eye,
  Ear,
  Hand,
  Heart,
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Mountain,
  Waves,
  TreePine,
  Sun,
  Sparkles,
  Wind
} from "lucide-react";
import { Label } from "@/components/ui/label";

interface GroundingSession {
  technique: string;
  duration: number;
  completedSteps: number;
  startTime: Date;
}

export function GroundingExercises() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [sessions, setSessions] = useState<GroundingSession[]>([]);
  const [selectedTab, setSelectedTab] = useState("54321");

  const exercises = {
    "54321": {
      name: "5-4-3-2-1 Technique",
      description: "Use your senses to ground yourself in the present moment",
      duration: 300, // 5 minutes
      icon: Eye,
      steps: [
        { 
          type: "observation", 
          instruction: "Look around and identify 5 things you can SEE",
          timePerStep: 60
        },
        { 
          type: "observation", 
          instruction: "Notice 4 things you can TOUCH or FEEL",
          timePerStep: 60
        },
        { 
          type: "observation", 
          instruction: "Listen for 3 things you can HEAR",
          timePerStep: 60
        },
        { 
          type: "observation", 
          instruction: "Identify 2 things you can SMELL",
          timePerStep: 60
        },
        { 
          type: "observation", 
          instruction: "Notice 1 thing you can TASTE",
          timePerStep: 60
        }
      ],
      benefits: ["Reduces anxiety", "Grounds in present", "Engages all senses"]
    },
    "body-scan": {
      name: "Progressive Body Scan",
      description: "Systematically relax each part of your body",
      duration: 600, // 10 minutes
      icon: Heart,
      steps: [
        { type: "instruction", instruction: "Close your eyes and take 3 deep breaths", timePerStep: 30 },
        { type: "instruction", instruction: "Focus on your toes - notice any tension, then let it go", timePerStep: 45 },
        { type: "instruction", instruction: "Move to your feet - feel them relax completely", timePerStep: 45 },
        { type: "instruction", instruction: "Let the relaxation flow up to your calves and shins", timePerStep: 45 },
        { type: "instruction", instruction: "Feel your knees and thighs becoming heavy and relaxed", timePerStep: 45 },
        { type: "instruction", instruction: "Release any tension in your hips and lower back", timePerStep: 45 },
        { type: "instruction", instruction: "Let your stomach and chest soften and expand", timePerStep: 45 },
        { type: "instruction", instruction: "Drop your shoulders away from your ears", timePerStep: 45 },
        { type: "instruction", instruction: "Relax your arms from shoulders to fingertips", timePerStep: 45 },
        { type: "instruction", instruction: "Release tension in your neck and jaw", timePerStep: 45 },
        { type: "instruction", instruction: "Soften your face, eyes, and forehead", timePerStep: 45 },
        { type: "instruction", instruction: "Feel your whole body relaxed and grounded", timePerStep: 60 }
      ],
      benefits: ["Physical relaxation", "Body awareness", "Tension release"]
    },
    "breathing-anchor": {
      name: "Breathing Anchor", 
      description: "Use breath as an anchor to the present moment",
      duration: 480, // 8 minutes
      icon: Heart,
      steps: [
        { type: "instruction", instruction: "Sit comfortably and close your eyes", timePerStep: 30 },
        { type: "instruction", instruction: "Place one hand on chest, one on belly", timePerStep: 30 },
        { type: "instruction", instruction: "Breathe naturally and notice which hand moves more", timePerStep: 60 },
        { type: "instruction", instruction: "Focus on the sensation of air entering your nostrils", timePerStep: 60 },
        { type: "instruction", instruction: "Notice the pause between inhale and exhale", timePerStep: 60 },
        { type: "instruction", instruction: "Feel the warm air leaving through your mouth or nose", timePerStep: 60 },
        { type: "instruction", instruction: "When your mind wanders, gently return to your breath", timePerStep: 90 },
        { type: "instruction", instruction: "Continue focusing on breath as your anchor", timePerStep: 90 }
      ],
      benefits: ["Present moment awareness", "Calms mind", "Anxiety reduction"]
    },
    "mental-safe-space": {
      name: "Mental Safe Space",
      description: "Visualize and create your personal sanctuary",
      duration: 540, // 9 minutes
      icon: Mountain,
      steps: [
        { 
          type: "visualization", 
          instruction: "Close your eyes and imagine a place where you feel completely safe and peaceful",
          timePerStep: 90
        },
        { 
          type: "visualization", 
          instruction: "Notice the colors, textures, and lighting in your safe space",
          timePerStep: 90
        },
        { 
          type: "visualization", 
          instruction: "What sounds do you hear in this peaceful place?",
          timePerStep: 90
        },
        { 
          type: "visualization", 
          instruction: "Feel the temperature and any physical sensations",
          timePerStep: 90
        },
        { 
          type: "visualization", 
          instruction: "Notice any pleasant scents in your safe space",
          timePerStep: 90
        },
        { 
          type: "affirmation", 
          instruction: "Repeat: 'I am safe, I am calm, I am in control'",
          timePerStep: 90
        }
      ],
      benefits: ["Creates inner refuge", "Builds resilience", "Emotional regulation"]
    },
    "mindful-observation": {
      name: "Mindful Object Focus",
      description: "Focus completely on a single object to anchor attention",
      duration: 420, // 7 minutes
      icon: Eye,
      steps: [
        { 
          type: "preparation", 
          instruction: "Choose a small object you can hold (coin, stone, pen, etc.)",
          timePerStep: 60
        },
        { 
          type: "observation", 
          instruction: "Look at the object - notice its shape, color, and size",
          timePerStep: 60
        },
        { 
          type: "observation", 
          instruction: "Feel its texture, weight, and temperature",
          timePerStep: 60
        },
        { 
          type: "observation", 
          instruction: "Notice any sounds it makes when you move it",
          timePerStep: 60
        },
        { 
          type: "observation", 
          instruction: "Smell the object - does it have a scent?",
          timePerStep: 60
        },
        { 
          type: "reflection", 
          instruction: "Reflect on how this focused attention made you feel",
          timePerStep: 120
        }
      ],
      benefits: ["Improves focus", "Reduces rumination", "Present moment awareness"]
    }
  };

  const currentExercise = activeExercise ? exercises[activeExercise as keyof typeof exercises] : null;
  const currentStepData = currentExercise?.steps[currentStep];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      // Move to next step or complete exercise
      if (currentStep < (currentExercise?.steps.length || 0) - 1) {
        setCurrentStep(prev => prev + 1);
        setTimeRemaining(currentExercise?.steps[currentStep + 1]?.timePerStep || 60);
        if (currentStepData?.type === "observation" || currentStepData?.type === "visualization") {
          setUserInputs(prev => [...prev, ""]);
        }
      } else {
        // Exercise complete
        completeExercise();
      }
    }
    return () => clearTimeout(timer);
  }, [isActive, timeRemaining, currentStep, currentExercise, currentStepData]);

  const startExercise = (exerciseKey: string) => {
    const exercise = exercises[exerciseKey as keyof typeof exercises];
    setActiveExercise(exerciseKey);
    setCurrentStep(0);
    setTimeRemaining(exercise.steps[0]?.timePerStep || 60);
    setIsActive(true);
    setUserInputs([]);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resumeExercise = () => {
    setIsActive(true);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentStep(0);
    setTimeRemaining(currentExercise?.steps[0]?.timePerStep || 60);
    setUserInputs([]);
  };

  const completeExercise = () => {
    if (currentExercise) {
      const session: GroundingSession = {
        technique: currentExercise.name,
        duration: currentExercise.duration,
        completedSteps: currentStep + 1,
        startTime: new Date()
      };
      setSessions(prev => [session, ...prev].slice(0, 10));
    }
    setIsActive(false);
    setActiveExercise(null);
    setCurrentStep(0);
    setUserInputs([]);
  };

  const updateUserInput = (value: string) => {
    setUserInputs(prev => {
      const newInputs = [...prev];
      newInputs[currentStep] = value;
      return newInputs;
    });
  };

  const getProgress = () => {
    if (!currentExercise) return 0;
    return ((currentStep + 1) / currentExercise.steps.length) * 100;
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "observation": return Eye;
      case "visualization": return Mountain;
      case "instruction": return Heart;
      case "affirmation": return Sparkles;
      default: return CheckCircle;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-green-600" />
            Interactive Grounding & Mindfulness
          </CardTitle>
          <p className="text-muted-foreground">
            Evidence-based techniques to bring your attention to the present moment
          </p>
        </CardHeader>
      </Card>

      {!activeExercise ? (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="54321">5-4-3-2-1</TabsTrigger>
            <TabsTrigger value="body-scan">Body Scan</TabsTrigger>
            <TabsTrigger value="breathing-anchor">Breathing</TabsTrigger>
            <TabsTrigger value="mental-safe-space">Safe Space</TabsTrigger>
            <TabsTrigger value="mindful-observation">Object Focus</TabsTrigger>
          </TabsList>

          {Object.entries(exercises).map(([key, exercise]) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <exercise.icon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle>{exercise.name}</CardTitle>
                        <p className="text-muted-foreground">{exercise.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{Math.round(exercise.duration / 60)} min</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Exercise Steps</h4>
                    <div className="space-y-2">
                      {exercise.steps.map((step, index) => {
                        const StepIcon = getStepIcon(step.type);
                        return (
                          <div key={index} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <div className="flex items-start gap-2 flex-1">
                              <StepIcon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-sm">{step.instruction}</p>
                                <p className="text-xs text-muted-foreground">
                                  ~{Math.round(step.timePerStep / 60)} minute{step.timePerStep >= 120 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Benefits</h4>
                    <div className="flex flex-wrap gap-2">
                      {exercise.benefits.map((benefit, index) => (
                        <Badge key={index} variant="outline" className="text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => startExercise(key)}
                    className="w-full gap-2"
                    data-testid={`button-start-${key}`}
                  >
                    <Play className="w-4 h-4" />
                    Start {exercise.name}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <currentExercise.icon className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle>{currentExercise.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {currentExercise.steps.length}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{timeRemaining}s</div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(getProgress())}%</span>
              </div>
              <Progress value={getProgress()} className="h-3" />
            </div>

            {/* Current Step */}
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {React.createElement(getStepIcon(currentStepData?.type || "instruction"), {
                  className: "w-8 h-8 text-blue-600"
                })}
              </div>
              <h3 className="text-lg font-semibold mb-3">
                {currentStepData?.instruction}
              </h3>
              
              {(currentStepData?.type === "observation" || currentStepData?.type === "visualization") && (
                <div className="mt-4">
                  <Textarea
                    value={userInputs[currentStep] || ""}
                    onChange={(e) => updateUserInput(e.target.value)}
                    placeholder="Take your time to observe and describe what you notice..."
                    rows={3}
                    className="mt-2"
                    data-testid={`textarea-step-${currentStep}`}
                  />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              {isActive ? (
                <Button onClick={pauseExercise} variant="secondary" className="gap-2">
                  <Pause className="w-4 h-4" />
                  Pause
                </Button>
              ) : (
                <Button onClick={resumeExercise} className="gap-2">
                  <Play className="w-4 h-4" />
                  Resume
                </Button>
              )}
              
              <Button onClick={resetExercise} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Restart
              </Button>
              
              <Button onClick={() => setActiveExercise(null)} variant="ghost">
                Exit Exercise
              </Button>
            </div>

            {/* Previous Inputs Summary */}
            {userInputs.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Your Observations So Far</h4>
                <div className="space-y-2">
                  {userInputs.map((input, index) => (
                    input && (
                      <div key={index} className="text-sm">
                        <strong>Step {index + 1}:</strong> {input}
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Session History */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Recent Grounding Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{session.technique}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.completedSteps} steps • {Math.round(session.duration / 60)} min
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {session.startTime.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 text-green-800">💡 Grounding Tips</h4>
          <div className="space-y-2 text-sm text-green-700">
            <p>• Use grounding exercises when you feel overwhelmed, anxious, or disconnected</p>
            <p>• There's no "right" way - adapt these techniques to what works for you</p>
            <p>• Practice regularly, even when calm, to build your grounding skills</p>
            <p>• If one technique doesn't help, try another - different methods work for different situations</p>
            <p>• Remember: the goal is to bring your attention to the present moment</p>
            <p>• Be patient with yourself - grounding skills improve with practice</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}