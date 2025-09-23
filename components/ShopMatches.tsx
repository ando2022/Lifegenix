'use client';

import { ShopMatch } from '@/lib/types';
import { Clock, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface ShopMatchesProps {
  matches: ShopMatch[];
  onSelectShop: (match: ShopMatch) => void;
  isPremium?: boolean; // if false, actions are locked behind premium
}

export default function ShopMatches({ matches, onSelectShop, isPremium = false }: ShopMatchesProps) {
  const [selected, setSelected] = useState<ShopMatch | null>(null);
  const [enriched, setEnriched] = useState<ShopMatch[]>(matches || []);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [vote, setVote] = useState('smart-matching');
  // stabilize onSelect handler for map markers so map doesn't re-init
  const onSelectStableRef = useRef(onSelectShop);
  onSelectStableRef.current = onSelectShop;

  // Geocode addresses (OpenStreetMap Nominatim) for shops missing coordinates
  useEffect(() => {
    let cancelled = false;
    const cacheKey = 'geocodeCache_v1';
    const cache = (() => {
      try { return JSON.parse(localStorage.getItem(cacheKey) || '{}'); } catch { return {}; }
    })() as Record<string, { lat: number; lng: number }>;

    async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
      // Cache first
      if (cache[address]) return cache[address];
      try {
        const gKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODE_KEY;
        if (gKey) {
          // Use Google Geocoding API
          const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${gKey}`;
          const res = await fetch(url);
          const data = await res.json();
          if (data?.results?.[0]?.geometry?.location) {
            const { lat, lng } = data.results[0].geometry.location as { lat: number; lng: number };
            cache[address] = { lat, lng };
            try { localStorage.setItem(cacheKey, JSON.stringify(cache)); } catch {}
            return { lat, lng };
          }
        } else {
          // Fallback to OpenStreetMap Nominatim (no key required)
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
          const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
              cache[address] = { lat, lng };
              try { localStorage.setItem(cacheKey, JSON.stringify(cache)); } catch {}
              return { lat, lng };
            }
          }
        }
      } catch {}
      return null;
    }

    async function enrich() {
      const list = [...(matches || [])];
      for (let i = 0; i < list.length; i++) {
        const m = list[i];
        // 1) If shop already provides coordinates, surface them as location for the map
        if (!m?.shop?.location && m?.shop?.coordinates &&
            typeof (m.shop.coordinates as any).lat === 'number' &&
            typeof (m.shop.coordinates as any).lng === 'number') {
          // @ts-ignore - add location derived from coordinates
          m.shop.location = { lat: (m.shop.coordinates as any).lat, lng: (m.shop.coordinates as any).lng } as any;
          continue;
        }

        // 2) Otherwise, try geocoding the address
        if (!m?.shop?.location && m?.shop?.address) {
          const coords = await geocode(m.shop.address);
          if (coords) {
            // @ts-ignore - augment location
            m.shop.location = { lat: coords.lat, lng: coords.lng } as any;
          }
          // small delay to be polite to API
          await new Promise((r) => setTimeout(r, 250));
        }
      }
      if (!cancelled) setEnriched(list);
    }

    enrich();
    return () => { cancelled = true; };
  }, [matches]);

  const safeMatches = useMemo(
    () =>
      (enriched || []).filter(
        (m) => m?.shop?.location && typeof m.shop.location.lat === 'number' && typeof m.shop.location.lng === 'number'
      ),
    [enriched]
  );
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No matching shops found</h3>
        <p className="text-gray-600">Try adjusting your recipe or check back later for new partners.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nearby Shop Matches</h2>
        <p className="text-gray-600">Shops that match your health profile and preferences</p>
      </div>

      {/* Single premium prompt, shown once at top */}
      <div className="p-4 bg-violet-50 rounded-lg border border-violet-200 flex items-center justify-between">
        <div>
          <p className="font-semibold text-violet-900">Want specific menu picks?</p>
          <p className="text-sm text-violet-700">See exact items for your health profile.</p>
          <p className="text-sm text-violet-700">Preview is limited and may miss shops.</p>
        </div>
        <button onClick={() => setShowPremiumModal(true)} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
          Upgrade to Premium
        </button>
      </div>

      {/* Map (if we have coordinates) */}
      {safeMatches.length > 0 ? (
        <ShopMap matches={safeMatches} onSelect={(m) => setSelected(m)} />
      ) : (
        <div className="text-center text-gray-600 py-6">Map preview unavailable (no shop coordinates yet).</div>
      )}

      {/* Selected shop card (when clicking a pin) */}
      {selected && (
        <ShopMatchCard match={selected} onSelect={onSelectShop} isPremium={isPremium} />
      )}

      {/* Always show list below the map */}
      <div className="space-y-4">
        {enriched.map((m) => (
          <ShopMatchCard key={m.shop.id} match={m} onSelect={onSelectShop} isPremium={isPremium} />
        ))}
      </div>
      <PremiumInterestModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} vote={vote} setVote={setVote} />
    </div>
  );
}

function ShopMatchCard({ match, onSelect, isPremium }: { match: ShopMatch; onSelect: (match: ShopMatch) => void; isPremium: boolean }) {
  // removed match color/label chip per feedback

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{match.shop.name}</h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">Google rating {match.shop.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              {/* Custom X-style Pin */}
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0 C5.5 0, 3.5 2, 3.5 4.5 C3.5 7, 8 16, 8 16 C8 16, 12.5 7, 12.5 4.5 C12.5 2, 10.5 0, 8 0 Z M8 6 C7.2 6, 6.5 5.3, 6.5 4.5 C6.5 3.7, 7.2 3, 8 3 C8.8 3, 9.5 3.7, 9.5 4.5 C9.5 5.3, 8.8 6, 8 6 Z"/>
              </svg>
              <span>{match.shop.address}</span>
            </div>
            {match.shop.distance && (
              <span>{match.shop.distance} km away</span>
            )}
          </div>
        </div>

        {/* Removed per feedback: percentage chip not informative enough */}
      </div>

      {/* Health Profile Match */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
          Why This Shop Matches Your Profile
        </h4>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            • Specializes in {match.shop.specialties?.join(', ') || 'healthy smoothies'}
          </div>
          <div className="text-sm text-gray-600">
            • Focuses on {match.shop.healthFocus?.join(', ') || 'nutrition and wellness'}
          </div>
          <div className="text-sm text-gray-600">
            • Prep time: {match.shop.capabilities.prepTime} minutes
          </div>
        </div>
      </div>

      {/* note: premium prompt moved to list header; keep card minimal */}

      <div className="flex space-x-3">
        {isPremium ? (
          <>
            <button
              onClick={() => onSelect(match)}
              className="flex-1 btn-primary"
            >
              Order from {match.shop.name}
            </button>
            <button className="btn-secondary">View Menu</button>
          </>
        ) : (
          <>
            <button className="flex-1 btn-primary opacity-60 cursor-not-allowed" disabled>
              Order (Premium)
            </button>
            <button className="btn-secondary opacity-60 cursor-not-allowed" disabled>
              View Menu (Premium)
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Lightweight map without external libraries
function ShopMap({ matches, onSelect }: { matches: ShopMatch[]; onSelect: (m: ShopMatch) => void }) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  // Keep stable onSelect for marker listeners
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const safeMatches = useMemo(
    () =>
      (matches || []).filter(
        (m) => m?.shop?.location && typeof m.shop.location.lat === 'number' && typeof m.shop.location.lng === 'number'
      ),
    [matches]
  );

  const bounds = useMemo(() => {
    if (safeMatches.length === 0) {
      // Default bounds around Switzerland
      return { minLat: 46.0, maxLat: 47.8, minLng: 6.0, maxLng: 10.5 };
    }
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    safeMatches.forEach((m) => {
      const { lat, lng } = m.shop.location!;
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });
    const latPad = (maxLat - minLat) * 0.1 || 0.05;
    const lngPad = (maxLng - minLng) * 0.1 || 0.05;
    return { minLat: minLat - latPad, maxLat: maxLat + latPad, minLng: minLng - lngPad, maxLng: maxLng + lngPad };
  }, [safeMatches]);

  const project = (lat: number, lng: number, width: number, height: number) => {
    const lngSpan = Math.max(1e-6, bounds.maxLng - bounds.minLng);
    const latSpan = Math.max(1e-6, bounds.maxLat - bounds.minLat);
    const x = ((lng - bounds.minLng) / lngSpan) * width;
    const y = (1 - (lat - bounds.minLat) / latSpan) * height;
    return { x, y };
  };

  // Interactive Google Map init (if key present)
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY;
    if (!key || !mapRef.current) return;
    // load script if not present
    const scriptId = 'google-maps-js';
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
      s.async = true;
      document.body.appendChild(s);
      s.onload = initMap;
    } else {
      initMap();
    }

    function initMap() {
      // @ts-ignore
      const g = (window as any).google;
      if (!g || !g.maps || !mapRef.current) return;
      // Default to Zurich center; fit markers after render
      const center = { lat: 47.3769, lng: 8.5417 };
      const map = new g.maps.Map(mapRef.current, {
        zoom: 12,
        center,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      const info = new g.maps.InfoWindow();
      const bounds = new g.maps.LatLngBounds();
      safeMatches.forEach((m) => {
        const pos = { lat: m.shop.location!.lat, lng: m.shop.location!.lng };
        const marker = new g.maps.Marker({ position: pos, map, title: m.shop.name });
        marker.addListener('click', () => {
          const content = `<div style=\"font-size:14px; line-height:1.3;\">` +
            `<div style=\"font-weight:600; margin-bottom:4px;\">${m.shop.name}</div>` +
            `<div style=\"color:#4b5563; margin-bottom:4px;\">${m.shop.address || ''}</div>` +
            `<div style=\"color:#6b7280;\">Match: ${typeof m.matchScore === 'number' ? m.matchScore : '—'}% • Rating: ${m.shop.rating ?? '—'}</div>` +
            `</div>`;
          info.setContent(content);
          info.open({ anchor: marker, map });
          onSelectRef.current(m);
        });
        bounds.extend(pos);
      });
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, 48);
      }
    }
  }, [safeMatches]);

  return (
    <div className="relative w-full h-80 rounded-xl border border-gray-200 overflow-hidden">
      {process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY ? (
        <div ref={mapRef} className="absolute inset-0" />
      ) : (
        // fallback pin rendering (no Google key)
        safeMatches.map((m) => (
          <Marker key={m.shop.id} match={m} project={project} onSelect={onSelect} onHover={setHoverId} hovering={hoverId === m.shop.id} />
        ))
      )}
    </div>
  );
}

