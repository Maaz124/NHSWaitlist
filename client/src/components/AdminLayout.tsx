import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import AdminSidebar from './AdminSidebar';
import DashboardOverview from '@/pages/admin/DashboardOverview';
import UsersPage from '@/pages/admin/UsersPage';
import PaymentPlansPage from '@/pages/admin/PaymentPlansPage';
import StripeConfigPage from '@/pages/admin/StripeConfigPage';
import { RefreshCw } from 'lucide-react';

export default function AdminLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useLocation();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.user?.isAdmin) {
            setUser(data.user);
          } else {
            // Redirect to admin login if not an admin
            setLocation('/admin/login');
          }
        } else {
          // Redirect to admin login if not authenticated
          setLocation('/admin/login');
        }
      } catch (error) {
        setLocation('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setLocation('/admin/login');
    } catch (error) {
      setLocation('/admin/login');
    }
  };

  // Render the appropriate page based on the current location
  const renderPage = () => {
    switch (location) {
      case '/admin':
        return <DashboardOverview />;
      case '/admin/users':
        return <UsersPage />;
      case '/admin/payment-plans':
        return <PaymentPlansPage />;
      case '/admin/stripe-config':
        return <StripeConfigPage />;
      default:
        return <DashboardOverview />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar onLogout={handleLogout} />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
