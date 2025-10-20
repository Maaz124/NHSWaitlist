import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Eye } from 'lucide-react';

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

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Users Management</h1>
        <p className="text-muted-foreground">View and manage all registered users</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              {usersData?.pagination.total || 0} total users
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetchUsers()}
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
  );
}
