'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Zap, Brain, Heart, Sparkles, ArrowRight } from 'lucide-react';

// Michelin-star quality instant recipes
const INSTANT_RECIPES = {
  energy: {
    id: 'energy-boost-premium',
    name: 'Golden Energy Elixir',
    description: 'Mango, turmeric, ginger, coconut water, chia seeds',
    ingredients: [
      { name: 'Frozen Mango', amount: '150g', purpose: 'base' },
      { name: 'Fresh Turmeric', amount: '3g', purpose: 'superfood' },
      { name: 'Fresh Ginger', amount: '2g', purpose: 'flavor' },
      { name: 'Coconut Water', amount: '200ml', purpose: 'liquid' },
      { name: 'Chia Seeds', amount: '10g', purpose: 'superfood' },
      { name: 'Raw Honey', amount: '8ml', purpose: 'sweetener' }
    ],
    cost: 11.50,
    color: '#f59e0b',
    benefits: ['Natural caffeine alternative', 'Anti-inflammatory', 'Sustained energy'],
    instructions: [
      'Add coconut water and honey to blender',
      'Add fresh ginger and turmeric (grate if whole)',
      'Add frozen mango and chia seeds',
      'Blend on high for 90 seconds until silky smooth',
      'Let sit 2 minutes for chia to hydrate',
      'Serve immediately in chilled glass'
    ]
  },
  focus: {
    id: 'brain-boost-premium',
    name: 'Cognitive Clarity Blend',
    description: 'Blueberries, matcha, almond butter, oat milk, walnuts',
    ingredients: [
      { name: 'Frozen Blueberries', amount: '120g', purpose: 'base' },
      { name: 'Ceremonial Matcha', amount: '2g', purpose: 'superfood' },
      { name: 'Almond Butter', amount: '15g', purpose: 'protein' },
      { name: 'Oat Milk', amount: '180ml', purpose: 'liquid' },
      { name: 'Walnuts', amount: '12g', purpose: 'superfood' },
      { name: 'Maple Syrup', amount: '8ml', purpose: 'sweetener' }
    ],
    cost: 13.20,
    color: '#7c3aed',
    benefits: ['Enhanced focus', 'Omega-3 for brain health', 'Antioxidant powerhouse'],
    instructions: [
      'Soak walnuts in oat milk for 5 minutes',
      'Add maple syrup and matcha powder',
      'Add almond butter and blend until smooth',
      'Add frozen blueberries last',
      'Blend until creamy and uniform',
      'Strain if desired for ultra-smooth texture'
    ]
  },
  calm: {
    id: 'zen-calm-premium',
    name: 'Lavender Zen Smoothie',
    description: 'Banana, lavender, cashews, coconut milk, vanilla',
    ingredients: [
      { name: 'Frozen Banana', amount: '140g', purpose: 'base' },
      { name: 'Dried Lavender', amount: '1g', purpose: 'flavor' },
      { name: 'Cashews', amount: '20g', purpose: 'protein' },
      { name: 'Coconut Milk', amount: '160ml', purpose: 'liquid' },
      { name: 'Vanilla Bean', amount: '0.5g', purpose: 'flavor' },
      { name: 'Agave Syrup', amount: '6ml', purpose: 'sweetener' }
    ],
    cost: 12.80,
    color: '#a855f7',
    benefits: ['Natural relaxation', 'Magnesium for calm', 'Creamy indulgence'],
    instructions: [
      'Soak cashews in warm water for 10 minutes',
      'Infuse coconut milk with lavender for 5 minutes, strain',
      'Blend cashews with infused milk until silky',
      'Add vanilla bean and agave syrup',
      'Add frozen banana and blend until creamy',
      'Garnish with a tiny lavender sprig'
    ]
  },
  glow: {
    id: 'beauty-glow-premium',
    name: 'Radiance Rose Smoothie',
    description: 'Strawberries, rose water, collagen, coconut yogurt, pink pitaya',
    ingredients: [
      { name: 'Frozen Strawberries', amount: '130g', purpose: 'base' },
      { name: 'Rose Water', amount: '15ml', purpose: 'flavor' },
      { name: 'Collagen Peptides', amount: '12g', purpose: 'protein' },
      { name: 'Coconut Yogurt', amount: '100g', purpose: 'protein' },
      { name: 'Pink Pitaya', amount: '30g', purpose: 'superfood' },
      { name: 'Raw Honey', amount: '10ml', purpose: 'sweetener' }
    ],
    cost: 14.90,
    color: '#ec4899',
    benefits: ['Skin radiance', 'Collagen boost', 'Antioxidant rich'],
    instructions: [
      'Blend coconut yogurt with rose water',
      'Add collagen peptides and honey',
      'Add frozen strawberries and pitaya',
      'Blend until smooth and vibrant pink',
      'Serve in a beautiful glass',
      'Top with edible rose petals if available'
    ]
  }
};

