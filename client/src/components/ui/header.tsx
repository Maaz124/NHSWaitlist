import { ChevronDown, User, Menu } from "lucide-react";
import { CrisisButton } from "./crisis-banner";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { LanguageSwitcher } from "./language-switcher";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
import { Separator } from "./separator";

interface HeaderProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    hasPaid?: boolean;
    isAdmin?: boolean;
  };
}

export function Header({ user }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const [sessionUser, setSessionUser] = useState<typeof user | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Desktop menu items
  const desktopMenu = (
    <div className="hidden md:flex items-center space-x-4">
      <LanguageSwitcher />
      <CrisisButton />
      
      {/* Show login button if not authenticated and not on login/signup pages */}
      {!activeUser && location !== "/login" && location !== "/signup" && (
        <Button 
          variant="outline" 
          onClick={() => setLocation("/login")}
          className="flex items-center space-x-2"
        >
          <User className="w-4 h-4" />
          <span>Login</span>
        </Button>
      )}
      
      {/* Only show user profile dropdown if user is logged in and not on login/signup page */}
      {activeUser && activeUser.email && location !== "/login" && location !== "/signup" && (
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
                  <div className="font-medium">{`${activeUser.firstName} ${activeUser.lastName}`}</div>
                  <div className="text-muted-foreground text-xs">{activeUser.email}</div>
                </div>
              </div>
            </div>
            <DropdownMenuItem
              onClick={() => setLocation("/settings")}
              data-testid="button-profile-settings"
            >
              Profile Settings
            </DropdownMenuItem>
            {(activeUser as any)?.isAdmin && (
              <DropdownMenuItem
                onClick={() => setLocation("/admin")}
              >
                Admin Dashboard
              </DropdownMenuItem>
            )}
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
      )}
    </div>
  );

  // Mobile menu content
  const mobileMenuContent = (
    <div className="flex flex-col space-y-4 mt-6">
      <LanguageSwitcher fullWidth />
      <Separator />
      <div className="flex justify-start">
        <CrisisButton />
      </div>
      <Separator />
      
      {/* Show login button if not authenticated and not on login/signup pages */}
      {!activeUser && location !== "/login" && location !== "/signup" && (
        <>
          <Button 
            variant="outline" 
            onClick={() => setLocation("/login")}
            className="flex items-center justify-start space-x-2 w-full"
          >
            <User className="w-4 h-4" />
            <span>Login</span>
          </Button>
          <Separator />
        </>
      )}
      
      {/* User profile section if logged in */}
      {activeUser && activeUser.email && location !== "/login" && location !== "/signup" && (
        <>
          <div className="px-2 py-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">{initials}</span>
              </div>
              <div>
                <div className="font-medium text-sm">{`${activeUser.firstName} ${activeUser.lastName}`}</div>
                <div className="text-muted-foreground text-xs">{activeUser.email}</div>
              </div>
            </div>
          </div>
          <Separator />
          <Button
            variant="ghost"
            onClick={() => {
              setLocation("/settings");
              setMobileMenuOpen(false);
            }}
            className="flex items-center justify-start w-full"
            data-testid="button-profile-settings-mobile"
          >
            <User className="w-4 h-4 mr-2" />
            Profile Settings
          </Button>
          {(activeUser as any)?.isAdmin && (
            <Button
              variant="ghost"
              onClick={() => {
                setLocation("/admin");
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-start w-full"
            >
              Admin Dashboard
            </Button>
          )}
          <Separator />
          <Button
            variant="ghost"
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
              } catch {}
              window.location.href = "/login";
            }}
            className="flex items-center justify-start w-full text-destructive"
            data-testid="button-logout-mobile"
          >
            Sign out
          </Button>
        </>
      )}
    </div>
  );

  return (
    <header 
      className="bg-card border-b border-border sticky top-0 z-50"
      data-testid="main-header"
      data-component="header"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0 h-full"
            onClick={() => setLocation("/")}
          >
            <img 
              src="/logo.svg" 
              alt="Waitlist Companion Logo" 
              className="h-[50%] md:h-[70%] w-auto"
            />
          </div>
          
          {/* Desktop Menu */}
          {desktopMenu}
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                {mobileMenuContent}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
