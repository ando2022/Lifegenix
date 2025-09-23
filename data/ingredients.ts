import { Ingredient } from '@/lib/types';

export const ingredients: Ingredient[] = [
  // Frozen Fruits
  {
    id: 'banana-frozen',
    name: 'Frozen Banana',
    category: 'frozen-fruits',
    nutrition: {
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12.2,
      longevityCompounds: ['potassium', 'vitamin-b6', 'antioxidants']
    },
    allergens: [],
    cost: 0.15,
    quality: 'standard'
  },
  {
    id: 'blueberries-frozen',
    name: 'Frozen Blueberries',
    category: 'frozen-fruits',
    nutrition: {
      calories: 57,
      protein: 0.7,
      carbs: 14.5,
      fat: 0.3,
      fiber: 2.4,
      sugar: 10.0,
      longevityCompounds: ['anthocyanins', 'vitamin-c', 'antioxidants']
    },
    allergens: [],
    cost: 0.25,
    quality: 'premium'
  },
  {
    id: 'mango-frozen',
    name: 'Frozen Mango',
    category: 'frozen-fruits',
    nutrition: {
      calories: 60,
      protein: 0.8,
      carbs: 15.0,
      fat: 0.4,
      fiber: 1.6,
      sugar: 13.7,
      longevityCompounds: ['vitamin-c', 'beta-carotene', 'antioxidants']
    },
    allergens: [],
    cost: 0.20,
    quality: 'standard'
  },
  {
    id: 'strawberries-frozen',
    name: 'Frozen Strawberries',
    category: 'frozen-fruits',
    nutrition: {
      calories: 32,
      protein: 0.7,
      carbs: 7.7,
      fat: 0.3,
      fiber: 2.0,
      sugar: 4.9,
      longevityCompounds: ['vitamin-c', 'ellagic-acid', 'antioxidants']
    },
    allergens: [],
    cost: 0.22,
    quality: 'standard'
  },

  // Milks
  {
    id: 'oat-milk',
    name: 'Oat Milk',
    category: 'milks',
    nutrition: {
      calories: 43,
      protein: 1.0,
      carbs: 7.0,
      fat: 1.5,
      fiber: 0.8,
      sugar: 2.5,
      longevityCompounds: ['beta-glucan', 'vitamin-d', 'calcium']
    },
    allergens: ['gluten'],
    cost: 0.08,
    quality: 'standard'
  },
  {
    id: 'almond-milk',
    name: 'Almond Milk',
    category: 'milks',
    nutrition: {
      calories: 17,
      protein: 0.6,
      carbs: 1.5,
      fat: 1.1,
      fiber: 0.4,
      sugar: 0.2,
      longevityCompounds: ['vitamin-e', 'magnesium', 'healthy-fats']
    },
    allergens: ['tree-nuts'],
    cost: 0.10,
    quality: 'standard'
  },
  {
    id: 'coconut-milk',
    name: 'Coconut Milk',
    category: 'milks',
    nutrition: {
      calories: 230,
      protein: 2.3,
      carbs: 5.5,
      fat: 23.8,
      fiber: 2.2,
      sugar: 3.3,
      longevityCompounds: ['mct-oil', 'lauric-acid', 'medium-chain-triglycerides']
    },
    allergens: [],
    cost: 0.12,
    quality: 'premium'
  },

  // Yogurts
  {
    id: 'greek-yogurt',
    name: 'Greek Yogurt',
    category: 'yogurts',
    nutrition: {
      calories: 59,
      protein: 10.0,
      carbs: 3.6,
      fat: 0.4,
      fiber: 0.0,
      sugar: 3.6,
      longevityCompounds: ['probiotics', 'protein', 'calcium']
    },
    allergens: ['dairy'],
    cost: 0.18,
    quality: 'premium'
  },
  {
    id: 'coconut-yogurt',
    name: 'Coconut Yogurt',
    category: 'yogurts',
    nutrition: {
      calories: 45,
      protein: 1.0,
      carbs: 4.0,
      fat: 3.0,
      fiber: 0.0,
      sugar: 2.0,
      longevityCompounds: ['probiotics', 'mct-oil', 'healthy-fats']
    },
    allergens: [],
    cost: 0.22,
    quality: 'premium'
  },
  {
    id: 'soy-yogurt',
    name: 'Soy Yogurt',
    category: 'yogurts',
    nutrition: {
      calories: 47,
      protein: 3.0,
      carbs: 4.0,
      fat: 2.0,
      fiber: 0.0,
      sugar: 2.0,
      longevityCompounds: ['probiotics', 'soy-protein', 'isoflavones']
    },
    allergens: ['soy'],
    cost: 0.16,
    quality: 'standard'
  },

  // Superfoods
  {
    id: 'chia-seeds',
    name: 'Chia Seeds',
    category: 'superfoods',
    nutrition: {
      calories: 486,
      protein: 16.5,
      carbs: 42.1,
      fat: 30.7,
      fiber: 34.4,
      sugar: 0.0,
      longevityCompounds: ['omega-3', 'fiber', 'antioxidants', 'protein']
    },
    allergens: [],
    cost: 0.45,
    quality: 'premium'
  },
  {
    id: 'flax-seeds',
    name: 'Flax Seeds',
    category: 'superfoods',
    nutrition: {
      calories: 534,
      protein: 18.3,
      carbs: 28.9,
      fat: 42.2,
      fiber: 27.3,
      sugar: 1.6,
      longevityCompounds: ['omega-3', 'lignans', 'fiber', 'antioxidants']
    },
    allergens: [],
    cost: 0.35,
    quality: 'premium'
  },
  {
    id: 'cacao-powder',
    name: 'Cacao Powder',
    category: 'superfoods',
    nutrition: {
      calories: 228,
      protein: 19.6,
      carbs: 57.9,
      fat: 13.7,
      fiber: 33.2,
      sugar: 1.8,
      longevityCompounds: ['flavonoids', 'theobromine', 'antioxidants', 'magnesium']
    },
    allergens: [],
    cost: 0.60,
    quality: 'premium'
  },
  {
    id: 'ginger-powder',
    name: 'Ginger Powder',
    category: 'superfoods',
    nutrition: {
      calories: 80,
      protein: 1.8,
      carbs: 17.8,
      fat: 0.8,
      fiber: 2.0,
      sugar: 1.7,
      longevityCompounds: ['gingerol', 'anti-inflammatory', 'antioxidants']
    },
    allergens: [],
    cost: 0.80,
    quality: 'premium'
  },
  {
    id: 'oats',
    name: 'Oats',
    category: 'superfoods',
    nutrition: {
      calories: 389,
      protein: 16.9,
      carbs: 66.3,
      fat: 6.9,
      fiber: 10.6,
      sugar: 0.0,
      longevityCompounds: ['beta-glucan', 'fiber', 'protein', 'b-vitamins']
    },
    allergens: ['gluten'],
    cost: 0.12,
    quality: 'standard'
  },

  // Foams
  {
    id: 'aquafaba',
    name: 'Aquafaba',
    category: 'foams',
    nutrition: {
      calories: 3,
      protein: 0.2,
      carbs: 0.6,
      fat: 0.0,
      fiber: 0.0,
      sugar: 0.0,
      longevityCompounds: ['protein', 'minerals']
    },
    allergens: [],
    cost: 0.02,
    quality: 'basic'
  },
  {
    id: 'coconut-cream',
    name: 'Coconut Cream',
    category: 'foams',
    nutrition: {
      calories: 330,
      protein: 3.3,
      carbs: 6.6,
      fat: 35.0,
      fiber: 0.0,
      sugar: 6.6,
      longevityCompounds: ['mct-oil', 'lauric-acid', 'healthy-fats']
    },
    allergens: [],
    cost: 0.15,
    quality: 'premium'
  },

  // Sweeteners
  {
    id: 'honey',
    name: 'Raw Honey',
    category: 'sweeteners',
    nutrition: {
      calories: 304,
      protein: 0.3,
      carbs: 82.4,
      fat: 0.0,
      fiber: 0.2,
      sugar: 82.1,
      longevityCompounds: ['antioxidants', 'enzymes', 'minerals']
    },
    allergens: [],
    cost: 0.25,
    quality: 'premium'
  },
  {
    id: 'maple-syrup',
    name: 'Maple Syrup',
    category: 'sweeteners',
    nutrition: {
      calories: 260,
      protein: 0.0,
      carbs: 67.0,
      fat: 0.0,
      fiber: 0.0,
      sugar: 60.0,
      longevityCompounds: ['antioxidants', 'minerals', 'zinc']
    },
    allergens: [],
    cost: 0.30,
    quality: 'premium'
  },
  // Vegetables
  {
    id: 'spinach',
    name: 'Fresh Spinach',
    category: 'vegetables',
    nutrition: {
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      fiber: 2.2,
      sugar: 0.4,
      longevityCompounds: ['iron', 'magnesium', 'folate', 'vitamin-k', 'antioxidants']
    },
    allergens: [],
    cost: 0.08,
    quality: 'standard'
  }
];
