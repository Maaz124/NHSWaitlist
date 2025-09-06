import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { TabNavigation } from "@/components/ui/tab-navigation";
import { CrisisBanner } from "@/components/ui/crisis-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { calculateRiskScore, determineRiskLevel, getRiskColor } from "@/lib/risk-calculator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Footer } from "@/components/ui/footer";

const weeklyAssessmentSchema = z.object({
  anxietyFrequency: z.string(),
  worryFrequency: z.string(),
  depressionFrequency: z.string(),
  anhedoniaFrequency: z.string(),
  sleepQuality: z.string(),
  functioningLevel: z.string(),
});

const questions = [
  {
    id: "anxietyFrequency",
    question: "Over the past week, how often have you been bothered by feeling nervous, anxious, or on edge?",
  },
  {
    id: "worryFrequency", 
    question: "Over the past week, how often have you been bothered by not being able to stop or control worrying?",
  },
  {
    id: "depressionFrequency",
    question: "Over the past week, how often have you been bothered by feeling down, depressed, or hopeless?",
  },
  {
    id: "anhedoniaFrequency",
    question: "Over the past week, how often have you been bothered by little interest or pleasure in doing things?",
  },
  {
    id: "sleepQuality",
    question: "How would you describe your sleep quality this week?",
    options: [
      { value: "excellent", label: "Excellent" },
      { value: "good", label: "Good" }, 
      { value: "fair", label: "Fair" },
      { value: "poor", label: "Poor" },
    ],
  },
  {
    id: "functioningLevel",
    question: "How has anxiety affected your daily functioning this week?",
    options: [
      { value: "not-at-all", label: "Not at all" },
      { value: "slightly", label: "Slightly" },
      { value: "moderately", label: "Moderately" },
      { value: "severely", label: "Severely" },
    ],
  },
];

const frequencyOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" },
];

