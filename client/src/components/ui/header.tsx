import { Heart, ChevronDown, User } from "lucide-react";
import { CrisisButton } from "./crisis-banner";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { useEffect, useState } from "react";

interface HeaderProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function Header({ user }: HeaderProps) {
  const [sessionUser, setSessionUser] = useState<typeof user | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data?.user) setSessionUser(data.user);
        }
      } catch {}
    })();
  }, []);

  const activeUser = sessionUser || user || undefined;
  const initials = activeUser ? `${activeUser.firstName?.[0] || ""}${activeUser.lastName?.[0] || ""}` || "U" : "U";

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="text-primary-foreground w-4 h-4" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-foreground">Waitlist Companion™</h1>
              <p className="text-xs text-muted-foreground">Interim Care Support</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <CrisisButton />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                  data-testid="button-user-menu"
                >
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{initials}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-2">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">{activeUser ? `${activeUser.firstName} ${activeUser.lastName}` : "Profile"}</div>
                      <div className="text-muted-foreground text-xs">{activeUser?.email || ""}</div>
                    </div>
                  </div>
                </div>
                <DropdownMenuItem>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                    } catch {}
                    window.location.href = "/login";
                  }}
                  data-testid="button-logout"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
