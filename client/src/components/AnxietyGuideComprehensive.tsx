import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  Brain, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Lightbulb,
  Heart,
  Target,
  FileText,
  PenTool,
  Star
} from "lucide-react";
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

interface QuizAnswer {
  id: string;
  text: string;
  correct: boolean;
  explanation: string;
}

interface WorksheetEntry {
  situation: string;
  physicalSymptoms: string[];
  thoughts: string;
  emotions: string;
  behaviors: string;
  copingStrategies: string[];
  notes: string;
}

export function AnxietyGuideComprehensive() {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [worksheetEntries, setWorksheetEntries] = useState<WorksheetEntry[]>([]);
  const [personalNotes, setPersonalNotes] = useState<Record<string, string>>({});
  const [copingToolsRating, setCopingToolsRating] = useState<Record<string, number>>({});
  const [symptomChecklist, setSymptomChecklist] = useState<Record<string, boolean>>({});
  const [actionPlanData, setActionPlanData] = useState<{
    selectedGoals: Record<string, boolean>;
    additionalNotes: string;
  }>({
    selectedGoals: {},
    additionalNotes: ""
  });
  const [symptomTrackingWorksheet, setSymptomTrackingWorksheet] = useState<{
    mostCommonSymptoms: string;
    commonTriggers: string;
  }>({
    mostCommonSymptoms: "",
    commonTriggers: ""
  });
  const [personalManagementPlan, setPersonalManagementPlan] = useState<{
    immediateStrategies: string;
    longTermGoals: string;
    warningSigns: string;
  }>({
    immediateStrategies: "",
    longTermGoals: "",
    warningSigns: ""
  });
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const { user } = useUser();
  const { toast } = useToast();

  // Fetch existing anxiety guide data
  const { data: existingGuide, refetch } = useQuery({
    queryKey: ['/api/anxiety-guide', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await apiRequest('GET', `/api/anxiety-guide/${user.id}`);
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Update anxiety guide data
  const updateGuideMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user?.id) throw new Error('User not authenticated');
      const response = await apiRequest('PATCH', `/api/anxiety-guide/${user.id}`, data);
      return response.json();
    },
    onSuccess: (data) => {
      console.log('✅ Anxiety guide saved successfully:', data);
      setIsAutoSaving(false);
      // Don't automatically refetch to prevent loops
    },
    onError: (error: any) => {
      console.error('❌ Failed to save anxiety guide data:', error);
      setIsAutoSaving(false);
      toast({
        title: "Save Failed",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Load existing data when component mounts or data is fetched
  useEffect(() => {
    if (existingGuide) {
      console.log('📥 Loading existing guide data:', existingGuide);
      setCompletedSections(existingGuide.completedSections || []);
      setPersonalNotes(existingGuide.personalNotes || {});
      setQuizAnswers(existingGuide.quizAnswers || {});
      setWorksheetEntries(existingGuide.worksheetEntries || []);
      setCopingToolsRating(existingGuide.copingToolsRating || {});
      setSymptomChecklist(existingGuide.symptomChecklist || {});
      setActionPlanData(existingGuide.actionPlanData || {
        selectedGoals: {},
        additionalNotes: ""
      });
      setSymptomTrackingWorksheet(existingGuide.symptomTrackingWorksheet || {
        mostCommonSymptoms: "",
        commonTriggers: ""
      });
      setPersonalManagementPlan(existingGuide.personalManagementPlan || {
        immediateStrategies: "",
        longTermGoals: "",
        warningSigns: ""
      });
      console.log('📥 Loaded data into state:', {
        actionPlanData: existingGuide.actionPlanData,
        symptomTrackingWorksheet: existingGuide.symptomTrackingWorksheet,
        personalManagementPlan: existingGuide.personalManagementPlan
      });
    }
  }, [existingGuide]);

  // Auto-save function
  const autoSave = () => {
    if (!user?.id || isAutoSaving || updateGuideMutation.isPending) return;
    
    console.log('🔄 Auto-save triggered with data:', {
      actionPlanData,
      symptomTrackingWorksheet,
      personalManagementPlan,
      personalNotes
    });
    
    setIsAutoSaving(true);
    
    const dataToSave = {
      completedSections,
      personalNotes,
      quizAnswers,
      worksheetEntries,
      copingToolsRating,
      symptomChecklist,
      actionPlanData,
      symptomTrackingWorksheet,
      personalManagementPlan,
      progressData: {
        lastAccessed: new Date().toISOString(),
        currentSection,
        totalSections: 4
      }
    };

    console.log('💾 Saving data:', dataToSave);
    updateGuideMutation.mutate(dataToSave);
  };

  // Auto-save when data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user?.id && !isAutoSaving && !updateGuideMutation.isPending && (completedSections.length > 0 || Object.keys(personalNotes).length > 0 || Object.keys(symptomChecklist).length > 0 || Object.keys(actionPlanData.selectedGoals).length > 0 || actionPlanData.additionalNotes.trim().length > 0 || symptomTrackingWorksheet.mostCommonSymptoms.trim().length > 0 || symptomTrackingWorksheet.commonTriggers.trim().length > 0 || personalManagementPlan.immediateStrategies.trim().length > 0 || personalManagementPlan.longTermGoals.trim().length > 0 || personalManagementPlan.warningSigns.trim().length > 0)) {
        autoSave();
      }
    }, 2000); // Increased debounce to 2 seconds to reduce frequency

    return () => clearTimeout(timeoutId);
  }, [completedSections, personalNotes, quizAnswers, worksheetEntries, copingToolsRating, symptomChecklist, actionPlanData, symptomTrackingWorksheet, personalManagementPlan, user?.id, isAutoSaving, updateGuideMutation.isPending]);

  const sections = [
    {
      id: 0,
      title: "Understanding Anxiety",
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">What is Anxiety?</h3>
            <p className="text-blue-700 mb-4">
              Anxiety is a natural response to stress or danger. It's part of your body's "fight-flight-freeze" 
              system that helped our ancestors survive. However, when anxiety becomes persistent, excessive, 
              or interferes with daily life, it may indicate an anxiety disorder.
            </p>
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-blue-800 mb-2">According to NICE Guidelines:</h4>
              <p className="text-blue-700 text-sm">
                "Anxiety disorders are among the most common mental health problems, affecting up to 1 in 6 people. 
                They are highly treatable with psychological interventions, particularly Cognitive Behavioural Therapy (CBT)."
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Normal Anxiety
                </CardTitle>
              </CardHeader>
              <CardContent className="text-green-700">
                <ul className="space-y-2">
                  <li>• Temporary response to specific stressors</li>
                  <li>• Proportionate to the situation</li>
                  <li>• Motivates helpful action</li>
                  <li>• Resolves when threat passes</li>
                  <li>• Doesn't significantly impair functioning</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Anxiety Disorders
                </CardTitle>
              </CardHeader>
              <CardContent className="text-amber-700">
                <ul className="space-y-2">
                  <li>• Persistent and excessive worry</li>
                  <li>• Out of proportion to actual threat</li>
                  <li>• Interferes with daily activities</li>
                  <li>• Lasts for weeks or months</li>
                  <li>• Causes significant distress</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6" />
              The Anxiety Cycle (CBT Model)
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded border">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold text-purple-800 mb-1">Trigger</h4>
                <p className="text-sm text-purple-600">Situation or thought</p>
              </div>
              <div className="text-center p-4 bg-white rounded border">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-orange-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold text-purple-800 mb-1">Thoughts</h4>
                <p className="text-sm text-purple-600">Negative predictions</p>
              </div>
              <div className="text-center p-4 bg-white rounded border">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold text-purple-800 mb-1">Physical</h4>
                <p className="text-sm text-purple-600">Body sensations</p>
              </div>
              <div className="text-center p-4 bg-white rounded border">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <h4 className="font-semibent text-purple-800 mb-1">Behavior</h4>
                <p className="text-sm text-purple-600">Actions taken</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white rounded border">
              <p className="text-purple-700 text-center">
                <strong>Breaking the cycle:</strong> Changing any part of this cycle can reduce anxiety
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Reflection</h3>
            <Textarea
              placeholder="Describe a recent situation where you felt anxious. What triggered it? How did your body feel? What thoughts went through your mind?"
              value={personalNotes['section0'] || ''}
              onChange={(e) => setPersonalNotes(prev => ({...prev, section0: e.target.value}))}
              className="min-h-[100px]"
            />
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Recognizing Symptoms",
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400">
            <h3 className="text-xl font-semibold text-indigo-800 mb-3">Anxiety Symptoms Assessment</h3>
            <p className="text-indigo-700 mb-4">
              Understanding your specific anxiety symptoms helps you recognize patterns and develop targeted coping strategies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Physical Symptoms</CardTitle>
                <p className="text-sm text-red-600">How anxiety affects your body</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'Rapid or pounding heartbeat',
                  'Sweating or hot flashes',
                  'Trembling or shaking',
                  'Shortness of breath',
                  'Chest tightness',
                  'Nausea or stomach upset',
                  'Dizziness or lightheadedness',
                  'Muscle tension',
                  'Fatigue or weakness',
                  'Sleep disturbances'
                ].map((symptom, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`physical-${index}`}
                      checked={symptomChecklist[`physical-${index}`] || false}
                      onCheckedChange={(checked) => 
                        setSymptomChecklist(prev => ({
                          ...prev,
                          [`physical-${index}`]: checked as boolean
                        }))
                      }
                    />
                    <Label htmlFor={`physical-${index}`} className="text-sm text-red-700">{symptom}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800">Emotional Symptoms</CardTitle>
                <p className="text-sm text-purple-600">How anxiety affects your feelings</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'Excessive worry or fear',
                  'Feeling on edge or restless',
                  'Irritability or mood swings',
                  'Feeling overwhelmed',
                  'Sense of impending doom',
                  'Difficulty concentrating',
                  'Fear of losing control',
                  'Feeling detached or unreal',
                  'Low mood or sadness',
                  'Guilt or self-blame'
                ].map((symptom, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`emotional-${index}`}
                      checked={symptomChecklist[`emotional-${index}`] || false}
                      onCheckedChange={(checked) => 
                        setSymptomChecklist(prev => ({
                          ...prev,
                          [`emotional-${index}`]: checked as boolean
                        }))
                      }
                    />
                    <Label htmlFor={`emotional-${index}`} className="text-sm text-purple-700">{symptom}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Behavioral Changes</CardTitle>
                <p className="text-sm text-blue-600">How anxiety affects your actions</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'Avoiding certain situations',
                  'Procrastination or delays',
                  'Seeking frequent reassurance',
                  'Checking behaviors',
                  'Social withdrawal',
                  'Increased use of alcohol/substances',
                  'Restlessness or pacing',
                  'Difficulty making decisions',
                  'Changes in eating habits',
                  'Increased phone/internet use'
                ].map((symptom, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`behavioral-${index}`}
                      checked={symptomChecklist[`behavioral-${index}`] || false}
                      onCheckedChange={(checked) => 
                        setSymptomChecklist(prev => ({
                          ...prev,
                          [`behavioral-${index}`]: checked as boolean
                        }))
                      }
                    />
                    <Label htmlFor={`behavioral-${index}`} className="text-sm text-blue-700">{symptom}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Symptom Tracking Worksheet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-yellow-700 text-sm">
                Use this worksheet to track your anxiety symptoms over the next week. This will help identify patterns and triggers.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="most-common" className="text-yellow-800 font-medium">Most Common Physical Symptoms:</Label>
                  <Textarea 
                    id="most-common"
                    placeholder="List your 3-5 most frequent physical symptoms..."
                    className="mt-1"
                    value={symptomTrackingWorksheet.mostCommonSymptoms}
                    onChange={(e) => setSymptomTrackingWorksheet(prev => ({
                      ...prev,
                      mostCommonSymptoms: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="triggers" className="text-yellow-800 font-medium">Common Triggers:</Label>
                  <Textarea 
                    id="triggers"
                    placeholder="Situations, thoughts, or events that typically trigger your anxiety..."
                    className="mt-1"
                    value={symptomTrackingWorksheet.commonTriggers}
                    onChange={(e) => setSymptomTrackingWorksheet(prev => ({
                      ...prev,
                      commonTriggers: e.target.value
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Symptom Notes</h3>
            <Textarea
              placeholder="Reflect on your anxiety symptoms. Which ones do you experience most often? Are there any patterns you've noticed?"
              value={personalNotes['section1'] || ''}
              onChange={(e) => setPersonalNotes(prev => ({...prev, section1: e.target.value}))}
              className="min-h-[100px]"
            />
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Coping Strategies & Techniques",
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
            <h3 className="text-xl font-semibold text-green-800 mb-3">Evidence-Based Coping Strategies</h3>
            <p className="text-green-700 mb-4">
              These techniques are recommended by NICE and have been proven effective in managing anxiety symptoms.
            </p>
          </div>

          <div className="space-y-8">
            {/* Immediate Coping Strategies */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Immediate Relief Techniques (In-the-Moment)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white rounded border">
                    <h4 className="font-semibold text-emerald-800 mb-3">Box Breathing (4-4-4-4)</h4>
                    <ol className="text-emerald-700 space-y-1 text-sm mb-3">
                      <li>1. Breathe in for 4 seconds</li>
                      <li>2. Hold for 4 seconds</li>
                      <li>3. Breathe out for 4 seconds</li>
                      <li>4. Hold empty for 4 seconds</li>
                      <li>5. Repeat 4-8 times</li>
                    </ol>
                    <div className="flex items-center space-x-2">
                      <Label className="text-emerald-700 text-sm">Rate effectiveness (1-5):</Label>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(num => (
                          <button
                            key={num}
                            onClick={() => setCopingToolsRating(prev => ({...prev, boxBreathing: num}))}
                            className={`w-6 h-6 rounded ${copingToolsRating.boxBreathing === num ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded border">
                    <h4 className="font-semibold text-emerald-800 mb-3">5-4-3-2-1 Grounding</h4>
                    <ul className="text-emerald-700 space-y-1 text-sm mb-3">
                      <li>• 5 things you can <strong>see</strong></li>
                      <li>• 4 things you can <strong>touch</strong></li>
                      <li>• 3 things you can <strong>hear</strong></li>
                      <li>• 2 things you can <strong>smell</strong></li>
                      <li>• 1 thing you can <strong>taste</strong></li>
                    </ul>
                    <div className="flex items-center space-x-2">
                      <Label className="text-emerald-700 text-sm">Rate effectiveness (1-5):</Label>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(num => (
                          <button
                            key={num}
                            onClick={() => setCopingToolsRating(prev => ({...prev, grounding: num}))}
                            className={`w-6 h-6 rounded ${copingToolsRating.grounding === num ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white rounded border">
                    <h4 className="font-semibold text-emerald-800 mb-3">Progressive Muscle Relaxation</h4>
                    <ol className="text-emerald-700 space-y-1 text-sm mb-3">
                      <li>1. Tense feet muscles for 5 seconds</li>
                      <li>2. Release and notice relaxation</li>
                      <li>3. Move up to calves, thighs, etc.</li>
                      <li>4. Work through whole body</li>
                      <li>5. End with whole-body scan</li>
                    </ol>
                    <div className="flex items-center space-x-2">
                      <Label className="text-emerald-700 text-sm">Rate effectiveness (1-5):</Label>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(num => (
                          <button
                            key={num}
                            onClick={() => setCopingToolsRating(prev => ({...prev, pmr: num}))}
                            className={`w-6 h-6 rounded ${copingToolsRating.pmr === num ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded border">
                    <h4 className="font-semibold text-emerald-800 mb-3">Thought Challenging</h4>
                    <ul className="text-emerald-700 space-y-1 text-sm mb-3">
                      <li>• Is this thought realistic?</li>
                      <li>• What evidence supports/contradicts it?</li>
                      <li>• What would I tell a friend?</li>
                      <li>• What's the most likely outcome?</li>
                      <li>• How will this matter in 5 years?</li>
                    </ul>
                    <div className="flex items-center space-x-2">
                      <Label className="text-emerald-700 text-sm">Rate effectiveness (1-5):</Label>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(num => (
                          <button
                            key={num}
                            onClick={() => setCopingToolsRating(prev => ({...prev, thoughtChallenge: num}))}
                            className={`w-6 h-6 rounded ${copingToolsRating.thoughtChallenge === num ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Long-term Strategies */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Long-term Management Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-blue-800">Lifestyle Factors</h4>
                    <ul className="text-blue-700 space-y-2">
                      <li>• Regular exercise (even 10 minutes daily)</li>
                      <li>• Consistent sleep schedule (7-9 hours)</li>
                      <li>• Limit caffeine (especially after 2 PM)</li>
                      <li>• Reduce alcohol consumption</li>
                      <li>• Practice mindfulness or meditation</li>
                      <li>• Maintain social connections</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-blue-800">Cognitive Strategies</h4>
                    <ul className="text-blue-700 space-y-2">
                      <li>• Challenge negative thought patterns</li>
                      <li>• Practice acceptance of uncertainty</li>
                      <li>• Set realistic, achievable goals</li>
                      <li>• Focus on problem-solving, not worry</li>
                      <li>• Develop a worry time (15 min daily)</li>
                      <li>• Keep a thought diary</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Anxiety Management Plan */}
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Personal Anxiety Management Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-purple-800 font-medium">My Most Effective Immediate Strategies:</Label>
                    <Textarea 
                      placeholder="Based on your ratings above, list your top 3 immediate coping techniques..."
                      className="mt-1 min-h-[80px]"
                      value={personalManagementPlan.immediateStrategies}
                      onChange={(e) => setPersonalManagementPlan(prev => ({
                        ...prev,
                        immediateStrategies: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label className="text-purple-800 font-medium">My Long-term Management Goals:</Label>
                    <Textarea 
                      placeholder="What lifestyle changes will you commit to? Set 2-3 realistic goals..."
                      className="mt-1 min-h-[80px]"
                      value={personalManagementPlan.longTermGoals}
                      onChange={(e) => setPersonalManagementPlan(prev => ({
                        ...prev,
                        longTermGoals: e.target.value
                      }))}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-purple-800 font-medium">Early Warning Signs to Watch For:</Label>
                  <Textarea 
                    placeholder="List physical, emotional, or behavioral signs that indicate your anxiety is increasing..."
                    className="mt-1"
                    value={personalManagementPlan.warningSigns}
                    onChange={(e) => setPersonalManagementPlan(prev => ({
                      ...prev,
                      warningSigns: e.target.value
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Strategy Reflection</h3>
            <Textarea
              placeholder="Which coping strategies resonate most with you? What barriers might prevent you from using them?"
              value={personalNotes['section2'] || ''}
              onChange={(e) => setPersonalNotes(prev => ({...prev, section2: e.target.value}))}
              className="min-h-[100px]"
            />
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Knowledge Check & Action Plan",
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400">
            <h3 className="text-xl font-semibold text-indigo-800 mb-3">Knowledge Check Quiz</h3>
            <p className="text-indigo-700">
              Test your understanding of anxiety management concepts. This helps reinforce key learning points.
            </p>
          </div>

          <Card className="bg-white border-2">
            <CardContent className="p-6 space-y-6">
              {/* Quiz Questions */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. Which of the following is a key component of the anxiety cycle?</h4>
                  <RadioGroup value={quizAnswers['q1']} onValueChange={(value) => setQuizAnswers(prev => ({...prev, q1: value}))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="a" id="q1a" />
                      <Label htmlFor="q1a">Triggers → Thoughts → Physical sensations → Behaviors</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="b" id="q1b" />
                      <Label htmlFor="q1b">Sleep → Food → Exercise → Medication</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="c" id="q1c" />
                      <Label htmlFor="q1c">Work → Family → Friends → Hobbies</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. What is the recommended breathing technique for immediate anxiety relief?</h4>
                  <RadioGroup value={quizAnswers['q2']} onValueChange={(value) => setQuizAnswers(prev => ({...prev, q2: value}))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="a" id="q2a" />
                      <Label htmlFor="q2a">Breathe as fast as possible</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="b" id="q2b" />
                      <Label htmlFor="q2b">Hold your breath for as long as possible</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="c" id="q2c" />
                      <Label htmlFor="q2c">Slow, controlled breathing (e.g., 4-4-4-4 pattern)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. Which lifestyle factor is most important for long-term anxiety management?</h4>
                  <RadioGroup value={quizAnswers['q3']} onValueChange={(value) => setQuizAnswers(prev => ({...prev, q3: value}))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="a" id="q3a" />
                      <Label htmlFor="q3a">Avoiding all stressful situations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="b" id="q3b" />
                      <Label htmlFor="q3b">Regular exercise, good sleep, and stress management</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="c" id="q3c" />
                      <Label htmlFor="q3c">Taking medication only</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button 
                onClick={() => setShowQuizResults(true)} 
                className="w-full"
                disabled={Object.keys(quizAnswers).length < 3}
              >
                Check Answers
              </Button>

              {showQuizResults && (
                <div className="space-y-4 p-4 bg-green-50 rounded border">
                  <h4 className="font-semibold text-green-800">Quiz Results:</h4>
                  <div className="space-y-3">
                    <div className={`p-3 rounded ${quizAnswers.q1 === 'a' ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border`}>
                      <p className="font-medium">Question 1: {quizAnswers.q1 === 'a' ? '✓ Correct' : '✗ Incorrect'}</p>
                      <p className="text-sm">The anxiety cycle involves: Triggers → Thoughts → Physical sensations → Behaviors. Each component influences the others.</p>
                    </div>
                    <div className={`p-3 rounded ${quizAnswers.q2 === 'c' ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border`}>
                      <p className="font-medium">Question 2: {quizAnswers.q2 === 'c' ? '✓ Correct' : '✗ Incorrect'}</p>
                      <p className="text-sm">Slow, controlled breathing activates the parasympathetic nervous system, reducing anxiety symptoms.</p>
                    </div>
                    <div className={`p-3 rounded ${quizAnswers.q3 === 'b' ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border`}>
                      <p className="font-medium">Question 3: {quizAnswers.q3 === 'b' ? '✓ Correct' : '✗ Incorrect'}</p>
                      <p className="text-sm">A holistic approach including exercise, sleep, and stress management provides the best long-term results.</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Plan */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Star className="w-6 h-6" />
                Your Personal Anxiety Management Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-green-800 font-semibold">This Week's Goals (Choose 2-3):</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Practice box breathing daily for 5 minutes',
                      'Go for a 10-minute walk each day',
                      'Use the 5-4-3-2-1 technique when anxious',
                      'Keep a worry diary for 15 minutes daily',
                      'Get 7-8 hours of sleep each night',
                      'Limit caffeine after 2 PM'
                    ].map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`goal-${index}`}
                          checked={actionPlanData.selectedGoals[`goal-${index}`] || false}
                          onCheckedChange={(checked) => 
                            setActionPlanData(prev => ({
                              ...prev,
                              selectedGoals: {
                                ...prev.selectedGoals,
                                [`goal-${index}`]: checked as boolean
                              }
                            }))
                          }
                        />
                        <Label htmlFor={`goal-${index}`} className="text-green-700 text-sm">{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-green-800 font-semibold">Support Resources:</Label>
                  <div className="space-y-2 mt-2 text-sm text-green-700">
                    <div className="p-3 bg-white rounded border">
                      <p className="font-medium">NHS Self-Help Resources</p>
                      <p>Every Mind Matters: nhs.uk/every-mind-matters</p>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <p className="font-medium">Crisis Support</p>
                      <p>Samaritans: 116 123 (free, 24/7)</p>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <p className="font-medium">Your GP</p>
                      <p>For referral to NHS psychological therapies</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-green-800 font-semibold">Additional Notes & Commitments:</Label>
                <Textarea 
                  placeholder="What specific steps will you take this week? How will you remember to practice these techniques?"
                  className="mt-2"
                  value={actionPlanData.additionalNotes}
                  onChange={(e) => setActionPlanData(prev => ({
                    ...prev,
                    additionalNotes: e.target.value
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  const markSectionComplete = (sectionId: number) => {
    if (!completedSections.includes(sectionId)) {
      const newCompletedSections = [...completedSections, sectionId];
      setCompletedSections(newCompletedSections);
      
      // Show completion toast if this was the last section
      if (newCompletedSections.length === sections.length) {
        toast({
          title: "🎉 Congratulations!",
          description: "You've completed the Understanding Anxiety guide!",
        });
      }
    }
  };

  const progressPercentage = Math.round((completedSections.length / sections.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-3xl">
            <Brain className="w-10 h-10" />
            Understanding Anxiety
          </CardTitle>
          <p className="text-blue-100 text-lg">
            Evidence-based education following NICE guidelines for anxiety management
          </p>
          <Badge variant="secondary" className="bg-white/20 text-white w-fit mx-auto">
            Clinical Content • Interactive Worksheets • Personal Action Plan
          </Badge>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Learning Progress
            </h3>
            <Badge variant="outline">{completedSections.length}/{sections.length} sections completed</Badge>
          </div>
          <Progress value={progressPercentage} className="mb-2" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {progressPercentage}% complete • {completedSections.length}/{sections.length} sections completed
              {progressPercentage === 100 && " • 🎉 Guide completed!"}
            </p>
            {(updateGuideMutation.isPending || isAutoSaving) && (
              <span className="text-xs text-blue-600 flex items-center gap-1">
                <span className="animate-spin">💾</span> Saving...
              </span>
            )}
          </div>
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
            <BookOpen className="w-6 h-6" />
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
              Previous Section
            </Button>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => markSectionComplete(currentSection)}
                disabled={completedSections.includes(currentSection)}
              >
                {completedSections.includes(currentSection) ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Section Complete
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4 mr-2" />
                    Mark Complete
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => {
                  if (currentSection < sections.length - 1) {
                    setCurrentSection(currentSection + 1);
                  } else {
                    // On last section, mark as complete and show completion
                    markSectionComplete(currentSection);
                  }
                }}
              >
                {currentSection === sections.length - 1 ? (
                  <>
                    Complete Guide
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next Section
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Certificate */}
      {completedSections.length === sections.length && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-3">
              🎉 Congratulations! You've completed the Understanding Anxiety guide.
            </h3>
            <p className="text-green-700 text-lg mb-4">
              You now have evidence-based knowledge and practical tools to manage your anxiety effectively.
            </p>
            <div className="bg-white p-4 rounded border border-green-200 text-left">
              <h4 className="font-semibold text-green-800 mb-2">What You've Learned:</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>✓ The anxiety cycle and how it maintains anxiety symptoms</li>
                <li>✓ How to recognize your personal anxiety symptoms and triggers</li>
                <li>✓ Evidence-based immediate coping techniques</li>
                <li>✓ Long-term management strategies following NICE guidelines</li>
                <li>✓ Your personalized anxiety management action plan</li>
              </ul>
            </div>
            <p className="text-green-600 text-sm mt-4">
              Remember: Recovery is a process. Be patient with yourself and practice these techniques regularly.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}