import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, Link } from "wouter";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nhsNumber, setNhsNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = { firstName: "", lastName: "", email: "" } as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, email, password, phoneNumber, nhsNumber }),
      });
      if (!res.ok) throw new Error(await res.text());
      
      const data = await res.json();
      
      // Redirect directly to onboarding after successful signup
      setLocation("/onboarding");
      // Fallback hard navigation to ensure route change
      window.location.href = "/onboarding";
    } catch (err) {
      alert("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1 bg-background">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-semibold mb-4">Create your account</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number (optional)</Label>
                  <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+44 7xxx xxx xxx" />
                </div>
                <div>
                  <Label htmlFor="nhs">NHS Number (optional)</Label>
                  <Input id="nhs" value={nhsNumber} onChange={(e) => setNhsNumber(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Sign up"}
                </Button>
              </form>
              <p className="text-sm text-muted-foreground mt-4">
                Already have an account? <Link href="/login">Log in</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 