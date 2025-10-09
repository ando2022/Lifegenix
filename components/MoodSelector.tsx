'use client';

import { useState, useEffect } from 'react';
import { Mood } from '@/lib/types';
import { moods } from '@/data/moods';
import { useAnalytics } from '@/hooks/useAnalytics';

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
  selectedMood?: Mood;
}

export default function MoodSelector({ onMoodSelect, selectedMood }: MoodSelectorProps) {
  const { trackCustomEvent } = useAnalytics();
  const [hasTrackedView, setHasTrackedView] = useState(false);

  // Track when mood menu is displayed
  useEffect(() => {
    if (!hasTrackedView) {
      trackCustomEvent('menu_viewed', {
        moods_displayed: moods.length,
        mood_names: moods.map(m => m.name),
        timestamp: new Date().toISOString()
      });
      setHasTrackedView(true);
    }
  }, [hasTrackedView, trackCustomEvent]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">How are you feeling today?</h2>
        <p className="text-gray-600">Select your current mood to get a personalized smoothie recipe</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodSelect(mood)}
            className={`
              p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105
              ${selectedMood?.id === mood.id
                ? 'border-teal-500 bg-teal-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-25'
              }
            `}
          >
            <div className="text-center">
              <div className={`
                w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl
                ${mood.color} ${selectedMood?.id === mood.id ? 'ring-4 ring-teal-200' : ''}
              `}>
                {mood.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{mood.name}</h3>
              <p className="text-sm text-gray-600 leading-tight">{mood.description}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full">
            <span className="text-lg">{selectedMood.icon}</span>
            <span className="font-medium">Selected: {selectedMood.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
