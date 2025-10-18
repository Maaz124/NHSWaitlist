import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export interface StripeTransactionData {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  customer?: string;
  payment_method?: string;
  description?: string;
  metadata?: Record<string, string>;
  receipt_url?: string;
  type: 'payment_intent' | 'charge';
}

export class StripeAdminService {
  /**
   * Fetch all payment intents for a specific customer
   */
  static async getCustomerPaymentIntents(customerId: string): Promise<StripeTransactionData[]> {
    try {
      const paymentIntents = await stripe.paymentIntents.list({
        customer: customerId,
        limit: 100, // Stripe's max limit
      });

      return paymentIntents.data.map(intent => ({
        id: intent.id,
        amount: intent.amount,
        currency: intent.currency,
        status: intent.status,
        created: intent.created,
        customer: intent.customer as string,
        payment_method: intent.payment_method as string,
        description: intent.description || undefined,
        metadata: intent.metadata,
        receipt_url: intent.charges?.data[0]?.receipt_url || undefined,
        type: 'payment_intent' as const,
      }));
    } catch (error) {
      console.error('Error fetching customer payment intents:', error);
      throw error;
    }
  }

  /**
   * Fetch all charges for a specific customer
   */
  static async getCustomerCharges(customerId: string): Promise<StripeTransactionData[]> {
    try {
      const charges = await stripe.charges.list({
        customer: customerId,
        limit: 100,
      });

      return charges.data.map(charge => ({
        id: charge.id,
        amount: charge.amount,
        currency: charge.currency,
        status: charge.status || 'unknown',
        created: charge.created,
        customer: charge.customer as string,
        payment_method: charge.payment_method as string,
        description: charge.description || undefined,
        metadata: charge.metadata,
        receipt_url: charge.receipt_url || undefined,
        type: 'charge' as const,
      }));
    } catch (error) {
      console.error('Error fetching customer charges:', error);
      throw error;
    }
  }

  /**
   * Get all transactions for a customer (both payment intents and charges)
   */
  static async getCustomerTransactions(customerId: string): Promise<StripeTransactionData[]> {
    try {
      const [paymentIntents, charges] = await Promise.all([
        this.getCustomerPaymentIntents(customerId),
        this.getCustomerCharges(customerId),
      ]);

      // Combine and sort by creation date
      const allTransactions = [...paymentIntents, ...charges];
      return allTransactions.sort((a, b) => b.created - a.created);
    } catch (error) {
      console.error('Error fetching customer transactions:', error);
      throw error;
    }
  }

  /**
   * Fetch all payment intents (for admin overview)
   */
  static async getAllPaymentIntents(limit: number = 50): Promise<StripeTransactionData[]> {
    try {
      const paymentIntents = await stripe.paymentIntents.list({
        limit,
      });

      return paymentIntents.data.map(intent => ({
        id: intent.id,
        amount: intent.amount,
        currency: intent.currency,
        status: intent.status,
        created: intent.created,
        customer: intent.customer as string,
        payment_method: intent.payment_method as string,
        description: intent.description || undefined,
        metadata: intent.metadata,
        receipt_url: intent.charges?.data[0]?.receipt_url || undefined,
        type: 'payment_intent' as const,
      }));
    } catch (error) {
      console.error('Error fetching all payment intents:', error);
      throw error;
    }
  }

  /**
   * Get customer by email (to link transactions to users)
   */
  static async getCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
    try {
      const customers = await stripe.customers.list({
        email,
        limit: 1,
      });

      return customers.data[0] || null;
    } catch (error) {
      console.error('Error fetching customer by email:', error);
      return null;
    }
  }

  /**
   * Create or get customer for a user
   */
  static async createOrGetCustomer(userId: string, email: string, name?: string): Promise<Stripe.Customer> {
    try {
      // First try to find existing customer
      const existingCustomer = await this.getCustomerByEmail(email);
      if (existingCustomer) {
        return existingCustomer;
      }

      // Create new customer
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId,
        },
      });

      return customer;
    } catch (error) {
      console.error('Error creating/getting customer:', error);
      throw error;
    }
  }

  /**
   * Sync user transactions with local database
   */
  static async syncUserTransactions(userId: string, email: string): Promise<{
    synced: number;
    transactions: StripeTransactionData[];
  }> {
    try {
      // Get or create Stripe customer
      const customer = await this.createOrGetCustomer(userId, email);
      
      // Get all transactions for this customer
      const transactions = await this.getCustomerTransactions(customer.id);
      
      // Here you would sync with your local database
      // For now, we'll just return the data
      return {
        synced: transactions.length,
        transactions,
      };
    } catch (error) {
      console.error('Error syncing user transactions:', error);
      throw error;
    }
  }
}
