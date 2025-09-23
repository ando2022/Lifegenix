'use client';

import { SingleMixRecipe, SingleMixIngredient } from '@/lib/types';
import { Clock, Users, Zap, Star, Heart, Scale, FlaskConical, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { logEvent } from '@/lib/analytics';

interface SingleMixRecipeDisplayProps {
  recipe: SingleMixRecipe;
  userProfile?: any;
  checkInData?: any;
  onFindShops?: () => void;
  topMatch?: { name: string; score: number } | null;
}

export default function SingleMixRecipeDisplay({ recipe, userProfile, checkInData, onFindShops, topMatch = null }: SingleMixRecipeDisplayProps) {
  // Flattened, de-duplicated ingredient list (no categories)
  const flatIngredients = dedupeAndSortIngredients(recipe.ingredients);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [vote, setVote] = useState('smart-matching');

  // Banner impressions
  useEffect(() => {
    try {
      logEvent('Premium_Prompt_Shown', { surface: 'recipe_banners' });
      logEvent('NearbyRecipes_Viewed', { surface: 'recipe_banners' });
    } catch {}
  }, []);

  return (
    <div className="space-y-8">
      {/* Recipe Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">{recipe.name}</h2>
        <p className="text-gray-600">Simple, transparent, and scientifically optimized</p>
      </div>

      {/* 1) Recipe Summary Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Smoothie Cup Illustration */}
          <div className="hidden md:block">
            <div className="mx-auto w-56">
              {/* SVG cup (dome lid + straw), Joe & the Juice style */}
              <svg viewBox="0 0 120 200" className="block w-full h-64">
                <defs>
                  <linearGradient id="smoothieFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={recipe.color} />
                    <stop offset="100%" stopColor="rgba(124,58,237,0.25)" />
                  </linearGradient>
                  <linearGradient id="straw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={recipe.color} />
                    <stop offset="100%" stopColor={recipe.color} />
                  </linearGradient>
                </defs>
                {/* Straw */}
                <rect x="82" y="-5" width="6" height="70" rx="3" transform="rotate(18 82 -5)" fill="url(#straw)" />
                {/* Dome lid */}
                <path d="M12 58 Q60 20 108 58" fill="rgba(255,255,255,0.5)" stroke="#fff" strokeWidth="3" />
                {/* Flat cover edge */}
                <ellipse cx="60" cy="58" rx="46" ry="6" fill="rgba(255,255,255,0.55)" stroke="#fff" strokeWidth="2" />
                {/* Cup body outline (slight trapezoid) */}
                <path d="M22 58 L98 58 L90 172 Q60 184 30 172 Z" fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="4" />
                {/* Smoothie fill */}
                <path d="M28 64 L92 64 L86 168 Q60 176 34 168 Z" fill="url(#smoothieFill)" opacity="0.9" />
                {/* Rim shine */}
                <rect x="34" y="68" width="52" height="6" rx="3" fill="#fff" opacity="0.8" />
              </svg>
              {/* Buttons moved into banners below */}
            </div>
          </div>

          {/* Ingredient list (single list, no categories/emojis) */}
          <div className="md:pl-4 flex justify-center">
            <ul className="space-y-3 w-80">
              {flatIngredients.map((ingredient, idx) => (
                <li key={ingredient.ingredient.id} className="flex items-center">
                  <span
                    className="mr-3 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: recipe.color }}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-gray-700">{ingredient.ingredient.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Optional chef-style twists to better target goals */}
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Optional twists</h4>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            {generateChefTwists(userProfile, checkInData).map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2) Personalization Banner */}
      <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl p-5 border border-violet-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Why this fits you today</h3>
            <div className="text-sm text-gray-700">
              {renderProfileSummary(userProfile)}
            </div>
            <ul className="mt-3 text-sm text-gray-800 list-disc pl-5 space-y-1">
              {generateBannerBullets(userProfile, checkInData, flatIngredients).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
          <div className="text-right">
            <a
              href="/analysis"
              onClick={() => { try { logEvent('Premium_Prompt_Clicked', { surface: 'recipe_banners' }); } catch {}; }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors whitespace-nowrap"
            >
              See today’s advice
            </a>
          </div>
        </div>
      </div>

      {/* 3) Shop Match Banner */}
      <div className="rounded-xl p-5 border border-violet-100 bg-gradient-to-r from-violet-50 to-fuchsia-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Find your best match nearby</h3>
            <p className="text-sm text-gray-700">We scan nearby cafés to find the recipe that best matches your health profile and today’s check‑in.</p>
            {topMatch && (
              <p className="text-sm text-gray-800 mt-1"><span className="font-medium">Top suggestion:</span> {topMatch.name} — {topMatch.score}% match</p>
            )}
          </div>
          <div className="text-right">
            <button
              onClick={() => { try { logEvent('Shop_Match_Clicked', { surface: 'recipe_banners' }); } catch {}; onFindShops && onFindShops(); }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors"
            >
              Find nearby match
            </button>
          </div>
        </div>
      </div>


      {/* Compact stats (moved below) */}
      <div className="text-sm text-gray-600 flex items-center gap-6 justify-center">
        <div className="inline-flex items-center gap-2"><Clock className="w-4 h-4 text-violet-600" />{recipe.prepTime} minutes</div>
        <div className="inline-flex items-center gap-2"><Users className="w-4 h-4 text-violet-600" />{recipe.difficulty}</div>
      </div>

      {/* Premium Subscription */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl p-8 text-white">
        <div className="text-center mb-8">
          <Star className="w-10 h-10 mx-auto mb-3 text-yellow-300" />
          <h3 className="text-2xl font-bold mb-2">Premium — Unlock Everything</h3>
          <div className="text-3xl font-extrabold">CHF 9.90<span className="text-base font-semibold">/mo</span></div>
          <p className="text-violet-100 text-lg mt-1">Advanced tools for precision, mastery, and shop matching.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Recipe Precision */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Scale className="w-6 h-6 text-yellow-300" />
              <h4 className="font-semibold">Recipe Precision</h4>
            </div>
            <ul className="text-sm space-y-1 text-violet-100">
              <li>• Exact measurements</li>
              <li>• Cost optimization</li>
              <li>• Complete nutrition breakdown</li>
              <li>• Step-by-step preparation guide</li>
              <li>• Ingredient impact by health goal (science‑based)</li>
              <li>• Michelin‑inspired twists for elevated taste</li>
            </ul>
          </div>

          {/* Artisanal Techniques removed */}

          {/* Smart Shop Matching */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <MapPin className="w-6 h-6 text-yellow-300" />
              <h4 className="font-semibold">Smart Shop Matching</h4>
            </div>
            <ul className="text-sm space-y-1 text-violet-100">
              <li>• Curated local shop directory</li>
              <li>• Personalized menu picks for your health profile</li>
              <li>• Compatibility scores for each item</li>
            </ul>
          </div>

          {/* (Artisanal Techniques removed per request; folded into Recipe Precision) */}

          {/* Health Intelligence & Analytics (consolidated) */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <FlaskConical className="w-6 h-6 text-yellow-300" />
              <h4 className="font-semibold">Health Intelligence & Analytics</h4>
            </div>
            <ul className="text-sm space-y-1 text-violet-100">
              <li>• Personalized analysis for the day</li>
              <li>• Track your health & progress</li>
              <li>• Sync with smartwatch or fitness devices</li>
              <li>• Your health profile is saved; daily check‑ins refresh your analysis</li>
              <li>• Beyond smoothies: poke bowls & meal personalization</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center">
          <button onClick={() => setShowPremiumModal(true)} className="bg-white text-violet-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-violet-50 transition-colors shadow-lg">
            Get my daily plan
          </button>
          <p className="text-violet-200 text-sm mt-3">Join a growing community mastering personalized nutrition</p>
        </div>
      </div>

      {/* Why This Recipe Works - removed from this page (moved to About) */}
      <PremiumInterestModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} vote={vote} setVote={setVote} />
    </div>
  );
}

// Lightweight modal to collect interest and show sign-in
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

// Helper function to group ingredients by purpose
function groupIngredientsByPurpose(ingredients: SingleMixIngredient[]) {
  return ingredients.reduce((acc, item) => {
    const purpose = item.purpose || 'other';
    if (!acc[purpose]) {
      acc[purpose] = [];
    }
    acc[purpose].push(item);
    return acc;
  }, {} as Record<string, SingleMixIngredient[]>);
}

// Helper to deduplicate and sort ingredients for a cleaner list
function dedupeAndSortIngredients(items: SingleMixIngredient[]) {
  const byId = new Map<string, SingleMixIngredient>();
  for (const it of items) {
    // last one wins; they all share same display name anyway
    byId.set(it.ingredient.id, it);
  }
  return Array.from(byId.values()).sort((a, b) =>
    a.ingredient.name.localeCompare(b.ingredient.name)
  );
}

// Helper function to get purpose icons
function getPurposeIcon(purpose: string) {
  const icons: Record<string, any> = {
    'base': '🍓',
    'liquid': '🥛',
    'protein': '💪',
    'superfood': '⭐',
    'sweetener': '🍯',
    'other': '✨'
  };
  return <span className="text-lg">{icons[purpose] || '✨'}</span>;
}

// Helper function to get time of day
function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

// Render a compact profile summary string for the banner
function renderProfileSummary(userProfile?: any) {
  if (!userProfile) {
    return <p className="text-sm text-gray-700">Using today’s check‑in to personalize your blend.</p>;
  }
  const allergies = Array.isArray(userProfile.allergies) && userProfile.allergies.length
    ? `Allergies: ${userProfile.allergies.join(', ')}`
    : 'Allergies: none';
  const intolerances = Array.isArray(userProfile.intolerances) && userProfile.intolerances.length
    ? `Intolerances: ${userProfile.intolerances.join(', ')}`
    : 'Intolerances: none';
  const goals = Array.isArray(userProfile.goals) && userProfile.goals.length
    ? `Goals: ${userProfile.goals.join(' + ')}`
    : 'Goals: balanced nutrition';
  return (
    <p className="text-sm text-gray-700">
      {allergies}; {intolerances}; {goals}
    </p>
  );
}

// Create 1–2 short bullet points connecting profile + check-in to this smoothie
function generateBannerBullets(userProfile: any, checkInData: any, ingredients: SingleMixIngredient[]): string[] {
  const bullets: string[] = [];
  const names = new Set(ingredients.map(i => i.ingredient.name.toLowerCase()));

  const hasOats = Array.from(names).some(n => n.includes('oat'));
  const hasBanana = Array.from(names).some(n => n.includes('banana'));
  const hasCacao = Array.from(names).some(n => n.includes('cacao'));
  const hasChia = Array.from(names).some(n => n.includes('chia'));

  if ((userProfile?.goals || []).some((g: string) => /energy/i.test(g)) || checkInData?.mood === 'tired') {
    if (hasOats || hasBanana) bullets.push('Your goal is sustained energy — oats/banana provide steady carbs.');
  }

  if ((userProfile?.goals || []).some((g: string) => /focus|brain/i.test(g))) {
    if (hasChia) bullets.push('Focus support — chia delivers omega‑3s for brain health.');
  }

  if (checkInData?.sleepQuality && checkInData.sleepQuality <= 2 && hasCacao) {
    bullets.push('Poor sleep reported — cacao can lift mood and alertness.');
  }

  if (bullets.length === 0) {
    bullets.push('Balanced macros and micronutrients tailored to your preferences.');
  }

  return bullets.slice(0, 2);
}

// Chef-style twists depending on goals and state
function generateChefTwists(userProfile?: any, checkInData?: any): string[] {
  const twists: string[] = [];
  const goals = (userProfile?.goals || []).map((g: string) => g.toLowerCase());
  const poorSleep = checkInData?.sleepQuality && checkInData.sleepQuality <= 2;

  if (goals.includes('energy')) {
    twists.push('Add a 1 cm fresh ginger slice for a clean energy lift.');
  }
  if (goals.includes('focus') || goals.includes('brain')) {
    twists.push('Top with a teaspoon of ground flax for extra omega‑3.');
  }
  if (goals.includes('gut') || goals.includes('detox')) {
    twists.push('Blend 1 tsp grated lemon zest for digestive brightness.');
  }
  if (poorSleep) {
    twists.push('Swap half the milk for chamomile tea (decaf) to wind down.');
  }

  if (twists.length === 0) twists.push('Sprinkle cinnamon for warmth and natural sweetness.');
  return twists.slice(0, 3);
}

// Generate personalized reasoning based on user profile and check-in data
function generatePersonalizedReasoning(recipe: SingleMixRecipe, userProfile?: any, checkInData?: any) {
  const reasons = [];
  const timeOfDay = getTimeOfDay();

  // Time-of-day reasoning
  switch (timeOfDay) {
    case 'morning':
      reasons.push({
        title: 'Morning Energy Optimization',
        description: 'This recipe is crafted for morning consumption, focusing on energizing ingredients that provide sustained energy without crashes.'
      });
      break;
    case 'afternoon':
      reasons.push({
        title: 'Afternoon Sustenance',
        description: 'Perfect for afternoon consumption, this blend maintains steady energy and focus to power through your day.'
      });
      break;
    case 'evening':
      reasons.push({
        title: 'Evening Wind-Down Support',
        description: 'Designed for evening consumption, this recipe supports relaxation and digestion while preparing your body for rest.'
      });
      break;
  }

  // Mood-based reasoning
  if (checkInData?.mood) {
    switch (checkInData.mood) {
      case 'energized':
        reasons.push({
          title: 'Sustains Your Energy',
          description: 'This recipe includes energizing ingredients to maintain your current high energy levels throughout the day.'
        });
        break;
      case 'tired':
        reasons.push({
          title: 'Natural Energy Boost',
          description: 'Selected ingredients provide natural energy without the crash, perfect for when you need a pick-me-up.'
        });
        break;
      case 'stressed':
        reasons.push({
          title: 'Stress-Relieving Nutrients',
          description: 'Contains magnesium and adaptogens to help your body manage stress and promote calmness.'
        });
        break;
      case 'focused':
        reasons.push({
          title: 'Brain-Boosting Formula',
          description: 'Rich in omega-3s and antioxidants to enhance cognitive function and mental clarity.'
        });
        break;
      case 'hungry':
        reasons.push({
          title: 'Satisfying & Filling',
          description: 'High in protein and fiber to keep you full and satisfied, preventing overeating.'
        });
        break;
    }
  }

  // Health goals reasoning
  if (userProfile?.goals && userProfile.goals.length > 0) {
    if (userProfile.goals.includes('energy')) {
      reasons.push({
        title: 'Supports Your Energy Goals',
        description: 'Optimized with B-vitamins and natural sugars to boost and sustain your energy levels.'
      });
    }
    if (userProfile.goals.includes('skin')) {
      reasons.push({
        title: 'Skin-Healthy Ingredients',
        description: 'Packed with antioxidants and vitamins that promote healthy, glowing skin from within.'
      });
    }
    if (userProfile.goals.includes('detox')) {
      reasons.push({
        title: 'Natural Detox Support',
        description: 'Contains liver-supporting nutrients and antioxidants to help your body\'s natural detox processes.'
      });
    }
  }

  // Dietary restrictions reasoning
  if (userProfile?.allergies && userProfile.allergies.length > 0) {
    reasons.push({
      title: 'Allergy-Safe Recipe',
      description: `Carefully crafted to avoid your allergens: ${userProfile.allergies.join(', ')}.`
    });
  }

  if (userProfile?.intolerances && userProfile.intolerances.length > 0) {
    reasons.push({
      title: 'Intolerance-Friendly',
      description: `Designed to minimize ingredients you\'re sensitive to: ${userProfile.intolerances.join(', ')}.`
    });
  }

  // Sleep quality reasoning
  if (checkInData?.sleepQuality && checkInData.sleepQuality <= 2) {
    reasons.push({
      title: 'Sleep Recovery Support',
      description: 'Includes nutrients that support better sleep quality and help your body recover from poor rest.'
    });
  }

  // Default reasons if no specific matches
  if (reasons.length === 0) {
    reasons.push(
      {
        title: 'Balanced Nutrition',
        description: 'Provides a perfect balance of macronutrients and micronutrients for optimal health.'
      },
      {
        title: 'Delicious & Simple',
        description: 'Tastes great while being easy to prepare, making healthy eating enjoyable.'
      }
    );
  }

  return reasons.slice(0, 4); // Limit to 4 reasons for better layout
}