'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, Users, Star, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  // If auth is disabled, ensure buttons go straight to content without sign-in
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section (centered) */}
      <main className="flex-grow">
        <Hero onGenerate={() => router.push('/profile-setup')} onFindShop={() => router.push('/shops')} />
      </main>

      <Footer />
    </div>
  );
}
