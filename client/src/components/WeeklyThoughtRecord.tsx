import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Lightbulb, 
  Scale, 
  Download,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  Save
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

interface WeeklyThoughtRecord {
  id: string;
  date: Date;
  moduleId: string;
  weekNumber: number;
  situation: string;
  emotion: string;
  intensity: number;
  physicalSensations: string;
  automaticThought: string;
  evidenceFor: string;
  evidenceAgainst: string;
  balancedThought: string;
  newEmotion: string;
  newIntensity: number;
  actionPlan: string;
  selectedDistortions: string[];
}

interface CognitiveDistortion {
  name: string;
  description: string;
  examples: string[];
}

interface WeeklyThoughtRecordProps {
  moduleId: string;
  weekNumber: number;
}

export function WeeklyThoughtRecord({ moduleId, weekNumber }: WeeklyThoughtRecordProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [currentRecord, setCurrentRecord] = useState<Partial<WeeklyThoughtRecord>>({
    situation: "",
    emotion: "",
    intensity: 5,
    physicalSensations: "",
    automaticThought: "",
    evidenceFor: "",
    evidenceAgainst: "",
    balancedThought: "",
    newEmotion: "",
    newIntensity: 3,
    actionPlan: ""
  });

  const [savedRecords, setSavedRecords] = useState<WeeklyThoughtRecord[]>([]);
  const [selectedDistortions, setSelectedDistortions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("situation");
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Load saved weekly thought records
  const { data: savedWeeklyThoughtRecords = [], refetch: refetchWeeklyThoughtRecords, isLoading, error } = useQuery({
    queryKey: ["/api/weekly-thought-records", user?.id, moduleId],
    enabled: !!user?.id && !!moduleId,
    queryFn: async () => {
      console.log('🔍 Fetching weekly thought records for userId:', user?.id, 'moduleId:', moduleId);
      const response = await fetch(`/api/weekly-thought-records/${user?.id}?moduleId=${moduleId}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      console.log('📥 Weekly thought records fetched:', data);
      return data;
    }
  });

  // Create weekly thought record mutation
  const createWeeklyThoughtRecordMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Creating weekly thought record with data:", data);
      try {
        const response = await fetch("/api/weekly-thought-records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
        
        console.log("Create weekly response status:", response.status);
        
        if (!response.ok) {
          const text = await response.text();
          console.error("Response text:", text);
          if (response.status === 401) {
            throw new Error("Authentication required. Please log in again.");
          }
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
        
        return await response.json();
      } catch (error: any) {
        console.error("Network error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Weekly thought record created successfully:", data);
      setCurrentRecordId(data.id);
      refetchWeeklyThoughtRecords();
      toast({
        title: "Record Saved",
        description: "Your thought record has been saved successfully.",
      });
    },
    onError: (error: any) => {
      console.error("Failed to create weekly thought record:", error);
      toast({
        title: "Save Failed",
        description: `Failed to save thought record: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update weekly thought record mutation
  const updateWeeklyThoughtRecordMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      console.log("Updating weekly thought record:", id, updates);
      try {
        const response = await fetch(`/api/weekly-thought-records/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updates),
        });
        
        console.log("Update weekly response status:", response.status);
        
        if (!response.ok) {
          const text = await response.text();
          console.error("Response text:", text);
          if (response.status === 401) {
            throw new Error("Authentication required. Please log in again.");
          }
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
        
        return await response.json();
      } catch (error: any) {
        console.error("Network error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Weekly thought record updated successfully:", data);
      toast({
        title: "Record Updated",
        description: "Your thought record has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error("Failed to update weekly thought record:", error);
      toast({
        title: "Update Failed",
        description: `Failed to update thought record: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const cognitiveDistortions: CognitiveDistortion[] = [
    {
      name: "All-or-Nothing",
      description: "Seeing things in black and white categories",
      examples: ["I'm a complete failure", "Nothing ever goes right", "Everyone hates me"]
    },
    {
      name: "Overgeneralization", 
      description: "Drawing broad conclusions from a single event",
      examples: ["This always happens to me", "I never do anything right", "No one ever listens"]
    },
    {
      name: "Mental Filter",
      description: "Focusing only on negative details",
      examples: ["Focusing on one criticism while ignoring praise", "Remembering only mistakes"]
    },
    {
      name: "Mind Reading",
      description: "Assuming you know what others are thinking",
      examples: ["They think I'm boring", "She's judging me", "He doesn't like me"]
    },
    {
      name: "Fortune Telling",
      description: "Predicting negative outcomes without evidence",
      examples: ["This will definitely go wrong", "I'll embarrass myself", "I'll never succeed"]
    },
    {
      name: "Catastrophizing",
      description: "Expecting the worst possible outcome",
      examples: ["This is a disaster", "I can't handle this", "Everything is ruined"]
    },
    {
      name: "Emotional Reasoning",
      description: "Believing feelings reflect reality",
      examples: ["I feel guilty, so I must be bad", "I feel hopeless, so things are hopeless"]
    },
    {
      name: "Should Statements",
      description: "Having rigid rules about how things should be",
      examples: ["I should be perfect", "People should always be fair", "Life should be easy"]
    },
    {
      name: "Labeling",
      description: "Defining yourself or others by mistakes",
      examples: ["I'm stupid", "He's a loser", "She's completely selfish"]
    },
    {
      name: "Personalization",
      description: "Blaming yourself for things beyond your control",
      examples: ["It's my fault the meeting went badly", "If I was a better parent, this wouldn't happen"]
    }
  ];

  const challengingQuestions = [
    "What evidence supports this thought?",
    "What evidence contradicts this thought?",
    "What would I tell a friend having this thought?",
    "What's the worst that could realistically happen?",
    "What's the best that could happen?",
    "What's most likely to happen?",
    "How important will this be in 5 years?",
    "What would someone who cares about me say?",
    "Am I falling into a thinking trap?",
    "What would I think if I had all the facts?",
    "Is there another way to look at this situation?",
    "What can I control in this situation?"
  ];

  const emotionOptions = [
    "Anxious", "Worried", "Nervous", "Panicked", "Stressed",
    "Sad", "Depressed", "Disappointed", "Hopeless", "Lonely",
    "Angry", "Frustrated", "Irritated", "Annoyed", "Resentful",
    "Scared", "Fearful", "Terrified", "Overwhelmed", "Ashamed",
    "Guilty", "Embarrassed", "Confused", "Hurt", "Rejected"
  ];

  const toggleDistortion = (distortionName: string) => {
    setSelectedDistortions(prev => 
      prev.includes(distortionName) 
        ? prev.filter(d => d !== distortionName)
        : [...prev, distortionName]
    );
  };

  // Auto-save functionality for weekly thought record sections
  useEffect(() => {
    if (!user?.id || !moduleId) return;

    const { situation, emotion, intensity, physicalSensations, automaticThought, evidenceFor, evidenceAgainst, balancedThought, newEmotion, newIntensity, actionPlan } = currentRecord;
    
    // Only auto-save if we have the minimum required fields (situation + emotion)
    if (situation && emotion && intensity !== undefined) {
      setIsAutoSaving(true);
      
      // Clear existing timeout
      clearTimeout((window as any).weeklyThoughtRecordSaveTimeout);
      
      (window as any).weeklyThoughtRecordSaveTimeout = setTimeout(() => {
        const saveData = {
          userId: user.id,
          moduleId,
          weekNumber,
          situation,
          emotion,
          intensity,
          physicalSensations: physicalSensations || "",
          automaticThought: automaticThought || "",
          evidenceFor: evidenceFor || "",
          evidenceAgainst: evidenceAgainst || "",
          balancedThought: balancedThought || "",
          newEmotion: newEmotion || "",
          newIntensity: newIntensity || null,
          actionPlan: actionPlan || "",
          selectedDistortions
        };

        if (currentRecordId) {
          // Update existing record
          updateWeeklyThoughtRecordMutation.mutate({
            id: currentRecordId,
            updates: saveData
          }, {
            onSettled: () => {
              setIsAutoSaving(false);
            }
          });
        } else {
          // Create new record
          createWeeklyThoughtRecordMutation.mutate(saveData, {
            onSettled: () => {
              setIsAutoSaving(false);
            }
          });
        }
      }, 1000); // Debounce for 1 second
    }

    return () => {
      clearTimeout((window as any).weeklyThoughtRecordSaveTimeout);
    };
  }, [currentRecord.situation, currentRecord.emotion, currentRecord.intensity, currentRecord.physicalSensations, currentRecord.automaticThought, currentRecord.evidenceFor, currentRecord.evidenceAgainst, currentRecord.balancedThought, currentRecord.newEmotion, currentRecord.newIntensity, currentRecord.actionPlan, selectedDistortions, user?.id, moduleId, weekNumber, currentRecordId]);

  const saveRecord = () => {
    if (!user?.id || !moduleId) return;

    const saveData = {
      userId: user.id,
      moduleId,
      weekNumber,
      situation: currentRecord.situation || "",
      emotion: currentRecord.emotion || "",
      intensity: currentRecord.intensity || 5,
      physicalSensations: currentRecord.physicalSensations || "",
      automaticThought: currentRecord.automaticThought || "",
      evidenceFor: currentRecord.evidenceFor || "",
      evidenceAgainst: currentRecord.evidenceAgainst || "",
      balancedThought: currentRecord.balancedThought || "",
      newEmotion: currentRecord.newEmotion || "",
      newIntensity: currentRecord.newIntensity || null,
      actionPlan: currentRecord.actionPlan || "",
      selectedDistortions
    };

    if (currentRecordId) {
      // Update existing record
      updateWeeklyThoughtRecordMutation.mutate({
        id: currentRecordId,
        updates: saveData
      }, {
        onSuccess: () => {
          refetchWeeklyThoughtRecords();
          // Reset form after successful save
          resetForm();
        }
      });
    } else {
      // Create new record
      createWeeklyThoughtRecordMutation.mutate(saveData, {
        onSuccess: () => {
          refetchWeeklyThoughtRecords();
          // Reset form after successful save
          resetForm();
        }
      });
    }
  };

  const resetForm = () => {
    setCurrentRecord({
      situation: "",
      emotion: "",
      intensity: 5,
      physicalSensations: "",
      automaticThought: "",
      evidenceFor: "",
      evidenceAgainst: "",
      balancedThought: "",
      newEmotion: "",
      newIntensity: 3,
      actionPlan: ""
    });
    setSelectedDistortions([]);
    setCurrentRecordId(null);
    setActiveTab("situation");
  };

  const loadRecord = (record: any) => {
    setCurrentRecord({
      situation: record.situation || "",
      emotion: record.emotion || "",
      intensity: record.intensity || 5,
      physicalSensations: record.physicalSensations || "",
      automaticThought: record.automaticThought || "",
      evidenceFor: record.evidenceFor || "",
      evidenceAgainst: record.evidenceAgainst || "",
      balancedThought: record.balancedThought || "",
      newEmotion: record.newEmotion || "",
      newIntensity: record.newIntensity || 3,
      actionPlan: record.actionPlan || ""
    });
    setSelectedDistortions(record.selectedDistortions || []);
    setCurrentRecordId(record.id);
    setActiveTab("situation");
  };

  const exportRecord = () => {
    const exportData = {
      currentRecord,
      selectedDistortions,
      savedRecords: savedWeeklyThoughtRecords,
      moduleId,
      weekNumber,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `weekly-thought-records-week-${weekNumber}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return "bg-green-500";
    if (intensity <= 6) return "bg-yellow-500";
    if (intensity <= 8) return "bg-orange-500";
    return "bg-red-500";
  };

  const getIntensityReduction = () => {
    return Math.max(0, (currentRecord.intensity || 5) - (currentRecord.newIntensity || 5));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Weekly Thought Record Practice
          </CardTitle>
          <p className="text-muted-foreground">
            Identify and challenge anxious thoughts using cognitive behavioral techniques - Week {weekNumber}
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="situation">Situation</TabsTrigger>
          <TabsTrigger value="thoughts">Thoughts</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="balanced">Balanced View</TabsTrigger>
          <TabsTrigger value="action">Action Plan</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Step 1: Situation & Emotions */}
        <TabsContent value="situation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Step 1: Identify the Situation
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Describe the specific situation that triggered your emotions
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="situation">What happened? (Be specific and factual)</Label>
                  {isAutoSaving && (
                    <Badge variant="secondary" className="text-xs">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                      Saving...
                    </Badge>
                  )}
                </div>
                <Textarea
                  id="situation"
                  placeholder="Example: 'I was waiting for a response to an important email I sent 3 days ago...'"
                  value={currentRecord.situation}
                  onChange={(e) => setCurrentRecord(prev => ({ ...prev, situation: e.target.value }))}
                  className="mt-1"
                  rows={4}
                  data-testid="textarea-situation"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="emotion">Primary Emotion</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {emotionOptions.map((emotion) => (
                      <Button
                        key={emotion}
                        variant={currentRecord.emotion === emotion ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentRecord(prev => ({ ...prev, emotion }))}
                        className="justify-start text-sm"
                        data-testid={`button-emotion-${emotion.toLowerCase()}`}
                      >
                        {emotion}
                      </Button>
                    ))}
                  </div>
                  <Input
                    placeholder="Or type your own..."
                    value={currentRecord.emotion || ""}
                    onChange={(e) => setCurrentRecord(prev => ({ ...prev, emotion: e.target.value }))}
                    className="mt-2"
                    data-testid="input-custom-emotion"
                  />
                </div>

                <div>
                  <Label>Emotion Intensity (1-10)</Label>
                  <div className="mt-3 space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm w-8">1</span>
                      <Slider
                        value={[currentRecord.intensity || 5]}
                        onValueChange={([value]) => setCurrentRecord(prev => ({ ...prev, intensity: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                        data-testid="slider-emotion-intensity"
                      />
                      <span className="text-sm w-8">10</span>
                    </div>
                    <div className="text-center">
                      <div className={`inline-block w-8 h-8 rounded-full ${getIntensityColor(currentRecord.intensity || 5)} text-white font-bold flex items-center justify-center`}>
                        {currentRecord.intensity}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {currentRecord.intensity && currentRecord.intensity <= 3 ? "Mild" : 
                         currentRecord.intensity && currentRecord.intensity <= 6 ? "Moderate" : 
                         currentRecord.intensity && currentRecord.intensity <= 8 ? "Strong" : "Very Strong"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="physical">Physical Sensations</Label>
                <Textarea
                  id="physical"
                  placeholder="What did you notice in your body? (tight chest, racing heart, tense shoulders, etc.)"
                  value={currentRecord.physicalSensations}
                  onChange={(e) => setCurrentRecord(prev => ({ ...prev, physicalSensations: e.target.value }))}
                  className="mt-1"
                  rows={3}
                  data-testid="textarea-physical-sensations"
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setActiveTab("thoughts")}
                  disabled={!currentRecord.situation || !currentRecord.emotion}
                  data-testid="button-next-to-thoughts"
                >
                  Next: Identify Thoughts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Automatic Thoughts */}
        <TabsContent value="thoughts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Step 2: Capture Automatic Thoughts
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                What thoughts went through your mind in this situation?
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="automatic-thought">Automatic Thought</Label>
                  {isAutoSaving && (
                    <Badge variant="secondary" className="text-xs">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                      Saving...
                    </Badge>
                  )}
                </div>
                <Textarea
                  id="automatic-thought"
                  placeholder="What exactly went through your mind? Write it as you thought it, even if it seems irrational..."
                  value={currentRecord.automaticThought}
                  onChange={(e) => setCurrentRecord(prev => ({ ...prev, automaticThought: e.target.value }))}
                  className="mt-1"
                  rows={4}
                  data-testid="textarea-automatic-thought"
                />
              </div>

              {/* Cognitive Distortions */}
              <div>
                <div className="flex items-center justify-between">
                  <Label>Thinking Patterns (Cognitive Distortions)</Label>
                  {isAutoSaving && selectedDistortions.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                      Saving...
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Select any thinking patterns that apply to your automatic thought
                </p>
                <div className="space-y-3">
                  {cognitiveDistortions.map((distortion) => (
                    <Card 
                      key={distortion.name} 
                      className={`cursor-pointer transition-colors ${
                        selectedDistortions.includes(distortion.name) 
                          ? 'border-purple-300 bg-purple-50' 
                          : 'hover:bg-secondary/50'
                      }`}
                      onClick={() => toggleDistortion(distortion.name)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{distortion.name}</h4>
                              {selectedDistortions.includes(distortion.name) && (
                                <CheckCircle className="w-4 h-4 text-purple-600" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {distortion.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {distortion.examples.map((example, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  "{example}"
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {selectedDistortions.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Selected Thinking Patterns:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDistortions.map((distortion) => (
                      <Badge key={distortion} className="bg-purple-600">
                        {distortion}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => toggleDistortion(distortion)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("situation")}>
                  Back: Situation
                </Button>
                <Button 
                  onClick={() => setActiveTab("evidence")}
                  disabled={!currentRecord.automaticThought}
                  data-testid="button-next-to-evidence"
                >
                  Next: Examine Evidence
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Evidence */}
        <TabsContent value="evidence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Step 3: Examine the Evidence
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Look at the facts objectively - what supports and contradicts your thought?
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Challenging Questions Helper */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-3">💡 Questions to Help You Think</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {challengingQuestions.map((question, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-blue-700">
                      <span className="text-blue-500">•</span>
                      <span>{question}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="evidence-for">Evidence FOR the thought</Label>
                    {isAutoSaving && currentRecord.evidenceFor && (
                      <Badge variant="secondary" className="text-xs">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                        Saving...
                      </Badge>
                    )}
                  </div>
                  <Textarea
                    id="evidence-for"
                    placeholder="What facts support this thought? What actually happened that makes this thought seem true?"
                    value={currentRecord.evidenceFor}
                    onChange={(e) => setCurrentRecord(prev => ({ ...prev, evidenceFor: e.target.value }))}
                    className="mt-1"
                    rows={6}
                    data-testid="textarea-evidence-for"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="evidence-against">Evidence AGAINST the thought</Label>
                    {isAutoSaving && currentRecord.evidenceAgainst && (
                      <Badge variant="secondary" className="text-xs">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                        Saving...
                      </Badge>
                    )}
                  </div>
                  <Textarea
                    id="evidence-against"
                    placeholder="What facts contradict this thought? What evidence suggests this thought might not be completely true?"
                    value={currentRecord.evidenceAgainst}
                    onChange={(e) => setCurrentRecord(prev => ({ ...prev, evidenceAgainst: e.target.value }))}
                    className="mt-1"
                    rows={6}
                    data-testid="textarea-evidence-against"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("thoughts")}>
                  Back: Thoughts
                </Button>
                <Button 
                  onClick={() => setActiveTab("balanced")}
                  disabled={!currentRecord.evidenceFor && !currentRecord.evidenceAgainst}
                  data-testid="button-next-to-balanced"
                >
                  Next: Create Balanced Thought
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 4: Balanced Thought */}
        <TabsContent value="balanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Step 4: Develop a Balanced Perspective
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Create a more balanced, realistic thought based on the evidence
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="balanced-thought">Balanced/Alternative Thought</Label>
                  {isAutoSaving && currentRecord.balancedThought && (
                    <Badge variant="secondary" className="text-xs">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                      Saving...
                    </Badge>
                  )}
                </div>
                <Textarea
                  id="balanced-thought"
                  placeholder="Based on the evidence, what's a more balanced way to think about this situation? What would you tell a friend?"
                  value={currentRecord.balancedThought}
                  onChange={(e) => setCurrentRecord(prev => ({ ...prev, balancedThought: e.target.value }))}
                  className="mt-1"
                  rows={4}
                  data-testid="textarea-balanced-thought"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-emotion">How do you feel now?</Label>
                    {isAutoSaving && currentRecord.newEmotion && (
                      <Badge variant="secondary" className="text-xs">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                        Saving...
                      </Badge>
                    )}
                  </div>
                  <Input
                    id="new-emotion"
                    placeholder="What's your primary emotion after this balanced thinking?"
                    value={currentRecord.newEmotion}
                    onChange={(e) => setCurrentRecord(prev => ({ ...prev, newEmotion: e.target.value }))}
                    className="mt-1"
                    data-testid="input-new-emotion"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label>New Emotion Intensity (1-10)</Label>
                    {isAutoSaving && currentRecord.newIntensity !== undefined && currentRecord.newIntensity !== null && (
                      <Badge variant="secondary" className="text-xs">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                        Saving...
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm w-8">1</span>
                      <Slider
                        value={[currentRecord.newIntensity || 3]}
                        onValueChange={([value]) => setCurrentRecord(prev => ({ ...prev, newIntensity: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                        data-testid="slider-new-intensity"
                      />
                      <span className="text-sm w-8">10</span>
                    </div>
                    <div className="text-center">
                      <div className={`inline-block w-8 h-8 rounded-full ${getIntensityColor(currentRecord.newIntensity || 3)} text-white font-bold flex items-center justify-center`}>
                        {currentRecord.newIntensity}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvement Indicator */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">Emotional Intensity Change</h4>
                    <p className="text-sm text-green-700">
                      {getIntensityReduction() > 0 
                        ? `Great! Your intensity decreased by ${getIntensityReduction()} points`
                        : "Continue working through the steps to find relief"
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("evidence")}>
                  Back: Evidence
                </Button>
                <Button 
                  onClick={() => setActiveTab("action")}
                  disabled={!currentRecord.balancedThought}
                  data-testid="button-next-to-action"
                >
                  Next: Action Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 5: Action Plan */}
        <TabsContent value="action" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Step 5: Create an Action Plan
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                What specific steps can you take based on your new understanding?
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="action-plan">Action Steps</Label>
                  {isAutoSaving && currentRecord.actionPlan && (
                    <Badge variant="secondary" className="text-xs">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                      Saving...
                    </Badge>
                  )}
                </div>
                <Textarea
                  id="action-plan"
                  placeholder="What can you do differently? What steps will you take? How will you handle similar situations in the future?"
                  value={currentRecord.actionPlan}
                  onChange={(e) => setCurrentRecord(prev => ({ ...prev, actionPlan: e.target.value }))}
                  className="mt-1"
                  rows={4}
                  data-testid="textarea-action-plan"
                />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">📝 Thought Record Summary</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Situation:</strong> {currentRecord.situation || "Not specified"}</div>
                  <div><strong>Original Emotion:</strong> {currentRecord.emotion || "Not specified"} (Intensity: {currentRecord.intensity}/10)</div>
                  <div><strong>Automatic Thought:</strong> {currentRecord.automaticThought || "Not specified"}</div>
                  <div><strong>Balanced Thought:</strong> {currentRecord.balancedThought || "Not specified"}</div>
                  <div><strong>New Emotion:</strong> {currentRecord.newEmotion || "Not specified"} (Intensity: {currentRecord.newIntensity}/10)</div>
                  {selectedDistortions.length > 0 && (
                    <div><strong>Thinking Patterns:</strong> {selectedDistortions.join(", ")}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("balanced")}>
                  Back: Balanced Thought
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportRecord} className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                  <Button 
                    onClick={saveRecord}
                    className="gap-2"
                    data-testid="button-save-record"
                  >
                    <Save className="w-4 h-4" />
                    Save Record
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Saved Weekly Thought Records
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Review your previous thought records for Week {weekNumber} to track patterns and progress
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetForm}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Record
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Loading thought records...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-red-500/50" />
                  <p>Error loading thought records: {error.message}</p>
                  <Button onClick={() => refetchWeeklyThoughtRecords()} className="mt-2">
                    Retry
                  </Button>
                </div>
              ) : savedWeeklyThoughtRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No saved thought records yet for Week {weekNumber}.</p>
                  <p className="text-sm">Complete a thought record to see it here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedWeeklyThoughtRecords.map((record) => (
                    <Card key={record.id} className="border-l-4 border-l-blue-400">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">
                            {record.emotion} → {record.newEmotion || "Not completed"}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={record.newIntensity && record.newIntensity < record.intensity ? "border-green-500 text-green-700" : ""}
                            >
                              {record.intensity} → {record.newIntensity || "N/A"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(record.createdAt || record.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div><strong>Situation:</strong> {(record.situation || '').substring(0, 100)}...</div>
                          <div><strong>Automatic Thought:</strong> {(record.automaticThought || '').substring(0, 100)}...</div>
                          <div><strong>Balanced Thought:</strong> {(record.balancedThought || '').substring(0, 100)}...</div>
                          {record.actionPlan && (
                            <div><strong>Action Plan:</strong> {record.actionPlan.substring(0, 100)}...</div>
                          )}
                        </div>

                        <div className="flex justify-end mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => loadRecord(record)}
                            className="gap-2"
                          >
                            <Brain className="w-4 h-4" />
                            Load into Form
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
