import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Wind,
  Heart,
  Clock,
  CheckCircle,
  Zap
} from "lucide-react";

interface BreathingSession {
  technique: string;
  duration: number;
  completedCycles: number;
  startTime: Date;
}

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [timeRemaining, setTimeRemaining] = useState(4);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const [selectedTechnique, setSelectedTechnique] = useState('478');
  const [sessions, setSessions] = useState<BreathingSession[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>();

  const techniques = {
    '478': {
      name: '4-7-8 Breathing',
      description: 'Calming technique for anxiety and sleep',
      pattern: { inhale: 4, hold: 7, exhale: 8, pause: 0 },
      benefits: ['Reduces anxiety', 'Promotes sleep', 'Calms nervous system'],
      difficulty: 'Beginner',
      duration: '2-5 minutes'
    },
    'box': {
      name: 'Box Breathing',
      description: 'Military-style breathing for focus and calm',
      pattern: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
      benefits: ['Improves focus', 'Reduces stress', 'Enhances performance'],
      difficulty: 'Beginner',
      duration: '3-10 minutes'
    },
    'coherent': {
      name: 'Coherent Breathing',
      description: '5-5 breathing for heart rate variability',
      pattern: { inhale: 5, hold: 0, exhale: 5, pause: 0 },
      benefits: ['Heart rhythm coherence', 'Balanced nervous system', 'Emotional regulation'],
      difficulty: 'Intermediate',
      duration: '5-20 minutes'
    },
    'wim': {
      name: 'Wim Hof Method',
      description: 'Energizing breathing technique',
      pattern: { inhale: 2, hold: 0, exhale: 1, pause: 0 },
      benefits: ['Increases energy', 'Boosts immune system', 'Improves cold tolerance'],
      difficulty: 'Advanced',
      duration: '10-15 minutes'
    },
    'calming': {
      name: 'Extended Exhale',
      description: 'Longer exhale for deep relaxation',
      pattern: { inhale: 4, hold: 2, exhale: 8, pause: 2 },
      benefits: ['Deep relaxation', 'Activates rest response', 'Reduces tension'],
      difficulty: 'Beginner',
      duration: '3-10 minutes'
    }
  };

  const currentTechnique = techniques[selectedTechnique as keyof typeof techniques];

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Move to next phase
            const phases = Object.keys(currentTechnique.pattern).filter(
              phase => currentTechnique.pattern[phase as keyof typeof currentTechnique.pattern] > 0
            );
            const currentIndex = phases.indexOf(currentPhase);
            const nextIndex = (currentIndex + 1) % phases.length;
            const nextPhase = phases[nextIndex] as 'inhale' | 'hold' | 'exhale' | 'pause';
            
            setCurrentPhase(nextPhase);
            
            // If we completed a full cycle (back to inhale)
            if (nextPhase === 'inhale' && currentPhase !== 'inhale') {
              setCurrentCycle(prev => {
                const newCycle = prev + 1;
                if (newCycle >= totalCycles) {
                  // Session complete
                  setIsActive(false);
                  completeSession();
                  return 0;
                }
                return newCycle;
              });
            }
            
            return currentTechnique.pattern[nextPhase];
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, currentPhase, currentTechnique.pattern, totalCycles, currentCycle]);

  const completeSession = () => {
    const session: BreathingSession = {
      technique: currentTechnique.name,
      duration: totalCycles * getTotalCycleDuration(),
      completedCycles: currentCycle,
      startTime: new Date()
    };
    setSessions(prev => [session, ...prev].slice(0, 10)); // Keep last 10 sessions
  };

  const getTotalCycleDuration = () => {
    return Object.values(currentTechnique.pattern).reduce((sum, time) => sum + time, 0);
  };

  const getProgress = () => {
    const totalTime = getTotalCycleDuration();
    const currentPhaseTime = currentTechnique.pattern[currentPhase];
    const elapsedInPhase = currentPhaseTime - timeRemaining;
    
    let phaseOffset = 0;
    const phases = Object.keys(currentTechnique.pattern).filter(
      phase => currentTechnique.pattern[phase as keyof typeof currentTechnique.pattern] > 0
    );
    
    for (let i = 0; i < phases.indexOf(currentPhase); i++) {
      phaseOffset += currentTechnique.pattern[phases[i] as keyof typeof currentTechnique.pattern];
    }
    
    const cycleProgress = ((phaseOffset + elapsedInPhase) / totalTime) * 100;
    return cycleProgress;
  };

  const getOverallProgress = () => {
    return ((currentCycle / totalCycles) * 100) + (getProgress() / totalCycles);
  };

  const startExercise = () => {
    setIsActive(true);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setTimeRemaining(currentTechnique.pattern.inhale);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setTimeRemaining(currentTechnique.pattern.inhale);
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe in slowly through your nose';
      case 'hold':
        return 'Hold your breath gently';
      case 'exhale':
        return 'Breathe out slowly through your mouth';
      case 'pause':
        return 'Rest naturally';
      default:
        return 'Follow your breath';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'bg-blue-500';
      case 'hold':
        return 'bg-yellow-500';
      case 'exhale':
        return 'bg-green-500';
      case 'pause':
        return 'bg-gray-400';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-blue-600" />
            Interactive Breathing Exercises
          </CardTitle>
          <p className="text-muted-foreground">
            Guided breathing techniques to reduce anxiety and promote relaxation
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTechnique} onValueChange={setSelectedTechnique} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="478">4-7-8</TabsTrigger>
              <TabsTrigger value="box">Box</TabsTrigger>
              <TabsTrigger value="coherent">Coherent</TabsTrigger>
              <TabsTrigger value="wim">Wim Hof</TabsTrigger>
              <TabsTrigger value="calming">Extended</TabsTrigger>
            </TabsList>

            {Object.entries(techniques).map(([key, technique]) => (
              <TabsContent key={key} value={key} className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{technique.name}</CardTitle>
                        <p className="text-muted-foreground mt-1">{technique.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{technique.difficulty}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">{technique.duration}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Breathing Pattern */}
                    <div>
                      <h4 className="font-semibold mb-3">Breathing Pattern</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(technique.pattern).map(([phase, duration]) => (
                          duration > 0 && (
                            <div key={phase} className="text-center p-3 bg-secondary/50 rounded-lg">
                              <div className="text-2xl font-bold text-primary">{duration}s</div>
                              <div className="text-sm text-muted-foreground capitalize">{phase}</div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="font-semibold mb-3">Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {technique.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Exercise Control */}
                    <div className="bg-white p-6 rounded-lg border">
                      <div className="text-center space-y-6">
                        {/* Visual Breathing Guide */}
                        <div className="relative">
                          <div 
                            className={`w-32 h-32 mx-auto rounded-full ${getPhaseColor()} transition-all duration-1000 flex items-center justify-center`}
                            style={{
                              transform: currentPhase === 'inhale' ? 'scale(1.2)' : 
                                        currentPhase === 'exhale' ? 'scale(0.8)' : 'scale(1)',
                              opacity: isActive ? 0.8 : 0.5
                            }}
                          >
                            <div className="text-white text-center">
                              <div className="text-3xl font-bold">{timeRemaining}</div>
                              <div className="text-sm uppercase tracking-wider">{currentPhase}</div>
                            </div>
                          </div>
                        </div>

                        {/* Instructions */}
                        <div>
                          <p className="text-lg font-medium text-center mb-2">{getPhaseInstruction()}</p>
                          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                            <span>Cycle {currentCycle + 1} of {totalCycles}</span>
                            <span>•</span>
                            <span>{Math.round(getOverallProgress())}% Complete</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Current Cycle</span>
                            <span>{Math.round(getProgress())}%</span>
                          </div>
                          <Progress value={getProgress()} className="h-2" />
                          
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Overall Progress</span>
                            <span>{Math.round(getOverallProgress())}%</span>
                          </div>
                          <Progress value={getOverallProgress()} className="h-3" />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-4">
                          {!isActive ? (
                            <Button onClick={startExercise} className="gap-2" data-testid="button-start-breathing">
                              <Play className="w-4 h-4" />
                              Start Exercise
                            </Button>
                          ) : (
                            <Button onClick={pauseExercise} variant="secondary" className="gap-2" data-testid="button-pause-breathing">
                              <Pause className="w-4 h-4" />
                              Pause
                            </Button>
                          )}
                          
                          <Button onClick={resetExercise} variant="outline" className="gap-2" data-testid="button-reset-breathing">
                            <RotateCcw className="w-4 h-4" />
                            Reset
                          </Button>
                        </div>

                        {/* Settings */}
                        <div className="pt-4 border-t">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowSettings(!showSettings)}
                            className="gap-2"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Button>
                          
                          {showSettings && (
                            <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                              <div className="flex items-center gap-4">
                                <label className="text-sm font-medium">Total Cycles:</label>
                                <div className="flex gap-2">
                                  {[3, 5, 8, 10, 15].map(num => (
                                    <Button
                                      key={num}
                                      variant={totalCycles === num ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setTotalCycles(num)}
                                      data-testid={`button-cycles-${num}`}
                                    >
                                      {num}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Session History */}
          {sessions.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Sessions
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
                            {session.completedCycles} cycles • {Math.round(session.duration / 60)} min
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

          {/* Quick Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 text-blue-800">💡 Breathing Exercise Tips</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <p>• Find a comfortable, quiet space where you won't be interrupted</p>
                <p>• Sit with your back straight or lie down comfortably</p>
                <p>• Place one hand on your chest, one on your belly - the belly should move more</p>
                <p>• Don't force the breath - let it flow naturally within the timing</p>
                <p>• If you feel dizzy, return to normal breathing and try a shorter session</p>
                <p>• Practice regularly for best results - even 3-5 minutes daily helps</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}