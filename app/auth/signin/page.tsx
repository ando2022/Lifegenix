'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useToast } from '@/components/hooks/use-toast';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In</h1>
        <p className="text-gray-600">Authentication coming soon!</p>
      </div>
    </div>
  );
}
