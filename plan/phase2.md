# Phase 2: Payment Integration

## Duration: 1.5 weeks

## Objectives
- Integrate Stripe for international payments
- Implement Twint for Swiss mobile payments
- Create pay-per-generation system
- Set up shop subscription billing
- Handle webhooks and payment events
- Implement payment security

## Technical Implementation

### 1. Stripe Setup (Day 1-2)

```bash
# Install Stripe dependencies
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
npm install -D @types/stripe
```

**Environment Variables**
```env
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
TWINT_API_KEY=twint_key_xxx
TWINT_MERCHANT_ID=merchant_xxx
```

### 2. Payment Database Schema (Day 2)

**src/db/schema/payments.ts**
```typescript
import { pgTable, uuid, text, timestamp, decimal, jsonb, boolean, integer } from 'drizzle-orm/pg-core';

export const paymentMethods = pgTable('payment_methods', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(), // 'card', 'twint', 'sepa'
  provider: text('provider').notNull(), // 'stripe', 'twint'
  stripePaymentMethodId: text('stripe_payment_method_id'),
  last4: text('last4'),
  brand: text('brand'),
  expiryMonth: integer('expiry_month'),
  expiryYear: integer('expiry_year'),
  isDefault: boolean('is_default').default(false),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  shopId: uuid('shop_id').references(() => shops.id),
  recipeId: uuid('recipe_id').references(() => recipes.id),
  type: text('type').notNull(), // 'generation', 'subscription', 'order'
  status: text('status').notNull(), // 'pending', 'processing', 'completed', 'failed', 'refunded'
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('CHF').notNull(),
  provider: text('provider').notNull(), // 'stripe', 'twint'
  providerTransactionId: text('provider_transaction_id'),
  paymentMethodId: uuid('payment_method_id').references(() => paymentMethods.id),
  metadata: jsonb('metadata'),
  failureReason: text('failure_reason'),
  refundedAmount: decimal('refunded_amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id).notNull(),
  planId: text('plan_id').notNull(), // 'starter', 'professional', 'enterprise'
  status: text('status').notNull(), // 'trialing', 'active', 'cancelled', 'past_due'
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripeCustomerId: text('stripe_customer_id'),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  trialEnd: timestamp('trial_end'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id),
  shopId: uuid('shop_id').references(() => shops.id),
  stripeInvoiceId: text('stripe_invoice_id'),
  number: text('number').notNull(),
  status: text('status').notNull(), // 'draft', 'open', 'paid', 'void'
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('CHF').notNull(),
  dueDate: timestamp('due_date'),
  paidAt: timestamp('paid_at'),
  hostedInvoiceUrl: text('hosted_invoice_url'),
  pdfUrl: text('pdf_url'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const generationCredits = pgTable('generation_credits', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  credits: integer('credits').default(0).notNull(),
  freeCredits: integer('free_credits').default(3).notNull(), // New users get 3 free
  paidCredits: integer('paid_credits').default(0).notNull(),
  monthlyPassActive: boolean('monthly_pass_active').default(false),
  monthlyPassExpiry: timestamp('monthly_pass_expiry'),
  lastResetDate: timestamp('last_reset_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### 3. Stripe Service Implementation (Day 3-4)

**src/lib/stripe/config.ts**
```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const PRICES = {
  generation: {
    single: 150, // CHF 1.50 in cents
    pack10: 1200, // CHF 12.00 for 10 generations
    pack50: 5000, // CHF 50.00 for 50 generations
    monthlyPass: 990, // CHF 9.90 unlimited monthly
  },
  shopSubscription: {
    starter: {
      monthly: 4900, // CHF 49.00
      yearly: 49000, // CHF 490.00
    },
    professional: {
      monthly: 14900, // CHF 149.00
      yearly: 149000, // CHF 1490.00
    },
    enterprise: {
      monthly: 29900, // CHF 299.00
      yearly: 299000, // CHF 2990.00
    },
  },
};

