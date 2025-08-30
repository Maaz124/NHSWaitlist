import { Heart, ChevronDown, User } from "lucide-react";
import { CrisisButton } from "./crisis-banner";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

interface HeaderProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function Header({ user }: HeaderProps) {
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "U";

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
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
