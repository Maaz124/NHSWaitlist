import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/ui/header";
import { TabNavigation } from "@/components/ui/tab-navigation";
import { CrisisBanner } from "@/components/ui/crisis-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Phone, MessageSquare, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useUser } from "@/contexts/UserContext";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"), 
  email: z.string().email("Valid email is required"),
});

interface NotificationSettings {
  weeklyCheckInReminders: boolean;
  moduleReminders: boolean;
}

interface PrivacySettings {
  nhsDataSharing: boolean;
}

export default function Settings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: userLoading, isAuthenticated } = useUser();

  // Redirect if not authenticated
  useEffect(() => {
    if (userLoading) return; // Still loading
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, userLoading, setLocation]);

  // Get authenticated user data
  const { data: authData } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!response.ok) throw new Error("Not authenticated");
      return response.json();
    },
  });

  const userId = authData?.user?.id;
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    weeklyCheckInReminders: true,
    moduleReminders: true,
  });
  
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    nhsDataSharing: true,
  });

  // Use authenticated user data
  const authUser = authData?.user;

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: authUser?.firstName || user?.firstName || "",
      lastName: authUser?.lastName || user?.lastName || "",
      email: authUser?.email || user?.email || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Updating profile with data:', data);
      const response = await apiRequest("PATCH", `/api/users/${userId}`, data);
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Update successful:', data);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Update failed:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const downloadDataMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/reports", { userId: userId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Data Export Started",
        description: "Your data export will be downloaded shortly.",
      });
    },
  });

  const onProfileSubmit = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    
    toast({
      title: "Notification Settings Updated",
      description: `${key === 'weeklyCheckInReminders' ? 'Weekly check-in reminders' : 'Module reminders'} ${!notifications[key] ? 'enabled' : 'disabled'}.`,
    });
  };

  const handlePrivacyToggle = (key: keyof PrivacySettings) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    
    toast({
      title: "Privacy Settings Updated", 
      description: "Your data sharing preferences have been updated.",
    });
  };

  const handleDownloadData = () => {
    downloadDataMutation.mutate();
  };

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Show loading state if not authenticated (redirect will happen)
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={authUser || user} />
      <CrisisBanner />
      <TabNavigation />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Settings</h2>
            <p className="text-muted-foreground">Manage your account, notifications, and privacy preferences</p>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Profile Information</h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                    </div>
                    
                    <Button 
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      data-testid="button-save-profile"
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">Weekly Check-in Reminders</p>
                      <p className="text-sm text-muted-foreground">Get reminded when it's time for your weekly assessment</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyCheckInReminders}
                      onCheckedChange={() => handleNotificationToggle('weeklyCheckInReminders')}
                      data-testid="switch-checkin-reminders"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">Module Reminders</p>
                      <p className="text-sm text-muted-foreground">Gentle nudges to continue your anxiety support track</p>
                    </div>
                    <Switch
                      checked={notifications.moduleReminders}
                      onCheckedChange={() => handleNotificationToggle('moduleReminders')}
                      data-testid="switch-module-reminders"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Data */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Privacy & Data</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-card-foreground mb-2">Data Sharing with NHS</h4>
                    <p className="text-sm text-muted-foreground mb-3">Allow sharing of progress data when transitioning to NHS services</p>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="nhs-sharing"
                        checked={privacy.nhsDataSharing}
                        onCheckedChange={() => handlePrivacyToggle('nhsDataSharing')}
                        data-testid="checkbox-nhs-sharing"
                      />
                      <label htmlFor="nhs-sharing" className="text-sm text-card-foreground">
                        Enable NHS data sharing
                      </label>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <Button 
                      variant="ghost"
                      onClick={handleDownloadData}
                      disabled={downloadDataMutation.isPending}
                      data-testid="button-download-data"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {downloadDataMutation.isPending ? "Preparing Download..." : "Download My Data"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Support</h3>
                
                <div className="space-y-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="secondary" 
                        className="w-full justify-start p-4 h-auto"
                        data-testid="button-contact-support"
                      >
                        <Phone className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <p className="font-medium">Contact Support Team</p>
                          <p className="text-sm text-muted-foreground">Get help with technical issues</p>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contact Support</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-secondary p-4 rounded-md">
                          <h4 className="font-medium mb-2">Support Hours</h4>
                          <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <strong>Email:</strong> support@waitlistcompanion.nhs.uk
                          </p>
                          <p className="text-sm">
                            <strong>Phone:</strong> 0300 123 1234
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full justify-start p-4 h-auto"
                    data-testid="button-faq"
                  >
                    <HelpCircle className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">Frequently Asked Questions</p>
                      <p className="text-sm text-muted-foreground">Common questions and answers</p>
                    </div>
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="secondary" 
                        className="w-full justify-start p-4 h-auto"
                        data-testid="button-feedback"
                      >
                        <MessageSquare className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <p className="font-medium">Provide Feedback</p>
                          <p className="text-sm text-muted-foreground">Help us improve the app</p>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Your Feedback</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Your feedback helps us improve Waitlist Companion™ for everyone. Please share your thoughts, suggestions, or concerns.
                        </p>
                        <div className="bg-secondary p-4 rounded-md">
                          <p className="text-sm">
                            <strong>Feedback Email:</strong> feedback@waitlistcompanion.nhs.uk
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">© 2024 Waitlist Companion™</p>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-xs text-muted-foreground">Powered by rethink.org</p>
              <div className="text-xs text-muted-foreground">
                <Download className="inline w-3 h-3 mr-1" />
                NHS Data Compliant
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
