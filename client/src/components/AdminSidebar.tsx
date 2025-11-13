import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings,
  LogOut,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  onLogout?: () => void;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Payment Plans',
    href: '/admin/payment-plans',
    icon: CreditCard,
  },
  {
    name: 'Stripe Config',
    href: '/admin/stripe-config',
    icon: Settings,
  },
];

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-background border-r border-border min-h-screen flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Home className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Waitlist Companion</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = item.exact 
              ? location === item.href
              : location.startsWith(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 pt-0">
        <Button
          variant="outline"
          onClick={onLogout}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
