import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, Target, Users, Sparkles, Shield, Smile, Download } from "lucide-react";

interface LifeArea {
  area: string;
  importance: number;
  currentAlignment: number;
  values: string;
  barriers: string;
}

interface ValuesData {
  lifeAreas: LifeArea[];
  top3Values: string[];
  valuesInAction: {
    today: string;
    thisWeek: string;
    thisMonth: string;
    anxietyManagement: string;
  };
  completionStatements: {
    mostAlive: string;
    admireOthers: string;
    unlimitedResources: string;
    rememberedFor: string;
    feelProud: string;
  };
  actionPlan: {
    value1: { name: string; currentState: string; idealState: string; barriers: string; weeklyAction: string };
    value2: { name: string; currentState: string; idealState: string; barriers: string; weeklyAction: string };
    value3: { name: string; currentState: string; idealState: string; barriers: string; weeklyAction: string };
  };
}

const defaultLifeAreas: LifeArea[] = [
  { area: "Family relationships", importance: 5, currentAlignment: 5, values: "", barriers: "" },
  { area: "Friendships", importance: 5, currentAlignment: 5, values: "", barriers: "" },
  { area: "Career/work", importance: 5, currentAlignment: 5, values: "", barriers: "" },
  { area: "Education/learning", importance: 5, currentAlignment: 5, values: "", barriers: "" },
  { area: "Health/fitness", importance: 5, currentAlignment: 5, values: "", barriers: "" },
  { area: "Recreation/fun", importance: 5, currentAlignment: 5, values: "", barriers: "" },
  { area: "Community involvement", importance: 5, currentAlignment: 5, values: "", barriers: "" },
  { area: "Spirituality/personal growth", importance: 5, currentAlignment: 5, values: "", barriers: "" }
];

const valueExamples = {
  connection: ["Love", "Intimacy", "Friendship", "Belonging", "Trust", "Loyalty", "Support"],
  growth: ["Learning", "Creativity", "Achievement", "Mastery", "Adventure", "Curiosity"],
  contribution: ["Helping others", "Making a difference", "Justice", "Compassion", "Service"],
  authenticity: ["Honesty", "Integrity", "Being true to yourself", "Independence"],
  security: ["Safety", "Stability", "Predictability", "Financial security"],
  fun: ["Playfulness", "Humor", "Enjoyment", "Spontaneity", "Celebration"]
};

