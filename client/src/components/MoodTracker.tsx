import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { apiRequest } from "@/lib/queryClient";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { generateMoodEntriesReport } from "@/lib/pdf-generator";
import { 
  Smile,
  Frown,
  Meh,
  Heart,
  Brain,
  Zap,
  Moon,
  Sun,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar as CalendarIcon,
  Download,
  Plus,
  BarChart3
} from "lucide-react";

interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  energy: number;
  anxiety: number;
  sleep: number;
  emotions: string[];
  activities: string[];
  thoughts: string;
  gratitude: string[];
  challenges: string;
  wins: string;
  notes: string;
}

export function MoodTracker() {
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [currentEntry, setCurrentEntry] = useState<Partial<MoodEntry>>({
    mood: 5,
    energy: 5,
    anxiety: 3,
    sleep: 7,
    emotions: [],
    activities: [],
    thoughts: "",
    gratitude: [""],
    challenges: "",
    wins: "",
    notes: ""
  });
  const [isProgrammaticLoad, setIsProgrammaticLoad] = useState(false);
  const [lastSavedHash, setLastSavedHash] = useState<string>("");

  const [newEmotion, setNewEmotion] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [activeTab, setActiveTab] = useState("daily");
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Load mood entries from database
  const { data: entries = [], refetch: refetchEntries } = useQuery({
    queryKey: ["/api/mood-entries", user?.id],
    enabled: !!user?.id,
  });

  // Create mood entry mutation
  const createMoodEntryMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/mood-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const text = await response.text();
        if (response.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        }
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setCurrentEntryId(data.id);
      setLastSavedHash(JSON.stringify({
        entryDate: selectedDate.toISOString().split('T')[0],
        ...{
          mood: currentEntry.mood || 5,
          energy: currentEntry.energy || 5,
          anxiety: currentEntry.anxiety || 3,
          sleep: currentEntry.sleep || 7,
          emotions: currentEntry.emotions || [],
          activities: currentEntry.activities || [],
          thoughts: currentEntry.thoughts || "",
          gratitude: (currentEntry.gratitude || []).filter(item => item.trim()),
          challenges: currentEntry.challenges || "",
          wins: currentEntry.wins || "",
          notes: currentEntry.notes || ""
        }
      }));
      refetchEntries();
    },
    onError: (error: any) => {
      console.error("Failed to create mood entry:", error);
      toast({
        title: "Save Failed",
        description: `Failed to save mood entry: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update mood entry mutation
  const updateMoodEntryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await fetch(`/api/mood-entries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const text = await response.text();
        if (response.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        }
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      setLastSavedHash(JSON.stringify({
        entryDate: selectedDate.toISOString().split('T')[0],
        ...{
          mood: currentEntry.mood || 5,
          energy: currentEntry.energy || 5,
          anxiety: currentEntry.anxiety || 3,
          sleep: currentEntry.sleep || 7,
          emotions: currentEntry.emotions || [],
          activities: currentEntry.activities || [],
          thoughts: currentEntry.thoughts || "",
          gratitude: (currentEntry.gratitude || []).filter(item => item.trim()),
          challenges: currentEntry.challenges || "",
          wins: currentEntry.wins || "",
          notes: currentEntry.notes || ""
        }
      }));
      refetchEntries();
    },
    onError: (error: any) => {
      console.error("Failed to update mood entry:", error);
      toast({
        title: "Update Failed",
        description: `Failed to update mood entry: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const emotionOptions = [
    { name: "Happy", color: "bg-yellow-400", textColor: "text-yellow-800" },
    { name: "Content", color: "bg-green-400", textColor: "text-green-800" },
    { name: "Excited", color: "bg-orange-400", textColor: "text-orange-800" },
    { name: "Calm", color: "bg-blue-400", textColor: "text-blue-800" },
    { name: "Anxious", color: "bg-red-400", textColor: "text-red-800" },
    { name: "Sad", color: "bg-gray-400", textColor: "text-gray-800" },
    { name: "Angry", color: "bg-red-600", textColor: "text-red-100" },
    { name: "Frustrated", color: "bg-purple-400", textColor: "text-purple-800" },
    { name: "Overwhelmed", color: "bg-red-500", textColor: "text-red-100" },
    { name: "Grateful", color: "bg-pink-400", textColor: "text-pink-800" },
    { name: "Hopeful", color: "bg-cyan-400", textColor: "text-cyan-800" },
    { name: "Lonely", color: "bg-gray-500", textColor: "text-gray-100" },
    { name: "Proud", color: "bg-indigo-400", textColor: "text-indigo-800" },
    { name: "Confused", color: "bg-purple-300", textColor: "text-purple-800" },
    { name: "Peaceful", color: "bg-green-300", textColor: "text-green-800" }
  ];

  const activityOptions = [
    "Exercise/Movement", "Meditation", "Reading", "Work/Study", "Social Time",
    "Nature/Outdoors", "Creative Activity", "Cooking", "Cleaning", "Rest/Nap",
    "Therapy/Counseling", "Medical Appointment", "Shopping", "Entertainment",
    "Self-Care", "Journaling", "Music", "Gaming", "Travel", "Family Time"
  ];

  const getMoodIcon = (mood: number) => {
    if (mood >= 8) return <Smile className="w-6 h-6 text-green-600" />;
    if (mood >= 6) return <Meh className="w-6 h-6 text-yellow-600" />;
    return <Frown className="w-6 h-6 text-red-600" />;
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return "bg-green-500";
    if (mood >= 6) return "bg-yellow-500";
    if (mood === 5) return "bg-orange-500";
    return "bg-red-500"; // mood 1-4
  };

  const toggleEmotion = (emotion: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      emotions: prev.emotions?.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...(prev.emotions || []), emotion]
    }));
  };

  const addCustomEmotion = () => {
    if (newEmotion.trim()) {
      toggleEmotion(newEmotion.trim());
      setNewEmotion("");
    }
  };

  const toggleActivity = (activity: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      activities: prev.activities?.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...(prev.activities || []), activity]
    }));
  };

  const addCustomActivity = () => {
    if (newActivity.trim()) {
      toggleActivity(newActivity.trim());
      setNewActivity("");
    }
  };

  const addGratitudeItem = () => {
    setCurrentEntry(prev => ({
      ...prev,
      gratitude: [...(prev.gratitude || []), ""]
    }));
  };

  const updateGratitudeItem = (index: number, value: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      gratitude: prev.gratitude?.map((item, i) => i === index ? value : item) || []
    }));
  };

  const removeGratitudeItem = (index: number) => {
    setCurrentEntry(prev => ({
      ...prev,
      gratitude: prev.gratitude?.filter((_, i) => i !== index) || []
    }));
  };

  // Auto-save functionality
  useEffect(() => {
    if (!user?.id) return;
    if (isProgrammaticLoad) return; // skip while we're loading existing entry into form

    const { mood, energy, anxiety, sleep, emotions, activities, thoughts, gratitude, challenges, wins, notes } = currentEntry;

    // Only auto-save if we have the minimum required fields
    if (mood !== undefined && energy !== undefined && anxiety !== undefined && sleep !== undefined) {
      // Build a normalized snapshot for hashing to avoid duplicate saves
      const snapshot = JSON.stringify({
        entryDate: selectedDate.toISOString().split('T')[0],
        mood: mood || 5,
        energy: energy || 5,
        anxiety: anxiety || 3,
        sleep: sleep || 7,
        emotions: emotions || [],
        activities: activities || [],
        thoughts: thoughts || "",
        gratitude: (gratitude || []).map((g) => g.trim()).filter(Boolean),
        challenges: challenges || "",
        wins: wins || "",
        notes: notes || ""
      });

      // If nothing changed since last successful save, skip
      if (snapshot === lastSavedHash) return;

      // If a mutation is ongoing, skip to prevent churn
      if (createMoodEntryMutation.isPending || updateMoodEntryMutation.isPending) return;

      setIsAutoSaving(true);

      // Clear existing timeout
      clearTimeout((window as any).moodEntrySaveTimeout);

      (window as any).moodEntrySaveTimeout = setTimeout(() => {
        const saveData = {
          userId: user.id,
          entryDate: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
          mood: mood || 5,
          energy: energy || 5,
          anxiety: anxiety || 3,
          sleep: sleep || 7,
          emotions: emotions || [],
          activities: activities || [],
          thoughts: thoughts || "",
          gratitude: (gratitude || []).map((g) => g.trim()).filter(Boolean),
          challenges: challenges || "",
          wins: wins || "",
          notes: notes || ""
        };

        if (currentEntryId) {
          // Update existing entry
          updateMoodEntryMutation.mutate({ id: currentEntryId, updates: saveData }, {
            onSettled: () => setIsAutoSaving(false)
          });
        } else {
          // Create new entry
          createMoodEntryMutation.mutate(saveData, {
            onSettled: () => setIsAutoSaving(false)
          });
        }
      }, 600); // 600ms debounce
    }

    return () => {
      clearTimeout((window as any).moodEntrySaveTimeout);
    };
  }, [currentEntry.mood, currentEntry.energy, currentEntry.anxiety, currentEntry.sleep, currentEntry.emotions, currentEntry.activities, currentEntry.thoughts, currentEntry.gratitude, currentEntry.challenges, currentEntry.wins, currentEntry.notes, user?.id, currentEntryId, selectedDate, lastSavedHash, isProgrammaticLoad, createMoodEntryMutation.isPending, updateMoodEntryMutation.isPending]);

  const saveEntry = () => {
    if (!user?.id) return;

    const saveData = {
      userId: user.id,
      entryDate: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
      mood: currentEntry.mood || 5,
      energy: currentEntry.energy || 5,
      anxiety: currentEntry.anxiety || 3,
      sleep: currentEntry.sleep || 7,
      emotions: currentEntry.emotions || [],
      activities: currentEntry.activities || [],
      thoughts: currentEntry.thoughts || "",
      gratitude: (currentEntry.gratitude || []).filter(item => item.trim()),
      challenges: currentEntry.challenges || "",
      wins: currentEntry.wins || "",
      notes: currentEntry.notes || ""
    };

    if (currentEntryId) {
      // Update existing entry
      updateMoodEntryMutation.mutate({
        id: currentEntryId,
        updates: saveData
      }, {
        onSuccess: () => {
          toast({
            title: "Entry Updated",
            description: "Your mood entry has been updated successfully.",
          });
        }
      });
    } else {
      // Create new entry
      createMoodEntryMutation.mutate(saveData, {
        onSuccess: () => {
          toast({
            title: "Entry Saved",
            description: "Your mood entry has been saved successfully.",
          });
        }
      });
    }
  };

  const loadEntryForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const existing = entries.find(e => e.entryDate === dateString);
    setIsProgrammaticLoad(true);
    if (existing) {
      setCurrentEntryId(existing.id);
      setCurrentEntry({
        mood: existing.mood,
        energy: existing.energy,
        anxiety: existing.anxiety,
        sleep: existing.sleep,
        emotions: existing.emotions || [],
        activities: existing.activities || [],
        thoughts: existing.thoughts || "",
        gratitude: (existing.gratitude && existing.gratitude.length > 0) ? existing.gratitude : [""],
        challenges: existing.challenges || "",
        wins: existing.wins || "",
        notes: existing.notes || ""
      });
      // Update lastSavedHash to the loaded snapshot to avoid immediate re-save
      setLastSavedHash(JSON.stringify({
        entryDate: dateString,
        mood: existing.mood,
        energy: existing.energy,
        anxiety: existing.anxiety,
        sleep: existing.sleep,
        emotions: existing.emotions || [],
        activities: existing.activities || [],
        thoughts: existing.thoughts || "",
        gratitude: (existing.gratitude || []).map((g: string) => g.trim()).filter(Boolean),
        challenges: existing.challenges || "",
        wins: existing.wins || "",
        notes: existing.notes || ""
      }));
    } else {
      setCurrentEntryId(null);
      setCurrentEntry({
        mood: 5,
        energy: 5,
        anxiety: 3,
        sleep: 7,
        emotions: [],
        activities: [],
        thoughts: "",
        gratitude: [""],
        challenges: "",
        wins: "",
        notes: ""
      });
      setLastSavedHash("");
    }
    // Allow autosave after state is settled
    setTimeout(() => setIsProgrammaticLoad(false), 0);
  };

  // Load entry when component mounts or entries change
  useEffect(() => {
    // Always use today's date for daily entry
    const today = new Date();
    setSelectedDate(today);
    loadEntryForDate(today);
  }, [entries]);

  const getAverageForPeriod = (days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffString = cutoff.toISOString().split('T')[0];
    
    const recentEntries = entries.filter(e => e.entryDate >= cutoffString);
    
    if (recentEntries.length === 0) return null;
    
    return {
      mood: Math.round(recentEntries.reduce((sum, e) => sum + e.mood, 0) / recentEntries.length * 10) / 10,
      energy: Math.round(recentEntries.reduce((sum, e) => sum + e.energy, 0) / recentEntries.length * 10) / 10,
      anxiety: Math.round(recentEntries.reduce((sum, e) => sum + e.anxiety, 0) / recentEntries.length * 10) / 10,
      sleep: Math.round(recentEntries.reduce((sum, e) => sum + e.sleep, 0) / recentEntries.length * 10) / 10,
      count: recentEntries.length
    };
  };

  const exportData = () => {
    if (!user || entries.length === 0) {
      toast({
        title: "No Data to Export",
        description: "You need to have mood entries to export a report.",
        variant: "destructive",
      });
      return;
    }

    try {
      const reportData = {
        user,
        entries,
        generatedAt: new Date()
      };

      const doc = generateMoodEntriesReport(reportData);
      const fileName = `mood-tracker-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: "Report Generated",
        description: "Your mood tracker report has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-600" />
            Interactive Mood Tracker
          </CardTitle>
          <p className="text-muted-foreground">
            Track your daily mood, emotions, and wellbeing patterns over time
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">Daily Entry</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Daily Entry Tab */}
        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Daily Mood Entry
                </CardTitle>
                <Badge variant="secondary">
                  {selectedDate.toLocaleDateString('en-GB')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Core Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Overall Mood (1-10)
                    </Label>
                    {isAutoSaving && (
                      <Badge variant="secondary" className="text-xs">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                        Saving...
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-sm w-12">Terrible</span>
                      <Slider
                        value={[currentEntry.mood || 5]}
                        onValueChange={([value]) => setCurrentEntry(prev => ({ ...prev, mood: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                        data-testid="slider-mood"
                      />
                      <span className="text-sm w-12">Amazing</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      {getMoodIcon(currentEntry.mood || 5)}
                      <div className={`w-8 h-8 rounded-full ${getMoodColor(currentEntry.mood || 5)} text-white font-bold flex items-center justify-center`}>
                        {currentEntry.mood}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4" />
                    Energy Level (1-10)
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-sm w-12">Drained</span>
                      <Slider
                        value={[currentEntry.energy || 5]}
                        onValueChange={([value]) => setCurrentEntry(prev => ({ ...prev, energy: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                        data-testid="slider-energy"
                      />
                      <span className="text-sm w-12">Energized</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center mx-auto">
                        {currentEntry.energy}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4" />
                    Anxiety Level (1-10)
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-sm w-8">Calm</span>
                      <Slider
                        value={[currentEntry.anxiety || 3]}
                        onValueChange={([value]) => setCurrentEntry(prev => ({ ...prev, anxiety: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                        data-testid="slider-anxiety"
                      />
                      <span className="text-sm w-8">Anxious</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-full bg-red-500 text-white font-bold flex items-center justify-center mx-auto">
                        {currentEntry.anxiety}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Moon className="w-4 h-4" />
                    Sleep Quality (1-10)
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-sm w-8">Poor</span>
                      <Slider
                        value={[currentEntry.sleep || 7]}
                        onValueChange={([value]) => setCurrentEntry(prev => ({ ...prev, sleep: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                        data-testid="slider-sleep"
                      />
                      <span className="text-sm w-12">Excellent</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center mx-auto">
                        {currentEntry.sleep}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emotions */}
              <div>
                <Label className="text-base font-semibold mb-4 block">Emotions I Felt Today</Label>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {emotionOptions.map((emotion) => (
                      <Button
                        key={emotion.name}
                        variant={currentEntry.emotions?.includes(emotion.name) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleEmotion(emotion.name)}
                        className={currentEntry.emotions?.includes(emotion.name) ? 
                          `${emotion.color} ${emotion.textColor} border-0` : 
                          ""
                        }
                        data-testid={`emotion-${emotion.name.toLowerCase()}`}
                      >
                        {emotion.name}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom emotion..."
                      value={newEmotion}
                      onChange={(e) => setNewEmotion(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomEmotion()}
                      data-testid="input-custom-emotion"
                    />
                    <Button onClick={addCustomEmotion} size="sm" data-testid="button-add-emotion">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div>
                <Label className="text-base font-semibold mb-4 block">Activities & Experiences</Label>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {activityOptions.map((activity) => (
                      <Button
                        key={activity}
                        variant={currentEntry.activities?.includes(activity) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleActivity(activity)}
                        className="text-xs justify-start"
                        data-testid={`activity-${activity.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        {activity}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom activity..."
                      value={newActivity}
                      onChange={(e) => setNewActivity(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomActivity()}
                      data-testid="input-custom-activity"
                    />
                    <Button onClick={addCustomActivity} size="sm" data-testid="button-add-activity">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Thoughts & Reflections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="thoughts" className="text-base font-semibold">Key Thoughts Today</Label>
                  <Textarea
                    id="thoughts"
                    placeholder="What thoughts went through your mind today? Any patterns or themes?"
                    value={currentEntry.thoughts}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, thoughts: e.target.value }))}
                    className="mt-2"
                    rows={4}
                    data-testid="textarea-thoughts"
                  />
                </div>

                <div>
                  <Label htmlFor="challenges" className="text-base font-semibold">Today's Challenges</Label>
                  <Textarea
                    id="challenges"
                    placeholder="What was difficult today? How did you handle it?"
                    value={currentEntry.challenges}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, challenges: e.target.value }))}
                    className="mt-2"
                    rows={4}
                    data-testid="textarea-challenges"
                  />
                </div>
              </div>

              {/* Gratitude & Wins */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold">Gratitude List</Label>
                    <Button onClick={addGratitudeItem} size="sm" variant="outline" data-testid="button-add-gratitude">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(currentEntry.gratitude || [""]).map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Something you're grateful for #${index + 1}...`}
                          value={item}
                          onChange={(e) => updateGratitudeItem(index, e.target.value)}
                          data-testid={`input-gratitude-${index}`}
                        />
                        {index > 0 && (
                          <Button
                            onClick={() => removeGratitudeItem(index)}
                            size="sm"
                            variant="outline"
                            className="px-2"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="wins" className="text-base font-semibold">Today's Wins</Label>
                  <Textarea
                    id="wins"
                    placeholder="What went well today? Any accomplishments, big or small?"
                    value={currentEntry.wins}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, wins: e.target.value }))}
                    className="mt-2"
                    rows={4}
                    data-testid="textarea-wins"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="notes" className="text-base font-semibold">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Anything else you'd like to remember about today?"
                  value={currentEntry.notes}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-2"
                  rows={3}
                  data-testid="textarea-notes"
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-center pt-4">
                <Button onClick={saveEntry} className="px-8" data-testid="button-save-entry">
                  Save Today's Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mood Calendar</CardTitle>
              <p className="text-sm text-muted-foreground">
                Click on a date to view or edit that day's entry
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      loadEntryForDate(date);
                      setActiveTab("daily");
                    }
                  }}
                  className="rounded-md border"
                  modifiers={{
                    hasEntry: (date) => entries.some(e => e.entryDate === date.toISOString().split('T')[0]),
                    mood1: (date) => {
                      const entry = entries.find(e => e.entryDate === date.toISOString().split('T')[0]);
                      return entry ? entry.mood === 1 : false;
                    },
                    mood2: (date) => {
                      const entry = entries.find(e => e.entryDate === date.toISOString().split('T')[0]);
                      return entry ? entry.mood === 2 : false;
                    },
                    mood3: (date) => {
                      const entry = entries.find(e => e.entryDate === date.toISOString().split('T')[0]);
                      return entry ? entry.mood === 3 : false;
                    },
                    mood4: (date) => {
                      const entry = entries.find(e => e.entryDate === date.toISOString().split('T')[0]);
                      return entry ? entry.mood === 4 : false;
                    },
                    mood5: (date) => {
                      const entry = entries.find(e => e.entryDate === date.toISOString().split('T')[0]);
                      return entry ? entry.mood === 5 : false;
                    },
                    mood6: (date) => {
                      const entry = entries.find(e => e.entryDate === date.toISOString().split('T')[0]);
                      return entry ? entry.mood === 6 : false;
                    },
                    mood7: (date) => {
                      const entry = entries.find(e => e.entryDate === date.toISOString().split('T')[0]);
                      return entry ? entry.mood === 7 : false;
                    },
                    mood8: (date) => {
                      const entry = entries.find(e => e.entryDate === date.toISOString().split('T')[0]);
                      return entry ? entry.mood === 8 : false;
                    },
                    mood9: (date) => {
                      const entry = entries.find(e => e.entryDate === date.toISOString().split('T')[0]);
                      return entry ? entry.mood === 9 : false;
                    },
                    mood10: (date) => {
                      const entry = entries.find(e => e.entryDate === date.toISOString().split('T')[0]);
                      return entry ? entry.mood === 10 : false;
                    }
                  }}
                  modifiersStyles={{
                    hasEntry: { fontWeight: 'bold' },
                    mood1: { backgroundColor: '#dc2626', color: 'white' }, // Red
                    mood2: { backgroundColor: '#dc2626', color: 'white' }, // Red
                    mood3: { backgroundColor: '#dc2626', color: 'white' }, // Red
                    mood4: { backgroundColor: '#dc2626', color: 'white' }, // Red
                    mood5: { backgroundColor: '#f97316', color: 'white' }, // Orange
                    mood6: { backgroundColor: '#eab308', color: 'white' }, // Yellow
                    mood7: { backgroundColor: '#eab308', color: 'white' }, // Yellow
                    mood8: { backgroundColor: '#22c55e', color: 'white' }, // Green
                    mood9: { backgroundColor: '#22c55e', color: 'white' }, // Green
                    mood10: { backgroundColor: '#22c55e', color: 'white' } // Green
                  }}
                />
              </div>
              
              <div className="flex justify-center gap-3 mt-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                  <span>Mood 1-4</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span>Mood 5</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Mood 6-7</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Mood 8-10</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-800 rounded"></div>
                  <span>Entry exists</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[7, 14, 30].map(days => {
              const stats = getAverageForPeriod(days);
              return (
                <Card key={days}>
                  <CardHeader>
                    <CardTitle className="text-lg">Last {days} Days</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <Badge variant="secondary">{stats.count} entries</Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Avg Mood:</span>
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full ${getMoodColor(stats.mood)} text-white text-sm font-bold flex items-center justify-center`}>
                                {stats.mood}
                              </div>
                              {getMoodIcon(stats.mood)}
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Avg Energy:</span>
                            <span className="font-medium">{stats.energy}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Avg Anxiety:</span>
                            <span className="font-medium">{stats.anxiety}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Avg Sleep:</span>
                            <span className="font-medium">{stats.sleep}/10</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center">
                        No entries in this period
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Mood Patterns & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {entries.length >= 7 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Most Common Emotions</h4>
                      <div className="space-y-1">
                        {Object.entries(
                          entries.reduce((acc: Record<string, number>, entry) => {
                            entry.emotions.forEach(emotion => {
                              acc[emotion] = (acc[emotion] || 0) + 1;
                            });
                            return acc;
                          }, {})
                        )
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([emotion, count]) => (
                          <div key={emotion} className="flex justify-between text-sm">
                            <span>{emotion}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Most Frequent Activities</h4>
                      <div className="space-y-1">
                        {Object.entries(
                          entries.reduce((acc: Record<string, number>, entry) => {
                            entry.activities.forEach(activity => {
                              acc[activity] = (acc[activity] || 0) + 1;
                            });
                            return acc;
                          }, {})
                        )
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([activity, count]) => (
                          <div key={activity} className="flex justify-between text-sm">
                            <span>{activity}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Track your mood for at least 7 days to see patterns and insights.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mood History</CardTitle>
                {entries.length > 0 && (
                  <Button onClick={exportData} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export PDF Report
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No mood entries yet.</p>
                  <p className="text-sm">Start tracking to see your history here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.slice(0, 10).map((entry) => (
                    <Card key={entry.id} className="border-l-4 border-l-blue-400">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium flex items-center gap-2">
                            {getMoodIcon(entry.mood)}
                            {new Date(entry.entryDate).toLocaleDateString('en-GB')}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Mood: {entry.mood}/10</Badge>
                            <Badge variant="outline">Energy: {entry.energy}/10</Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Emotions:</strong> {entry.emotions.join(", ") || "None recorded"}
                          </div>
                          <div>
                            <strong>Activities:</strong> {entry.activities.slice(0, 3).join(", ")}
                            {entry.activities.length > 3 && `... +${entry.activities.length - 3} more`}
                          </div>
                          {entry.thoughts && (
                            <div className="md:col-span-2">
                              <strong>Thoughts:</strong> {entry.thoughts.substring(0, 150)}
                              {entry.thoughts.length > 150 && "..."}
                            </div>
                          )}
                          {entry.gratitude.length > 0 && (
                            <div className="md:col-span-2">
                              <strong>Gratitude:</strong> {entry.gratitude.filter(g => g.trim()).join(" • ")}
                            </div>
                          )}
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

      {/* Tips */}
      <Card className="bg-pink-50 border-pink-200">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 text-pink-800">💡 Mood Tracking Tips</h4>
          <div className="space-y-2 text-sm text-pink-700">
            <p>• Track consistently, even on days when you feel "normal" or neutral</p>
            <p>• Be honest - there's no "right" or "wrong" mood to have</p>
            <p>• Look for patterns over time rather than focusing on individual days</p>
            <p>• Use this data to identify triggers, helpful activities, and coping strategies</p>
            <p>• Share trends with your healthcare provider to inform treatment</p>
            <p>• Remember: mood tracking is a tool for awareness, not self-judgment</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}