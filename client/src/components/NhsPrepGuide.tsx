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
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  FileText, 
  Users, 
  MessageSquare,
  CheckCircle,
  Clock,
  Download,
  Plus,
  X,
  Star,
  Target,
  Phone,
  BookOpen,
  Award,
  ArrowRight
} from "lucide-react";

interface DocumentPrep {
  gpReferral: boolean;
  medicationList: string;
  programSummary: string;
  personalToolkit: string;
  previousRecords: string;
  questionsList: string[];
}

interface ProgramSummary {
  helpfulTechniques: string[];
  successfulSituations: string[];
  supportNeeded: string[];
  currentFunctioning: string;
  treatmentGoals: string[];
}

interface AssessmentPrep {
  symptoms: string[];
  triggers: string[];
  copingStrategies: string[];
  progressMade: string;
  challenges: string;
  values: string;
  supportSystems: string;
}

interface TreatmentKnowledge {
  cbtUnderstanding: string;
  otherTherapies: string[];
  medicationQuestions: string[];
  groupTherapyInterest: string;
  treatmentPreferences: string;
}

interface OngoingPrep {
  dailyPractices: string[];
  socialConnections: string[];
  learningResources: string[];
  progressMonitoring: string;
}

interface NhsReadiness {
  independentTools: number;
  handleSetbacks: number;
  maintainProgress: number;
  transitionReadiness: number;
  continueJourney: number;
  confidence: string;
}

interface NhsPrepGuideProps {
  initialData?: any;
  onDataChange?: (data: any) => void;
  onSave?: (data: any) => void;
  onGetCurrentData?: (getData: () => any) => void;
}

