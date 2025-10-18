import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  Edit, 
  Save, 
  X, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  priceAmount: number;
  currency: string;
  intervalType: string;
  intervalCount: number;
  stripePriceId?: string;
  stripeProductId?: string;
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

interface PaymentPlansResponse {
  paymentPlans: PaymentPlan[];
}

export default function PaymentPlansManagement() {
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PaymentPlan>>({});
  const queryClient = useQueryClient();

  // Fetch payment plans
  const { data: plansData, isLoading } = useQuery<PaymentPlansResponse>({
    queryKey: ['/api/admin/payment-plans'],
    queryFn: async () => {
      const response = await fetch('/api/admin/payment-plans', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch payment plans');
      return response.json();
    },
  });

  // Update payment plan mutation
  const updatePlanMutation = useMutation({
    mutationFn: async ({ planId, updates }: { planId: string; updates: Partial<PaymentPlan> }) => {
      const response = await fetch(`/api/admin/payment-plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update payment plan');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payment-plans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard-stats'] });
      setEditingPlan(null);
      setEditForm({});
    },
  });

  const formatCurrency = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handleEdit = (plan: PaymentPlan) => {
    setEditingPlan(plan.id);
    setEditForm({
      name: plan.name,
      description: plan.description,
      priceAmount: plan.priceAmount,
      currency: plan.currency,
      intervalType: plan.intervalType,
      intervalCount: plan.intervalCount,
      isActive: plan.isActive,
    });
  };

  const handleSave = () => {
    if (!editingPlan) return;
    
    updatePlanMutation.mutate({
      planId: editingPlan,
      updates: editForm,
    });
  };

  const handleCancel = () => {
    setEditingPlan(null);
    setEditForm({});
  };

  const handleInputChange = (field: keyof PaymentPlan, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Plans Management</CardTitle>
          <CardDescription>Loading payment plans...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payment Plans Management
        </CardTitle>
        <CardDescription>
          Manage your payment plans, update prices, and control availability
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {updatePlanMutation.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {updatePlanMutation.error.message}
            </AlertDescription>
          </Alert>
        )}

        {plansData?.paymentPlans.map((plan) => (
          <Card key={plan.id} className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              {editingPlan === plan.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Plan Name</Label>
                      <Input
                        id="name"
                        value={editForm.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter plan name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priceAmount">Price (in cents)</Label>
                      <Input
                        id="priceAmount"
                        type="number"
                        value={editForm.priceAmount || ''}
                        onChange={(e) => handleInputChange('priceAmount', parseInt(e.target.value))}
                        placeholder="14900 for $149.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        id="currency"
                        value={editForm.currency || ''}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        placeholder="usd"
                      />
                    </div>
                    <div>
                      <Label htmlFor="intervalType">Interval Type</Label>
                      <Input
                        id="intervalType"
                        value={editForm.intervalType || ''}
                        onChange={(e) => handleInputChange('intervalType', e.target.value)}
                        placeholder="one_time, month, year"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editForm.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter plan description"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={editForm.isActive || false}
                      onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    />
                    <Label htmlFor="isActive">Active Plan</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={updatePlanMutation.isPending}
                      className="gap-2"
                    >
                      {updatePlanMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={updatePlanMutation.isPending}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {plan.name}
                        {plan.isActive && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </Badge>
                        )}
                      </h3>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(plan)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Price</Label>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(plan.priceAmount, plan.currency)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Billing</Label>
                      <p className="text-sm text-muted-foreground">
                        {plan.intervalType === 'one_time' ? 'One-time payment' : 
                         `${plan.intervalCount} ${plan.intervalType}(s)`}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <p className="text-sm">
                        {plan.isActive ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </p>
                    </div>
                  </div>

                  {plan.stripePriceId && (
                    <div>
                      <Label className="text-sm font-medium">Stripe Price ID</Label>
                      <p className="text-sm font-mono text-muted-foreground">
                        {plan.stripePriceId}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {plansData?.paymentPlans.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No payment plans found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
