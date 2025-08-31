import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  BookOpen,
  Brain,
  Shield,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  AlertCircle,
  Clock,
  Target,
  TrendingUp
} from "lucide-react";

interface LearningProgress {
  moduleId: string;
  completed: boolean;
  timeSpent: number;
  quizScore?: number;
  notes: string;
}

export function AnxietyGuide() {
  const [activeModule, setActiveModule] = useState("overview");
  const [progress, setProgress] = useState<Record<string, LearningProgress>>({});
  const [currentQuizAnswers, setCurrentQuizAnswers] = useState<Record<string, string>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});

  const modules = {
    overview: {
      title: "What is Anxiety?",
      duration: "5 min read",
      icon: Brain,
      content: {
        sections: [
          {
            title: "Understanding Anxiety",
            content: `Anxiety is a natural human response designed to keep us safe. It's your body's alarm system that activates when it perceives danger - whether real or imagined.

**Normal vs. Problematic Anxiety:**
• **Normal anxiety** helps you prepare for important events (job interviews, exams)
• **Problematic anxiety** occurs when the alarm system is oversensitive or stuck "on"
• It becomes a problem when it interferes with daily life, relationships, or activities you enjoy`
          },
          {
            title: "The Anxiety Response",
            content: `When you feel anxious, your body activates the "fight-flight-freeze" response:

**Physical Changes:**
• Heart rate increases to pump blood to muscles
• Breathing becomes faster to get more oxygen
• Muscles tense up to prepare for action
• Sweating increases to cool the body
• Digestive system slows down (butterflies in stomach)

**Mental Changes:**
• Attention narrows to focus on the threat
• Memory becomes focused on danger-related information
• Decision-making can become impaired
• Thoughts may race or become repetitive`
          },
          {
            title: "Types of Anxiety",
            content: `Anxiety can show up in different ways:

**Generalized Anxiety:** Persistent worry about various life areas
**Social Anxiety:** Fear of social situations and judgment
**Panic Attacks:** Sudden, intense episodes of fear
**Specific Phobias:** Fear of particular objects or situations
**Health Anxiety:** Excessive worry about physical symptoms
**Performance Anxiety:** Fear of performing in front of others`
          }
        ],
        quiz: [
          {
            question: "What is the primary purpose of anxiety from an evolutionary perspective?",
            options: [
              "To make us feel bad about ourselves",
              "To keep us safe from potential dangers",
              "To prevent us from taking any risks",
              "To make us more social"
            ],
            correct: 1,
            explanation: "Anxiety evolved as a protective mechanism to help our ancestors survive by detecting and responding to threats."
          },
          {
            question: "Which of these is NOT a normal physical symptom of anxiety?",
            options: [
              "Increased heart rate",
              "Muscle tension",
              "Improved digestion",
              "Faster breathing"
            ],
            correct: 2,
            explanation: "During anxiety, digestion actually slows down as blood flow is redirected to muscles and organs needed for the fight-or-flight response."
          }
        ]
      }
    },
    symptoms: {
      title: "Recognizing Symptoms",
      duration: "7 min read",
      icon: AlertCircle,
      content: {
        sections: [
          {
            title: "Physical Symptoms",
            content: `Anxiety affects your body in many ways. Learning to recognize these symptoms helps you understand what you're experiencing:

**Cardiovascular:**
• Racing or pounding heart
• Chest tightness or pain
• Feeling faint or dizzy

**Respiratory:**
• Shortness of breath
• Rapid breathing
• Feeling like you can't get enough air

**Muscular:**
• Muscle tension, especially in neck, shoulders, jaw
• Trembling or shaking
• Restlessness or feeling "keyed up"

**Digestive:**
• Nausea or stomach upset
• "Butterflies" in stomach
• Changes in appetite
• Digestive issues

**Neurological:**
• Headaches
• Sweating or hot flashes
• Feeling detached from yourself or surroundings`
          },
          {
            title: "Emotional & Mental Symptoms",
            content: `Anxiety also affects how you think and feel:

**Emotional Symptoms:**
• Feeling nervous, restless, or on edge
• Sense of impending doom or danger
• Irritability or feeling "snappy"
• Feeling overwhelmed
• Fear of losing control

**Cognitive Symptoms:**
• Racing thoughts or mind going blank
• Difficulty concentrating
• Excessive worry about future events
• Catastrophic thinking ("what if the worst happens?")
• Rumination (repetitive, unhelpful thoughts)
• Memory problems
• Difficulty making decisions`
          },
          {
            title: "Behavioral Changes",
            content: `Anxiety often leads to changes in behavior:

**Avoidance Behaviors:**
• Avoiding situations that trigger anxiety
• Procrastination on important tasks
• Canceling social plans
• Avoiding physical sensations (like exercise)

**Safety Behaviors:**
• Checking things repeatedly
• Seeking excessive reassurance
• Always having an "escape plan"
• Staying only in "safe" environments

**Other Changes:**
• Changes in sleep patterns
• Changes in eating habits
• Increased use of alcohol or substances
• Restless or fidgety behavior`
          }
        ],
        quiz: [
          {
            question: "Which physical symptom is commonly mistaken for a heart problem during anxiety?",
            options: [
              "Sweating",
              "Nausea", 
              "Racing heart and chest tightness",
              "Muscle tension"
            ],
            correct: 2,
            explanation: "Racing heart and chest tightness are common anxiety symptoms that people often mistake for heart problems. It's always good to check with a doctor if you're concerned."
          },
          {
            question: "What type of thinking pattern involves imagining the worst possible outcome?",
            options: [
              "Catastrophic thinking",
              "Racing thoughts",
              "Memory problems",
              "Concentration difficulties"
            ],
            correct: 0,
            explanation: "Catastrophic thinking is when we imagine the worst possible scenarios, which is a common pattern in anxiety."
          }
        ]
      }
    },
    causes: {
      title: "Understanding Causes",
      duration: "6 min read", 
      icon: Target,
      content: {
        sections: [
          {
            title: "Biological Factors",
            content: `Several biological factors can contribute to anxiety:

**Genetics:**
• Family history of anxiety disorders increases risk
• Not deterministic - having anxious parents doesn't guarantee you'll have anxiety
• Multiple genes likely involved, each with small effects

**Brain Chemistry:**
• Neurotransmitters (brain chemicals) like serotonin, dopamine, and GABA
• Areas of the brain involved: amygdala (fear center), prefrontal cortex (rational thinking)
• Stress hormones like cortisol and adrenaline

**Physical Health:**
• Thyroid problems can mimic anxiety symptoms
• Caffeine sensitivity can trigger anxiety-like symptoms
• Blood sugar fluctuations
• Some medications can cause anxiety as a side effect`
          },
          {
            title: "Psychological Factors",
            content: `How we think and process information affects anxiety:

**Cognitive Patterns:**
• Overestimating danger in safe situations
• Underestimating your ability to cope
• Attention bias toward threatening information
• Perfectionism and need for control

**Learning History:**
• Traumatic experiences can create anxiety responses
• Observing others' anxious responses (modeling)
• Being raised in an anxious or overprotective environment
• Past experiences of feeling helpless or overwhelmed

**Personality Traits:**
• High sensitivity to physical sensations
• Tendency to worry or ruminate
• Low tolerance for uncertainty
• High self-criticism`
          },
          {
            title: "Environmental & Social Factors",
            content: `Your environment and life circumstances play a role:

**Life Stressors:**
• Major life changes (moving, job change, relationship changes)
• Financial stress
• Work or academic pressure
• Health problems (your own or loved ones')
• Social isolation or relationship problems

**Social Factors:**
• Social media and comparison culture
• Cultural expectations and pressures
• Discrimination or marginalization
• Lack of social support

**Lifestyle Factors:**
• High caffeine intake
• Lack of sleep
• Sedentary lifestyle
• Poor nutrition
• Substance use

**Environmental Stressors:**
• Chronic noise or pollution
• Overcrowded living conditions
• Unsafe neighborhoods
• Climate change anxiety`
          }
        ],
        quiz: [
          {
            question: "Which statement about genetics and anxiety is most accurate?",
            options: [
              "If your parents had anxiety, you will definitely have it too",
              "Genetics play no role in anxiety disorders",
              "Family history increases risk but doesn't guarantee you'll develop anxiety",
              "Only one specific gene causes anxiety"
            ],
            correct: 2,
            explanation: "While genetics can increase susceptibility to anxiety, many factors are involved and having anxious family members doesn't guarantee you'll develop anxiety."
          },
          {
            question: "Which cognitive pattern is common in anxiety?",
            options: [
              "Overestimating danger and underestimating coping ability",
              "Always thinking positively",
              "Never worrying about anything",
              "Perfect memory for all details"
            ],
            correct: 0,
            explanation: "People with anxiety often overestimate how dangerous situations are and underestimate their ability to handle them effectively."
          }
        ]
      }
    },
    management: {
      title: "Management Strategies",
      duration: "10 min read",
      icon: Shield,
      content: {
        sections: [
          {
            title: "Immediate Coping Strategies",
            content: `When anxiety hits, these techniques can provide quick relief:

**Breathing Techniques:**
• 4-7-8 breathing: Breathe in for 4, hold for 7, out for 8
• Box breathing: In for 4, hold 4, out for 4, hold 4
• Focus on slow, deep belly breathing rather than chest breathing

**Grounding Techniques:**
• 5-4-3-2-1 method: Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste
• Hold an ice cube or splash cold water on face
• Focus intensely on one object in detail

**Quick Relaxation:**
• Progressive muscle relaxation starting with toes
• Gentle self-massage of temples, neck, shoulders
• Listen to calming music or sounds

**Mental Strategies:**
• Remind yourself "this feeling will pass"
• Use coping statements: "I can handle this"
• Challenge catastrophic thoughts: "What evidence do I have this will happen?"`
          },
          {
            title: "Long-term Management",
            content: `Building resilience and reducing overall anxiety levels:

**Cognitive Strategies:**
• Learn to identify and challenge anxious thoughts
• Practice mindfulness and present-moment awareness
• Develop realistic, balanced thinking patterns
• Keep a worry journal to track patterns

**Behavioral Approaches:**
• Gradual exposure to feared situations (with professional guidance)
• Build daily structure and routines
• Set realistic goals and celebrate small victories
• Practice saying no to excessive commitments

**Lifestyle Changes:**
• Regular exercise (even 10 minutes of walking helps)
• Consistent sleep schedule (7-9 hours nightly)
• Limit caffeine, especially after 2 PM
• Eat regular, balanced meals
• Limit alcohol and avoid recreational drugs

**Stress Management:**
• Learn time management skills
• Practice regular relaxation or meditation
• Engage in hobbies and enjoyable activities
• Build and maintain supportive relationships`
          },
          {
            title: "When to Seek Professional Help",
            content: `Consider professional support if anxiety:

**Interferes with Daily Life:**
• Avoiding work, school, or social activities
• Difficulty maintaining relationships
• Problems with basic tasks like shopping or driving

**Causes Significant Distress:**
• Persistent worry that's hard to control
• Physical symptoms that concern you
• Sleep problems lasting more than a few weeks
• Using alcohol or substances to cope

**Types of Professional Help:**
• **Therapy:** Cognitive Behavioral Therapy (CBT) is highly effective for anxiety
• **Medication:** Can be helpful, especially combined with therapy
• **Support Groups:** Connect with others who understand
• **NHS Services:** GP referral to mental health services

**What to Expect:**
• Initial assessment to understand your specific situation
• Collaborative treatment planning
• Learning practical coping skills
• Gradual improvement over time (not immediate fix)
• Regular review and adjustment of treatment`
          }
        ],
        quiz: [
          {
            question: "Which breathing technique involves breathing in for 4, holding for 7, and out for 8?",
            options: [
              "Box breathing",
              "4-7-8 breathing", 
              "Belly breathing",
              "Deep breathing"
            ],
            correct: 1,
            explanation: "The 4-7-8 breathing technique is a specific pattern that can help activate the body's relaxation response."
          },
          {
            question: "When should someone consider seeking professional help for anxiety?",
            options: [
              "Only when having panic attacks",
              "When anxiety interferes with daily life or causes significant distress",
              "Never - anxiety should be handled alone",
              "Only when medication is needed"
            ],
            correct: 1,
            explanation: "Professional help is beneficial when anxiety significantly impacts daily functioning or causes distress that's hard to manage alone."
          }
        ]
      }
    }
  };

  const markModuleComplete = (moduleId: string, quizScore?: number) => {
    setProgress(prev => ({
      ...prev,
      [moduleId]: {
        moduleId,
        completed: true,
        timeSpent: 0,
        quizScore,
        notes: userNotes[moduleId] || ""
      }
    }));
  };

  const handleQuizSubmit = (moduleId: string) => {
    const module = modules[moduleId as keyof typeof modules];
    let correct = 0;
    module.content.quiz.forEach((question, index) => {
      if (parseInt(currentQuizAnswers[`${moduleId}-${index}`]) === question.correct) {
        correct++;
      }
    });
    const score = Math.round((correct / module.content.quiz.length) * 100);
    setShowQuizResults(true);
    markModuleComplete(moduleId, score);
  };

  const resetQuiz = () => {
    setCurrentQuizAnswers({});
    setShowQuizResults(false);
  };

  const getOverallProgress = () => {
    const completed = Object.values(progress).filter(p => p.completed).length;
    return Math.round((completed / Object.keys(modules).length) * 100);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Understanding Anxiety - Interactive Guide
          </CardTitle>
          <p className="text-muted-foreground">
            NHS-approved educational content with interactive assessments and tracking
          </p>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Progress value={getOverallProgress()} className="w-24 h-2" />
              <span className="text-sm font-medium">{getOverallProgress()}% Complete</span>
            </div>
            <Badge variant="secondary">
              {Object.values(progress).filter(p => p.completed).length} of {Object.keys(modules).length} modules
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <Brain className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="gap-2">
            <AlertCircle className="w-4 h-4" />
            Symptoms
          </TabsTrigger>
          <TabsTrigger value="causes" className="gap-2">
            <Target className="w-4 h-4" />
            Causes
          </TabsTrigger>
          <TabsTrigger value="management" className="gap-2">
            <Shield className="w-4 h-4" />
            Management
          </TabsTrigger>
        </TabsList>

        {Object.entries(modules).map(([moduleId, module]) => (
          <TabsContent key={moduleId} value={moduleId} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <module.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>{module.title}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {module.duration}
                      </p>
                    </div>
                  </div>
                  {progress[moduleId]?.completed && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Content Sections */}
                {module.content.sections.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-xl font-semibold text-blue-800">{section.title}</h3>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                        {section.content}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Interactive Quiz */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-800">Knowledge Check</h3>
                  </div>
                  
                  {!showQuizResults ? (
                    <div className="space-y-6">
                      {module.content.quiz.map((question, qIndex) => (
                        <div key={qIndex} className="bg-white p-4 rounded-lg">
                          <h4 className="font-medium mb-3">{qIndex + 1}. {question.question}</h4>
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <label key={oIndex} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input
                                  type="radio"
                                  name={`${moduleId}-${qIndex}`}
                                  value={oIndex}
                                  onChange={(e) => setCurrentQuizAnswers(prev => ({
                                    ...prev,
                                    [`${moduleId}-${qIndex}`]: e.target.value
                                  }))}
                                  className="text-blue-600"
                                  data-testid={`quiz-${moduleId}-${qIndex}-${oIndex}`}
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Button 
                        onClick={() => handleQuizSubmit(moduleId)}
                        disabled={module.content.quiz.length !== Object.keys(currentQuizAnswers).filter(k => k.startsWith(moduleId)).length}
                        className="gap-2"
                        data-testid={`submit-quiz-${moduleId}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Submit Quiz
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-green-800">
                          Quiz Complete! Score: {progress[moduleId]?.quizScore}%
                        </h4>
                      </div>
                      
                      {module.content.quiz.map((question, qIndex) => {
                        const userAnswer = parseInt(currentQuizAnswers[`${moduleId}-${qIndex}`]);
                        const isCorrect = userAnswer === question.correct;
                        return (
                          <div key={qIndex} className="bg-white p-4 rounded-lg border-l-4" 
                               style={{borderLeftColor: isCorrect ? '#10b981' : '#f59e0b'}}>
                            <h5 className="font-medium mb-2">{qIndex + 1}. {question.question}</h5>
                            <p className={`text-sm mb-2 ${isCorrect ? 'text-green-700' : 'text-amber-700'}`}>
                              Your answer: {question.options[userAnswer]} 
                              {isCorrect ? ' ✓ Correct!' : ' ✗ Incorrect'}
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-green-700 mb-2">
                                Correct answer: {question.options[question.correct]}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">{question.explanation}</p>
                          </div>
                        );
                      })}
                      
                      <div className="flex gap-2">
                        <Button onClick={resetQuiz} variant="outline">
                          Retake Quiz
                        </Button>
                        {Object.keys(modules).indexOf(moduleId) < Object.keys(modules).length - 1 && (
                          <Button 
                            onClick={() => setActiveModule(Object.keys(modules)[Object.keys(modules).indexOf(moduleId) + 1])}
                            className="gap-2"
                          >
                            Next Module <ArrowRight className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Personal Notes */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label htmlFor={`notes-${moduleId}`} className="text-base font-semibold mb-3 block">
                    Personal Notes & Reflections
                  </Label>
                  <Textarea
                    id={`notes-${moduleId}`}
                    placeholder="What are your key takeaways? How does this relate to your experience?"
                    value={userNotes[moduleId] || ""}
                    onChange={(e) => setUserNotes(prev => ({ ...prev, [moduleId]: e.target.value }))}
                    rows={4}
                    data-testid={`notes-${moduleId}`}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(modules).map(([moduleId, module]) => (
              <div key={moduleId} className={`p-4 rounded-lg border-2 ${
                progress[moduleId]?.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <module.icon className={`w-5 h-5 ${progress[moduleId]?.completed ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm">{module.title}</span>
                </div>
                {progress[moduleId]?.completed ? (
                  <div className="space-y-1">
                    <Badge variant="secondary" className="text-xs">
                      Quiz: {progress[moduleId].quizScore}%
                    </Badge>
                    {progress[moduleId].notes && (
                      <p className="text-xs text-gray-600">Notes saved</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Not started</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 text-blue-800">💡 Learning Tips</h4>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• Take your time with each module - understanding is more important than speed</p>
            <p>• Use the notes section to connect the information to your own experiences</p>
            <p>• You can retake quizzes as many times as you want to reinforce learning</p>
            <p>• Share what you learn with trusted friends or family members</p>
            <p>• Return to completed modules anytime for review and refresher</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}