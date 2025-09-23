'use client';

import { useEffect, useRef } from 'react';
import { logEvent } from '@/lib/analytics';

export default function HowItWorks(){
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ logEvent('Section_HowItWorks'); obs.disconnect(); } });
    }, { threshold: 0.3 });
    obs.observe(el);
    return ()=>obs.disconnect();
  },[]);
  return (
    <section ref={ref} className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-lg border border-gray-100 bg-white">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-1">Quick Profile</h3>
            <p className="text-gray-600 text-sm">Two taps: mood & must-avoid.</p>
          </div>
          <div className="text-center p-6 rounded-lg border border-gray-100 bg-white">
            <div className="text-3xl mb-2">🥤</div>
            <h3 className="font-semibold text-gray-900 mb-1">Personalized Recipe</h3>
            <p className="text-gray-600 text-sm">Exact ingredients and why each one helps.</p>
          </div>
          <div className="text-center p-6 rounded-lg border border-gray-100 bg-white">
            <div className="text-3xl mb-2">📍</div>
            <h3 className="font-semibold text-gray-900 mb-1">Smart Shop Matching</h3>
            <p className="text-gray-600 text-sm">We scan menus and show the best match nearby.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

