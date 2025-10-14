import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, XCircle, Loader2, CreditCard, TestTube } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  hasPaid?: boolean;
}

interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
}

export function PaymentStatus({ user }: { user: User }) {
  const [hasPaid, setHasPaid] = useState<boolean | null>(null);

  // Fetch payment transactions for the user
  const { data: transactions = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/payments/transactions', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/payments/transactions/${user.id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      return data.transactions || [];
    }
  });

  // Manual payment verification mutation (for testing)
  const verifyPaymentMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/payments/manual-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.id,
          amount: 14900,
          description: 'Test payment verification'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment Verified!",
        description: "Your payment has been manually verified for testing purposes.",
        variant: "default",
      });
      refetch(); // Refresh the payment status
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to verify payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Check if user has any successful payments
  useEffect(() => {
    if (transactions.length > 0) {
      const hasSuccessfulPayment = transactions.some(
        (transaction: PaymentTransaction) => transaction.status === 'succeeded'
      );
      setHasPaid(hasSuccessfulPayment);
    } else {
      setHasPaid(false);
    }
  }, [transactions]);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Checking payment status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Status
        </CardTitle>
        <CardDescription>
          Your current access level and payment history
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {hasPaid ? (
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-green-800">Full Access Active</h3>
                <p className="text-green-600 text-sm">
                  You have complete access to all NHS Waitlist features!
                </p>
              </div>
            </div>

            {transactions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Payment History</h4>
                <div className="space-y-2">
                  {transactions
                    .filter((t: PaymentTransaction) => t.status === 'succeeded')
                    .map((transaction: PaymentTransaction) => (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            Paid on {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {formatPrice(transaction.amount, transaction.currency)}
                          </p>
                          <p className="text-xs text-green-500 capitalize">
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <XCircle className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <h3 className="font-semibold text-yellow-800">Limited Access</h3>
                <p className="text-yellow-600 text-sm">
                  You have access to basic features. Upgrade to unlock everything!
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => window.location.href = '/pricing'}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Upgrade to Full Access
              </Button>
              
              {/* Test button for manual payment verification */}
              <Button
                onClick={() => verifyPaymentMutation.mutate()}
                disabled={verifyPaymentMutation.isPending}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                <TestTube className="h-3 w-3 mr-1" />
                {verifyPaymentMutation.isPending ? 'Verifying...' : 'Test: Verify Payment'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
