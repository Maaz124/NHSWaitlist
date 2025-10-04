import { useState } from "react";
import { Header } from "@/components/ui/header";
import { TabNavigation } from "@/components/ui/tab-navigation";
import { CrisisBanner } from "@/components/ui/crisis-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Gavel, GraduationCap, FileText, Check, Download, ArrowLeft } from "lucide-react";
import { generateProgressReport } from "@/lib/pdf-generator";
import { Footer } from "@/components/ui/footer";
import { BreathingExercise } from "@/components/BreathingExercise";
import { ThoughtRecord } from "@/components/ThoughtRecord";
import { GroundingExercises } from "@/components/GroundingExercises";
import { MoodTracker } from "@/components/MoodTracker";
import { RelaxationTools } from "@/components/RelaxationTools";
import { AnxietyGuideComprehensive } from "@/components/AnxietyGuideComprehensive";
import { SleepGuideComprehensive } from "@/components/SleepGuideComprehensive";
import { LifestyleGuideComprehensive } from "@/components/LifestyleGuideComprehensive";
import { useUser } from "@/contexts/UserContext";

export default function Resources() {
  const { user } = useUser();
  const [activeToolView, setActiveToolView] = useState<string | null>(null);
  

  const handleExportReport = async () => {
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });
      
      if (!response.ok) throw new Error("Failed to generate report");
      
      const { report } = await response.json();
      const doc = generateProgressReport(report.reportData);
      doc.save("waitlist-companion-progress-report.pdf");
    } catch (error) {
      alert("Error generating report. Please try again.");
    }
  };

  const renderToolView = () => {
    switch (activeToolView) {
      case 'breathing':
        return <BreathingExercise />;
      case 'thought-record':
        return <ThoughtRecord />;
      case 'grounding':
        return <GroundingExercises />;
      case 'mood-tracker':
        return <MoodTracker />;
      case 'relaxation':
        return <RelaxationTools />;
      case 'anxiety-guide':
        return <AnxietyGuideComprehensive />;
      case 'sleep-anxiety':
        return <SleepGuideComprehensive />;
      case 'lifestyle-guide':
        return <LifestyleGuideComprehensive />;
      default:
        return null;
    }
  };

  if (activeToolView) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <CrisisBanner />
        <TabNavigation />
        
        <main className="flex-1 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => setActiveToolView(null)}
                className="mb-4 gap-2"
                data-testid="button-back-to-resources"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Resources
              </Button>
            </div>
            {renderToolView()}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CrisisBanner />
      <TabNavigation />
      
      <main className="flex-1 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Support Resources</h2>
            <p className="text-muted-foreground">Interactive tools and information to support your mental health journey</p>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-destructive/10 border border-destructive p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-destructive mb-4">
              <AlertTriangle className="w-5 h-5 mr-2 inline" />
              Emergency Support
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-semibold text-destructive mb-1">Emergency Services</p>
                <p className="text-lg font-bold text-destructive">999</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-destructive mb-1">Samaritans</p>
                <p className="text-lg font-bold text-destructive">116 123</p>
                <p className="text-xs text-destructive/80">Free, 24/7</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-destructive mb-1">Crisis Text Line</p>
                <p className="text-lg font-bold text-destructive">Text SHOUT to 85258</p>
                <p className="text-xs text-destructive/80">Free, 24/7</p>
              </div>
            </div>
          </div>

          {/* Resource Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Self-Help Tools */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gavel className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">Self-Help Tools</h3>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    variant="secondary" 
                    className="w-full justify-start p-3 h-auto"
                    onClick={() => setActiveToolView('breathing')}
                    data-testid="button-breathing-exercise"
                  >
                    <div className="text-left">
                      <p className="font-medium">Breathing Exercises</p>
                      <p className="text-sm text-muted-foreground">5 interactive techniques with timer</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full justify-start p-3 h-auto"
                    onClick={() => setActiveToolView('thought-record')}
                    data-testid="button-thought-record"
                  >
                    <div className="text-left">
                      <p className="font-medium">Thought Record</p>
                      <p className="text-sm text-muted-foreground">CBT-based thought challenging</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full justify-start p-3 h-auto"
                    onClick={() => setActiveToolView('grounding')}
                    data-testid="button-grounding-exercises"
                  >
                    <div className="text-left">
                      <p className="font-medium">Grounding Exercises</p>
                      <p className="text-sm text-muted-foreground">5-4-3-2-1 & mindfulness tools</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full justify-start p-3 h-auto"
                    onClick={() => setActiveToolView('mood-tracker')}
                    data-testid="button-mood-tracker"
                  >
                    <div className="text-left">
                      <p className="font-medium">Mood Tracker</p>
                      <p className="text-sm text-muted-foreground">Daily wellbeing & pattern insights</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full justify-start p-3 h-auto"
                    onClick={() => setActiveToolView('relaxation')}
                    data-testid="button-relaxation-tools"
                  >
                    <div className="text-left">
                      <p className="font-medium">Relaxation Tools</p>
                      <p className="text-sm text-muted-foreground">Progressive muscle & visualization</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">Educational Content</h3>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    variant="secondary" 
                    className="w-full justify-start p-3 h-auto"
                    onClick={() => setActiveToolView('anxiety-guide')}
                    data-testid="button-understanding-anxiety"
                  >
                    <div className="text-left">
                      <p className="font-medium">Understanding Anxiety</p>
                      <p className="text-sm text-muted-foreground">NHS-approved interactive guide with quizzes</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full justify-start p-3 h-auto"
                    onClick={() => setActiveToolView('sleep-anxiety')}
                    data-testid="button-sleep-anxiety"
                  >
                    <div className="text-left">
                      <p className="font-medium">Sleep & Anxiety</p>
                      <p className="text-sm text-muted-foreground">Evidence-based tips with personal assessment</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full justify-start p-3 h-auto"
                    onClick={() => setActiveToolView('lifestyle-guide')}
                    data-testid="button-lifestyle-factors"
                  >
                    <div className="text-left">
                      <p className="font-medium">Lifestyle Factors</p>
                      <p className="text-sm text-muted-foreground">Diet, exercise & wellbeing with action plan</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Handoff */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">Clinical Handoff</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-accent/10 rounded-md">
                    <p className="text-sm text-accent font-medium mb-2">
                      <Check className="w-4 h-4 mr-2 inline" />
                      Report Ready
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your progress data is ready for NHS handoff when your appointment becomes available.
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleExportReport}
                    data-testid="button-download-progress-report"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Progress Report (PDF)
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Report includes assessment scores, module completion, and clinical recommendations
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
