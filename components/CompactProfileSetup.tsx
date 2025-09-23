'use client';

import React, { useState } from 'react';
import { logEvent } from '@/lib/analytics';
import { CheckCircle, Heart, Brain, Zap, Shield, Target } from 'lucide-react';

interface ProfileData {
  allergies: string[];
  intolerances: string[];
  goals: string[];
}

interface CompactProfileSetupProps {
  onComplete: (data: ProfileData) => void;
  onSkip: () => void;
}

const ALLERGIES = [
  'Nuts', 'Dairy', 'Soy', 'Sesame', 'Coconut', 'Berries', 'Gluten', 'Eggs', 'Shellfish', 'Fish', 'Peanuts', 'Tree Nuts', 'Wheat'
];

const INTOLERANCES = [
  'Lactose', 'FODMAP', 'Histamine', 'Nightshades', 'Citrus', 'High Sugar', 'Caffeine', 'Artificial Sweeteners', 'Food Additives', 'Oxalates', 'Salicylates', 'Sulfites', 'MSG'
];

const HEALTH_GOALS = [
  { id: 'energy', label: 'Energy', icon: Zap, color: 'text-yellow-500', description: 'Boost vitality' },
  { id: 'skin', label: 'Skin Health', icon: Heart, color: 'text-pink-500', description: 'Glowing skin' },
  { id: 'detox', label: 'Detox', icon: Shield, color: 'text-green-500', description: 'Clean system' },
  { id: 'longevity', label: 'Longevity', icon: Target, color: 'text-purple-500', description: 'Live longer' },
  { id: 'focus', label: 'Focus', icon: Brain, color: 'text-blue-500', description: 'Mental clarity' },
  { id: 'immune', label: 'Immune', icon: Shield, color: 'text-orange-500', description: 'Strong immunity' },
  { id: 'weight', label: 'Weight', icon: Target, color: 'text-indigo-500', description: 'Manage weight' }
];

export default function CompactProfileSetup({ onComplete, onSkip }: CompactProfileSetupProps) {
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedIntolerances, setSelectedIntolerances] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const handleToggle = (list: string[], item: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleComplete = () => {
    const profileData: ProfileData = {
      allergies: selectedAllergies,
      intolerances: selectedIntolerances,
      goals: selectedGoals,
    };
    logEvent('Profile_Completed', { profileData });
    onComplete(profileData);
  };

  const handleSkip = () => {
    logEvent('Profile_Skipped_Completely');
    onSkip();
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Health Profile</h2>
        <p className="text-gray-600">Help us personalize your smoothie recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Allergies */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Allergies</h3>
          <div className="space-y-2">
            {ALLERGIES.map((allergy) => (
              <button
                key={allergy}
                onClick={() => handleToggle(selectedAllergies, allergy, setSelectedAllergies)}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedAllergies.includes(allergy)
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAllergies.includes(allergy)
                      ? 'border-red-500 bg-red-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAllergies.includes(allergy) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{allergy}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Intolerances */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Intolerances</h3>
          <div className="space-y-2">
            {INTOLERANCES.map((intolerance) => (
              <button
                key={intolerance}
                onClick={() => handleToggle(selectedIntolerances, intolerance, setSelectedIntolerances)}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedIntolerances.includes(intolerance)
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-yellow-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedIntolerances.includes(intolerance)
                      ? 'border-yellow-500 bg-yellow-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedIntolerances.includes(intolerance) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{intolerance}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Health Goals */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Health Goals</h3>
          <div className="space-y-2">
            {HEALTH_GOALS.map((goal) => (
              <button
                key={goal.id}
                onClick={() => handleToggle(selectedGoals, goal.id, setSelectedGoals)}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedGoals.includes(goal.id)
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-violet-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedGoals.includes(goal.id)
                      ? 'border-violet-500 bg-violet-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedGoals.includes(goal.id) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-medium text-gray-900">{goal.label}</span>
                    <p className="text-xs text-gray-600">{goal.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={handleComplete}
          className="px-8 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
        >
          Complete Profile
        </button>
        <button
          onClick={handleSkip}
          className="px-6 py-3 rounded-lg bg-transparent text-gray-500 hover:text-gray-700 transition-colors font-medium"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}