export default function CheckIns() {
  const mockUserId = "user-1";
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [showAssessmentDetail, setShowAssessmentDetail] = useState(false);

  const { data: assessmentsData, isLoading } = useQuery({
    queryKey: ["/api/assessments", mockUserId],
  });

  const form = useForm({
    resolver: zodResolver(weeklyAssessmentSchema),
    defaultValues: {
      anxietyFrequency: "",
      worryFrequency: "",
      depressionFrequency: "",
      anhedoniaFrequency: "",
      sleepQuality: "",
      functioningLevel: "",
    },
    mode: "onChange",
  });

  const createAssessmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/assessments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments", mockUserId] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard", mockUserId] });
      setShowHistory(true);
      form.reset();
      setCurrentQuestion(0);
    },
  });

  const onNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const onPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const responses = form.getValues();
    const weekNumber = ((assessmentsData as any)?.assessments?.length || 0) + 1;
    
    createAssessmentMutation.mutate({
      userId: mockUserId,
      weekNumber,
      responses,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading assessments...</div>
      </div>
    );
  }

  const assessments = (assessmentsData as any)?.assessments || [];
  const hasCompletedThisWeek = assessments.some((a: any) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(a.completedAt) > oneWeekAgo;
  });

  if (showHistory || hasCompletedThisWeek) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <CrisisBanner />
        <TabNavigation />
        
        <main className="flex-1 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Weekly Check-ins</h2>
              <p className="text-muted-foreground">Regular assessments to monitor your wellbeing and ensure your safety</p>
            </div>

            {hasCompletedThisWeek && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Check className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">
                      This week's assessment completed
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Thank you for completing your weekly check-in. Your next assessment will be due in 7 days.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => setShowHistory(false)}
                      data-testid="button-take-new-assessment"
                    >
                      Take Another Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Assessment History */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-card-foreground mb-6">Assessment History</h3>
                
                <div className="space-y-4">
                  {assessments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No assessments completed yet.</p>
                      <Button 
                        className="mt-4"
                        onClick={() => setShowHistory(false)}
                        data-testid="button-start-first-assessment"
                      >
                        Take Your First Assessment
                      </Button>
                    </div>
                  ) : (
                    assessments.map((assessment: any, index: number) => (
                      <div key={assessment.id} className="flex items-center justify-between p-4 bg-secondary rounded-md">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-accent-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground">
                              Week {assessment.weekNumber} Assessment
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>
                                Completed {new Date(assessment.completedAt).toLocaleDateString()}
                              </span>
                              <Badge variant={getRiskColor(assessment.riskLevel) as any}>
                                Risk: {assessment.riskLevel}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedAssessment(assessment);
                            setShowAssessmentDetail(true);
                          }}
                          data-testid={`button-view-assessment-${assessment.weekNumber}`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const questionOptions = currentQ.options || frequencyOptions;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CrisisBanner />
      <TabNavigation />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Weekly Check-ins</h2>
            <p className="text-muted-foreground">Regular assessments to monitor your wellbeing and ensure your safety</p>
          </div>

          {/* Current Check-in Form */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-card-foreground">This Week's Assessment</h3>
                <Badge className="bg-primary/10 text-primary">Due Today</Badge>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ~{Math.ceil((questions.length - currentQuestion) * 0.75)} min remaining
                  </span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-card-foreground mb-4">
                    {currentQ.question}
                  </label>
                  
                  <div className="space-y-3">
                    {questionOptions.map((option) => (
                      <div 
                        key={option.value}
                        className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${
                          form.watch(currentQ.id as any) === option.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:bg-secondary/50'
                        }`}
                        onClick={() => {
                          form.setValue(currentQ.id as any, option.value);
                        }}
                        data-testid={`option-${currentQ.id}-${option.value}`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                          form.watch(currentQ.id as any) === option.value 
                            ? 'border-primary' 
                            : 'border-gray-300'
                        }`}>
                          {form.watch(currentQ.id as any) === option.value && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <span className="text-card-foreground flex-1">
                          {option.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button 
                    variant="outline"
                    onClick={onPrevious}
                    disabled={currentQuestion === 0}
                    data-testid="button-previous-question"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button 
                    onClick={onNext}
                    disabled={!form.watch(currentQ.id as any) || createAssessmentMutation.isPending}
                    data-testid="button-next-question"
                  >
                    {currentQuestion === questions.length - 1 ? "Complete Assessment" : "Next"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />

      {/* Assessment Details Dialog */}
      <Dialog open={showAssessmentDetail} onOpenChange={setShowAssessmentDetail}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Week {selectedAssessment?.weekNumber} Assessment Details
            </DialogTitle>
          </DialogHeader>
          {selectedAssessment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Completed:</span>
                  <p>{new Date(selectedAssessment.completedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Risk Level:</span>
                  <p>
                    <Badge variant={getRiskColor(selectedAssessment.riskLevel) as any}>
                      {selectedAssessment.riskLevel}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Risk Score:</span>
                  <p>{selectedAssessment.riskScore}/12</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Week Number:</span>
                  <p>Week {selectedAssessment.weekNumber}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 text-card-foreground">Response Summary</h4>
                <div className="space-y-2 text-sm">
                  {selectedAssessment.responses && Object.entries(selectedAssessment.responses).map(([key, value]: [string, any]) => {
                    const questionMap: Record<string, string> = {
                      anxietyFrequency: "Anxiety frequency",
                      worryFrequency: "Worry frequency", 
                      depressionFrequency: "Depression frequency",
                      anhedoniaFrequency: "Loss of interest frequency",
                      sleepQuality: "Sleep quality",
                      functioningLevel: "Daily functioning level"
                    };
                    
                    const valueMap: Record<string, string> = {
                      "0": "Not at all",
                      "1": "Several days", 
                      "2": "More than half the days",
                      "3": "Nearly every day",
                      "excellent": "Excellent",
                      "good": "Good",
                      "fair": "Fair", 
                      "poor": "Poor",
                      "not-at-all": "Not at all",
                      "slightly": "Slightly",
                      "moderately": "Moderately",
                      "severely": "Severely"
                    };
                    
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{questionMap[key]}:</span>
                        <span className="font-medium">{valueMap[value] || value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
