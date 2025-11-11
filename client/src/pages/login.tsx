import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocation, Link } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        try {
          const errorData = await res.json();
          // Use server error message or fallback to generic message
          setError(errorData.error || "Invalid email or password");
        } catch {
          // If response is not JSON, use generic error
          setError("Invalid email or password");
        }
        setIsSubmitting(false);
        return;
      }
      
      const data = await res.json();
      const userId = data.user?.id;
      
      if (!userId) {
        setError("Login failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
      
      // Check if user has completed onboarding
      try {
        const onboardingRes = await fetch(`/api/onboarding/${userId}`, { 
          credentials: "include",
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (onboardingRes.ok) {
          const onboardingData = await onboardingRes.json();
          
          if (onboardingData?.response) {
            setIsSubmitting(false);
            // Small delay to ensure state updates are processed
            setTimeout(() => {
              setLocation("/");
              // Fallback navigation
              window.location.href = "/";
            }, 100);
            return;
          } else {
            setIsSubmitting(false);
            // Small delay to ensure state updates are processed
            setTimeout(() => {
              setLocation("/onboarding");
              // Fallback navigation
              window.location.href = "/onboarding";
            }, 100);
            return;
          }
        } else {
          setIsSubmitting(false);
          setTimeout(() => {
            setLocation("/onboarding");
            // Fallback navigation
            window.location.href = "/onboarding";
          }, 100);
          return;
        }
      } catch (error) {
        setIsSubmitting(false);
        setTimeout(() => {
          setLocation("/onboarding");
          // Fallback navigation
          window.location.href = "/onboarding";
        }, 100);
        return;
      }
      
    } catch (err: any) {
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-semibold mb-4">Log in</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }} 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }} 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Log in"}
                </Button>
              </form>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Don't have an account? <Link href="/signup">Sign up</Link>
                </p>
                <p className="text-sm text-muted-foreground">
                  Admin access? <Link href="/admin/login" className="text-primary hover:underline">Admin Login</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 