'use client';

import { SingleMixRecipe, SingleMixIngredient } from '@/lib/types';
import { Clock, Users, DollarSign, Zap, CheckCircle } from 'lucide-react';

interface SingleMixRecipeDisplayProps {
  recipe: SingleMixRecipe;
}

export default function SingleMixRecipeDisplay({ recipe }: SingleMixRecipeDisplayProps) {
  const groupedIngredients = groupIngredientsByPurpose(recipe.ingredients);

  return (
    <div className="space-y-6">
      {/* Recipe Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h2>
        <p className="text-gray-600">Simple, transparent, and scientifically optimized</p>
      </div>

      {/* Recipe Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
          <Clock className="w-6 h-6 text-teal-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{recipe.prepTime}</div>
          <div className="text-sm text-gray-600">minutes</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
          <Users className="w-6 h-6 text-teal-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{recipe.difficulty}</div>
          <div className="text-sm text-gray-600">difficulty</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
          <DollarSign className="w-6 h-6 text-teal-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">CHF {recipe.cost.toFixed(2)}</div>
          <div className="text-sm text-gray-600">total cost</div>
        </div>
      </div>

      {/* Ingredients with Exact Quantities */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Exact Ingredients <span className="text-sm font-normal text-gray-600">(Full Transparency)</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedIngredients).map(([purpose, ingredients]) => (
            <div key={purpose}>
              <h4 className="font-medium text-gray-900 mb-3 capitalize">
                {purpose === 'base' ? 'Fruits' : 
                 purpose === 'liquid' ? 'Liquid Base' :
                 purpose === 'protein' ? 'Protein' :
                 purpose === 'superfood' ? 'Superfoods' :
                 purpose === 'sweetener' ? 'Natural Sweetener' :
                 'Flavor Enhancer'}
              </h4>
              <div className="space-y-2">
                {ingredients.map((ingredient, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-b-0">
                    <span className="text-gray-700">{ingredient.ingredient.name}</span>
                    <span className="font-medium text-gray-900">
                      {ingredient.amount}{ingredient.unit} 
                      {ingredient.unit === 'g' && ingredient.amount >= 100 && (
                        <span className="text-sm text-gray-500 ml-1">
                          ({Math.round(ingredient.amount/100 * 10)/10} {ingredient.amount >= 100 ? 'cup' : 'tbsp'})
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Simple Instructions</h3>
        <div className="space-y-3">
          {recipe.instructions.map((instruction, index) => (
            <div key={index} className="flex items-start">
              <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-xs font-bold text-teal-600">{index + 1}</span>
              </div>
              <p className="text-gray-700">{instruction}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition Info */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Nutritional Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{Math.round(recipe.totalNutrition.calories)}</div>
            <div className="text-sm text-gray-600">calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{Math.round(recipe.totalNutrition.protein)}g</div>
            <div className="text-sm text-gray-600">protein</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{Math.round(recipe.totalNutrition.carbs)}g</div>
            <div className="text-sm text-gray-600">carbs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{Math.round(recipe.totalNutrition.fat)}g</div>
            <div className="text-sm text-gray-600">fat</div>
          </div>
        </div>
        
        {recipe.totalNutrition.longevityCompounds.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Longevity Compounds</h4>
            <div className="flex flex-wrap gap-2">
              {recipe.totalNutrition.longevityCompounds.map((compound, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {compound.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Why This Recipe Works */}
      <div className="bg-gradient-to-r from-teal-50 to-mint-50 rounded-xl p-6 border border-teal-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Why This Recipe Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900">Full Transparency</h4>
              <p className="text-sm text-gray-600">Every ingredient and quantity shown - no hidden powders or fillers</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900">Taste-First Approach</h4>
              <p className="text-sm text-gray-600">Optimized for flavor and texture, not just nutrition</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900">Simple Preparation</h4>
              <p className="text-sm text-gray-600">One blend, no layers - any café can make this perfectly</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900">Personalized Nutrition</h4>
              <p className="text-sm text-gray-600">Tailored to your specific health goals and dietary needs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function groupIngredientsByPurpose(ingredients: SingleMixIngredient[]): Record<string, SingleMixIngredient[]> {
  return ingredients.reduce((groups, ingredient) => {
    const purpose = ingredient.purpose;
    if (!groups[purpose]) {
      groups[purpose] = [];
    }
    groups[purpose].push(ingredient);
    return groups;
  }, {} as Record<string, SingleMixIngredient[]>);
}
