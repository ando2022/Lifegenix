'use client';

import { useEffect, useState } from 'react';
import ProfileAnalysis from '@/components/ProfileAnalysis';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { UserProfile } from '@/lib/types';

export default function AnalysisPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mood, setMood] = useState<string>('relaxed');
  const [sleepQuality, setSleepQuality] = useState<number>(3);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('userProfile');
      if (saved) setProfile(JSON.parse(saved));
      const last = localStorage.getItem('lastCheckIn');
      if (last) {
        const data = JSON.parse(last);
        if (data?.mood) setMood(data.mood);
        if (typeof data?.sleepQuality === 'number') setSleepQuality(data.sleepQuality);
      }
    } catch {}
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading your analysis…</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h1>
          <p className="text-gray-600 mb-4">Please complete your profile and daily check‑in to view your personalized analysis.</p>
          <a href="/profile-setup" className="btn-primary inline-block">Go to Profile Setup</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <ProfileAnalysis
          userProfile={profile}
          selectedMood={mood}
          sleepQuality={sleepQuality}
          onContinue={() => { /* generation removed from this page */ }}
        />
      </main>
      <Footer />
    </div>
  );
}


