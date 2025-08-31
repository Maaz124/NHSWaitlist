import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Moon,
  Sun,
  Brain,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Activity,
  Coffee,
  Smartphone,
  Bed,
  Timer,
  TrendingDown,
  BookOpen
} from "lucide-react";

interface SleepAssessment {
  sleepTime: string;
  wakeTime: string;
  timeToFall: string;
  nightWakes: string;
  sleepQuality: number;
  daytimeEnergy: number;
  anxietyBeforeSleep: number;
  sleepEnvironment: string[];
  currentHabits: string[];
  concerns: string;
}

export function SleepAnxietyGuide() {
  const [activeTab, setActiveTab] = useState("overview");
  const [assessment, setAssessment] = useState<SleepAssessment>({
    sleepTime: "",
    wakeTime: "",
    timeToFall: "",
    nightWakes: "",
    sleepQuality: 5,
    daytimeEnergy: 5,
    anxietyBeforeSleep: 5,
    sleepEnvironment: [],
    currentHabits: [],
    concerns: ""
  });
  const [personalizedPlan, setPersonalizedPlan] = useState<string[]>([]);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const sleepEnvironmentOptions = [
    "Room is too bright", "Room is too noisy", "Room is too hot/cold",
    "Uncomfortable mattress/pillows", "Electronic devices in room",
    "Irregular sleep schedule", "Pets in bedroom", "Partner disturbances"
  ];

  const currentHabitsOptions = [
    "Caffeine after 2 PM", "Alcohol before bed", "Large meals before bed",
    "Screen time before bed", "Work/study in bed", "Daytime napping",
    "Irregular bedtime", "Exercise close to bedtime"
  ];

  const generatePersonalizedPlan = () => {
    const recommendations: string[] = [];

    // Sleep timing recommendations
    if (assessment.timeToFall && parseInt(assessment.timeToFall) > 30) {
      recommendations.push("Practice wind-down routine 1 hour before bed to reduce time falling asleep");
    }
    if (assessment.nightWakes && parseInt(assessment.nightWakes) > 2) {
      recommendations.push("Identify and address causes of night waking - consider sleep study if persistent");
    }

    // Environment-based recommendations
    if (assessment.sleepEnvironment.includes("Room is too bright")) {
      recommendations.push("Install blackout curtains or use an eye mask");
    }
    if (assessment.sleepEnvironment.includes("Room is too noisy")) {
      recommendations.push("Use earplugs, white noise machine, or address noise sources");
    }
    if (assessment.sleepEnvironment.includes("Electronic devices in room")) {
      recommendations.push("Remove phones, TVs, and tablets from bedroom - create a tech-free sleep zone");
    }

    // Habit-based recommendations
    if (assessment.currentHabits.includes("Caffeine after 2 PM")) {
      recommendations.push("Stop caffeine intake after 2 PM (coffee, tea, chocolate, energy drinks)");
    }
    if (assessment.currentHabits.includes("Screen time before bed")) {
      recommendations.push("Implement 1-hour screen-free time before bed or use blue light filters");
    }
    if (assessment.currentHabits.includes("Irregular bedtime")) {
      recommendations.push("Establish consistent sleep and wake times, even on weekends");
    }

    // Anxiety-specific recommendations
    if (assessment.anxietyBeforeSleep > 6) {
      recommendations.push("Practice anxiety-reducing bedtime routine: deep breathing, progressive relaxation, or meditation");
      recommendations.push("Keep a worry journal - write down concerns 2 hours before bed to clear your mind");
    }

    // Energy and quality recommendations
    if (assessment.sleepQuality < 6) {
      recommendations.push("Focus on sleep hygiene basics: consistent schedule, comfortable environment, relaxing routine");
    }
    if (assessment.daytimeEnergy < 6) {
      recommendations.push("Ensure 7-9 hours of sleep nightly and consider morning light exposure");
    }

    // Add general recommendations if none specific
    if (recommendations.length === 0) {
      recommendations.push("Maintain your good sleep habits and consider optimizing your sleep environment");
      recommendations.push("Continue monitoring your sleep patterns and anxiety levels");
    }

    setPersonalizedPlan(recommendations);
  };

  const markSectionComplete = (section: string) => {
    setCompletedSections(prev => [...prev, section]);
  };

  const handleEnvironmentChange = (option: string, checked: boolean) => {
    setAssessment(prev => ({
      ...prev,
      sleepEnvironment: checked 
        ? [...prev.sleepEnvironment, option]
        : prev.sleepEnvironment.filter(item => item !== option)
    }));
  };

  const handleHabitsChange = (option: string, checked: boolean) => {
    setAssessment(prev => ({
      ...prev,
      currentHabits: checked 
        ? [...prev.currentHabits, option]
        : prev.currentHabits.filter(item => item !== option)
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-600" />
            Sleep & Anxiety - Interactive Guide
          </CardTitle>
          <p className="text-muted-foreground">
            Evidence-based strategies to improve sleep and reduce bedtime anxiety
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="plan">Your Plan</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Sleep & Mental Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-3">Why Sleep Matters for Anxiety</h3>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  <p>Sleep and anxiety have a bidirectional relationship - poor sleep increases anxiety, and anxiety makes it harder to sleep well. Understanding this connection is key to breaking the cycle.</p>
                  
                  <h4 className="font-semibold mt-4 mb-2">How Poor Sleep Affects Anxiety:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Reduces ability to regulate emotions and cope with stress</li>
                    <li>Increases cortisol (stress hormone) levels</li>
                    <li>Impairs rational thinking and increases catastrophic thoughts</li>
                    <li>Makes you more reactive to daily stressors</li>
                    <li>Weakens immune system, affecting overall wellbeing</li>
                  </ul>

                  <h4 className="font-semibold mt-4 mb-2">How Anxiety Affects Sleep:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Racing thoughts make it hard to fall asleep</li>
                    <li>Physical symptoms (racing heart, tension) interfere with relaxation</li>
                    <li>Worry about not sleeping creates performance anxiety around bedtime</li>
                    <li>Hypervigilance keeps the nervous system activated</li>
                    <li>Fear of panic attacks or nightmares disrupts sleep quality</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">The Good News</h4>
                <p className="text-blue-700 text-sm">
                  Improving sleep often leads to significant reductions in anxiety levels. Many anxiety symptoms improve naturally when sleep quality improves, making this one of the most effective areas to focus on.
                </p>
              </div>

              <Button 
                onClick={() => {
                  markSectionComplete('overview');
                  setActiveTab('connection');
                }}
                className="w-full gap-2"
                data-testid="button-next-connection"
              >
                Continue to Sleep-Anxiety Connection <CheckCircle className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connection Tab */}
        <TabsContent value="connection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                The Sleep-Anxiety Cycle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-4">Understanding the Vicious Cycle</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                        <TrendingDown className="w-5 h-5" />
                        The Downward Spiral
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-red-700">1.</span>
                          <div>
                            <p className="font-medium">Anxiety rises during day</p>
                            <p className="text-red-600">Stress, worry, physical symptoms</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-red-700">2.</span>
                          <div>
                            <p className="font-medium">Bedtime becomes stressful</p>
                            <p className="text-red-600">Racing thoughts, "I need to sleep"</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-red-700">3.</span>
                          <div>
                            <p className="font-medium">Sleep quality suffers</p>
                            <p className="text-red-600">Difficulty falling asleep, frequent waking</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-red-700">4.</span>
                          <div>
                            <p className="font-medium">Next day is harder</p>
                            <p className="text-red-600">Less resilience, more anxiety</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Breaking the Cycle
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-green-700">1.</span>
                          <div>
                            <p className="font-medium">Improve sleep hygiene</p>
                            <p className="text-green-600">Consistent routine, good environment</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-green-700">2.</span>
                          <div>
                            <p className="font-medium">Manage bedtime anxiety</p>
                            <p className="text-green-600">Relaxation techniques, worry time</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-green-700">3.</span>
                          <div>
                            <p className="font-medium">Sleep quality improves</p>
                            <p className="text-green-600">Faster sleep onset, fewer awakenings</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-green-700">4.</span>
                          <div>
                            <p className="font-medium">Better daily resilience</p>
                            <p className="text-green-600">Lower anxiety, better coping</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-3">Common Sleep-Anxiety Patterns</h3>
                <div className="space-y-4">
                  <Card className="border-l-4 border-l-amber-400">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Sleep Anticipation Anxiety</h4>
                      <p className="text-sm text-gray-700 mb-2">Worrying about whether you'll be able to sleep, which creates pressure and makes sleep harder.</p>
                      <p className="text-xs text-amber-700"><strong>Solution:</strong> Remove pressure by focusing on rest rather than sleep</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-blue-400">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Racing Mind at Bedtime</h4>
                      <p className="text-sm text-gray-700 mb-2">Thoughts speed up when you lie down, replaying the day or worrying about tomorrow.</p>
                      <p className="text-xs text-blue-700"><strong>Solution:</strong> Designated worry time earlier in evening + mindfulness techniques</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-purple-400">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Physical Hypervigilance</h4>
                      <p className="text-sm text-gray-700 mb-2">Body stays alert for threats, with racing heart, muscle tension, or feeling "wired but tired."</p>
                      <p className="text-xs text-purple-700"><strong>Solution:</strong> Progressive muscle relaxation + breathing exercises</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Button 
                onClick={() => {
                  markSectionComplete('connection');
                  setActiveTab('assessment');
                }}
                className="w-full gap-2"
                data-testid="button-next-assessment"
              >
                Take Sleep Assessment <Activity className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessment Tab */}
        <TabsContent value="assessment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Personal Sleep & Anxiety Assessment
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Help us understand your sleep patterns to create a personalized plan
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Sleep Timing */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Sleep Patterns</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sleep-time">Usual bedtime</Label>
                    <Input
                      id="sleep-time"
                      type="time"
                      value={assessment.sleepTime}
                      onChange={(e) => setAssessment(prev => ({...prev, sleepTime: e.target.value}))}
                      data-testid="input-sleep-time"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wake-time">Usual wake time</Label>
                    <Input
                      id="wake-time"
                      type="time"
                      value={assessment.wakeTime}
                      onChange={(e) => setAssessment(prev => ({...prev, wakeTime: e.target.value}))}
                      data-testid="input-wake-time"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time-to-fall">Minutes to fall asleep</Label>
                    <Input
                      id="time-to-fall"
                      type="number"
                      placeholder="e.g., 30"
                      value={assessment.timeToFall}
                      onChange={(e) => setAssessment(prev => ({...prev, timeToFall: e.target.value}))}
                      data-testid="input-time-to-fall"
                    />
                  </div>
                  <div>
                    <Label htmlFor="night-wakes">Times waking per night</Label>
                    <Input
                      id="night-wakes"
                      type="number"
                      placeholder="e.g., 2"
                      value={assessment.nightWakes}
                      onChange={(e) => setAssessment(prev => ({...prev, nightWakes: e.target.value}))}
                      data-testid="input-night-wakes"
                    />
                  </div>
                </div>
              </div>

              {/* Quality Ratings */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quality Ratings (1-10)</h3>
                <div className="space-y-6">
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Bed className="w-4 h-4" />
                      Overall sleep quality: {assessment.sleepQuality}/10
                    </Label>
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={assessment.sleepQuality}
                      onChange={(e) => setAssessment(prev => ({...prev, sleepQuality: parseInt(e.target.value)}))}
                      className="w-full"
                      data-testid="slider-sleep-quality"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Very Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Sun className="w-4 h-4" />
                      Daytime energy: {assessment.daytimeEnergy}/10
                    </Label>
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={assessment.daytimeEnergy}
                      onChange={(e) => setAssessment(prev => ({...prev, daytimeEnergy: parseInt(e.target.value)}))}
                      className="w-full"
                      data-testid="slider-daytime-energy"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Very Low</span>
                      <span>Very High</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4" />
                      Anxiety before sleep: {assessment.anxietyBeforeSleep}/10
                    </Label>
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={assessment.anxietyBeforeSleep}
                      onChange={(e) => setAssessment(prev => ({...prev, anxietyBeforeSleep: parseInt(e.target.value)}))}
                      className="w-full"
                      data-testid="slider-anxiety-before-sleep"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Very Calm</span>
                      <span>Very Anxious</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environment Issues */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Sleep Environment Issues</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sleepEnvironmentOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`env-${option}`}
                        checked={assessment.sleepEnvironment.includes(option)}
                        onCheckedChange={(checked) => handleEnvironmentChange(option, !!checked)}
                        data-testid={`checkbox-env-${option.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                      />
                      <Label htmlFor={`env-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Habits */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Current Sleep-Affecting Habits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentHabitsOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`habit-${option}`}
                        checked={assessment.currentHabits.includes(option)}
                        onCheckedChange={(checked) => handleHabitsChange(option, !!checked)}
                        data-testid={`checkbox-habit-${option.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                      />
                      <Label htmlFor={`habit-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Concerns */}
              <div>
                <Label htmlFor="concerns" className="text-lg font-semibold">Additional Sleep Concerns</Label>
                <Textarea
                  id="concerns"
                  placeholder="Describe any other sleep challenges, fears about sleep, or patterns you've noticed..."
                  value={assessment.concerns}
                  onChange={(e) => setAssessment(prev => ({...prev, concerns: e.target.value}))}
                  rows={4}
                  className="mt-2"
                  data-testid="textarea-concerns"
                />
              </div>

              <Button 
                onClick={() => {
                  generatePersonalizedPlan();
                  markSectionComplete('assessment');
                  setActiveTab('strategies');
                }}
                className="w-full gap-2"
                data-testid="button-complete-assessment"
              >
                Complete Assessment & Get Strategies <Lightbulb className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategies Tab */}
        <TabsContent value="strategies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Evidence-Based Sleep Strategies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Sleep Hygiene */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-4">Core Sleep Hygiene</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Timing & Routine
                      </h4>
                      <ul className="text-sm space-y-2 text-blue-700">
                        <li>• Keep consistent sleep/wake times (±30 minutes)</li>
                        <li>• Avoid naps after 3 PM or longer than 20 minutes</li>
                        <li>• Create a 1-hour wind-down routine before bed</li>
                        <li>• Get morning sunlight within 1 hour of waking</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <Bed className="w-5 h-5" />
                        Environment
                      </h4>
                      <ul className="text-sm space-y-2 text-green-700">
                        <li>• Room temperature 60-67°F (15-19°C)</li>
                        <li>• Dark room (blackout curtains/eye mask)</li>
                        <li>• Quiet environment (earplugs/white noise)</li>
                        <li>• Comfortable, supportive mattress/pillows</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Anxiety-Specific Strategies */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-4">Anxiety-Specific Techniques</h3>
                <div className="space-y-4">
                  <Card className="border-l-4 border-l-purple-400">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        Worry Window Technique
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">Set aside 15-20 minutes earlier in the evening (at least 2 hours before bed) to write down worries and potential solutions.</p>
                      <div className="bg-purple-50 p-3 rounded text-sm">
                        <strong>Steps:</strong>
                        <ol className="list-decimal list-inside mt-1 space-y-1">
                          <li>Write down all worries/to-dos for 10 minutes</li>
                          <li>For each worry, note if you can act on it now or later</li>
                          <li>If bedtime worries arise, remind yourself: "I'll deal with this in my worry window"</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-blue-400">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Progressive Muscle Relaxation for Sleep
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">Systematically tense and release muscle groups to promote physical relaxation.</p>
                      <div className="bg-blue-50 p-3 rounded text-sm">
                        <strong>Order:</strong> Toes → feet → calves → thighs → abdomen → hands → arms → shoulders → face
                        <br /><strong>Pattern:</strong> Tense for 5 seconds, notice the tension, then release and relax for 10 seconds
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-400">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Moon className="w-5 h-5 text-green-600" />
                        4-7-8 Breathing for Sleep
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">A specific breathing pattern that activates the parasympathetic nervous system.</p>
                      <div className="bg-green-50 p-3 rounded text-sm">
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Exhale completely through your mouth</li>
                          <li>Breathe in through nose for 4 counts</li>
                          <li>Hold breath for 7 counts</li>
                          <li>Exhale through mouth for 8 counts</li>
                          <li>Repeat 3-4 cycles</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* What to Avoid */}
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-4">What to Avoid</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Coffee className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">Stimulants</h4>
                        <p className="text-sm text-red-600">No caffeine after 2 PM, limit alcohol (disrupts sleep quality)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Smartphone className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">Blue Light</h4>
                        <p className="text-sm text-red-600">No screens 1 hour before bed, use blue light filters after sunset</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">Clock Watching</h4>
                        <p className="text-sm text-red-600">Turn clocks away, checking time increases anxiety</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Bed className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">Bed Activities</h4>
                        <p className="text-sm text-red-600">Only sleep and intimacy in bed, no work/worry/screens</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => {
                  markSectionComplete('strategies');
                  setActiveTab('plan');
                }}
                className="w-full gap-2"
                data-testid="button-view-plan"
              >
                View Your Personalized Plan <Timer className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Plan Tab */}
        <TabsContent value="plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Your Personalized Sleep Plan
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Based on your assessment, here are your priority recommendations
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {personalizedPlan.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-800">Priority Recommendations</h3>
                  {personalizedPlan.map((recommendation, index) => (
                    <Card key={index} className="border-l-4 border-l-indigo-400 bg-indigo-50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Badge variant="secondary" className="mt-1">
                            {index + 1}
                          </Badge>
                          <p className="text-sm text-indigo-800">{recommendation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Complete the assessment to see your personalized recommendations</p>
                  <Button 
                    onClick={() => setActiveTab('assessment')}
                    className="mt-4"
                  >
                    Take Assessment
                  </Button>
                </div>
              )}

              {/* Implementation Schedule */}
              {personalizedPlan.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-indigo-800 mb-4">Implementation Schedule</h3>
                  <div className="space-y-3">
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-green-800 mb-2">Week 1-2: Foundation</h4>
                        <p className="text-sm text-green-700">Focus on consistent sleep/wake times and basic sleep hygiene. Start with 1-2 easier changes.</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Week 3-4: Anxiety Management</h4>
                        <p className="text-sm text-blue-700">Add worry window and relaxation techniques. Begin addressing anxiety-specific patterns.</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-purple-800 mb-2">Week 5+: Optimization</h4>
                        <p className="text-sm text-purple-700">Fine-tune environment and habits. Maintain what's working, adjust what isn't.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Tracking Section */}
              {personalizedPlan.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Track Your Progress</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Keep a simple sleep diary noting:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bedtime and time to fall asleep</li>
                    <li>• Number of night awakenings</li>
                    <li>• Morning energy level (1-10)</li>
                    <li>• Anxiety level before bed (1-10)</li>
                    <li>• Which strategies you used</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-3">
                    Sleep improvements typically take 2-4 weeks to become noticeable. Be patient and consistent.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tips */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 text-indigo-800">💤 Sleep Success Tips</h4>
          <div className="space-y-2 text-sm text-indigo-700">
            <p>• Start with small, sustainable changes rather than trying to change everything at once</p>
            <p>• If you can't fall asleep within 20 minutes, get up and do a quiet activity until sleepy</p>
            <p>• Focus on feeling rested rather than getting a specific number of hours</p>
            <p>• Sleep needs vary by individual - find what works for your body</p>
            <p>• Consider professional help if sleep problems persist despite consistent effort</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}