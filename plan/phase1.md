# Phase 1: Foundation & Authentication

## Duration: 3-4 days (AI-Assisted)

## Objectives
- Set up Supabase infrastructure
- Implement database schema with Drizzle ORM
- Create authentication system
- Establish role-based access control
- Integrate Shadcn/ui components
- Set up development workflow

## Technical Implementation

### 1. Shadcn/UI Setup (Day 1)

```bash
# Install shadcn/ui
npx shadcn-ui@latest init

# Install essential components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add table
npx shadcn-ui@latest add textarea
```

### 2. Supabase Setup (Day 1-2)

```bash
# Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install -D @supabase/auth-ui-react @supabase/auth-ui-shared
```

**Environment Variables (.env.local)**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Drizzle ORM Setup (Day 2-3)

```bash
# Install Drizzle and PostgreSQL driver
npm install drizzle-orm postgres
npm install -D drizzle-kit @types/pg

# Create drizzle config
touch drizzle.config.ts
```

**drizzle.config.ts**
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema/*',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### 4. Database Schema (Day 3-4)

**src/db/schema/users.ts**
```typescript
import { pgTable, uuid, text, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['user', 'shop_owner', 'admin']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').default('user').notNull(),
  phoneNumber: text('phone_number'),
  preferences: jsonb('preferences'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  gender: text('gender'),
  age: integer('age'),
  location: jsonb('location'),
  allergies: text('allergies').array(),
  intolerances: text('intolerances').array(),
  diet: text('diet'),
  goals: text('goals').array(),
  dislikes: text('dislikes').array(),
  sweetnessTolerance: text('sweetness_tolerance'),
  texturePreference: text('texture_preference'),
  budget: text('budget'),
  activityLevel: text('activity_level'),
  flavorPreferences: jsonb('flavor_preferences'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**src/db/schema/shops.ts**
```typescript
import { pgTable, uuid, text, timestamp, jsonb, decimal, boolean, integer } from 'drizzle-orm/pg-core';

export const shops = pgTable('shops', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  postalCode: text('postal_code'),
  coordinates: jsonb('coordinates').notNull(),
  phoneNumber: text('phone_number'),
  email: text('email'),
  website: text('website'),
  images: text('images').array(),
  capabilities: jsonb('capabilities'),
  businessHours: jsonb('business_hours'),
  status: text('status').default('pending'), // pending, active, suspended
  rating: decimal('rating', { precision: 3, scale: 2 }),
  reviewCount: integer('review_count').default(0),
  subscriptionTier: text('subscription_tier'), // starter, professional, enterprise
  subscriptionStatus: text('subscription_status'), // active, cancelled, past_due
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const shopMenuItems = pgTable('shop_menu_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  ingredients: text('ingredients').array(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url'),
  isAvailable: boolean('is_available').default(true),
  nutritionInfo: jsonb('nutrition_info'),
  allergens: text('allergens').array(),
  preparationTime: integer('preparation_time'), // in minutes
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**src/db/schema/recipes.ts**
```typescript
import { pgTable, uuid, text, timestamp, jsonb, decimal, integer } from 'drizzle-orm/pg-core';

export const recipes = pgTable('recipes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  name: text('name').notNull(),
  goal: text('goal').notNull(),
  mood: jsonb('mood'),
  layers: jsonb('layers').notNull(),
  totalNutrition: jsonb('total_nutrition'),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  prepTime: integer('prep_time'),
  difficulty: text('difficulty'),
  generationCount: integer('generation_count').default(0),
  isFavorite: boolean('is_favorite').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const ingredients = pgTable('ingredients', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  category: text('category').notNull(),
  nutrition: jsonb('nutrition'),
  allergens: text('allergens').array(),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  quality: text('quality'),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### 5. Authentication Implementation (Day 5-6)

**src/lib/supabase/client.ts**
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**src/lib/supabase/server.ts**
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
```

**app/auth/signin/page.tsx**
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      router.push('/dashboard');
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Check your email for the confirmation link.',
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome to xova</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 6. Role-Based Access Control (Day 7-8)

**src/lib/auth/rbac.ts**
```typescript
import { createClient } from '@/lib/supabase/server';

export type UserRole = 'user' | 'shop_owner' | 'admin';

export async function getUserRole(): Promise<UserRole | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return data?.role || 'user';
}

export async function requireRole(role: UserRole | UserRole[]) {
  const userRole = await getUserRole();
  const roles = Array.isArray(role) ? role : [role];
  
  if (!userRole || !roles.includes(userRole)) {
    throw new Error('Unauthorized');
  }
  
  return userRole;
}
```

**src/middleware.ts**
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (data?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Shop owner routes
  if (request.nextUrl.pathname.startsWith('/shop-dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (data?.role !== 'shop_owner') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### 7. Migration Scripts (Day 9)

**package.json updates**
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:migrate": "tsx src/db/migrate.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```

**src/db/migrate.ts**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function main() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations completed!');
  await sql.end();
}

main().catch((err) => {
  console.error('Migration failed!');
  console.error(err);
  process.exit(1);
});
```

### 8. Component Updates with Shadcn (Day 10)

**components/ui/user-nav.tsx**
```typescript
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@username" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">username</p>
            <p className="text-xs leading-none text-muted-foreground">
              user@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Testing Checklist

### Authentication Tests
- [ ] User can sign up with email
- [ ] Email verification works
- [ ] User can sign in
- [ ] Password reset works
- [ ] Session persists across refreshes
- [ ] Logout works correctly

### Role Management Tests
- [ ] New users get 'user' role by default
- [ ] Admin can change user roles
- [ ] Role-based route protection works
- [ ] Shop owners can only access their dashboard
- [ ] Admins can access admin panel

### Database Tests
- [ ] Migrations run successfully
- [ ] All tables created correctly
- [ ] Foreign key constraints work
- [ ] Indexes are created
- [ ] Data integrity maintained

### UI/UX Tests
- [ ] All Shadcn components render correctly
- [ ] Forms validate properly
- [ ] Error messages display correctly
- [ ] Loading states work
- [ ] Responsive design works

## Environment Setup

### Development
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

### Staging
```bash
# Build for staging
npm run build

# Run migrations on staging DB
DATABASE_URL=staging_url npm run db:migrate

# Deploy to Vercel staging
vercel --env preview
```

## Security Checklist

- [ ] Environment variables secured
- [ ] Database connection encrypted
- [ ] HTTPS enforced
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] SQL injection prevention (via ORM)
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Session security configured

## Performance Targets

- Authentication flow: < 1s
- Database queries: < 100ms
- Page load: < 2s
- API responses: < 200ms

## Dependencies Added

```json
{
  "@supabase/supabase-js": "^2.x",
  "@supabase/auth-helpers-nextjs": "^0.x",
  "@supabase/ssr": "^0.x",
  "drizzle-orm": "^0.x",
  "postgres": "^3.x",
  "drizzle-kit": "^0.x",
  "@radix-ui/react-*": "latest",
  "class-variance-authority": "^0.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x",
  "lucide-react": "^0.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "@hookform/resolvers": "^3.x"
}
```

## Deliverables

1. ✅ Supabase project configured
2. ✅ Database schema implemented
3. ✅ Authentication system working
4. ✅ Role-based access control
5. ✅ Shadcn/ui integrated
6. ✅ User registration/login flows
7. ✅ Protected routes
8. ✅ Basic user dashboard
9. ✅ Migration scripts
10. ✅ Documentation updated

## Next Phase

[Phase 2: Payment Integration](./phase2.md) - Implement Stripe and Twint payment systems