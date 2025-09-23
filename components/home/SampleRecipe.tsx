'use client';

import { useEffect, useRef } from 'react';
import { logEvent } from '@/lib/analytics';

export default function SampleRecipe(){
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const io = new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ logEvent('Section_SampleRecipe'); io.disconnect(); } }) },{threshold:0.3});
    io.observe(el); return ()=>io.disconnect();
  },[]);
  return (
    <section ref={ref} className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sample Recipe</h2>
        <p className="text-gray-600 mb-8">Here’s what a personalized smoothie looks like with full transparency</p>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-700 mb-4">Backed by nutrition science — adapted by AI for you.</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-800">
            <li>• Frozen banana — 120g</li>
            <li>• Frozen blueberries — 100g</li>
            <li>• Oat milk — 160ml</li>
            <li>• Rolled oats — 18g</li>
            <li>• Cacao powder — 5g</li>
            <li>• Maple syrup — 10ml (optional)</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

