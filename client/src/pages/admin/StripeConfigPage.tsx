import React from 'react';
import StripeConfigManagement from '@/components/StripeConfigManagement';

export default function StripeConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Stripe Configuration</h1>
        <p className="text-muted-foreground">Manage Stripe API keys and settings</p>
      </div>

      <StripeConfigManagement />
    </div>
  );
}
