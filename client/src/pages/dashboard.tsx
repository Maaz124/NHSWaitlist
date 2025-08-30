import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { TabNavigation } from "@/components/ui/tab-navigation";
import { CrisisBanner } from "@/components/ui/crisis-banner";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Shield, TrendingUp, Clock, Bell, GraduationCap, FileText, Wind, Smile, BarChart3, Headphones } from "lucide-react";
import { Link } from "wouter";
import { generateProgressReport } from "@/lib/pdf-generator";

export default function Dashboard() {
  // For MVP, using a mock user ID - in production this would come from auth
  const mockUserId = "user-1";

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard", mockUserId],
  });

  const { data: modulesData } = useQuery({
    queryKey: ["/api/modules", mockUserId],
  });

  const { data: userData } = useQuery({
    queryKey: ["/api/users", mockUserId],
  });

  const handleExportReport = async () => {
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: mockUserId }),
      });
      
      if (!response.ok) throw new Error("Failed to generate report");
      
      const { report } = await response.json();
      const doc = generateProgressReport(report.reportData);
      doc.save("waitlist-companion-progress-report.pdf");
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  const dashboard = dashboardData?.dashboardData || {};
  const modules = modulesData?.modules || [];
  const user = { firstName: "James", lastName: "Smith", email: "james.smith@example.com" };

  const nextCheckInDate = new Date(dashboard.nextCheckInDue);
  const isCheckInDue = nextCheckInDate <= new Date();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <CrisisBanner />
      <TabNavigation />
      
      <main className="flex-1 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Welcome back, {user.firstName}
            </h2>
            <p className="text-muted-foreground">Here's your progress on your interim care journey</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-card-foreground">Current Week</h3>
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1" data-testid="text-current-week">
                  {dashboard.currentWeek || 1}
                </div>
                <p className="text-sm text-muted-foreground">of 6 weeks</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-card-foreground">Risk Level</h3>
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div className="text-3xl font-bold text-accent mb-1 capitalize" data-testid="text-risk-level">
                  {dashboard.riskLevel || "Unknown"}
                </div>
                <p className="text-sm text-muted-foreground">Last checked today</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-card-foreground">Completion</h3>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1" data-testid="text-completion-rate">
                  {dashboard.completionRate || 0}%
                </div>
                <p className="text-sm text-muted-foreground">Activities completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-card-foreground">Next Check-in</h3>
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-lg font-semibold text-foreground mb-1" data-testid="text-next-checkin">
                  {isCheckInDue ? "Due Now" : "Tomorrow"}
                </div>
                <p className="text-sm text-muted-foreground">Weekly assessment due</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 6-Week Progress */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-card-foreground mb-6">
                  6-Week Anxiety Support Progress
                </h3>
                
                <div className="flex items-center justify-center mb-6">
                  <ProgressRing percentage={dashboard.completionRate || 0} />
                </div>

                <div className="space-y-3">
                  {modules.map((module: any) => {
                    const isCompleted = module.completedAt;
                    const isInProgress = !module.isLocked && !isCompleted;
                    const progressPercentage = module.estimatedMinutes > 0 ? 
                      Math.round((module.minutesCompleted / module.estimatedMinutes) * 100) : 0;

                    return (
                      <div 
                        key={module.id}
                        className={cn(
                          "flex items-center p-3 rounded-md",
                          isCompleted && "bg-accent/10",
                          isInProgress && "bg-primary/10 border-l-4 border-primary",
                          module.isLocked && "bg-muted opacity-60"
                        )}
                      >
                        <div className="mr-3">
                          {isCompleted ? (
                            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-accent-foreground rounded-full" />
                            </div>
                          ) : isInProgress ? (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-muted-foreground rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-background rounded-full" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-card-foreground">
                            Week {module.weekNumber}: {module.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {isCompleted ? `Completed • ${module.minutesCompleted} min` :
                             isInProgress ? `In Progress • ${module.minutesCompleted}/${module.estimatedMinutes} min` :
                             `Locked • Complete week ${module.weekNumber - 1} first`}
                          </p>
                          {isInProgress && (
                            <div className="w-full bg-secondary rounded-full h-1 mt-2">
                              <div 
                                className="bg-primary h-1 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          )}
                        </div>
                        {(isCompleted || isInProgress) && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            data-testid={`button-${isCompleted ? 'review' : 'continue'}-module-${module.weekNumber}`}
                          >
                            {isCompleted ? "Review" : "Continue"}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities & Insights */}
            <div className="space-y-6">
              {/* Risk Assessment Summary */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">
                    Risk Assessment Summary
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-accent/10 rounded-md">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-accent rounded-full mr-3" />
                        <span className="text-sm font-medium text-card-foreground">Overall Wellbeing</span>
                      </div>
                      <span className="text-sm text-accent font-semibold">Good</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-primary rounded-full mr-3" />
                        <span className="text-sm font-medium text-card-foreground">Anxiety Level</span>
                      </div>
                      <span className="text-sm text-primary font-semibold capitalize">
                        {dashboard.riskLevel || "Unknown"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-muted-foreground rounded-full mr-3" />
                        <span className="text-sm font-medium text-card-foreground">Sleep Quality</span>
                      </div>
                      <span className="text-sm text-muted-foreground font-semibold">Fair</span>
                    </div>
                  </div>
                  
                  <Link href="/check-ins">
                    <Button 
                      className="w-full mt-4" 
                      data-testid="button-take-weekly-assessment"
                    >
                      Take Weekly Assessment
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">Quick Actions</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="secondary"
                      className="flex flex-col items-center p-4 h-auto"
                      data-testid="button-practice-breathing"
                    >
                      <Wind className="w-5 h-5 text-primary mb-2" />
                      <span className="text-sm font-medium">Practice Breathing</span>
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      className="flex flex-col items-center p-4 h-auto"
                      data-testid="button-log-mood"
                    >
                      <Smile className="w-5 h-5 text-primary mb-2" />
                      <span className="text-sm font-medium">Log Mood</span>
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      className="flex flex-col items-center p-4 h-auto"
                      data-testid="button-view-progress"
                    >
                      <BarChart3 className="w-5 h-5 text-primary mb-2" />
                      <span className="text-sm font-medium">View Progress</span>
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      className="flex flex-col items-center p-4 h-auto"
                      data-testid="button-contact-support"
                    >
                      <Headphones className="w-5 h-5 text-primary mb-2" />
                      <span className="text-sm font-medium">Get Support</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Upcoming & Reminders */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-card-foreground mb-6">Upcoming & Reminders</h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-primary/5 border-l-4 border-primary rounded-r-md">
                  <Bell className="w-5 h-5 text-primary mr-4" />
                  <div className="flex-1">
                    <p className="font-medium text-card-foreground">Weekly check-in reminder</p>
                    <p className="text-sm text-muted-foreground">
                      {isCheckInDue ? "Due now" : "Due tomorrow at 2:00 PM"}
                    </p>
                  </div>
                  <Link href="/check-ins">
                    <Button variant="ghost" size="sm" data-testid="button-complete-checkin">
                      Complete Now
                    </Button>
                  </Link>
                </div>
                
                <div className="flex items-center p-4 bg-accent/5 border-l-4 border-accent rounded-r-md">
                  <GraduationCap className="w-5 h-5 text-accent mr-4" />
                  <div className="flex-1">
                    <p className="font-medium text-card-foreground">Module 3: Cognitive Strategies</p>
                    <p className="text-sm text-muted-foreground">Continue where you left off</p>
                  </div>
                  <Link href="/anxiety-track">
                    <Button variant="ghost" size="sm" data-testid="button-continue-module">
                      Continue
                    </Button>
                  </Link>
                </div>
                
                <div className="flex items-center p-4 bg-secondary rounded-md">
                  <FileText className="w-5 h-5 text-muted-foreground mr-4" />
                  <div className="flex-1">
                    <p className="font-medium text-card-foreground">Export progress report</p>
                    <p className="text-sm text-muted-foreground">Ready for NHS handoff</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleExportReport}
                    data-testid="button-export-report"
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-card border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">© 2024 Waitlist Companion™</p>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-xs text-muted-foreground">Powered by rethink.org</p>
              <div className="text-xs text-muted-foreground">
                <Shield className="inline w-3 h-3 mr-1" />
                NHS Data Compliant
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
