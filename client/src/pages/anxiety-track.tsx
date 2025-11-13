import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Header } from "@/components/ui/header";
import { TabNavigation } from "@/components/ui/tab-navigation";
import { CrisisBanner } from "@/components/ui/crisis-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, 
  Play, 
  Lock, 
  Clock, 
  List, 
  Target, 
  BookOpen, 
  Heart, 
  Brain, 
  Users, 
  Award,
  TrendingUp,
  Calendar,
  Timer,
  ChevronRight,
  Star,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/ui/footer";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useUser } from "@/contexts/UserContext";

export default function AnxietyTrack() {
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("modules");
  const { user, isLoading: userLoading, isAuthenticated } = useUser();

  // Redirect if not authenticated
  useEffect(() => {
    if (userLoading) return; // Still loading
    if (!isAuthenticated) {
        setLocation("/login");
        return;
    }
    // Enforce payment status for accessing modules overview
    if (!(user as any)?.hasPaid) {
        setLocation('/pricing');
    }
  }, [isAuthenticated, userLoading, setLocation]);

  const { data: modulesData, isLoading } = useQuery({
    queryKey: ["/api/modules", user?.id],
    enabled: !!user?.id,
  });

  const { data: dashboardData } = useQuery({
    queryKey: ["/api/dashboard", user?.id],
    enabled: !!user?.id,
  });

  const updateModuleMutation = useMutation({
    mutationFn: async ({ moduleId, updates }: { moduleId: string; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/modules/${moduleId}`, updates);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard", user?.id] });
    },
      onError: (error: any) => {
        alert(`Failed to update module: ${error.message}`);
      },
    });

    // Helper function to get static module content (simplified version)
    const getModuleContent = (weekNumber: number) => {
      const contents = {
        1: {
          activities: [
            { id: "anxiety-intro", estimatedMinutes: 8 },
            { id: "symptoms-check", estimatedMinutes: 12 },
            { id: "trigger-identification", estimatedMinutes: 15 },
            { id: "anxiety-diary", estimatedMinutes: 10 }
          ]
        },
        2: {
          activities: [
            { id: "breathing-intro", estimatedMinutes: 10 },
            { id: "box-breathing", estimatedMinutes: 8 },
            { id: "progressive-relaxation", estimatedMinutes: 12 },
            { id: "grounding-techniques", estimatedMinutes: 6 },
            { id: "breathing-practice", estimatedMinutes: 12 }
          ]
        },
        3: {
          activities: [
            { id: "cognitive-intro", estimatedMinutes: 10 },
            { id: "thought-records", estimatedMinutes: 15 },
            { id: "evidence-examination", estimatedMinutes: 15 }
          ]
        },
        4: {
          activities: [
            { id: "mindfulness-intro", estimatedMinutes: 8 },
            { id: "mindful-breathing", estimatedMinutes: 10 },
            { id: "body-scan", estimatedMinutes: 12 },
            { id: "mindful-observation", estimatedMinutes: 10 }
          ]
        },
        5: {
          activities: [
            { id: "behavioral-intro", estimatedMinutes: 10 },
            { id: "activity-scheduling", estimatedMinutes: 12 },
            { id: "exposure-hierarchy", estimatedMinutes: 15 },
            { id: "behavioral-experiments", estimatedMinutes: 12 }
          ]
        },
        6: {
          activities: [
            { id: "progress-review", estimatedMinutes: 20 },
            { id: "personal-toolkit", estimatedMinutes: 25 },
            { id: "relapse-prevention-plan", estimatedMinutes: 15 },
            { id: "nhs-transition-prep", estimatedMinutes: 10 }
          ]
        }
      };
      return contents[weekNumber as keyof typeof contents];
    };

    // Helper function to calculate actual progress from user progress data
    const getActualProgress = (module: any) => {
      if (!module.userProgress) return { activitiesCompleted: 0, minutesCompleted: 0 };
      
      // Get static module content to calculate total activities and minutes
      const staticContent = getModuleContent(module.weekNumber);
      if (!staticContent) return { activitiesCompleted: 0, minutesCompleted: 0 };
      
      const completedActivities = staticContent.activities.filter((activity: any) => {
        return module.userProgress[activity.id]?.completed || false;
      });
      
      return {
        activitiesCompleted: completedActivities.length,
        minutesCompleted: completedActivities.reduce((total: number, activity: any) => {
          return total + (activity.estimatedMinutes || 0);
        }, 0)
      };
    };

  const handleCompleteModule = (module: any) => {
      const actualProgress = getActualProgress(module);
      
      // Only mark as completed if all activities are actually completed
      if (actualProgress.activitiesCompleted >= module.activitiesTotal) {
    const updates = {
      completedAt: new Date().toISOString(),
          minutesCompleted: actualProgress.minutesCompleted,
          activitiesCompleted: actualProgress.activitiesCompleted
          // Don't send userProgress here - let the backend preserve existing data
    };
    
    updateModuleMutation.mutate({
      moduleId: module.id,
      updates,
    });
      }
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
        <div className="text-center">Loading modules...</div>
      </div>
    );
  }

  const modules = (modulesData as any)?.modules || [];
  const dashboard = (dashboardData as any)?.dashboardData || {};

  const getModuleIcon = (weekNumber: number) => {
    const icons = {
      1: BookOpen,  // Understanding
      2: Heart,     // Breathing
      3: Brain,     // Cognitive
      4: Target,    // Mindfulness
      5: Users,     // Behavioral
      6: Award      // Prevention
    };
    return icons[weekNumber as keyof typeof icons] || BookOpen;
  };

  const getModuleColor = (weekNumber: number, isCompleted: boolean, isInProgress: boolean, isLocked: boolean) => {
    if (isCompleted) return "bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-800";
    if (isInProgress) return "bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-800";
    if (isLocked) return "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800";
    return "bg-background border-border";
  };

  const getDetailedModuleInfo = (weekNumber: number) => {
    const details = {
      1: {
        keySkills: ["Understanding anxiety triggers", "Recognizing physical symptoms", "Building self-awareness"],
        techniques: ["Anxiety symptom tracking", "Trigger identification", "Body awareness exercises"],
        evidence: "Based on CBT psychoeducation principles"
      },
      2: {
        keySkills: ["Diaphragmatic breathing", "Progressive muscle relaxation", "Quick calming techniques"],
        techniques: ["4-7-8 breathing", "Box breathing", "Body scan relaxation"],
        evidence: "Proven techniques from anxiety management research"
      },
      3: {
        keySkills: ["Identifying thought patterns", "Challenging anxious thoughts", "Balanced thinking"],
        techniques: ["Thought records", "Evidence examination", "Cognitive restructuring"],
        evidence: "Core CBT techniques with strong research support"
      },
      4: {
        keySkills: ["Present moment awareness", "Grounding techniques", "Mindful breathing"],
        techniques: ["5-4-3-2-1 grounding", "Mindful observation", "Body grounding"],
        evidence: "Mindfulness-based interventions for anxiety"
      },
      5: {
        keySkills: ["Facing fears gradually", "Activity scheduling", "Confidence building"],
        techniques: ["Exposure hierarchy", "Behavioral experiments", "Activity planning"],
        evidence: "Behavioral activation and exposure therapy principles"
      },
      6: {
        keySkills: ["Maintaining progress", "Relapse prevention", "Long-term planning"],
        techniques: ["Warning sign recognition", "Coping plan development", "Support planning"],
        evidence: "Relapse prevention model for sustained recovery"
      }
    };
    return details[weekNumber as keyof typeof details] || details[1];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CrisisBanner />
      <TabNavigation />
      
      <main className="flex-1 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">6-Week Anxiety Support Track</h1>
            <p className="text-lg text-muted-foreground mb-4">
              Evidence-based modules designed to help you manage anxiety while waiting for Waitlist Companion support
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-completion-rate">
                      {dashboard.completionRate || 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Timer className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-total-minutes">
                      {dashboard.totalMinutes || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Minutes</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/20">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-current-week">
                      Week {dashboard.currentWeek || 1}
                    </p>
                    <p className="text-xs text-muted-foreground">Current</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900/20">
                    <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {modules.filter((m: any) => m.completedAt).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Your Progress Journey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Overall Progress</span>
                      <span className="font-medium">{dashboard.completionRate || 0}% Complete</span>
                    </div>
                    <Progress value={dashboard.completionRate || 0} className="h-3" />
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                      {modules.slice(0, 6).map((module: any) => {
                        const IconComponent = getModuleIcon(module.weekNumber);
                        const isCompleted = module.completedAt;
                        const isInProgress = !module.isLocked && !isCompleted;
                        
                        return (
                          <div key={module.id} className="flex items-center gap-3 p-3 rounded-lg border">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              isCompleted ? "bg-green-100 dark:bg-green-900/20" :
                              isInProgress ? "bg-blue-100 dark:bg-blue-900/20" :
                              "bg-gray-100 dark:bg-gray-900/20"
                            )}>
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <IconComponent className={cn(
                                  "w-4 h-4",
                                  isInProgress ? "text-blue-600 dark:text-blue-400" : "text-gray-400"
                                )} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">Week {module.weekNumber}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {isCompleted ? "Complete" : isInProgress ? "In Progress" : "Locked"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Week Spotlight */}
              {modules.find((m: any) => !m.completedAt && !m.isLocked) && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="w-5 h-5 text-primary" />
                      Continue Your Journey
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const currentModule = modules.find((m: any) => !m.completedAt && !m.isLocked);
                      if (!currentModule) return null;
                      
                      const IconComponent = getModuleIcon(currentModule.weekNumber);
                      const details = getDetailedModuleInfo(currentModule.weekNumber);
                      
                      return (
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">Week {currentModule.weekNumber}: {currentModule.title}</h3>
                              <p className="text-muted-foreground mb-3">{currentModule.description}</p>
                              
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <h4 className="font-medium mb-2">Key Skills You'll Learn:</h4>
                                  <ul className="space-y-1 text-muted-foreground">
                                    {details.keySkills.map((skill, idx) => (
                                      <li key={idx} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                        {skill}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Techniques & Tools:</h4>
                                  <ul className="space-y-1 text-muted-foreground">
                                    {details.techniques.map((technique, idx) => (
                                      <li key={idx} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                                        {technique}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {currentModule.estimatedMinutes} minutes
                              </span>
                              <span className="flex items-center gap-1">
                                <List className="w-4 h-4" />
                                {currentModule.activitiesTotal} activities
                              </span>
                            </div>
                            <Link href={`/anxiety-track/module/${currentModule.weekNumber}`}>
                              <Button className="flex items-center gap-2" data-testid={`button-start-module-${currentModule.weekNumber}`}>
                                Start Module
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })()} 
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="modules" className="space-y-4">
              {/* Enhanced Module Cards */}
              {modules.map((module: any) => {
                const isCompleted = !!module.completedAt;
                const isLocked = module.isLocked === true;
                const isInProgress = !isLocked && !isCompleted;
                  const actualProgress = getActualProgress(module);
                const progressPercentage = module.estimatedMinutes > 0 ? 
                    Math.round((actualProgress.minutesCompleted / module.estimatedMinutes) * 100) : 0;
                  
                const IconComponent = getModuleIcon(module.weekNumber);
                const details = getDetailedModuleInfo(module.weekNumber);

                return (
                  <Card 
                    key={module.id}
                    className={cn(
                      "overflow-hidden transition-all hover:shadow-md",
                      getModuleColor(module.weekNumber, isCompleted, isInProgress, isLocked),
                      isInProgress && "ring-2 ring-primary/20"
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={cn(
                              "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0",
                              isCompleted ? "bg-green-500 text-white" :
                              isInProgress ? "bg-primary text-primary-foreground" :
                              "bg-muted text-muted-foreground"
                            )}>
                              {isCompleted ? (
                                <Check className="w-7 h-7" />
                              ) : isLocked ? (
                                <Lock className="w-7 h-7" />
                              ) : (
                                <IconComponent className="w-7 h-7" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-semibold text-card-foreground">
                                  Week {module.weekNumber}: {module.title}
                                </h3>
                                <Badge 
                                  variant={isCompleted ? "default" : isInProgress ? "secondary" : "outline"}
                                  className={cn(
                                    isCompleted && "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400",
                                    isInProgress && "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                                  )}
                                >
                                  {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Locked"}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground mb-4 leading-relaxed">{module.description}</p>
                              
                              {/* Module Stats */}
                              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {module.estimatedMinutes} min
                                </span>
                                <span className="flex items-center gap-1">
                                  <List className="w-4 h-4" />
                                  {module.activitiesTotal} activities
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="w-4 h-4" />
                                  {details.keySkills.length} skills
                                </span>
                              </div>
                              
                              {/* Progress Bar */}
                              {isInProgress && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{progressPercentage}%</span>
                                  </div>
                                  <Progress value={progressPercentage} className="h-2" />
                                  <p className="text-xs text-muted-foreground">
                                      {actualProgress.minutesCompleted} of {module.estimatedMinutes} minutes completed
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expandable Details */}
                        {!isLocked && (
                          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                            <div>
                              <h4 className="font-medium text-sm mb-2 text-muted-foreground uppercase tracking-wide">What You'll Learn</h4>
                              <ul className="space-y-1 text-sm">
                                {details.keySkills.slice(0, 3).map((skill, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                                    {skill}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-2 text-muted-foreground uppercase tracking-wide">Evidence Base</h4>
                              <p className="text-sm text-muted-foreground italic">{details.evidence}</p>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center gap-2">
                            {isCompleted && (
                              <Badge variant="outline" className="text-xs">
                                Completed {new Date(module.completedAt).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            {isCompleted && (
                              <Link href={`/anxiety-track/module/${module.weekNumber}`}>
                                <Button variant="outline" size="sm" data-testid={`button-review-module-${module.weekNumber}`}>
                                  Review Module
                                </Button>
                              </Link>
                            )}
                            
                            {isInProgress && (
                              <>
                                  {(() => {
                                    const actualProgress = getActualProgress(module);
                                    return actualProgress.activitiesCompleted >= module.activitiesTotal ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleCompleteModule(module)}
                                  disabled={updateModuleMutation.isPending}
                                  data-testid={`button-complete-module-${module.weekNumber}`}
                                >
                                  Mark Complete
                                </Button>
                                    ) : null;
                                  })()}
                                <Button 
                                  size="sm" 
                                  data-testid={`button-enter-module-${module.weekNumber}`}
                                  onClick={() => {
                                    // Require both login and payment for accessing modules
                                    if (!isAuthenticated) {
                                      setLocation('/login');
                                      return;
                                    }
                                    if (!(user as any)?.hasPaid) {
                                      setLocation('/pricing');
                                      return;
                                    }
                                    
                                    // If user has paid, allow access to module
                                    setLocation(`/anxiety-track/module/${module.weekNumber}`);
                                  }}
                                >
                                  {(() => {
                                    const actualProgress = getActualProgress(module);
                                    return actualProgress.activitiesCompleted >= module.activitiesTotal ? "Review Module" : "Enter Module";
                                  })()}
                                </Button>
                              </>
                            )}
                            
                            {isLocked && (
                              <Button size="sm" disabled>
                                <Lock className="w-4 h-4 mr-2" />
                                Locked
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              {/* Detailed Progress Analytics */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Weekly Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {modules.map((module: any) => {
                        const isCompleted = module.completedAt;
                          const actualProgress = getActualProgress(module);
                        const progressPercentage = module.estimatedMinutes > 0 ? 
                            Math.round((actualProgress.minutesCompleted / module.estimatedMinutes) * 100) : 0;
                        
                        return (
                          <div key={module.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Week {module.weekNumber}: {module.title}</span>
                              <span className={cn(
                                "font-medium",
                                isCompleted ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                              )}>
                                {isCompleted ? "100%" : `${progressPercentage}%`}
                              </span>
                            </div>
                            <Progress 
                              value={isCompleted ? 100 : progressPercentage} 
                              className={cn(
                                "h-2",
                                isCompleted && "[&>[role=progressbar]]:bg-green-500"
                              )} 
                            />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Timer className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Time Invested</p>
                          <p className="text-xs text-muted-foreground">{dashboard.totalMinutes || 0} minutes of learning</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900/20">
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Modules Completed</p>
                          <p className="text-xs text-muted-foreground">{modules.filter((m: any) => m.completedAt).length} of 6 modules</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900/20">
                          <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Current Streak</p>
                          <p className="text-xs text-muted-foreground">Building healthy habits</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
