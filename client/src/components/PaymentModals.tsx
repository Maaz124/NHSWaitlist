import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle, XCircle, CreditCard } from 'lucide-react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentSuccessModal({ isOpen, onClose }: PaymentSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-green-600">
            <CheckCircle className="h-6 w-6 mr-2" />
            Payment Successful!
          </DialogTitle>
          <DialogDescription>
            Welcome to full access! You now have complete access to all anxiety management modules and features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <h3 className="font-semibold text-green-800">Full Access Activated</h3>
                <p className="text-green-600 text-sm">
                  You can now access all 6 weekly anxiety management modules, mood tracking, thought records, and progress reports.
                </p>
              </div>
            </div>
          </div>
          
          <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
            Start Your Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface PaymentCanceledModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export function PaymentCanceledModal({ isOpen, onClose, onRetry }: PaymentCanceledModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-orange-600">
            <XCircle className="h-6 w-6 mr-2" />
            Payment Canceled
          </DialogTitle>
          <DialogDescription>
            No worries! You can try again anytime. Your progress is saved and you won't lose anything.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-orange-600 mr-2" />
              <div>
                <h3 className="font-semibold text-orange-800">Limited Access</h3>
                <p className="text-orange-600 text-sm">
                  You currently have access to basic features. Upgrade anytime to unlock all anxiety management modules.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={onRetry} className="flex-1 bg-green-600 hover:bg-green-700">
              Try Again
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Continue Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
