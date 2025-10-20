import React from 'react';
import PaymentPlansManagement from '@/components/PaymentPlansManagement';

export default function PaymentPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Payment Plans</h1>
        <p className="text-muted-foreground">Manage subscription plans and pricing</p>
      </div>

      <PaymentPlansManagement />
    </div>
  );
}