export const STRIPE_PRODUCTS = {
  generation: {
    single: 'price_xxx',
    pack10: 'price_xxx',
    pack50: 'price_xxx',
    monthlyPass: 'price_xxx',
  },
  subscription: {
    starter: {
      monthly: 'price_xxx',
      yearly: 'price_xxx',
    },
    professional: {
      monthly: 'price_xxx',
      yearly: 'price_xxx',
    },
    enterprise: {
      monthly: 'price_xxx',
      yearly: 'price_xxx',
    },
  },
};
```

**src/lib/stripe/service.ts**
```typescript
import { stripe, PRICES, STRIPE_PRODUCTS } from './config';
import { db } from '@/lib/db';
import { transactions, paymentMethods, generationCredits } from '@/db/schema/payments';
import { eq } from 'drizzle-orm';

export class StripeService {
  // Create a payment intent for generation credits
  async createGenerationPayment(
    userId: string,
    creditPackage: 'single' | 'pack10' | 'pack50' | 'monthlyPass'
  ) {
    const amount = PRICES.generation[creditPackage];
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'chf',
      metadata: {
        userId,
        type: 'generation',
        package: creditPackage,
      },
    });

    // Create pending transaction
    await db.insert(transactions).values({
      userId,
      type: 'generation',
      status: 'pending',
      amount: String(amount / 100),
      currency: 'CHF',
      provider: 'stripe',
      providerTransactionId: paymentIntent.id,
      metadata: { package: creditPackage },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  // Create or get Stripe customer
  async getOrCreateCustomer(userId: string, email: string, name?: string) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user[0]?.stripeCustomerId) {
      return user[0].stripeCustomerId;
    }

    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    await db
      .update(users)
      .set({ stripeCustomerId: customer.id })
      .where(eq(users.id, userId));

    return customer.id;
  }

  // Create subscription for shop
  async createShopSubscription(
    shopId: string,
    planId: 'starter' | 'professional' | 'enterprise',
    interval: 'monthly' | 'yearly' = 'monthly'
  ) {
    const shop = await db
      .select()
      .from(shops)
      .where(eq(shops.id, shopId))
      .limit(1);

    if (!shop[0]) throw new Error('Shop not found');

    const customerId = await this.getOrCreateCustomer(
      shop[0].ownerId,
      shop[0].email,
      shop[0].name
    );

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: STRIPE_PRODUCTS.subscription[planId][interval],
      }],
      metadata: {
        shopId,
        planId,
      },
      trial_period_days: 14, // 2 weeks free trial
    });

    await db.insert(subscriptions).values({
      shopId,
      planId,
      status: subscription.status,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    });

    return subscription;
  }

  // Process successful payment
  async processPaymentSuccess(paymentIntentId: string) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment not successful');
    }

    const { userId, type, package: creditPackage } = paymentIntent.metadata;

    // Update transaction status
    await db
      .update(transactions)
      .set({ 
        status: 'completed',
        updatedAt: new Date(),
      })
      .where(eq(transactions.providerTransactionId, paymentIntentId));

    // Add credits if it's a generation payment
    if (type === 'generation') {
      const creditsToAdd = this.getCreditsForPackage(creditPackage);
      
      await db
        .update(generationCredits)
        .set({
          paidCredits: sql`paid_credits + ${creditsToAdd}`,
          monthlyPassActive: creditPackage === 'monthlyPass' ? true : undefined,
          monthlyPassExpiry: creditPackage === 'monthlyPass' 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
            : undefined,
          updatedAt: new Date(),
        })
        .where(eq(generationCredits.userId, userId));
    }

    return { success: true };
  }

  private getCreditsForPackage(packageType: string): number {
    const packages: Record<string, number> = {
      single: 1,
      pack10: 10,
      pack50: 50,
      monthlyPass: 9999, // Unlimited for practical purposes
    };
    return packages[packageType] || 0;
  }
}
```

### 4. Twint Integration (Day 5-6)

**src/lib/twint/config.ts**
```typescript
export const TWINT_CONFIG = {
  apiUrl: process.env.TWINT_API_URL || 'https://api.twint.ch',
  apiKey: process.env.TWINT_API_KEY!,
  merchantId: process.env.TWINT_MERCHANT_ID!,
  webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/twint`,
};
```

**src/lib/twint/service.ts**
```typescript
import { TWINT_CONFIG } from './config';
import { db } from '@/lib/db';
import { transactions } from '@/db/schema/payments';

export class TwintService {
  private headers = {
    'Authorization': `Bearer ${TWINT_CONFIG.apiKey}`,
    'Content-Type': 'application/json',
    'X-Merchant-Id': TWINT_CONFIG.merchantId,
  };

  async createPayment(
    amount: number,
    reference: string,
    userId: string,
    description: string
  ) {
    const response = await fetch(`${TWINT_CONFIG.apiUrl}/payments`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        amount: amount * 100, // Convert to cents
        currency: 'CHF',
        reference,
        description,
        webhookUrl: TWINT_CONFIG.webhookUrl,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create Twint payment');
    }

    const data = await response.json();

    // Store transaction
    await db.insert(transactions).values({
      userId,
      type: 'generation',
      status: 'pending',
      amount: String(amount),
      currency: 'CHF',
      provider: 'twint',
      providerTransactionId: data.paymentId,
      metadata: { reference },
    });

    return {
      paymentUrl: data.paymentUrl,
      paymentId: data.paymentId,
      qrCode: data.qrCode,
    };
  }

  async checkPaymentStatus(paymentId: string) {
    const response = await fetch(`${TWINT_CONFIG.apiUrl}/payments/${paymentId}`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }

    const data = await response.json();
    return data.status; // 'pending', 'completed', 'cancelled', 'failed'
  }

  async processWebhook(payload: any, signature: string) {
    // Verify webhook signature
    const isValid = this.verifyWebhookSignature(payload, signature);
    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }

    const { paymentId, status, amount } = payload;

    // Update transaction status
    await db
      .update(transactions)
      .set({ 
        status: status === 'SUCCESSFUL' ? 'completed' : 'failed',
        updatedAt: new Date(),
      })
      .where(eq(transactions.providerTransactionId, paymentId));

    // Process credits if successful
    if (status === 'SUCCESSFUL') {
      // Add logic to credit user account
    }

    return { processed: true };
  }

  private verifyWebhookSignature(payload: any, signature: string): boolean {
    // Implement HMAC signature verification
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', TWINT_CONFIG.apiKey)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return signature === expectedSignature;
  }
}
```

### 5. Payment Components (Day 7)

**app/components/payment/PaymentModal.tsx**
```typescript
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  type: 'generation' | 'subscription';
}

export function PaymentModal({ isOpen, onClose, onSuccess, amount, type }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'twint'>('stripe');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const creditPackages = [
    { id: 'single', credits: 1, price: 1.50, savings: null },
    { id: 'pack10', credits: 10, price: 12.00, savings: '20%' },
    { id: 'pack50', credits: 50, price: 50.00, savings: '33%' },
    { id: 'monthlyPass', credits: 'Unlimited', price: 9.90, savings: 'Best Value' },
  ];

  const [selectedPackage, setSelectedPackage] = useState('single');

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package: selectedPackage,
          type: 'generation',
        }),
      });

      const { clientSecret } = await response.json();
      // Handle Stripe payment with clientSecret
      onSuccess();
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTwintPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments/twint/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: creditPackages.find(p => p.id === selectedPackage)?.price,
          description: 'Smoothie Generation Credits',
        }),
      });

      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl;
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Purchase Generation Credits</DialogTitle>
          <DialogDescription>
            Choose a credit package and payment method
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Credit Packages */}
          <div className="grid grid-cols-2 gap-3">
            {creditPackages.map((pkg) => (
              <Card 
                key={pkg.id}
                className={`cursor-pointer transition-all ${
                  selectedPackage === pkg.id ? 'border-primary ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {pkg.credits === 'Unlimited' ? 'Monthly Pass' : `${pkg.credits} Credits`}
                      </CardTitle>
                      <p className="text-2xl font-bold mt-2">CHF {pkg.price}</p>
                    </div>
                    {pkg.savings && (
                      <Badge variant="secondary" className="ml-2">
                        {pkg.savings}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Payment Methods */}
          <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stripe">
                <CreditCard className="w-4 h-4 mr-2" />
                Card
              </TabsTrigger>
              <TabsTrigger value="twint">
                <Smartphone className="w-4 h-4 mr-2" />
                TWINT
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stripe" className="mt-4">
              <Elements stripe={stripePromise}>
                <StripePaymentForm onSubmit={handleStripePayment} loading={loading} />
              </Elements>
            </TabsContent>

            <TabsContent value="twint" className="mt-4">
              <div className="text-center py-8">
                <Smartphone className="w-16 h-16 mx-auto mb-4 text-primary" />
                <p className="text-sm text-gray-600 mb-4">
                  You'll be redirected to TWINT to complete payment
                </p>
                <Button 
                  className="w-full" 
                  onClick={handleTwintPayment}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Pay with TWINT'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StripePaymentForm({ onSubmit, loading }: any) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" className="w-full mt-4" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
}
```

### 6. API Routes (Day 8)

**app/api/payments/create-intent/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/stripe/service';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { package: creditPackage, type } = await request.json();
    const stripeService = new StripeService();

    const { clientSecret, paymentIntentId } = await stripeService.createGenerationPayment(
      user.id,
      creditPackage
    );

    return NextResponse.json({ clientSecret, paymentIntentId });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
```

**app/api/webhooks/stripe/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { StripeService } from '@/lib/stripe/service';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const stripeService = new StripeService();

  switch (event.type) {
    case 'payment_intent.succeeded':
      await stripeService.processPaymentSuccess(event.data.object.id);
      break;

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      // Handle subscription updates
      break;

    case 'invoice.paid':
      // Handle invoice payment
      break;

    case 'invoice.payment_failed':
      // Handle failed payment
      break;
  }

  return NextResponse.json({ received: true });
}
```

### 7. Generation Credits System (Day 9)

**app/components/credits/CreditBalance.tsx**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Coins, TrendingUp, Calendar, Sparkles } from 'lucide-react';

export function CreditBalance() {
  const [credits, setCredits] = useState({
    total: 0,
    free: 3,
    paid: 0,
    monthlyPass: false,
    monthlyPassExpiry: null,
  });

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    const response = await fetch('/api/credits/balance');
    const data = await response.json();
    setCredits(data);
  };

  const totalCredits = credits.free + credits.paid;
  const percentageUsed = credits.monthlyPass ? 0 : ((3 - credits.free) / 3) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Generation Credits
          </span>
          {credits.monthlyPass && (
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="w-3 h-3 mr-1" />
              Monthly Pass Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {credits.monthlyPass ? (
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-primary">Unlimited</p>
              <p className="text-sm text-muted-foreground mt-1">
                Valid until {new Date(credits.monthlyPassExpiry).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{totalCredits}</span>
                <span className="text-sm text-muted-foreground">
                  {credits.free} free + {credits.paid} paid
                </span>
              </div>
              <Progress value={percentageUsed} className="h-2" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Free Credits: {credits.free}/3</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span>Paid Credits: {credits.paid}</span>
                </div>
              </div>
            </>
          )}

          <Button className="w-full" onClick={() => window.location.href = '/credits/purchase'}>
            {credits.monthlyPass ? 'Manage Subscription' : 'Buy More Credits'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 8. Shop Subscription Management (Day 10)

**app/shop-dashboard/subscription/page.tsx**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 49, yearly: 490 },
    features: [
      'Up to 50 orders/month',
      'Basic analytics',
      'Standard support',
      'Single location',
    ],
    limits: {
      orders: 50,
      locations: 1,
      analytics: 'basic',
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    price: { monthly: 149, yearly: 1490 },
    features: [
      'Unlimited orders',
      'Advanced analytics',
      'Priority support',
      'Multiple locations',
      'Custom branding',
      'API access',
    ],
    limits: {
      orders: -1,
      locations: 5,
      analytics: 'advanced',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 299, yearly: 2990 },
    features: [
      'Everything in Professional',
      'Unlimited locations',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'White-label options',
    ],
    limits: {
      orders: -1,
      locations: -1,
      analytics: 'enterprise',
    },
  },
];

export default function ShopSubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState('starter');
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (planId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/shop/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          interval: billing,
        }),
      });

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-muted-foreground">
          Choose the plan that best fits your business needs
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border p-1">
          <Button
            variant={billing === 'monthly' ? 'default' : 'ghost'}
            onClick={() => setBilling('monthly')}
            className="px-4"
          >
            Monthly
          </Button>
          <Button
            variant={billing === 'yearly' ? 'default' : 'ghost'}
            onClick={() => setBilling('yearly')}
            className="px-4"
          >
            Yearly (Save 20%)
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={plan.id === 'professional' ? 'border-primary' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.id === 'professional' && (
                  <Badge>Most Popular</Badge>
                )}
              </CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">
                  CHF {plan.price[billing]}
                </span>
                <span className="text-muted-foreground">
                  /{billing === 'monthly' ? 'month' : 'year'}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.id === currentPlan ? 'outline' : 'default'}
                disabled={plan.id === currentPlan || loading}
                onClick={() => handleUpgrade(plan.id)}
              >
                {plan.id === currentPlan ? 'Current Plan' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## Testing Checklist

### Payment Flow Tests
- [ ] Stripe payment intent creation works
- [ ] Card payments process successfully
- [ ] Twint redirect works correctly
- [ ] Payment webhooks are received
- [ ] Failed payments are handled gracefully
- [ ] Refunds process correctly

### Credits System Tests
- [ ] New users get 3 free credits
- [ ] Credits deduct on generation
- [ ] Credit purchases add correctly
- [ ] Monthly pass activates unlimited
- [ ] Monthly pass expiry works

### Subscription Tests
- [ ] Shop subscription creation works
- [ ] Trial period applies correctly
- [ ] Subscription upgrades work
- [ ] Downgrades handle properly
- [ ] Cancellations process correctly
- [ ] Invoice generation works

### Security Tests
- [ ] Webhook signatures verified
- [ ] Payment amounts validated
- [ ] User authorization checked
- [ ] Rate limiting on payment endpoints
- [ ] PCI compliance maintained

## Deployment Checklist

- [ ] Stripe webhook endpoint configured
- [ ] Twint webhook endpoint configured
- [ ] Environment variables set in production
- [ ] SSL certificates valid
- [ ] Payment retry logic implemented
- [ ] Error logging configured
- [ ] Monitoring alerts set up

## Security Considerations

1. **PCI Compliance**
   - Never store card details
   - Use Stripe Elements for card input
   - Implement 3D Secure when required

2. **Webhook Security**
   - Verify signatures on all webhooks
   - Implement idempotency
   - Rate limit webhook endpoints

3. **Transaction Security**
   - Validate amounts server-side
   - Implement fraud detection rules
   - Log all payment attempts

## Performance Targets

- Payment intent creation: < 500ms
- Webhook processing: < 200ms
- Credit balance query: < 100ms
- Subscription check: < 150ms

## Monitoring & Analytics

- Payment success rate
- Average transaction value
- Credit usage patterns
- Subscription conversion rate
- Payment method distribution
- Failed payment reasons

## Next Phase

[Phase 3: User Experience Enhancement](./phase3.md) - Improve user dashboard and interaction features