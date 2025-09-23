'use client';

import { useEffect, useRef } from 'react';
import { logEvent } from '@/lib/analytics';

export default function WhyXova(){
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const io = new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ logEvent('Section_WhyXova'); io.disconnect(); } }) },{threshold:0.3});
    io.observe(el); return ()=>io.disconnect();
  },[]);
  const tiles = [
    { title: 'Allergies Respected', desc: 'We filter unsafe ingredients first.' },
    { title: 'Science-Backed Goals', desc: 'Focus, calm, recovery, hydration, longevity.' },
    { title: 'Easy Preparation', desc: 'Simple one-blend recipes, exact measures.' },
    { title: 'Local Partnerships', desc: 'Personalized matches from quality cafés nearby.' },
  ];
  return (
    <section ref={ref} className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Xova?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiles.map(t => (
            <div key={t.title} className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{t.title}</h3>
              <p className="text-gray-600 text-sm">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

