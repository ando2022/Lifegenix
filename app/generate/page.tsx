'use client';

import { useState, useEffect } from 'react';
import { UserProfile, Mood, GeneratedRecipe } from '@/lib/types';
import { useAnalytics, useEngagementTracking } from '@/hooks/useAnalytics';
import { SingleMixRecipeGenerator } from '@/lib/single-mix-recipe-generator';
import { ShopMatcher } from '@/lib/shop-matcher';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DailyCheckIn from '@/components/DailyCheckIn';
import SingleMixRecipeDisplay from '@/components/SingleMixRecipeDisplay';
import ShopMatches from '@/components/ShopMatches';
import { locationService } from '@/lib/location-service';

// Helper function to determine goal based on mood, time of day, and user profile
function determineGoal(mood: string, userProfile: any, sleepQuality: number): string {
  const hour = new Date().getHours();
  const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 18 ? 'afternoon' : 'evening';
  
  // Time-based goal determination with sleep quality consideration
  if (timeOfDay === 'morning') {
    if (mood === 'tired' || sleepQuality <= 2) return 'energy-boost';
    if (mood === 'stressed' && sleepQuality <= 2) return 'calm-stomach';
    if (mood === 'hungry') return 'meal-replacement';
    if (sleepQuality >= 3 && mood === 'energized') return 'longevity';
    return 'energy-boost'; // Default for morning
  }
  
  if (timeOfDay === 'afternoon') {
    if (mood === 'tired' || sleepQuality <= 2) return 'energy-boost';
    if (mood === 'stressed') return 'calm-stomach';
    if (mood === 'hungry') return 'meal-replacement';
    if (mood === 'focused' && sleepQuality >= 3) return 'brain-health';
    return 'energy-boost'; // Default for afternoon
  }
  
  if (timeOfDay === 'evening') {
    if (mood === 'stressed' || sleepQuality <= 2) return 'calm-stomach';
    if (mood === 'tired') return 'gut-health';
    if (mood === 'relaxed' && sleepQuality >= 3) return 'longevity';
    return 'gut-health'; // Default for evening
  }
  
  // Mood-based goal determination (fallback)
  if (mood === 'tired') return 'energy-boost';
  if (mood === 'stressed') return 'calm-stomach';
  if (mood === 'hungry') return 'meal-replacement';
  if (mood === 'focused') return 'brain-health';
  if (mood === 'energized') return 'longevity';
  if (mood === 'relaxed') return 'gut-health';
  
  // User profile goal preference (if available)
  if (userProfile?.goals?.includes('Energy')) return 'energy-boost';
  if (userProfile?.goals?.includes('Detox')) return 'gut-health';
  if (userProfile?.goals?.includes('Longevity')) return 'longevity';
  if (userProfile?.goals?.includes('Focus')) return 'brain-health';
  if (userProfile?.goals?.includes('Immune')) return 'immune-support';
  
  return 'energy-boost'; // Ultimate fallback
}

