# Phase 6: Admin Dashboard

## Duration: 1.5 weeks

## Objectives
- Platform analytics and metrics
- User and shop management
- Content moderation tools
- Financial reporting
- Support ticket system
- Platform configuration

## Technical Implementation

### 1. Admin Database Schema (Day 1)

**src/db/schema/admin.ts**
```typescript
import { pgTable, uuid, text, timestamp, jsonb, boolean, integer, decimal } from 'drizzle-orm/pg-core';

export const adminUsers = pgTable('admin_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  permissions: jsonb('permissions').notNull(), // ['users', 'shops', 'orders', 'finance', 'content', 'settings']
  lastLogin: timestamp('last_login'),
  ipAddress: text('ip_address'),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  adminId: uuid('admin_id').references(() => adminUsers.id).notNull(),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: text('entity_id'),
  changes: jsonb('changes'),
  metadata: jsonb('metadata'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const supportTickets = pgTable('support_tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  shopId: uuid('shop_id').references(() => shops.id),
  assignedTo: uuid('assigned_to').references(() => adminUsers.id),
  category: text('category').notNull(), // 'technical', 'billing', 'dispute', 'general'
  priority: text('priority').notNull(), // 'low', 'medium', 'high', 'urgent'
  status: text('status').notNull(), // 'open', 'in_progress', 'waiting', 'resolved', 'closed'
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  resolution: text('resolution'),
  attachments: text('attachments').array(),
  internalNotes: text('internal_notes'),
  satisfactionRating: integer('satisfaction_rating'),
  firstResponseAt: timestamp('first_response_at'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const platformMetrics = pgTable('platform_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: timestamp('date').notNull(),
  metricType: text('metric_type').notNull(),
  value: decimal('value', { precision: 20, scale: 4 }),
  dimensions: jsonb('dimensions'), // { category: 'revenue', region: 'zurich' }
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contentFlags = pgTable('content_flags', {
  id: uuid('id').defaultRandom().primaryKey(),
  contentType: text('content_type').notNull(), // 'review', 'image', 'shop_description'
  contentId: text('content_id').notNull(),
  flaggedBy: uuid('flagged_by').references(() => users.id),
  reason: text('reason').notNull(),
  status: text('status').notNull(), // 'pending', 'approved', 'removed', 'dismissed'
  reviewedBy: uuid('reviewed_by').references(() => adminUsers.id),
  reviewedAt: timestamp('reviewed_at'),
  action: text('action'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 2. Admin Dashboard Layout (Day 2-3)

**app/admin/layout.tsx**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  DollarSign,
  Flag,
  Settings,
  HelpCircle,
  BarChart3,
  Shield,
  Bell,
  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Shops', href: '/admin/shops', icon: Store },
  { name: 'Orders', href: '/admin/orders', icon: Package },
  { name: 'Finance', href: '/admin/finance', icon: DollarSign },
  { name: 'Moderation', href: '/admin/moderation', icon: Flag },
  { name: 'Support', href: '/admin/support', icon: HelpCircle },
  { name: 'Security', href: '/admin/security', icon: Shield },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    checkAdminAccess();
    loadNotifications();
  }, []);

  const checkAdminAccess = async () => {
    const response = await fetch('/api/admin/verify');
    if (!response.ok) {
      router.push('/');
      return;
    }
    const data = await response.json();
    setAdmin(data);
  };

  const loadNotifications = async () => {
    const response = await fetch('/api/admin/notifications');
    const data = await response.json();
    setNotifications(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-bold text-primary">
              Lifegenix Admin
            </Link>
            <Badge variant="secondary">Admin Panel</Badge>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification: any) => (
                  <DropdownMenuItem key={notification.id}>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={admin?.avatar} />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{admin?.name}</p>
                    <p className="text-xs text-muted-foreground">{admin?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  'hover:bg-gray-100 hover:text-primary'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 3. Analytics Dashboard (Day 4-5)

**app/admin/analytics/page.tsx**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Store,
  Package,
  DollarSign,
  Activity,
  Target,
  AlertTriangle,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [metrics, setMetrics] = useState({
    revenue: { total: 0, growth: 0, chart: [] },
    users: { total: 0, active: 0, new: 0, chart: [] },
    shops: { total: 0, active: 0, new: 0, chart: [] },
    orders: { total: 0, completed: 0, avgValue: 0, chart: [] },
    generations: { total: 0, paid: 0, free: 0, chart: [] },
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    const response = await fetch('/api/admin/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dateRange }),
    });
    const data = await response.json();
    setMetrics(data);
  };

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `CHF ${metrics.revenue.total.toLocaleString()}`,
      change: `${metrics.revenue.growth > 0 ? '+' : ''}${metrics.revenue.growth}%`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Active Users',
      value: metrics.users.active.toLocaleString(),
      subtitle: `${metrics.users.new} new this period`,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Active Shops',
      value: metrics.shops.active.toLocaleString(),
      subtitle: `${metrics.shops.new} new shops`,
      icon: Store,
      color: 'text-purple-600',
    },
    {
      title: 'Orders',
      value: metrics.orders.total.toLocaleString(),
      subtitle: `Avg: CHF ${metrics.orders.avgValue}`,
      icon: Package,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Platform performance metrics and insights
          </p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              {kpi.change && (
                <p className={`text-xs ${
                  kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.change} from last period
                </p>
              )}
              {kpi.subtitle && (
                <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="shops">Shops</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={metrics.revenue.chart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
                <CardDescription>Breakdown by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Generations', value: 35 },
                        { name: 'Shop Subscriptions', value: 45 },
                        { name: 'Commissions', value: 20 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#6366f1" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Revenue Table */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Details</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueTable dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserAnalytics metrics={metrics.users} />
        </TabsContent>

        <TabsContent value="shops" className="space-y-4">
          <ShopAnalytics metrics={metrics.shops} />
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <OperationsAnalytics />
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <GeographyAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 4. User & Shop Management (Day 6-7)

**app/admin/users/page.tsx**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  Search,
  Filter,
  MoreVertical,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  CreditCard,
  Activity,
  AlertTriangle,
} from 'lucide-react';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, filter]);

  const fetchUsers = async () => {
    const response = await fetch(`/api/admin/users?search=${searchQuery}&filter=${filter}`);
    const data = await response.json();
    setUsers(data);
  };

  const handleUserAction = async (userId: string, action: string) => {
    const response = await fetch(`/api/admin/users/${userId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });

    if (response.ok) {
      toast({
        title: 'Action completed',
        description: `User ${action} successfully`,
      });
      fetchUsers();
    }
  };

  const getUserStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage platform users and their accounts
          </p>
        </div>
        <Button>Export Users</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending Verification</SelectItem>
                <SelectItem value="premium">Premium Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Generations</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getUserStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{format(new Date(user.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{user.generationCount}</TableCell>
                  <TableCell>CHF {user.totalSpent}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(user.lastActive))}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetail(true);
                        }}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-yellow-600"
                          onClick={() => handleUserAction(user.id, 'suspend')}
                        >
                          Suspend User
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleUserAction(user.id, 'delete')}
                        >
                          Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          isOpen={showUserDetail}
          onClose={() => setShowUserDetail(false)}
          onAction={(action) => handleUserAction(selectedUser.id, action)}
        />
      )}
    </div>
  );
}
```

### 5. Support Ticket System (Day 8)

**app/admin/support/page.tsx**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  Clock,
  MessageSquare,
  User,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  user: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo: string | null;
  createdAt: Date;
  lastUpdated: Date;
  messages: Message[];
}

interface Message {
  id: string;
  sender: 'user' | 'admin' | 'system';
  content: string;
  timestamp: Date;
  attachments?: string[];
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filter, setFilter] = useState('open');
  const [response, setResponse] = useState('');
  const [internalNote, setInternalNote] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    const response = await fetch(`/api/admin/support/tickets?status=${filter}`);
    const data = await response.json();
    setTickets(data);
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    await fetch(`/api/admin/support/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchTickets();
  };

  const sendResponse = async () => {
    if (!selectedTicket || !response) return;

    await fetch(`/api/admin/support/tickets/${selectedTicket.id}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: response, internalNote }),
    });

    setResponse('');
    setInternalNote('');
    fetchTickets();
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority];
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      open: <AlertCircle className="w-4 h-4" />,
      in_progress: <Clock className="w-4 h-4" />,
      waiting: <MessageSquare className="w-4 h-4" />,
      resolved: <CheckCircle className="w-4 h-4" />,
      closed: <XCircle className="w-4 h-4" />,
    };
    return icons[status];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">
            Manage customer support requests and issues
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tickets</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ticket List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Tickets ({tickets.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="space-y-1 p-4">
                {tickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className={`cursor-pointer transition-colors ${
                      selectedTicket?.id === ticket.id ? 'border-primary' : ''
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(ticket.status)}
                          <span className="text-xs text-muted-foreground">
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                      <p className="font-medium text-sm mb-1 line-clamp-2">
                        {ticket.subject}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.user.name} • {formatDistanceToNow(new Date(ticket.createdAt))}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Ticket Detail */}
        {selectedTicket ? (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedTicket.subject}</CardTitle>
                  <CardDescription>
                    Ticket #{selectedTicket.id.slice(0, 8)} • {selectedTicket.category}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select 
                    value={selectedTicket.status}
                    onValueChange={(status) => updateTicketStatus(selectedTicket.id, status)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="waiting">Waiting</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <User className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium">{selectedTicket.user.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedTicket.user.email}</p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="h-[300px] border rounded-lg p-4">
                <div className="space-y-4">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-gray-100'
                          : message.sender === 'admin'
                          ? 'bg-primary/10 ml-8'
                          : 'bg-yellow-50 border border-yellow-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">
                          {message.sender === 'user' ? selectedTicket.user.name : 
                           message.sender === 'admin' ? 'Support Team' : 'System'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.timestamp), 'MMM d, HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Response Form */}
              <div className="space-y-3">
                <div>
                  <Label>Response</Label>
                  <Textarea
                    placeholder="Type your response..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="min-h-[100px] mt-1"
                  />
                </div>
                <div>
                  <Label>Internal Note (not visible to customer)</Label>
                  <Textarea
                    placeholder="Add internal notes..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="min-h-[60px] mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={sendResponse} disabled={!response}>
                    Send Response
                  </Button>
                  <Button variant="outline">
                    Send & Close Ticket
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-2 flex items-center justify-center h-[600px]">
            <p className="text-muted-foreground">Select a ticket to view details</p>
          </Card>
        )}
      </div>
    </div>
  );
}
```

## Testing Checklist

### Access Control
- [ ] Admin authentication works
- [ ] Permission levels enforced
- [ ] Two-factor authentication functions
- [ ] Audit logs record actions
- [ ] Session management secure

### Analytics
- [ ] Metrics calculate correctly
- [ ] Charts display accurate data
- [ ] Date filtering works
- [ ] Export functionality works
- [ ] Real-time updates function

### User Management
- [ ] User search works
- [ ] Filtering functions correctly
- [ ] User actions execute properly
- [ ] Suspension/ban works
- [ ] Email sending functions

### Shop Management
- [ ] Shop verification works
- [ ] Subscription management functions
- [ ] Shop suspension works
- [ ] Financial reconciliation accurate

### Support System
- [ ] Ticket creation works
- [ ] Assignment system functions
- [ ] Response sending works
- [ ] Status updates propagate
- [ ] Priority sorting works

## Security Considerations

- Admin access requires 2FA
- All actions are audit logged
- IP whitelisting available
- Rate limiting on admin endpoints
- Encrypted admin sessions
- Regular security audits

## Next Phase

[Phase 7: Advanced Features](./phase7.md) - Implement AI optimization and advanced features