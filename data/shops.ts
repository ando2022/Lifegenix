import { Shop } from '@/lib/types';

export const shops: Shop[] = [
  {
    id: 'greenbar-zurich',
    name: 'GreenBar Zurich',
    address: 'Bahnhofstrasse 45, 8001 Zürich',
    city: 'Zürich',
    coordinates: { lat: 47.3769, lng: 8.5417 },
    menu: [
      {
        id: 'green-smoothie',
        name: 'Green Detox Smoothie',
        ingredients: ['spinach', 'banana', 'mango', 'coconut-milk'],
        price: 8.50,
        category: 'smoothie'
      },
      {
        id: 'berry-bowl',
        name: 'Acai Berry Bowl',
        ingredients: ['acai', 'banana', 'blueberries', 'granola'],
        price: 12.00,
        category: 'bowl'
      }
    ],
    capabilities: {
      hasFrozenFruits: ['banana', 'mango', 'blueberries', 'strawberries'],
      hasMilks: ['oat-milk', 'almond-milk', 'coconut-milk'],
      hasYogurts: ['coconut-yogurt', 'greek-yogurt'],
      hasSuperfoods: ['chia-seeds', 'cacao-powder', 'ginger-powder'],
      hasFoams: ['coconut-cream'],
      canMakeLayered: true,
      prepTime: 5
    },
    rating: 4.8
  },
  {
    id: 'juice-bar-basel',
    name: 'Juice Bar Basel',
    address: 'Freie Strasse 12, 4001 Basel',
    city: 'Basel',
    coordinates: { lat: 47.5596, lng: 7.5886 },
    menu: [
      {
        id: 'tropical-smoothie',
        name: 'Tropical Paradise',
        ingredients: ['mango', 'pineapple', 'coconut-milk', 'banana'],
        price: 7.50,
        category: 'smoothie'
      },
      {
        id: 'protein-smoothie',
        name: 'Protein Power',
        ingredients: ['banana', 'protein-powder', 'almond-milk', 'peanut-butter'],
        price: 9.00,
        category: 'smoothie'
      }
    ],
    capabilities: {
      hasFrozenFruits: ['banana', 'mango', 'pineapple', 'strawberries'],
      hasMilks: ['oat-milk', 'almond-milk', 'dairy-milk'],
      hasYogurts: ['greek-yogurt', 'soy-yogurt'],
      hasSuperfoods: ['chia-seeds', 'flax-seeds', 'protein-powder'],
      hasFoams: ['aquafaba', 'whipped-cream'],
      canMakeLayered: false,
      prepTime: 3
    },
    rating: 4.6
  },
  {
    id: 'healthy-cafe-geneva',
    name: 'Healthy Café Geneva',
    address: 'Rue du Rhône 8, 1204 Genève',
    city: 'Genève',
    coordinates: { lat: 46.2044, lng: 6.1432 },
    menu: [
      {
        id: 'antioxidant-smoothie',
        name: 'Antioxidant Boost',
        ingredients: ['blueberries', 'acai', 'banana', 'oat-milk'],
        price: 8.00,
        category: 'smoothie'
      },
      {
        id: 'green-juice',
        name: 'Green Cleanse',
        ingredients: ['kale', 'cucumber', 'apple', 'ginger'],
        price: 6.50,
        category: 'juice'
      }
    ],
    capabilities: {
      hasFrozenFruits: ['banana', 'blueberries', 'strawberries', 'mango'],
      hasMilks: ['oat-milk', 'almond-milk', 'coconut-milk'],
      hasYogurts: ['coconut-yogurt', 'greek-yogurt'],
      hasSuperfoods: ['chia-seeds', 'cacao-powder', 'ginger-powder', 'oats'],
      hasFoams: ['coconut-cream', 'aquafaba'],
      canMakeLayered: true,
      prepTime: 7
    },
    rating: 4.7
  },
  {
    id: 'smoothie-king-bern',
    name: 'Smoothie King Bern',
    address: 'Marktgasse 15, 3011 Bern',
    city: 'Bern',
    coordinates: { lat: 46.9481, lng: 7.4474 },
    menu: [
      {
        id: 'energy-smoothie',
        name: 'Energy Blast',
        ingredients: ['banana', 'mango', 'oats', 'honey'],
        price: 7.00,
        category: 'smoothie'
      },
      {
        id: 'detox-smoothie',
        name: 'Detox Delight',
        ingredients: ['spinach', 'apple', 'ginger', 'lemon'],
        price: 6.50,
        category: 'smoothie'
      }
    ],
    capabilities: {
      hasFrozenFruits: ['banana', 'mango', 'strawberries', 'blueberries'],
      hasMilks: ['oat-milk', 'almond-milk', 'dairy-milk'],
      hasYogurts: ['greek-yogurt', 'soy-yogurt'],
      hasSuperfoods: ['chia-seeds', 'oats', 'ginger-powder'],
      hasFoams: ['whipped-cream'],
      canMakeLayered: false,
      prepTime: 4
    },
    rating: 4.5
  },
  {
    id: 'vitality-bar-lausanne',
    name: 'Vitality Bar Lausanne',
    address: 'Place Saint-François 8, 1003 Lausanne',
    city: 'Lausanne',
    coordinates: { lat: 46.5197, lng: 6.6323 },
    menu: [
      {
        id: 'superfood-smoothie',
        name: 'Superfood Power',
        ingredients: ['acai', 'blueberries', 'chia-seeds', 'coconut-milk'],
        price: 9.50,
        category: 'smoothie'
      },
      {
        id: 'protein-bowl',
        name: 'Protein Paradise',
        ingredients: ['greek-yogurt', 'banana', 'berries', 'granola'],
        price: 11.00,
        category: 'bowl'
      }
    ],
    capabilities: {
      hasFrozenFruits: ['banana', 'blueberries', 'strawberries', 'mango', 'pineapple'],
      hasMilks: ['oat-milk', 'almond-milk', 'coconut-milk'],
      hasYogurts: ['greek-yogurt', 'coconut-yogurt', 'soy-yogurt'],
      hasSuperfoods: ['chia-seeds', 'flax-seeds', 'cacao-powder', 'ginger-powder', 'oats'],
      hasFoams: ['coconut-cream', 'aquafaba'],
      canMakeLayered: true,
      prepTime: 6
    },
    rating: 4.9
  }
];
