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
  Heart,
  Apple,
  Dumbbell,
  Users,
  Coffee,
  Droplets,
  Sun,
  TreePine,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Activity,
  Calendar
} from "lucide-react";

interface LifestyleAssessment {
  exercise: {
    frequency: number;
    types: string[];
    barriers: string[];
    enjoyment: number;
  };
  nutrition: {
    meals: number;
    caffeine: number;
    alcohol: number;
    hydration: number;
    concerns: string[];
  };
  social: {
    support: number;
    isolation: number;
    activities: string[];
    challenges: string[];
  };
  stress: {
    level: number;
    sources: string[];
    coping: string[];
    management: number;
  };
  goals: string[];
  motivation: string;
}

export function LifestyleGuide() {
  const [activeTab, setActiveTab] = useState("overview");
  const [assessment, setAssessment] = useState<LifestyleAssessment>({
    exercise: { frequency: 0, types: [], barriers: [], enjoyment: 5 },
    nutrition: { meals: 3, caffeine: 1, alcohol: 0, hydration: 6, concerns: [] },
    social: { support: 5, isolation: 5, activities: [], challenges: [] },
    stress: { level: 5, sources: [], coping: [], management: 5 },
    goals: [],
    motivation: ""
  });
  const [actionPlan, setActionPlan] = useState<string[]>([]);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const exerciseTypes = [
    "Walking", "Running", "Swimming", "Cycling", "Yoga", "Weight training",
    "Dance", "Sports", "Hiking", "Home workouts", "Group classes", "Stretching"
  ];

  const exerciseBarriers = [
    "Lack of time", "Too expensive", "No motivation", "Physical limitations",
    "Don't know where to start", "Feel self-conscious", "Weather dependent", 
    "Lack of childcare", "Work schedule", "Too tired"
  ];

  const nutritionConcerns = [
    "Emotional eating", "Irregular meal times", "Too much processed food",
    "Not enough vegetables", "Stress eating", "Skipping meals", 
    "Too much sugar", "Caffeine dependency", "Alcohol as stress relief"
  ];

  const stressSources = [
    "Work/Career", "Finances", "Relationships", "Health", "Family responsibilities",
    "Housing", "Education", "Social pressures", "News/world events", "Technology overload"
  ];

  const copingStrategies = [
    "Exercise", "Meditation/Mindfulness", "Talking to friends", "Hobbies",
    "Music", "Reading", "Nature time", "Bath/shower", "Deep breathing", 
    "Journaling", "Professional therapy", "Spiritual practices"
  ];

  const socialActivities = [
    "Spending time with family", "Meeting friends", "Group hobbies", 
    "Community volunteering", "Sports/exercise groups", "Religious/spiritual groups",
    "Online communities", "Work social events", "Neighborhood activities", "Support groups"
  ];

  const generateActionPlan = () => {
    const plan: string[] = [];

    // Exercise recommendations
    if (assessment.exercise.frequency < 3) {
      plan.push("Start with 10-15 minute walks 3 times per week - small steps lead to big changes");
      if (assessment.exercise.barriers.includes("Lack of time")) {
        plan.push("Try 'exercise snacking' - 5-10 minute movement breaks throughout the day");
      }
    } else if (assessment.exercise.enjoyment < 6) {
      plan.push("Experiment with different types of movement to find what you enjoy");
    }

    // Nutrition recommendations
    if (assessment.nutrition.caffeine > 3) {
      plan.push("Gradually reduce caffeine intake, especially after 2 PM, to improve sleep and reduce anxiety");
    }
    if (assessment.nutrition.hydration < 6) {
      plan.push("Increase water intake - keep a water bottle visible and set hourly reminders");
    }
    if (assessment.nutrition.concerns.includes("Emotional eating")) {
      plan.push("Practice mindful eating - pause before eating to ask 'Am I hungry or responding to emotions?'");
    }

    // Social recommendations
    if (assessment.social.support < 6) {
      plan.push("Strengthen social connections - reach out to one person per week for meaningful contact");
    }
    if (assessment.social.isolation > 6) {
      plan.push("Schedule one social activity per week, even if small (coffee with a friend, phone call)");
    }

    // Stress management
    if (assessment.stress.level > 6) {
      plan.push("Implement daily stress management - even 5 minutes of deep breathing or mindfulness");
    }
    if (assessment.stress.management < 6) {
      plan.push("Build your stress management toolkit - try 2-3 new coping strategies this month");
    }

    // General wellness
    plan.push("Focus on consistency over perfection - small daily improvements compound over time");
    
    setActionPlan(plan);
  };

  const handleExerciseTypeChange = (type: string, checked: boolean) => {
    setAssessment(prev => ({
      ...prev,
      exercise: {
        ...prev.exercise,
        types: checked 
          ? [...prev.exercise.types, type]
          : prev.exercise.types.filter(t => t !== type)
      }
    }));
  };

  const handleArrayChange = (section: keyof LifestyleAssessment, field: string, option: string, checked: boolean) => {
    setAssessment(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked 
          ? [...(prev[section] as any)[field], option]
          : (prev[section] as any)[field].filter((item: string) => item !== option)
      }
    }));
  };

  const getWellnessScore = () => {
    const exerciseScore = Math.min(assessment.exercise.frequency * 25, 100);
    const nutritionScore = ((10 - assessment.nutrition.caffeine) + assessment.nutrition.hydration) * 5;
    const socialScore = (assessment.social.support + (10 - assessment.social.isolation)) * 5;
    const stressScore = ((10 - assessment.stress.level) + assessment.stress.management) * 5;
    
    return Math.round((exerciseScore + nutritionScore + socialScore + stressScore) / 4);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-green-600" />
            Lifestyle Factors & Wellbeing
          </CardTitle>
          <p className="text-muted-foreground">
            Comprehensive guide to lifestyle changes that support mental health
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="exercise">Exercise</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                The Lifestyle-Anxiety Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Research shows that lifestyle factors can be as effective as medication for managing anxiety and depression. 
                  Small, consistent changes in how we move, eat, connect, and manage stress can significantly improve mental health.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Dumbbell className="w-5 h-5" />
                        Physical Activity
                      </h3>
                      <ul className="text-sm space-y-1 text-blue-700">
                        <li>• Reduces stress hormones (cortisol)</li>
                        <li>• Increases mood-boosting endorphins</li>
                        <li>• Improves sleep quality</li>
                        <li>• Provides sense of accomplishment</li>
                        <li>• Can be as effective as antidepressants for mild-moderate depression</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <Apple className="w-5 h-5" />
                        Nutrition
                      </h3>
                      <ul className="text-sm space-y-1 text-green-700">
                        <li>• Stable blood sugar prevents anxiety spikes</li>
                        <li>• Omega-3s support brain health</li>
                        <li>• Gut health affects mood and anxiety</li>
                        <li>• Caffeine can trigger anxiety symptoms</li>
                        <li>• Dehydration worsens anxiety and fatigue</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Social Connection
                      </h3>
                      <ul className="text-sm space-y-1 text-purple-700">
                        <li>• Strong relationships reduce stress response</li>
                        <li>• Social support improves resilience</li>
                        <li>• Loneliness increases anxiety and depression risk</li>
                        <li>• Community involvement provides purpose</li>
                        <li>• Sharing struggles reduces isolation</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                        <Sun className="w-5 h-5" />
                        Stress & Environment
                      </h3>
                      <ul className="text-sm space-y-1 text-orange-700">
                        <li>• Chronic stress weakens immune system</li>
                        <li>• Nature exposure reduces cortisol</li>
                        <li>• Sunlight regulates mood and sleep</li>
                        <li>• Clutter and chaos increase anxiety</li>
                        <li>• Routine provides stability and control</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  The Compound Effect
                </h3>
                <p className="text-green-700 text-sm">
                  Small lifestyle changes may seem insignificant day-to-day, but they compound over time. 
                  A 10-minute walk today plus a healthy breakfast creates momentum for tomorrow's choices. 
                  Focus on consistency over intensity - it's better to do something small every day than something big once a week.
                </p>
              </div>

              <Button 
                onClick={() => setActiveTab('exercise')}
                className="w-full gap-2"
                data-testid="button-start-lifestyle-guide"
              >
                Start Exploring Lifestyle Factors <TrendingUp className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exercise Tab */}
        <TabsContent value="exercise" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5" />
                Exercise & Movement for Mental Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-4">How Exercise Helps Anxiety</h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p className="mb-4">Exercise is one of the most effective natural treatments for anxiety. Here's how it works:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Immediate Effects (During/After)</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Releases endorphins ("feel-good" chemicals)</li>
                        <li>• Reduces stress hormones (cortisol, adrenaline)</li>
                        <li>• Provides healthy outlet for nervous energy</li>
                        <li>• Shifts focus away from anxious thoughts</li>
                        <li>• Creates sense of accomplishment</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Long-term Benefits</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Improves sleep quality and duration</li>
                        <li>• Builds confidence and self-esteem</li>
                        <li>• Strengthens stress resilience</li>
                        <li>• Reduces inflammation in the brain</li>
                        <li>• Creates structure and routine</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-4">Finding the Right Type of Movement</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-800 mb-3">For High Anxiety</h4>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Yoga or gentle stretching</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Walking in nature</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Swimming (rhythmic, soothing)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Tai chi or qigong</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-orange-800 mb-3">For Low Energy</h4>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>5-minute walks</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Chair exercises</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Gentle home videos</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Dancing to favorite music</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-purple-800 mb-3">For Restlessness</h4>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Running or jogging</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>High-intensity intervals</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Boxing or martial arts</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Cycling or spinning</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-4">Getting Started: The 1% Rule</h3>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-green-600">Week 1</Badge>
                      <div>
                        <p className="font-medium">Build the Habit</p>
                        <p className="text-sm text-green-700">5 minutes of movement daily. Could be stretching, walking around the block, or dancing to one song.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-green-600">Week 2</Badge>
                      <div>
                        <p className="font-medium">Expand Slightly</p>
                        <p className="text-sm text-green-700">7-10 minutes. Add variety - try a short yoga video or walk to a different location.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-green-600">Week 3+</Badge>
                      <div>
                        <p className="font-medium">Find Your Rhythm</p>
                        <p className="text-sm text-green-700">Gradually increase to 15-30 minutes. Focus on what you enjoy rather than what you think you "should" do.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-4">Overcoming Common Barriers</h3>
                <div className="space-y-3">
                  <Card className="border-l-4 border-l-blue-400">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">"I don't have time"</h4>
                      <p className="text-sm text-gray-700 mb-2">Exercise doesn't require a gym membership or hour-long sessions.</p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Take stairs instead of elevators</li>
                        <li>• Park farther away from destinations</li>
                        <li>• Do squats during TV commercial breaks</li>
                        <li>• Have walking meetings or phone calls</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-400">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">"I feel too anxious to exercise"</h4>
                      <p className="text-sm text-gray-700 mb-2">Start incredibly small to build confidence.</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Begin with 2-minute activities</li>
                        <li>• Choose gentle, non-intimidating movements</li>
                        <li>• Exercise at home initially if gyms feel overwhelming</li>
                        <li>• Focus on how you feel after, not during</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Button 
                onClick={() => setActiveTab('nutrition')}
                className="w-full gap-2"
                data-testid="button-next-nutrition"
              >
                Continue to Nutrition <Apple className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="w-5 h-5" />
                Nutrition for Mental Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-4">The Gut-Brain Connection</h3>
                <p className="text-gray-700 mb-4">
                  Your gut produces 90% of your body's serotonin (a key mood neurotransmitter). What you eat directly affects your anxiety levels, energy, and emotional stability.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Anxiety-Reducing Foods
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium text-green-700">Omega-3 Rich Foods</p>
                          <p className="text-green-600">Fatty fish, walnuts, flax seeds, chia seeds</p>
                        </div>
                        <div>
                          <p className="font-medium text-green-700">Magnesium Sources</p>
                          <p className="text-green-600">Leafy greens, almonds, avocados, dark chocolate</p>
                        </div>
                        <div>
                          <p className="font-medium text-green-700">Complex Carbs</p>
                          <p className="text-green-600">Oats, quinoa, sweet potatoes, whole grains</p>
                        </div>
                        <div>
                          <p className="font-medium text-green-700">Probiotic Foods</p>
                          <p className="text-green-600">Yogurt, kefir, sauerkraut, kimchi</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Anxiety-Triggering Foods
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium text-red-700">High Caffeine</p>
                          <p className="text-red-600">Coffee, energy drinks, some sodas - especially after 2 PM</p>
                        </div>
                        <div>
                          <p className="font-medium text-red-700">Refined Sugars</p>
                          <p className="text-red-600">Candy, pastries, sugary drinks - cause blood sugar spikes</p>
                        </div>
                        <div>
                          <p className="font-medium text-red-700">Processed Foods</p>
                          <p className="text-red-600">Fast food, packaged snacks - high in additives and sodium</p>
                        </div>
                        <div>
                          <p className="font-medium text-red-700">Alcohol</p>
                          <p className="text-red-600">Disrupts sleep, affects blood sugar, can worsen anxiety</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-4">Blood Sugar & Anxiety</h3>
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-4">
                  <h4 className="font-semibold text-blue-800 mb-3">Why Blood Sugar Matters</h4>
                  <p className="text-blue-700 text-sm mb-3">
                    When blood sugar drops (hypoglycemia), your body releases stress hormones (adrenaline, cortisol) that feel identical to anxiety symptoms: racing heart, sweating, shakiness, irritability.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Signs of Blood Sugar Dips:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Sudden anxiety or panic feelings</li>
                        <li>• Shakiness or trembling</li>
                        <li>• Irritability or mood swings</li>
                        <li>• Difficulty concentrating</li>
                        <li>• Cravings for sugar/carbs</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Stabilizing Strategies:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Eat every 3-4 hours</li>
                        <li>• Combine protein with carbs</li>
                        <li>• Choose complex over simple carbs</li>
                        <li>• Don't skip breakfast</li>
                        <li>• Carry healthy snacks</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-4">Practical Meal Planning</h3>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Sun className="w-5 h-5 text-orange-600" />
                        Anxiety-Friendly Breakfast Ideas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium mb-1">Protein + Complex Carbs:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Oatmeal with Greek yogurt and berries</li>
                            <li>• Whole grain toast with avocado and egg</li>
                            <li>• Smoothie with protein powder, spinach, banana</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Quick Options:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Greek yogurt with nuts and seeds</li>
                            <li>• Apple with almond butter</li>
                            <li>• Hard-boiled eggs with whole grain crackers</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Coffee className="w-5 h-5 text-brown-600" />
                        Managing Caffeine
                      </h4>
                      <div className="text-sm space-y-2">
                        <p><strong>If you're caffeine sensitive:</strong> Try green tea (lower caffeine, contains L-theanine which promotes calm)</p>
                        <p><strong>To reduce gradually:</strong> Mix regular and decaf coffee, reduce by 25% each week</p>
                        <p><strong>Alternatives:</strong> Herbal teas (chamomile, passionflower), golden milk, chicory coffee</p>
                        <p><strong>Timing:</strong> Stop caffeine 6-8 hours before bedtime to avoid sleep disruption</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-blue-600" />
                        Hydration & Anxiety
                      </h4>
                      <div className="text-sm space-y-2 text-gray-700">
                        <p>Even mild dehydration can increase anxiety, fatigue, and difficulty concentrating.</p>
                        <div className="bg-blue-50 p-3 rounded">
                          <p><strong>Daily goal:</strong> Half your body weight in ounces (150 lbs = 75 oz water)</p>
                          <p><strong>Signs of dehydration:</strong> Dark urine, headaches, fatigue, increased anxiety</p>
                          <p><strong>Tips:</strong> Keep water visible, set hourly reminders, flavor with lemon/cucumber</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Button 
                onClick={() => setActiveTab('social')}
                className="w-full gap-2"
                data-testid="button-next-social"
              >
                Continue to Social Wellbeing <Users className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Social Connection & Mental Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Why Social Connection Matters</h3>
                <p className="text-gray-700 mb-4">
                  Strong social connections are as important for health as not smoking. Loneliness activates the same pain pathways in the brain as physical injury and significantly increases anxiety and depression risk.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-800 mb-3">Benefits of Strong Social Ties</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Reduces cortisol (stress hormone) levels</li>
                        <li>• Provides emotional support during challenges</li>
                        <li>• Offers different perspectives on problems</li>
                        <li>• Creates sense of belonging and purpose</li>
                        <li>• Encourages healthy behaviors</li>
                        <li>• Increases lifespan by up to 50%</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-red-800 mb-3">Impact of Social Isolation</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Increases anxiety and depression risk by 25%</li>
                        <li>• Weakens immune system functioning</li>
                        <li>• Increases inflammation in the body</li>
                        <li>• Contributes to cognitive decline</li>
                        <li>• Equivalent health risk to smoking 15 cigarettes daily</li>
                        <li>• Creates negative thought patterns</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Quality vs. Quantity</h3>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <p className="text-purple-700 mb-4">
                    You don't need dozens of friends. Research shows that 3-5 meaningful relationships provide more mental health benefits than numerous superficial connections.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-2">High-Quality Relationships Include:</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Mutual trust and respect</li>
                        <li>• Ability to be vulnerable and authentic</li>
                        <li>• Regular, meaningful contact</li>
                        <li>• Shared interests or values</li>
                        <li>• Support during difficult times</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-2">Signs You Need More Connection:</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Feeling lonely despite being around people</li>
                        <li>• No one to call during a crisis</li>
                        <li>• Rarely having deep conversations</li>
                        <li>• Feeling like no one truly knows you</li>
                        <li>• Increased anxiety when alone</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Building and Strengthening Connections</h3>
                <div className="space-y-4">
                  <Card className="border-l-4 border-l-blue-400">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Strengthen Existing Relationships</h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p><strong>Reach out regularly:</strong> Text, call, or message one person each week</p>
                        <p><strong>Be fully present:</strong> Put away phones during conversations</p>
                        <p><strong>Share vulnerably:</strong> Open up about your struggles and feelings</p>
                        <p><strong>Ask meaningful questions:</strong> "How are you really doing?" vs "How are you?"</p>
                        <p><strong>Celebrate together:</strong> Acknowledge their wins and milestones</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-400">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Meet New People</h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p><strong>Interest-based groups:</strong> Book clubs, hiking groups, hobby classes</p>
                        <p><strong>Volunteering:</strong> Find purpose while meeting like-minded people</p>
                        <p><strong>Classes or workshops:</strong> Learning environments are naturally social</p>
                        <p><strong>Neighborhood activities:</strong> Community events, local sports leagues</p>
                        <p><strong>Online to offline:</strong> Join online communities, attend local meetups</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-orange-400">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">For Social Anxiety</h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p><strong>Start small:</strong> Practice with low-stakes interactions (cashiers, neighbors)</p>
                        <p><strong>Use structure:</strong> Organized activities reduce pressure to make conversation</p>
                        <p><strong>Prepare topics:</strong> Have 2-3 questions or topics ready as conversation starters</p>
                        <p><strong>Focus on others:</strong> Ask questions about them to shift focus from yourself</p>
                        <p><strong>Practice self-compassion:</strong> Social skills improve with practice, not perfection</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Digital Connection Balance</h3>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">Healthy Social Media Use</h4>
                  <div className="text-sm text-amber-700 space-y-1">
                    <p>• Use it to enhance real relationships, not replace them</p>
                    <p>• Unfollow accounts that trigger comparison or negative feelings</p>
                    <p>• Set time limits - excessive social media increases anxiety</p>
                    <p>• Engage meaningfully rather than passive scrolling</p>
                    <p>• Take regular breaks from social platforms</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setActiveTab('assessment')}
                className="w-full gap-2"
                data-testid="button-take-lifestyle-assessment"
              >
                Take Comprehensive Assessment <Activity className="w-4 h-4" />
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
                Lifestyle Assessment & Personalized Plan
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Get personalized recommendations based on your current lifestyle
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Exercise Assessment */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  Exercise & Movement
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium mb-3 block">How many days per week do you currently exercise?</Label>
                    <Input
                      type="range"
                      min="0"
                      max="7"
                      value={assessment.exercise.frequency}
                      onChange={(e) => setAssessment(prev => ({
                        ...prev,
                        exercise: { ...prev.exercise, frequency: parseInt(e.target.value) }
                      }))}
                      className="w-full"
                      data-testid="slider-exercise-frequency"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Never</span>
                      <span className="font-medium">{assessment.exercise.frequency} days/week</span>
                      <span>Daily</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium mb-3 block">Types of exercise you enjoy or are interested in:</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {exerciseTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`exercise-${type}`}
                            checked={assessment.exercise.types.includes(type)}
                            onCheckedChange={(checked) => handleExerciseTypeChange(type, !!checked)}
                            data-testid={`checkbox-exercise-${type.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                          />
                          <Label htmlFor={`exercise-${type}`} className="text-sm">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium mb-3 block">Main barriers to exercise:</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {exerciseBarriers.map((barrier) => (
                        <div key={barrier} className="flex items-center space-x-2">
                          <Checkbox
                            id={`barrier-${barrier}`}
                            checked={assessment.exercise.barriers.includes(barrier)}
                            onCheckedChange={(checked) => handleArrayChange('exercise', 'barriers', barrier, !!checked)}
                            data-testid={`checkbox-barrier-${barrier.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                          />
                          <Label htmlFor={`barrier-${barrier}`} className="text-sm">{barrier}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nutrition Assessment */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Apple className="w-5 h-5" />
                  Nutrition & Eating Habits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="font-medium">Cups of caffeinated drinks per day:</Label>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        value={assessment.nutrition.caffeine}
                        onChange={(e) => setAssessment(prev => ({
                          ...prev,
                          nutrition: { ...prev.nutrition, caffeine: parseInt(e.target.value) || 0 }
                        }))}
                        data-testid="input-caffeine"
                      />
                    </div>
                    <div>
                      <Label className="font-medium">Regular meals per day:</Label>
                      <Input
                        type="number"
                        min="0"
                        max="6"
                        value={assessment.nutrition.meals}
                        onChange={(e) => setAssessment(prev => ({
                          ...prev,
                          nutrition: { ...prev.nutrition, meals: parseInt(e.target.value) || 0 }
                        }))}
                        data-testid="input-meals"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="font-medium mb-2 block">Water intake (1-10 scale):</Label>
                      <Input
                        type="range"
                        min="1"
                        max="10"
                        value={assessment.nutrition.hydration}
                        onChange={(e) => setAssessment(prev => ({
                          ...prev,
                          nutrition: { ...prev.nutrition, hydration: parseInt(e.target.value) }
                        }))}
                        className="w-full"
                        data-testid="slider-hydration"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>Very Low</span>
                        <span>{assessment.nutrition.hydration}/10</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="font-medium mb-3 block">Current nutrition concerns:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {nutritionConcerns.map((concern) => (
                      <div key={concern} className="flex items-center space-x-2">
                        <Checkbox
                          id={`nutrition-${concern}`}
                          checked={assessment.nutrition.concerns.includes(concern)}
                          onCheckedChange={(checked) => handleArrayChange('nutrition', 'concerns', concern, !!checked)}
                          data-testid={`checkbox-nutrition-${concern.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                        />
                        <Label htmlFor={`nutrition-${concern}`} className="text-sm">{concern}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Assessment */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Social Connection
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="font-medium mb-3 block">Social support level (1-10):</Label>
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={assessment.social.support}
                      onChange={(e) => setAssessment(prev => ({
                        ...prev,
                        social: { ...prev.social, support: parseInt(e.target.value) }
                      }))}
                      className="w-full"
                      data-testid="slider-social-support"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Very Low</span>
                      <span>{assessment.social.support}/10</span>
                      <span>Very High</span>
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium mb-3 block">Feelings of isolation (1-10):</Label>
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={assessment.social.isolation}
                      onChange={(e) => setAssessment(prev => ({
                        ...prev,
                        social: { ...prev.social, isolation: parseInt(e.target.value) }
                      }))}
                      className="w-full"
                      data-testid="slider-social-isolation"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Never Lonely</span>
                      <span>{assessment.social.isolation}/10</span>
                      <span>Very Lonely</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="font-medium mb-3 block">Current social activities:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {socialActivities.map((activity) => (
                      <div key={activity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`social-${activity}`}
                          checked={assessment.social.activities.includes(activity)}
                          onCheckedChange={(checked) => handleArrayChange('social', 'activities', activity, !!checked)}
                          data-testid={`checkbox-social-${activity.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                        />
                        <Label htmlFor={`social-${activity}`} className="text-sm">{activity}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stress Assessment */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Stress & Coping
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="font-medium mb-3 block">Overall stress level (1-10):</Label>
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={assessment.stress.level}
                      onChange={(e) => setAssessment(prev => ({
                        ...prev,
                        stress: { ...prev.stress, level: parseInt(e.target.value) }
                      }))}
                      className="w-full"
                      data-testid="slider-stress-level"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Very Low</span>
                      <span>{assessment.stress.level}/10</span>
                      <span>Very High</span>
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium mb-3 block">Stress management skills (1-10):</Label>
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={assessment.stress.management}
                      onChange={(e) => setAssessment(prev => ({
                        ...prev,
                        stress: { ...prev.stress, management: parseInt(e.target.value) }
                      }))}
                      className="w-full"
                      data-testid="slider-stress-management"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Very Poor</span>
                      <span>{assessment.stress.management}/10</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label className="font-medium mb-3 block">Main sources of stress:</Label>
                    <div className="space-y-2">
                      {stressSources.map((source) => (
                        <div key={source} className="flex items-center space-x-2">
                          <Checkbox
                            id={`stress-source-${source}`}
                            checked={assessment.stress.sources.includes(source)}
                            onCheckedChange={(checked) => handleArrayChange('stress', 'sources', source, !!checked)}
                            data-testid={`checkbox-stress-source-${source.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                          />
                          <Label htmlFor={`stress-source-${source}`} className="text-sm">{source}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium mb-3 block">Current coping strategies:</Label>
                    <div className="space-y-2">
                      {copingStrategies.map((strategy) => (
                        <div key={strategy} className="flex items-center space-x-2">
                          <Checkbox
                            id={`coping-${strategy}`}
                            checked={assessment.stress.coping.includes(strategy)}
                            onCheckedChange={(checked) => handleArrayChange('stress', 'coping', strategy, !!checked)}
                            data-testid={`checkbox-coping-${strategy.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                          />
                          <Label htmlFor={`coping-${strategy}`} className="text-sm">{strategy}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Goals & Motivation */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Goals & Motivation
                </h3>
                <div>
                  <Label htmlFor="motivation" className="font-medium">What motivates you to improve your lifestyle?</Label>
                  <Textarea
                    id="motivation"
                    placeholder="e.g., Want to feel more energetic, reduce anxiety, be there for my family..."
                    value={assessment.motivation}
                    onChange={(e) => setAssessment(prev => ({ ...prev, motivation: e.target.value }))}
                    rows={3}
                    className="mt-2"
                    data-testid="textarea-motivation"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <h4 className="font-semibold">Overall Wellness Score</h4>
                  <p className="text-sm text-gray-600">Based on your responses</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{getWellnessScore()}%</div>
                  <p className="text-sm text-gray-600">Wellness Level</p>
                </div>
              </div>

              <Button 
                onClick={() => {
                  generateActionPlan();
                  setCompletedSections(prev => [...prev, 'assessment']);
                }}
                className="w-full gap-2"
                size="lg"
                data-testid="button-generate-action-plan"
              >
                Generate My Personalized Action Plan <Calendar className="w-4 h-4" />
              </Button>

              {/* Action Plan Display */}
              {actionPlan.length > 0 && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Target className="w-5 h-5" />
                      Your Personalized Action Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {actionPlan.map((recommendation, index) => (
                      <Card key={index} className="border-l-4 border-l-green-400 bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Badge variant="secondary" className="mt-1">
                              {index + 1}
                            </Badge>
                            <p className="text-sm text-green-800">{recommendation}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="bg-blue-50 p-4 rounded-lg mt-6">
                      <h4 className="font-semibold text-blue-800 mb-2">Implementation Strategy</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>• Choose 1-2 recommendations to start with this week</p>
                        <p>• Focus on consistency over perfection</p>
                        <p>• Track your progress and celebrate small wins</p>
                        <p>• Add new changes gradually as habits form (usually 2-4 weeks)</p>
                        <p>• Remember: small changes compound into significant results over time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tips */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 text-green-800">🌱 Lifestyle Change Tips</h4>
          <div className="space-y-2 text-sm text-green-700">
            <p>• Start with the easiest change first to build momentum and confidence</p>
            <p>• Stack new habits onto existing ones (e.g., do squats while brushing teeth)</p>
            <p>• Focus on adding healthy behaviors rather than restricting unhealthy ones</p>
            <p>• Expect setbacks - they're part of the process, not a sign of failure</p>
            <p>• Track your mood and anxiety levels to see how lifestyle changes help</p>
            <p>• Share your goals with supportive friends or family for accountability</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}