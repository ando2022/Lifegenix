'use client';

import React, { useState } from 'react';
import { logEvent } from '@/lib/analytics';
import { Moon, Zap, Heart, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CheckInData {
  mood: string;
  sleepQuality: number;
}

interface DailyCheckInProps {
  onComplete: (data: CheckInData) => void;
  onSkip: () => void;
}

export default function DailyCheckIn({ onComplete, onSkip }: DailyCheckInProps) {
  const [mood, setMood] = useState<string>('');
  const [sleepQuality, setSleepQuality] = useState<number>(0);

  const sleepOptions = [
    { value: 1, label: 'Poor', icon: TrendingDown, color: 'text-red-500', description: 'Tossed and turned' },
    { value: 2, label: 'Fair', icon: Minus, color: 'text-yellow-500', description: 'Some rest' },
    { value: 3, label: 'Good', icon: TrendingUp, color: 'text-green-500', description: 'Slept well' },
    { value: 4, label: 'Excellent', icon: Moon, color: 'text-blue-500', description: 'Deep sleep' }
  ];


  const moodOptions = [
    { value: 'energized', label: 'Energized', icon: Zap, color: 'text-yellow-500', description: 'Ready to go' },
    { value: 'tired', label: 'Tired', icon: Moon, color: 'text-blue-500', description: 'Need energy' },
    { value: 'stressed', label: 'Stressed', icon: TrendingUp, color: 'text-red-500', description: 'Overwhelmed' },
    { value: 'focused', label: 'Focused', icon: Heart, color: 'text-purple-500', description: 'Concentrated' },
    { value: 'relaxed', label: 'Relaxed', icon: Heart, color: 'text-green-500', description: 'Peaceful' },
    { value: 'hungry', label: 'Hungry', icon: Heart, color: 'text-orange-500', description: 'Need food' }
  ];


  const handleComplete = () => {
    const checkInData: CheckInData = {
      mood,
      sleepQuality
    };
    logEvent('CheckIn_Completed', checkInData);
    onComplete(checkInData);
  };

  const isComplete = () => {
    return mood !== '' && sleepQuality > 0;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Check-in</h2>
        <p className="text-gray-600">Let's personalize your smoothie based on how you're feeling today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mood */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Current Mood</h3>
          <div className="space-y-2">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setMood(option.value)}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                  mood === option.value
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-violet-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <option.icon className={`w-5 h-5 ${option.color}`} />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 text-sm">{option.label}</h4>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Quality */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Sleep Quality</h3>
          <div className="space-y-2">
            {sleepOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSleepQuality(option.value)}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                  sleepQuality === option.value
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-violet-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <option.icon className={`w-5 h-5 ${option.color}`} />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 text-sm">{option.label}</h4>
                    <p className="text-xs text-gray-600">{option.description}</p>
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
          disabled={!isComplete()}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            isComplete()
              ? 'bg-violet-600 text-white hover:bg-violet-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Complete Check-in
        </button>
        <button
          onClick={onSkip}
          className="px-6 py-3 rounded-lg bg-transparent text-gray-500 hover:text-gray-700 transition-colors font-medium"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
