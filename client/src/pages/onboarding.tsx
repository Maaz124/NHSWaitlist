import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  nhsNumber: z.string().optional(),
});

const onboardingSchema = z.object({
  anxietyFrequency: z.string(),
  worryFrequency: z.string(),
  depressionFrequency: z.string(),
  anhedoniaFrequency: z.string(),
  sleepQuality: z.string(),
  suicidalThoughts: z.string(),
  selfHarm: z.string(),
  substanceUse: z.string(),
  socialWithdrawal: z.string(),
  functioningImpairment: z.string(),
});

const questions = [
  {
    id: "anxietyFrequency",
    question: "Over the past 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
    type: "frequency",
  },
  {
    id: "worryFrequency",
    question: "Over the past 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
    type: "frequency",
  },
  {
    id: "depressionFrequency",
    question: "Over the past 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
    type: "frequency",
  },
  {
    id: "anhedoniaFrequency",
    question: "Over the past 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
    type: "frequency",
  },
  {
    id: "sleepQuality",
    question: "How would you describe your sleep quality over the past week?",
    type: "quality",
    options: [
      { value: "excellent", label: "Excellent" },
      { value: "good", label: "Good" },
      { value: "fair", label: "Fair" },
      { value: "poor", label: "Poor" },
    ],
  },
  {
    id: "suicidalThoughts",
    question: "Have you had any thoughts of self-harm or suicide in the past month?",
    type: "yesno",
  },
  {
    id: "selfHarm",
    question: "Have you engaged in any self-harm behaviors in the past month?",
    type: "yesno",
  },
  {
    id: "substanceUse",
    question: "Has your use of alcohol or other substances changed recently?",
    type: "substance",
    options: [
      { value: "decreased", label: "Decreased" },
      { value: "same", label: "About the same" },
      { value: "increased", label: "Increased" },
      { value: "not-applicable", label: "I don't use substances" },
    ],
  },
];

const frequencyOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" },
];

const yesNoOptions = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"personal" | "screening">("personal");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userId, setUserId] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const hasCheckedOnboarding = useRef(false);

  // If already authenticated, skip personal step and check if onboarding is completed
  useEffect(() => {
    if (hasCheckedOnboarding.current) return;
    hasCheckedOnboarding.current = true;
    
    let isMounted = true;
    
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data?.user?.id) {
            setUserId(data.user.id);
            setStep("screening");
            
            // Check if user has already completed onboarding
            try {
              const onboardingRes = await fetch(`/api/onboarding/${data.user.id}`, { 
                credentials: "include",
                headers: {
                  'Cache-Control': 'no-cache',
                  'Pragma': 'no-cache'
                }
              });
              if (onboardingRes.ok && isMounted) {
                const onboardingData = await onboardingRes.json();
                if (onboardingData?.response) {
                  // User has already completed onboarding, redirect to dashboard
                  setLocation("/");
                  return;
                }
              }
            } catch (error) {
            }
          }
        }
        // If not authenticated, just stay on onboarding page
      } catch {
        // ignore
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to run only once

  const userForm = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      nhsNumber: "",
    },
  });

  const onboardingForm = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: Object.fromEntries(questions.map(q => [q.id, ""])),
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/auth/signup", data);
      return response.json();
    },
    onSuccess: (data) => {
      setUserId(data.user.id);
      setStep("screening");
      setErrorMsg("");
    },
    onError: async (err: any) => {
      try {
        const message = String(err?.message || "Signup failed");
        setErrorMsg(message.includes("User already exists") ? "An account with this email already exists. Please log in instead." : message);
      } catch {
        setErrorMsg("Signup failed. Please try again.");
      }
    },
  });

  const createOnboardingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/onboarding", data);
      return response.json();
    },
    onSuccess: (data) => {
      setLocation("/");
    },
    onError: (error: any) => {
      if (error?.message?.includes("already completed")) {
        setLocation("/");
      } else {
        setErrorMsg("Failed to save your responses. Please try again.");
      }
    },
  });

  const onUserSubmit = (data: any) => {
    setErrorMsg("");
    createUserMutation.mutate(data);
  };

  const onNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit onboarding
      const responses = onboardingForm.getValues();
      createOnboardingMutation.mutate({
        responses,
      });
    }
  };

  const onPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (step === "personal") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="text-primary-foreground w-6 h-6" />
            </div>
            <CardTitle className="text-2xl">Welcome to Waitlist Companion™</CardTitle>
            <p className="text-muted-foreground">Let's start with your basic information</p>
          </CardHeader>
          <CardContent>
            <Form {...userForm}>
              <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                {errorMsg && (
                  <div className="text-sm text-destructive border border-destructive/30 bg-destructive/10 rounded p-2">
                    {errorMsg}
                  </div>
                )}
                <FormField
                  control={userForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-first-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={userForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-last-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={userForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={userForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} data-testid="input-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={userForm.control}
                  name="nhsNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Service Number (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123 456 7890" data-testid="input-nhs-number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createUserMutation.isPending}
                  data-testid="button-continue-to-screening"
                >
                  {createUserMutation.isPending ? "Creating Account..." : "Continue to Health Screening"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  let questionOptions = frequencyOptions;
  if (currentQ.type === "yesno") questionOptions = yesNoOptions;
  else if (currentQ.options) questionOptions = currentQ.options;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">~{Math.ceil((questions.length - currentQuestion) * 0.5)} min remaining</span>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-lg">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...onboardingForm}>
            <FormField
              key={currentQ.id}
              control={onboardingForm.control}
              name={currentQ.id as keyof typeof onboardingForm.formState.defaultValues}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup 
                      key={currentQ.id}
                      value={field.value} 
                      onValueChange={field.onChange}
                      className="space-y-3"
                    >
                      {questionOptions.map((option) => (
                        <div 
                          key={option.value}
                          className="flex items-center p-4 border border-border rounded-md hover:bg-secondary/50 cursor-pointer transition-colors"
                        >
                          <RadioGroupItem 
                            value={option.value} 
                            id={`${currentQ.id}-${option.value}`}
                            className="mr-3"
                            data-testid={`radio-${currentQ.id}-${option.value}`}
                          />
                          <Label 
                            htmlFor={`${currentQ.id}-${option.value}`}
                            className="text-card-foreground cursor-pointer flex-1"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>

          <div className="flex justify-between pt-6">
            <Button 
              variant="outline"
              onClick={onPrevious}
              disabled={currentQuestion === 0}
              data-testid="button-previous-question"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button 
              onClick={onNext}
              disabled={!onboardingForm.watch(currentQ.id as any) || createOnboardingMutation.isPending}
              data-testid="button-next-question"
            >
              {currentQuestion === questions.length - 1 ? "Complete Screening" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
