import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Activity, Utensils, Users, CheckCircle, ArrowRight, Target } from "lucide-react";

export function LifestyleGuideSimple() {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const sections = [
    {
      id: 0,
      title: "Exercise & Movement",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Regular physical activity is one of the most effective natural treatments for anxiety. 
            It doesn't have to be intense - even gentle movement helps.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h4 className="font-semibold text-green-800 mb-2">How Exercise Helps Anxiety</h4>
              <ul className="text-green-700 space-y-1">
                <li>• Releases endorphins (natural mood lifters)</li>
                <li>• Reduces stress hormones like cortisol</li>
                <li>• Improves sleep quality</li>
                <li>• Provides healthy distraction</li>
                <li>• Builds confidence and self-esteem</li>
                <li>• Regulates breathing and heart rate</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-2">Getting Started</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• Start with just 5-10 minutes daily</li>
                <li>• Choose activities you enjoy</li>
                <li>• Walking counts as exercise</li>
                <li>• Build up gradually</li>
                <li>• Consistency matters more than intensity</li>
                <li>• Listen to your body</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Exercise Options by Intensity</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-800">Gentle</CardTitle>
                  <p className="text-sm text-green-600">Perfect for beginners or anxious days</p>
                </CardHeader>
                <CardContent className="text-green-700">
                  <ul className="space-y-1">
                    <li>• Walking in nature</li>
                    <li>• Gentle yoga</li>
                    <li>• Stretching</li>
                    <li>• Tai chi</li>
                    <li>• Light gardening</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-800">Moderate</CardTitle>
                  <p className="text-sm text-blue-600">Build up to this level</p>
                </CardHeader>
                <CardContent className="text-blue-700">
                  <ul className="space-y-1">
                    <li>• Brisk walking</li>
                    <li>• Swimming</li>
                    <li>• Cycling</li>
                    <li>• Dancing</li>
                    <li>• Strength training</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-800">Vigorous</CardTitle>
                  <p className="text-sm text-purple-600">For experienced exercisers</p>
                </CardHeader>
                <CardContent className="text-purple-700">
                  <ul className="space-y-1">
                    <li>• Running</li>
                    <li>• High-intensity intervals</li>
                    <li>• Competitive sports</li>
                    <li>• Rock climbing</li>
                    <li>• Martial arts</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Nutrition & Anxiety",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            What you eat can significantly impact your anxiety levels. Some foods help calm the mind, 
            while others can increase anxiety symptoms.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Anxiety-Calming Foods
              </h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-green-700 mb-1">Complex Carbohydrates</h5>
                  <p className="text-green-600 text-sm mb-1">Boost serotonin production</p>
                  <p className="text-green-600 text-sm">Oats, quinoa, sweet potatoes, brown rice</p>
                </div>
                <div>
                  <h5 className="font-medium text-green-700 mb-1">Omega-3 Rich Foods</h5>
                  <p className="text-green-600 text-sm mb-1">Reduce inflammation and stress</p>
                  <p className="text-green-600 text-sm">Salmon, walnuts, chia seeds, flaxseed</p>
                </div>
                <div>
                  <h5 className="font-medium text-green-700 mb-1">Magnesium Sources</h5>
                  <p className="text-green-600 text-sm mb-1">Natural muscle relaxant</p>
                  <p className="text-green-600 text-sm">Dark leafy greens, almonds, avocado</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
              <h4 className="font-semibold text-red-800 mb-3">Foods to Limit</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-red-700 mb-1">Caffeine</h5>
                  <p className="text-red-600 text-sm">Can trigger anxiety and panic attacks</p>
                </div>
                <div>
                  <h5 className="font-medium text-red-700 mb-1">Sugar & Refined Carbs</h5>
                  <p className="text-red-600 text-sm">Cause blood sugar spikes and crashes</p>
                </div>
                <div>
                  <h5 className="font-medium text-red-700 mb-1">Alcohol</h5>
                  <p className="text-red-600 text-sm">Disrupts sleep and can worsen anxiety</p>
                </div>
                <div>
                  <h5 className="font-medium text-red-700 mb-1">Processed Foods</h5>
                  <p className="text-red-600 text-sm">High in additives and preservatives</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3">Practical Tips</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="text-blue-700 space-y-2">
                <li>• Eat regular, balanced meals</li>
                <li>• Stay hydrated throughout the day</li>
                <li>• Don't skip breakfast</li>
                <li>• Limit caffeine after 2 PM</li>
              </ul>
              <ul className="text-blue-700 space-y-2">
                <li>• Keep healthy snacks on hand</li>
                <li>• Practice mindful eating</li>
                <li>• Read food labels carefully</li>
                <li>• Consider a food mood diary</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Social Connection & Support",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Strong social connections are crucial for mental health. They provide emotional support, 
            reduce isolation, and help put problems in perspective.
          </p>
          
          <div className="space-y-6">
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Why Social Support Matters
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-purple-700 space-y-2">
                  <li>• Reduces stress and anxiety levels</li>
                  <li>• Provides different perspectives</li>
                  <li>• Offers emotional validation</li>
                  <li>• Creates sense of belonging</li>
                </ul>
                <ul className="text-purple-700 space-y-2">
                  <li>• Encourages healthy behaviors</li>
                  <li>• Provides practical help</li>
                  <li>• Improves self-esteem</li>
                  <li>• Reduces feelings of isolation</li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800">Building Your Support Network</CardTitle>
                </CardHeader>
                <CardContent className="text-green-700">
                  <ul className="space-y-2">
                    <li>• Nurture existing relationships</li>
                    <li>• Join clubs or groups with shared interests</li>
                    <li>• Volunteer for causes you care about</li>
                    <li>• Take classes or workshops</li>
                    <li>• Use technology to stay connected</li>
                    <li>• Be open to new friendships</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-800">Communication Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-orange-700">
                  <ul className="space-y-2">
                    <li>• Be honest about your struggles</li>
                    <li>• Ask for specific help when needed</li>
                    <li>• Listen actively to others</li>
                    <li>• Express gratitude regularly</li>
                    <li>• Set healthy boundaries</li>
                    <li>• Practice empathy and understanding</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-800 mb-3">Professional Support Options</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-yellow-700 mb-2">Therapy</h5>
                  <ul className="text-yellow-600 text-sm space-y-1">
                    <li>• Cognitive Behavioral Therapy (CBT)</li>
                    <li>• Counselling</li>
                    <li>• Group therapy</li>
                    <li>• Online therapy</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-yellow-700 mb-2">Health Services</h5>
                  <ul className="text-yellow-600 text-sm space-y-1">
                    <li>• GP consultation</li>
                    <li>• IAPT services</li>
                    <li>• Mental health teams</li>
                    <li>• Crisis support</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-yellow-700 mb-2">Support Groups</h5>
                  <ul className="text-yellow-600 text-sm space-y-1">
                    <li>• Anxiety UK</li>
                    <li>• Mind local groups</li>
                    <li>• Online communities</li>
                    <li>• Peer support groups</li>
                  </ul>
                </div>
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
      <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Heart className="w-8 h-8" />
            Lifestyle & Wellbeing Guide
          </CardTitle>
          <p className="text-green-100 text-lg">
            Discover how exercise, nutrition, and social connections can help manage anxiety
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
            <Target className="w-5 h-5" />
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
              Outstanding! You've completed the Lifestyle & Wellbeing guide.
            </h3>
            <p className="text-green-700">
              You now have a comprehensive toolkit for supporting your mental health through lifestyle changes. 
              Remember, small consistent changes lead to big improvements over time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}