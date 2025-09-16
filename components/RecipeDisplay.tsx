'use client';

import { Recipe, RecipeLayer } from '@/lib/types';
import { Clock, Users, DollarSign, Zap } from 'lucide-react';

interface RecipeDisplayProps {
  recipe: Recipe;
}

export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Recipe Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h2>
        <p className="text-gray-600">Scientifically optimized for your health goals</p>
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
          <div className="text-2xl font-bold text-gray-900">CHF {recipe.cost}</div>
          <div className="text-sm text-gray-600">total cost</div>
        </div>
      </div>

      {/* Layers */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Recipe Layers</h3>
        {recipe.layers.map((layer, index) => (
          <LayerCard key={layer.id} layer={layer} index={index + 1} />
        ))}
      </div>

      {/* Nutrition Info */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Nutritional Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Longevity Compounds</h4>
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
    </div>
  );
}

function LayerCard({ layer, index }: { layer: RecipeLayer; index: number }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center space-x-4 mb-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: layer.color }}
        >
          {index}
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{layer.name}</h4>
          <p className="text-sm text-gray-600 capitalize">{layer.type} layer • {layer.thickness}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="font-medium text-gray-900 mb-2">Ingredients:</h5>
          <div className="space-y-1">
            {layer.ingredients.map((ingredient, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{ingredient.ingredient.name}</span>
                <span className="font-medium text-gray-900">
                  {ingredient.amount} {ingredient.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-medium text-gray-900 mb-2">Instructions:</h5>
          <p className="text-sm text-gray-600">{layer.instructions}</p>
        </div>
      </div>
    </div>
  );
}