function Marker({ match, project, onSelect, onHover, hovering }: { match: ShopMatch; project: (lat: number, lng: number, w: number, h: number) => { x: number; y: number }; onSelect: (m: ShopMatch) => void; onHover: (id: string | null) => void; hovering: boolean }) {
  // Use parent element size
  const w = 1000, h = 600; // approximation for projection (CSS scales with container)
  const { x, y } = project(match.shop.location.lat, match.shop.location.lng, w, h);
  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-full cursor-pointer`}
      style={{ left: `${(x / w) * 100}%`, top: `${(y / h) * 100}%` }}
      onClick={() => onSelect(match)}
      onMouseEnter={() => onHover(match.shop.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="w-4 h-4 bg-violet-600 rounded-full shadow"></div>
      {hovering && (
        <div className="mt-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs shadow whitespace-nowrap">
          {match.shop.name}
        </div>
      )}
    </div>
  );
}

// Lightweight modal duplicated for this surface (kept decoupled from recipe page)
function PremiumInterestModal({ open, onClose, vote, setVote }: { open: boolean; onClose: () => void; vote: string; setVote: (v: string) => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Get early access</h3>
        <p className="text-gray-600 mb-4">Sign in to be first to know when Premium launches — and receive an early‑bird discount. Tell us what you want most so we can prioritize.</p>
        <label className="block text-sm font-medium text-gray-700 mb-1">Feature you want first</label>
        <select value={vote} onChange={(e) => setVote(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-violet-500">
          <option value="smart-matching">Smart Shop Matching (exact menu picks)</option>
          <option value="recipe-precision">Recipe Precision (grams, costs, Michelin twists)</option>
          <option value="health-intel">Health Intelligence & device connectivity</option>
          <option value="map-experience">Interactive Map & distance/time</option>
        </select>
        <div className="flex items-center justify-between">
          <a href="/auth/signin" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors">Sign in for free</a>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">Close</button>
        </div>
      </div>
    </div>
  );
}
