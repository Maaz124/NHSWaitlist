import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, Link } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Attempting login...");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Login failed:", errorText);
        throw new Error(errorText);
      }
      
      const data = await res.json();
      console.log("Login response:", data);
      const userId = data.user?.id;
      
      if (!userId) {
        console.error("No user ID in response");
        alert("Login failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
      
      // Check if user has completed onboarding
      try {
        console.log("Checking onboarding status for user:", userId);
        const onboardingRes = await fetch(`/api/onboarding/${userId}`, { 
          credentials: "include",
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (onboardingRes.ok) {
          const onboardingData = await onboardingRes.json();
          console.log("Onboarding check response:", onboardingData);
          
          if (onboardingData?.response) {
            console.log("User has completed onboarding, redirecting to dashboard");
            setIsSubmitting(false);
            // Small delay to ensure state updates are processed
            setTimeout(() => {
              setLocation("/");
              // Fallback navigation
              window.location.href = "/";
            }, 100);
            return;
          } else {
            console.log("User hasn't completed onboarding, redirecting to onboarding");
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
          console.log("Couldn't check onboarding status, redirecting to onboarding");
          setIsSubmitting(false);
          setTimeout(() => {
            setLocation("/onboarding");
            // Fallback navigation
            window.location.href = "/onboarding";
          }, 100);
          return;
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsSubmitting(false);
        setTimeout(() => {
          setLocation("/onboarding");
          // Fallback navigation
          window.location.href = "/onboarding";
        }, 100);
        return;
      }
      
    } catch (err: any) {
      console.error("Login error:", err);
      alert("Login failed. Please check your email and password.");
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
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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