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
  Moon, 
  Clock, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Lightbulb,
  Heart,
  Target,
  FileText,
  PenTool,
  Star,
  Bed,
  Sun,
  BookOpen
} from "lucide-react";

interface SleepAssessment {
  bedTime: string;
  wakeTime: string;
  sleepLatency: number;
  nightWakes: number;
  sleepQuality: number;
  daytimeEnergy: number;
  anxietyLevel: number;
  sleepEnvironment: string[];
  preSleeproutine: string[];
  hindrances: string[];
}

interface SleepDiaryEntry {
  date: string;
  bedTime: string;
  sleepTime: string;
  nightWakes: number;
  wakeTime: string;
  quality: number;
  notes: string;
}

export function SleepGuideComprehensive() {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [sleepAssessment, setSleepAssessment] = useState<SleepAssessment>({
    bedTime: '',
    wakeTime: '',
    sleepLatency: 30,
    nightWakes: 1,
    sleepQuality: 5,
    daytimeEnergy: 5,
    anxietyLevel: 5,
    sleepEnvironment: [],
    preSleeproutine: [],
    hindrances: []
  });
  const [personalPlan, setPersonalPlan] = useState<string[]>([]);
  const [personalNotes, setPersonalNotes] = useState<Record<string, string>>({});

  const sections = [
    {
      id: 0,
      title: "Sleep & Anxiety Connection",
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400">
            <h3 className="text-xl font-semibold text-indigo-800 mb-3">The Sleep-Anxiety Relationship</h3>
            <p className="text-indigo-700 mb-4">
              Sleep and anxiety have a bidirectional relationship - poor sleep can increase anxiety, 
              and anxiety can significantly disrupt sleep quality and duration. Understanding this 
              connection is crucial for breaking the cycle.
            </p>
            <div className="bg-white p-4 rounded border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-2">NICE Guidelines on Sleep & Mental Health:</h4>
              <p className="text-indigo-700 text-sm">
                "Sleep disturbances are both a symptom and a risk factor for anxiety disorders. 
                Improving sleep hygiene and addressing sleep difficulties should be integrated into anxiety treatment plans."
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  How Anxiety Disrupts Sleep
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-1">Racing Thoughts</h4>
                    <p className="text-red-700 text-sm">Mind won't "switch off" when trying to sleep</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-1">Physical Arousal</h4>
                    <p className="text-red-700 text-sm">Increased heart rate, muscle tension, restlessness</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-1">Sleep Anticipation Anxiety</h4>
                    <p className="text-red-700 text-sm">Worrying about not being able to sleep</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-1">Early Morning Awakening</h4>
                    <p className="text-red-700 text-sm">Waking up 2-4 hours earlier than intended</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  How Poor Sleep Increases Anxiety
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-1">Emotional Dysregulation</h4>
                    <p className="text-orange-700 text-sm">Reduced ability to manage stress and emotions</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-1">Cognitive Impairment</h4>
                    <p className="text-orange-700 text-sm">Difficulty concentrating and problem-solving</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-1">Increased Stress Hormones</h4>
                    <p className="text-orange-700 text-sm">Elevated cortisol levels throughout the day</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-1">Hypervigilance</h4>
                    <p className="text-orange-700 text-sm">Heightened alertness to potential threats</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Breaking the Cycle: The Good News
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 mb-3">Evidence-Based Benefits</h4>
                  <ul className="text-green-700 space-y-2">
                    <li>• Improving sleep can reduce anxiety by 40-60%</li>
                    <li>• Better sleep enhances emotional regulation</li>
                    <li>• Quality sleep improves stress resilience</li>
                    <li>• Good sleep habits support anxiety recovery</li>
                    <li>• Sleep interventions show results within 2-4 weeks</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibent text-green-800 mb-3">Recovery Approach</h4>
                  <p className="text-green-700 mb-3">
                    By addressing sleep difficulties alongside anxiety management, 
                    you create a positive feedback loop that supports overall mental health recovery.
                  </p>
                  <div className="p-3 bg-white rounded border border-green-200">
                    <p className="text-green-800 font-medium text-sm">
                      "Small, consistent changes to sleep habits often yield significant improvements in anxiety symptoms."
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Sleep-Anxiety Experience</h3>
            <Textarea
              placeholder="Describe how anxiety affects your sleep, and how poor sleep affects your anxiety the next day. What patterns have you noticed?"
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
      title: "Personal Sleep Assessment",
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">Sleep Pattern Assessment</h3>
            <p className="text-blue-700">
              Understanding your current sleep patterns helps identify specific areas for improvement. 
              This assessment follows validated sleep evaluation methods used in clinical practice.
            </p>
          </div>

          <Card className="bg-white border-2">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Sleep Timing & Quality Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sleep Timing */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="font-semibold text-blue-800">Usual Bedtime:</Label>
                  <Input
                    type="time"
                    value={sleepAssessment.bedTime}
                    onChange={(e) => setSleepAssessment(prev => ({...prev, bedTime: e.target.value}))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="font-semibold text-blue-800">Usual Wake Time:</Label>
                  <Input
                    type="time"
                    value={sleepAssessment.wakeTime}
                    onChange={(e) => setSleepAssessment(prev => ({...prev, wakeTime: e.target.value}))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Sleep Quality Metrics */}
              <div className="space-y-6">
                <div>
                  <Label className="font-semibold text-blue-800">How long does it usually take you to fall asleep? (minutes)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[sleepAssessment.sleepLatency]}
                      onValueChange={(value) => setSleepAssessment(prev => ({...prev, sleepLatency: value[0]}))}
                      max={120}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-blue-600 mt-1">
                      <span>5 min</span>
                      <span className="font-medium">{sleepAssessment.sleepLatency} minutes</span>
                      <span>120 min</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-semibold text-blue-800">How many times do you typically wake up during the night?</Label>
                  <div className="mt-2">
                    <Slider
                      value={[sleepAssessment.nightWakes]}
                      onValueChange={(value) => setSleepAssessment(prev => ({...prev, nightWakes: value[0]}))}
                      max={6}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-blue-600 mt-1">
                      <span>0 times</span>
                      <span className="font-medium">{sleepAssessment.nightWakes} times</span>
                      <span>6+ times</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-semibold text-blue-800">Overall sleep quality (1 = very poor, 10 = excellent)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[sleepAssessment.sleepQuality]}
                      onValueChange={(value) => setSleepAssessment(prev => ({...prev, sleepQuality: value[0]}))}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-blue-600 mt-1">
                      <span>Very Poor</span>
                      <span className="font-medium">{sleepAssessment.sleepQuality}/10</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-semibold text-blue-800">Daytime energy levels (1 = exhausted, 10 = highly energetic)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[sleepAssessment.daytimeEnergy]}
                      onValueChange={(value) => setSleepAssessment(prev => ({...prev, daytimeEnergy: value[0]}))}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-blue-600 mt-1">
                      <span>Exhausted</span>
                      <span className="font-medium">{sleepAssessment.daytimeEnergy}/10</span>
                      <span>Highly Energetic</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-semibold text-blue-800">Anxiety levels before bedtime (1 = calm, 10 = very anxious)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[sleepAssessment.anxietyLevel]}
                      onValueChange={(value) => setSleepAssessment(prev => ({...prev, anxietyLevel: value[0]}))}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-blue-600 mt-1">
                      <span>Calm</span>
                      <span className="font-medium">{sleepAssessment.anxietyLevel}/10</span>
                      <span>Very Anxious</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sleep Environment & Habits */}
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <Bed className="w-5 h-5" />
                Sleep Environment & Habits Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="font-semibold text-purple-800 mb-3 block">My bedroom environment includes: (check all that apply)</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Dark/blackout curtains',
                    'Comfortable temperature (60-67°F)',
                    'Quiet environment',
                    'Comfortable mattress & pillows',
                    'No electronic devices',
                    'No clutter or work materials',
                    'Good air circulation',
                    'White noise or earplugs if needed'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`env-${index}`}
                        checked={sleepAssessment.sleepEnvironment.includes(item)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSleepAssessment(prev => ({
                              ...prev, 
                              sleepEnvironment: [...prev.sleepEnvironment, item]
                            }));
                          } else {
                            setSleepAssessment(prev => ({
                              ...prev,
                              sleepEnvironment: prev.sleepEnvironment.filter(i => i !== item)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`env-${index}`} className="text-purple-700 text-sm">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="font-semibold text-purple-800 mb-3 block">My current pre-sleep routine includes: (check all that apply)</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Reading a book',
                    'Listening to calming music',
                    'Gentle stretching or yoga',
                    'Meditation or breathing exercises',
                    'Warm bath or shower',
                    'Journaling or gratitude practice',
                    'Avoiding screens 1 hour before bed',
                    'Limiting caffeine after 2 PM'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`routine-${index}`}
                        checked={sleepAssessment.preSleeproutine.includes(item)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSleepAssessment(prev => ({
                              ...prev, 
                              preSleeproutine: [...prev.preSleeproutine, item]
                            }));
                          } else {
                            setSleepAssessment(prev => ({
                              ...prev,
                              preSleeproutine: prev.preSleeproutine.filter(i => i !== item)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`routine-${index}`} className="text-purple-700 text-sm">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="font-semibold text-purple-800 mb-3 block">Things that interfere with my sleep: (check all that apply)</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Worrying or racing thoughts',
                    'Physical discomfort or pain',
                    'Noise from outside or partner',
                    'Too much light in bedroom',
                    'Drinking caffeine late in day',
                    'Using phone/tablet in bed',
                    'Eating large meals before bed',
                    'Alcohol consumption',
                    'Irregular sleep schedule',
                    'Stress from work or relationships'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`hindrance-${index}`}
                        checked={sleepAssessment.hindrances.includes(item)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSleepAssessment(prev => ({
                              ...prev, 
                              hindrances: [...prev.hindrances, item]
                            }));
                          } else {
                            setSleepAssessment(prev => ({
                              ...prev,
                              hindrances: prev.hindrances.filter(i => i !== item)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`hindrance-${index}`} className="text-purple-700 text-sm">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Sleep Challenges</h3>
            <Textarea
              placeholder="Describe any other sleep-related issues, medications, or patterns you've noticed..."
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
      title: "Evidence-Based Sleep Strategies",
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
            <h3 className="text-xl font-semibold text-green-800 mb-3">Sleep Hygiene & CBT-I Techniques</h3>
            <p className="text-green-700 mb-4">
              These strategies are based on Cognitive Behavioral Therapy for Insomnia (CBT-I), 
              the gold-standard treatment recommended by NICE guidelines for sleep difficulties.
            </p>
          </div>

          <div className="space-y-8">
            {/* Core Sleep Hygiene */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Core Sleep Hygiene Principles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <Sun className="w-5 h-5" />
                      Sleep Schedule Consistency
                    </h4>
                    <ul className="text-blue-700 space-y-2 text-sm">
                      <li><strong>Go to bed and wake up at the same time every day</strong> - even on weekends</li>
                      <li>Allow 7-9 hours for sleep opportunity</li>
                      <li>If you can't fall asleep within 20 minutes, get up and do a quiet activity</li>
                      <li>Return to bed when you feel sleepy</li>
                      <li>Use your bed only for sleep and intimacy</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <Moon className="w-5 h-5" />
                      Evening Wind-Down Routine
                    </h4>
                    <ul className="text-blue-700 space-y-2 text-sm">
                      <li><strong>Start 1-2 hours before bedtime</strong></li>
                      <li>Dim the lights progressively</li>
                      <li>Avoid screens or use blue light filters</li>
                      <li>Do relaxing activities (reading, bath, gentle stretching)</li>
                      <li>Write down tomorrow's worries to "park" them</li>
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">Environment Optimization</h4>
                    <ul className="text-blue-700 space-y-2 text-sm">
                      <li><strong>Temperature:</strong> 60-67°F (15-19°C)</li>
                      <li><strong>Darkness:</strong> Blackout curtains or eye mask</li>
                      <li><strong>Quiet:</strong> Earplugs or white noise</li>
                      <li><strong>Comfort:</strong> Quality mattress and pillows</li>
                      <li><strong>Clean space:</strong> Remove work materials and clutter</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">Daytime Practices</h4>
                    <ul className="text-blue-700 space-y-2 text-sm">
                      <li><strong>Light exposure:</strong> 20-30 minutes of morning sunlight</li>
                      <li><strong>Exercise:</strong> Regular activity, but not 3 hours before bed</li>
                      <li><strong>Caffeine:</strong> Avoid after 2 PM (effects last 6+ hours)</li>
                      <li><strong>Naps:</strong> If needed, limit to 20 minutes before 3 PM</li>
                      <li><strong>Meals:</strong> Avoid large meals 3 hours before bed</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Anxiety-Specific Sleep Techniques */}
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <Heart className="w-6 h-6" />
                  Anxiety-Specific Sleep Techniques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white rounded border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3">4-7-8 Sleep Breathing</h4>
                    <ol className="text-purple-700 space-y-1 text-sm mb-3">
                      <li>1. Exhale completely through mouth</li>
                      <li>2. Close mouth, inhale through nose for 4</li>
                      <li>3. Hold breath for 7 counts</li>
                      <li>4. Exhale through mouth for 8 counts</li>
                      <li>5. Repeat 3-4 cycles</li>
                    </ol>
                    <p className="text-purple-600 text-xs italic">
                      Activates the parasympathetic nervous system for relaxation
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3">Worry Time Technique</h4>
                    <ul className="text-purple-700 space-y-1 text-sm mb-3">
                      <li>• Set aside 15 minutes earlier in the day</li>
                      <li>• Write down all your worries and concerns</li>
                      <li>• For each worry, note: "Can I influence this?"</li>
                      <li>• Make action plans for controllable worries</li>
                      <li>• Practice acceptance for uncontrollable ones</li>
                    </ul>
                    <p className="text-purple-600 text-xs italic">
                      Prevents bedtime worry spirals
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white rounded border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3">Progressive Muscle Relaxation for Sleep</h4>
                    <ol className="text-purple-700 space-y-1 text-sm mb-3">
                      <li>1. Start with toes - tense for 5 seconds, then relax</li>
                      <li>2. Move up through each muscle group</li>
                      <li>3. Focus on the contrast between tension and relaxation</li>
                      <li>4. End with deep breathing</li>
                      <li>5. Let your body sink into the mattress</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-white rounded border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3">Mindful Body Scan</h4>
                    <ul className="text-purple-700 space-y-1 text-sm mb-3">
                      <li>• Lie comfortably and close your eyes</li>
                      <li>• Start with the top of your head</li>
                      <li>• Slowly scan down through your body</li>
                      <li>• Notice each body part without judgment</li>
                      <li>• Breathe into areas of tension or discomfort</li>
                      <li>• Let go of the need to control</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cognitive Techniques */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Cognitive Techniques for Sleep Anxiety
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white rounded border border-emerald-200">
                    <h4 className="font-semibold text-emerald-800 mb-3">Sleep-Related Thought Challenging</h4>
                    <div className="space-y-3">
                      <div className="p-2 bg-red-50 rounded">
                        <p className="text-red-700 text-sm font-medium">Unhelpful thought:</p>
                        <p className="text-red-600 text-sm">"I must get 8 hours or I'll have a terrible day"</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <p className="text-green-700 text-sm font-medium">Balanced thought:</p>
                        <p className="text-green-600 text-sm">"One night of poor sleep won't ruin my day. I can cope and still function well."</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded border border-emerald-200">
                    <h4 className="font-semibold text-emerald-800 mb-3">Questions to Challenge Sleep Anxiety</h4>
                    <ul className="text-emerald-700 space-y-1 text-sm">
                      <li>• Is this worry realistic or am I catastrophizing?</li>
                      <li>• What's the evidence this bad outcome will happen?</li>
                      <li>• How have I coped with poor sleep before?</li>
                      <li>• What would I tell a friend in this situation?</li>
                      <li>• Will this matter in a week/month/year?</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Strategy Selection & Notes</h3>
            <Textarea
              placeholder="Which sleep strategies appeal to you most? What barriers might prevent you from trying them? What would make it easier to implement these changes?"
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
      title: "Personal Sleep Action Plan",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-green-400">
            <h3 className="text-xl font-semibold text-green-800 mb-3">Your Personalized Sleep Improvement Plan</h3>
            <p className="text-green-700">
              Based on your assessment and the evidence-based strategies, create a realistic, 
              step-by-step plan to improve your sleep and reduce anxiety.
            </p>
          </div>

          {/* Assessment Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Your Sleep Assessment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded border">
                  <div className="text-2xl font-bold text-blue-800">{sleepAssessment.sleepLatency} min</div>
                  <p className="text-sm text-blue-600">Time to fall asleep</p>
                  <p className="text-xs text-blue-500">
                    {sleepAssessment.sleepLatency > 30 ? 'Above recommended (15-20 min)' : 'Within healthy range'}
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded border">
                  <div className="text-2xl font-bold text-blue-800">{sleepAssessment.sleepQuality}/10</div>
                  <p className="text-sm text-blue-600">Sleep quality rating</p>
                  <p className="text-xs text-blue-500">
                    {sleepAssessment.sleepQuality < 6 ? 'Needs improvement' : sleepAssessment.sleepQuality < 8 ? 'Good progress possible' : 'Excellent'}
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded border">
                  <div className="text-2xl font-bold text-blue-800">{sleepAssessment.anxietyLevel}/10</div>
                  <p className="text-sm text-blue-600">Bedtime anxiety</p>
                  <p className="text-xs text-blue-500">
                    {sleepAssessment.anxietyLevel > 7 ? 'High priority area' : sleepAssessment.anxietyLevel > 4 ? 'Room for improvement' : 'Well managed'}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded border">
                  <h4 className="font-semibold text-blue-800 mb-2">Positive Sleep Habits You Already Have:</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    {sleepAssessment.sleepEnvironment.slice(0, 3).map((habit, index) => (
                      <li key={index}>✓ {habit}</li>
                    ))}
                    {sleepAssessment.preSleeproutine.slice(0, 2).map((habit, index) => (
                      <li key={index}>✓ {habit}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-white rounded border">
                  <h4 className="font-semibold text-blue-800 mb-2">Priority Areas for Improvement:</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    {sleepAssessment.hindrances.slice(0, 4).map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Goals */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Week 1-2 Goals (Choose 2-3 to start)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-800 mb-3">Sleep Schedule & Routine</h4>
                  <div className="space-y-2">
                    {[
                      'Set consistent bedtime and wake time (even weekends)',
                      'Create a 30-minute wind-down routine',
                      'No screens 1 hour before bedtime',
                      'If awake >20 minutes, get up and do quiet activity'
                    ].map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`week1-${index}`} />
                        <Label htmlFor={`week1-${index}`} className="text-green-700 text-sm">{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-3">Anxiety Management</h4>
                  <div className="space-y-2">
                    {[
                      'Practice 4-7-8 breathing technique nightly',
                      'Write down worries 2 hours before bed',
                      'Try progressive muscle relaxation in bed',
                      'Challenge catastrophic sleep thoughts'
                    ].map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`anxiety1-${index}`} />
                        <Label htmlFor={`anxiety1-${index}`} className="text-green-700 text-sm">{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Week 3-4 Goals */}
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Week 3-4 Advanced Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-purple-800 mb-3">Environment & Habits</h4>
                  <div className="space-y-2">
                    {[
                      'Optimize bedroom temperature (60-67°F)',
                      'Install blackout curtains or use eye mask',
                      'Limit caffeine after 2 PM consistently',
                      'Add white noise or earplugs if needed'
                    ].map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`week3-${index}`} />
                        <Label htmlFor={`week3-${index}`} className="text-purple-700 text-sm">{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-3">Advanced Techniques</h4>
                  <div className="space-y-2">
                    {[
                      'Practice mindful body scan meditation',
                      'Implement sleep restriction if needed',
                      'Keep a sleep diary for pattern recognition',
                      'Try guided sleep meditations'
                    ].map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`advanced-${index}`} />
                        <Label htmlFor={`advanced-${index}`} className="text-purple-700 text-sm">{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Sleep Plan */}
          <Card className="bg-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Emergency Sleep Plan (For High Anxiety Nights)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="text-orange-700 space-y-3">
                <li className="p-3 bg-white rounded border border-orange-200">
                  <strong>1. Acknowledge & Accept:</strong> "It's okay if I don't sleep perfectly tonight. One night won't harm me."
                </li>
                <li className="p-3 bg-white rounded border border-orange-200">
                  <strong>2. Get Out of Bed:</strong> If not asleep within 20 minutes, move to another room.
                </li>
                <li className="p-3 bg-white rounded border border-orange-200">
                  <strong>3. Calm Activity:</strong> Read something boring, do gentle stretches, or listen to calm music.
                </li>
                <li className="p-3 bg-white rounded border border-orange-200">
                  <strong>4. Breathing Reset:</strong> Do 4-7-8 breathing or box breathing until calm.
                </li>
                <li className="p-3 bg-white rounded border border-orange-200">
                  <strong>5. Return When Sleepy:</strong> Go back to bed only when you feel drowsy, not just tired.
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Progress Tracking */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Sleep Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-yellow-700 mb-4">
                Track these metrics daily for 2-4 weeks to measure improvement:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Daily Tracking</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Bedtime and wake time</li>
                    <li>• Time taken to fall asleep (estimated)</li>
                    <li>• Number of night wakings</li>
                    <li>• Sleep quality rating (1-10)</li>
                    <li>• Morning energy level (1-10)</li>
                    <li>• Anxiety techniques used</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Weekly Review</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Average sleep quality improvement</li>
                    <li>• Which techniques work best</li>
                    <li>• Patterns or triggers identified</li>
                    <li>• Goals for upcoming week</li>
                    <li>• Barriers to address</li>
                    <li>• Celebration of progress made</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Personal Commitment & Next Steps</h3>
            <Textarea
              placeholder="Write your commitment to improving your sleep. What are your specific goals for the next 2 weeks? How will you remind yourself to practice these techniques?"
              value={personalNotes['section3'] || ''}
              onChange={(e) => setPersonalNotes(prev => ({...prev, section3: e.target.value}))}
              className="min-h-[100px]"
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
      <Card className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-3xl">
            <Moon className="w-10 h-10" />
            Sleep & Anxiety Guide
          </CardTitle>
          <p className="text-indigo-100 text-lg">
            Evidence-based sleep improvement strategies for anxiety management
          </p>
          <Badge variant="secondary" className="bg-white/20 text-white w-fit mx-auto">
            CBT-I Techniques • Sleep Assessment • Personal Action Plan
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
          <p className="text-sm text-muted-foreground">{progressPercentage}% complete • Estimated time: 20-25 minutes</p>
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
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-blue-800 mb-3">
              🌙 Excellent work! You've completed the Sleep & Anxiety guide.
            </h3>
            <p className="text-blue-700 text-lg mb-4">
              You now have a comprehensive, evidence-based plan to improve your sleep and reduce anxiety.
            </p>
            <div className="bg-white p-4 rounded border border-blue-200 text-left">
              <h4 className="font-semibold text-blue-800 mb-2">What You've Accomplished:</h4>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>✓ Understood the bidirectional relationship between sleep and anxiety</li>
                <li>✓ Completed a comprehensive sleep pattern assessment</li>
                <li>✓ Learned evidence-based CBT-I and sleep hygiene techniques</li>
                <li>✓ Created a personalized 4-week sleep improvement action plan</li>
                <li>✓ Developed emergency strategies for high-anxiety nights</li>
              </ul>
            </div>
            <p className="text-blue-600 text-sm mt-4">
              Remember: Sleep improvements typically take 2-4 weeks to show significant results. Be patient and consistent with your practice.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}