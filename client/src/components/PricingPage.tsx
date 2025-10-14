import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  priceAmount: number;
  currency: string;
  intervalType: string;
  features: string[];
}

export function PricingPage() {
  const [plan, setPlan] = useState<PaymentPlan | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch payment plans
  useEffect(() => {
    fetch('/api/payment-plans')
      .then(res => res.json())
      .then(data => {
        if (data.plans && data.plans.length > 0) {
          setPlan(data.plans[0]); // Get the first (and only) plan
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching payment plans:', error);
        toast({
          title: "Error",
          description: "Failed to load pricing information",
          variant: "destructive",
        });
        setLoading(false);
      });
  }, []);

  // Create checkout session mutation
  const createCheckoutMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.protocol}//${window.location.host}/?payment=success`,
          cancelUrl: `${window.location.protocol}//${window.location.host}/?payment=canceled`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    },
    onError: (error) => {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pricing</h1>
          <p className="text-gray-600">No pricing plans available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Unlock Full Access to NHS Waitlist
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get complete access to all our anxiety management modules, tools, and resources with a one-time payment.
        </p>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <CardDescription className="text-base">
              {plan.description}
            </CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold text-green-600">
                {formatPrice(plan.priceAmount, plan.currency)}
              </span>
              <span className="text-gray-500 ml-2">
                {plan.intervalType === 'one_time' ? 'one-time' : plan.intervalType}
              </span>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => createCheckoutMutation.mutate(plan.id)}
              disabled={createCheckoutMutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
            >
              {createCheckoutMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Get Full Access Now'
              )}
            </Button>

            <p className="text-sm text-gray-500 text-center mt-4">
              Secure payment powered by Stripe. You'll be redirected to complete your purchase.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
