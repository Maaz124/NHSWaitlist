import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Phone, 
  RefreshCw
} from 'lucide-react';

interface DashboardStats {
  overview: {
    totalUsers: number;
    paidUsers: number;
    unpaidUsers: number;
    conversionRate: number;
    totalRevenue: number;
    revenueFormatted: string;
  };
  recent: {
    signupsLast7Days: number;
    usersWithPhone: number;
  };
  paymentPlan: {
    id: string;
    name: string;
    priceAmount: number;
    currency: string;
    priceFormatted: string;
  } | null;
}

export default function DashboardOverview() {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/dashboard-stats', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor user activity and payment statistics</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetchStats()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.recent.signupsLast7Days} new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Users</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.overview.paidUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.overview.conversionRate}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.overview.revenueFormatted}</div>
              <p className="text-xs text-muted-foreground">
                From {stats.overview.paidUsers} paid users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Phone Numbers</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recent.usersWithPhone}</div>
              <p className="text-xs text-muted-foreground">
                {stats.overview.totalUsers > 0 ? Math.round((stats.recent.usersWithPhone / stats.overview.totalUsers) * 100) : 0}% of users
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Active Payment Plan Info */}
      {stats?.paymentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Active Payment Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{stats.paymentPlan.name}</h3>
                <p className="text-muted-foreground">Current subscription price</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {stats.paymentPlan.priceFormatted}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stats.paymentPlan.currency.toUpperCase()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
