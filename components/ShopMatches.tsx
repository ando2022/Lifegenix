'use client';

import { ShopMatch } from '@/lib/types';
import { MapPin, Clock, Star, CheckCircle, AlertCircle } from 'lucide-react';

interface ShopMatchesProps {
  matches: ShopMatch[];
  onSelectShop: (match: ShopMatch) => void;
}

export default function ShopMatches({ matches, onSelectShop }: ShopMatchesProps) {
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
        <p className="text-gray-600">Find the best shops to make your personalized smoothie</p>
      </div>

      <div className="space-y-4">
        {matches.map((match, index) => (
          <ShopMatchCard key={match.shop.id} match={match} onSelect={onSelectShop} />
        ))}
      </div>
    </div>
  );
}

function ShopMatchCard({ match, onSelect }: { match: ShopMatch; onSelect: (match: ShopMatch) => void }) {
  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Partial Match';
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{match.shop.name}</h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{match.shop.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{match.shop.address}</span>
            </div>
            {match.shop.distance && (
              <span>{match.shop.distance} km away</span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(match.matchScore)}`}>
            {match.matchScore}% {getMatchLabel(match.matchScore)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-teal-600">CHF {match.estimatedPrice}</div>
          <div className="text-xs text-gray-600">estimated price</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-teal-600">{match.prepTime} min</div>
          <div className="text-xs text-gray-600">prep time</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-teal-600">{match.shop.capabilities.canMakeLayered ? 'Yes' : 'No'}</div>
          <div className="text-xs text-gray-600">layered smoothies</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-teal-600">{match.shop.capabilities.prepTime} min</div>
          <div className="text-xs text-gray-600">base prep time</div>
        </div>
      </div>

      {/* Missing Ingredients */}
      {match.missingIngredients.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 text-orange-500 mr-2" />
            Missing Ingredients
          </h4>
          <div className="flex flex-wrap gap-2">
            {match.missingIngredients.map((ingredient, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Swaps */}
      {match.suggestedSwaps.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Suggested Swaps
          </h4>
          <div className="space-y-1">
            {match.suggestedSwaps.map((swap, index) => (
              <div key={index} className="text-sm text-gray-600">
                {swap}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={() => onSelect(match)}
          className="flex-1 btn-primary"
        >
          Order from {match.shop.name}
        </button>
        <button className="btn-secondary">
          View Menu
        </button>
      </div>
    </div>
  );
}
