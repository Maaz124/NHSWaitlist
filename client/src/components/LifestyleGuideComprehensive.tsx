import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  Activity, 
  Apple, 
  Users, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Target,
  FileText,
  PenTool,
  Star,
  Sun,
  Clock,
  BookOpen
} from "lucide-react";

interface LifestyleAssessment {
  exerciseFrequency: number;
  exerciseTypes: string[];
  dietQuality: number;
  socialConnections: number;
  stressManagement: string[];
  sleepQuality: number;
  screenTime: number;
  outdoorTime: number;
  hobbies: string[];
  barriers: string[];
}

export function LifestyleGuideComprehensive() {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [assessment, setAssessment] = useState<LifestyleAssessment>({
    exerciseFrequency: 2,
    exerciseTypes: [],
    dietQuality: 5,
    socialConnections: 5,
    stressManagement: [],
    sleepQuality: 5,
    screenTime: 6,
    outdoorTime: 1,
    hobbies: [],
    barriers: []
  });
  const [personalGoals, setPersonalGoals] = useState<string[]>([]);
  const [personalNotes, setPersonalNotes] = useState<Record<string, string>>({});

  const sections = [
    {
      id: 0,
      title: "Lifestyle Factors & Mental Health",
      content: (
        <div className="space-y-6">
          <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-400">
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">The Foundation of Mental Wellbeing</h3>
            <p className="text-emerald-700 mb-4">
              Lifestyle factors play a crucial role in mental health. Research consistently shows that 
              physical activity, nutrition, sleep, social connections, and stress management work together 
              to support emotional wellbeing and reduce anxiety symptoms.
            </p>
            <div className="bg-white p-4 rounded border border-emerald-200">
              <h4 className="font-semibold text-emerald-800 mb-2">NICE Guidelines on Lifestyle Interventions:</h4>
              <p className="text-emerald-700 text-sm">
                "Lifestyle interventions including physical activity, dietary improvements, and social support 
                should be considered as part of a comprehensive approach to treating anxiety disorders. 
                These interventions have strong evidence for improving mental health outcomes."
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Physical Activity & Exercise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-1">Immediate Effects</h4>
                    <p className="text-blue-700 text-sm">Releases endorphins, reduces stress hormones, improves mood within minutes</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-1">Long-term Benefits</h4>
                    <p className="text-blue-700 text-sm">Builds resilience, improves sleep quality, enhances self-esteem</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-1">Evidence</h4>
                    <p className="text-blue-700 text-sm">30 minutes moderate exercise 3-5 times weekly reduces anxiety by 20-30%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Apple className="w-5 h-5" />
                  Nutrition & Brain Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-1">Brain-Gut Connection</h4>
                    <p className="text-orange-700 text-sm">90% of serotonin is produced in the gut - diet directly affects mood</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-1">Blood Sugar Stability</h4>
                    <p className="text-orange-700 text-sm">Stable glucose levels prevent anxiety-mimicking symptoms</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-1">Anti-inflammatory Foods</h4>
                    <p className="text-orange-700 text-sm">Reduce inflammation linked to anxiety and depression</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Social Connections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-1">Oxytocin Release</h4>
                    <p className="text-purple-700 text-sm">Social bonding releases natural anxiety-reducing hormones</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-1">Stress Buffering</h4>
                    <p className="text-purple-700 text-sm">Strong relationships protect against stress and anxiety</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-1">Perspective & Support</h4>
                    <p className="text-purple-700 text-sm">Others provide different viewpoints and emotional support</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  Environment & Nature
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-1">Nature Exposure</h4>
                    <p className="text-green-700 text-sm">20 minutes in nature reduces cortisol levels significantly</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-1">Sunlight & Vitamin D</h4>
                    <p className="text-green-700 text-sm">Natural light regulates mood and circadian rhythms</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-1">Mindful Environment</h4>
                    <p className="text-green-700 text-sm">Clutter-free, calming spaces support mental clarity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-indigo-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-indigo-800 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                The Synergistic Effect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-indigo-800 mb-3">Research Findings</h4>
                  <ul className="text-indigo-700 space-y-2">
                    <li>• People with 4+ healthy lifestyle factors have 50% lower anxiety risk</li>
                    <li>• Combined interventions are more effective than single approaches</li>
                    <li>• Small changes in multiple areas create significant improvements</li>
                    <li>• Benefits compound over time - effects increase with consistency</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-800 mb-3">The Positive Cycle</h4>
                  <div className="p-4 bg-white rounded border border-indigo-200">
                    <div className="text-center">
                      <div className="text-sm text-indigo-600 mb-2">Better Sleep</div>
                      <div className="text-xs text-indigo-500">↓</div>
                      <div className="text-sm text-indigo-600 mb-2">More Energy</div>
                      <div className="text-xs text-indigo-500">↓</div>
                      <div className="text-sm text-indigo-600 mb-2">More Activity</div>
                      <div className="text-xs text-indigo-500">↓</div>
                      <div className="text-sm text-indigo-600 mb-2">Better Mood</div>
                      <div className="text-xs text-indigo-500">↓</div>
                      <div className="text-sm text-indigo-600">Better Sleep...</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Current Lifestyle Perspective</h3>
            <Textarea
              placeholder="Reflect on your current lifestyle. Which areas feel supportive of your mental health? Which areas might need attention?"
              value={personalNotes['section0'] || ''}
              onChange={(e) => setPersonalNotes(prev => ({...prev, section0: e.target.value}))}
              className="min-h-[100px]"
            />
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Personal Lifestyle Assessment",
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">Lifestyle Factors Assessment</h3>
            <p className="text-blue-700">
              This comprehensive assessment helps identify your current lifestyle patterns and areas 
              for potential improvement. Be honest - this is for your benefit and growth.
            </p>
          </div>

          <Card className="bg-white border-2">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Physical Activity & Movement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="font-semibold text-blue-800">How many days per week do you engage in physical activity (20+ minutes)?</Label>
                <div className="mt-2">
                  <Slider
                    value={[assessment.exerciseFrequency]}
                    onValueChange={(value) => setAssessment(prev => ({...prev, exerciseFrequency: value[0]}))}
                    max={7}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-blue-600 mt-1">
                    <span>0 days</span>
                    <span className="font-medium">{assessment.exerciseFrequency} days/week</span>
                    <span>7 days</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="font-semibold text-blue-800 mb-3 block">Types of physical activity you enjoy or do regularly: (check all that apply)</Label>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    'Walking', 'Running/Jogging', 'Cycling', 'Swimming', 'Dancing', 'Yoga/Pilates',
                    'Strength training', 'Team sports', 'Hiking', 'Gardening', 'Household tasks', 'Other active hobbies'
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`activity-${index}`}
                        checked={assessment.exerciseTypes.includes(activity)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setAssessment(prev => ({
                              ...prev, 
                              exerciseTypes: [...prev.exerciseTypes, activity]
                            }));
                          } else {
                            setAssessment(prev => ({
                              ...prev,
                              exerciseTypes: prev.exerciseTypes.filter(a => a !== activity)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`activity-${index}`} className="text-blue-700 text-sm">{activity}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Apple className="w-5 h-5" />
                Nutrition & Eating Patterns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="font-semibold text-orange-800">Overall diet quality (1 = very poor, 10 = excellent)</Label>
                <div className="mt-2">
                  <Slider
                    value={[assessment.dietQuality]}
                    onValueChange={(value) => setAssessment(prev => ({...prev, dietQuality: value[0]}))}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-orange-600 mt-1">
                    <span>Very Poor</span>
                    <span className="font-medium">{assessment.dietQuality}/10</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-orange-800">Current Eating Habits (check if true for you)</h4>
                  <div className="space-y-3">
                    {[
                      'I eat regular meals (don\'t skip meals)',
                      'I include fruits and vegetables daily',
                      'I limit processed/fast foods',
                      'I stay well hydrated',
                      'I limit caffeine (especially afternoon)',
                      'I limit alcohol consumption'
                    ].map((habit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`eating-${index}`} />
                        <Label htmlFor={`eating-${index}`} className="text-orange-700 text-sm">{habit}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-orange-800">Nutrition Challenges (check if applies)</h4>
                  <div className="space-y-3">
                    {[
                      'Emotional eating when stressed/anxious',
                      'Irregular eating schedule',
                      'Too much caffeine (>3 cups coffee/day)',
                      'Frequent fast food or takeaways',
                      'Skipping meals due to anxiety',
                      'Using food to cope with emotions'
                    ].map((challenge, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`challenge-${index}`} />
                        <Label htmlFor={`challenge-${index}`} className="text-orange-700 text-sm">{challenge}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Social Connections & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="font-semibold text-purple-800">Quality of social connections (1 = very isolated, 10 = very connected)</Label>
                <div className="mt-2">
                  <Slider
                    value={[assessment.socialConnections]}
                    onValueChange={(value) => setAssessment(prev => ({...prev, socialConnections: value[0]}))}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-purple-600 mt-1">
                    <span>Very Isolated</span>
                    <span className="font-medium">{assessment.socialConnections}/10</span>
                    <span>Very Connected</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="font-semibold text-purple-800 mb-3 block">My social support includes: (check all that apply)</Label>
                  <div className="space-y-3">
                    {[
                      'Close family relationships',
                      'Trusted friends I can confide in',
                      'Regular social activities or groups',
                      'Work colleagues I connect with',
                      'Community involvement (clubs, volunteering)',
                      'Online communities or support groups'
                    ].map((support, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`support-${index}`} />
                        <Label htmlFor={`support-${index}`} className="text-purple-700 text-sm">{support}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="font-semibold text-purple-800 mb-3 block">Social challenges I face: (check if applies)</Label>
                  <div className="space-y-3">
                    {[
                      'Anxiety makes socializing difficult',
                      'Limited time for social activities',
                      'Few people I feel close to',
                      'Difficulty making new connections',
                      'Prefer to isolate when stressed',
                      'Feel like a burden to others'
                    ].map((barrier, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`social-barrier-${index}`} />
                        <Label htmlFor={`social-barrier-${index}`} className="text-purple-700 text-sm">{barrier}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Sun className="w-5 h-5" />
                Environment & Daily Habits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="font-semibold text-green-800">Hours spent on screens daily (excluding work)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[assessment.screenTime]}
                      onValueChange={(value) => setAssessment(prev => ({...prev, screenTime: value[0]}))}
                      max={12}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-green-600 mt-1">
                      <span>1 hour</span>
                      <span className="font-medium">{assessment.screenTime} hours</span>
                      <span>12+ hours</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold text-green-800">Hours spent outdoors daily</Label>
                  <div className="mt-2">
                    <Slider
                      value={[assessment.outdoorTime]}
                      onValueChange={(value) => setAssessment(prev => ({...prev, outdoorTime: value[0]}))}
                      max={8}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-green-600 mt-1">
                      <span>0 hours</span>
                      <span className="font-medium">{assessment.outdoorTime} hours</span>
                      <span>8+ hours</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="font-semibold text-green-800 mb-3 block">Hobbies and interests I pursue: (check all that apply)</Label>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    'Reading', 'Music (playing/listening)', 'Art/Crafts', 'Cooking/Baking', 'Gardening',
                    'Photography', 'Writing/Journaling', 'Learning new skills', 'Board games/Puzzles',
                    'Nature activities', 'Building/DIY projects', 'Collecting'
                  ].map((hobby, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`hobby-${index}`}
                        checked={assessment.hobbies.includes(hobby)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setAssessment(prev => ({
                              ...prev, 
                              hobbies: [...prev.hobbies, hobby]
                            }));
                          } else {
                            setAssessment(prev => ({
                              ...prev,
                              hobbies: prev.hobbies.filter(h => h !== hobby)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`hobby-${index}`} className="text-green-700 text-sm">{hobby}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Lifestyle Notes</h3>
            <Textarea
              placeholder="Describe any other lifestyle factors that affect your wellbeing - work patterns, living situation, health conditions, medications, etc."
              value={personalNotes['section1'] || ''}
              onChange={(e) => setPersonalNotes(prev => ({...prev, section1: e.target.value}))}
              className="min-h-[80px]"
            />
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Evidence-Based Lifestyle Strategies",
      content: (
        <div className="space-y-6">
          <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-400">
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">Research-Backed Lifestyle Interventions</h3>
            <p className="text-emerald-700 mb-4">
              These strategies are based on extensive research and clinical evidence. Small, consistent 
              changes often produce significant improvements in anxiety and overall mental health.
            </p>
          </div>

          <div className="space-y-8">
            {/* Physical Activity Strategies */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  Movement & Exercise Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">Starting Small (0-2 days/week currently)</h4>
                    <ul className="text-blue-700 space-y-2 text-sm">
                      <li><strong>Week 1-2:</strong> 10-minute daily walks</li>
                      <li><strong>Week 3-4:</strong> 15-minute walks + 1 active hobby</li>
                      <li><strong>Week 5-6:</strong> 20-minute activities 3x/week</li>
                      <li><strong>Goal:</strong> Build habit before intensity</li>
                      <li><strong>Key:</strong> Choose enjoyable activities</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">Building On Success (3+ days/week)</h4>
                    <ul className="text-blue-700 space-y-2 text-sm">
                      <li><strong>Add variety:</strong> Mix cardio, strength, flexibility</li>
                      <li><strong>Increase duration:</strong> Aim for 30+ minutes</li>
                      <li><strong>Social element:</strong> Exercise with others</li>
                      <li><strong>Outdoor activities:</strong> Double benefits for anxiety</li>
                      <li><strong>Track progress:</strong> Celebrate improvements</li>
                    </ul>
                  </div>
                </div>

                <Card className="bg-blue-100">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">Quick Anxiety-Busting Movements</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <h5 className="font-medium text-blue-800">5-Minute Reset</h5>
                        <p className="text-blue-700 text-xs">Jumping jacks, stretches, or dancing to one song</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Activity className="w-6 h-6 text-white" />
                        </div>
                        <h5 className="font-medium text-blue-800">Stair Climbing</h5>
                        <p className="text-blue-700 text-xs">2-3 flights up and down when feeling overwhelmed</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <h5 className="font-medium text-blue-800">Mindful Walking</h5>
                        <p className="text-blue-700 text-xs">Focus on each step and your surroundings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Nutrition Strategies */}
            <Card className="bg-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Apple className="w-6 h-6" />
                  Nutrition for Mental Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white rounded border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-3">Brain-Boosting Foods</h4>
                    <ul className="text-orange-700 space-y-2 text-sm">
                      <li><strong>Omega-3 rich:</strong> Salmon, walnuts, chia seeds</li>
                      <li><strong>Magnesium:</strong> Dark leafy greens, nuts, whole grains</li>
                      <li><strong>B vitamins:</strong> Eggs, legumes, nutritional yeast</li>
                      <li><strong>Antioxidants:</strong> Berries, dark chocolate, green tea</li>
                      <li><strong>Probiotics:</strong> Yogurt, kefir, fermented foods</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white rounded border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-3">Anxiety-Friendly Eating Patterns</h4>
                    <ul className="text-orange-700 space-y-2 text-sm">
                      <li><strong>Regular meals:</strong> Every 3-4 hours to stabilize blood sugar</li>
                      <li><strong>Protein with each meal:</strong> Supports steady energy</li>
                      <li><strong>Complex carbs:</strong> Oats, quinoa, sweet potatoes</li>
                      <li><strong>Limit caffeine:</strong> Especially after 2 PM</li>
                      <li><strong>Stay hydrated:</strong> Dehydration worsens anxiety</li>
                    </ul>
                  </div>
                </div>

                <Card className="bg-orange-100">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-orange-800 mb-3">Weekly Meal Planning Strategy</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-orange-800 mb-2">Prep Day Approach</h5>
                        <ul className="text-orange-700 text-sm space-y-1">
                          <li>• Choose one day for meal prep</li>
                          <li>• Prepare 2-3 anxiety-friendly recipes</li>
                          <li>• Wash and chop vegetables</li>
                          <li>• Cook grains in bulk (brown rice, quinoa)</li>
                          <li>• Portion snacks (nuts, fruit)</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-orange-800 mb-2">Emergency Food Kit</h5>
                        <ul className="text-orange-700 text-sm space-y-1">
                          <li>• Canned beans and lentils</li>
                          <li>• Frozen vegetables and fruits</li>
                          <li>• Whole grain crackers</li>
                          <li>• Nut butter and nuts</li>
                          <li>• Herbal teas (chamomile, passionflower)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Social Connection Strategies */}
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Building Social Connections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white rounded border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3">For Social Anxiety</h4>
                    <ul className="text-purple-700 space-y-2 text-sm">
                      <li><strong>Start small:</strong> Brief, low-pressure interactions</li>
                      <li><strong>Structure helps:</strong> Classes, volunteering, hobby groups</li>
                      <li><strong>Online first:</strong> Forums or video calls before in-person</li>
                      <li><strong>Bring a friend:</strong> Less intimidating social situations</li>
                      <li><strong>Practice self-compassion:</strong> Awkward moments are normal</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white rounded border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3">Strengthening Existing Relationships</h4>
                    <ul className="text-purple-700 space-y-2 text-sm">
                      <li><strong>Quality over quantity:</strong> Deepen current connections</li>
                      <li><strong>Regular check-ins:</strong> Text or call weekly</li>
                      <li><strong>Share vulnerabilities:</strong> Be authentic about struggles</li>
                      <li><strong>Offer support:</strong> Listen and be present for others</li>
                      <li><strong>Create traditions:</strong> Regular walks, coffee dates</li>
                    </ul>
                  </div>
                </div>

                <Card className="bg-purple-100">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-purple-800 mb-3">Low-Pressure Social Activities</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                      <div>
                        <h5 className="font-medium text-purple-800">Shared Interest Groups</h5>
                        <p className="text-purple-700 text-xs mt-1">Book clubs, hiking groups, art classes</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-purple-800">Volunteer Work</h5>
                        <p className="text-purple-700 text-xs mt-1">Animal shelters, community gardens, food banks</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-purple-800">Workplace Connections</h5>
                        <p className="text-purple-700 text-xs mt-1">Lunch invitations, after-work activities</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Environment & Routine Strategies */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Creating a Supportive Environment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white rounded border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">Physical Environment</h4>
                    <ul className="text-green-700 space-y-2 text-sm">
                      <li><strong>Declutter spaces:</strong> Reduce visual overstimulation</li>
                      <li><strong>Natural light:</strong> Open curtains, work near windows</li>
                      <li><strong>Plants and nature:</strong> Indoor plants, nature photos</li>
                      <li><strong>Comfort zone:</strong> Cozy reading nook or relaxation space</li>
                      <li><strong>Minimize digital distractions:</strong> Phone-free meals/bedrooms</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white rounded border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">Daily Routines</h4>
                    <ul className="text-green-700 space-y-2 text-sm">
                      <li><strong>Consistent wake/sleep times:</strong> Supports circadian rhythms</li>
                      <li><strong>Morning routine:</strong> 15 minutes of calm preparation</li>
                      <li><strong>Transition rituals:</strong> Signals between work and personal time</li>
                      <li><strong>Evening wind-down:</strong> Screen-free relaxation time</li>
                      <li><strong>Weekly planning:</strong> Reduces decision fatigue</li>
                    </ul>
                  </div>
                </div>

                <Card className="bg-green-100">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-800 mb-3">Nature Connection Ideas</h4>
                    <div className="grid md:grid-cols-4 gap-4 text-center">
                      <div>
                        <Sun className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <h5 className="font-medium text-green-800">Morning Sunlight</h5>
                        <p className="text-green-700 text-xs">10 minutes within 2 hours of waking</p>
                      </div>
                      <div>
                        <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <h5 className="font-medium text-green-800">Outdoor Movement</h5>
                        <p className="text-green-700 text-xs">Walk, garden, or exercise outside</p>
                      </div>
                      <div>
                        <Heart className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <h5 className="font-medium text-green-800">Mindful Observation</h5>
                        <p className="text-green-700 text-xs">Watch clouds, birds, or changing seasons</p>
                      </div>
                      <div>
                        <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <h5 className="font-medium text-green-800">Outdoor Social Time</h5>
                        <p className="text-green-700 text-xs">Picnics, outdoor markets, park meetups</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Strategy Planning & Implementation</h3>
            <Textarea
              placeholder="Which lifestyle strategies resonate most with you? What specific changes would you like to try first? What might make implementation easier or more challenging?"
              value={personalNotes['section2'] || ''}
              onChange={(e) => setPersonalNotes(prev => ({...prev, section2: e.target.value}))}
              className="min-h-[100px]"
            />
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Personal Lifestyle Action Plan",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-lg border-l-4 border-emerald-400">
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">Your Lifestyle Transformation Plan</h3>
            <p className="text-emerald-700">
              Based on your assessment and the evidence-based strategies, create a realistic, 
              sustainable plan for improving your lifestyle and mental wellbeing.
            </p>
          </div>

          {/* Assessment Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Your Lifestyle Assessment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded border">
                  <div className="text-2xl font-bold text-blue-800">{assessment.exerciseFrequency}</div>
                  <p className="text-sm text-blue-600">Exercise days/week</p>
                  <p className="text-xs text-blue-500">
                    {assessment.exerciseFrequency < 3 ? 'Room for improvement' : assessment.exerciseFrequency < 5 ? 'Good foundation' : 'Excellent!'}
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded border">
                  <div className="text-2xl font-bold text-blue-800">{assessment.dietQuality}/10</div>
                  <p className="text-sm text-blue-600">Diet quality rating</p>
                  <p className="text-xs text-blue-500">
                    {assessment.dietQuality < 6 ? 'Focus area' : assessment.dietQuality < 8 ? 'Good progress possible' : 'Very good'}
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded border">
                  <div className="text-2xl font-bold text-blue-800">{assessment.socialConnections}/10</div>
                  <p className="text-sm text-blue-600">Social connections</p>
                  <p className="text-xs text-blue-500">
                    {assessment.socialConnections < 5 ? 'Priority area' : assessment.socialConnections < 7 ? 'Building well' : 'Strong network'}
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded border">
                  <div className="text-2xl font-bold text-blue-800">{assessment.outdoorTime}h</div>
                  <p className="text-sm text-blue-600">Daily outdoor time</p>
                  <p className="text-xs text-blue-500">
                    {assessment.outdoorTime < 1 ? 'Needs attention' : assessment.outdoorTime < 2 ? 'Good start' : 'Excellent!'}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded border">
                  <h4 className="font-semibold text-blue-800 mb-2">Your Lifestyle Strengths:</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    {assessment.exerciseTypes.slice(0, 3).map((type, index) => (
                      <li key={index}>✓ Enjoys {type.toLowerCase()}</li>
                    ))}
                    {assessment.hobbies.slice(0, 2).map((hobby, index) => (
                      <li key={index}>✓ Pursues {hobby.toLowerCase()}</li>
                    ))}
                    {assessment.socialConnections > 6 && <li>✓ Strong social connections</li>}
                    {assessment.dietQuality > 6 && <li>✓ Good nutrition awareness</li>}
                  </ul>
                </div>
                <div className="p-4 bg-white rounded border">
                  <h4 className="font-semibold text-blue-800 mb-2">Areas of Opportunity:</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    {assessment.exerciseFrequency < 3 && <li>• Increase physical activity consistency</li>}
                    {assessment.dietQuality < 7 && <li>• Enhance nutrition quality</li>}
                    {assessment.socialConnections < 6 && <li>• Build social support network</li>}
                    {assessment.outdoorTime < 1.5 && <li>• Increase nature exposure</li>}
                    {assessment.screenTime > 6 && <li>• Reduce excessive screen time</li>}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 30-Day Challenge */}
          <Card className="bg-emerald-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Target className="w-5 h-5" />
                30-Day Lifestyle Challenge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-emerald-700 mb-4">
                Choose 3-4 specific goals for the next 30 days. Start small for sustainable change.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-3">Movement & Energy</h4>
                  <div className="space-y-2">
                    {[
                      'Take a 10-minute walk every day',
                      'Do 5 minutes of morning stretches daily',
                      'Try 2 new physical activities this month',
                      'Take stairs instead of elevators when possible',
                      'Stand and move for 2 minutes every hour'
                    ].map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`movement-${index}`}
                          checked={personalGoals.includes(goal)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPersonalGoals(prev => [...prev, goal]);
                            } else {
                              setPersonalGoals(prev => prev.filter(g => g !== goal));
                            }
                          }}
                        />
                        <Label htmlFor={`movement-${index}`} className="text-emerald-700 text-sm">{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-3">Nutrition & Hydration</h4>
                  <div className="space-y-2">
                    {[
                      'Eat 2 servings of vegetables with lunch and dinner',
                      'Drink 8 glasses of water daily',
                      'Plan and prep 3 healthy meals each week',
                      'Limit caffeine after 2 PM',
                      'Try 3 new anxiety-reducing foods (salmon, walnuts, etc.)'
                    ].map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`nutrition-${index}`}
                          checked={personalGoals.includes(goal)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPersonalGoals(prev => [...prev, goal]);
                            } else {
                              setPersonalGoals(prev => prev.filter(g => g !== goal));
                            }
                          }}
                        />
                        <Label htmlFor={`nutrition-${index}`} className="text-emerald-700 text-sm">{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-3">Social & Connection</h4>
                  <div className="space-y-2">
                    {[
                      'Reach out to one friend/family member weekly',
                      'Join one new group or activity',
                      'Have one meaningful conversation each week',
                      'Practice giving one genuine compliment daily',
                      'Volunteer for a cause I care about'
                    ].map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`social-${index}`}
                          checked={personalGoals.includes(goal)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPersonalGoals(prev => [...prev, goal]);
                            } else {
                              setPersonalGoals(prev => prev.filter(g => g !== goal));
                            }
                          }}
                        />
                        <Label htmlFor={`social-${index}`} className="text-emerald-700 text-sm">{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-3">Environment & Mindfulness</h4>
                  <div className="space-y-2">
                    {[
                      'Spend 20 minutes outdoors daily',
                      'Create a clutter-free, calming bedroom',
                      'Limit recreational screen time to 2 hours/day',
                      'Practice 5 minutes of mindfulness daily',
                      'Establish a consistent morning routine'
                    ].map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`environment-${index}`}
                          checked={personalGoals.includes(goal)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPersonalGoals(prev => [...prev, goal]);
                            } else {
                              setPersonalGoals(prev => prev.filter(g => g !== goal));
                            }
                          }}
                        />
                        <Label htmlFor={`environment-${index}`} className="text-emerald-700 text-sm">{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Planning Template */}
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Weekly Planning Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Week 1-2: Foundation Building</h4>
                  <ul className="text-purple-700 text-sm space-y-1">
                    <li>• Focus on 1-2 small, achievable goals</li>
                    <li>• Track daily progress (checkmarks work well)</li>
                    <li>• Notice how changes affect your mood</li>
                    <li>• Be patient with yourself - new habits take time</li>
                    <li>• Celebrate small wins each day</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Week 3-4: Building Momentum</h4>
                  <ul className="text-purple-700 text-sm space-y-1">
                    <li>• Add one additional goal if feeling confident</li>
                    <li>• Identify what's working well and what isn't</li>
                    <li>• Adjust strategies based on what you've learned</li>
                    <li>• Involve friends/family in your healthy changes</li>
                    <li>• Plan for challenges and setbacks</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3">Weekly Reflection Questions</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-medium text-purple-800 mb-1">Progress</h5>
                    <ul className="text-purple-700 text-xs space-y-1">
                      <li>• What went well this week?</li>
                      <li>• Which goals did I achieve?</li>
                      <li>• What was easier than expected?</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-800 mb-1">Challenges</h5>
                    <ul className="text-purple-700 text-xs space-y-1">
                      <li>• What obstacles did I encounter?</li>
                      <li>• Which habits were hardest to maintain?</li>
                      <li>• What triggered old patterns?</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-800 mb-1">Adjustments</h5>
                    <ul className="text-purple-700 text-xs space-y-1">
                      <li>• How can I modify my approach?</li>
                      <li>• What support do I need?</li>
                      <li>• What will I focus on next week?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Resources */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Support & Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">Apps & Tools</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded border border-yellow-200">
                      <p className="font-medium text-yellow-800">Movement Tracking</p>
                      <p className="text-yellow-700 text-sm">NHS Couch to 5K, Strava, phone step counter</p>
                    </div>
                    <div className="p-3 bg-white rounded border border-yellow-200">
                      <p className="font-medium text-yellow-800">Nutrition Support</p>
                      <p className="text-yellow-700 text-sm">MyFitnessPal, NHS Eatwell Guide, meal planning apps</p>
                    </div>
                    <div className="p-3 bg-white rounded border border-yellow-200">
                      <p className="font-medium text-yellow-800">Social Connection</p>
                      <p className="text-yellow-700 text-sm">Meetup.com, local community centers, volunteering platforms</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">Professional Support</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded border border-yellow-200">
                      <p className="font-medium text-yellow-800">GP & NHS Services</p>
                      <p className="text-yellow-700 text-sm">Discuss lifestyle changes, referrals to specialists</p>
                    </div>
                    <div className="p-3 bg-white rounded border border-yellow-200">
                      <p className="font-medium text-yellow-800">Mental Health Support</p>
                      <p className="text-yellow-700 text-sm">IAPT services, counseling, peer support groups</p>
                    </div>
                    <div className="p-3 bg-white rounded border border-yellow-200">
                      <p className="font-medium text-yellow-800">Community Resources</p>
                      <p className="text-yellow-700 text-sm">Libraries, community centers, local sports clubs</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Personal Commitment Statement</h3>
            <Textarea
              placeholder="Write your commitment to yourself. What lifestyle changes are you most excited about? How will you maintain motivation when things get challenging? What support do you need?"
              value={personalNotes['section3'] || ''}
              onChange={(e) => setPersonalNotes(prev => ({...prev, section3: e.target.value}))}
              className="min-h-[120px]"
            />
          </div>
        </div>
      )
    }
  ];

  const markSectionComplete = (sectionId: number) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  const progressPercentage = Math.round((completedSections.length / sections.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-600 to-green-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-3xl">
            <Heart className="w-10 h-10" />
            Lifestyle & Wellbeing Guide
          </CardTitle>
          <p className="text-emerald-100 text-lg">
            Evidence-based lifestyle interventions for mental health and anxiety management
          </p>
          <Badge variant="secondary" className="bg-white/20 text-white w-fit mx-auto">
            Holistic Approach • Personal Assessment • 30-Day Action Plan
          </Badge>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Learning Progress
            </h3>
            <Badge variant="outline">{completedSections.length}/{sections.length} sections completed</Badge>
          </div>
          <Progress value={progressPercentage} className="mb-2" />
          <p className="text-sm text-muted-foreground">{progressPercentage}% complete • Estimated time: 25-30 minutes</p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={currentSection === section.id ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentSection(section.id)}
            className="flex items-center gap-2"
          >
            {completedSections.includes(section.id) && <CheckCircle className="w-4 h-4" />}
            {section.title}
          </Button>
        ))}
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            {sections[currentSection].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections[currentSection].content}
          
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
            >
              Previous Section
            </Button>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => markSectionComplete(currentSection)}
                disabled={completedSections.includes(currentSection)}
              >
                {completedSections.includes(currentSection) ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Section Complete
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4 mr-2" />
                    Mark Complete
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                disabled={currentSection === sections.length - 1}
              >
                Next Section
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Certificate */}
      {completedSections.length === sections.length && (
        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-800 mb-3">
              🌟 Outstanding! You've completed the Lifestyle & Wellbeing guide.
            </h3>
            <p className="text-emerald-700 text-lg mb-4">
              You now have a comprehensive, personalized plan for supporting your mental health through lifestyle changes.
            </p>
            <div className="bg-white p-4 rounded border border-emerald-200 text-left">
              <h4 className="font-semibold text-emerald-800 mb-2">Your Lifestyle Toolkit Now Includes:</h4>
              <ul className="text-emerald-700 space-y-1 text-sm">
                <li>✓ Understanding of how lifestyle factors impact mental health</li>
                <li>✓ Personal assessment of your current lifestyle patterns</li>
                <li>✓ Evidence-based strategies for movement, nutrition, and social connection</li>
                <li>✓ 30-day challenge with specific, achievable goals</li>
                <li>✓ Weekly planning templates and progress tracking tools</li>
                <li>✓ Resources and support for sustainable lifestyle changes</li>
              </ul>
            </div>
            <p className="text-emerald-600 text-sm mt-4">
              Remember: Sustainable lifestyle changes take time. Start small, be consistent, and celebrate every positive step forward.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}