export function ValuesWorksheet() {
  const [currentStep, setCurrentStep] = useState(1);
  const [valuesData, setValuesData] = useState<ValuesData>({
    lifeAreas: defaultLifeAreas,
    top3Values: ["", "", ""],
    valuesInAction: {
      today: "",
      thisWeek: "",
      thisMonth: "",
      anxietyManagement: ""
    },
    completionStatements: {
      mostAlive: "",
      admireOthers: "",
      unlimitedResources: "",
      rememberedFor: "",
      feelProud: ""
    },
    actionPlan: {
      value1: { name: "", currentState: "", idealState: "", barriers: "", weeklyAction: "" },
      value2: { name: "", currentState: "", idealState: "", barriers: "", weeklyAction: "" },
      value3: { name: "", currentState: "", idealState: "", barriers: "", weeklyAction: "" }
    }
  });

  const updateLifeArea = (index: number, field: keyof LifeArea, value: any) => {
    setValuesData(prev => ({
      ...prev,
      lifeAreas: prev.lifeAreas.map((area, i) => 
        i === index ? { ...area, [field]: value } : area
      )
    }));
  };

  const updateTop3Values = (index: number, value: string) => {
    setValuesData(prev => ({
      ...prev,
      top3Values: prev.top3Values.map((val, i) => i === index ? value : val)
    }));
  };

  const updateCompletionStatement = (field: keyof typeof valuesData.completionStatements, value: string) => {
    setValuesData(prev => ({
      ...prev,
      completionStatements: { ...prev.completionStatements, [field]: value }
    }));
  };

  const updateValuesInAction = (field: keyof typeof valuesData.valuesInAction, value: string) => {
    setValuesData(prev => ({
      ...prev,
      valuesInAction: { ...prev.valuesInAction, [field]: value }
    }));
  };

  const updateActionPlan = (valueKey: keyof typeof valuesData.actionPlan, field: string, value: string) => {
    setValuesData(prev => ({
      ...prev,
      actionPlan: {
        ...prev.actionPlan,
        [valueKey]: { ...prev.actionPlan[valueKey], [field]: value }
      }
    }));
  };

  const exportWorksheet = () => {
    const worksheetData = JSON.stringify(valuesData, null, 2);
    const blob = new Blob([worksheetData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'values-assessment.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Step 1: Life Areas Assessment</h3>
        <p className="text-muted-foreground">Rate how important each area is to you and how well you're currently living according to your values in that area.</p>
      </div>
      
      <div className="grid gap-4">
        {valuesData.lifeAreas.map((area, index) => (
          <Card key={area.area} className="p-4">
            <div className="space-y-4">
              <h4 className="font-medium">{area.area}</h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Importance (1-10)</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Slider
                      value={[area.importance]}
                      onValueChange={([value]) => updateLifeArea(index, 'importance', value)}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <Badge variant="outline" className="min-w-[3rem]">{area.importance}</Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm">Current Alignment (1-10)</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Slider
                      value={[area.currentAlignment]}
                      onValueChange={([value]) => updateLifeArea(index, 'currentAlignment', value)}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <Badge variant="outline" className="min-w-[3rem]">{area.currentAlignment}</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm">What values are important to you in this area?</Label>
                <Input
                  placeholder="e.g., connection, growth, creativity..."
                  value={area.values}
                  onChange={(e) => updateLifeArea(index, 'values', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-sm">What barriers (especially anxiety-related) hold you back?</Label>
                <Input
                  placeholder="e.g., social anxiety, fear of failure..."
                  value={area.barriers}
                  onChange={(e) => updateLifeArea(index, 'barriers', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Step 2: Values Clarification</h3>
        <p className="text-muted-foreground">Complete these sentences to gain deeper insight into your values.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">I feel most alive and energized when I am...</Label>
          <Textarea
            placeholder="Describe what makes you feel most energetic and engaged"
            value={valuesData.completionStatements.mostAlive}
            onChange={(e) => updateCompletionStatement('mostAlive', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium">The people I most admire tend to be...</Label>
          <Textarea
            placeholder="What qualities do you admire in others?"
            value={valuesData.completionStatements.admireOthers}
            onChange={(e) => updateCompletionStatement('admireOthers', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium">If I had unlimited time and resources, I would spend my time...</Label>
          <Textarea
            placeholder="What would you do if there were no constraints?"
            value={valuesData.completionStatements.unlimitedResources}
            onChange={(e) => updateCompletionStatement('unlimitedResources', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium">When I look back on my life, I want to be remembered for...</Label>
          <Textarea
            placeholder="What legacy do you want to leave?"
            value={valuesData.completionStatements.rememberedFor}
            onChange={(e) => updateCompletionStatement('rememberedFor', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium">The times I feel most proud of myself are when I...</Label>
          <Textarea
            placeholder="What actions make you feel proud and fulfilled?"
            value={valuesData.completionStatements.feelProud}
            onChange={(e) => updateCompletionStatement('feelProud', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      
      <Card className="p-4 bg-muted/50">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Value Examples for Inspiration
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {Object.entries(valueExamples).map(([category, values]) => (
            <div key={category}>
              <h5 className="font-medium mb-1 capitalize">{category}:</h5>
              <div className="flex flex-wrap gap-1">
                {values.map(value => (
                  <Badge key={value} variant="outline" className="text-xs">{value}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Step 3: Identify Your Top 3 Values</h3>
        <p className="text-muted-foreground">Based on your assessment, identify your three most important values.</p>
      </div>
      
      <div className="space-y-4">
        {[0, 1, 2].map((index) => (
          <div key={index}>
            <Label className="text-sm font-medium">Core Value #{index + 1}</Label>
            <Input
              placeholder={`Enter your ${['first', 'second', 'third'][index]} most important value`}
              value={valuesData.top3Values[index]}
              onChange={(e) => updateTop3Values(index, e.target.value)}
              className="mt-1"
            />
          </div>
        ))}
      </div>
      
      <Card className="p-4">
        <h4 className="font-medium mb-3">Values-Based Goal Setting</h4>
        <div className="space-y-4">
          <div>
            <Label className="text-sm">One thing I could do TODAY that aligns with my values:</Label>
            <Input
              placeholder="A small action you can take today"
              value={valuesData.valuesInAction.today}
              onChange={(e) => updateValuesInAction('today', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-sm">One thing I could do THIS WEEK:</Label>
            <Input
              placeholder="A meaningful action for this week"
              value={valuesData.valuesInAction.thisWeek}
              onChange={(e) => updateValuesInAction('thisWeek', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-sm">One thing I could work toward THIS MONTH:</Label>
            <Input
              placeholder="A bigger goal to work toward"
              value={valuesData.valuesInAction.thisMonth}
              onChange={(e) => updateValuesInAction('thisMonth', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-sm">How I'll handle anxiety while pursuing these values:</Label>
            <Textarea
              placeholder="What strategies will you use when anxiety tries to pull you away from your values?"
              value={valuesData.valuesInAction.anxietyManagement}
              onChange={(e) => updateValuesInAction('anxietyManagement', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Step 4: Create Your Action Plan</h3>
        <p className="text-muted-foreground">For each of your top 3 values, create a detailed action plan.</p>
      </div>
      
      {(['value1', 'value2', 'value3'] as const).map((valueKey, index) => (
        <Card key={valueKey} className="p-4">
          <h4 className="font-medium mb-4">Value #{index + 1}: {valuesData.top3Values[index] || 'Enter value above'}</h4>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm">How does this value currently show up in your life?</Label>
              <Textarea
                placeholder="Describe how you currently live this value"
                value={valuesData.actionPlan[valueKey].currentState}
                onChange={(e) => updateActionPlan(valueKey, 'currentState', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm">What would living this value more fully look like?</Label>
              <Textarea
                placeholder="Describe your ideal way of living this value"
                value={valuesData.actionPlan[valueKey].idealState}
                onChange={(e) => updateActionPlan(valueKey, 'idealState', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm">What anxiety-related barriers hold you back?</Label>
              <Textarea
                placeholder="What fears or anxieties prevent you from fully living this value?"
                value={valuesData.actionPlan[valueKey].barriers}
                onChange={(e) => updateActionPlan(valueKey, 'barriers', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm">One specific action you could take this week:</Label>
              <Input
                placeholder="A concrete step toward this value"
                value={valuesData.actionPlan[valueKey].weeklyAction}
                onChange={(e) => updateActionPlan(valueKey, 'weeklyAction', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const steps = [
    { number: 1, title: "Life Areas", icon: Heart },
    { number: 2, title: "Clarification", icon: Target },
    { number: 3, title: "Top 3 Values", icon: Users },
    { number: 4, title: "Action Plan", icon: Sparkles }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Values Assessment Worksheet</span>
          <Button variant="outline" size="sm" onClick={exportWorksheet}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </CardTitle>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mt-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                  isActive ? 'border-primary bg-primary text-primary-foreground' :
                  isCompleted ? 'border-green-500 bg-green-500 text-white' :
                  'border-muted-foreground bg-background'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium">{step.title}</span>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-muted mx-4" />
                )}
              </div>
            );
          })}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          
          <Separator />
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <Button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              disabled={currentStep === 4}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}