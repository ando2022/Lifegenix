import { Mood } from '@/lib/types';

export const moods: Mood[] = [
  {
    id: 'energized',
    name: 'Energized',
    description: 'Ready to tackle the day with focus and vitality',
    icon: '⚡',
    color: 'bg-yellow-400',
    recommendedGoals: ['energy-boost']
  },
  {
    id: 'tired',
    name: 'Tired',
    description: 'Need a natural energy boost to get through the day',
    icon: '😴',
    color: 'bg-blue-400',
    recommendedGoals: ['energy-boost']
  },
  {
    id: 'stressed',
    name: 'Stressed',
    description: 'Feeling overwhelmed and need something calming',
    icon: '😰',
    color: 'bg-red-400',
    recommendedGoals: ['calm-stomach']
  },
  {
    id: 'hungry',
    name: 'Hungry',
    description: 'Need a satisfying meal replacement',
    icon: '🍽️',
    color: 'bg-orange-400',
    recommendedGoals: ['meal-replacement']
  },
  {
    id: 'bloated',
    name: 'Bloated',
    description: 'Stomach feels uncomfortable and needs soothing',
    icon: '🤢',
    color: 'bg-green-400',
    recommendedGoals: ['calm-stomach']
  },
  {
    id: 'focused',
    name: 'Focused',
    description: 'Need sustained energy for mental clarity',
    icon: '🧠',
    color: 'bg-purple-400',
    recommendedGoals: ['energy-boost']
  },
  {
    id: 'relaxed',
    name: 'Relaxed',
    description: 'Feeling good and want to maintain this state',
    icon: '😌',
    color: 'bg-teal-400',
    recommendedGoals: ['calm-stomach']
  },
  {
    id: 'active',
    name: 'Active',
    description: 'Ready for physical activity and need fuel',
    icon: '🏃',
    color: 'bg-pink-400',
    recommendedGoals: ['meal-replacement', 'energy-boost']
  }
];
