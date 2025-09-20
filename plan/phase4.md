# Phase 4: Shop Owner Portal

## Duration: 5-6 days (AI-Assisted)

## Objectives
- Shop registration and onboarding flow
- Comprehensive shop dashboard
- Inventory and menu management
- Order processing system
- Recipe modification suggestions
- Analytics and reporting

## Technical Implementation

### 1. Shop Database Extensions (Day 1)

**src/db/schema/shop-operations.ts**
```typescript
import { pgTable, uuid, text, timestamp, jsonb, decimal, boolean, integer } from 'drizzle-orm/pg-core';

export const shopInventory = pgTable('shop_inventory', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id).notNull(),
  ingredientId: uuid('ingredient_id').references(() => ingredients.id).notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: text('unit').notNull(), // 'kg', 'liters', 'units'
  minStock: decimal('min_stock', { precision: 10, scale: 2 }),
  maxStock: decimal('max_stock', { precision: 10, scale: 2 }),
  costPerUnit: decimal('cost_per_unit', { precision: 10, scale: 2 }),
  supplier: text('supplier'),
  lastRestocked: timestamp('last_restocked'),
  expiryDate: timestamp('expiry_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const shopOrders = pgTable('shop_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  recipeId: uuid('recipe_id').references(() => recipes.id),
  orderNumber: text('order_number').unique().notNull(),
  status: text('status').notNull(), // 'pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'
  items: jsonb('items').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  preparationTime: integer('preparation_time'), // in minutes
  scheduledPickup: timestamp('scheduled_pickup'),
  notes: text('notes'),
  customerNotes: text('customer_notes'),
  shopNotes: text('shop_notes'),
  acceptedAt: timestamp('accepted_at'),
  preparedAt: timestamp('prepared_at'),
  completedAt: timestamp('completed_at'),
  cancelledAt: timestamp('cancelled_at'),
  cancellationReason: text('cancellation_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const shopAnalytics = pgTable('shop_analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id).notNull(),
  date: timestamp('date').notNull(),
  ordersReceived: integer('orders_received').default(0),
  ordersCompleted: integer('orders_completed').default(0),
  ordersCancelled: integer('orders_cancelled').default(0),
  revenue: decimal('revenue', { precision: 10, scale: 2 }).default('0'),
  averageOrderValue: decimal('average_order_value', { precision: 10, scale: 2 }),
  averagePreparationTime: integer('average_preparation_time'), // in minutes
  popularItems: jsonb('popular_items'),
  peakHours: jsonb('peak_hours'),
  customerSatisfaction: decimal('customer_satisfaction', { precision: 3, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recipeModifications = pgTable('recipe_modifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id).notNull(),
  originalRecipeId: uuid('original_recipe_id').references(() => recipes.id).notNull(),
  modifiedRecipeId: uuid('modified_recipe_id').references(() => recipes.id),
  modifications: jsonb('modifications').notNull(),
  reason: text('reason'),
  additionalCost: decimal('additional_cost', { precision: 10, scale: 2 }),
  status: text('status').default('suggested'), // 'suggested', 'approved', 'rejected'
  approvedBy: uuid('approved_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### 2. Shop Registration Flow (Day 2-3)

**app/shop-register/page.tsx**
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Stepper,
  StepperItem,
  StepperTrigger,
} from '@/components/ui/stepper';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import {
  Store,
  MapPin,
  Clock,
  Package,
  CreditCard,
  CheckCircle,
} from 'lucide-react';

const shopRegistrationSchema = z.object({
  // Step 1: Basic Info
  shopName: z.string().min(2, 'Shop name must be at least 2 characters'),
  businessRegistrationNumber: z.string().min(5),
  ownerName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(10),
  website: z.string().url().optional(),
  
  // Step 2: Location
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(4),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  
  // Step 3: Business Hours
  businessHours: z.object({
    monday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
    tuesday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
    wednesday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
    thursday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
    friday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
    saturday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
    sunday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
  }),
  
  // Step 4: Capabilities
  capabilities: z.object({
    hasFrozenFruits: z.array(z.string()),
    hasMilks: z.array(z.string()),
    hasYogurts: z.array(z.string()),
    hasSuperfoods: z.array(z.string()),
    canMakeLayered: z.boolean(),
    averagePrepTime: z.number().min(1).max(30),
    maxOrdersPerHour: z.number().min(1),
  }),
  
  // Step 5: Subscription
  subscriptionPlan: z.enum(['starter', 'professional', 'enterprise']),
  billingInterval: z.enum(['monthly', 'yearly']),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

const steps = [
  { id: 'basic', title: 'Basic Information', icon: Store },
  { id: 'location', title: 'Location', icon: MapPin },
  { id: 'hours', title: 'Business Hours', icon: Clock },
  { id: 'capabilities', title: 'Capabilities', icon: Package },
  { id: 'subscription', title: 'Subscription', icon: CreditCard },
  { id: 'review', title: 'Review & Submit', icon: CheckCircle },
];

export default function ShopRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(shopRegistrationSchema),
    defaultValues: {
      shopName: '',
      businessRegistrationNumber: '',
      ownerName: '',
      email: '',
      phoneNumber: '',
      website: '',
      address: '',
      city: '',
      postalCode: '',
      businessHours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '10:00', close: '16:00', closed: false },
        sunday: { open: '10:00', close: '16:00', closed: false },
      },
      capabilities: {
        hasFrozenFruits: [],
        hasMilks: [],
        hasYogurts: [],
        hasSuperfoods: [],
        canMakeLayered: false,
        averagePrepTime: 10,
        maxOrdersPerHour: 10,
      },
      subscriptionPlan: 'starter',
      billingInterval: 'monthly',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof shopRegistrationSchema>) => {
    try {
      const response = await fetch('/api/shops/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { shopId } = await response.json();
        toast({
          title: 'Registration successful!',
          description: 'Your shop has been registered. Redirecting to dashboard...',
        });
        router.push(`/shop-dashboard/${shopId}`);
      }
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Register Your Shop</h1>
        <p className="text-muted-foreground">
          Join the Lifegenix marketplace and reach more customers
        </p>
      </div>

      {/* Progress */}
      <Progress value={(currentStep + 1) / steps.length * 100} className="mb-8" />

      {/* Stepper */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center ${
              index <= currentStep ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div className={`rounded-full p-2 ${
              index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200'
            }`}>
              <step.icon className="w-5 h-5" />
            </div>
            <span className="ml-2 hidden md:inline">{step.title}</span>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>
                {getStepDescription(currentStep)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 0 && <BasicInfoStep form={form} />}
              {currentStep === 1 && <LocationStep form={form} />}
              {currentStep === 2 && <BusinessHoursStep form={form} />}
              {currentStep === 3 && <CapabilitiesStep form={form} />}
              {currentStep === 4 && <SubscriptionStep form={form} />}
              {currentStep === 5 && <ReviewStep form={form} />}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit">
                  Complete Registration
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

function getStepDescription(step: number): string {
  const descriptions = [
    'Tell us about your business',
    'Where is your shop located?',
    'When are you open for business?',
    'What ingredients and equipment do you have?',
    'Choose your subscription plan',
    'Review your information and submit',
  ];
  return descriptions[step];
}

// Step components would be defined here...
```

