'use client';

import { useState, useEffect } from 'react';
import { UserProfile, ShopRecommendation, RecipeRecommendation, SubscriptionPlan } from '@/lib/types';
import { RecommendationEngine } from '@/lib/recommendation-engine';
import { shops } from '@/data/shops';
import { MapPin, Clock, DollarSign, Star, Plus, ShoppingCart, Calendar, Heart } from 'lucide-react';

export default function ResultsPage() {
  const [selectedPath, setSelectedPath] = useState<'shop' | 'recipe' | 'subscription' | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Try to get user profile from localStorage or create a default one
    const savedProfile = localStorage.getItem('userProfile');
    let profile: UserProfile;
    
    if (savedProfile) {
      profile = JSON.parse(savedProfile);
    } else {
      // Create a default profile for demonstration
      profile = {
        id: 'demo-user',
        name: 'Demo User',
        gender: 'other',
        age: 30,
        location: {
          city: 'Zurich',
          coordinates: { lat: 47.3769, lng: 8.5417 }
        },
        allergies: [],
        intolerances: [],
        diet: 'none',
        goals: ['energy-boost', 'longevity'],
        dislikes: [],
        sweetnessTolerance: 'medium',
        texturePreference: 'single-blend',
        budget: 'premium',
        timeOfDay: 'morning',
        activityLevel: 'moderate',
        flavorPreferences: {
          sweet: 6,
          sour: 4,
          bitter: 3,
          umami: 5
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    
    setUserProfile(profile);
    
    // Generate recommendations
    const results = RecommendationEngine.generateRecommendations(profile, shops);
    setRecommendations(results);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error generating recommendations. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Personalized Recommendations
          </h1>
          <p className="text-gray-600">
            Based on your health goals and preferences, here are your best options
          </p>
        </div>

        {/* Path Selection */}
        {!selectedPath && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <PathCard
              title="Shop Recommendations"
              description="Find nearby shops with smoothies that match your goals"
              icon={<MapPin className="w-8 h-8" />}
              onClick={() => setSelectedPath('shop')}
              stats={`${recommendations.shopRecommendations.length} shops found`}
              color="blue"
            />
            <PathCard
              title="Recipe Generation"
              description="Create personalized recipes for home preparation"
              icon={<Heart className="w-8 h-8" />}
              onClick={() => setSelectedPath('recipe')}
              stats="Custom single-mix recipes"
              color="green"
            />
            <PathCard
              title="Subscription Service"
              description="Weekly smoothie delivery from partner shops"
              icon={<Calendar className="w-8 h-8" />}
              onClick={() => setSelectedPath('subscription')}
              stats="3 plans available"
              color="purple"
            />
          </div>
        )}

        {/* Back Button */}
        {selectedPath && (
          <button
            onClick={() => setSelectedPath(null)}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-800"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all options
          </button>
        )}

        {/* Shop Recommendations */}
        {selectedPath === 'shop' && (
          <ShopRecommendationsSection recommendations={recommendations.shopRecommendations} />
        )}

        {/* Recipe Recommendations */}
        {selectedPath === 'recipe' && (
          <RecipeRecommendationsSection recommendations={recommendations.recipeRecommendations} />
        )}

        {/* Subscription Plans */}
        {selectedPath === 'subscription' && (
          <SubscriptionPlansSection plans={recommendations.subscriptionPlans} />
        )}
      </div>
    </div>
  );
}

function PathCard({ title, description, icon, onClick, stats, color }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  stats: string;
  color: 'blue' | 'green' | 'purple';
}) {
  const colorClasses = {
    blue: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50',
    green: 'border-green-200 hover:border-green-300 hover:bg-green-50',
    purple: 'border-purple-200 hover:border-purple-300 hover:bg-purple-50'
  };

  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600'
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-6 border-2 rounded-xl text-left transition-all ${colorClasses[color]}`}
    >
      <div className={`${iconColors[color]} mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <p className="text-sm font-medium text-gray-500">{stats}</p>
    </button>
  );
}

