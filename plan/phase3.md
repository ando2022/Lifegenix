# Phase 3: User Experience Enhancement

## Duration: 4-5 days (AI-Assisted)

## Objectives
- Create comprehensive user dashboard
- Implement generation history tracking
- Build favorite recipes management
- Enhance user profile and preferences
- Optimize mobile responsiveness
- Add real-time notifications

## Technical Implementation

### 1. User Dashboard Layout (Day 1-2)

**app/dashboard/layout.tsx**
```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  History,
  Heart,
  Settings,
  CreditCard,
  Bell,
  User,
  ChefHat,
  MapPin,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreditBalance } from '@/components/credits/CreditBalance';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Generate', href: '/dashboard/generate', icon: ChefHat },
  { name: 'History', href: '/dashboard/history', icon: History },
  { name: 'Favorites', href: '/dashboard/favorites', icon: Heart },
  { name: 'Nearby Shops', href: '/dashboard/shops', icon: MapPin },
  { name: 'Credits', href: '/dashboard/credits', icon: CreditCard },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              xova
            </Link>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <CreditBalance />
              </li>
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? 'bg-gray-100 text-primary'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={cn(
                            pathname === item.href
                              ? 'text-primary'
                              : 'text-gray-400 group-hover:text-primary',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <button
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary w-full"
                  onClick={() => {/* Handle logout */}}
                >
                  <LogOut
                    className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary"
                    aria-hidden="true"
                  />
                  Sign out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-full flex-col">
              <div className="flex h-16 shrink-0 items-center px-6">
                <Link href="/" className="text-2xl font-bold text-primary">
                  xova
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-4">
                <CreditBalance />
                <nav className="mt-6">
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            pathname === item.href
                              ? 'bg-gray-100 text-primary'
                              : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon
                            className={cn(
                              pathname === item.href
                                ? 'text-primary'
                                : 'text-gray-400 group-hover:text-primary',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="border-t px-6 py-4">
                <button
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary w-full"
                  onClick={() => {/* Handle logout */}}
                >
                  <LogOut
                    className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary"
                    aria-hidden="true"
                  />
                  Sign out
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex-1 text-xl font-semibold leading-7 text-gray-900">
          Dashboard
        </div>
      </div>

      {/* Main content */}
      <main className="lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
```

### 2. Dashboard Overview Page (Day 3-4)

**app/dashboard/page.tsx**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ChefHat,
  TrendingUp,
  Clock,
  Heart,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { RecentGenerations } from '@/components/dashboard/RecentGenerations';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { HealthInsights } from '@/components/dashboard/HealthInsights';
