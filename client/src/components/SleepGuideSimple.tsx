import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Moon, Clock, Shield, CheckCircle, ArrowRight, Lightbulb } from "lucide-react";

export function SleepGuideSimple() {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const sections = [
    {
      id: 0,
      title: "Sleep & Anxiety Connection",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Sleep and anxiety have a complex relationship. Poor sleep can increase anxiety, 
            while anxiety can make it harder to fall asleep and stay asleep.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-2">How Anxiety Affects Sleep</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• Racing thoughts at bedtime</li>
                <li>• Difficulty falling asleep</li>
                <li>• Frequent night waking</li>
                <li>• Early morning awakening</li>
                <li>• Restless, unrefreshing sleep</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-semibold text-purple-800 mb-2">How Poor Sleep Increases Anxiety</h4>
              <ul className="text-purple-700 space-y-1">
                <li>• Reduces emotional regulation</li>
                <li>• Increases stress hormones</li>
                <li>• Impairs problem-solving</li>
                <li>• Heightens worry and fear</li>
                <li>• Decreases coping abilities</li>
              </ul>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <h4 className="font-semibold text-green-800 mb-2">The Good News</h4>
            <p className="text-green-700">
              Improving your sleep can significantly reduce anxiety levels, and managing anxiety 
              can lead to better sleep. Small changes can create a positive cycle.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Sleep Hygiene Basics",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Good sleep hygiene involves creating conditions that promote consistent, quality sleep.
          </p>
          <div className="space-y-6">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timing & Routine
              </h4>
              <ul className="text-indigo-700 space-y-2">
                <li>• Go to bed and wake up at the same time every day (even weekends)</li>
                <li>• Create a relaxing 30-60 minute bedtime routine</li>
                <li>• Avoid long daytime naps (especially after 3pm)</li>
                <li>• Get natural sunlight in the morning</li>
              </ul>
            </div>
            
            <div className="p-4 bg-teal-50 rounded-lg">
              <h4 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                <Moon className="w-5 h-5" />
                Sleep Environment
              </h4>
              <ul className="text-teal-700 space-y-2">
                <li>• Keep bedroom cool (60-67°F/15-19°C), dark, and quiet</li>
                <li>• Use comfortable mattress and pillows</li>
                <li>• Remove electronic devices or use blue light filters</li>
                <li>• Consider blackout curtains or eye mask</li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-3">What to Avoid</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-orange-700 mb-2">Before Bedtime</h5>
                  <ul className="text-orange-600 space-y-1">
                    <li>• Large meals (2-3 hours before)</li>
                    <li>• Caffeine (after 2pm)</li>
                    <li>• Alcohol (disrupts sleep quality)</li>
                    <li>• Intense exercise (3 hours before)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-orange-700 mb-2">In Bed</h5>
                  <ul className="text-orange-600 space-y-1">
                    <li>• Using phones or tablets</li>
                    <li>• Watching TV</li>
                    <li>• Working or studying</li>
                    <li>• Worrying or planning</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Relaxation Techniques",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            These techniques can help calm your mind and body before sleep, reducing anxiety and promoting rest.
          </p>
          <div className="space-y-6">
            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Progressive Muscle Relaxation</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <ol className="space-y-2">
                  <li>1. Lie down comfortably and close your eyes</li>
                  <li>2. Tense your toes for 5 seconds, then relax completely</li>
                  <li>3. Move up to calves, thighs, abdomen, arms, and face</li>
                  <li>4. Notice the contrast between tension and relaxation</li>
                  <li>5. End with whole-body relaxation for 2-3 minutes</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg text-green-800">4-7-8 Breathing for Sleep</CardTitle>
              </CardHeader>
              <CardContent className="text-green-700">
                <ol className="space-y-2">
                  <li>1. Exhale completely through your mouth</li>
                  <li>2. Inhale through nose for 4 counts</li>
                  <li>3. Hold your breath for 7 counts</li>
                  <li>4. Exhale through mouth for 8 counts</li>
                  <li>5. Repeat 3-4 times</li>
                </ol>
                <p className="mt-3 text-sm text-green-600">
                  This technique naturally calms the nervous system and promotes drowsiness.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50">
              <CardHeader>
                <CardTitle className="text-lg text-purple-800">Mindfulness Body Scan</CardTitle>
              </CardHeader>
              <CardContent className="text-purple-700">
                <ol className="space-y-2">
                  <li>1. Start by focusing on your breathing</li>
                  <li>2. Mentally scan from toes to head</li>
                  <li>3. Notice sensations without judgment</li>
                  <li>4. Breathe into areas of tension</li>
                  <li>5. Let go of the need to control</li>
                </ol>
              </CardContent>
            </Card>
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
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Moon className="w-8 h-8" />
            Sleep & Anxiety Guide
          </CardTitle>
          <p className="text-indigo-100 text-lg">
            Understand the connection between sleep and anxiety, and learn techniques for better rest
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
            <Shield className="w-5 h-5" />
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

      {/* Tips */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Pro Tips</h3>
              <ul className="text-yellow-700 space-y-1">
                <li>• Be patient - sleep improvements can take 2-4 weeks</li>
                <li>• If you can't sleep within 20 minutes, get up and do a quiet activity</li>
                <li>• Keep a sleep diary to identify patterns</li>
                <li>• Consider speaking with a healthcare provider if problems persist</li>
              </ul>
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
              Excellent work! You've completed the Sleep & Anxiety guide.
            </h3>
            <p className="text-green-700">
              Start implementing these techniques tonight. Remember, consistency is key for lasting improvements.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}