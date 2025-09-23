'use client';

import { useState } from 'react';
import { Mood } from '@/lib/types';
import { moods } from '@/data/moods';

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
  selectedMood?: Mood;
}

export default function MoodSelector({ onMoodSelect, selectedMood }: MoodSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Mood</h2>
        <p className="text-gray-600">Select your current mood to personalize your smoothie</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodSelect(mood)}
            className={`
              p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105
              ${selectedMood?.id === mood.id
                ? 'border-violet-500 bg-violet-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-25'
              }
            `}
          >
            <div className="text-center">
              <div className={`
                w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl
                ${mood.color} ${selectedMood?.id === mood.id ? 'ring-4 ring-violet-200' : ''}
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
          <div className="inline-flex items-center space-x-2 bg-violet-100 text-violet-800 px-4 py-2 rounded-full">
            <span className="text-lg">{selectedMood.icon}</span>
            <span className="font-medium">Selected: {selectedMood.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