import { ShopRecommendations } from '@/components/dashboard/ShopRecommendations';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalGenerations: 0,
    favoriteRecipes: 0,
    healthScore: 0,
    nearbyShops: 0,
    weeklyGoal: 0,
    weeklyProgress: 0,
  });

  const [userProfile, setUserProfile] = useState({
    name: '',
    memberSince: '',
    subscription: 'free',
    nextGeneration: null,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const [statsRes, profileRes] = await Promise.all([
      fetch('/api/dashboard/stats'),
      fetch('/api/user/profile'),
    ]);
    
    setStats(await statsRes.json());
    setUserProfile(await profileRes.json());
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {userProfile.name}!
        </h1>
        <p className="text-muted-foreground">
          Ready to create your perfect smoothie for today?
        </p>
        <div className="mt-4 flex gap-4">
          <Button size="lg">
            <ChefHat className="w-4 h-4 mr-2" />
            Generate Smoothie
          </Button>
          <Button variant="outline" size="lg">
            <MapPin className="w-4 h-4 mr-2" />
            Find Shops
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Generations
            </CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGenerations}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Favorite Recipes
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteRecipes}</div>
            <p className="text-xs text-muted-foreground">
              3 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Health Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.healthScore}/100</div>
            <Progress value={stats.healthScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nearby Shops
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nearbyShops}</div>
            <p className="text-xs text-muted-foreground">
              Within 5km radius
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Generations */}
        <div className="lg:col-span-2">
          <RecentGenerations />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Secondary Content */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Health Insights */}
        <HealthInsights />

        {/* Shop Recommendations */}
        <ShopRecommendations />
      </div>

      {/* Weekly Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Nutrition Goal</CardTitle>
          <CardDescription>
            Track your smoothie intake and nutritional targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{stats.weeklyProgress}/{stats.weeklyGoal} smoothies</span>
              </div>
              <Progress value={(stats.weeklyProgress / stats.weeklyGoal) * 100} />
            </div>
            <div className="grid grid-cols-4 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">2,450</p>
                <p className="text-xs text-muted-foreground">Calories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">125g</p>
                <p className="text-xs text-muted-foreground">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">89g</p>
                <p className="text-xs text-muted-foreground">Fiber</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">15</p>
                <p className="text-xs text-muted-foreground">Vitamins</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 3. Generation History (Day 5-6)

**app/dashboard/history/page.tsx**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import {
  Search,
  Filter,
  Download,
  Eye,
  Heart,
  ShoppingCart,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Generation {
  id: string;
  name: string;
  date: Date;
  mood: string;
  goal: string;
  layers: number;
  nutrition: {
    calories: number;
    protein: number;
    fiber: number;
  };
  cost: number;
  isFavorite: boolean;
  hasOrder: boolean;
  shopMatches: number;
}

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [filteredGenerations, setFilteredGenerations] = useState<Generation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [filterGoal, setFilterGoal] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchGenerationHistory();
  }, []);

  useEffect(() => {
    filterAndSortGenerations();
  }, [generations, searchQuery, dateRange, filterGoal, sortBy]);

  const fetchGenerationHistory = async () => {
    const response = await fetch('/api/generations/history');
    const data = await response.json();
    setGenerations(data);
    setFilteredGenerations(data);
  };

  const filterAndSortGenerations = () => {
    let filtered = [...generations];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(g => 
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.mood.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter(g => new Date(g.date) >= dateRange.from!);
    }
    if (dateRange.to) {
      filtered = filtered.filter(g => new Date(g.date) <= dateRange.to!);
    }

    // Goal filter
    if (filterGoal !== 'all') {
      filtered = filtered.filter(g => g.goal === filterGoal);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'calories':
          return b.nutrition.calories - a.nutrition.calories;
        case 'cost':
          return b.cost - a.cost;
        default:
          return 0;
      }
    });

    setFilteredGenerations(filtered);
    setCurrentPage(1);
  };

  const toggleFavorite = async (id: string) => {
    await fetch(`/api/generations/${id}/favorite`, { method: 'POST' });
    fetchGenerationHistory();
  };

  const exportHistory = () => {
    const csv = filteredGenerations.map(g => ({
      Date: format(new Date(g.date), 'yyyy-MM-dd'),
      Name: g.name,
      Mood: g.mood,
      Goal: g.goal,
      Calories: g.nutrition.calories,
      Protein: g.nutrition.protein,
      Fiber: g.nutrition.fiber,
      Cost: g.cost,
    }));
    
    // Convert to CSV and download
    const csvString = [
      Object.keys(csv[0]).join(','),
      ...csv.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smoothie-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const paginatedGenerations = filteredGenerations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredGenerations.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generation History</h1>
        <p className="text-muted-foreground">
          View and manage all your smoothie generations
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search smoothies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start text-left font-normal',
                    !dateRange.from && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd')} -{' '}
                        {format(dateRange.to, 'LLL dd')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Goal Filter */}
            <Select value={filterGoal} onValueChange={setFilterGoal}>
              <SelectTrigger>
                <SelectValue placeholder="All goals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All goals</SelectItem>
                <SelectItem value="energy-boost">Energy Boost</SelectItem>
                <SelectItem value="calm-stomach">Calm Stomach</SelectItem>
                <SelectItem value="meal-replacement">Meal Replacement</SelectItem>
                <SelectItem value="longevity">Longevity</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Newest)</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="calories">Calories (High-Low)</SelectItem>
                <SelectItem value="cost">Cost (High-Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {paginatedGenerations.length} of {filteredGenerations.length} results
            </p>
            <Button variant="outline" size="sm" onClick={exportHistory}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mood/Goal</TableHead>
                <TableHead>Nutrition</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGenerations.map((generation) => (
                <TableRow key={generation.id}>
                  <TableCell>
                    {format(new Date(generation.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{generation.name}</span>
                      {generation.isFavorite && (
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline">{generation.mood}</Badge>
                      <Badge variant="secondary">{generation.goal}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>{generation.nutrition.calories} cal</div>
                      <div className="text-muted-foreground">
                        {generation.nutrition.protein}g protein
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>CHF {generation.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <RecipeDetailDialog generation={generation} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(generation.id)}
                      >
                        <Heart
                          className={cn(
                            'h-4 w-4',
                            generation.isFavorite && 'fill-red-500 text-red-500'
                          )}
                        />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function RecipeDetailDialog({ generation }: { generation: Generation }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{generation.name}</DialogTitle>
          <DialogDescription>
            Generated on {format(new Date(generation.date), 'MMMM dd, yyyy')}
          </DialogDescription>
        </DialogHeader>
        {/* Recipe details content */}
      </DialogContent>
    </Dialog>
  );
}
```

### 4. User Profile Management (Day 7-8)

**app/dashboard/profile/page.tsx**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Save, AlertCircle } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  age: z.number().min(13).max(120),
  location: z.object({
    city: z.string(),
    postalCode: z.string(),
  }),
  bio: z.string().max(500).optional(),
});

const healthSchema = z.object({
  allergies: z.array(z.string()),
  intolerances: z.array(z.string()),
  diet: z.enum(['none', 'vegan', 'vegetarian', 'dairy-free', 'gluten-free', 'paleo', 'keto']),
  goals: z.array(z.string()).min(1, 'Select at least one health goal'),
  activityLevel: z.enum(['sedentary', 'moderate', 'active', 'athlete']),
});

const preferencesSchema = z.object({
  sweetnessTolerance: z.enum(['low', 'medium', 'high']),
  texturePreference: z.enum(['layered', 'single-blend']),
  budget: z.enum(['basic', 'premium', 'luxury']),
  flavorPreferences: z.object({
    sweet: z.number().min(0).max(10),
    sour: z.number().min(0).max(10),
    bitter: z.number().min(0).max(10),
    umami: z.number().min(0).max(10),
  }),
  dislikes: z.array(z.string()),
});

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [avatarUrl, setAvatarUrl] = useState('');
  const { toast } = useToast();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      gender: 'prefer-not-to-say',
      age: 25,
      location: { city: '', postalCode: '' },
      bio: '',
    },
  });

  const healthForm = useForm({
    resolver: zodResolver(healthSchema),
    defaultValues: {
      allergies: [],
      intolerances: [],
      diet: 'none',
      goals: [],
      activityLevel: 'moderate',
    },
  });

  const preferencesForm = useForm({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      sweetnessTolerance: 'medium',
      texturePreference: 'layered',
      budget: 'premium',
      flavorPreferences: {
        sweet: 5,
        sour: 5,
        bitter: 3,
        umami: 2,
      },
      dislikes: [],
    },
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const response = await fetch('/api/user/profile');
    const data = await response.json();
    
    profileForm.reset(data.profile);
    healthForm.reset(data.health);
    preferencesForm.reset(data.preferences);
    setAvatarUrl(data.avatarUrl);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch('/api/user/avatar', {
      method: 'POST',
      body: formData,
    });

    const { url } = await response.json();
    setAvatarUrl(url);
    
    toast({
      title: 'Avatar updated',
      description: 'Your profile picture has been updated successfully.',
    });
  };

  const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'profile', data }),
    });

    if (response.ok) {
      toast({
        title: 'Profile updated',
        description: 'Your personal information has been saved.',
      });
    }
  };

  const onHealthSubmit = async (data: z.infer<typeof healthSchema>) => {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'health', data }),
    });

    if (response.ok) {
      toast({
        title: 'Health profile updated',
        description: 'Your health information has been saved.',
      });
    }
  };

  const onPreferencesSubmit = async (data: z.infer<typeof preferencesSchema>) => {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'preferences', data }),
    });

    if (response.ok) {
      toast({
        title: 'Preferences updated',
        description: 'Your smoothie preferences have been saved.',
      });
    }
  };

  const allergenOptions = [
    'Nuts', 'Dairy', 'Eggs', 'Soy', 'Gluten', 'Shellfish', 
    'Fish', 'Sesame', 'Tree Nuts', 'Peanuts'
  ];

  const healthGoalOptions = [
    { id: 'energy-boost', label: 'Energy Boost' },
    { id: 'calm-stomach', label: 'Digestive Health' },
    { id: 'meal-replacement', label: 'Meal Replacement' },
    { id: 'longevity', label: 'Longevity' },
    { id: 'gut-health', label: 'Gut Health' },
    { id: 'brain-health', label: 'Brain Health' },
    { id: 'immune-support', label: 'Immune Support' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Avatar Section */}
      <Card>
        <CardContent className="flex items-center gap-6 p-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Profile Picture</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a new avatar to personalize your profile
            </p>
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>
                  <Camera className="w-4 h-4 mr-2" />
                  Change Avatar
                </span>
              </Button>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b">
        <Button
          variant={activeTab === 'personal' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('personal')}
        >
          Personal Info
        </Button>
        <Button
          variant={activeTab === 'health' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('health')}
        >
          Health Profile
        </Button>
        <Button
          variant={activeTab === 'preferences' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </Button>
      </div>

      {/* Personal Information */}
      {activeTab === 'personal' && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Health Profile */}
      {activeTab === 'health' && (
        <Card>
          <CardHeader>
            <CardTitle>Health Profile</CardTitle>
            <CardDescription>
              Help us personalize your smoothies based on your health needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...healthForm}>
              <form onSubmit={healthForm.handleSubmit(onHealthSubmit)} className="space-y-6">
                {/* Allergies */}
                <FormField
                  control={healthForm.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies</FormLabel>
                      <FormDescription>
                        Select any ingredients you're allergic to
                      </FormDescription>
                      <div className="grid grid-cols-3 gap-3">
                        {allergenOptions.map((allergen) => (
                          <div key={allergen} className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value?.includes(allergen)}
                              onCheckedChange={(checked) => {
                                const updated = checked
                                  ? [...field.value, allergen]
                                  : field.value.filter((a) => a !== allergen);
                                field.onChange(updated);
                              }}
                            />
                            <Label className="text-sm font-normal">{allergen}</Label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Health Goals */}
                <FormField
                  control={healthForm.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Goals</FormLabel>
                      <FormDescription>
                        What are you hoping to achieve with your smoothies?
                      </FormDescription>
                      <div className="grid grid-cols-2 gap-3">
                        {healthGoalOptions.map((goal) => (
                          <div key={goal.id} className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value?.includes(goal.id)}
                              onCheckedChange={(checked) => {
                                const updated = checked
                                  ? [...field.value, goal.id]
                                  : field.value.filter((g) => g !== goal.id);
                                field.onChange(updated);
                              }}
                            />
                            <Label className="text-sm font-normal">{goal.label}</Label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Save Health Profile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Preferences */}
      {activeTab === 'preferences' && (
        <Card>
          <CardHeader>
            <CardTitle>Smoothie Preferences</CardTitle>
            <CardDescription>
              Fine-tune your smoothie generation preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...preferencesForm}>
              <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
                {/* Flavor Preferences */}
                <div className="space-y-4">
                  <FormLabel>Flavor Profile</FormLabel>
                  <FormDescription>
                    Adjust your preferred flavor intensities (0-10)
                  </FormDescription>
                  
                  {['sweet', 'sour', 'bitter', 'umami'].map((flavor) => (
                    <FormField
                      key={flavor}
                      control={preferencesForm.control}
                      name={`flavorPreferences.${flavor}`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-4">
                            <FormLabel className="w-20 capitalize">{flavor}</FormLabel>
                            <Slider
                              value={[field.value]}
                              onValueChange={(v) => field.onChange(v[0])}
                              max={10}
                              step={1}
                              className="flex-1"
                            />
                            <span className="w-8 text-center">{field.value}</span>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

## Performance Optimizations

### 1. Code Splitting
```javascript
// Use dynamic imports for heavy components
const RecipeGenerator = dynamic(() => import('@/components/RecipeGenerator'), {
  loading: () => <GeneratorSkeleton />,
});
```

### 2. Image Optimization
```javascript
// Use Next.js Image component with proper sizing
<Image
  src={smoothieImage}
  alt="Smoothie"
  width={400}
  height={400}
  loading="lazy"
  placeholder="blur"
/>
```

### 3. Data Caching
```typescript
// Implement SWR for data fetching
import useSWR from 'swr';

const { data, error, mutate } = useSWR('/api/user/profile', fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
});
```

## Mobile Responsiveness

### Touch Optimizations
- Larger tap targets (min 44x44px)
- Swipe gestures for navigation
- Pull-to-refresh on lists
- Bottom sheet modals

### Progressive Web App
```json
// manifest.json
{
  "name": "xova",
  "short_name": "xova",
  "theme_color": "#10b981",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/"
}
```

## Testing Checklist

- [ ] Dashboard loads correctly
- [ ] Navigation works on all screen sizes
- [ ] Generation history displays properly
- [ ] Filters and search work
- [ ] Profile updates save correctly
- [ ] Favorite toggle works
- [ ] Export functionality works
- [ ] Pagination functions correctly
- [ ] Real-time updates work
- [ ] Mobile gestures work

## Next Phase

[Phase 4: Shop Owner Portal](./phase4.md) - Build comprehensive shop management system