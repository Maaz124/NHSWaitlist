import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { TabNavigation } from "@/components/ui/tab-navigation";
import { CrisisBanner } from "@/components/ui/crisis-banner";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Shield, TrendingUp, Clock, Bell, GraduationCap, FileText, Wind, Smile, BarChart3, Headphones, Phone, MessageCircle, ExternalLink } from "lucide-react";
import { Link, useLocation } from "wouter";
import { generateProgressReport } from "@/lib/pdf-generator";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  // For MVP, using a mock user ID - in production this would come from auth
  const mockUserId = "user-1";
  const [, setLocation] = useLocation();
  
  // Quick action states
  const [breathingDialogOpen, setBreathingDialogOpen] = useState(false);
  const [moodDialogOpen, setMoodDialogOpen] = useState(false);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  
  // Mood logging state
  const [currentMood, setCurrentMood] = useState(5);
  const [anxietyLevel, setAnxietyLevel] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [moodNote, setMoodNote] = useState("");

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
      alert("Error generating report. Please try again.");
    }
  };

  const handleLogMood = () => {
    // In a real app, this would save to the database
    const moodData = { 
      mood: currentMood, 
      anxiety: anxietyLevel, 
      energy: energyLevel, 
      note: moodNote,
      timestamp: new Date().toISOString()
    };
    
    // Reset form and close dialog
    setCurrentMood(5);
    setAnxietyLevel(5);
    setEnergyLevel(5);
    setMoodNote("");
    setMoodDialogOpen(false);
    
    // Show success feedback (in real app, use toast)
    alert("Mood logged successfully!");
  };

  const handleBreathingExercise = () => {
    setBreathingDialogOpen(false);
    setLocation("/resources");
    // In a real implementation, we'd navigate to the breathing exercises directly
    setTimeout(() => {
      // Simulate clicking the breathing exercise button
      const breathingButton = document.querySelector('[data-testid="button-breathing-exercise"]');
      if (breathingButton) {
        (breathingButton as HTMLElement).click();
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  const dashboard = (dashboardData as any)?.dashboardData || {};
  const modules = (modulesData as any)?.modules || [];
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
                    {/* Breathing Exercise Quick Action */}
                    <Dialog open={breathingDialogOpen} onOpenChange={setBreathingDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="secondary"
                          className="flex flex-col items-center p-4 h-auto"
                          data-testid="button-practice-breathing"
                        >
                          <Wind className="w-5 h-5 text-primary mb-2" />
                          <span className="text-sm font-medium">Practice Breathing</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Wind className="w-5 h-5 text-primary" />
                            Quick Breathing Exercise
                          </DialogTitle>
                          <DialogDescription>
                            Choose a breathing technique to help you relax and reduce anxiety.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <Button 
                              onClick={handleBreathingExercise}
                              className="w-full justify-start p-4 h-auto"
                            >
                              <div className="text-left">
                                <p className="font-medium">4-7-8 Breathing</p>
                                <p className="text-sm opacity-80">Great for quick anxiety relief</p>
                              </div>
                            </Button>
                            <Button 
                              onClick={handleBreathingExercise}
                              variant="outline"
                              className="w-full justify-start p-4 h-auto"
                            >
                              <div className="text-left">
                                <p className="font-medium">Box Breathing</p>
                                <p className="text-sm opacity-80">4-4-4-4 pattern for focus</p>
                              </div>
                            </Button>
                            <Button 
                              onClick={handleBreathingExercise}
                              variant="outline"
                              className="w-full justify-start p-4 h-auto"
                            >
                              <div className="text-left">
                                <p className="font-medium">View All Exercises</p>
                                <p className="text-sm opacity-80">Access full breathing toolkit</p>
                              </div>
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {/* Mood Logging Quick Action */}
                    <Dialog open={moodDialogOpen} onOpenChange={setMoodDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="secondary"
                          className="flex flex-col items-center p-4 h-auto"
                          data-testid="button-log-mood"
                        >
                          <Smile className="w-5 h-5 text-primary mb-2" />
                          <span className="text-sm font-medium">Log Mood</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Smile className="w-5 h-5 text-primary" />
                            Quick Mood Check-In
                          </DialogTitle>
                          <DialogDescription>
                            Log your current mood and anxiety levels for tracking your wellbeing.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div>
                            <Label className="text-sm font-medium">Overall Mood (1 = Very Low, 10 = Very High)</Label>
                            <div className="mt-2">
                              <Slider
                                value={[currentMood]}
                                onValueChange={(value) => setCurrentMood(value[0])}
                                max={10}
                                min={1}
                                step={1}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>Very Low</span>
                                <span className="font-medium">{currentMood}/10</span>
                                <span>Very High</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Anxiety Level (1 = Very Calm, 10 = Very Anxious)</Label>
                            <div className="mt-2">
                              <Slider
                                value={[anxietyLevel]}
                                onValueChange={(value) => setAnxietyLevel(value[0])}
                                max={10}
                                min={1}
                                step={1}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>Very Calm</span>
                                <span className="font-medium">{anxietyLevel}/10</span>
                                <span>Very Anxious</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Energy Level (1 = Very Tired, 10 = Very Energetic)</Label>
                            <div className="mt-2">
                              <Slider
                                value={[energyLevel]}
                                onValueChange={(value) => setEnergyLevel(value[0])}
                                max={10}
                                min={1}
                                step={1}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>Very Tired</span>
                                <span className="font-medium">{energyLevel}/10</span>
                                <span>Very Energetic</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Notes (Optional)</Label>
                            <Textarea
                              placeholder="How are you feeling today? Any particular thoughts or events affecting your mood?"
                              value={moodNote}
                              onChange={(e) => setMoodNote(e.target.value)}
                              className="mt-2"
                            />
                          </div>

                          <div className="flex gap-3">
                            <Button onClick={handleLogMood} className="flex-1">
                              Log Mood
                            </Button>
                            <Button variant="outline" onClick={() => setMoodDialogOpen(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {/* Progress View Quick Action */}
                    <Dialog open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="secondary"
                          className="flex flex-col items-center p-4 h-auto"
                          data-testid="button-view-progress"
                        >
                          <BarChart3 className="w-5 h-5 text-primary mb-2" />
                          <span className="text-sm font-medium">View Progress</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Quick Progress Overview
                          </DialogTitle>
                          <DialogDescription>
                            View your current progress through the anxiety support program.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-primary/5 rounded-lg">
                              <div className="text-2xl font-bold text-primary">{dashboard.currentWeek || 1}</div>
                              <p className="text-sm text-muted-foreground">Current Week</p>
                            </div>
                            <div className="text-center p-4 bg-accent/5 rounded-lg">
                              <div className="text-2xl font-bold text-accent">
                                {modules.filter((m: any) => m.completed).length}/{modules.length}
                              </div>
                              <p className="text-sm text-muted-foreground">Modules Complete</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
                              <span className="text-sm font-medium">Program Progress</span>
                              <Badge variant="outline">
                                {Math.round((modules.filter((m: any) => m.completed).length / modules.length) * 100)}%
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
                              <span className="text-sm font-medium">Risk Level</span>
                              <Badge variant={dashboard.riskLevel === 'low' ? 'default' : 'secondary'}>
                                {dashboard.riskLevel || 'Unknown'}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
                              <span className="text-sm font-medium">Check-ins Completed</span>
                              <Badge variant="outline">
                                {dashboard.completedCheckIns || 0}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Link href="/anxiety-track">
                              <Button className="w-full" onClick={() => setProgressDialogOpen(false)}>
                                View Detailed Progress
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                setProgressDialogOpen(false);
                                handleExportReport();
                              }}
                            >
                              Download Progress Report
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {/* Support Contact Quick Action */}
                    <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="secondary"
                          className="flex flex-col items-center p-4 h-auto"
                          data-testid="button-contact-support"
                        >
                          <Headphones className="w-5 h-5 text-primary mb-2" />
                          <span className="text-sm font-medium">Get Support</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Headphones className="w-5 h-5 text-primary" />
                            Get Support Now
                          </DialogTitle>
                          <DialogDescription>
                            Access immediate support and emergency contacts when you need help.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-muted-foreground">Get immediate support or access additional resources.</p>
                          
                          {/* Emergency Contacts */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-destructive">Emergency Support</h4>
                            <div className="space-y-2">
                              <Button 
                                variant="destructive"
                                className="w-full justify-start"
                                onClick={() => window.open('tel:999')}
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Emergency Services: 999
                              </Button>
                              <Button 
                                variant="outline"
                                className="w-full justify-start border-destructive text-destructive hover:bg-destructive/10"
                                onClick={() => window.open('tel:116123')}
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Samaritans: 116 123
                              </Button>
                              <Button 
                                variant="outline"
                                className="w-full justify-start border-destructive text-destructive hover:bg-destructive/10"
                                onClick={() => window.open('sms:85258?body=SHOUT')}
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Text SHOUT to 85258
                              </Button>
                            </div>
                          </div>

                          {/* Regular Support */}
                          <div className="space-y-3">
                            <h4 className="font-medium">Additional Support</h4>
                            <div className="space-y-2">
                              <Button 
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => window.open('https://www.nhs.uk/every-mind-matters/', '_blank')}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                NHS Every Mind Matters
                              </Button>
                              <Link href="/resources">
                                <Button 
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => setSupportDialogOpen(false)}
                                >
                                  <GraduationCap className="w-4 h-4 mr-2" />
                                  Self-Help Resources
                                </Button>
                              </Link>
                              <Link href="/check-ins">
                                <Button 
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => setSupportDialogOpen(false)}
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  Risk Assessment
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
