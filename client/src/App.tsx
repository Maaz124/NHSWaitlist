import { lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Onboarding from "@/pages/onboarding";
import AnxietyTrack from "@/pages/anxiety-track";
import CheckIns from "@/pages/check-ins";
import Resources from "@/pages/resources";
import Settings from "@/pages/settings";

const ModuleDetail = lazy(() => import("@/pages/module-detail"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/anxiety-track" component={AnxietyTrack} />
      <Route path="/anxiety-track/module/:weekNumber" component={ModuleDetail} />
      <Route path="/check-ins" component={CheckIns} />
      <Route path="/resources" component={Resources} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
