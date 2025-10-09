import { useState, useEffect } from "react";
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
import { Check, ArrowLeft, ArrowRight, Eye, Clock } from "lucide-react";
import { calculateRiskScore, determineRiskLevel, getRiskColor } from "@/lib/risk-calculator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Footer } from "@/components/ui/footer";
import { useUser } from "@/contexts/UserContext";
import { useLocation } from "wouter";

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
  const [, setLocation] = useLocation();
  const { user, isLoading: userLoading, isAuthenticated } = useUser();

  // Redirect if not authenticated
  useEffect(() => {
    if (userLoading) return; // Still loading
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, userLoading, setLocation]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [showAssessmentDetail, setShowAssessmentDetail] = useState(false);
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (showAssessmentDetail) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "";
      };
    }
  }, [showAssessmentDetail]);


  const { data: assessmentsData, isLoading } = useQuery({
    queryKey: ["/api/assessments", user?.id],
    enabled: !!user?.id,
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
      queryClient.invalidateQueries({ queryKey: ["/api/assessments", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard", user?.id] });
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
      userId: user?.id,
      weekNumber,
      responses,
    });
  };

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Show loading state if not authenticated (redirect will happen)
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Redirecting...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading assessments...</div>
      </div>
    );
  }

  const assessments = (assessmentsData as any)?.assessments || [];
  
  // Find the most recent assessment
  const mostRecentAssessment = assessments.length > 0 
    ? assessments.reduce((latest: any, current: any) => 
        new Date(current.completedAt) > new Date(latest.completedAt) ? current : latest
      )
    : null;
  
  // Check if user has completed an assessment this week
  const hasCompletedThisWeek = mostRecentAssessment ? (() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(mostRecentAssessment.completedAt) > oneWeekAgo;
  })() : false;
  
  // Calculate next available date (7 days from last assessment)
  const nextAvailableDate = mostRecentAssessment 
    ? new Date(new Date(mostRecentAssessment.completedAt).getTime() + 7 * 24 * 60 * 60 * 1000)
    : new Date();
  
  // Check if next assessment is available
  const canTakeAssessment = !hasCompletedThisWeek || new Date() >= nextAvailableDate;
  
  // Calculate days until next assessment
  const daysUntilNext = canTakeAssessment ? 0 : Math.ceil((nextAvailableDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  // Determine if we should show history view
  const showHistoryView = showHistory || hasCompletedThisWeek;

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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Weekly Check-ins</h2>
                <p className="text-muted-foreground">Regular assessments to monitor your wellbeing and ensure your safety</p>
              </div>
              
            </div>
          </div>

          {/* History View */}
          {showHistoryView ? (
            <>
              {hasCompletedThisWeek && !canTakeAssessment && (
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Check className="w-12 h-12 text-accent mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">
                        This week's assessment completed
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Thank you for completing your weekly check-in. 
                        {daysUntilNext > 0 ? (
                          <> Your next assessment will be available in {daysUntilNext} day{daysUntilNext !== 1 ? 's' : ''}.</>
                        ) : (
                          <> Your next assessment is now available!</>
                        )}
                      </p>
                      {canTakeAssessment ? (
                        <Button 
                          variant="outline"
                          onClick={() => setShowHistory(false)}
                          data-testid="button-take-new-assessment"
                        >
                          Take Another Assessment
                        </Button>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Next assessment available: {nextAvailableDate.toLocaleDateString()}
                        </div>
                      )}
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
                                Weekly Assessment {assessment.weekNumber}
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
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              // Set the selected assessment and show modal
                              setSelectedAssessment(assessment);
                              setShowAssessmentDetail(true);
                            }}
                            data-testid={`button-view-assessment-${assessment.weekNumber}`}
                            type="button"
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
            </>
          ) : (
            <>
              {/* Show weekly restriction message if user completed this week */}
              {hasCompletedThisWeek && !canTakeAssessment && (
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">
                        Weekly Assessment Completed
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        You've already completed your weekly assessment. 
                        {daysUntilNext > 0 ? (
                          <> Your next assessment will be available in {daysUntilNext} day{daysUntilNext !== 1 ? 's' : ''}.</>
                        ) : (
                          <> Your next assessment is now available!</>
                        )}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        Next assessment available: {nextAvailableDate.toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Current Check-in Form - only show if user can take assessment */}
              {canTakeAssessment && (
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
              )}
            </>
          )}
        </div>
      </main>
      <Footer />

      {/* Assessment Details Modal */}
      {showAssessmentDetail && selectedAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setShowAssessmentDetail(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-card border border-border rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Weekly Assessment {selectedAssessment.weekNumber}
                  </h2>
                  <p className="text-sm text-muted-foreground">Completed on {new Date(selectedAssessment.completedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAssessmentDetail(false)}
                className="text-muted-foreground hover:text-foreground text-2xl font-bold transition-colors w-8 h-8 flex items-center justify-center rounded-md hover:bg-secondary"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Assessment Overview */}
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-xl border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-card-foreground">Assessment Overview</h3>
                  <Badge variant={getRiskColor(selectedAssessment.riskLevel) as any} className="text-sm px-3 py-1">
                    {selectedAssessment.riskLevel} Risk
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{selectedAssessment.riskScore}</div>
                    <div className="text-sm text-muted-foreground">Risk Score / 15</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">Assessment {selectedAssessment.weekNumber}</div>
                    <div className="text-sm text-muted-foreground">Weekly Assessment</div>
                  </div>
                </div>
              </div>

              {/* Your Responses */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  Your Responses
                </h3>
                <div className="space-y-4">
                  {selectedAssessment.responses && Object.entries(selectedAssessment.responses).map(([key, value]: [string, any]) => {
                    const questionMap: Record<string, string> = {
                      anxietyFrequency: "How often have you felt nervous, anxious, or on edge?",
                      worryFrequency: "How often have you been unable to stop or control worrying?", 
                      depressionFrequency: "How often have you felt down, depressed, or hopeless?",
                      anhedoniaFrequency: "How often have you had little interest or pleasure in doing things?",
                      sleepQuality: "How would you rate your overall sleep quality?",
                      functioningLevel: "How much have these problems affected your daily functioning?"
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
                      <div key={key} className="bg-secondary/30 p-4 rounded-lg border border-border/50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-card-foreground mb-1">
                              {questionMap[key] || key}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Your response: <span className="font-medium text-foreground">{valueMap[value] || value}</span>
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <Badge variant="secondary" className="text-xs">
                              {valueMap[value] || value}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-6 border-t border-border bg-secondary/20">
              <div className="text-sm text-muted-foreground">
                Assessment completed on {new Date(selectedAssessment.completedAt).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <Button
                onClick={() => setShowAssessmentDetail(false)}
                variant="outline"
                className="min-w-[100px]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
