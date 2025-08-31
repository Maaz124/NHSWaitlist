import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Brain, Shield, CheckCircle, ArrowRight } from "lucide-react";

export function AnxietyGuideSimple() {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const sections = [
    {
      id: 0,
      title: "What is Anxiety?",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Anxiety is your body's natural response to stress or perceived danger. It's completely normal and can actually be helpful in small doses.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800 mb-2">Key Point</h4>
            <p className="text-blue-700">
              Anxiety becomes a problem when it's persistent, excessive, or interferes with daily activities.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Normal Anxiety</h4>
              <ul className="text-green-700 space-y-1">
                <li>• Before a job interview</li>
                <li>• Taking an exam</li>
                <li>• Meeting new people</li>
                <li>• Making important decisions</li>
              </ul>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">When to Seek Help</h4>
              <ul className="text-amber-700 space-y-1">
                <li>• Daily worry for weeks</li>
                <li>• Avoiding normal activities</li>
                <li>• Physical symptoms persist</li>
                <li>• Sleep problems</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Common Symptoms",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Anxiety affects people differently, but there are common physical, emotional, and behavioral symptoms.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-red-800">Physical</CardTitle>
              </CardHeader>
              <CardContent className="text-red-700">
                <ul className="space-y-2">
                  <li>• Rapid heartbeat</li>
                  <li>• Sweating</li>
                  <li>• Trembling</li>
                  <li>• Shortness of breath</li>
                  <li>• Muscle tension</li>
                  <li>• Fatigue</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-800">Emotional</CardTitle>
              </CardHeader>
              <CardContent className="text-purple-700">
                <ul className="space-y-2">
                  <li>• Excessive worry</li>
                  <li>• Fear of losing control</li>
                  <li>• Feeling on edge</li>
                  <li>• Irritability</li>
                  <li>• Restlessness</li>
                  <li>• Difficulty concentrating</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-indigo-800">Behavioral</CardTitle>
              </CardHeader>
              <CardContent className="text-indigo-700">
                <ul className="space-y-2">
                  <li>• Avoiding situations</li>
                  <li>• Procrastination</li>
                  <li>• Seeking reassurance</li>
                  <li>• Checking behaviors</li>
                  <li>• Sleep problems</li>
                  <li>• Social withdrawal</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Coping Strategies",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Here are evidence-based techniques you can use to manage anxiety in the moment and long-term.
          </p>
          <div className="space-y-6">
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h4 className="font-semibold text-green-800 mb-3">Immediate Relief (In the Moment)</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-700 mb-2">4-7-8 Breathing</h5>
                  <p className="text-green-600 text-sm">Inhale for 4, hold for 7, exhale for 8 seconds</p>
                </div>
                <div>
                  <h5 className="font-medium text-green-700 mb-2">5-4-3-2-1 Grounding</h5>
                  <p className="text-green-600 text-sm">5 things you see, 4 hear, 3 touch, 2 smell, 1 taste</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-3">Long-term Management</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-blue-700 space-y-2">
                  <li>• Regular exercise (even 10 minutes helps)</li>
                  <li>• Consistent sleep schedule</li>
                  <li>• Limit caffeine and alcohol</li>
                  <li>• Practice mindfulness or meditation</li>
                </ul>
                <ul className="text-blue-700 space-y-2">
                  <li>• Connect with supportive people</li>
                  <li>• Challenge negative thoughts</li>
                  <li>• Set realistic goals</li>
                  <li>• Maintain regular routines</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const markSectionComplete = (sectionId: number) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  const progressPercentage = Math.round((completedSections.length / sections.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Brain className="w-8 h-8" />
            Understanding Anxiety
          </CardTitle>
          <p className="text-blue-100 text-lg">
            Learn about anxiety, recognize symptoms, and discover effective coping strategies
          </p>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Your Progress</h3>
            <Badge variant="secondary">{completedSections.length}/{sections.length} completed</Badge>
          </div>
          <Progress value={progressPercentage} className="mb-2" />
          <p className="text-sm text-muted-foreground">{progressPercentage}% complete</p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={currentSection === section.id ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentSection(section.id)}
            className="flex items-center gap-2"
          >
            {completedSections.includes(section.id) && <CheckCircle className="w-4 h-4" />}
            {section.title}
          </Button>
        ))}
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {sections[currentSection].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections[currentSection].content}
          
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => markSectionComplete(currentSection)}
                disabled={completedSections.includes(currentSection)}
              >
                {completedSections.includes(currentSection) ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  "Mark Complete"
                )}
              </Button>
              
              <Button
                onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                disabled={currentSection === sections.length - 1}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Message */}
      {completedSections.length === sections.length && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Congratulations! You've completed the Understanding Anxiety guide.
            </h3>
            <p className="text-green-700">
              You now have a solid foundation for understanding and managing anxiety. 
              Practice the techniques regularly for best results.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}