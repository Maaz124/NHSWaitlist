import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Zap, 
  Sun, 
  Moon, 
  Calendar,
  Brain,
  Activity,
  AlertTriangle,
  Users,
  Phone,
  BookOpen,
  Download,
  Plus,
  X,
  Shield,
  Heart,
  Target
} from "lucide-react";

interface ToolkitSection {
  emergency_techniques: {
    breathing: string[];
    grounding: string[];
    relaxation: string[];
    selected: string[];
  };
  daily_practices: {
    morning: string[];
    throughout_day: string[];
    evening: string[];
    weekly: string[];
  };
  thought_tools: {
    identifying: string[];
    challenging: string[];
    balancing: string[];
    quick_questions: string[];
  };
  behavioral_strategies: {
    exposure_goal: string;
    values_activity: string;
    social_goal: string;
    physical_plan: string;
  };
  warning_signs: {
    physical: string[];
    emotional: string[];
    behavioral: string[];
    personal_top3: string[];
  };
  action_plan: {
    early_signs: string[];
    multiple_signs: string[];
    emergency_contact: string;
  };
  support_network: {
    trusted_friend: string;
    family_member: string;
    professional: string;
    helpful_apps: string;
    resources: string;
  };
  quick_reference: {
    emergency_steps: string[];
    daily_practice: string;
    emergency_contact: string;
    reminder_phrases: string[];
  };
}

interface ToolkitBuilderProps {
  initialData?: ToolkitSection;
  onDataChange?: (data: ToolkitSection) => void;
  onSave?: (data: ToolkitSection) => void;
  onGetCurrentData?: (getData: () => ToolkitSection) => void;
}