const MOOD_OPTIONS = [
  {
    id: 'energy',
    title: 'Energy Boost',
    subtitle: 'Power through your day',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    description: 'Natural energy without the crash'
  },
  {
    id: 'focus',
    title: 'Mental Clarity',
    subtitle: 'Sharp focus & concentration',
    icon: Brain,
    color: 'from-purple-400 to-blue-500',
    description: 'Brain-boosting nutrients for peak performance'
  },
  {
    id: 'calm',
    title: 'Stress Relief',
    subtitle: 'Find your zen moment',
    icon: Heart,
    color: 'from-pink-400 to-purple-500',
    description: 'Calming ingredients for relaxation'
  },
  {
    id: 'glow',
    title: 'Beauty Boost',
    subtitle: 'Radiant skin & vitality',
    icon: Sparkles,
    color: 'from-rose-400 to-pink-500',
    description: 'Collagen and antioxidants for inner glow'
  }
];

export default function QuickSmoothiePage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [showRecipe, setShowRecipe] = useState(false);
  const [step, setStep] = useState<'mood' | 'allergies' | 'recipe'>('mood');
  
  const router = useRouter();
  const { trackCustomEvent, trackConversion } = useAnalytics();

  const handleMoodSelect = async (moodId: string) => {
    setSelectedMood(moodId);
    const recipe = INSTANT_RECIPES[moodId as keyof typeof INSTANT_RECIPES];
    setSelectedRecipe(recipe);
    
    await trackCustomEvent('mood_selected', {
      mood: moodId,
      recipe_id: recipe.id,
      recipe_name: recipe.name
    });
    
    setStep('allergies');
  };

  const handleAllergyToggle = (allergy: string) => {
    setAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const generateRecipe = async () => {
    await trackCustomEvent('instant_recipe_generated', {
      mood: selectedMood,
      recipe_id: selectedRecipe.id,
      allergies: allergies,
      cost: selectedRecipe.cost
    });
    
    setStep('recipe');
    setShowRecipe(true);
  };

  const handlePayForRecipe = async () => {
    await trackConversion('recipe_purchase', selectedRecipe.cost, {
      recipe_id: selectedRecipe.id,
      recipe_name: selectedRecipe.name,
      mood: selectedMood,
      purchase_type: 'instant_recipe'
    });
    
    // In a real app, integrate with Stripe here
    alert(`Recipe purchased for CHF ${selectedRecipe.cost}! Check your email for details.`);
  };

  const handleGetMoreRecipes = () => {
    router.push('/generate?source=quick_smoothie');
  };

  if (step === 'mood') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-mint-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Perfect Smoothie in 
              <span className="text-gradient"> 30 Seconds</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Skip the questionnaire. Get Michelin-star quality smoothie recipes instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOOD_OPTIONS.map((mood) => {
              const IconComponent = mood.icon;
              return (
                <Card 
                  key={mood.id}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                  onClick={() => handleMoodSelect(mood.id)}
                >
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${mood.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{mood.title}</h3>
                    <p className="text-lg text-gray-600 mb-3">{mood.subtitle}</p>
                    <p className="text-sm text-gray-500">{mood.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">Want more personalized options?</p>
            <Button 
              variant="outline" 
              onClick={() => router.push('/generate')}
              className="text-teal-600 border-teal-600 hover:bg-teal-50"
            >
              Create Full Profile Instead
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'allergies') {
    const allergyOptions = ['None', 'Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs'];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-mint-50">
        <Header />
        
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Quick Safety Check</h1>
            <p className="text-lg text-gray-600">Any ingredients we should avoid?</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {allergyOptions.map((allergy) => (
                  <Button
                    key={allergy}
                    variant={allergies.includes(allergy) ? "default" : "outline"}
                    onClick={() => handleAllergyToggle(allergy)}
                    className="h-16 text-lg"
                  >
                    {allergy}
                  </Button>
                ))}
              </div>

              <div className="text-center">
                <Button 
                  onClick={generateRecipe}
                  size="lg"
                  className="text-xl px-12 py-4"
                >
                  Generate My Perfect Smoothie
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'recipe' && selectedRecipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-mint-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Perfect Match!
            </h1>
            <p className="text-lg text-gray-600">Michelin-star quality, personalized for you</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recipe Display */}
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div 
                    className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: selectedRecipe.color }}
                  >
                    <span className="text-3xl">🥤</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedRecipe.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{selectedRecipe.description}</p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span>⏱️ 3 min prep</span>
                    <span>💰 CHF {selectedRecipe.cost}</span>
                    <span>⭐ Premium quality</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Benefits:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.benefits.map((benefit: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients & Instructions */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Exact Ingredients
                </h3>
                <div className="space-y-3 mb-6">
                  {selectedRecipe.ingredients.map((ingredient: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">{ingredient.name}</span>
                      <span className="font-medium text-gray-900">{ingredient.amount}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    <strong>🔒 Premium Recipe:</strong> Detailed instructions and pro tips available after purchase
                  </p>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={handlePayForRecipe}
                    className="w-full text-lg py-4"
                    size="lg"
                  >
                    Get Complete Recipe - CHF {selectedRecipe.cost}
                  </Button>
                  
                  <Button 
                    onClick={handleGetMoreRecipes}
                    variant="outline"
                    className="w-full"
                  >
                    Get 3 More Personalized Recipes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-teal-600 to-mint-500">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Love this? Get unlimited access
                </h3>
                <p className="text-teal-100 mb-6">
                  Create your profile for personalized recipes, nearby shop recommendations, and exclusive blends
                </p>
                <Button 
                  onClick={handleGetMoreRecipes}
                  className="bg-white text-teal-600 hover:bg-gray-50"
                  size="lg"
                >
                  Create My Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
