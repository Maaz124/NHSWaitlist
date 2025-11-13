import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Phone,
  Calendar,
  Target,
  Download,
  Plus,
  X,
  CheckCircle,
  Clock,
  Heart,
  Brain
} from "lucide-react";

interface HighRiskSituation {
  category: string;
  situations: string[];
  selected: string[];
  personal: string[];
}

interface WarningSigns {
  yellow: string[];
  orange: string[];
  red: string[];
}

interface ActionPlan {
  yellow: string[];
  orange: string[];
  red: string[];
}

interface SupportContact {
  name: string;
  relationship: string;
  phone: string;
  whenToContact: string;
}

interface LongTermGoal {
  timeframe: string;
  goals: string[];
}

interface ResilienceHabit {
  category: string;
  habits: string[];
}

interface RelapsePlannerProps {
  initialData?: any;
  onDataChange?: (data: any) => void;
  onSave?: (data: any) => void;
  onGetCurrentData?: (getData: () => any) => void;
}

export function RelapsePlanner({ initialData, onDataChange, onSave, onGetCurrentData }: RelapsePlannerProps = {}) {
  const [highRiskSituations, setHighRiskSituations] = useState<HighRiskSituation[]>([
    {
      category: "Life Transitions",
      situations: [
        "Starting a new job or school",
        "Moving to a new home",
        "Relationship changes (marriage, breakup, divorce)",
        "Health issues (yours or family members)",
        "Financial stress or changes",
        "Loss or grief"
      ],
      selected: [],
      personal: []
    },
    {
      category: "Stressful Periods",
      situations: [
        "Work deadlines or high-pressure projects",
        "Exam periods or important presentations",
        "Family conflicts or relationship problems",
        "Holiday seasons or special events",
        "Anniversary dates of difficult events",
        "Legal issues or major decisions"
      ],
      selected: [],
      personal: []
    },
    {
      category: "Physical Factors",
      situations: [
        "Illness or injury",
        "Hormonal changes",
        "Sleep deprivation",
        "Medication changes",
        "Substance use",
        "Poor nutrition or dehydration"
      ],
      selected: [],
      personal: []
    },
    {
      category: "Environmental Factors",
      situations: [
        "Seasonal changes (especially winter)",
        "Weather extremes",
        "Major world events or news",
        "Changes in living situation",
        "Social isolation",
        "Information overload"
      ],
      selected: [],
      personal: []
    }
  ]);

  const [warningSigns, setWarningSigns] = useState<WarningSigns>({
    yellow: [],
    orange: [],
    red: []
  });

  const [actionPlans, setActionPlans] = useState<ActionPlan>({
    yellow: [],
    orange: [],
    red: []
  });

  const [supportContacts, setSupportContacts] = useState<SupportContact[]>([
    { name: "", relationship: "", phone: "", whenToContact: "" },
    { name: "", relationship: "", phone: "", whenToContact: "" },
    { name: "", relationship: "", phone: "", whenToContact: "" }
  ]);

  const [professionalContacts, setProfessionalContacts] = useState({
    gp: "",
    mentalHealthProfessional: "",
    crisisContact: ""
  });

  const [longTermGoals, setLongTermGoals] = useState<LongTermGoal[]>([
    { timeframe: "3 months", goals: [] },
    { timeframe: "6 months", goals: [] },
    { timeframe: "1 year", goals: [] }
  ]);

  const [resilienceHabits, setResilienceHabits] = useState<ResilienceHabit[]>([
    {
      category: "Daily",
      habits: []
    },
    {
      category: "Weekly", 
      habits: []
    },
    {
      category: "Monthly",
      habits: []
    }
  ]);

  const [personalizedPlan, setPersonalizedPlan] = useState({
    topRiskSituations: [] as string[],
    personalWarningSignsDescription: "",
    emergencyPlan: "",
    maintenanceStrategy: "",
    completionNotes: ""
  });

  // Load initial data when component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      if (initialData.highRiskSituations) setHighRiskSituations(initialData.highRiskSituations);
      if (initialData.warningSigns) setWarningSigns(initialData.warningSigns);
      if (initialData.actionPlans) setActionPlans(initialData.actionPlans);
      if (initialData.supportContacts) setSupportContacts(initialData.supportContacts);
      if (initialData.professionalContacts) setProfessionalContacts(initialData.professionalContacts);
      if (initialData.longTermGoals) setLongTermGoals(initialData.longTermGoals);
      if (initialData.resilienceHabits) setResilienceHabits(initialData.resilienceHabits);
      if (initialData.personalizedPlan) setPersonalizedPlan(initialData.personalizedPlan);
    }
  }, [initialData]);

  // Auto-save when data changes
  useEffect(() => {
    if (onDataChange) {
      const allData = {
        highRiskSituations,
        warningSigns,
        actionPlans,
        supportContacts,
        professionalContacts,
        longTermGoals,
        resilienceHabits,
        personalizedPlan
      };
      onDataChange(allData);
    }
  }, [highRiskSituations, warningSigns, actionPlans, supportContacts, professionalContacts, longTermGoals, resilienceHabits, personalizedPlan, onDataChange]);

  // Expose current data to parent component
  useEffect(() => {
    if (onGetCurrentData) {
      onGetCurrentData(() => ({
        highRiskSituations,
        warningSigns,
        actionPlans,
        supportContacts,
        professionalContacts,
        longTermGoals,
        resilienceHabits,
        personalizedPlan
      }));
    }
  }, [highRiskSituations, warningSigns, actionPlans, supportContacts, professionalContacts, longTermGoals, resilienceHabits, personalizedPlan, onGetCurrentData]);

  const warningSignOptions = {
    yellow: [
      "Slight increase in worry or tension",
      "Occasional difficulty sleeping",
      "Minor avoidance of some activities",
      "Feeling slightly more stressed than usual",
      "Forgetting to use coping strategies occasionally",
      "Mild physical tension",
      "Slight changes in appetite",
      "Feeling a bit overwhelmed"
    ],
    orange: [
      "Noticeable increase in physical anxiety symptoms",
      "Sleep problems several times per week",
      "Avoiding important activities more frequently",
      "Difficulty concentrating at work or school",
      "Feeling overwhelmed by daily tasks",
      "Increased irritability or mood changes",
      "Physical symptoms becoming more frequent",
      "Skipping social activities"
    ],
    red: [
      "Severe anxiety symptoms interfering with daily life",
      "Sleep problems most nights",
      "Avoiding multiple important activities",
      "Unable to function normally at work/school/home",
      "Complete abandonment of coping strategies",
      "Thoughts of self-harm or substance use",
      "Panic attacks multiple times per week",
      "Complete social isolation"
    ]
  };

  const defaultActionPlans = {
    yellow: [
      "Increase daily mindfulness/breathing practice",
      "Review and restart neglected coping strategies",
      "Ensure good sleep hygiene and self-care",
      "Reach out to a friend or family member",
      "Schedule enjoyable or meaningful activities",
      "Review your personal toolkit"
    ],
    orange: [
      "Implement emergency techniques more frequently",
      "Temporarily reduce non-essential commitments",
      "Increase social support and check-ins",
      "Consider speaking with a healthcare provider",
      "Review and adjust your routine",
      "Use your support network more actively"
    ],
    red: [
      "Seek professional help immediately",
      "Inform trusted people about your struggles",
      "Consider time off work/school if possible",
      "Use crisis resources if needed",
      "Return to basics: sleep, eat, breathe, move",
      "Remove additional stressors temporarily"
    ]
  };

  const resilienceOptions = {
    daily: [
      "Consistent sleep schedule (even on weekends)",
      "Regular physical activity or movement",
      "Healthy eating patterns",
      "Daily mindfulness or relaxation practice",
      "Social connection (even brief check-ins)",
      "Time in nature or outdoors",
      "Engaging in meaningful activities",
      "Gratitude practice",
      "Morning routine",
      "Evening wind-down"
    ],
    weekly: [
      "Values assessment and goal adjustment",
      "Social activities with friends or family",
      "Hobbies or creative activities",
      "Planning and preparation for the week ahead",
      "Review of what's working and what needs adjustment",
      "Time for rest and recovery",
      "Exercise or physical activity",
      "Connection with support network"
    ],
    monthly: [
      "Assess overall mental health and progress",
      "Adjust goals and strategies as needed",
      "Plan for upcoming stressors or challenges",
      "Celebrate achievements and progress",
      "Connect with healthcare providers if needed",
      "Review and update toolkit",
      "Self-care planning",
      "Skills practice and learning"
    ]
  };

  const toggleRiskSituation = (categoryIndex: number, situation: string) => {
    setHighRiskSituations(prev => prev.map((category, index) => 
      index === categoryIndex ? {
        ...category,
        selected: category.selected.includes(situation)
          ? category.selected.filter(s => s !== situation)
          : [...category.selected, situation]
      } : category
    ));
  };

  const addPersonalRiskSituation = (categoryIndex: number, situation: string) => {
    if (situation.trim()) {
      setHighRiskSituations(prev => prev.map((category, index) => 
        index === categoryIndex ? {
          ...category,
          personal: [...category.personal, situation.trim()]
        } : category
      ));
    }
  };

  const removePersonalRiskSituation = (categoryIndex: number, situationIndex: number) => {
    setHighRiskSituations(prev => prev.map((category, index) => 
      index === categoryIndex ? {
        ...category,
        personal: category.personal.filter((_, i) => i !== situationIndex)
      } : category
    ));
  };

  const toggleWarningSign = (level: keyof WarningSigns, sign: string) => {
    setWarningSigns(prev => ({
      ...prev,
      [level]: prev[level].includes(sign)
        ? prev[level].filter(s => s !== sign)
        : [...prev[level], sign]
    }));
  };

  const addToActionPlan = (level: keyof ActionPlan, action: string) => {
    if (action.trim()) {
      setActionPlans(prev => ({
        ...prev,
        [level]: [...prev[level], action.trim()]
      }));
    }
  };

  const removeFromActionPlan = (level: keyof ActionPlan, index: number) => {
    setActionPlans(prev => ({
      ...prev,
      [level]: prev[level].filter((_, i) => i !== index)
    }));
  };

  const updateSupportContact = (index: number, field: keyof SupportContact, value: string) => {
    setSupportContacts(prev => prev.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    ));
  };

  const addGoalToTimeframe = (timeframeIndex: number, goal: string) => {
    if (goal.trim()) {
      setLongTermGoals(prev => prev.map((timeframe, index) => 
        index === timeframeIndex ? {
          ...timeframe,
          goals: [...timeframe.goals, goal.trim()]
        } : timeframe
      ));
    }
  };

  const removeGoalFromTimeframe = (timeframeIndex: number, goalIndex: number) => {
    setLongTermGoals(prev => prev.map((timeframe, index) => 
      index === timeframeIndex ? {
        ...timeframe,
        goals: timeframe.goals.filter((_, i) => i !== goalIndex)
      } : timeframe
    ));
  };

  const toggleResilienceHabit = (categoryIndex: number, habit: string) => {
    setResilienceHabits(prev => prev.map((category, index) => 
      index === categoryIndex ? {
        ...category,
        habits: category.habits.includes(habit)
          ? category.habits.filter(h => h !== habit)
          : [...category.habits, habit]
      } : category
    ));
  };

  const addToTopRiskSituations = (situation: string) => {
    if (situation.trim() && personalizedPlan.topRiskSituations.length < 4) {
      setPersonalizedPlan(prev => ({
        ...prev,
        topRiskSituations: [...prev.topRiskSituations, situation.trim()]
      }));
    }
  };

  const removeFromTopRiskSituations = (index: number) => {
    setPersonalizedPlan(prev => ({
      ...prev,
      topRiskSituations: prev.topRiskSituations.filter((_, i) => i !== index)
    }));
  };

  const exportRelapsePlan = () => {
    const planData = {
      highRiskSituations,
      warningSigns,
      actionPlans,
      supportContacts,
      professionalContacts,
      longTermGoals,
      resilienceHabits,
      personalizedPlan,
      createdDate: new Date().toISOString(),
      version: "1.0"
    };

    const dataStr = JSON.stringify(planData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relapse-prevention-plan-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getTotalSelectedItems = () => {
    const riskSituations = highRiskSituations.reduce((sum, cat) => sum + cat.selected.length + cat.personal.length, 0);
    const warnings = Object.values(warningSigns).reduce((sum, signs) => sum + signs.length, 0);
    const actions = Object.values(actionPlans).reduce((sum, plans) => sum + plans.length, 0);
    const habits = resilienceHabits.reduce((sum, cat) => sum + cat.habits.length, 0);
    
    return { riskSituations, warnings, actions, habits };
  };

  const stats = getTotalSelectedItems();

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Relapse Prevention Planning</CardTitle>
              <p className="text-muted-foreground">Create a comprehensive plan for managing setbacks and maintaining progress</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.riskSituations}</div>
              <div className="text-sm text-muted-foreground">Risk Situations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
              <div className="text-sm text-muted-foreground">Warning Signs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.actions}</div>
              <div className="text-sm text-muted-foreground">Action Steps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.habits}</div>
              <div className="text-sm text-muted-foreground">Resilience Habits</div>
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-orange-800">
              💡 <strong>Remember:</strong> Setbacks are normal and don't erase your progress. 
              This plan helps you navigate difficult periods with confidence and maintain long-term recovery.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="situations" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="situations">Risk Situations</TabsTrigger>
          <TabsTrigger value="warnings">Warning Signs</TabsTrigger>
          <TabsTrigger value="actions">Action Plans</TabsTrigger>
          <TabsTrigger value="resilience">Resilience</TabsTrigger>
          <TabsTrigger value="support">Support Network</TabsTrigger>
          <TabsTrigger value="plan">Personal Plan</TabsTrigger>
        </TabsList>

        {/* High-Risk Situations Tab */}
        <TabsContent value="situations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                High-Risk Situations
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Identify when your anxiety might be more challenging
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {highRiskSituations.map((category, categoryIndex) => (
                <Card key={category.category} className="border-l-4 border-l-orange-400">
                  <CardHeader>
                    <h4 className="font-semibold">{category.category}</h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.situations.map((situation) => (
                        <div key={situation} className="flex items-start space-x-3">
                          <Checkbox
                            id={`${category.category}-${situation}`}
                            checked={category.selected.includes(situation)}
                            onCheckedChange={() => toggleRiskSituation(categoryIndex, situation)}
                            data-testid={`checkbox-risk-${categoryIndex}-${situation.replace(/\s+/g, '-').toLowerCase()}`}
                          />
                          <label 
                            htmlFor={`${category.category}-${situation}`}
                            className="text-sm cursor-pointer"
                          >
                            {situation}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label>Personal High-Risk Situations for {category.category}</Label>
                      <div className="space-y-2 mt-2">
                        {category.personal.map((situation, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                            <span className="text-sm">{situation}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removePersonalRiskSituation(categoryIndex, index)}
                              data-testid={`button-remove-personal-risk-${categoryIndex}-${index}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder={`Add personal ${category.category.toLowerCase()} risk...`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addPersonalRiskSituation(categoryIndex, (e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                          data-testid={`input-add-personal-risk-${categoryIndex}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                            addPersonalRiskSituation(categoryIndex, input.value);
                            input.value = '';
                          }}
                          data-testid={`button-add-personal-risk-${categoryIndex}`}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warning Signs Tab */}
        <TabsContent value="warnings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Early Warning System
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Recognize when anxiety is becoming problematic again
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(warningSignOptions).map(([level, signs]) => {
                const levelInfo = {
                  yellow: { title: "Yellow Alert (Mild Increase)", color: "bg-yellow-50 border-yellow-200", textColor: "text-yellow-800" },
                  orange: { title: "Orange Alert (Moderate Increase)", color: "bg-orange-50 border-orange-200", textColor: "text-orange-800" },
                  red: { title: "Red Alert (Significant Increase)", color: "bg-red-50 border-red-200", textColor: "text-red-800" }
                };
                
                const info = levelInfo[level as keyof typeof levelInfo];
                
                return (
                  <Card key={level} className={`${info.color}`}>
                    <CardHeader>
                      <h4 className={`font-semibold ${info.textColor}`}>
                        Level {level === 'yellow' ? '1' : level === 'orange' ? '2' : '3'} - {info.title}
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {signs.map((sign) => (
                          <div key={sign} className="flex items-start space-x-3">
                            <Checkbox
                              id={`${level}-${sign}`}
                              checked={warningSigns[level as keyof WarningSigns].includes(sign)}
                              onCheckedChange={() => toggleWarningSign(level as keyof WarningSigns, sign)}
                              data-testid={`checkbox-warning-${level}-${sign.replace(/\s+/g, '-').toLowerCase()}`}
                            />
                            <label 
                              htmlFor={`${level}-${sign}`}
                              className="text-sm cursor-pointer"
                            >
                              {sign}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Action Plans Tab */}
        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Action Plans for Each Level
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Create specific response plans for different warning levels
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(defaultActionPlans).map(([level, defaultActions]) => {
                const levelInfo = {
                  yellow: { title: "Yellow Alert Response Plan", color: "bg-yellow-50", buttonColor: "border-yellow-300" },
                  orange: { title: "Orange Alert Response Plan", color: "bg-orange-50", buttonColor: "border-orange-300" },
                  red: { title: "Red Alert Response Plan", color: "bg-red-50", buttonColor: "border-red-300" }
                };
                
                const info = levelInfo[level as keyof typeof levelInfo];
                
                return (
                  <Card key={level} className={info.color}>
                    <CardHeader>
                      <h4 className="font-semibold">{info.title}</h4>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Recommended Actions:</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {defaultActions.map((action) => (
                            <div key={action} className="text-sm p-2 bg-white rounded border">
                              • {action}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Your Personalized {info.title}:</Label>
                        <div className="space-y-2">
                          {actionPlans[level as keyof ActionPlan].map((action, index) => (
                            <div key={index} className={`flex items-center justify-between p-2 bg-white rounded ${info.buttonColor} border`}>
                              <span className="text-sm">{action}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromActionPlan(level as keyof ActionPlan, index)}
                                data-testid={`button-remove-action-${level}-${index}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Input
                            placeholder={`Add your ${level} alert action...`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addToActionPlan(level as keyof ActionPlan, (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                            data-testid={`input-add-action-${level}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={(e) => {
                              const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                              addToActionPlan(level as keyof ActionPlan, input.value);
                              input.value = '';
                            }}
                            data-testid={`button-add-action-${level}`}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resilience Tab */}
        <TabsContent value="resilience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Building Resilience
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Strengthen your ability to bounce back from challenges
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {resilienceHabits.map((category, categoryIndex) => {
                const icons = { daily: Calendar, weekly: Clock, monthly: Target };
                const IconComponent = icons[category.category.toLowerCase() as keyof typeof icons] || Calendar;
                const options = resilienceOptions[category.category.toLowerCase() as keyof typeof resilienceOptions] || [];
                
                return (
                  <Card key={category.category} className="border-l-4 border-l-green-400">
                    <CardHeader>
                      <h4 className="font-semibold flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {category.category} Resilience Habits
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {options.map((habit) => (
                          <div key={habit} className="flex items-start space-x-3">
                            <Checkbox
                              id={`${category.category}-${habit}`}
                              checked={category.habits.includes(habit)}
                              onCheckedChange={() => toggleResilienceHabit(categoryIndex, habit)}
                              data-testid={`checkbox-resilience-${category.category}-${habit.replace(/\s+/g, '-').toLowerCase()}`}
                            />
                            <label 
                              htmlFor={`${category.category}-${habit}`}
                              className="text-sm cursor-pointer"
                            >
                              {habit}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>

          {/* Long-term Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Long-Term Success Goals
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Set goals for sustained recovery and growth
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {longTermGoals.map((timeframe, timeframeIndex) => (
                <Card key={timeframe.timeframe} className="border-l-4 border-l-purple-400">
                  <CardHeader>
                    <h4 className="font-semibold">{timeframe.timeframe} Goals</h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {timeframe.goals.map((goal, goalIndex) => (
                        <div key={goalIndex} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                          <span className="text-sm">{goal}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeGoalFromTimeframe(timeframeIndex, goalIndex)}
                            data-testid={`button-remove-goal-${timeframeIndex}-${goalIndex}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder={`Add ${timeframe.timeframe} goal...`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addGoalToTimeframe(timeframeIndex, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                        data-testid={`input-add-goal-${timeframeIndex}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                          addGoalToTimeframe(timeframeIndex, input.value);
                          input.value = '';
                        }}
                        data-testid={`button-add-goal-${timeframeIndex}`}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Network Tab */}
        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Support Network Planning
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Document your support system and when to reach out
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4">Personal Support Contacts</h4>
                {supportContacts.map((contact, index) => (
                  <Card key={index} className="mb-4">
                    <CardHeader>
                      <h5 className="font-medium">Support Contact #{index + 1}</h5>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`contact-name-${index}`}>Name</Label>
                        <Input
                          id={`contact-name-${index}`}
                          placeholder="Contact name..."
                          value={contact.name}
                          onChange={(e) => updateSupportContact(index, 'name', e.target.value)}
                          data-testid={`input-contact-name-${index}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`contact-relationship-${index}`}>Relationship</Label>
                        <Input
                          id={`contact-relationship-${index}`}
                          placeholder="Friend, family member, etc."
                          value={contact.relationship}
                          onChange={(e) => updateSupportContact(index, 'relationship', e.target.value)}
                          data-testid={`input-contact-relationship-${index}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`contact-phone-${index}`}>Phone Number</Label>
                        <Input
                          id={`contact-phone-${index}`}
                          placeholder="Phone number..."
                          value={contact.phone}
                          onChange={(e) => updateSupportContact(index, 'phone', e.target.value)}
                          data-testid={`input-contact-phone-${index}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`contact-when-${index}`}>When to Contact</Label>
                        <Input
                          id={`contact-when-${index}`}
                          placeholder="When should you reach out?"
                          value={contact.whenToContact}
                          onChange={(e) => updateSupportContact(index, 'whenToContact', e.target.value)}
                          data-testid={`input-contact-when-${index}`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-4">Professional Support</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="gp-contact">GP Contact</Label>
                    <Input
                      id="gp-contact"
                      placeholder="Your GP name and practice details..."
                      value={professionalContacts.gp}
                      onChange={(e) => setProfessionalContacts(prev => ({ ...prev, gp: e.target.value }))}
                      data-testid="input-gp-contact"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mental-health-professional">Mental Health Professional</Label>
                    <Input
                      id="mental-health-professional"
                      placeholder="Therapist, counselor, or mental health team..."
                      value={professionalContacts.mentalHealthProfessional}
                      onChange={(e) => setProfessionalContacts(prev => ({ ...prev, mentalHealthProfessional: e.target.value }))}
                      data-testid="input-mental-health-professional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="crisis-contact">Crisis Contact</Label>
                    <Input
                      id="crisis-contact"
                      placeholder="Local crisis team or emergency contact..."
                      value={professionalContacts.crisisContact}
                      onChange={(e) => setProfessionalContacts(prev => ({ ...prev, crisisContact: e.target.value }))}
                      data-testid="input-crisis-contact"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-red-800">Emergency Crisis Resources</h4>
                <div className="space-y-1 text-sm text-red-700">
                  <div>• <strong>Samaritans:</strong> 116 123 (free, 24/7)</div>
                  <div>• <strong>Crisis Text Line:</strong> Text SHOUT to 85258</div>
                  <div>• <strong>Waitlist Companion 111:</strong> For urgent but non-emergency help</div>
                  <div>• <strong>999:</strong> For immediate emergency situations</div>
                  <div>• <strong>Mind Info Line:</strong> 0300 123 3393</div>
                  <div>• <strong>Anxiety UK:</strong> 03444 775 774</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Plan Tab */}
        <TabsContent value="plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Your Personalized Relapse Prevention Plan
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Summarize your key insights and create your personal plan
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Your Top 4 High-Risk Situations</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Based on your selections, identify your most important risk situations to monitor
                </p>
                <div className="space-y-2">
                  {personalizedPlan.topRiskSituations.map((situation, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                      <span className="text-sm font-medium">{index + 1}. {situation}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromTopRiskSituations(index)}
                        data-testid={`button-remove-top-risk-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {personalizedPlan.topRiskSituations.length < 4 && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add top risk situation..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addToTopRiskSituations((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      data-testid="input-add-top-risk"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                        addToTopRiskSituations(input.value);
                        input.value = '';
                      }}
                      data-testid="button-add-top-risk"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="personal-warning-signs">Your Personal Warning Signs Summary</Label>
                <Textarea
                  id="personal-warning-signs"
                  placeholder="Describe your unique early warning signs in your own words..."
                  value={personalizedPlan.personalWarningSignsDescription}
                  onChange={(e) => setPersonalizedPlan(prev => ({ ...prev, personalWarningSignsDescription: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-personal-warning-signs"
                />
              </div>

              <div>
                <Label htmlFor="emergency-plan">Your Emergency Response Plan</Label>
                <Textarea
                  id="emergency-plan"
                  placeholder="Summarize your go-to emergency plan when anxiety becomes overwhelming..."
                  value={personalizedPlan.emergencyPlan}
                  onChange={(e) => setPersonalizedPlan(prev => ({ ...prev, emergencyPlan: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-emergency-plan"
                />
              </div>

              <div>
                <Label htmlFor="maintenance-strategy">Your Ongoing Maintenance Strategy</Label>
                <Textarea
                  id="maintenance-strategy"
                  placeholder="Describe your daily and weekly practices for maintaining mental health..."
                  value={personalizedPlan.maintenanceStrategy}
                  onChange={(e) => setPersonalizedPlan(prev => ({ ...prev, maintenanceStrategy: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-maintenance-strategy"
                />
              </div>

              <div>
                <Label htmlFor="completion-notes">Additional Notes & Commitments</Label>
                <Textarea
                  id="completion-notes"
                  placeholder="Any additional thoughts, commitments, or reminders for yourself..."
                  value={personalizedPlan.completionNotes}
                  onChange={(e) => setPersonalizedPlan(prev => ({ ...prev, completionNotes: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-completion-notes"
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-800">Relapse Prevention Checklist</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>I've identified my personal high-risk situations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>I know my early warning signs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>I have action plans for different levels of difficulty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>I've built a strong support network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>I know when to seek professional help</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>I have crisis resources easily accessible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>I've set realistic long-term goals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>I understand that setbacks are normal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>I'm committed to ongoing self-care and practice</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Your Relapse Prevention Plan is Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button onClick={exportRelapsePlan} className="gap-2" size="lg">
              <Download className="w-4 h-4" />
              Export Your Complete Relapse Prevention Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}