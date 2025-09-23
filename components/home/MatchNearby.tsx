'use client';

import { useEffect, useRef } from 'react';
import { logEvent } from '@/lib/analytics';
import Link from 'next/link';

export default function MatchNearby(){
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const io = new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ logEvent('Section_MatchNearby'); io.disconnect(); } }) },{threshold:0.3});
    io.observe(el); return ()=>io.disconnect();
  },[]);
  return (
    <section ref={ref} className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Match Nearby</h2>
        <p className="text-gray-600 mb-6">We analyze café menus against your goal and restrictions. See the Best Match plus other safe options, with a short ‘why’ for each.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0,1,2].map((i)=> (
            <div key={i} className="rounded-xl border border-gray-100 p-5 bg-white">
              {i===0 && <span className="inline-block text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded mb-2">Best Match</span>}
              <div className="font-semibold text-gray-900 mb-1">Placeholder Café {i+1}</div>
              <div className="text-sm text-gray-600 mb-3">Recipe: Focus Greens</div>
              <div className="text-xs text-gray-500 mb-4">Why: Magnesium-rich spinach eases stress, coconut water hydrates.</div>
              <Link href="/shops" className="text-xs bg-violet-600 text-white px-3 py-1 rounded disabled:opacity-60">View Menu</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

