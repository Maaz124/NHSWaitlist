import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Phone, 
  Calendar,
  RefreshCw,
  Eye,
  Download
} from 'lucide-react';
import { Header } from '@/components/ui/header';
import PaymentPlansManagement from '@/components/PaymentPlansManagement';
import StripeConfigManagement from '@/components/StripeConfigManagement';

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

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  hasPaid: boolean;
  paidAmount?: number;
  paidCurrency?: string;
  createdAt: string;
  latestPaymentTime?: string;
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState<any>(null);

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
            window.location.href = '/admin/login';
          }
        } else {
          // Redirect to admin login if not authenticated
          window.location.href = '/admin/login';
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/admin/login';
      }
    };
    checkAuth();
  }, []);

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

  // Fetch users with pagination
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useQuery<UsersResponse>({
    queryKey: ['/api/admin/users', currentPage],
    queryFn: async () => {
      const response = await fetch(`/api/admin/users?page=${currentPage}&limit=20`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor user activity and payment statistics</p>
        </div>

        {/* Statistics Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Stripe Configuration Management */}
        <div className="mb-8">
          <StripeConfigManagement />
        </div>

        {/* Payment Plans Management */}
        <div className="mb-8">
          <PaymentPlansManagement />
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                {usersData?.pagination.total || 0} total users
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  refetchStats();
                  refetchUsers();
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : usersData ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Payment Time</TableHead>
                      <TableHead>Signup Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData.users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.phoneNumber ? (
                            <span className="text-green-600 font-mono text-sm">
                              {user.phoneNumber}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">No phone</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.hasPaid ? "default" : "secondary"}>
                            {user.hasPaid ? "Paid" : "Unpaid"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.hasPaid && user.paidAmount ? (
                            <span className="text-green-600 font-medium">
                              {formatCurrency(user.paidAmount, user.paidCurrency)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.latestPaymentTime ? (
                            <span className="text-green-600 text-sm">
                              {formatDate(user.latestPaymentTime)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">No payment</span>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {usersData.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {((usersData.pagination.page - 1) * usersData.pagination.limit) + 1} to{' '}
                      {Math.min(usersData.pagination.page * usersData.pagination.limit, usersData.pagination.total)} of{' '}
                      {usersData.pagination.total} users
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(usersData.pagination.totalPages, prev + 1))}
                        disabled={currentPage === usersData.pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
