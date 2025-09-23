'use client';

import { logEvent } from '@/lib/analytics';

export default function BigCTA({ onStart, onPartner }: { onStart?: () => void; onPartner?: () => void }){
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-violet-600 to-fuchsia-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready for your best smoothie, every time?</h2>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            data-testid="cta-start"
            aria-label="Start your journey"
            onClick={()=>{ logEvent('CTA_Click_Start'); onStart?.(); }}
            className="bg-white text-violet-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg"
          >
            Start Your Journey
          </button>
          <button
            data-testid="cta-partner"
            aria-label="Become a partner"
            onClick={()=>{ logEvent('CTA_Click_Partner'); onPartner?.(); }}
            className="ring-1 ring-white/70 text-white hover:bg-white/10 font-medium py-3 px-6 rounded-lg"
          >
            Become a Partner
          </button>
        </div>
      </div>
    </section>
  );
}

