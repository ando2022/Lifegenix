'use client';

import { useState } from 'react';
import { CheckCircle, X, Heart, Brain, Zap, Shield, Target } from 'lucide-react';
import { logEvent } from '@/lib/analytics';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
  onSkip: () => void;
}

interface UserProfile {
  allergies: string[];
  intolerances: string[];
  goals: string[];
}

const ALLERGIES = [
  'Nuts', 'Dairy', 'Soy', 'Sesame', 'Coconut', 'Berries'
];

const INTOLERANCES = [
  'Lactose', 'FODMAP', 'Histamine', 'Nightshades', 'Citrus', 'High Sugar'
];

const HEALTH_GOALS = [
  { id: 'energy', label: 'Energy Boost', icon: Zap, color: 'text-yellow-500' },
  { id: 'skin', label: 'Skin Health', icon: Heart, color: 'text-pink-500' },
  { id: 'detox', label: 'Detox & Cleanse', icon: Shield, color: 'text-green-500' },
  { id: 'longevity', label: 'Longevity', icon: Target, color: 'text-purple-500' },
  { id: 'focus', label: 'Mental Focus', icon: Brain, color: 'text-blue-500' }
];

export default function ProfileSetup({ onComplete, onSkip }: ProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    allergies: [],
    intolerances: [],
    goals: []
  });

  const handleAllergyToggle = (allergy: string) => {
    setProfile(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const handleIntoleranceToggle = (intolerance: string) => {
    setProfile(prev => ({
      ...prev,
      intolerances: prev.intolerances.includes(intolerance)
        ? prev.intolerances.filter(i => i !== intolerance)
        : [...prev.intolerances, intolerance]
    }));
  };

  const handleGoalToggle = (goalId: string) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      logEvent('Profile_Allergies_Selected', { count: profile.allergies.length });
      setStep(2);
    } else if (step === 2) {
      logEvent('Profile_Intolerances_Selected', { count: profile.intolerances.length });
      setStep(3);
    } else if (step === 3) {
      logEvent('Profile_Goals_Selected', { goals: profile.goals });
      logEvent('Profile_Completed', { 
        allergies: profile.allergies.length,
        intolerances: profile.intolerances.length,
        goals: profile.goals.length
      });
      onComplete(profile);
    }
  };

  const handleSkip = () => {
    logEvent('Profile_Skipped', { step });
    onSkip();
  };

  const canProceed = () => {
    if (step === 1) return true; // Allergies are optional
    if (step === 2) return true; // Intolerances are optional
    if (step === 3) return profile.goals.length > 0; // At least one goal required
    return false;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNum <= step 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {stepNum < step ? <CheckCircle className="w-4 h-4" /> : stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  stepNum < step ? 'bg-violet-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Allergies */}
      {step === 1 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Any allergies?</h2>
          <p className="text-gray-600 mb-8">We'll make sure to avoid these ingredients</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {ALLERGIES.map((allergy) => (
              <button
                key={allergy}
                onClick={() => handleAllergyToggle(allergy)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  profile.allergies.includes(allergy)
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Intolerances */}
      {step === 2 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Food intolerances?</h2>
          <p className="text-gray-600 mb-8">We'll adjust recipes to avoid these</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {INTOLERANCES.map((intolerance) => (
              <button
                key={intolerance}
                onClick={() => handleIntoleranceToggle(intolerance)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  profile.intolerances.includes(intolerance)
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {intolerance}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Health Goals */}
      {step === 3 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your main goal?</h2>
          <p className="text-gray-600 mb-8">Choose what you want to focus on</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {HEALTH_GOALS.map((goal) => {
              const Icon = goal.icon;
              return (
                <button
                  key={goal.id}
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                    profile.goals.includes(goal.id)
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${goal.color}`} />
                  <span className="font-medium text-gray-900">{goal.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleSkip}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Skip for now
        </button>
        
        {canProceed() && (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {step === 3 ? 'Complete Profile' : 'Continue'}
          </button>
        )}
      </div>
    </div>
  );
}
