import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { TabNavigation } from "@/components/ui/tab-navigation";
import { CrisisBanner } from "@/components/ui/crisis-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Play, Lock, Clock, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AnxietyTrack() {
  const mockUserId = "user-1";

  const { data: modulesData, isLoading } = useQuery({
    queryKey: ["/api/modules", mockUserId],
  });

  const { data: dashboardData } = useQuery({
    queryKey: ["/api/dashboard", mockUserId],
  });

  const updateModuleMutation = useMutation({
    mutationFn: async ({ moduleId, updates }: { moduleId: string; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/modules/${moduleId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules", mockUserId] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard", mockUserId] });
    },
  });

  const handleContinueModule = (module: any) => {
    // Simulate progress - in real app this would track actual activity completion
    const newMinutesCompleted = Math.min(
      module.minutesCompleted + 10, 
      module.estimatedMinutes
    );
    
    const updates: any = { minutesCompleted: newMinutesCompleted };
    
    if (newMinutesCompleted >= module.estimatedMinutes) {
      updates.completedAt = new Date();
      updates.activitiesCompleted = module.activitiesTotal;
      
      // Unlock next module
      const nextModule = modules?.find((m: any) => m.weekNumber === module.weekNumber + 1);
      if (nextModule) {
        updateModuleMutation.mutate({
          moduleId: nextModule.id,
          updates: { isLocked: false },
        });
      }
    }
    
    updateModuleMutation.mutate({
      moduleId: module.id,
      updates,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading modules...</div>
      </div>
    );
  }

  const modules = modulesData?.modules || [];
  const dashboard = dashboardData?.dashboardData || {};

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CrisisBanner />
      <TabNavigation />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">6-Week Anxiety Support Track</h2>
            <p className="text-muted-foreground">
              Evidence-based modules designed to help you manage anxiety while waiting for NHS support
            </p>
          </div>

          {/* Progress Banner */}
          <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-lg text-primary-foreground mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">You're making great progress!</h3>
                <p className="text-primary-foreground/80">
                  Week {dashboard.currentWeek || 1} of 6 • {dashboard.completionRate || 0}% complete
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" data-testid="text-total-minutes">
                  {dashboard.totalMinutes || 0}
                </p>
                <p className="text-sm text-primary-foreground/80">minutes completed</p>
              </div>
            </div>
          </div>

          {/* Weekly Modules */}
          <div className="space-y-4">
            {modules.map((module: any) => {
              const isCompleted = module.completedAt;
              const isInProgress = !module.isLocked && !isCompleted;
              const isLocked = module.isLocked;
              const progressPercentage = module.estimatedMinutes > 0 ? 
                Math.round((module.minutesCompleted / module.estimatedMinutes) * 100) : 0;

              return (
                <Card 
                  key={module.id}
                  className={cn(
                    "overflow-hidden",
                    isInProgress && "border-2 border-primary",
                    isLocked && "opacity-60"
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                          isCompleted && "bg-accent",
                          isInProgress && "bg-primary",
                          isLocked && "bg-muted"
                        )}>
                          {isCompleted ? (
                            <Check className="text-accent-foreground w-6 h-6" />
                          ) : isInProgress ? (
                            <Play className="text-primary-foreground w-6 h-6" />
                          ) : (
                            <Lock className="text-muted-foreground w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-card-foreground mb-2">
                            Week {module.weekNumber}: {module.title}
                          </h4>
                          <p className="text-muted-foreground mb-3">{module.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                            <span>
                              <Clock className="w-4 h-4 mr-1 inline" />
                              {module.estimatedMinutes} minutes
                            </span>
                            <span>
                              <List className="w-4 h-4 mr-1 inline" />
                              {module.activitiesTotal} activities
                            </span>
                            <span className={cn(
                              "font-medium",
                              isCompleted && "text-accent",
                              isInProgress && "text-primary",
                              isLocked && "text-muted-foreground"
                            )}>
                              {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Locked"}
                            </span>
                          </div>
                          
                          {isInProgress && (
                            <>
                              <Progress value={progressPercentage} className="mb-2" />
                              <p className="text-xs text-muted-foreground">
                                {module.minutesCompleted} of {module.estimatedMinutes} minutes completed
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {isCompleted && (
                        <Button 
                          variant="ghost"
                          data-testid={`button-review-module-${module.weekNumber}`}
                        >
                          Review
                        </Button>
                      )}
                      
                      {isInProgress && (
                        <Button 
                          onClick={() => handleContinueModule(module)}
                          disabled={updateModuleMutation.isPending}
                          data-testid={`button-continue-module-${module.weekNumber}`}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