export default function GeneratePage() {
  const [currentStep, setCurrentStep] = useState<'checkin' | 'analysis' | 'recipe' | 'shops'>('checkin');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [checkInData, setCheckInData] = useState<any>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const recipeGenerator = new SingleMixRecipeGenerator();
  const shopMatcher = new ShopMatcher();
  const { trackRecipeGeneration, trackShopInteraction } = useAnalytics();
  
  // Track user engagement on this page
  useEngagementTracking();

  // Load state from localStorage on mount and auto-resume recipe step
  useEffect(() => {
    try {
      const lockCheckin = process.env.NEXT_PUBLIC_LOCK_CHECKIN === '1';
      const savedProfileStr = localStorage.getItem('userProfile');
      const savedCheckInStr = localStorage.getItem('lastCheckIn');
      const cachedRecipeStr = localStorage.getItem('generatedRecipeCache');
      const savedStep = localStorage.getItem('generate_currentStep');
      const url = new URL(window.location.href);
      const force = url.searchParams.get('force');

      if (savedProfileStr) {
        const profile = JSON.parse(savedProfileStr);
        setUserProfile(profile);
      }
      if (savedCheckInStr) {
        const ci = JSON.parse(savedCheckInStr);
        setCheckInData(ci);
      }
      if (lockCheckin || force === 'checkin') {
        setCurrentStep('checkin');
        return;
      }

      if (cachedRecipeStr) {
        const cached = JSON.parse(cachedRecipeStr);
        setGeneratedRecipe(cached);
        setCurrentStep('recipe');
        return; // hydrate directly
      }
      // If caller explicitly forced check-in, respect it and stop here
      if (savedStep === 'checkin') {
        setCurrentStep('checkin');
        return;
      }
      // If we have profile + last check-in but no cache, auto-generate and go to recipe
      if (savedProfileStr && savedCheckInStr) {
        const profile = JSON.parse(savedProfileStr);
        const ci = JSON.parse(savedCheckInStr);
        setIsGenerating(true);
        (async () => {
          const goal = determineGoal(ci.mood, profile, ci.sleepQuality);
          const enhancedProfile = { ...profile, ...ci };
          const recipe = recipeGenerator.generateRecipe(enhancedProfile, ci.mood, goal as any, ci.sleepQuality);
          const loc = await locationService.getCurrentLocation().catch(() => null);
          const userLoc = loc ? { lat: loc.latitude, lng: loc.longitude } : undefined;
          const shopMatches = recipe.singleMixRecipe
            ? shopMatcher.findMatchesForSingleMix(recipe.singleMixRecipe, userLoc)
            : shopMatcher.findMatches(recipe.recipe, userLoc);
          const finalRecipe = { ...recipe, shopMatches } as any;
          setGeneratedRecipe(finalRecipe);
          setIsGenerating(false);
          setCurrentStep('recipe');
          try { localStorage.setItem('generatedRecipeCache', JSON.stringify(finalRecipe)); } catch {}
          try { localStorage.setItem('generate_currentStep', 'recipe'); } catch {}
        })();
      } else if (savedStep === 'recipe') {
        // If step persisted as recipe but we have no data, keep user here; UI will show placeholder until regenerated
        setCurrentStep('recipe');
      }
    } catch (error) {
      console.error('init generate page failed', error);
    }
  }, []);


  const handleCheckInComplete = (data: any) => {
    setCheckInData(data);
    try { localStorage.setItem('lastCheckIn', JSON.stringify(data)); } catch {}
    // Immediately kick off generation and jump to recipe when done
    setIsGenerating(true);
    const effectiveProfile = userProfile || {
      gender: 'unspecified',
      age: undefined,
      location: undefined,
      allergies: [],
      intolerances: [],
      diet: 'none',
      goals: [],
      dislikes: [],
      sweetnessTolerance: 'medium',
      texturePreference: 'balanced',
      budget: 'medium',
      activityLevel: 'moderate',
      flavorPreferences: []
    } as any;

    setTimeout(async () => {
      const goal = determineGoal(data.mood, effectiveProfile, data.sleepQuality);
      const enhancedProfile = { ...effectiveProfile, ...data };
      const recipe = recipeGenerator.generateRecipe(enhancedProfile, data.mood, goal as any, data.sleepQuality);
      const loc = await locationService.getCurrentLocation().catch(() => null);
      const userLoc = loc ? { lat: loc.latitude, lng: loc.longitude } : undefined;
      const shopMatches = recipe.singleMixRecipe
        ? shopMatcher.findMatchesForSingleMix(recipe.singleMixRecipe, userLoc)
        : shopMatcher.findMatches(recipe.recipe, userLoc);
      const finalRecipe = { ...recipe, shopMatches } as any;
      setGeneratedRecipe(finalRecipe);
      if (finalRecipe.singleMixRecipe && userProfile) {
        trackRecipeGeneration(effectiveProfile, data.mood, finalRecipe.singleMixRecipe).catch(() => {});
      }
      setIsGenerating(false);
      setCurrentStep('recipe');
      try { localStorage.setItem('generatedRecipeCache', JSON.stringify(finalRecipe)); } catch {}
      try { localStorage.setItem('generate_currentStep', 'recipe'); } catch {}
    }, 600);
  };

  const handleCheckInSkip = () => {
    // Skip check-in triggers immediate generation with defaults
    if (userProfile) {
      handleCheckInComplete({ mood: 'energized', sleepQuality: 3 });
    } else {
      setCurrentStep('recipe');
    }
  };

  const handleAnalysisContinue = () => {
    if (userProfile && checkInData) {
      setIsGenerating(true);
      
      // Simulate API call delay
      setTimeout(async () => {
        // Determine goal based on mood, time of day, and user profile
        const goal = determineGoal(checkInData.mood, userProfile, checkInData.sleepQuality);
        
        const enhancedProfile = { ...userProfile, ...checkInData };
        const recipe = recipeGenerator.generateRecipe(enhancedProfile, checkInData.mood, goal as any, checkInData.sleepQuality);
        // Try to get user location for distance-aware sorting
        const loc = await locationService.getCurrentLocation().catch(() => null);
        const userLoc = loc ? { lat: loc.latitude, lng: loc.longitude } : undefined;
        // Prefer single-mix matching
        const shopMatches = recipe.singleMixRecipe
          ? shopMatcher.findMatchesForSingleMix(recipe.singleMixRecipe, userLoc)
          : shopMatcher.findMatches(recipe.recipe, userLoc);
        
        const finalRecipe = {
          ...recipe,
          shopMatches
        };
        
        setGeneratedRecipe(finalRecipe);
        
                // Track recipe generation
                // Fire-and-forget analytics; don't block UI
                if (finalRecipe.singleMixRecipe) {
                  trackRecipeGeneration(userProfile, checkInData.mood, finalRecipe.singleMixRecipe).catch(() => {});
                }
        
        setIsGenerating(false);
        setCurrentStep('recipe');
        try { localStorage.setItem('generatedRecipeCache', JSON.stringify(finalRecipe)); } catch {}
        try { localStorage.setItem('generate_currentStep', 'recipe'); } catch {}
      }, 800);
    }
  };

  const handleShopSelect = (match: any) => {
    // Handle shop selection and order placement
    console.log('Selected shop:', match);
    // In a real app, this would redirect to order confirmation or payment
  };

  const resetFlow = () => {
    setUserProfile(null);
    setGeneratedRecipe(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Compact Progress Indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-3 text-xs text-gray-600">
                    <div className={`px-2.5 py-1 rounded-full ${currentStep==='checkin' ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-700'}`}>1. Check-in</div>
                    <div className="h-0.5 w-8 bg-gray-200" />
                    <div className={`px-2.5 py-1 rounded-full ${currentStep==='recipe' ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-700'}`}>2. Smoothie</div>
                    <div className="h-0.5 w-8 bg-gray-200" />
                    <div className={`px-2.5 py-1 rounded-full ${currentStep==='shops' ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-700'}`}>3. Nearby Match</div>
                  </div>
                </div>

        {/* Content */}
        {currentStep === 'checkin' && (
          <div className="max-w-4xl mx-auto">
            <DailyCheckIn 
              onComplete={handleCheckInComplete}
              onSkip={handleCheckInSkip}
            />
          </div>
        )}

        {isGenerating && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="text-center">
              <div className="inline-flex items-center space-x-3 bg-white rounded-lg px-6 py-4 shadow-sm border border-gray-100">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600"></div>
                <span className="text-gray-700 font-medium">Generating your personalized recipe...</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'recipe' && generatedRecipe && (
          <div className="max-w-4xl mx-auto">
            {generatedRecipe.singleMixRecipe ? (
              <SingleMixRecipeDisplay 
                recipe={generatedRecipe.singleMixRecipe}
                userProfile={userProfile}
                checkInData={checkInData}
                onFindShops={() => { setCurrentStep('shops'); try { localStorage.setItem('generate_currentStep', 'shops'); } catch {} }}
              />
            ) : (
              <div className="text-center text-gray-600">Recipe not available</div>
            )}
          </div>
        )}

        {currentStep === 'recipe' && !generatedRecipe && (
          <div className="max-w-3xl mx-auto text-center py-12">
            <div className="mb-4 text-gray-700">No recipe yet. Let’s start with a quick check‑in.</div>
            <button
              className="px-4 py-2 rounded-md bg-violet-600 text-white"
              onClick={() => { setCurrentStep('checkin'); try { localStorage.setItem('generate_currentStep','checkin'); } catch {} }}
            >
              Go to Check‑in
            </button>
          </div>
        )}

        {currentStep === 'shops' && generatedRecipe && (
          <div className="max-w-4xl mx-auto">
            <ShopMatches 
              matches={generatedRecipe.shopMatches}
              onSelectShop={handleShopSelect}
            />
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