export function NhsPrepGuide({ initialData, onDataChange, onSave, onGetCurrentData }: NhsPrepGuideProps = {}) {
  const [documentPrep, setDocumentPrep] = useState<DocumentPrep>({
    gpReferral: false,
    medicationList: "",
    programSummary: "",
    personalToolkit: "",
    previousRecords: "",
    questionsList: []
  });

  const [programSummary, setProgramSummary] = useState<ProgramSummary>({
    helpfulTechniques: [],
    successfulSituations: [],
    supportNeeded: [],
    currentFunctioning: "",
    treatmentGoals: []
  });

  const [assessmentPrep, setAssessmentPrep] = useState<AssessmentPrep>({
    symptoms: [],
    triggers: [],
    copingStrategies: [],
    progressMade: "",
    challenges: "",
    values: "",
    supportSystems: ""
  });

  const [treatmentKnowledge, setTreatmentKnowledge] = useState<TreatmentKnowledge>({
    cbtUnderstanding: "",
    otherTherapies: [],
    medicationQuestions: [],
    groupTherapyInterest: "",
    treatmentPreferences: ""
  });

  const [ongoingPrep, setOngoingPrep] = useState<OngoingPrep>({
    dailyPractices: [],
    socialConnections: [],
    learningResources: [],
    progressMonitoring: ""
  });

  const [nhsReadiness, setNhsReadiness] = useState<NhsReadiness>({
    independentTools: 7,
    handleSetbacks: 6,
    maintainProgress: 6,
    transitionReadiness: 8,
    continueJourney: 8,
    confidence: ""
  });

  const [advocacyPrep, setAdvocacyPrep] = useState({
    treatmentPreferences: "",
    previousExperiences: "",
    concerns: "",
    supportPerson: "",
    questions: [] as string[]
  });

  // Load initial data when component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      if (initialData.documentPrep) setDocumentPrep(initialData.documentPrep);
      if (initialData.programSummary) setProgramSummary(initialData.programSummary);
      if (initialData.assessmentPrep) setAssessmentPrep(initialData.assessmentPrep);
      if (initialData.treatmentKnowledge) setTreatmentKnowledge(initialData.treatmentKnowledge);
      if (initialData.ongoingPrep) setOngoingPrep(initialData.ongoingPrep);
      if (initialData.nhsReadiness) setNhsReadiness(initialData.nhsReadiness);
      if (initialData.advocacyPrep) setAdvocacyPrep(initialData.advocacyPrep);
    }
  }, [initialData]);

  // Auto-save when data changes
  useEffect(() => {
    if (onDataChange) {
      const allData = {
        documentPrep,
        programSummary,
        assessmentPrep,
        treatmentKnowledge,
        ongoingPrep,
        nhsReadiness,
        advocacyPrep
      };
      onDataChange(allData);
    }
  }, [documentPrep, programSummary, assessmentPrep, treatmentKnowledge, ongoingPrep, nhsReadiness, advocacyPrep, onDataChange]);

  // Expose current data to parent component
  useEffect(() => {
    if (onGetCurrentData) {
      onGetCurrentData(() => ({
        documentPrep,
        programSummary,
        assessmentPrep,
        treatmentKnowledge,
        ongoingPrep,
        nhsReadiness,
        advocacyPrep
      }));
    }
  }, [documentPrep, programSummary, assessmentPrep, treatmentKnowledge, ongoingPrep, nhsReadiness, advocacyPrep, onGetCurrentData]);

  const suggestedQuestions = {
    treatmentOptions: [
      "What treatment approaches do you recommend for my specific type of anxiety?",
      "How long is the typical treatment course?",
      "What are the benefits and potential side effects of recommended treatments?",
      "Are there group therapy options available?",
      "What happens if the first treatment approach doesn't work?"
    ],
    waitingTimes: [
      "How long is the wait for treatment to begin?",
      "What support is available while I'm waiting?",
      "Can I continue using the skills I've learned in this program?",
      "Are there any resources or support groups I can access immediately?"
    ],
    ongoingSupport: [
      "What should I do if I'm struggling between appointments?",
      "How often will I be seen once treatment begins?",
      "What crisis support is available if I need it?",
      "How will my progress be monitored?"
    ],
    yourRole: [
      "What can I do to prepare for treatment?",
      "How can I make the most of therapy sessions?",
      "What should I do between sessions?",
      "How involved will my family or friends be in treatment?"
    ]
  };

  const helpfulTechniquesOptions = [
    "Breathing techniques (box breathing, diaphragmatic breathing)",
    "Grounding techniques (5-4-3-2-1, physical grounding)",
    "Cognitive strategies (thought challenging, reframing)",
    "Mindfulness and meditation practices",
    "Progressive muscle relaxation",
    "Exposure and behavioral activation",
    "Values-based decision making",
    "Anxiety tracking and monitoring"
  ];

  const currentSymptoms = [
    "Physical tension and muscle aches",
    "Sleep difficulties",
    "Racing thoughts or worry",
    "Difficulty concentrating",
    "Irritability or mood changes",
    "Avoidance of certain situations",
    "Social anxiety or isolation",
    "Panic attacks or acute anxiety episodes"
  ];

  const anxietyTriggers = [
    "Work or school stress",
    "Social situations",
    "Health concerns",
    "Financial worries",
    "Relationship issues",
    "Change or uncertainty",
    "Crowded places",
    "Performance situations"
  ];

  const copingStrategiesUsed = [
    "Daily breathing exercises",
    "Regular mindfulness practice",
    "Physical exercise",
    "Journaling and thought records",
    "Social support",
    "Values-based activities",
    "Relaxation techniques",
    "Exposure practice"
  ];

  const otherTherapyOptions = [
    "Acceptance and Commitment Therapy (ACT)",
    "Mindfulness-Based Cognitive Therapy (MBCT)",
    "Dialectical Behavior Therapy (DBT)",
    "Eye Movement Desensitization and Reprocessing (EMDR)",
    "Counseling/Humanistic therapy",
    "Group therapy",
    "Family therapy",
    "Online therapy platforms"
  ];

  const dailyPracticeOptions = [
    "Continue breathing and relaxation techniques",
    "Keep practicing mindfulness and grounding",
    "Maintain values-based goal setting",
    "Use personal anxiety toolkit regularly",
    "Regular exercise or movement",
    "Journaling and self-reflection",
    "Maintain healthy sleep schedule",
    "Practice exposure exercises"
  ];

  const socialConnectionOptions = [
    "Keep in touch with support network",
    "Continue social activities and relationships",
    "Engage with online communities if helpful",
    "Consider peer support groups",
    "Maintain family relationships",
    "Join anxiety support groups",
    "Connect with mental health communities",
    "Participate in community activities"
  ];

  const learningResourceOptions = [
    "Read self-help books on anxiety management",
    "Use mental health apps for additional support",
    "Practice skills learned consistently",
    "Try new anxiety management techniques",
    "Watch educational videos",
    "Listen to anxiety-focused podcasts",
    "Follow reputable mental health accounts",
    "Attend workshops or webinars"
  ];

  const addToArray = (setter: any, field: string, value: string) => {
    if (value.trim()) {
      setter((prev: any) => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeFromArray = (setter: any, field: string, index: number) => {
    setter((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const toggleArrayItem = (setter: any, field: string, item: string) => {
    setter((prev: any) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i: string) => i !== item)
        : [...prev[field], item]
    }));
  };

  const calculateOverallReadiness = () => {
    const { independentTools, handleSetbacks, maintainProgress, transitionReadiness, continueJourney } = nhsReadiness;
    return Math.round(((independentTools + handleSetbacks + maintainProgress + transitionReadiness + continueJourney) / 5) * 10);
  };

  const getCompletenessPercentage = () => {
    let completed = 0;
    let total = 0;

    // Document prep (6 items)
    total += 6;
    if (documentPrep.gpReferral) completed++;
    if (documentPrep.medicationList.trim()) completed++;
    if (documentPrep.programSummary.trim()) completed++;
    if (documentPrep.personalToolkit.trim()) completed++;
    if (documentPrep.previousRecords.trim()) completed++;
    if (documentPrep.questionsList.length > 0) completed++;

    // Program summary (5 arrays + 1 text)
    total += 6;
    if (programSummary.helpfulTechniques.length > 0) completed++;
    if (programSummary.successfulSituations.length > 0) completed++;
    if (programSummary.supportNeeded.length > 0) completed++;
    if (programSummary.currentFunctioning.trim()) completed++;
    if (programSummary.treatmentGoals.length > 0) completed++;
    if (assessmentPrep.values.trim()) completed++;

    // Assessment prep (7 items)
    total += 7;
    if (assessmentPrep.symptoms.length > 0) completed++;
    if (assessmentPrep.triggers.length > 0) completed++;
    if (assessmentPrep.copingStrategies.length > 0) completed++;
    if (assessmentPrep.progressMade.trim()) completed++;
    if (assessmentPrep.challenges.trim()) completed++;
    if (assessmentPrep.supportSystems.trim()) completed++;
    if (nhsReadiness.confidence.trim()) completed++;

    return Math.round((completed / total) * 100);
  };

  const exportNhsPrep = () => {
    const prepData = {
      documentPrep,
      programSummary,
      assessmentPrep,
      treatmentKnowledge,
      ongoingPrep,
      nhsReadiness,
      advocacyPrep,
      overallReadiness: calculateOverallReadiness(),
      completeness: getCompletenessPercentage(),
      createdDate: new Date().toISOString(),
      version: "1.0"
    };

    const dataStr = JSON.stringify(prepData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nhs-transition-preparation-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">NHS Mental Health Services Preparation</CardTitle>
              <p className="text-muted-foreground">Complete preparation guide for your transition to NHS care</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{calculateOverallReadiness()}%</div>
              <div className="text-sm text-muted-foreground">NHS Readiness Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getCompletenessPercentage()}%</div>
              <div className="text-sm text-muted-foreground">Preparation Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">6</div>
              <div className="text-sm text-muted-foreground">Weeks of Skills</div>
            </div>
          </div>
          
          <Progress value={getCompletenessPercentage()} className="mb-4" />
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>You're not starting from scratch:</strong> You're building on 6 weeks of skill development, 
              self-awareness, and proven anxiety management strategies. Approach NHS services with confidence!
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="summary">Program Summary</TabsTrigger>
          <TabsTrigger value="assessment">Assessment Prep</TabsTrigger>
          <TabsTrigger value="treatment">Treatment Options</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing Support</TabsTrigger>
          <TabsTrigger value="advocacy">Self-Advocacy</TabsTrigger>
        </TabsList>

        {/* Documents to Bring Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documents and Information to Bring
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Prepare the essential documents and information for your NHS assessment
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="gp-referral"
                    checked={documentPrep.gpReferral}
                    onCheckedChange={(checked) => setDocumentPrep(prev => ({ ...prev, gpReferral: !!checked }))}
                    data-testid="checkbox-gp-referral"
                  />
                  <label htmlFor="gp-referral" className="text-sm font-medium cursor-pointer">
                    GP referral letter (if you have one)
                  </label>
                </div>

                <div>
                  <Label htmlFor="medication-list">List of current medications</Label>
                  <Textarea
                    id="medication-list"
                    placeholder="List all medications, dosages, and any side effects you've experienced..."
                    value={documentPrep.medicationList}
                    onChange={(e) => setDocumentPrep(prev => ({ ...prev, medicationList: e.target.value }))}
                    className="mt-1"
                    data-testid="textarea-medication-list"
                  />
                </div>

                <div>
                  <Label htmlFor="program-summary">Summary of this 6-week program</Label>
                  <Textarea
                    id="program-summary"
                    placeholder="Briefly describe what you've learned and accomplished in this program..."
                    value={documentPrep.programSummary}
                    onChange={(e) => setDocumentPrep(prev => ({ ...prev, programSummary: e.target.value }))}
                    className="mt-1"
                    data-testid="textarea-program-summary"
                  />
                </div>

                <div>
                  <Label htmlFor="personal-toolkit">Your personal anxiety toolkit summary</Label>
                  <Textarea
                    id="personal-toolkit"
                    placeholder="Summarize your most effective anxiety management techniques..."
                    value={documentPrep.personalToolkit}
                    onChange={(e) => setDocumentPrep(prev => ({ ...prev, personalToolkit: e.target.value }))}
                    className="mt-1"
                    data-testid="textarea-personal-toolkit"
                  />
                </div>

                <div>
                  <Label htmlFor="previous-records">Any previous mental health records</Label>
                  <Textarea
                    id="previous-records"
                    placeholder="Note any previous therapy, assessments, or mental health treatment..."
                    value={documentPrep.previousRecords}
                    onChange={(e) => setDocumentPrep(prev => ({ ...prev, previousRecords: e.target.value }))}
                    className="mt-1"
                    data-testid="textarea-previous-records"
                  />
                </div>

                <div>
                  <Label>Questions you want to ask</Label>
                  <div className="space-y-2 mt-2">
                    {documentPrep.questionsList.map((question, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm">{question}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromArray(setDocumentPrep, 'questionsList', index)}
                          data-testid={`button-remove-question-${index}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add a question you want to ask..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addToArray(setDocumentPrep, 'questionsList', (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      data-testid="input-add-question"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                        addToArray(setDocumentPrep, 'questionsList', input.value);
                        input.value = '';
                      }}
                      data-testid="button-add-question"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-800">Suggested Questions by Category</h4>
                <div className="space-y-4">
                  {Object.entries(suggestedQuestions).map(([category, questions]) => (
                    <div key={category}>
                      <h5 className="font-medium mb-2 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h5>
                      <div className="space-y-1">
                        {questions.map((question, index) => (
                          <div key={index} className="text-sm text-green-700 flex items-start gap-2">
                            <span className="text-green-600">•</span>
                            <span>{question}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto text-green-600 hover:text-green-800"
                              onClick={() => addToArray(setDocumentPrep, 'questionsList', question)}
                              data-testid={`button-add-suggested-${category}-${index}`}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Program Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Your 6-Week Program Summary
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Create a comprehensive summary of your program experience to share with NHS services
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Techniques that have been most helpful</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {helpfulTechniquesOptions.map((technique) => (
                    <div key={technique} className="flex items-start space-x-3">
                      <Checkbox
                        id={`technique-${technique}`}
                        checked={programSummary.helpfulTechniques.includes(technique)}
                        onCheckedChange={() => toggleArrayItem(setProgramSummary, 'helpfulTechniques', technique)}
                        data-testid={`checkbox-technique-${technique.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <label htmlFor={`technique-${technique}`} className="text-sm cursor-pointer">
                        {technique}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Situations you've successfully managed</Label>
                <div className="space-y-2 mt-2">
                  {programSummary.successfulSituations.map((situation, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">{situation}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromArray(setProgramSummary, 'successfulSituations', index)}
                        data-testid={`button-remove-situation-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Describe a situation you've successfully managed..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addToArray(setProgramSummary, 'successfulSituations', (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    data-testid="input-add-situation"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                      addToArray(setProgramSummary, 'successfulSituations', input.value);
                      input.value = '';
                    }}
                    data-testid="button-add-situation"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Areas where you still need support</Label>
                <div className="space-y-2 mt-2">
                  {programSummary.supportNeeded.map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                      <span className="text-sm">{area}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromArray(setProgramSummary, 'supportNeeded', index)}
                        data-testid={`button-remove-support-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add an area where you need continued support..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addToArray(setProgramSummary, 'supportNeeded', (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    data-testid="input-add-support"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                      addToArray(setProgramSummary, 'supportNeeded', input.value);
                      input.value = '';
                    }}
                    data-testid="button-add-support"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="current-functioning">Your current anxiety levels and daily functioning</Label>
                <Textarea
                  id="current-functioning"
                  placeholder="Describe how anxiety affects your daily life now compared to when you started..."
                  value={programSummary.currentFunctioning}
                  onChange={(e) => setProgramSummary(prev => ({ ...prev, currentFunctioning: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-current-functioning"
                />
              </div>

              <div>
                <Label>Goals for ongoing treatment</Label>
                <div className="space-y-2 mt-2">
                  {programSummary.treatmentGoals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                      <span className="text-sm">{goal}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromArray(setProgramSummary, 'treatmentGoals', index)}
                        data-testid={`button-remove-goal-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a goal for your ongoing treatment..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addToArray(setProgramSummary, 'treatmentGoals', (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    data-testid="input-add-goal"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                      addToArray(setProgramSummary, 'treatmentGoals', input.value);
                      input.value = '';
                    }}
                    data-testid="button-add-goal"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessment Preparation Tab */}
        <TabsContent value="assessment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Assessment Preparation
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Prepare the information you'll need to share during your NHS assessment
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Specific anxiety symptoms and their frequency</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {currentSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-start space-x-3">
                      <Checkbox
                        id={`symptom-${symptom}`}
                        checked={assessmentPrep.symptoms.includes(symptom)}
                        onCheckedChange={() => toggleArrayItem(setAssessmentPrep, 'symptoms', symptom)}
                        data-testid={`checkbox-symptom-${symptom.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <label htmlFor={`symptom-${symptom}`} className="text-sm cursor-pointer">
                        {symptom}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Triggers you've identified</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {anxietyTriggers.map((trigger) => (
                    <div key={trigger} className="flex items-start space-x-3">
                      <Checkbox
                        id={`trigger-${trigger}`}
                        checked={assessmentPrep.triggers.includes(trigger)}
                        onCheckedChange={() => toggleArrayItem(setAssessmentPrep, 'triggers', trigger)}
                        data-testid={`checkbox-trigger-${trigger.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <label htmlFor={`trigger-${trigger}`} className="text-sm cursor-pointer">
                        {trigger}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Coping strategies you've developed</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {copingStrategiesUsed.map((strategy) => (
                    <div key={strategy} className="flex items-start space-x-3">
                      <Checkbox
                        id={`strategy-${strategy}`}
                        checked={assessmentPrep.copingStrategies.includes(strategy)}
                        onCheckedChange={() => toggleArrayItem(setAssessmentPrep, 'copingStrategies', strategy)}
                        data-testid={`checkbox-strategy-${strategy.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <label htmlFor={`strategy-${strategy}`} className="text-sm cursor-pointer">
                        {strategy}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="progress-made">Progress you've made and challenges remaining</Label>
                <Textarea
                  id="progress-made"
                  placeholder="Describe the progress you've made and what challenges you still face..."
                  value={assessmentPrep.progressMade}
                  onChange={(e) => setAssessmentPrep(prev => ({ ...prev, progressMade: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-progress-made"
                />
              </div>

              <div>
                <Label htmlFor="ongoing-challenges">Current challenges and difficulties</Label>
                <Textarea
                  id="ongoing-challenges"
                  placeholder="What aspects of anxiety management are still challenging for you?"
                  value={assessmentPrep.challenges}
                  onChange={(e) => setAssessmentPrep(prev => ({ ...prev, challenges: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-ongoing-challenges"
                />
              </div>

              <div>
                <Label htmlFor="values-goals">Your values and treatment goals</Label>
                <Textarea
                  id="values-goals"
                  placeholder="What are your core values and what do you hope to achieve in treatment?"
                  value={assessmentPrep.values}
                  onChange={(e) => setAssessmentPrep(prev => ({ ...prev, values: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-values-goals"
                />
              </div>

              <div>
                <Label htmlFor="support-systems">Support systems you have in place</Label>
                <Textarea
                  id="support-systems"
                  placeholder="Describe your family, friends, and other support systems..."
                  value={assessmentPrep.supportSystems}
                  onChange={(e) => setAssessmentPrep(prev => ({ ...prev, supportSystems: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-support-systems"
                />
              </div>
            </CardContent>
          </Card>

          {/* NHS Readiness Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                NHS Transition Readiness
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Rate your readiness for NHS mental health services (1-10 scale)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">
                    Using anxiety management tools independently: {nhsReadiness.independentTools}/10
                  </Label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={nhsReadiness.independentTools}
                    onChange={(e) => setNhsReadiness(prev => ({ ...prev, independentTools: parseInt(e.target.value) }))}
                    className="w-full mt-2"
                    data-testid="slider-independent-tools"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Handling setbacks without professional support: {nhsReadiness.handleSetbacks}/10
                  </Label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={nhsReadiness.handleSetbacks}
                    onChange={(e) => setNhsReadiness(prev => ({ ...prev, handleSetbacks: parseInt(e.target.value) }))}
                    className="w-full mt-2"
                    data-testid="slider-handle-setbacks"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Maintaining progress during stressful periods: {nhsReadiness.maintainProgress}/10
                  </Label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={nhsReadiness.maintainProgress}
                    onChange={(e) => setNhsReadiness(prev => ({ ...prev, maintainProgress: parseInt(e.target.value) }))}
                    className="w-full mt-2"
                    data-testid="slider-maintain-progress"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Transitioning to NHS mental health services: {nhsReadiness.transitionReadiness}/10
                  </Label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={nhsReadiness.transitionReadiness}
                    onChange={(e) => setNhsReadiness(prev => ({ ...prev, transitionReadiness: parseInt(e.target.value) }))}
                    className="w-full mt-2"
                    data-testid="slider-transition-readiness"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Continuing your anxiety management journey: {nhsReadiness.continueJourney}/10
                  </Label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={nhsReadiness.continueJourney}
                    onChange={(e) => setNhsReadiness(prev => ({ ...prev, continueJourney: parseInt(e.target.value) }))}
                    className="w-full mt-2"
                    data-testid="slider-continue-journey"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="readiness-confidence">What gives you confidence in your readiness?</Label>
                <Textarea
                  id="readiness-confidence"
                  placeholder="Describe what makes you feel ready for the transition and any concerns you have..."
                  value={nhsReadiness.confidence}
                  onChange={(e) => setNhsReadiness(prev => ({ ...prev, confidence: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-readiness-confidence"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Overall NHS Readiness Score</h4>
                </div>
                <div className="text-3xl font-bold text-blue-600">{calculateOverallReadiness()}%</div>
                <Progress value={calculateOverallReadiness()} className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treatment Options Tab */}
        <TabsContent value="treatment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Understanding Treatment Options
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Learn about treatment options and prepare your preferences
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="cbt-understanding">Your understanding of CBT and how it relates to your experience</Label>
                <Textarea
                  id="cbt-understanding"
                  placeholder="Describe what you know about CBT and how it might build on what you've learned..."
                  value={treatmentKnowledge.cbtUnderstanding}
                  onChange={(e) => setTreatmentKnowledge(prev => ({ ...prev, cbtUnderstanding: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-cbt-understanding"
                />
              </div>

              <div>
                <Label>Other therapy approaches you're interested in learning about</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {otherTherapyOptions.map((therapy) => (
                    <div key={therapy} className="flex items-start space-x-3">
                      <Checkbox
                        id={`therapy-${therapy}`}
                        checked={treatmentKnowledge.otherTherapies.includes(therapy)}
                        onCheckedChange={() => toggleArrayItem(setTreatmentKnowledge, 'otherTherapies', therapy)}
                        data-testid={`checkbox-therapy-${therapy.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <label htmlFor={`therapy-${therapy}`} className="text-sm cursor-pointer">
                        {therapy}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Questions about medication</Label>
                <div className="space-y-2 mt-2">
                  {treatmentKnowledge.medicationQuestions.map((question, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <span className="text-sm">{question}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromArray(setTreatmentKnowledge, 'medicationQuestions', index)}
                        data-testid={`button-remove-med-question-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a question about medication..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addToArray(setTreatmentKnowledge, 'medicationQuestions', (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    data-testid="input-add-med-question"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                      addToArray(setTreatmentKnowledge, 'medicationQuestions', input.value);
                      input.value = '';
                    }}
                    data-testid="button-add-med-question"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="group-therapy-interest">Interest in group therapy</Label>
                <Textarea
                  id="group-therapy-interest"
                  placeholder="How do you feel about group therapy? Any concerns or interests?"
                  value={treatmentKnowledge.groupTherapyInterest}
                  onChange={(e) => setTreatmentKnowledge(prev => ({ ...prev, groupTherapyInterest: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-group-therapy-interest"
                />
              </div>

              <div>
                <Label htmlFor="treatment-preferences">Your treatment preferences and concerns</Label>
                <Textarea
                  id="treatment-preferences"
                  placeholder="What kind of treatment approach feels right for you? Any concerns or preferences?"
                  value={treatmentKnowledge.treatmentPreferences}
                  onChange={(e) => setTreatmentKnowledge(prev => ({ ...prev, treatmentPreferences: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-treatment-preferences"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ongoing Support Tab */}
        <TabsContent value="ongoing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Maintaining Progress While Waiting
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Plan how to continue your progress during any waiting period
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Daily practices you'll maintain</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {dailyPracticeOptions.map((practice) => (
                    <div key={practice} className="flex items-start space-x-3">
                      <Checkbox
                        id={`daily-${practice}`}
                        checked={ongoingPrep.dailyPractices.includes(practice)}
                        onCheckedChange={() => toggleArrayItem(setOngoingPrep, 'dailyPractices', practice)}
                        data-testid={`checkbox-daily-${practice.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <label htmlFor={`daily-${practice}`} className="text-sm cursor-pointer">
                        {practice}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Social connections and support</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {socialConnectionOptions.map((connection) => (
                    <div key={connection} className="flex items-start space-x-3">
                      <Checkbox
                        id={`social-${connection}`}
                        checked={ongoingPrep.socialConnections.includes(connection)}
                        onCheckedChange={() => toggleArrayItem(setOngoingPrep, 'socialConnections', connection)}
                        data-testid={`checkbox-social-${connection.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <label htmlFor={`social-${connection}`} className="text-sm cursor-pointer">
                        {connection}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Learning and development resources</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {learningResourceOptions.map((resource) => (
                    <div key={resource} className="flex items-start space-x-3">
                      <Checkbox
                        id={`learning-${resource}`}
                        checked={ongoingPrep.learningResources.includes(resource)}
                        onCheckedChange={() => toggleArrayItem(setOngoingPrep, 'learningResources', resource)}
                        data-testid={`checkbox-learning-${resource.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <label htmlFor={`learning-${resource}`} className="text-sm cursor-pointer">
                        {resource}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="progress-monitoring">How you'll monitor and document your progress</Label>
                <Textarea
                  id="progress-monitoring"
                  placeholder="Describe how you'll track your progress and prepare updates for your first NHS appointment..."
                  value={ongoingPrep.progressMonitoring}
                  onChange={(e) => setOngoingPrep(prev => ({ ...prev, progressMonitoring: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-progress-monitoring"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Self-Advocacy Tab */}
        <TabsContent value="advocacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Self-Advocacy and Rights
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Prepare to advocate for yourself and understand your rights
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="treatment-preferences-advocacy">Your treatment preferences and how to express them</Label>
                <Textarea
                  id="treatment-preferences-advocacy"
                  placeholder="What are your preferences for treatment approach, frequency, format, etc.?"
                  value={advocacyPrep.treatmentPreferences}
                  onChange={(e) => setAdvocacyPrep(prev => ({ ...prev, treatmentPreferences: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-treatment-preferences-advocacy"
                />
              </div>

              <div>
                <Label htmlFor="previous-experiences">Previous mental health experiences (positive and negative)</Label>
                <Textarea
                  id="previous-experiences"
                  placeholder="Describe any previous therapy or mental health support and what worked or didn't work..."
                  value={advocacyPrep.previousExperiences}
                  onChange={(e) => setAdvocacyPrep(prev => ({ ...prev, previousExperiences: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-previous-experiences"
                />
              </div>

              <div>
                <Label htmlFor="concerns">Concerns or anxiety about NHS services</Label>
                <Textarea
                  id="concerns"
                  placeholder="What concerns do you have about NHS mental health services? How can these be addressed?"
                  value={advocacyPrep.concerns}
                  onChange={(e) => setAdvocacyPrep(prev => ({ ...prev, concerns: e.target.value }))}
                  className="mt-1"
                  data-testid="textarea-concerns"
                />
              </div>

              <div>
                <Label htmlFor="support-person">Support person for appointments</Label>
                <Input
                  id="support-person"
                  placeholder="Name of someone who could accompany you to appointments if needed..."
                  value={advocacyPrep.supportPerson}
                  onChange={(e) => setAdvocacyPrep(prev => ({ ...prev, supportPerson: e.target.value }))}
                  className="mt-1"
                  data-testid="input-support-person"
                />
              </div>

              <div>
                <Label>Specific advocacy questions or requests</Label>
                <div className="space-y-2 mt-2">
                  {advocacyPrep.questions.map((question, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                      <span className="text-sm">{question}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromArray(setAdvocacyPrep, 'questions', index)}
                        data-testid={`button-remove-advocacy-question-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add an advocacy question or request..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addToArray(setAdvocacyPrep, 'questions', (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    data-testid="input-add-advocacy-question"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                      addToArray(setAdvocacyPrep, 'questions', input.value);
                      input.value = '';
                    }}
                    data-testid="button-add-advocacy-question"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-800">Your Rights in NHS Mental Health Services</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Right to be involved in decisions about your care</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Right to ask for a second opinion if needed</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Right to request a different therapist if the fit isn't right</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Right to access your medical records</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Right to complain and seek support from Patient Advice and Liaison Service (PALS)</span>
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
            <ArrowRight className="w-5 h-5 text-green-500" />
            You're Ready for NHS Mental Health Services!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getCompletenessPercentage()}%</div>
              <div className="text-sm text-muted-foreground">Preparation Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{calculateOverallReadiness()}%</div>
              <div className="text-sm text-muted-foreground">NHS Readiness</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {programSummary.helpfulTechniques.length + assessmentPrep.copingStrategies.length}
              </div>
              <div className="text-sm text-muted-foreground">Skills & Strategies</div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2 text-green-800">Your Strengths Going Forward:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>6 weeks of anxiety management skills</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Personal toolkit of proven techniques</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Understanding of your triggers and patterns</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Experience with exposure and behavioral change</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Clear values and treatment goals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Relapse prevention plan</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={exportNhsPrep} className="gap-2" size="lg">
              <Download className="w-4 h-4" />
              Export Your Complete NHS Preparation Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}