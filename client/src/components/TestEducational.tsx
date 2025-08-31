import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export function TestEducational() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Test Educational Content
          </CardTitle>
          <p className="text-muted-foreground">
            This is a test to verify educational content loading
          </p>
        </CardHeader>
        <CardContent>
          <p>If you can see this, the educational content system is working!</p>
        </CardContent>
      </Card>
    </div>
  );
}