import { AlertTriangle, Phone } from "lucide-react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";

export function CrisisBanner() {
  return (
    <div className="crisis-banner text-center py-3 text-destructive-foreground">
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-sm font-medium">
          <AlertTriangle className="inline w-4 h-4 mr-2" />
          If you're experiencing a mental health crisis, call 999 or contact Samaritans: 116 123 (free, 24/7)
        </p>
      </div>
    </div>
  );
}

export function CrisisButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="crisis-banner text-destructive-foreground px-4 py-2 font-medium text-sm hover:opacity-90 transition-opacity"
          data-testid="button-crisis-support"
        >
          <Phone className="w-4 h-4 mr-2" />
          Crisis Support
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Emergency Support
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-destructive/10 p-4 rounded-md">
            <h3 className="font-semibold text-destructive mb-2">Immediate Help</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Emergency Services:</strong> 999
              </p>
              <p className="text-sm">
                <strong>Samaritans:</strong> 116 123 (Free, 24/7)
              </p>
              <p className="text-sm">
                <strong>Crisis Text Line:</strong> Text SHOUT to 85258
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>If you are having thoughts of self-harm or suicide, please reach out for immediate support. You are not alone.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
