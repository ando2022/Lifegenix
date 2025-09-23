import { Shop } from '@/lib/types';

export const zurichShops: Shop[] = [
  {
    id: 'juicery-21',
    name: 'Juicery 21',
    address: 'Sihlstrasse 93, 8001 Zürich',
    city: 'Zürich',
    coordinates: { lat: 47.3769, lng: 8.5417 },
    description: 'Trendy juice bar with plant-filled interior and outdoor seating',
    menu: [
      {
        id: 'green-detox',
        name: 'Green Detox',
        ingredients: ['spinach', 'ginger', 'apple', 'lemon'],
        price: 12.50,
        category: 'smoothie',
        healthBenefits: ['detox', 'immune-support', 'energy'],
        moodTargets: ['tired', 'stressed', 'bloated']
      },
      {
        id: 'berry-blast',
        name: 'Berry Blast Acai Bowl',
        ingredients: ['acai', 'blueberries-frozen', 'banana-frozen', 'granola'],
        price: 15.00,
        category: 'bowl',
        healthBenefits: ['antioxidants', 'brain-health', 'energy'],
        moodTargets: ['focused', 'energized', 'active']
      }
    ],
    capabilities: {
      hasFrozenFruits: ['banana-frozen', 'mango-frozen', 'blueberries-frozen', 'strawberries-frozen'],
      hasMilks: ['oat-milk', 'almond-milk', 'coconut-milk'],
      hasYogurts: ['coconut-yogurt', 'greek-yogurt'],
      hasSuperfoods: ['chia-seeds', 'cacao-powder', 'ginger-powder', 'spirulina'],
      hasFoams: ['coconut-cream'],
      canMakeLayered: true,
      prepTime: 5
    },
    rating: 4.8,
    specialties: ['detox', 'immune-support', 'energy-boost'],
    healthFocus: ['longevity', 'gut-health', 'brain-health']
  },
  {
    id: 'roots-zurich',
    name: 'roots',
    address: 'Münstergasse 4, 8001 Zürich',
    city: 'Zürich',
    coordinates: { lat: 47.3729, lng: 8.5437 },
    description: 'Vegan café chain with wide selection of fresh smoothies and plant-based meals',
    menu: [
      {
        id: 'peanut-cacao-shake',
        name: 'Peanut Butter & Cacao Shake',
        ingredients: ['peanut-butter', 'cacao-powder', 'banana-frozen', 'oat-milk'],
        price: 11.50,
        category: 'smoothie',
        healthBenefits: ['protein', 'brain-health', 'energy'],
        moodTargets: ['hungry', 'focused', 'active']
      },
      {
        id: 'green-power',
        name: 'Green Power Smoothie',
        ingredients: ['spinach', 'kale', 'apple', 'ginger', 'lemon'],
        price: 10.00,
        category: 'smoothie',
        healthBenefits: ['detox', 'immune-support', 'energy'],
        moodTargets: ['tired', 'stressed', 'bloated']
      }
    ],
    capabilities: {
      hasFrozenFruits: ['banana-frozen', 'mango-frozen', 'blueberries-frozen', 'strawberries-frozen'],
      hasMilks: ['oat-milk', 'almond-milk', 'coconut-milk'],
      hasYogurts: ['coconut-yogurt', 'greek-yogurt'],
      hasSuperfoods: ['chia-seeds', 'cacao-powder', 'ginger-powder', 'spirulina', 'maca-powder'],
      hasFoams: ['coconut-cream'],
      canMakeLayered: false,
      prepTime: 4
    },
    rating: 4.6,
    specialties: ['protein', 'brain-health', 'vegan'],
    healthFocus: ['brain-health', 'immune-support', 'energy']
  },
  {
    id: 'saftlade',
    name: 'Saftlade',
    address: 'Münstergasse 31, 8001 Zürich',
    city: 'Zürich',
    coordinates: { lat: 47.3739, lng: 8.5447 },
    description: 'Switzerland\'s oldest juice bar, specializing in cold-pressed juices and nutrient-packed smoothies',
    menu: [
      {
        id: 'carrot-orange-ginger',
        name: 'Carrot Orange Ginger',
        ingredients: ['carrot', 'orange', 'ginger', 'lemon'],
        price: 9.50,
        category: 'juice',
        healthBenefits: ['immune-support', 'energy', 'detox'],
        moodTargets: ['tired', 'stressed', 'energized']
      },
      {
        id: 'seasonal-smoothie',
        name: 'Seasonal Smoothie Special',
        ingredients: ['seasonal-fruits', 'spinach', 'ginger', 'coconut-milk'],
        price: 11.00,
        category: 'smoothie',
        healthBenefits: ['antioxidants', 'immune-support', 'energy'],
        moodTargets: ['energized', 'focused', 'relaxed']
      }
    ],
    capabilities: {
      hasFrozenFruits: ['banana-frozen', 'mango-frozen', 'blueberries-frozen', 'strawberries-frozen'],
      hasMilks: ['oat-milk', 'almond-milk', 'coconut-milk'],
      hasYogurts: ['coconut-yogurt', 'greek-yogurt'],
      hasSuperfoods: ['chia-seeds', 'cacao-powder', 'ginger-powder', 'spirulina'],
      hasFoams: ['coconut-cream'],
      canMakeLayered: false,
      prepTime: 3
    },
    rating: 4.9,
    specialties: ['cold-pressed', 'local-ingredients', 'seasonal'],
    healthFocus: ['immune-support', 'detox', 'longevity']
  },
  {
    id: 'dabo-smoothies',
    name: 'Dabó Smoothies',
    address: 'Birmensdorferstrasse 285, 8055 Zürich',
    city: 'Zürich',
    coordinates: { lat: 47.3569, lng: 8.5317 },
    description: 'Dedicated smoothie and acai bowl bar with vegan snacks and superfood blends',
    menu: [
      {
        id: 'berry-antioxidant',
        name: 'Berry Antioxidant',
        ingredients: ['mixed-berries-frozen', 'banana-frozen', 'flax-seeds', 'coconut-milk'],
        price: 13.50,
        category: 'smoothie',
        healthBenefits: ['antioxidants', 'brain-health', 'heart-health'],
        moodTargets: ['focused', 'energized', 'relaxed']
      },
      {
        id: 'superfood-blend',
        name: 'Superfood Blend',
        ingredients: ['acai', 'spirulina', 'chia-seeds', 'banana-frozen', 'coconut-milk'],
        price: 14.00,
        category: 'smoothie',
        healthBenefits: ['antioxidants', 'protein', 'energy', 'longevity'],
        moodTargets: ['energized', 'focused', 'active']
      }
    ],
    capabilities: {
      hasFrozenFruits: ['banana-frozen', 'mango-frozen', 'blueberries-frozen', 'strawberries-frozen', 'mixed-berries-frozen'],
      hasMilks: ['oat-milk', 'almond-milk', 'coconut-milk'],
      hasYogurts: ['coconut-yogurt', 'greek-yogurt'],
      hasSuperfoods: ['chia-seeds', 'cacao-powder', 'ginger-powder', 'spirulina', 'flaxseed', 'maca-powder'],
      hasFoams: ['coconut-cream'],
      canMakeLayered: false,
      prepTime: 6
    },
    rating: 4.7,
    specialties: ['superfoods', 'antioxidants', 'vegan'],
    healthFocus: ['longevity', 'brain-health', 'antioxidants']
  },
  {
    id: 'joe-juice-zurich',
    name: 'Joe & The Juice',
    address: 'Kalandergasse 4, 8045 Zürich',
    city: 'Zürich',
    coordinates: { lat: 47.3669, lng: 8.5517 },
    description: 'Scandinavian juice bar chain with hip vibe and made-to-order smoothies',
    menu: [
      {
        id: 'iron-man',
        name: 'Iron Man',
        ingredients: ['strawberry', 'kiwi', 'apple', 'ginger'],
        price: 10.50,
        category: 'smoothie',
        healthBenefits: ['energy', 'immune-support', 'vitamins'],
        moodTargets: ['energized', 'active', 'focused']
      },
      {
        id: 'green-mile',
        name: 'Green Mile',
        ingredients: ['avocado', 'apple', 'spinach', 'ginger'],
        price: 12.00,
        category: 'smoothie',
        healthBenefits: ['healthy-fats', 'energy', 'detox'],
        moodTargets: ['hungry', 'focused', 'energized']
      }
    ],
    capabilities: {
      hasFrozenFruits: ['banana-frozen', 'mango-frozen', 'blueberries-frozen', 'strawberries-frozen'],
      hasMilks: ['oat-milk', 'almond-milk', 'coconut-milk'],
      hasYogurts: ['coconut-yogurt', 'greek-yogurt'],
      hasSuperfoods: ['chia-seeds', 'cacao-powder', 'ginger-powder'],
      hasFoams: ['coconut-cream'],
      canMakeLayered: false,
      prepTime: 4
    },
    rating: 4.5,
    specialties: ['energy', 'vitamins', 'fresh-ingredients'],
    healthFocus: ['energy', 'immune-support', 'vitamins']
  }
];