export function ToolkitBuilder({ initialData, onDataChange, onSave, onGetCurrentData }: ToolkitBuilderProps = {}) {
  const [toolkit, setToolkit] = useState<ToolkitSection>({
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
  });

  // Load initial data when component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      setToolkit(initialData);
    }
  }, [initialData]);

  // Auto-save when data changes
  useEffect(() => {
    if (onDataChange) {
      console.log('🔧 Toolkit Builder data changed:', toolkit);
      onDataChange(toolkit);
    }
  }, [toolkit, onDataChange]);

  // Expose current data getter to parent component
  useEffect(() => {
    if (onGetCurrentData) {
      onGetCurrentData(() => toolkit);
    }
  }, [toolkit, onGetCurrentData]);

  const emergencyTechniques = {
    breathing: [
      "Box breathing (4-4-4-4 pattern)",
      "Diaphragmatic breathing (belly breathing)",
      "4-7-8 breathing (inhale 4, hold 7, exhale 8)",
      "Quick coherent breathing (5 seconds in, 5 seconds out)",
      "Alternate nostril breathing",
      "Counted breathing (slow, deep breaths)"
    ],
    grounding: [
      "5-4-3-2-1 sensory grounding",
      "Physical grounding (feel feet on floor, hold an object)",
      "Mental grounding (count backwards from 100 by 7s)",
      "Cold water on wrists or face",
      "Name 5 things you can see, 4 you can touch, 3 you can hear",
      "Progressive muscle tension and release"
    ],
    relaxation: [
      "Progressive muscle relaxation (quick version)",
      "Visualization of calm place",
      "Mindful observation without judgment",
      "Positive self-talk phrases",
      "Body scan relaxation",
      "Guided imagery"
    ]
  };

  const dailyPracticeOptions = {
    morning: [
      "5-minute mindfulness meditation",
      "Gratitude journaling (3 things)",
      "Gentle stretching or yoga",
      "Intention setting for the day",
      "Breathing exercise while having coffee/tea",
      "Review daily goals aligned with values",
      "Positive affirmations",
      "Light exercise or walk"
    ],
    throughout_day: [
      "Hourly breathing check-ins",
      "Mindful transitions between activities",
      "Regular movement breaks",
      "Anxiety level check-ins (1-10 scale)",
      "Values-based decision making",
      "Positive self-talk reminders",
      "Mindful eating",
      "Short meditation breaks"
    ],
    evening: [
      "Reflection on the day's successes",
      "Progressive muscle relaxation",
      "Worry time (scheduled 15 minutes)",
      "Gratitude practice",
      "Preparation for tomorrow to reduce morning anxiety",
      "Reading or calming activity",
      "Gentle stretching",
      "Journaling"
    ],
    weekly: [
      "Values assessment and goal adjustment",
      "Exposure practice (facing a small fear)",
      "Social connection activity",
      "Nature time or outdoor activity",
      "Review and update anxiety management goals",
      "Plan meaningful activities",
      "Connect with support network"
    ]
  };

  const thoughtToolOptions = {
    identifying: [
      "Thought records and journaling",
      "Mindful awareness of thinking patterns",
      "Anxiety symptom tracking",
      "Trigger identification logs",
      "Emotion labeling",
      "Thought pattern recognition"
    ],
    challenging: [
      "Evidence for/against worksheets",
      "Alternative perspective questions",
      "Probability estimation exercises",
      "Worst case/best case/most likely scenarios",
      "Thought defusion techniques",
      "Cognitive restructuring"
    ],
    balancing: [
      "Reframing negative thoughts",
      "Self-compassion phrases",
      "Perspective-taking exercises",
      "Reality testing questions",
      "Balanced thinking worksheets",
      "Mindful acceptance of thoughts"
    ]
  };

  const warningSignsOptions = {
    physical: [
      "Muscle tension (especially shoulders, jaw, back)",
      "Sleep changes (difficulty falling asleep, frequent waking)",
      "Appetite changes",
      "Headaches or stomach issues",
      "Fatigue or restlessness",
      "Heart racing or feeling short of breath",
      "Sweating or trembling",
      "Dizziness or lightheadedness"
    ],
    emotional: [
      "Increased worry or racing thoughts",
      "Irritability or mood swings",
      "Feeling overwhelmed or hopeless",
      "Difficulty concentrating",
      "Increased sensitivity to criticism",
      "Feeling disconnected from others",
      "Loss of interest in activities",
      "Excessive guilt or self-blame"
    ],
    behavioral: [
      "Avoiding activities you usually enjoy",
      "Procrastinating on important tasks",
      "Isolating from friends and family",
      "Increased use of substances or unhealthy coping",
      "Changes in work or school performance",
      "Seeking excessive reassurance",
      "Restlessness or inability to sit still",
      "Compulsive behaviors"
    ]
  };

  const toggleTechniqueSelection = (category: keyof typeof emergencyTechniques, technique: string) => {
    setToolkit(prev => ({
      ...prev,
      emergency_techniques: {
        ...prev.emergency_techniques,
        [category]: prev.emergency_techniques[category].includes(technique)
          ? prev.emergency_techniques[category].filter(t => t !== technique)
          : [...prev.emergency_techniques[category], technique]
      }
    }));
  };

  const toggleDailyPractice = (timeOfDay: keyof typeof dailyPracticeOptions, practice: string) => {
    setToolkit(prev => ({
      ...prev,
      daily_practices: {
        ...prev.daily_practices,
        [timeOfDay]: prev.daily_practices[timeOfDay].includes(practice)
          ? prev.daily_practices[timeOfDay].filter(p => p !== practice)
          : [...prev.daily_practices[timeOfDay], practice]
      }
    }));
  };

  const toggleThoughtTool = (category: keyof typeof thoughtToolOptions, tool: string) => {
    setToolkit(prev => ({
      ...prev,
      thought_tools: {
        ...prev.thought_tools,
        [category]: prev.thought_tools[category].includes(tool)
          ? prev.thought_tools[category].filter(t => t !== tool)
          : [...prev.thought_tools[category], tool]
      }
    }));
  };

  const toggleWarningSign = (category: keyof typeof warningSignsOptions, sign: string) => {
    setToolkit(prev => ({
      ...prev,
      warning_signs: {
        ...prev.warning_signs,
        [category]: prev.warning_signs[category].includes(sign)
          ? prev.warning_signs[category].filter(s => s !== sign)
          : [...prev.warning_signs[category], sign]
      }
    }));
  };

  const addToSelected = (technique: string) => {
    if (toolkit.emergency_techniques.selected.length < 3 && !toolkit.emergency_techniques.selected.includes(technique)) {
      setToolkit(prev => ({
        ...prev,
        emergency_techniques: {
          ...prev.emergency_techniques,
          selected: [...prev.emergency_techniques.selected, technique]
        }
      }));
    }
  };

  const removeFromSelected = (technique: string) => {
    setToolkit(prev => ({
      ...prev,
      emergency_techniques: {
        ...prev.emergency_techniques,
        selected: prev.emergency_techniques.selected.filter(t => t !== technique)
      }
    }));
  };

  const addToActionPlan = (level: 'early_signs' | 'multiple_signs', action: string) => {
    if (action.trim()) {
      setToolkit(prev => ({
        ...prev,
        action_plan: {
          ...prev.action_plan,
          [level]: [...prev.action_plan[level], action.trim()]
        }
      }));
    }
  };

  const removeFromActionPlan = (level: 'early_signs' | 'multiple_signs', index: number) => {
    setToolkit(prev => ({
      ...prev,
      action_plan: {
        ...prev.action_plan,
        [level]: prev.action_plan[level].filter((_, i) => i !== index)
      }
    }));
  };

  const addToQuickReference = (field: 'emergency_steps' | 'reminder_phrases', item: string) => {
    if (item.trim()) {
      setToolkit(prev => ({
        ...prev,
        quick_reference: {
          ...prev.quick_reference,
          [field]: [...prev.quick_reference[field], item.trim()]
        }
      }));
    }
  };

  const removeFromQuickReference = (field: 'emergency_steps' | 'reminder_phrases', index: number) => {
    setToolkit(prev => ({
      ...prev,
      quick_reference: {
        ...prev.quick_reference,
        [field]: prev.quick_reference[field].filter((_, i) => i !== index)
      }
    }));
  };

  const addToPersonalWarning = (sign: string) => {
    if (sign.trim() && toolkit.warning_signs.personal_top3.length < 3) {
      setToolkit(prev => ({
        ...prev,
        warning_signs: {
          ...prev.warning_signs,
          personal_top3: [...prev.warning_signs.personal_top3, sign.trim()]
        }
      }));
    }
  };

  const removeFromPersonalWarning = (index: number) => {
    setToolkit(prev => ({
      ...prev,
      warning_signs: {
        ...prev.warning_signs,
        personal_top3: prev.warning_signs.personal_top3.filter((_, i) => i !== index)
      }
    }));
  };

  const exportToolkit = () => {
    const toolkitData = {
      ...toolkit,
      createdDate: new Date().toISOString(),
      version: "1.0"
    };

    const dataStr = JSON.stringify(toolkitData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `personal-anxiety-toolkit-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Personal Anxiety Toolkit Builder</CardTitle>
              <p className="text-muted-foreground">Create your comprehensive, personalized anxiety management toolkit</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Select techniques that have worked well for you during this program. 
              Your toolkit will be your go-to resource for independent anxiety management.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Manual Save Button */}
      <div className="flex justify-center">
        <Button 
          onClick={() => {
            console.log('🔘 Manual save button clicked');
            if (onSave) {
              onSave(toolkit);
            }
            if (onDataChange) {
              onDataChange(toolkit);
            }
          }}
          className="bg-purple-600 hover:bg-purple-700"
        >
          💾 Save Toolkit Data
        </Button>
      </div>

      {/* Section 1: Emergency Techniques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Section 1: Emergency Techniques
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose 3-5 techniques that work quickly when anxiety is high
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(emergencyTechniques).map(([category, techniques]) => (
            <div key={category}>
              <h4 className="font-semibold mb-3 capitalize">
                {category.replace('_', ' ')} Techniques
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {techniques.map((technique) => (
                  <div key={technique} className="flex items-start space-x-3">
                    <Checkbox
                      id={`${category}-${technique}`}
                      checked={toolkit.emergency_techniques[category as keyof typeof toolkit.emergency_techniques].includes(technique)}
                      onCheckedChange={() => toggleTechniqueSelection(category as keyof typeof emergencyTechniques, technique)}
                      data-testid={`checkbox-${category}-${technique.replace(/\s+/g, '-').toLowerCase()}`}
                    />
                    <label 
                      htmlFor={`${category}-${technique}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {technique}
                    </label>
                    {toolkit.emergency_techniques[category as keyof typeof toolkit.emergency_techniques].includes(technique) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToSelected(technique)}
                        disabled={toolkit.emergency_techniques.selected.includes(technique) || toolkit.emergency_techniques.selected.length >= 3}
                        data-testid={`button-add-selected-${technique.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        Add to Top 3
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Separator />

          <div>
            <h4 className="font-semibold mb-3">Your Top 3 Emergency Techniques</h4>
            <div className="space-y-2">
              {toolkit.emergency_techniques.selected.map((technique, index) => (
                <div key={technique} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">{index + 1}. {technique}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromSelected(technique)}
                    data-testid={`button-remove-selected-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {toolkit.emergency_techniques.selected.length === 0 && (
                <p className="text-muted-foreground text-sm">Select your most effective emergency techniques above</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Daily Maintenance Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Section 2: Daily Maintenance Strategies
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select ongoing practices to prevent anxiety buildup
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(dailyPracticeOptions).map(([timeOfDay, practices]) => {
            const icons = {
              morning: Sun,
              throughout_day: Activity,
              evening: Moon,
              weekly: Calendar
            };
            const IconComponent = icons[timeOfDay as keyof typeof icons];
            
            return (
              <div key={timeOfDay}>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  {timeOfDay.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                  {timeOfDay !== 'weekly' && ' (Choose 2-3)'}
                  {timeOfDay === 'weekly' && ' (Choose 1-2)'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {practices.map((practice) => (
                    <div key={practice} className="flex items-start space-x-3">
                      <Checkbox
                        id={`${timeOfDay}-${practice}`}
                        checked={toolkit.daily_practices[timeOfDay as keyof typeof toolkit.daily_practices].includes(practice)}
                        onCheckedChange={() => toggleDailyPractice(timeOfDay as keyof typeof dailyPracticeOptions, practice)}
                        data-testid={`checkbox-${timeOfDay}-${practice.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <label 
                        htmlFor={`${timeOfDay}-${practice}`}
                        className="text-sm cursor-pointer"
                      >
                        {practice}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <Separator />

          <div className="bg-green-50 p-4 rounded-lg space-y-4">
            <h4 className="font-semibold">Your Daily Maintenance Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="morning-plan">Morning Routine</Label>
                <Textarea
                  id="morning-plan"
                  placeholder="Describe your morning anxiety management routine..."
                  value={toolkit.behavioral_strategies.exposure_goal} // Reusing field for simplicity
                  onChange={(e) => setToolkit(prev => ({ 
                    ...prev, 
                    behavioral_strategies: { ...prev.behavioral_strategies, exposure_goal: e.target.value }
                  }))}
                  className="mt-1"
                  data-testid="textarea-morning-plan"
                />
              </div>
              <div>
                <Label htmlFor="evening-plan">Evening Routine</Label>
                <Textarea
                  id="evening-plan"
                  placeholder="Describe your evening wind-down routine..."
                  value={toolkit.behavioral_strategies.values_activity} // Reusing field for simplicity
                  onChange={(e) => setToolkit(prev => ({ 
                    ...prev, 
                    behavioral_strategies: { ...prev.behavioral_strategies, values_activity: e.target.value }
                  }))}
                  className="mt-1"
                  data-testid="textarea-evening-plan"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Thought Management Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Section 3: Thought Management Tools
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pick your favorite cognitive techniques for managing anxious thoughts
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(thoughtToolOptions).map(([category, tools]) => (
            <div key={category}>
              <h4 className="font-semibold mb-3 capitalize">
                {category.replace('_', ' ')} Thoughts
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tools.map((tool) => (
                  <div key={tool} className="flex items-start space-x-3">
                    <Checkbox
                      id={`${category}-${tool}`}
                      checked={toolkit.thought_tools[category as keyof typeof toolkit.thought_tools].includes(tool)}
                      onCheckedChange={() => toggleThoughtTool(category as keyof typeof thoughtToolOptions, tool)}
                      data-testid={`checkbox-thought-${category}-${tool.replace(/\s+/g, '-').toLowerCase()}`}
                    />
                    <label 
                      htmlFor={`${category}-${tool}`}
                      className="text-sm cursor-pointer"
                    >
                      {tool}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Separator />

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Quick Thought Challenge Questions</h4>
            <div className="space-y-2">
              {[
                "Is this thought realistic?",
                "What evidence supports/contradicts this?",
                "What would I tell a friend in this situation?",
                "Will this matter in 5 years?"
              ].map((question, index) => (
                <div key={index} className="text-sm">• {question}</div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Behavioral Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Section 4: Behavioral Strategies
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Plan your ongoing exposure and activation strategies
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="weekly-exposure">Weekly Exposure Goal</Label>
            <Textarea
              id="weekly-exposure"
              placeholder="What exposure or anxiety-provoking situation will you practice each week?"
              value={toolkit.behavioral_strategies.exposure_goal}
              onChange={(e) => setToolkit(prev => ({ 
                ...prev, 
                behavioral_strategies: { ...prev.behavioral_strategies, exposure_goal: e.target.value }
              }))}
              className="mt-1"
              data-testid="textarea-weekly-exposure"
            />
          </div>
          
          <div>
            <Label htmlFor="values-activity">Values-Based Activity</Label>
            <Textarea
              id="values-activity"
              placeholder="What meaningful activity will you engage in regularly?"
              value={toolkit.behavioral_strategies.values_activity}
              onChange={(e) => setToolkit(prev => ({ 
                ...prev, 
                behavioral_strategies: { ...prev.behavioral_strategies, values_activity: e.target.value }
              }))}
              className="mt-1"
              data-testid="textarea-values-activity"
            />
          </div>
          
          <div>
            <Label htmlFor="social-goal">Social Connection Goal</Label>
            <Textarea
              id="social-goal"
              placeholder="How will you maintain and build social connections?"
              value={toolkit.behavioral_strategies.social_goal}
              onChange={(e) => setToolkit(prev => ({ 
                ...prev, 
                behavioral_strategies: { ...prev.behavioral_strategies, social_goal: e.target.value }
              }))}
              className="mt-1"
              data-testid="textarea-social-goal"
            />
          </div>
          
          <div>
            <Label htmlFor="physical-plan">Physical Activity Plan</Label>
            <Textarea
              id="physical-plan"
              placeholder="What physical activities or exercise will you maintain?"
              value={toolkit.behavioral_strategies.physical_plan}
              onChange={(e) => setToolkit(prev => ({ 
                ...prev, 
                behavioral_strategies: { ...prev.behavioral_strategies, physical_plan: e.target.value }
              }))}
              className="mt-1"
              data-testid="textarea-physical-plan"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Warning Signs & Early Intervention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Section 5: Warning Signs & Early Intervention
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Identify your personal warning signs and create action plans
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(warningSignsOptions).map(([category, signs]) => (
            <div key={category}>
              <h4 className="font-semibold mb-3 capitalize">
                {category.replace('_', ' ')} Warning Signs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {signs.map((sign) => (
                  <div key={sign} className="flex items-start space-x-3">
                    <Checkbox
                      id={`${category}-${sign}`}
                      checked={toolkit.warning_signs[category as keyof typeof toolkit.warning_signs].includes(sign)}
                      onCheckedChange={() => toggleWarningSign(category as keyof typeof warningSignsOptions, sign)}
                      data-testid={`checkbox-warning-${category}-${sign.replace(/\s+/g, '-').toLowerCase()}`}
                    />
                    <label 
                      htmlFor={`${category}-${sign}`}
                      className="text-sm cursor-pointer"
                    >
                      {sign}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Separator />

          <div>
            <h4 className="font-semibold mb-3">Your Top 3 Personal Warning Signs</h4>
            <div className="space-y-2 mb-4">
              {toolkit.warning_signs.personal_top3.map((sign, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">{index + 1}. {sign}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromPersonalWarning(index)}
                    data-testid={`button-remove-warning-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {toolkit.warning_signs.personal_top3.length < 3 && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add your personal warning sign..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addToPersonalWarning((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  data-testid="input-add-warning"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                    addToPersonalWarning(input.value);
                    input.value = '';
                  }}
                  data-testid="button-add-warning"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">Early Intervention Action Plan</h4>
            
            <div>
              <Label>When I notice 1-2 warning signs:</Label>
              <div className="space-y-2 mt-2">
                {toolkit.action_plan.early_signs.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm">{action}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromActionPlan('early_signs', index)}
                      data-testid={`button-remove-early-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add action for early signs..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addToActionPlan('early_signs', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  data-testid="input-add-early-action"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                    addToActionPlan('early_signs', input.value);
                    input.value = '';
                  }}
                  data-testid="button-add-early-action"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>When I notice 3+ warning signs:</Label>
              <div className="space-y-2 mt-2">
                {toolkit.action_plan.multiple_signs.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <span className="text-sm">{action}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromActionPlan('multiple_signs', index)}
                      data-testid={`button-remove-multiple-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add action for multiple signs..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addToActionPlan('multiple_signs', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  data-testid="input-add-multiple-action"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                    addToActionPlan('multiple_signs', input.value);
                    input.value = '';
                  }}
                  data-testid="button-add-multiple-action"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="emergency-contact">Emergency Contact Person</Label>
              <Input
                id="emergency-contact"
                placeholder="Name and phone number of emergency contact..."
                value={toolkit.action_plan.emergency_contact}
                onChange={(e) => setToolkit(prev => ({ 
                  ...prev, 
                  action_plan: { ...prev.action_plan, emergency_contact: e.target.value }
                }))}
                className="mt-1"
                data-testid="input-emergency-contact"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Support Network & Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Section 6: Support Network & Resources
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Document your support system and helpful resources
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="trusted-friend">Trusted Friend</Label>
            <Input
              id="trusted-friend"
              placeholder="Name and contact of trusted friend..."
              value={toolkit.support_network.trusted_friend}
              onChange={(e) => setToolkit(prev => ({ 
                ...prev, 
                support_network: { ...prev.support_network, trusted_friend: e.target.value }
              }))}
              className="mt-1"
              data-testid="input-trusted-friend"
            />
          </div>
          
          <div>
            <Label htmlFor="family-member">Family Member</Label>
            <Input
              id="family-member"
              placeholder="Name and contact of supportive family member..."
              value={toolkit.support_network.family_member}
              onChange={(e) => setToolkit(prev => ({ 
                ...prev, 
                support_network: { ...prev.support_network, family_member: e.target.value }
              }))}
              className="mt-1"
              data-testid="input-family-member"
            />
          </div>
          
          <div>
            <Label htmlFor="professional-contact">Professional Contact</Label>
            <Input
              id="professional-contact"
              placeholder="GP, therapist, or other professional contact..."
              value={toolkit.support_network.professional}
              onChange={(e) => setToolkit(prev => ({ 
                ...prev, 
                support_network: { ...prev.support_network, professional: e.target.value }
              }))}
              className="mt-1"
              data-testid="input-professional-contact"
            />
          </div>
          
          <div>
            <Label htmlFor="helpful-apps">Mental Health Apps You Find Helpful</Label>
            <Input
              id="helpful-apps"
              placeholder="Apps, websites, or digital resources..."
              value={toolkit.support_network.helpful_apps}
              onChange={(e) => setToolkit(prev => ({ 
                ...prev, 
                support_network: { ...prev.support_network, helpful_apps: e.target.value }
              }))}
              className="mt-1"
              data-testid="input-helpful-apps"
            />
          </div>
          
          <div>
            <Label htmlFor="other-resources">Other Helpful Resources</Label>
            <Textarea
              id="other-resources"
              placeholder="Books, websites, communities, or other resources..."
              value={toolkit.support_network.resources}
              onChange={(e) => setToolkit(prev => ({ 
                ...prev, 
                support_network: { ...prev.support_network, resources: e.target.value }
              }))}
              className="mt-1"
              data-testid="textarea-other-resources"
            />
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-red-800">Crisis Resources</h4>
            <div className="space-y-1 text-sm text-red-700">
              <div>• <strong>Samaritans:</strong> 116 123 (free, 24/7)</div>
              <div>• <strong>Crisis Text Line:</strong> Text SHOUT to 85258</div>
              <div>• <strong>NHS 111:</strong> For urgent but non-emergency help</div>
              <div>• <strong>999:</strong> For immediate emergency situations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 7: Quick Reference Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Section 7: Quick Reference Card
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Create a summary card to keep with you
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>When anxiety hits, try (3 steps):</Label>
            <div className="space-y-2 mt-2">
              {toolkit.quick_reference.emergency_steps.map((step, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm font-medium">{index + 1}. {step}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromQuickReference('emergency_steps', index)}
                    data-testid={`button-remove-step-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            {toolkit.quick_reference.emergency_steps.length < 3 && (
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add emergency step..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addToQuickReference('emergency_steps', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  data-testid="input-add-step"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                    addToQuickReference('emergency_steps', input.value);
                    input.value = '';
                  }}
                  data-testid="button-add-step"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="daily-practice-summary">Daily Practice Summary</Label>
            <Input
              id="daily-practice-summary"
              placeholder="One-line summary of your daily practice..."
              value={toolkit.quick_reference.daily_practice}
              onChange={(e) => setToolkit(prev => ({ 
                ...prev, 
                quick_reference: { ...prev.quick_reference, daily_practice: e.target.value }
              }))}
              className="mt-1"
              data-testid="input-daily-practice-summary"
            />
          </div>

          <div>
            <Label htmlFor="emergency-contact-card">Emergency Contact</Label>
            <Input
              id="emergency-contact-card"
              placeholder="Key emergency contact for your card..."
              value={toolkit.quick_reference.emergency_contact}
              onChange={(e) => setToolkit(prev => ({ 
                ...prev, 
                quick_reference: { ...prev.quick_reference, emergency_contact: e.target.value }
              }))}
              className="mt-1"
              data-testid="input-emergency-contact-card"
            />
          </div>

          <div>
            <Label>Reminder Phrases:</Label>
            <div className="space-y-2 mt-2">
              {toolkit.quick_reference.reminder_phrases.map((phrase, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <span className="text-sm italic">"{phrase}"</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromQuickReference('reminder_phrases', index)}
                    data-testid={`button-remove-phrase-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add reminder phrase..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addToQuickReference('reminder_phrases', (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                data-testid="input-add-phrase"
              />
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                  addToQuickReference('reminder_phrases', input.value);
                  input.value = '';
                }}
                data-testid="button-add-phrase"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card className="bg-gradient-to-r from-green-50 to-purple-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Your Personal Toolkit is Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {toolkit.emergency_techniques.selected.length}
              </div>
              <div className="text-sm text-muted-foreground">Emergency Techniques</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(toolkit.daily_practices).flat().length}
              </div>
              <div className="text-sm text-muted-foreground">Daily Practices</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.values(toolkit.thought_tools).flat().length}
              </div>
              <div className="text-sm text-muted-foreground">Thought Tools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {toolkit.warning_signs.personal_top3.length}
              </div>
              <div className="text-sm text-muted-foreground">Warning Signs</div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={exportToolkit} className="gap-2" size="lg">
              <Download className="w-4 h-4" />
              Export Your Complete Toolkit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}