### 3. Shop Dashboard (Day 4-5)

**app/shop-dashboard/[shopId]/page.tsx**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Package,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { OrderQueue } from '@/components/shop/OrderQueue';
import { InventoryManager } from '@/components/shop/InventoryManager';
import { MenuEditor } from '@/components/shop/MenuEditor';
import { RevenueChart } from '@/components/shop/RevenueChart';

export default function ShopDashboardPage({ params }: { params: { shopId: string } }) {
  const [shop, setShop] = useState(null);
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    weekOrders: 0,
    weekRevenue: 0,
    averageOrderValue: 0,
    averagePrepTime: 0,
    pendingOrders: 0,
    completedOrders: 0,
    customerSatisfaction: 0,
    inventoryAlerts: 0,
  });
  const [activeOrders, setActiveOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    // Set up real-time updates
    const ws = setupWebSocket();
    return () => ws.close();
  }, [params.shopId]);

  const fetchDashboardData = async () => {
    const [shopRes, statsRes, ordersRes] = await Promise.all([
      fetch(`/api/shops/${params.shopId}`),
      fetch(`/api/shops/${params.shopId}/stats`),
      fetch(`/api/shops/${params.shopId}/orders?status=active`),
    ]);

    setShop(await shopRes.json());
    setStats(await statsRes.json());
    setActiveOrders(await ordersRes.json());
  };

  const setupWebSocket = () => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/shops/${params.shopId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_order') {
        setActiveOrders(prev => [data.order, ...prev]);
        playNotificationSound();
      } else if (data.type === 'order_update') {
        updateOrderStatus(data.orderId, data.status);
      }
    };

    return ws;
  };

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/new-order.mp3');
    audio.play();
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    setActiveOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{shop?.name} Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your orders, inventory, and business analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={shop?.isOpen ? 'success' : 'secondary'}>
            {shop?.isOpen ? 'Open' : 'Closed'}
          </Badge>
          <Button onClick={() => toggleShopStatus()}>
            {shop?.isOpen ? 'Close Shop' : 'Open Shop'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingOrders} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">CHF {stats.todayRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: CHF {stats.averageOrderValue.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Prep Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averagePrepTime} min</div>
            <p className="text-xs text-muted-foreground">
              Last 50 orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customerSatisfaction}%</div>
            <p className="text-xs text-muted-foreground">
              Based on ratings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <OrderQueue orders={activeOrders} shopId={params.shopId} />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryManager shopId={params.shopId} />
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <MenuEditor shopId={params.shopId} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <ShopAnalytics shopId={params.shopId} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <ShopSettings shop={shop} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 4. Order Management System (Day 6-7)

