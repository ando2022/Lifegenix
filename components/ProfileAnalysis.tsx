'use client';

import React from 'react';
import { UserProfile, Mood } from '@/lib/types';
import { 
  Brain, Heart, Shield, Zap, Leaf, Target, 
  TrendingUp, AlertTriangle, CheckCircle, 
  Clock, Star, Lightbulb, Moon 
} from 'lucide-react';

interface ProfileAnalysisProps {
  userProfile: UserProfile;
  selectedMood: string;
  sleepQuality: number;
  onContinue: () => void;
}

// Helper functions to convert mood string to display object
const getMoodDescription = (mood: string): string => {
  const descriptions: Record<string, string> = {
    'energized': 'Ready to go',
    'tired': 'Need energy',
    'stressed': 'Overwhelmed',
    'focused': 'Concentrated',
    'relaxed': 'Peaceful',
    'hungry': 'Need food'
  };
  return descriptions[mood] || 'Feeling good';
};

const getMoodIcon = (mood: string) => {
  const icons: Record<string, any> = {
    'energized': Zap,
    'tired': Moon,
    'stressed': TrendingUp,
    'focused': Brain,
    'relaxed': Heart,
    'hungry': Heart
  };
  return icons[mood] || Heart;
};

export default function ProfileAnalysis({ userProfile, selectedMood, sleepQuality, onContinue }: ProfileAnalysisProps) {
  // Create a mood object from the string for display purposes
  const moodDisplay = {
    name: selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1),
    description: getMoodDescription(selectedMood),
    icon: getMoodIcon(selectedMood)
  };
  
  // Get current time of day
  const timeOfDay = getTimeOfDay();
  const timeDisplay = {
    morning: { name: 'Morning', icon: '🌅', description: 'Energy & Focus' },
    afternoon: { name: 'Afternoon', icon: '☀️', description: 'Sustained Energy' },
    evening: { name: 'Evening', icon: '🌙', description: 'Relaxation & Recovery' }
  }[timeOfDay];
  
  // Analyze user profile and generate recommendations
  const analysis = generateProfileAnalysis(userProfile, selectedMood, sleepQuality);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Personalized Analysis</h2>
        <p className="text-gray-600">Based on your profile and current mood, here are your personalized nutrition recommendations</p>
      </div>

      {/* Your Profile Summary */}
      <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-6 h-6 text-violet-600 mr-2" />
          Your Profile Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Current State */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Today's State</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <moodDisplay.icon className="w-5 h-5 text-violet-600" />
                <span className="text-sm text-gray-700"><strong>Mood:</strong> {moodDisplay.name} - {moodDisplay.description}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">
                  <strong>Sleep:</strong> {sleepQuality === 1 ? 'Poor' : sleepQuality === 2 ? 'Fair' : sleepQuality === 3 ? 'Good' : 'Excellent'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg">{timeDisplay.icon}</span>
                <span className="text-sm text-gray-700"><strong>Time:</strong> {timeDisplay.name} - {timeDisplay.description}</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Health Profile */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Your Health Profile</h4>
            <div className="space-y-2">
              {userProfile.goals && userProfile.goals.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-violet-600" />
                  <span className="text-sm text-gray-700"><strong>Goals:</strong> {userProfile.goals.join(', ')}</span>
                </div>
              )}
              {userProfile.allergies && userProfile.allergies.length > 0 && (
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-700"><strong>Avoid:</strong> {userProfile.allergies.join(', ')}</span>
                </div>
              )}
              {userProfile.intolerances && userProfile.intolerances.length > 0 && (
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700"><strong>Limit:</strong> {userProfile.intolerances.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Priority Nutrients */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="w-6 h-6 text-violet-600 mr-2" />
          Why These Nutrients Matter for You
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.priorityNutrients.map((nutrient, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  nutrient.priority === 'high' ? 'bg-red-100' : 
                  nutrient.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  {nutrient.priority === 'high' ? (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-violet-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{nutrient.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{nutrient.benefit}</p>
                  {nutrient.reason && (
                    <p className="text-xs text-violet-600 mb-2">
                      <strong>Why for you:</strong> {nutrient.reason}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {nutrient.sources.map((source, idx) => (
                      <span key={idx} className="px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-full">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="w-6 h-6 text-violet-600 mr-2" />
          Personalized Recommendations
        </h3>
        <div className="space-y-4">
          {analysis.recommendations.map((rec, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <rec.icon className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                  <p className="text-gray-700 text-sm">{rec.description}</p>
                  {rec.tips && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 font-medium mb-1">Quick tips:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {rec.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-center">
                            <div className="w-1 h-1 bg-violet-500 rounded-full mr-2"></div>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timing & Frequency */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-6 h-6 text-violet-600 mr-2" />
          Optimal Timing & Frequency
        </h3>
        <div className="bg-violet-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Best Times to Consume</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {analysis.timing.map((time, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-violet-500 mr-2" />
                    {time}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Recommended Frequency</h4>
              <p className="text-sm text-gray-700 mb-2">{analysis.frequency}</p>
              <div className="flex flex-wrap gap-2">
                {analysis.frequencyTags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-white text-violet-700 text-xs rounded-full border border-violet-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button removed: smoothie generation not triggered from this page */}
    </div>
  );
}

// Helper function to get time of day
function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

// Helper function to generate profile analysis
function generateProfileAnalysis(userProfile: UserProfile, selectedMood: string, sleepQuality: number) {
  const allergies = userProfile.allergies || [];
  const intolerances = userProfile.intolerances || [];
  const goals = userProfile.goals || [];
  const timeOfDay = getTimeOfDay();

  // Dynamic nutrient selection based on user inputs
  const allNutrients = [
    {
      name: 'Omega-3 Fatty Acids',
      benefit: 'Supports brain health and reduces inflammation',
      sources: ['Chia seeds', 'Flax seeds', 'Walnuts', 'Hemp seeds'],
      triggers: {
        mood: ['focused', 'stressed'],
        goals: ['Focus', 'Brain Health', 'Longevity'],
        allergies: [] // No common allergens
      }
    },
    {
      name: 'Antioxidants',
      benefit: 'Fights oxidative stress and supports longevity',
      sources: ['Blueberries', 'Acai', 'Spirulina', 'Green tea'],
      triggers: {
        mood: ['stressed', 'tired'],
        goals: ['Longevity', 'Immune', 'Skin Health', 'Detox'],
        allergies: ['Berries'] // Check if berries are avoided
      }
    },
    {
      name: 'Magnesium',
      benefit: 'Supports sleep quality and stress management',
      sources: ['Spinach', 'Almonds', 'Cacao', 'Pumpkin seeds'],
      triggers: {
        mood: ['stressed', 'tired'],
        goals: ['Energy', 'Focus'],
        allergies: ['Nuts', 'Tree Nuts'] // Check if nuts are avoided
      }
    },
    {
      name: 'Protein',
      benefit: 'Supports muscle recovery and sustained energy',
      sources: ['Greek yogurt', 'Hemp protein', 'Almond butter', 'Chia seeds'],
      triggers: {
        mood: ['energized', 'hungry'],
        goals: ['Energy', 'Weight'],
        allergies: ['Dairy', 'Nuts', 'Tree Nuts'] // Check if dairy/nuts are avoided
      }
    },
    {
      name: 'Vitamin C',
      benefit: 'Boosts immune system and collagen production',
      sources: ['Citrus fruits', 'Bell peppers', 'Strawberries', 'Kiwi'],
      triggers: {
        mood: ['tired'],
        goals: ['Immune', 'Skin Health'],
        allergies: ['Citrus'] // Check if citrus is avoided
      }
    },
    {
      name: 'B-Complex Vitamins',
      benefit: 'Supports energy metabolism and nervous system',
      sources: ['Leafy greens', 'Bananas', 'Avocado', 'Nutritional yeast'],
      triggers: {
        mood: ['energized', 'focused'],
        goals: ['Energy', 'Focus'],
        allergies: []
      }
    },
    {
      name: 'Iron',
      benefit: 'Prevents fatigue and supports oxygen transport',
      sources: ['Spinach', 'Pumpkin seeds', 'Quinoa', 'Dark chocolate'],
      triggers: {
        mood: ['tired'],
        goals: ['Energy'],
        allergies: []
      }
    },
    {
      name: 'Probiotics',
      benefit: 'Supports gut health and immune function',
      sources: ['Greek yogurt', 'Kefir', 'Sauerkraut', 'Kombucha'],
      triggers: {
        mood: ['hungry'],
        goals: ['Detox', 'Immune'],
        allergies: ['Dairy'] // Check if dairy is avoided
      }
    }
  ];

  // Score each nutrient based on user profile and time of day
  const scoredNutrients = allNutrients.map(nutrient => {
    let score = 0;
    let reasons = [];

    // Check mood triggers
    if (nutrient.triggers.mood.includes(selectedMood)) {
      score += 3;
      reasons.push(`Your ${selectedMood} mood benefits from this nutrient`);
    }

    // Check goal triggers
    const matchingGoals = goals.filter(goal => 
      nutrient.triggers.goals.some(trigger => 
        goal.toLowerCase().includes(trigger.toLowerCase()) || 
        trigger.toLowerCase().includes(goal.toLowerCase())
      )
    );
    if (matchingGoals.length > 0) {
      score += 2;
      reasons.push(`Supports your ${matchingGoals.join(' and ')} goals`);
    }

            // Check time-of-day triggers
            if (timeOfDay === 'morning' && ['Protein', 'B-Complex Vitamins', 'Iron'].includes(nutrient.name)) {
              score += 2;
              reasons.push(`Perfect for morning energy and focus`);
            }
            if (timeOfDay === 'afternoon' && ['Antioxidants', 'Vitamin C', 'Magnesium'].includes(nutrient.name)) {
              score += 1;
              reasons.push(`Great for afternoon energy maintenance`);
            }
            if (timeOfDay === 'evening' && ['Magnesium', 'Probiotics'].includes(nutrient.name)) {
              score += 2;
              reasons.push(`Ideal for evening relaxation and digestion`);
            }

            // Sleep quality triggers
            if (sleepQuality <= 2 && ['Magnesium', 'B-Complex Vitamins', 'Iron'].includes(nutrient.name)) {
              score += 2;
              reasons.push(`Essential for recovery from poor sleep quality`);
            }
            if (sleepQuality <= 2 && ['Antioxidants', 'Vitamin C'].includes(nutrient.name)) {
              score += 1;
              reasons.push(`Helps combat fatigue from poor sleep`);
            }
            if (sleepQuality >= 3 && ['Protein', 'Omega-3 Fatty Acids'].includes(nutrient.name)) {
              score += 1;
              reasons.push(`Builds on your good sleep foundation`);
            }

    // Check if allergies/intolerances affect this nutrient
    const conflictingAllergies = allergies.filter(allergy => 
      nutrient.triggers.allergies.some(trigger => 
        allergy.toLowerCase().includes(trigger.toLowerCase()) || 
        trigger.toLowerCase().includes(allergy.toLowerCase())
      )
    );
    if (conflictingAllergies.length > 0) {
      score -= 2;
      reasons.push(`Some sources may conflict with your ${conflictingAllergies.join(' and ')} restrictions`);
    }

    // Check intolerances
    const conflictingIntolerances = intolerances.filter(intolerance => 
      nutrient.triggers.allergies.some(trigger => 
        intolerance.toLowerCase().includes(trigger.toLowerCase()) || 
        trigger.toLowerCase().includes(intolerance.toLowerCase())
      )
    );
    if (conflictingIntolerances.length > 0) {
      score -= 1;
      reasons.push(`Some sources may not suit your ${conflictingIntolerances.join(' and ')} sensitivities`);
    }

    return {
      ...nutrient,
      score,
      priority: score >= 3 ? 'high' : score >= 1 ? 'medium' : 'low',
      reason: reasons.length > 0 ? reasons.join('. ') : 'General health support'
    };
  });

  // Select top 4 nutrients, prioritizing high scores
  const priorityNutrients = scoredNutrients
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(nutrient => ({
      name: nutrient.name,
      benefit: nutrient.benefit,
      priority: nutrient.priority,
      reason: nutrient.reason,
      sources: nutrient.sources
    }));

  // Personalized recommendations (dynamic by mood, goals, restrictions)
  const recommendationsAll: Array<{
    title: string; description: string; icon: any; tips: string[]; score: number;
  }> = [];

  const addRec = (rec: { title: string; description: string; icon: any; tips: string[]; score?: number }) => {
    recommendationsAll.push({ ...rec, score: rec.score ?? 0 });
  };

  // Time-of-day specific recommendations
  if (timeOfDay === 'morning') {
    addRec({
      title: 'Morning Energy Boost',
      description: 'Start your day with energizing nutrients that provide sustained energy without crashes.',
      icon: Zap,
      tips: ['Include protein for satiety', 'Add B-vitamins for energy metabolism', 'Use natural caffeine sources like green tea'],
      score: 2,
    });
  }
  if (timeOfDay === 'afternoon') {
    addRec({
      title: 'Afternoon Sustenance',
      description: 'Maintain steady energy and focus with balanced nutrients that prevent afternoon slumps.',
      icon: Heart,
      tips: ['Combine protein with complex carbs', 'Include antioxidants for energy', 'Avoid heavy, sleep-inducing ingredients'],
      score: 2,
    });
  }
  if (timeOfDay === 'evening') {
    addRec({
      title: 'Evening Wind-Down',
      description: 'Support relaxation and digestion with calming nutrients that prepare your body for rest.',
      icon: Heart,
      tips: ['Include magnesium for relaxation', 'Add probiotics for digestion', 'Avoid stimulating ingredients'],
      score: 2,
    });
  }

  // Mood-driven
  if (selectedMood === 'stressed') {
    addRec({
      title: 'Calm the System',
      description: 'Emphasize magnesium-rich greens and adaptogens to balance stress response.',
      icon: Heart,
      tips: ['Spinach or cacao for magnesium', 'Add ashwagandha or reishi', 'Favor blueberries and green tea'],
      score: 3,
    });
  }
  if (selectedMood === 'tired') {
    addRec({
      title: 'Restore Natural Energy',
      description: 'Build steady energy with iron, B-vitamins and gentle carbs.',
      icon: Zap,
      tips: ['Spinach + pumpkin seeds for iron', 'Banana + oats for slow carbs', 'Avoid added sugar boosts'],
      score: 3,
    });
  }

  // Sleep quality recommendations
  if (sleepQuality <= 2) {
    addRec({
      title: 'Sleep Recovery Support',
      description: 'Focus on nutrients that help your body recover from poor sleep and prepare for better rest tonight.',
      icon: Moon,
      tips: ['Magnesium-rich foods like spinach and almonds', 'B-vitamins for energy metabolism', 'Avoid caffeine after 2 PM'],
      score: 3,
    });
  }
  if (sleepQuality >= 3) {
    addRec({
      title: 'Optimize Your Good Sleep',
      description: 'Build on your quality sleep with nutrients that enhance cognitive function and sustained energy.',
      icon: Star,
      tips: ['Protein for sustained energy', 'Omega-3s for brain health', 'Antioxidants for cellular protection'],
      score: 2,
    });
  }
  if (selectedMood === 'energized') {
    addRec({
      title: 'Sustain Your Momentum',
      description: 'Balance protein and healthy fats to keep energy smooth all day.',
      icon: Zap,
      tips: ['Hemp protein or Greek yogurt', 'Add chia or almond butter', 'Hydrate with coconut water base'],
      score: 2,
    });
  }
  if (selectedMood === 'focused') {
    addRec({
      title: 'Sharpen Cognitive Support',
      description: 'Prioritize omega‑3s and polyphenols that aid attention and memory.',
      icon: Leaf,
      tips: ['Chia or flax for ALA', 'Blueberries or acai', 'Green tea or matcha base'],
      score: 2,
    });
  }
  if (selectedMood === 'hungry') {
    addRec({
      title: 'Promote Satiety & Balance',
      description: 'Increase protein and fiber to keep you comfortably full with stable glucose.',
      icon: Heart,
      tips: ['Hemp protein + berries', 'Oats or avocado for fiber', 'Keep sweeteners minimal'],
      score: 2,
    });
  }

  // Goal-driven
  const hasGoal = (g: string) => goals.some(x => x.toLowerCase().includes(g.toLowerCase()));
  if (hasGoal('Detox')) {
    addRec({
      title: 'Gentle Detox Support',
      description: 'Use liver‑supportive plants and hydration to aid natural clearance.',
      icon: Leaf,
      tips: ['Add lemon or kiwi (avoid citrus if sensitive)', 'Include parsley or ginger', 'Use water/green tea base'],
      score: 2,
    });
  }
  if (hasGoal('Immune')) {
    addRec({
      title: 'Immune Resilience',
      description: 'Combine vitamin‑C sources with zinc and antioxidants for daily defense.',
      icon: Leaf,
      tips: ['Kiwi or bell pepper for vitamin C', 'Pumpkin seeds for zinc', 'Blueberries + green tea'],
      score: 2,
    });
  }
  if (hasGoal('Skin')) {
    addRec({
      title: 'Skin Glow Nutrition',
      description: 'Prioritize vitamin C and healthy fats that support collagen and barrier function.',
      icon: Heart,
      tips: ['Strawberries or kiwi', 'Avocado or flax', 'Stay well‑hydrated'],
      score: 1,
    });
  }
  if (hasGoal('Weight')) {
    addRec({
      title: 'Weight‑Smart Balancing',
      description: 'Build high‑satiety blends with protein and fiber while keeping sugars low.',
      icon: Zap,
      tips: ['Hemp or Greek yogurt', 'Oats + chia for fiber', 'Use berries over sweet fruits'],
      score: 1,
    });
  }

  // Restriction-aware tweaks
  if (allergies.includes('Dairy')) {
    addRec({
      title: 'Dairy‑Free Optimization',
      description: 'Swap yogurt/protein for plant alternatives without losing creaminess or protein.',
      icon: Heart,
      tips: ['Use hemp protein or silken tofu', 'Coconut/almond yogurt alternatives', 'Add avocado for texture'],
      score: 1,
    });
  }
  if (allergies.includes('Nuts') || allergies.includes('Tree Nuts')) {
    addRec({
      title: 'Nut‑Free Boosts',
      description: 'Use seeds for healthy fats, crunch and minerals—without nut exposure.',
      icon: Leaf,
      tips: ['Swap almond butter → sunflower butter', 'Use chia, flax, hemp', 'Pumpkin seeds for zinc'],
      score: 1,
    });
  }

  // Choose top 3 highest‑scoring, unique titles
  const recommendations = Array.from(
    new Map(recommendationsAll.map(r => [r.title, r]))
  )
    .map(([, r]) => r)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ title, description, icon, tips }) => ({ title, description, icon, tips }));

  // Timing recommendations
  const timing = [
    'Morning: Energy-boosting ingredients',
    'Pre-workout: Quick-digesting carbs',
    'Post-workout: Protein and antioxidants',
    'Evening: Calming and sleep-supporting nutrients'
  ];

  const frequency = 'Consume 1-2 smoothies daily, varying ingredients to ensure nutrient diversity';
  const frequencyTags = ['Daily rotation', 'Seasonal variety', 'Mood-based selection'];

  return {
    priorityNutrients,
    recommendations,
    timing,
    frequency,
    frequencyTags
  };
}