function ShopRecommendationsSection({ recommendations }: { recommendations: ShopRecommendation[] }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop Recommendations</h2>
        <p className="text-gray-600">Nearby shops with smoothies that match your goals</p>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No compatible shops found in your area.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <ShopCard key={index} recommendation={rec} />
          ))}
        </div>
      )}
    </div>
  );
}

function ShopCard({ recommendation }: { recommendation: ShopRecommendation }) {
  const [selectedSmoothie, setSelectedSmoothie] = useState(0);
  const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>([]);

  const toggleEnhancement = (enhancementId: string) => {
    setSelectedEnhancements(prev => 
      prev.includes(enhancementId) 
        ? prev.filter(id => id !== enhancementId)
        : [...prev, enhancementId]
    );
  };

  const calculateTotalCost = () => {
    const smoothieCost = recommendation.compatibleSmoothies[selectedSmoothie]?.price || 0;
    const enhancementCost = selectedEnhancements.reduce((total, id) => {
      const enhancement = recommendation.enhancements.find(e => e.id === id);
      return total + (enhancement?.cost || 0);
    }, 0);
    return smoothieCost + enhancementCost;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{recommendation.shop.name}</h3>
          <p className="text-gray-600 flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {recommendation.shop.address}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center text-yellow-500 mb-1">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm font-medium">{recommendation.shop.rating}</span>
          </div>
          <p className="text-sm text-gray-500">{recommendation.matchScore}% match</p>
        </div>
      </div>

      {/* Compatible Smoothies */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Compatible Smoothies</h4>
        <div className="grid gap-3">
          {recommendation.compatibleSmoothies.map((smoothie, index) => (
            <button
              key={index}
              onClick={() => setSelectedSmoothie(index)}
              className={`p-3 border-2 rounded-lg text-left transition-all ${
                selectedSmoothie === index
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-gray-900">{smoothie.name}</h5>
                  <p className="text-sm text-gray-600">{smoothie.ingredients.join(', ')}</p>
                </div>
                <span className="font-semibold text-teal-600">CHF {smoothie.price}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Enhancements */}
      {recommendation.enhancements.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Available Enhancements</h4>
          <div className="grid grid-cols-2 gap-3">
            {recommendation.enhancements.map((enhancement) => (
              <button
                key={enhancement.id}
                onClick={() => toggleEnhancement(enhancement.id)}
                className={`p-3 border-2 rounded-lg text-left transition-all ${
                  selectedEnhancements.includes(enhancement.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-gray-900">{enhancement.name}</h5>
                    <p className="text-sm text-gray-600">{enhancement.description}</p>
                  </div>
                  <span className="font-semibold text-blue-600">+CHF {enhancement.cost}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Health Impact */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Health Impact</h4>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(recommendation.healthImpact).map(([goal, score]) => (
            <div key={goal} className="text-center">
              <div className="text-2xl font-bold text-teal-600">{score}</div>
              <div className="text-xs text-gray-500 capitalize">{goal.replace('-', ' ')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-xl font-bold text-gray-900">CHF {calculateTotalCost()}</p>
        </div>
        <button className="btn-primary flex items-center">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Order Now
        </button>
      </div>
    </div>
  );
}

function RecipeRecommendationsSection({ recommendations }: { recommendations: RecipeRecommendation[] }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personalized Recipes</h2>
        <p className="text-gray-600">Custom recipes optimized for your health goals</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Recipe Generation</h3>
          <p className="text-gray-600 mb-6">
            Generate personalized single-mix longevity smoothie recipes based on your profile.
          </p>
          <button className="btn-primary">
            Generate Recipe (CHF 5)
          </button>
        </div>
      </div>
    </div>
  );
}

function SubscriptionPlansSection({ plans }: { plans: SubscriptionPlan[] }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Plans</h2>
        <p className="text-gray-600">Weekly smoothie delivery from partner shops</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-teal-600 mb-1">CHF {plan.price}</div>
              <p className="text-sm text-gray-500">per week</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {plan.smoothiesPerWeek} smoothies per week
              </div>
              {plan.includes.map((item, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <Plus className="w-4 h-4 mr-2" />
                  {item}
                </div>
              ))}
            </div>

            <button className="w-full btn-primary">
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

