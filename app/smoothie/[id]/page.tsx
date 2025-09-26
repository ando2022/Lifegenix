'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Clock, DollarSign, Target, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SavedSmoothie {
  id: string;
  name: string;
  recipe: any;
  mood: any;
  goals: string[];
  createdAt: string;
  totalNutrition: any;
  cost: string | number;
  isFavorite: string;
}

export default function SmoothieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [smoothie, setSmoothie] = useState<SavedSmoothie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const loadSmoothie = async () => {
      try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/signin');
          return;
        }

        // Fetch the specific smoothie
        const response = await fetch(`/api/smoothies?id=${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Smoothie not found');
          } else {
            setError('Failed to load smoothie');
          }
          return;
        }

        const data = await response.json();
        setSmoothie(data.smoothie);
      } catch (error) {
        console.error('Error loading smoothie:', error);
        setError('An error occurred while loading the smoothie');
      } finally {
        setLoading(false);
      }
    };

    loadSmoothie();
  }, [params.id, router, supabase.auth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading smoothie details...</p>
        </div>
      </div>
    );
  }

  if (error || !smoothie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error || 'Smoothie not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const recipe = smoothie.recipe;

  // Handle different recipe structures (layered vs single mix)
  const ingredients = recipe.ingredients || [];
  const instructions = recipe.instructions || [];
  const nutritionInfo = recipe.totalNutrition || recipe.nutritionInfo || {};
  const benefits = recipe.benefits || [];
  const tips = recipe.tips || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {smoothie.name}
              </h1>
              <p className="text-gray-600">{recipe.description || recipe.name || 'Custom Smoothie Recipe'}</p>

              <div className="flex gap-2 mt-3">
                {smoothie.goals.map((goal, index) => (
                  <Badge key={index} variant="secondary">
                    <Target className="mr-1 h-3 w-3" />
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>

            {smoothie.isFavorite === 'true' && (
              <Heart className="h-6 w-6 text-red-500 fill-current" />
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Prep Time</p>
                <p className="font-semibold">{recipe.prepTime || '5-10 mins'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center">
              <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Est. Cost</p>
                <p className="font-semibold">${smoothie.cost || recipe.estimatedCost || recipe.price || '0.00'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center">
              <Zap className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Calories</p>
                <p className="font-semibold">{nutritionInfo.calories || nutritionInfo.totalCalories || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ingredients */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
            <CardDescription>Serves {recipe.servings || 1}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ingredients.length > 0 ? ingredients.map((ingredient, index) => {
                const ing = ingredient.ingredient || ingredient;
                return (
                  <div key={index} className="flex justify-between items-start border-b pb-2 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{ing.name || ing.item || ingredient.item || ingredient}</p>
                      {(ing.notes || ingredient.notes) && (
                        <p className="text-sm text-gray-500">{ing.notes || ingredient.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{ingredient.amount || ing.amount || ''}</p>
                      <p className="text-xs text-gray-500">{ing.category || ingredient.category || ''}</p>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-gray-500">No ingredients listed</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {instructions.length > 0 ? instructions.map((instruction, index) => (
                <li key={index} className="flex">
                  <span className="font-bold text-teal-600 mr-3">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              )) : (
                <li className="flex">
                  <span className="font-bold text-teal-600 mr-3">1.</span>
                  <span>Add all ingredients to blender</span>
                </li>
              )}
            </ol>
          </CardContent>
        </Card>

        {/* Nutrition Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nutrition Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Calories</p>
                <p className="font-semibold">{nutritionInfo.calories || nutritionInfo.totalCalories || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Protein</p>
                <p className="font-semibold">{nutritionInfo.protein || nutritionInfo.totalProtein || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Carbs</p>
                <p className="font-semibold">{nutritionInfo.carbs || nutritionInfo.totalCarbs || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fiber</p>
                <p className="font-semibold">{nutritionInfo.fiber || nutritionInfo.totalFiber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sugar</p>
                <p className="font-semibold">{nutritionInfo.sugar || nutritionInfo.totalSugar || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fat</p>
                <p className="font-semibold">{nutritionInfo.fat || nutritionInfo.totalFat || 'N/A'}</p>
              </div>
            </div>

            {nutritionInfo.vitamins && nutritionInfo.vitamins.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Key Vitamins & Minerals</p>
                <div className="flex flex-wrap gap-2">
                  {nutritionInfo.vitamins.map((vitamin, index) => (
                    <Badge key={index} variant="outline">{vitamin}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Benefits */}
        {benefits.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Health Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        {tips.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-500 mr-2">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          Created on {new Date(smoothie.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
}