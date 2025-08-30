import { Activity, Brain, ClipboardCheck, BriefcaseMedical, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: Activity, path: "/" },
  { id: "anxiety-track", label: "Anxiety Support", icon: Brain, path: "/anxiety-track" },
  { id: "check-ins", label: "Check-ins", icon: ClipboardCheck, path: "/check-ins" },
  { id: "resources", label: "Resources", icon: BriefcaseMedical, path: "/resources" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
];

export function TabNavigation() {
  const [location] = useLocation();

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8 overflow-x-auto py-4" aria-label="Main navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location === tab.path;
            
            return (
              <Link
                key={tab.id}
                href={tab.path}
                className={cn(
                  "whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  isActive 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                data-testid={`tab-${tab.id}`}
              >
                <Icon className="inline w-4 h-4 mr-2" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
