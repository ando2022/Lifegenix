'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CompactProfileSetup from '@/components/CompactProfileSetup';
import { logEvent } from '@/lib/analytics';

interface UserProfile {
  allergies: string[];
  intolerances: string[];
  goals: string[];
}

export default function ProfileSetupPage() {
  const router = useRouter();

  const handleProfileComplete = (profile: UserProfile) => {
    // Store profile in localStorage for demo purposes
    localStorage.setItem('userProfile', JSON.stringify(profile));
    // Redirect immediately to generate page
    router.push('/generate');
  };

  const handleProfileSkip = () => {
    logEvent('Profile_Skipped_Completely');
    router.push('/generate');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
              <main className="flex-grow py-12">
                <CompactProfileSetup 
                  onComplete={handleProfileComplete}
                  onSkip={handleProfileSkip}
                />
              </main>

      <Footer />
    </div>
  );
}
