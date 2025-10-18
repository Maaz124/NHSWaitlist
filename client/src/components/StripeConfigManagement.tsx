import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Save, 
  Eye, 
  EyeOff, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Shield,
  Key
} from 'lucide-react';

interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  hasSecretKey: boolean;
  hasPublishableKey: boolean;
}

interface StripeConfigResponse {
  stripeConfig: StripeConfig;
}

export default function StripeConfigManagement() {
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [editForm, setEditForm] = useState({
    publishableKey: '',
    secretKey: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch Stripe configuration
  const { data: configData, isLoading } = useQuery<StripeConfigResponse>({
    queryKey: ['/api/admin/stripe-config'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stripe-config', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch Stripe config');
      return response.json();
    },
  });

  // Update Stripe configuration mutation
  const updateConfigMutation = useMutation({
    mutationFn: async (updates: { publishableKey?: string; secretKey?: string }) => {
      const response = await fetch('/api/admin/stripe-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update Stripe configuration');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stripe-config'] });
      setIsEditing(false);
      setEditForm({ publishableKey: '', secretKey: '' });
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      publishableKey: configData?.stripeConfig.publishableKey || '',
      secretKey: configData?.stripeConfig.secretKey || '',
    });
  };

  const handleSave = () => {
    const updates: { publishableKey?: string; secretKey?: string } = {};
    
    if (editForm.publishableKey && editForm.publishableKey !== configData?.stripeConfig.publishableKey) {
      updates.publishableKey = editForm.publishableKey;
    }
    
    if (editForm.secretKey && editForm.secretKey !== configData?.stripeConfig.secretKey) {
      updates.secretKey = editForm.secretKey;
    }

    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }

    updateConfigMutation.mutate(updates);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ publishableKey: '', secretKey: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const maskKey = (key: string) => {
    if (!key) return '';
    return key.substring(0, 8) + '...' + key.substring(key.length - 4);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stripe Configuration</CardTitle>
          <CardDescription>Loading Stripe configuration...</CardDescription>
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
          <CreditCard className="h-5 w-5" />
          Stripe Configuration
        </CardTitle>
        <CardDescription>
          Manage your Stripe API keys for payment processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {updateConfigMutation.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {updateConfigMutation.error.message}
            </AlertDescription>
          </Alert>
        )}

        {updateConfigMutation.isSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Stripe configuration updated successfully! Please restart the server for changes to take effect.
            </AlertDescription>
          </Alert>
        )}

        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Security Notice:</strong> Secret keys are sensitive information. 
            Only update them if you're sure you have the correct keys from your Stripe dashboard.
          </AlertDescription>
        </Alert>

        {isEditing ? (
          // Edit Mode
          <div className="space-y-4">
            <div>
              <Label htmlFor="publishableKey">Publishable Key</Label>
              <Input
                id="publishableKey"
                value={editForm.publishableKey}
                onChange={(e) => handleInputChange('publishableKey', e.target.value)}
                placeholder="pk_test_..."
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Your Stripe publishable key (starts with pk_)
              </p>
            </div>

            <div>
              <Label htmlFor="secretKey">Secret Key</Label>
              <Input
                id="secretKey"
                type={showSecretKey ? "text" : "password"}
                value={editForm.secretKey}
                onChange={(e) => handleInputChange('secretKey', e.target.value)}
                placeholder="sk_test_..."
                className="font-mono"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-muted-foreground">
                  Your Stripe secret key (starts with sk_) - Leave blank to keep current
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="gap-1"
                >
                  {showSecretKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {showSecretKey ? 'Hide' : 'Show'}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={updateConfigMutation.isPending}
                className="gap-2"
              >
                {updateConfigMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Configuration
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={updateConfigMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Publishable Key
                </Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  {configData?.stripeConfig.hasPublishableKey ? (
                    <p className="font-mono text-sm">
                      {maskKey(configData.stripeConfig.publishableKey)}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not configured</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Secret Key
                </Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  {configData?.stripeConfig.hasSecretKey ? (
                    <p className="font-mono text-sm">
                      {maskKey(configData.stripeConfig.secretKey)}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not configured</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {configData?.stripeConfig.hasPublishableKey && configData?.stripeConfig.hasSecretKey ? (
                  <span className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Stripe configuration is complete
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    Stripe configuration is incomplete
                  </span>
                )}
              </div>
              <Button onClick={handleEdit} variant="outline" className="gap-2">
                <Key className="h-4 w-4" />
                Edit Configuration
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
