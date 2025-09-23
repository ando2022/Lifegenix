import { HealthGoal, SingleMixIngredient } from '@/lib/types';

// Curated base recipes with exact weights. Ingredient ids refer to `data/ingredients.ts`.
// Generator will apply substitutions for allergies/intolerances and add "Michelin-star tweaks".

export type CuratedSingle = {
  id: string;
  name: string;
  goal: HealthGoal;
  base: SingleMixIngredient[];
  why: string[];
};

export const curatedSingles: CuratedSingle[] = [
  {
    id: 'focus-flow-v2',
    name: 'Focus Flow',
    goal: 'brain-health',
    base: [
      { ingredient: { id: 'blueberries-frozen' } as any, amount: 120, unit: 'g', purpose: 'base' },
      { ingredient: { id: 'banana-frozen' } as any, amount: 80, unit: 'g', purpose: 'base' },
      { ingredient: { id: 'oats' } as any, amount: 18, unit: 'g', purpose: 'superfood' },
      { ingredient: { id: 'almond-milk' } as any, amount: 180, unit: 'ml', purpose: 'liquid' },
      { ingredient: { id: 'cacao-powder' } as any, amount: 5, unit: 'g', purpose: 'superfood' },
    ],
    why: [
      'Blueberries deliver anthocyanins supporting cognitive function',
      'Oats provide steady-release energy for sustained focus',
      'Cacao adds flavonoids and a refined chocolate note',
    ],
  },
  {
    id: 'calm-ease-v2',
    name: 'Calm Ease',
    goal: 'calm-stomach',
    base: [
      { ingredient: { id: 'spinach' } as any, amount: 50, unit: 'g', purpose: 'base' },
      { ingredient: { id: 'mango-frozen' } as any, amount: 120, unit: 'g', purpose: 'base' },
      { ingredient: { id: 'banana-frozen' } as any, amount: 60, unit: 'g', purpose: 'base' },
      { ingredient: { id: 'coconut-milk' } as any, amount: 120, unit: 'ml', purpose: 'liquid' },
      { ingredient: { id: 'ginger-powder' } as any, amount: 0.8, unit: 'g', purpose: 'flavor' },
      { ingredient: { id: 'chia-seeds' } as any, amount: 10, unit: 'g', purpose: 'superfood' },
    ],
    why: [
      'Ginger supports digestive comfort and calm',
      'Spinach contributes magnesium for relaxation',
      'Chia seeds add steady energy and texture',
    ],
  },
  {
    id: 'recover-power-v2',
    name: 'Recover Power',
    goal: 'meal-replacement',
    base: [
      { ingredient: { id: 'banana-frozen' } as any, amount: 120, unit: 'g', purpose: 'base' },
      { ingredient: { id: 'oat-milk' } as any, amount: 180, unit: 'ml', purpose: 'liquid' },
      { ingredient: { id: 'coconut-yogurt' } as any, amount: 120, unit: 'g', purpose: 'protein' },
      { ingredient: { id: 'oats' } as any, amount: 20, unit: 'g', purpose: 'superfood' },
    ],
    why: [
      'Protein and complex carbs support post-activity recovery',
      'Yogurt adds creaminess and probiotics',
    ],
  },
  {
    id: 'hydrate-light-v2',
    name: 'Hydrate Light',
    goal: 'immune-support',
    base: [
      { ingredient: { id: 'strawberries-frozen' } as any, amount: 120, unit: 'g', purpose: 'base' },
      { ingredient: { id: 'coconut-milk' } as any, amount: 80, unit: 'ml', purpose: 'liquid' },
      { ingredient: { id: 'chia-seeds' } as any, amount: 8, unit: 'g', purpose: 'superfood' },
    ],
    why: [
      'Coconut brings gentle hydration and mouthfeel',
      'Strawberries add vitamin C and light acidity',
    ],
  },
];

export function pickCuratedForGoal(goal: HealthGoal): CuratedSingle {
  const pool = curatedSingles.filter((r) => r.goal === goal);
  return pool[Math.floor(Math.random() * pool.length)] || curatedSingles[0];
}

