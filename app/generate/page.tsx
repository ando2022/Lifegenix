'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, Mood, GeneratedRecipe } from '@/lib/types';
import { useAnalytics, useEngagementTracking } from '@/hooks/useAnalytics';
import { SingleMixRecipeGenerator } from '@/lib/single-mix-recipe-generator';
import { ShopMatcher } from '@/lib/shop-matcher';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OnboardingForm from '@/components/OnboardingForm';
import MoodSelector from '@/components/MoodSelector';
import SingleMixRecipeDisplay from '@/components/SingleMixRecipeDisplay';
import ShopMatches from '@/components/ShopMatches';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Save, ChefHat } from 'lucide-react';

export default function GeneratePage() {
  const [currentStep, setCurrentStep] = useState<'onboarding' | 'mood' | 'recipe' | 'shops'>('onboarding');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>(undefined);
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const recipeGenerator = new SingleMixRecipeGenerator();
  const shopMatcher = new ShopMatcher();
  const { trackRecipeGeneration, trackShopInteraction } = useAnalytics();
  
  // Track user engagement on this page
  useEngagementTracking();
  
  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Redirect to sign in if not authenticated
      if (!user) {
        router.push('/auth/signin?redirect=/generate');
      }
    };
    
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        router.push('/auth/signin?redirect=/generate');
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentStep('mood');
  };

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    
    if (userProfile) {
      setIsGenerating(true);
      
      // Simulate API call delay
      setTimeout(async () => {
        const goal = mood.recommendedGoals[0] || 'energy-boost';
        const recipe = recipeGenerator.generateRecipe(userProfile, mood, goal);
        const shopMatches = shopMatcher.findMatches(recipe.recipe);
        
        const finalRecipe = {
          ...recipe,
          shopMatches
        };
        
        setGeneratedRecipe(finalRecipe);
        
        // Track recipe generation
        if (finalRecipe.singleMixRecipe) {
          await trackRecipeGeneration(userProfile, mood, finalRecipe.singleMixRecipe);
        }
        
        // Auto-save smoothie for authenticated users
        if (user) {
          await saveSmoothie(finalRecipe, mood);
        }
        
        setIsGenerating(false);
        setCurrentStep('recipe');
      }, 2000);
    }
  };

  const handleShopSelect = (match: any) => {
    // Handle shop selection and order placement
    console.log('Selected shop:', match);
    // In a real app, this would redirect to order confirmation or payment
  };

  const saveSmoothie = async (recipe: GeneratedRecipe, mood: Mood) => {
    if (!user || isSaved) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/smoothies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${mood.name} Smoothie - ${new Date().toLocaleDateString()}`,
          recipe: recipe.singleMixRecipe || recipe.recipe,
          mood,
          userProfile,
          goals: userProfile?.goals || [],
          totalNutrition: recipe.singleMixRecipe?.totalNutrition || recipe.recipe.totalNutrition,
          cost: recipe.price
        })
      });
      
      if (response.ok) {
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving smoothie:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const resetFlow = () => {
    setCurrentStep('onboarding');
    setUserProfile(null);
    setSelectedMood(undefined);
    setGeneratedRecipe(null);
    setIsSaved(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'onboarding' ? 'bg-teal-600 text-white' : 
              ['mood', 'recipe', 'shops'].includes(currentStep) ? 'bg-teal-100 text-teal-600' : 
              'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${
              ['mood', 'recipe', 'shops'].includes(currentStep) ? 'bg-teal-600' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'mood' ? 'bg-teal-600 text-white' : 
              ['recipe', 'shops'].includes(currentStep) ? 'bg-teal-100 text-teal-600' : 
              'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${
              ['recipe', 'shops'].includes(currentStep) ? 'bg-teal-600' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'recipe' ? 'bg-teal-600 text-white' : 
              currentStep === 'shops' ? 'bg-teal-100 text-teal-600' : 
              'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <div className={`w-16 h-1 ${
              currentStep === 'shops' ? 'bg-teal-600' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'shops' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              4
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-gray-600">
              {currentStep === 'onboarding' && 'Profile Setup'}
              {currentStep === 'mood' && 'Mood Selection'}
              {currentStep === 'recipe' && 'Recipe Generated'}
              {currentStep === 'shops' && 'Shop Selection'}
            </span>
          </div>
        </div>

        {/* Content */}
        {currentStep === 'onboarding' && (
          <OnboardingForm onComplete={handleOnboardingComplete} />
        )}

        {currentStep === 'mood' && (
          <div className="max-w-4xl mx-auto">
            <MoodSelector 
              onMoodSelect={handleMoodSelect}
              selectedMood={selectedMood}
            />
            
            {isGenerating && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-3 bg-white rounded-lg px-6 py-4 shadow-sm border border-gray-100">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                  <span className="text-gray-700 font-medium">Generating your personalized recipe...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 'recipe' && generatedRecipe && (
          <div className="max-w-4xl mx-auto">
            {/* Save notification for authenticated users */}
            {user && isSaved && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Save className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-green-800 font-medium">Smoothie saved to your dashboard!</p>
                      <p className="text-green-600 text-sm">You can view it anytime in your collection</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/dashboard')}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    View in Dashboard
                  </Button>
                </div>
              </div>
            )}
            
            {generatedRecipe.singleMixRecipe ? (
              <SingleMixRecipeDisplay recipe={generatedRecipe.singleMixRecipe} />
            ) : (
              <div className="text-center text-gray-600">Recipe not available</div>
            )}
            
            <div className="mt-8 text-center">
              <button
                onClick={() => setCurrentStep('shops')}
                className="btn-primary text-lg px-8 py-4"
              >
                Find Nearby Shops
              </button>
            </div>
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

        {/* Reset Button */}
        {currentStep !== 'onboarding' && (
          <div className="mt-12 text-center">
            <button
              onClick={resetFlow}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Start Over
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