**components/shop/OrderQueue.tsx**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Clock,
  User,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Phone,
} from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    modifications: string[];
    price: number;
  }>;
  status: string;
  totalAmount: number;
  preparationTime: number;
  scheduledPickup: Date;
  notes: string;
  createdAt: Date;
}

export function OrderQueue({ orders, shopId }: { orders: Order[]; shopId: string }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const { toast } = useToast();

  const groupedOrders = {
    pending: orders.filter(o => o.status === 'pending'),
    accepted: orders.filter(o => o.status === 'accepted'),
    preparing: orders.filter(o => o.status === 'preparing'),
    ready: orders.filter(o => o.status === 'ready'),
  };

  const acceptOrder = async (orderId: string) => {
    const response = await fetch(`/api/shops/${shopId}/orders/${orderId}/accept`, {
      method: 'POST',
    });

    if (response.ok) {
      toast({
        title: 'Order accepted',
        description: 'Customer has been notified',
      });
    }
  };

  const rejectOrder = async (orderId: string) => {
    const response = await fetch(`/api/shops/${shopId}/orders/${orderId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: rejectReason }),
    });

    if (response.ok) {
      toast({
        title: 'Order rejected',
        description: 'Customer has been notified and refunded',
      });
      setShowRejectDialog(false);
      setRejectReason('');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const response = await fetch(`/api/shops/${shopId}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      toast({
        title: 'Status updated',
        description: `Order is now ${status}`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {/* Pending Orders */}
      <Card className="border-yellow-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            Pending ({groupedOrders.pending.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {groupedOrders.pending.map((order) => (
                <Card 
                  key={order.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">#{order.orderNumber}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {order.customer.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {format(new Date(order.scheduledPickup), 'HH:mm')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {order.items.length} items
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          acceptOrder(order.id);
                        }}
                      >
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                          setShowRejectDialog(true);
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Accepted Orders */}
      <Card className="border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            Accepted ({groupedOrders.accepted.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {groupedOrders.accepted.map((order) => (
                <OrderCard 
                  key={order.id}
                  order={order}
                  onStatusChange={(status) => updateOrderStatus(order.id, status)}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Preparing Orders */}
      <Card className="border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-purple-600" />
            Preparing ({groupedOrders.preparing.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {groupedOrders.preparing.map((order) => (
                <OrderCard 
                  key={order.id}
                  order={order}
                  onStatusChange={(status) => updateOrderStatus(order.id, status)}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Ready Orders */}
      <Card className="border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Ready ({groupedOrders.ready.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {groupedOrders.ready.map((order) => (
                <OrderCard 
                  key={order.id}
                  order={order}
                  onStatusChange={(status) => updateOrderStatus(order.id, status)}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <OrderDetailDialog 
        order={selectedOrder}
        isOpen={!!selectedOrder && !showRejectDialog}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={(status) => {
          if (selectedOrder) {
            updateOrderStatus(selectedOrder.id, status);
          }
        }}
      />

      {/* Reject Order Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this order
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedOrder && rejectOrder(selectedOrder.id)}
              disabled={!rejectReason}
            >
              Reject Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

### 5. Recipe Modification System (Day 8-9)

**components/shop/RecipeModificationSuggestion.tsx**
```typescript
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Minus, AlertCircle, CheckCircle } from 'lucide-react';

interface RecipeModification {
  originalIngredient: string;
  suggestedIngredient: string;
  reason: 'unavailable' | 'quality' | 'cost' | 'preference';
  costImpact: number;
  nutritionImpact: {
    calories: number;
    protein: number;
    fiber: number;
  };
}

export function RecipeModificationSuggestion({ 
  recipe, 
  shopInventory,
  shopId 
}: {
  recipe: any;
  shopInventory: any[];
  shopId: string;
}) {
  const [modifications, setModifications] = useState<RecipeModification[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const analyzeRecipe = () => {
    // Check each ingredient against shop inventory
    const suggestedMods: RecipeModification[] = [];
    
    recipe.layers.forEach((layer: any) => {
      layer.ingredients.forEach((ing: any) => {
        const inventoryItem = shopInventory.find(
          item => item.ingredientId === ing.ingredient.id
        );
        
        if (!inventoryItem || inventoryItem.quantity < ing.amount) {
          // Suggest alternative
          const alternative = findAlternative(ing.ingredient);
          if (alternative) {
            suggestedMods.push({
              originalIngredient: ing.ingredient.name,
              suggestedIngredient: alternative.name,
              reason: 'unavailable',
              costImpact: alternative.cost - ing.ingredient.cost,
              nutritionImpact: calculateNutritionDifference(
                ing.ingredient,
                alternative
              ),
            });
          }
        }
      });
    });
    
    setModifications(suggestedMods);
    setShowDialog(true);
  };

  const findAlternative = (ingredient: any) => {
    // Logic to find similar ingredients in inventory
    const alternatives = shopInventory.filter(
      item => item.category === ingredient.category && 
      item.ingredientId !== ingredient.id &&
      item.quantity > 0
    );
    
    return alternatives[0]; // Return best match
  };

  const calculateNutritionDifference = (original: any, alternative: any) => {
    return {
      calories: alternative.nutrition.calories - original.nutrition.calories,
      protein: alternative.nutrition.protein - original.nutrition.protein,
      fiber: alternative.nutrition.fiber - original.nutrition.fiber,
    };
  };

  const submitModifications = async () => {
    const response = await fetch(`/api/shops/${shopId}/modifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipeId: recipe.id,
        modifications,
      }),
    });

    if (response.ok) {
      toast({
        title: 'Modifications suggested',
        description: 'Customer will be notified of the changes',
      });
      setShowDialog(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Compatibility</CardTitle>
        <CardDescription>
          Check if you can make this recipe with your current inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={analyzeRecipe}>
          Analyze Recipe
        </Button>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Suggested Modifications</DialogTitle>
              <DialogDescription>
                Based on your inventory, here are suggested modifications
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {modifications.length === 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>All ingredients are available!</span>
                </div>
              ) : (
                modifications.map((mod, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            Replace {mod.originalIngredient}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            with {mod.suggestedIngredient}
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {mod.reason}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            Cost impact: 
                            <span className={mod.costImpact > 0 ? 'text-red-600' : 'text-green-600'}>
                              {mod.costImpact > 0 ? '+' : ''}CHF {mod.costImpact.toFixed(2)}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Calories: {mod.nutritionImpact.calories > 0 ? '+' : ''}{mod.nutritionImpact.calories}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              {modifications.length > 0 && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitModifications}>
                    Suggest to Customer
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
```

## Testing Checklist

### Registration & Onboarding
- [ ] Shop registration form validates correctly
- [ ] Business verification works
- [ ] Subscription selection processes
- [ ] Welcome email sent
- [ ] Shop profile created

### Dashboard & Analytics
- [ ] Real-time order notifications work
- [ ] Stats update correctly
- [ ] Charts display accurate data
- [ ] Export functionality works
- [ ] Performance metrics accurate

### Order Management
- [ ] New orders appear instantly
- [ ] Status updates sync properly
- [ ] Accept/reject functions work
- [ ] Customer notifications sent
- [ ] Order history tracks correctly

### Inventory Management
- [ ] Stock levels update correctly
- [ ] Low stock alerts trigger
- [ ] Reorder suggestions accurate
- [ ] Expiry tracking works
- [ ] Supplier management functions

### Recipe Modifications
- [ ] Compatibility check works
- [ ] Alternative suggestions logical
- [ ] Cost calculations accurate
- [ ] Customer approval flow works
- [ ] Nutrition updates correctly

## Next Phase

[Phase 5: Marketplace Features](./phase5.md) - Build advanced marketplace and matching algorithms