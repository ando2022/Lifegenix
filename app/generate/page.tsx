'use client';

import { useState } from 'react';
import { UserProfile, Mood, GeneratedRecipe } from '@/lib/types';
import { RecipeGenerator } from '@/lib/recipe-generator';
import { ShopMatcher } from '@/lib/shop-matcher';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OnboardingForm from '@/components/OnboardingForm';
import MoodSelector from '@/components/MoodSelector';
import RecipeDisplay from '@/components/RecipeDisplay';
import ShopMatches from '@/components/ShopMatches';

export default function GeneratePage() {
  const [currentStep, setCurrentStep] = useState<'onboarding' | 'mood' | 'recipe' | 'shops'>('onboarding');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const recipeGenerator = new RecipeGenerator();
  const shopMatcher = new ShopMatcher();

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentStep('mood');
  };

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    
    if (userProfile) {
      setIsGenerating(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const goal = mood.recommendedGoals[0] || 'energy-boost';
        const recipe = recipeGenerator.generateRecipe(userProfile, mood, goal);
        const shopMatches = shopMatcher.findMatches(recipe.recipe);
        
        setGeneratedRecipe({
          ...recipe,
          shopMatches
        });
        
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

  const resetFlow = () => {
    setCurrentStep('onboarding');
    setUserProfile(null);
    setSelectedMood(null);
    setGeneratedRecipe(null);
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
            <RecipeDisplay recipe={generatedRecipe.recipe} />
            
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
