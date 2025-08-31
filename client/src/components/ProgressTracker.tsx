import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  Star, 
  Target, 
  Heart, 
  Brain, 
  Users,
  Briefcase,
  Home,
  CheckCircle,
  Download,
  BarChart
} from "lucide-react";

interface WeeklyRating {
  week: number;
  helpfulness: number;
  keyTakeaway: string;
  mostHelpfulTechnique: string;
  improvementArea: string;
}

interface BeforeAfterRating {
  category: string;
  icon: any;
  before: number;
  after: number;
  changes: string;
}

interface ReadinessRating {
  area: string;
  rating: number;
  confidence: string;
}

interface SuccessStory {
  title: string;
  situation: string;
  skillsUsed: string[];
  outcome: string;
  learnings: string;
}

export function ProgressTracker() {
  const [weeklyRatings, setWeeklyRatings] = useState<WeeklyRating[]>([
    { week: 1, helpfulness: 5, keyTakeaway: "", mostHelpfulTechnique: "", improvementArea: "" },
    { week: 2, helpfulness: 5, keyTakeaway: "", mostHelpfulTechnique: "", improvementArea: "" },
    { week: 3, helpfulness: 5, keyTakeaway: "", mostHelpfulTechnique: "", improvementArea: "" },
    { week: 4, helpfulness: 5, keyTakeaway: "", mostHelpfulTechnique: "", improvementArea: "" },
    { week: 5, helpfulness: 5, keyTakeaway: "", mostHelpfulTechnique: "", improvementArea: "" }
  ]);

  const [beforeAfterRatings, setBeforeAfterRatings] = useState<BeforeAfterRating[]>([
    { category: "Anxiety Management", icon: Brain, before: 3, after: 7, changes: "" },
    { category: "Daily Functioning", icon: Home, before: 4, after: 8, changes: "" },
    { category: "Confidence", icon: Star, before: 3, after: 7, changes: "" },
    { category: "Relationships", icon: Users, before: 5, after: 8, changes: "" },
    { category: "Work/School Performance", icon: Briefcase, before: 4, after: 7, changes: "" },
    { category: "Overall Quality of Life", icon: Heart, before: 4, after: 8, changes: "" }
  ]);

  const [readinessRatings, setReadinessRatings] = useState<ReadinessRating[]>([
    { area: "Using anxiety management tools independently", rating: 7, confidence: "" },
    { area: "Handling setbacks without professional support", rating: 6, confidence: "" },
    { area: "Maintaining progress during stressful periods", rating: 6, confidence: "" },
    { area: "Transitioning to NHS mental health services", rating: 8, confidence: "" },
    { area: "Continuing your anxiety management journey", rating: 8, confidence: "" }
  ]);

  const [currentChallenges, setCurrentChallenges] = useState({
    symptoms: "",
    situations: "",
    strategies: "",
    continueWorking: "",
    additionalSupport: ""
  });

  const [keyInsights, setKeyInsights] = useState({
    mostImportant: "",
    adviceToOthers: "",
    motivation: "",
    futureGrowth: "",
    proudestAchievement: "",
    rememberApply: ""
  });

  const [successStories, setSuccessStories] = useState<SuccessStory[]>([
    { title: "", situation: "", skillsUsed: [], outcome: "", learnings: "" },
    { title: "", situation: "", skillsUsed: [], outcome: "", learnings: "" },
    { title: "", situation: "", skillsUsed: [], outcome: "", learnings: "" }
  ]);

  const [reflectionAnswers, setReflectionAnswers] = useState<string[]>(
    new Array(6).fill("")
  );

  const weekTopics = [
    { week: 1, title: "Understanding Anxiety", color: "bg-blue-100 text-blue-800" },
    { week: 2, title: "Breathing & Relaxation", color: "bg-green-100 text-green-800" },
    { week: 3, title: "Cognitive Strategies", color: "bg-purple-100 text-purple-800" },
    { week: 4, title: "Mindfulness & Grounding", color: "bg-orange-100 text-orange-800" },
    { week: 5, title: "Behavioral Activation", color: "bg-pink-100 text-pink-800" }
  ];

  const updateWeeklyRating = (weekIndex: number, field: keyof WeeklyRating, value: any) => {
    setWeeklyRatings(prev => prev.map((rating, index) => 
      index === weekIndex ? { ...rating, [field]: value } : rating
    ));
  };

  const updateBeforeAfterRating = (categoryIndex: number, field: 'before' | 'after' | 'changes', value: any) => {
    setBeforeAfterRatings(prev => prev.map((rating, index) => 
      index === categoryIndex ? { ...rating, [field]: value } : rating
    ));
  };

  const updateReadinessRating = (areaIndex: number, field: 'rating' | 'confidence', value: any) => {
    setReadinessRatings(prev => prev.map((rating, index) => 
      index === areaIndex ? { ...rating, [field]: value } : rating
    ));
  };

  const updateSuccessStory = (storyIndex: number, field: keyof SuccessStory, value: any) => {
    setSuccessStories(prev => prev.map((story, index) => 
      index === storyIndex ? { ...story, [field]: value } : story
    ));
  };

  const addSkillToStory = (storyIndex: number, skill: string) => {
    if (skill.trim()) {
      setSuccessStories(prev => prev.map((story, index) => 
        index === storyIndex ? { 
          ...story, 
          skillsUsed: [...story.skillsUsed, skill.trim()] 
        } : story
      ));
    }
  };

  const removeSkillFromStory = (storyIndex: number, skillIndex: number) => {
    setSuccessStories(prev => prev.map((story, index) => 
      index === storyIndex ? { 
        ...story, 
        skillsUsed: story.skillsUsed.filter((_, idx) => idx !== skillIndex) 
      } : story
    ));
  };

  const calculateOverallProgress = () => {
    const avgWeeklyRating = weeklyRatings.reduce((sum, rating) => sum + rating.helpfulness, 0) / weeklyRatings.length;
    const avgImprovement = beforeAfterRatings.reduce((sum, rating) => sum + (rating.after - rating.before), 0) / beforeAfterRatings.length;
    const avgReadiness = readinessRatings.reduce((sum, rating) => sum + rating.rating, 0) / readinessRatings.length;
    
    return Math.round(((avgWeeklyRating + avgImprovement + avgReadiness) / 3) * 10);
  };

  const exportProgress = () => {
    const progressData = {
      weeklyRatings,
      beforeAfterRatings,
      readinessRatings,
      currentChallenges,
      keyInsights,
      successStories,
      reflectionAnswers,
      overallProgress: calculateOverallProgress(),
      completedDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `anxiety-program-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reflectionPrompts = [
    "What is the biggest change you've made during this program?",
    "Which week was most helpful and why?",
    "What advice would you give to someone starting this journey?",
    "How do you want to continue growing after this program ends?",
    "What are you most proud of achieving in these 6 weeks?",
    "How will you remember and apply what you've learned?"
  ];

  return (
    <div className="space-y-8">
      {/* Overall Progress Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Your 6-Week Progress Assessment</CardTitle>
              <p className="text-muted-foreground">Comprehensive review of your anxiety management journey</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Progress Score</span>
                <span className="text-2xl font-bold text-blue-600">{calculateOverallProgress()}%</span>
              </div>
              <Progress value={calculateOverallProgress()} className="h-3" />
            </div>
            <Button onClick={exportProgress} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Progress
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Part 1: Weekly Skills Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Part 1: Weekly Skills Learning Assessment
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Rate how helpful each week was and identify your key takeaways
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {weeklyRatings.map((rating, index) => {
            const weekTopic = weekTopics[index];
            return (
              <Card key={rating.week} className="border-l-4 border-l-blue-400">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Badge className={weekTopic.color}>
                      Week {rating.week}
                    </Badge>
                    <h4 className="font-semibold">{weekTopic.title}</h4>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Helpfulness Rating: {rating.helpfulness}/10
                    </Label>
                    <Slider
                      value={[rating.helpfulness]}
                      onValueChange={(value) => updateWeeklyRating(index, 'helpfulness', value[0])}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                      data-testid={`slider-week-${rating.week}-helpfulness`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`week-${rating.week}-takeaway`}>Most Valuable Insight</Label>
                      <Textarea
                        id={`week-${rating.week}-takeaway`}
                        placeholder="What was your biggest insight from this week?"
                        value={rating.keyTakeaway}
                        onChange={(e) => updateWeeklyRating(index, 'keyTakeaway', e.target.value)}
                        className="mt-1"
                        data-testid={`textarea-week-${rating.week}-takeaway`}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`week-${rating.week}-technique`}>Most Helpful Technique</Label>
                      <Textarea
                        id={`week-${rating.week}-technique`}
                        placeholder="Which specific technique works best for you?"
                        value={rating.mostHelpfulTechnique}
                        onChange={(e) => updateWeeklyRating(index, 'mostHelpfulTechnique', e.target.value)}
                        className="mt-1"
                        data-testid={`textarea-week-${rating.week}-technique`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`week-${rating.week}-improvement`}>Area for Continued Practice</Label>
                    <Textarea
                      id={`week-${rating.week}-improvement`}
                      placeholder="What from this week needs more practice?"
                      value={rating.improvementArea}
                      onChange={(e) => updateWeeklyRating(index, 'improvementArea', e.target.value)}
                      className="mt-1"
                      data-testid={`textarea-week-${rating.week}-improvement`}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Part 2: Before/After Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Part 2: Before & After Comparison
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Rate each area before starting the program vs. now (1-10 scale)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {beforeAfterRatings.map((rating, index) => {
            const IconComponent = rating.icon;
            const improvement = rating.after - rating.before;
            
            return (
              <Card key={rating.category} className="border-l-4 border-l-green-400">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{rating.category}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Improvement: +{improvement} points</span>
                        {improvement >= 3 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Significant Progress
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium">Before Program: {rating.before}/10</Label>
                      <Slider
                        value={[rating.before]}
                        onValueChange={(value) => updateBeforeAfterRating(index, 'before', value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="mt-2"
                        data-testid={`slider-${rating.category.replace(/\s+/g, '-').toLowerCase()}-before`}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Now: {rating.after}/10</Label>
                      <Slider
                        value={[rating.after]}
                        onValueChange={(value) => updateBeforeAfterRating(index, 'after', value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="mt-2"
                        data-testid={`slider-${rating.category.replace(/\s+/g, '-').toLowerCase()}-after`}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor={`changes-${index}`}>Specific Changes You've Noticed</Label>
                    <Textarea
                      id={`changes-${index}`}
                      placeholder="Describe the specific improvements in this area..."
                      value={rating.changes}
                      onChange={(e) => updateBeforeAfterRating(index, 'changes', e.target.value)}
                      className="mt-1"
                      data-testid={`textarea-changes-${rating.category.replace(/\s+/g, '-').toLowerCase()}`}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Part 3: Current Challenges */}
      <Card>
        <CardHeader>
          <CardTitle>Part 3: Current Challenges Assessment</CardTitle>
          <p className="text-sm text-muted-foreground">
            Identify areas that still need attention and support
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-symptoms">Anxiety symptoms you still struggle with</Label>
            <Textarea
              id="current-symptoms"
              placeholder="Which anxiety symptoms are still challenging for you?"
              value={currentChallenges.symptoms}
              onChange={(e) => setCurrentChallenges(prev => ({ ...prev, symptoms: e.target.value }))}
              className="mt-1"
              data-testid="textarea-current-symptoms"
            />
          </div>
          
          <div>
            <Label htmlFor="difficult-situations">Situations that remain difficult</Label>
            <Textarea
              id="difficult-situations"
              placeholder="What situations or environments still feel challenging?"
              value={currentChallenges.situations}
              onChange={(e) => setCurrentChallenges(prev => ({ ...prev, situations: e.target.value }))}
              className="mt-1"
              data-testid="textarea-difficult-situations"
            />
          </div>
          
          <div>
            <Label htmlFor="strategies-practice">Coping strategies that need more practice</Label>
            <Textarea
              id="strategies-practice"
              placeholder="Which techniques do you want to continue working on?"
              value={currentChallenges.strategies}
              onChange={(e) => setCurrentChallenges(prev => ({ ...prev, strategies: e.target.value }))}
              className="mt-1"
              data-testid="textarea-strategies-practice"
            />
          </div>
          
          <div>
            <Label htmlFor="continue-working">What you'd like to continue working on</Label>
            <Textarea
              id="continue-working"
              placeholder="What goals do you have for continued growth?"
              value={currentChallenges.continueWorking}
              onChange={(e) => setCurrentChallenges(prev => ({ ...prev, continueWorking: e.target.value }))}
              className="mt-1"
              data-testid="textarea-continue-working"
            />
          </div>
          
          <div>
            <Label htmlFor="additional-support">Where you might need additional support</Label>
            <Textarea
              id="additional-support"
              placeholder="What kind of additional help or resources would be valuable?"
              value={currentChallenges.additionalSupport}
              onChange={(e) => setCurrentChallenges(prev => ({ ...prev, additionalSupport: e.target.value }))}
              className="mt-1"
              data-testid="textarea-additional-support"
            />
          </div>
        </CardContent>
      </Card>

      {/* Part 4: Future Readiness */}
      <Card>
        <CardHeader>
          <CardTitle>Part 4: Future Readiness Assessment</CardTitle>
          <p className="text-sm text-muted-foreground">
            Rate your readiness in key areas (1-10 scale)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {readinessRatings.map((rating, index) => (
            <div key={rating.area} className="space-y-3">
              <div>
                <Label className="text-sm font-medium">
                  {rating.area}: {rating.rating}/10
                </Label>
                <Slider
                  value={[rating.rating]}
                  onValueChange={(value) => updateReadinessRating(index, 'rating', value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                  data-testid={`slider-readiness-${index}`}
                />
              </div>
              
              <div>
                <Label htmlFor={`confidence-${index}`}>What gives you confidence in this area?</Label>
                <Textarea
                  id={`confidence-${index}`}
                  placeholder="Describe your confidence and any concerns..."
                  value={rating.confidence}
                  onChange={(e) => updateReadinessRating(index, 'confidence', e.target.value)}
                  className="mt-1"
                  data-testid={`textarea-confidence-${index}`}
                />
              </div>
              
              {index < readinessRatings.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Part 5: Key Insights & Wisdom */}
      <Card>
        <CardHeader>
          <CardTitle>Part 5: Key Insights & Wisdom</CardTitle>
          <p className="text-sm text-muted-foreground">
            Capture your most important learnings and insights
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="most-important">Most important thing you've learned about yourself</Label>
            <Textarea
              id="most-important"
              placeholder="What's the most valuable insight you've gained about yourself?"
              value={keyInsights.mostImportant}
              onChange={(e) => setKeyInsights(prev => ({ ...prev, mostImportant: e.target.value }))}
              className="mt-1"
              data-testid="textarea-most-important"
            />
          </div>
          
          <div>
            <Label htmlFor="advice-others">Advice for someone starting this program</Label>
            <Textarea
              id="advice-others"
              placeholder="What would you tell someone just beginning this journey?"
              value={keyInsights.adviceToOthers}
              onChange={(e) => setKeyInsights(prev => ({ ...prev, adviceToOthers: e.target.value }))}
              className="mt-1"
              data-testid="textarea-advice-others"
            />
          </div>
          
          <div>
            <Label htmlFor="motivation">What keeps you motivated</Label>
            <Textarea
              id="motivation"
              placeholder="What motivates you to continue working on anxiety management?"
              value={keyInsights.motivation}
              onChange={(e) => setKeyInsights(prev => ({ ...prev, motivation: e.target.value }))}
              className="mt-1"
              data-testid="textarea-motivation"
            />
          </div>
          
          <div>
            <Label htmlFor="future-growth">How you want to continue growing</Label>
            <Textarea
              id="future-growth"
              placeholder="What are your goals for continued growth and development?"
              value={keyInsights.futureGrowth}
              onChange={(e) => setKeyInsights(prev => ({ ...prev, futureGrowth: e.target.value }))}
              className="mt-1"
              data-testid="textarea-future-growth"
            />
          </div>
          
          <div>
            <Label htmlFor="proudest-achievement">Proudest achievement in these 6 weeks</Label>
            <Textarea
              id="proudest-achievement"
              placeholder="What are you most proud of accomplishing?"
              value={keyInsights.proudestAchievement}
              onChange={(e) => setKeyInsights(prev => ({ ...prev, proudestAchievement: e.target.value }))}
              className="mt-1"
              data-testid="textarea-proudest-achievement"
            />
          </div>
          
          <div>
            <Label htmlFor="remember-apply">How you'll remember and apply what you've learned</Label>
            <Textarea
              id="remember-apply"
              placeholder="How will you keep these lessons alive in your daily life?"
              value={keyInsights.rememberApply}
              onChange={(e) => setKeyInsights(prev => ({ ...prev, rememberApply: e.target.value }))}
              className="mt-1"
              data-testid="textarea-remember-apply"
            />
          </div>
        </CardContent>
      </Card>

      {/* Part 6: Success Stories */}
      <Card>
        <CardHeader>
          <CardTitle>Part 6: Success Stories</CardTitle>
          <p className="text-sm text-muted-foreground">
            Document specific situations where you successfully used your new skills
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {successStories.map((story, index) => (
            <Card key={index} className="border-l-4 border-l-yellow-400">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold">Success Story #{index + 1}</h4>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`story-title-${index}`}>Story Title</Label>
                  <Input
                    id={`story-title-${index}`}
                    placeholder="Give your success story a title..."
                    value={story.title}
                    onChange={(e) => updateSuccessStory(index, 'title', e.target.value)}
                    className="mt-1"
                    data-testid={`input-story-title-${index}`}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`story-situation-${index}`}>The Situation</Label>
                  <Textarea
                    id={`story-situation-${index}`}
                    placeholder="Describe the challenging situation you faced..."
                    value={story.situation}
                    onChange={(e) => updateSuccessStory(index, 'situation', e.target.value)}
                    className="mt-1"
                    data-testid={`textarea-story-situation-${index}`}
                  />
                </div>
                
                <div>
                  <Label>Skills You Used</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {story.skillsUsed.map((skill, skillIndex) => (
                      <Badge 
                        key={skillIndex} 
                        variant="secondary" 
                        className="cursor-pointer"
                        onClick={() => removeSkillFromStory(index, skillIndex)}
                        data-testid={`badge-skill-${index}-${skillIndex}`}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill you used..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addSkillToStory(index, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      data-testid={`input-add-skill-${index}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                        addSkillToStory(index, input.value);
                        input.value = '';
                      }}
                      data-testid={`button-add-skill-${index}`}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`story-outcome-${index}`}>The Outcome</Label>
                  <Textarea
                    id={`story-outcome-${index}`}
                    placeholder="What happened? How did it go?"
                    value={story.outcome}
                    onChange={(e) => updateSuccessStory(index, 'outcome', e.target.value)}
                    className="mt-1"
                    data-testid={`textarea-story-outcome-${index}`}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`story-learnings-${index}`}>What You Learned</Label>
                  <Textarea
                    id={`story-learnings-${index}`}
                    placeholder="What insights or confidence did you gain from this experience?"
                    value={story.learnings}
                    onChange={(e) => updateSuccessStory(index, 'learnings', e.target.value)}
                    className="mt-1"
                    data-testid={`textarea-story-learnings-${index}`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Part 7: Reflection Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Part 7: Deep Reflection Questions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Take time to thoughtfully answer these reflection prompts
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {reflectionPrompts.map((prompt, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`reflection-${index}`} className="text-sm font-medium">
                {index + 1}. {prompt}
              </Label>
              <Textarea
                id={`reflection-${index}`}
                placeholder="Take your time to reflect and write your thoughts..."
                value={reflectionAnswers[index]}
                onChange={(e) => {
                  const newAnswers = [...reflectionAnswers];
                  newAnswers[index] = e.target.value;
                  setReflectionAnswers(newAnswers);
                }}
                className="mt-1 min-h-[100px]"
                data-testid={`textarea-reflection-${index}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Summary & Export */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Progress Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(weeklyRatings.reduce((sum, rating) => sum + rating.helpfulness, 0) / weeklyRatings.length * 10)}%
              </div>
              <div className="text-sm text-muted-foreground">Average Weekly Helpfulness</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                +{Math.round(beforeAfterRatings.reduce((sum, rating) => sum + (rating.after - rating.before), 0) / beforeAfterRatings.length * 10)}%
              </div>
              <div className="text-sm text-muted-foreground">Average Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(readinessRatings.reduce((sum, rating) => sum + rating.rating, 0) / readinessRatings.length * 10)}%
              </div>
              <div className="text-sm text-muted-foreground">Readiness for Next Steps</div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={exportProgress} className="gap-2" size="lg">
              <Download className="w-4 h-4" />
              Export Complete Progress Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}