import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { CrisisBanner } from "@/components/ui/crisis-banner";
import { Footer } from "@/components/ui/footer";
import { Home, ArrowLeft, Search, FileText, Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CrisisBanner />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            {/* Large 404 */}
            <div className="mb-6">
              <h1 className="text-9xl font-bold text-primary/20 dark:text-primary/10 mb-4">404</h1>
              <h2 className="text-4xl font-bold text-foreground mb-4">Page Not Found</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The page you're looking for doesn't exist or has been moved. 
                Don't worry, we're here to help you find what you need.
              </p>
            </div>
          </div>

          {/* Main Content Card */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">What would you like to do?</h3>
                <p className="text-muted-foreground">
                  Here are some quick ways to get back on track
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => setLocation("/")}
                  className="w-full h-auto py-6 flex flex-col items-center gap-2"
                >
                  <Home className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">Go to Homepage</div>
                    <div className="text-sm opacity-90">Return to the main dashboard</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.history.back()}
                  className="w-full h-auto py-6 flex flex-col items-center gap-2"
                >
                  <ArrowLeft className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">Go Back</div>
                    <div className="text-sm text-muted-foreground">Return to previous page</div>
                  </div>
                </Button>
              </div>

              {/* Helpful Links */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-foreground mb-4 text-center">Popular Pages</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setLocation("/anxiety-track")}
                    className="flex flex-col items-center gap-2 h-auto py-3"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">Anxiety Support</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => setLocation("/check-ins")}
                    className="flex flex-col items-center gap-2 h-auto py-3"
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">Check-ins</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => setLocation("/resources")}
                    className="flex flex-col items-center gap-2 h-auto py-3"
                  >
                    <Search className="w-5 h-5" />
                    <span className="text-sm">Resources</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => setLocation("/pricing")}
                    className="flex flex-col items-center gap-2 h-auto py-3"
                  >
                    <Home className="w-5 h-5" />
                    <span className="text-sm">Pricing</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Information */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you're experiencing a mental health emergency, please contact:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-foreground mb-1">Emergency</div>
                    <div className="text-primary font-bold text-lg">999</div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-1">Samaritans</div>
                    <div className="text-primary font-bold text-lg">116 123</div>
                    <div className="text-xs text-muted-foreground">Free, 24/7</div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-1">Crisis Text</div>
                    <div className="text-primary font-bold text-base">SHOUT to 85258</div>
                    <div className="text-xs text-muted-foreground">Free, 24/7</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
