import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Zap,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Settings,
  CheckCircle,
  Clock,
  Waves,
  TreePine,
  Sun,
  Moon,
  Mountain,
  Music,
  Coffee
} from "lucide-react";

interface RelaxationSession {
  technique: string;
  duration: number;
  completedSteps: number;
  startTime: Date;
}

export function RelaxationTools() {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(10);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessions, setSessions] = useState<RelaxationSession[]>([]);
  const [selectedTab, setSelectedTab] = useState("pmr");

  const techniques = {
    "pmr": {
      name: "Progressive Muscle Relaxation",
      description: "Systematically tense and relax muscle groups throughout your body",
      icon: Zap,
      benefits: ["Reduces physical tension", "Improves body awareness", "Promotes deep relaxation"],
      muscleGroups: [
        { name: "Right hand and forearm", instruction: "Make a tight fist with your right hand", duration: 5 },
        { name: "Right upper arm", instruction: "Bend your right arm and tense your bicep", duration: 5 },
        { name: "Left hand and forearm", instruction: "Make a tight fist with your left hand", duration: 5 },
        { name: "Left upper arm", instruction: "Bend your left arm and tense your bicep", duration: 5 },
        { name: "Forehead", instruction: "Raise your eyebrows and wrinkle your forehead", duration: 5 },
        { name: "Eyes and cheeks", instruction: "Squeeze your eyes tightly shut", duration: 5 },
        { name: "Mouth and jaw", instruction: "Clench your teeth and press your lips together", duration: 5 },
        { name: "Neck and throat", instruction: "Pull your shoulders up toward your ears", duration: 5 },
        { name: "Chest", instruction: "Take a deep breath and hold it, tensing your chest", duration: 5 },
        { name: "Back", instruction: "Arch your back and pull your shoulder blades together", duration: 5 },
        { name: "Stomach", instruction: "Tighten your stomach muscles", duration: 5 },
        { name: "Right upper leg", instruction: "Tighten your right thigh muscle", duration: 5 },
        { name: "Right calf", instruction: "Point your right toe up toward your shin", duration: 5 },
        { name: "Right foot", instruction: "Curl your right toes and arch your foot", duration: 5 },
        { name: "Left upper leg", instruction: "Tighten your left thigh muscle", duration: 5 },
        { name: "Left calf", instruction: "Point your left toe up toward your shin", duration: 5 },
        { name: "Left foot", instruction: "Curl your left toes and arch your foot", duration: 5 }
      ]
    },
    "visualization": {
      name: "Guided Visualization",
      description: "Use mental imagery to create a peaceful, relaxing experience",
      icon: Mountain,
      benefits: ["Reduces stress hormones", "Improves mood", "Enhances creativity"],
      scenarios: [
        {
          name: "Beach Paradise",
          icon: Sun,
          steps: [
            "You're walking on a pristine beach with soft, warm sand between your toes",
            "The gentle sound of waves lapping at the shore creates a rhythmic, peaceful melody",
            "A warm, gentle breeze carries the fresh scent of salt water and tropical flowers",
            "The sun warms your skin as you find the perfect spot to relax",
            "You lie down on soft sand or a comfortable beach chair, feeling completely safe and peaceful",
            "With each breath, you sink deeper into relaxation, letting all tension melt away"
          ]
        },
        {
          name: "Forest Sanctuary",
          icon: TreePine,
          steps: [
            "You're walking through a peaceful forest filled with tall, ancient trees",
            "Sunlight filters through the leaves, creating dancing patterns of light and shadow",
            "The air is fresh and clean, filled with the earthy scent of pine and moss",
            "You hear birds singing and leaves rustling gently in the breeze",
            "You find a comfortable clearing where you can sit and rest peacefully",
            "Feel yourself becoming one with nature, deeply grounded and completely at ease"
          ]
        },
        {
          name: "Mountain Lake",
          icon: Mountain,
          steps: [
            "You're standing beside a crystal-clear mountain lake, perfectly still and reflective",
            "The water mirrors the beautiful mountains and clear blue sky above",
            "The air is crisp and pure, filling your lungs with freshness",
            "You can hear the gentle lapping of water and perhaps a bird in the distance",
            "You sit by the water's edge, feeling the solid earth beneath you",
            "With each breath, you feel more connected to the peaceful energy of this special place"
          ]
        },
        {
          name: "Cozy Cabin",
          icon: Coffee,
          steps: [
            "You're in a warm, cozy cabin with a gentle fire crackling in the fireplace",
            "Soft, comfortable furniture surrounds you, and you're wrapped in a warm blanket",
            "The warm glow of the fire creates dancing shadows on the walls",
            "You can hear the gentle crackling of the wood and feel the warmth on your face",
            "Everything you need is within reach - you are completely safe and cared for",
            "You sink deeper into comfort, feeling utterly peaceful and content"
          ]
        }
      ]
    },
    "autogenic": {
      name: "Autogenic Training",
      description: "Use self-suggestion and body awareness to achieve deep relaxation",
      icon: Waves,
      benefits: ["Balances nervous system", "Reduces anxiety", "Improves sleep quality"],
      phrases: [
        { phrase: "My right arm is heavy", focus: "heaviness in right arm", duration: 60 },
        { phrase: "My left arm is heavy", focus: "heaviness in left arm", duration: 60 },
        { phrase: "Both arms are heavy", focus: "heaviness in both arms", duration: 60 },
        { phrase: "My right leg is heavy", focus: "heaviness in right leg", duration: 60 },
        { phrase: "My left leg is heavy", focus: "heaviness in left leg", duration: 60 },
        { phrase: "Both legs are heavy", focus: "heaviness in both legs", duration: 60 },
        { phrase: "My right arm is warm", focus: "warmth flowing through right arm", duration: 60 },
        { phrase: "My left arm is warm", focus: "warmth flowing through left arm", duration: 60 },
        { phrase: "Both arms are warm", focus: "comfortable warmth in both arms", duration: 60 },
        { phrase: "My heartbeat is calm and regular", focus: "steady, peaceful heartbeat", duration: 60 },
        { phrase: "My breathing is calm and effortless", focus: "natural, easy breathing", duration: 60 },
        { phrase: "My solar plexus is warm", focus: "gentle warmth in your stomach area", duration: 60 },
        { phrase: "My forehead is cool and clear", focus: "pleasant coolness across your forehead", duration: 60 },
        { phrase: "I am completely calm and relaxed", focus: "total peace and relaxation", duration: 90 }
      ]
    }
  };

  const currentTechnique = activeSession ? techniques[activeSession as keyof typeof techniques] : null;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      // Move to next step or complete session
      if (currentTechnique) {
        const totalSteps = getTotalSteps(currentTechnique);
        if (currentStep < totalSteps - 1) {
          setCurrentStep(prev => prev + 1);
          setTimeRemaining(getStepDuration(currentTechnique, currentStep + 1));
        } else {
          completeSession();
        }
      }
    }
    return () => clearTimeout(timer);
  }, [isActive, timeRemaining, currentStep, currentTechnique]);

  const getTotalSteps = (technique: any) => {
    if (technique && 'muscleGroups' in technique) return technique.muscleGroups.length * 2; // tension + relaxation
    if (technique && 'scenarios' in technique) return technique.scenarios[0].steps.length;
    if (technique && 'phrases' in technique) return technique.phrases.length;
    return 1;
  };

  const getStepDuration = (technique: any, step: number) => {
    if (technique && 'muscleGroups' in technique) return 10; // 5s tension + 5s relaxation
    if (technique && 'scenarios' in technique) return Math.floor((sessionDuration * 60) / technique.scenarios[0].steps.length);
    if (technique && 'phrases' in technique && technique.phrases[step]) return technique.phrases[step].duration;
    return 60;
  };

  const startSession = (techniqueKey: string) => {
    const technique = techniques[techniqueKey as keyof typeof techniques];
    setActiveSession(techniqueKey);
    setCurrentStep(0);
    setIsActive(true);
    setTimeRemaining(getStepDuration(technique, 0));
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resumeSession = () => {
    setIsActive(true);
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentStep(0);
    if (currentTechnique) {
      setTimeRemaining(getStepDuration(currentTechnique, 0));
    }
  };

  const completeSession = () => {
    if (currentTechnique) {
      const session: RelaxationSession = {
        technique: currentTechnique.name,
        duration: sessionDuration * 60,
        completedSteps: currentStep + 1,
        startTime: new Date()
      };
      setSessions(prev => [session, ...prev].slice(0, 10));
    }
    setIsActive(false);
    setActiveSession(null);
    setCurrentStep(0);
  };

  const getProgress = () => {
    if (!currentTechnique) return 0;
    const totalSteps = getTotalSteps(currentTechnique);
    return ((currentStep + 1) / totalSteps) * 100;
  };

  const getCurrentInstruction = () => {
    if (!currentTechnique) return "";
    
    if ('muscleGroups' in currentTechnique) {
      const muscleIndex = Math.floor(currentStep / 2);
      const muscle = currentTechnique.muscleGroups[muscleIndex];
      const isRelaxation = currentStep % 2 === 1;
      
      if (isRelaxation) {
        return `Now release the tension in your ${muscle.name.toLowerCase()}. Notice the contrast between tension and relaxation. Feel the muscle becoming loose and warm.`;
      } else {
        return `${muscle.instruction}. Hold this tension and notice the feeling.`;
      }
    }
    
    if ('scenarios' in currentTechnique) {
      const scenario = currentTechnique.scenarios[0];
      return scenario.steps[currentStep] || "Continue to relax and enjoy this peaceful experience.";
    }
    
    if ('phrases' in currentTechnique) {
      const phrase = currentTechnique.phrases[currentStep];
      return `Repeat to yourself: "${phrase.phrase}". Focus on ${phrase.focus}. Let this sensation develop naturally.`;
    }
    
    return "Focus on your breathing and allow yourself to relax completely.";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-indigo-600" />
            Interactive Relaxation Tools
          </CardTitle>
          <p className="text-muted-foreground">
            Guided techniques for deep physical and mental relaxation
          </p>
        </CardHeader>
      </Card>

      {!activeSession ? (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pmr">Muscle Relaxation</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="autogenic">Autogenic Training</TabsTrigger>
          </TabsList>

          {Object.entries(techniques).map(([key, technique]) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <technique.icon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle>{technique.name}</CardTitle>
                        <p className="text-muted-foreground">{technique.description}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Session Settings */}
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Session Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium">Duration: {sessionDuration} minutes</Label>
                          <Badge variant="secondary">{sessionDuration} min</Badge>
                        </div>
                        <Slider
                          value={[sessionDuration]}
                          onValueChange={([value]) => setSessionDuration(value)}
                          max={30}
                          min={5}
                          step={5}
                          className="w-full"
                          data-testid="slider-session-duration"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Audio Cues</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className="gap-2"
                        >
                          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                          {soundEnabled ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Technique Details */}
                  {key === "pmr" && 'muscleGroups' in technique && (
                    <div>
                      <h4 className="font-semibold mb-3">Muscle Groups ({technique.muscleGroups.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                        {('muscleGroups' in technique ? technique.muscleGroups : []).map((muscle: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-secondary/20 rounded">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{muscle.name}</p>
                              <p className="text-xs text-muted-foreground">{muscle.instruction}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {key === "visualization" && (
                    <div>
                      <h4 className="font-semibold mb-3">Visualization Scenarios</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {('scenarios' in technique ? technique.scenarios : []).map((scenario: any, index: number) => (
                          <Card key={index} className="border-dashed border-2">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <scenario.icon className="w-5 h-5 text-indigo-600" />
                                <h5 className="font-medium">{scenario.name}</h5>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {scenario.steps.length} guided steps through this peaceful visualization
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {key === "autogenic" && (
                    <div>
                      <h4 className="font-semibold mb-3">Autogenic Phrases ({technique.phrases.length})</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {('phrases' in technique ? technique.phrases : []).map((phrase: any, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-secondary/20 rounded">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium">"{phrase.phrase}"</p>
                              <p className="text-xs text-muted-foreground">{phrase.focus}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold mb-2">Benefits</h4>
                    <div className="flex flex-wrap gap-2">
                      {technique.benefits.map((benefit, index) => (
                        <Badge key={index} variant="outline" className="text-indigo-700 border-indigo-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => startSession(key)}
                    className="w-full gap-2"
                    data-testid={`button-start-${key}`}
                  >
                    <Play className="w-4 h-4" />
                    Start {technique.name}
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
                <currentTechnique.icon className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle>{currentTechnique.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {getTotalSteps(currentTechnique)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{formatTime(timeRemaining)}</div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Session Progress</span>
                <span>{Math.round(getProgress())}%</span>
              </div>
              <Progress value={getProgress()} className="h-3" />
            </div>

            {/* Current Step Instruction */}
            <div className="bg-indigo-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <currentTechnique.icon className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-900">
                {activeSession === "pmr" && currentStep % 2 === 0 ? "Tense" : 
                 activeSession === "pmr" && currentStep % 2 === 1 ? "Relax" :
                 activeSession === "visualization" ? "Visualize" : "Focus"}
              </h3>
              <p className="text-indigo-800 leading-relaxed max-w-2xl mx-auto">
                {getCurrentInstruction()}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              {isActive ? (
                <Button onClick={pauseSession} variant="secondary" className="gap-2">
                  <Pause className="w-4 h-4" />
                  Pause
                </Button>
              ) : (
                <Button onClick={resumeSession} className="gap-2">
                  <Play className="w-4 h-4" />
                  Resume
                </Button>
              )}
              
              <Button onClick={resetSession} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Restart
              </Button>
              
              <Button onClick={() => setActiveSession(null)} variant="ghost">
                Exit Session
              </Button>
            </div>

            {/* Session Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold text-primary">
                    {Math.floor(((sessionDuration * 60) - timeRemaining - (currentStep * getStepDuration(currentTechnique, currentStep))) / 60)}:{((((sessionDuration * 60) - timeRemaining - (currentStep * getStepDuration(currentTechnique, currentStep))) % 60).toString().padStart(2, '0'))}
                  </div>
                  <div className="text-muted-foreground">Elapsed</div>
                </div>
                <div>
                  <div className="font-semibold text-primary">{sessionDuration}:00</div>
                  <div className="text-muted-foreground">Total Duration</div>
                </div>
                <div>
                  <div className="font-semibold text-primary">{currentStep + 1}</div>
                  <div className="text-muted-foreground">Current Step</div>
                </div>
                <div>
                  <div className="font-semibold text-primary">{getTotalSteps(currentTechnique)}</div>
                  <div className="text-muted-foreground">Total Steps</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session History */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Relaxation Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-indigo-600" />
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
                    <p className="text-xs text-muted-foreground">
                      {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 text-indigo-800">💡 Relaxation Tips</h4>
          <div className="space-y-2 text-sm text-indigo-700">
            <p>• Find a quiet, comfortable space where you won't be interrupted</p>
            <p>• Practice at the same time daily to build a routine</p>
            <p>• Don't worry about "doing it perfectly" - relaxation is a skill that improves with practice</p>
            <p>• If your mind wanders, gently bring your attention back to the technique</p>
            <p>• Progressive muscle relaxation is especially effective for physical tension</p>
            <p>• Visualization works well for mental stress and emotional regulation</p>
            <p>• Autogenic training can help with sleep problems and anxiety</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}