'use client';

import { useState } from 'react';
import { UserProfile, HealthGoal } from '@/lib/types';
import { ChevronRight, ChevronLeft, MapPin, Clock, DollarSign } from 'lucide-react';

interface EnhancedOnboardingFormProps {
  onComplete: (profile: UserProfile) => void;
}

export default function EnhancedOnboardingForm({ onComplete }: EnhancedOnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    allergies: [],
    intolerances: [],
    diet: 'none',
    goals: [],
    dislikes: [],
    sweetnessTolerance: 'medium',
    texturePreference: 'layered',
    budget: 'premium',
    timeOfDay: 'morning',
    activityLevel: 'moderate',
    flavorPreferences: { sweet: 5, sour: 3, bitter: 2, umami: 3 }
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      const profile: UserProfile = {
        id: `user-${Date.now()}`,
        ...formData,
        allergies: formData.allergies || [],
        intolerances: formData.intolerances || [],
        goals: formData.goals || [],
        dislikes: formData.dislikes || [],
        sweetnessTolerance: formData.sweetnessTolerance || 'medium',
        texturePreference: formData.texturePreference || 'layered',
        budget: formData.budget || 'premium',
        timeOfDay: formData.timeOfDay || 'morning',
        activityLevel: formData.activityLevel || 'moderate',
        flavorPreferences: formData.flavorPreferences || { sweet: 5, sour: 3, bitter: 2, umami: 3 },
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
        {currentStep === 4 && <LifestyleStep formData={formData} updateFormData={updateFormData} />}
        {currentStep === 5 && <BudgetStep formData={formData} updateFormData={updateFormData} />}
        {currentStep === 6 && <FlavorStep formData={formData} updateFormData={updateFormData} />}

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
          <label className="block text-sm font-medium text-gray-700 mb-2">Name (optional)</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => updateFormData({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter your name"
          />
        </div>

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
            <option value="paleo">Paleo</option>
            <option value="keto">Keto</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function AllergiesStep({ formData, updateFormData }: { formData: Partial<UserProfile>; updateFormData: (updates: Partial<UserProfile>) => void }) {
  const allergens = ['dairy', 'tree-nuts', 'gluten', 'soy', 'eggs', 'shellfish', 'fish', 'sesame'];
  const intolerances = ['lactose', 'fructose', 'histamine', 'gluten-sensitivity', 'caffeine'];

  const toggleAllergen = (allergen: string) => {
    const currentAllergies = formData.allergies || [];
    const updatedAllergies = currentAllergies.includes(allergen)
      ? currentAllergies.filter(a => a !== allergen)
      : [...currentAllergies, allergen];
    
    updateFormData({ allergies: updatedAllergies });
  };

  const toggleIntolerance = (intolerance: string) => {
    const currentIntolerances = formData.intolerances || [];
    const updatedIntolerances = currentIntolerances.includes(intolerance)
      ? currentIntolerances.filter(i => i !== intolerance)
      : [...currentIntolerances, intolerance];
    
    updateFormData({ intolerances: updatedIntolerances });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Allergies & Intolerances</h2>
        <p className="text-gray-600">We'll make sure to avoid these ingredients in your recipes</p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Allergies</h3>
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
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Intolerances</h3>
        <div className="grid grid-cols-2 gap-3">
          {intolerances.map((intolerance) => (
            <button
              key={intolerance}
              onClick={() => toggleIntolerance(intolerance)}
              className={`
                p-3 rounded-lg border-2 text-left transition-all
                ${formData.intolerances?.includes(intolerance)
                  ? 'border-orange-500 bg-orange-50 text-orange-800'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {intolerance.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {(formData.allergies && formData.allergies.length > 0) || (formData.intolerances && formData.intolerances.length > 0) ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Selected:</strong> {
              [
                ...(formData.allergies || []).map(a => a.replace('-', ' ')),
                ...(formData.intolerances || []).map(i => i.replace('-', ' '))
              ].join(', ')
            }
          </p>
        </div>
      ) : null}
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
    },
    {
      id: 'longevity',
      name: 'Longevity',
      description: 'Anti-aging and cellular health',
      icon: '⏳'
    },
    {
      id: 'gut-health',
      name: 'Gut Health',
      description: 'Support digestive wellness',
      icon: '🦠'
    },
    {
      id: 'brain-health',
      name: 'Brain Health',
      description: 'Cognitive function and focus',
      icon: '🧠'
    },
    {
      id: 'immune-support',
      name: 'Immune Support',
      description: 'Strengthen your immune system',
      icon: '🛡️'
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

function LifestyleStep({ formData, updateFormData }: { formData: Partial<UserProfile>; updateFormData: (updates: Partial<UserProfile>) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lifestyle & Preferences</h2>
        <p className="text-gray-600">Help us understand your daily routine</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            When do you usually have smoothies?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['morning', 'lunch', 'afternoon', 'evening'].map((time) => (
              <button
                key={time}
                onClick={() => updateFormData({ timeOfDay: time as any })}
                className={`
                  p-3 rounded-lg border-2 text-center transition-all
                  ${formData.timeOfDay === time
                    ? 'border-teal-500 bg-teal-50 text-teal-800'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Activity Level</label>
          <div className="grid grid-cols-2 gap-3">
            {['sedentary', 'moderate', 'active', 'athlete'].map((level) => (
              <button
                key={level}
                onClick={() => updateFormData({ activityLevel: level as any })}
                className={`
                  p-3 rounded-lg border-2 text-center transition-all
                  ${formData.activityLevel === level
                    ? 'border-teal-500 bg-teal-50 text-teal-800'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
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
      </div>
    </div>
  );
}

function BudgetStep({ formData, updateFormData }: { formData: Partial<UserProfile>; updateFormData: (updates: Partial<UserProfile>) => void }) {
  const budgetOptions = [
    { value: 'basic', label: 'Basic', price: 'CHF 8-12', description: 'Essential ingredients only' },
    { value: 'premium', label: 'Premium', price: 'CHF 12-16', description: 'Quality ingredients + superfoods' },
    { value: 'luxury', label: 'Luxury', price: 'CHF 16+', description: 'Premium superfoods + customization' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Budget Range</h2>
        <p className="text-gray-600">Choose your preferred spending range per smoothie</p>
      </div>

      <div className="space-y-3">
        {budgetOptions.map((budget) => (
          <button
            key={budget.value}
            onClick={() => updateFormData({ budget: budget.value as any })}
            className={`
              w-full p-4 rounded-lg border-2 text-left transition-all
              ${formData.budget === budget.value
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{budget.label}</h3>
                <p className="text-sm text-gray-600">{budget.description}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-teal-600">{budget.price}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Higher budgets include premium superfoods like spirulina, collagen, and matcha for enhanced health benefits.
        </p>
      </div>
    </div>
  );
}

function FlavorStep({ formData, updateFormData }: { formData: Partial<UserProfile>; updateFormData: (updates: Partial<UserProfile>) => void }) {
  const flavors = [
    { key: 'sweet', label: 'Sweet', emoji: '🍯', description: 'Natural sweetness from fruits and honey' },
    { key: 'sour', label: 'Sour', emoji: '🍋', description: 'Citrus and tart flavors' },
    { key: 'bitter', label: 'Bitter', emoji: '🍫', description: 'Dark chocolate, cacao, and greens' },
    { key: 'umami', label: 'Umami/Savory', emoji: '🥑', description: 'Rich, savory flavors from nuts and seeds' }
  ];

  const handleFlavorChange = (flavor: string, value: number) => {
    updateFormData({
      flavorPreferences: {
        ...formData.flavorPreferences!,
        [flavor]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Flavor Preferences</h2>
        <p className="text-gray-600">Rate your preference for each flavor (0 = dislike, 10 = love)</p>
      </div>

      <div className="space-y-6">
        {flavors.map((flavor) => (
          <div key={flavor.key}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <span className="text-lg mr-2">{flavor.emoji}</span>
                {flavor.label}
              </label>
              <span className="text-sm font-semibold text-teal-600">
                {formData.flavorPreferences?.[flavor.key as keyof typeof formData.flavorPreferences] || 5}/10
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">{flavor.description}</p>
            <input
              type="range"
              min="0"
              max="10"
              value={formData.flavorPreferences?.[flavor.key as keyof typeof formData.flavorPreferences] || 5}
              onChange={(e) => handleFlavorChange(flavor.key, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Dislike</span>
              <span>Love</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Perfect!</strong> We'll use these preferences to create balanced, delicious smoothies that match your taste profile.
        </p>
      </div>
    </div>
  );
}

