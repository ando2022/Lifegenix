'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logEvent } from '@/lib/analytics';
import SoftGate from '@/components/SoftGate';

export default function Hero({ onGenerate, onFindShop }: { onGenerate?: () => void; onFindShop?: () => void }) {
  const router = useRouter();
  const [showSoftGate, setShowSoftGate] = useState(false);
  
  useEffect(() => { logEvent('HeroViewed'); }, []);

  const handleFindShopClick = () => {
    logEvent('CTA_Click_FindShop');
    setShowSoftGate(true);
  };
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-violet-50/30 to-fuchsia-50/20" aria-hidden="true"></div>
      {/* Subtle accent blobs */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-violet-100/10 blur-3xl" aria-hidden="true"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-fuchsia-100/10 blur-3xl" aria-hidden="true"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[50vh] py-8">
        <div className="text-center space-y-6">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-relaxed animate-fade-up bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent pb-2">
                      Your body, your recipe. Every day.
                    </h1>
                    <div className="text-base sm:text-lg max-w-4xl mx-auto animate-fade-up animate-delay-1 text-gray-700 leading-relaxed space-y-2">
                      <p className="font-medium text-gray-800">
                        Your needs change daily — why should your food stay the same?
                      </p>
                      <p>
                        Tell us your basics once, then check in with your sleep and mood.
                      </p>
                      <p>
                        We'll generate the best recipe for your needs today — and show you where to find the closest match nearby.
                      </p>
                    </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up animate-delay-2">
              <button
                data-testid="cta-generate"
                aria-label="Generate your smoothie"
                onClick={() => { logEvent('CTA_Click_Generate'); router.push('/profile-setup'); }}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] focus:ring-2 focus:ring-violet-400 text-white text-base font-semibold px-6 py-3 shadow-lg shadow-violet-500/25 transition-all duration-200"
              >
                Generate My Smoothie
              </button>
              <button
                data-testid="cta-find-shop"
                aria-label="Find nearby match"
                onClick={handleFindShopClick}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50 hover:ring-gray-400 active:scale-[0.98] focus:ring-2 focus:ring-gray-400 text-base font-semibold px-6 py-3 shadow-sm transition-all duration-200"
              >
                Find Nearby Match
              </button>
            </div>
            <p className="text-xs text-gray-500 animate-fade-up animate-delay-3">Informational only; not medical advice. Always check allergens.</p>
        </div>
      </div>

      {/* Soft Gate Modal */}
      {showSoftGate && (
        <SoftGate onClose={() => setShowSoftGate(false)} />
      )}
    </section>
  );
}

