'use client';

import { useState } from 'react';
import { UserProfile, HealthGoal } from '@/lib/types';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingFormProps {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    allergies: [],
    diet: 'none',
    goals: [],
    dislikes: [],
    sweetnessTolerance: 'medium',
    texturePreference: 'layered'
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      const profile: UserProfile = {
        id: `user-${Date.now()}`,
        ...formData,
        allergies: formData.allergies || [],
        goals: formData.goals || [],
        dislikes: formData.dislikes || [],
        sweetnessTolerance: formData.sweetnessTolerance || 'medium',
        texturePreference: formData.texturePreference || 'layered',
        diet: formData.diet || 'none',
        createdAt: new Date(),
        updatedAt: new Date()
      } as UserProfile;
      
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (updates: Partial<UserProfile>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl p-8 border border-gray-100">
        {currentStep === 1 && <BasicInfoStep formData={formData} updateFormData={updateFormData} />}
        {currentStep === 2 && <AllergiesStep formData={formData} updateFormData={updateFormData} />}
        {currentStep === 3 && <GoalsStep formData={formData} updateFormData={updateFormData} />}
        {currentStep === 4 && <PreferencesStep formData={formData} updateFormData={updateFormData} />}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 btn-primary"
          >
            <span>{currentStep === totalSteps ? 'Complete Setup' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function BasicInfoStep({ formData, updateFormData }: { formData: Partial<UserProfile>; updateFormData: (updates: Partial<UserProfile>) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's get to know you</h2>
        <p className="text-gray-600">This helps us personalize your smoothie experience</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender (optional)</label>
          <select
            value={formData.gender || ''}
            onChange={(e) => updateFormData({ gender: e.target.value as any || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age (optional)</label>
          <input
            type="number"
            min="18"
            max="100"
            value={formData.age || ''}
            onChange={(e) => updateFormData({ age: e.target.value ? parseInt(e.target.value) : undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter your age"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preference</label>
          <select
            value={formData.diet || 'none'}
            onChange={(e) => updateFormData({ diet: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="none">No restrictions</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="dairy-free">Dairy-free</option>
            <option value="gluten-free">Gluten-free</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function AllergiesStep({ formData, updateFormData }: { formData: Partial<UserProfile>; updateFormData: (updates: Partial<UserProfile>) => void }) {
  const allergens = ['nuts', 'tree-nuts', 'dairy', 'lactose', 'gluten', 'soy', 'eggs', 'shellfish'];

  const toggleAllergen = (allergen: string) => {
    const currentAllergies = formData.allergies || [];
    const updatedAllergies = currentAllergies.includes(allergen)
      ? currentAllergies.filter(a => a !== allergen)
      : [...currentAllergies, allergen];
    
    updateFormData({ allergies: updatedAllergies });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Any allergies or intolerances?</h2>
        <p className="text-gray-600">We'll make sure to avoid these ingredients in your recipes</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {allergens.map((allergen) => (
          <button
            key={allergen}
            onClick={() => toggleAllergen(allergen)}
            className={`
              p-3 rounded-lg border-2 text-left transition-all
              ${formData.allergies?.includes(allergen)
                ? 'border-red-500 bg-red-50 text-red-800'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {allergen.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {formData.allergies && formData.allergies.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            <strong>Selected:</strong> {formData.allergies.map(a => a.replace('-', ' ')).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

function GoalsStep({ formData, updateFormData }: { formData: Partial<UserProfile>; updateFormData: (updates: Partial<UserProfile>) => void }) {
  const goals: { id: HealthGoal; name: string; description: string; icon: string }[] = [
    {
      id: 'energy-boost',
      name: 'Energy Boost',
      description: 'Need sustained energy for the day',
      icon: '⚡'
    },
    {
      id: 'calm-stomach',
      name: 'Calm Stomach',
      description: 'Soothing ingredients for digestive comfort',
      icon: '🤗'
    },
    {
      id: 'meal-replacement',
      name: 'Meal Replacement',
      description: 'Complete nutrition to replace a meal',
      icon: '🍽️'
    }
  ];

  const toggleGoal = (goal: HealthGoal) => {
    const currentGoals = formData.goals || [];
    const updatedGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal];
    
    updateFormData({ goals: updatedGoals });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What are your health goals?</h2>
        <p className="text-gray-600">Select all that apply - we'll optimize your recipes accordingly</p>
      </div>

      <div className="space-y-3">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`
              w-full p-4 rounded-lg border-2 text-left transition-all
              ${formData.goals?.includes(goal.id)
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{goal.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PreferencesStep({ formData, updateFormData }: { formData: Partial<UserProfile>; updateFormData: (updates: Partial<UserProfile>) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Final preferences</h2>
        <p className="text-gray-600">Help us fine-tune your smoothie experience</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Sweetness Tolerance</label>
          <div className="space-y-2">
            {['low', 'medium', 'high'].map((level) => (
              <label key={level} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="sweetness"
                  value={level}
                  checked={formData.sweetnessTolerance === level}
                  onChange={(e) => updateFormData({ sweetnessTolerance: e.target.value as any })}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700 capitalize">{level} sweetness</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Texture Preference</label>
          <div className="space-y-2">
            {['layered', 'single-blend'].map((texture) => (
              <label key={texture} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="texture"
                  value={texture}
                  checked={formData.texturePreference === texture}
                  onChange={(e) => updateFormData({ texturePreference: e.target.value as any })}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">
                  {texture === 'layered' ? 'Layered smoothies (3 layers)' : 'Single blend smoothies'}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Disliked Ingredients (optional)</label>
          <input
            type="text"
            placeholder="e.g., spinach, ginger, coconut"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            onChange={(e) => {
              const dislikes = e.target.value.split(',').map(d => d.trim().toLowerCase()).filter(d => d);
              updateFormData({ dislikes });
            }}
          />
          <p className="text-sm text-gray-500 mt-1">Separate multiple ingredients with commas</p>
        </div>
      </div>
    </div>
  );
}
