export interface UserProfile {
  id: string;
  name?: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  location?: {
    city: string;
    coordinates: { lat: number; lng: number };
  };
  allergies: string[];
  intolerances: string[];
  diet: 'vegan' | 'vegetarian' | 'dairy-free' | 'gluten-free' | 'paleo' | 'keto' | 'none';
  goals: HealthGoal[];
  dislikes: string[];
  sweetnessTolerance: 'low' | 'medium' | 'high';
  texturePreference: 'layered' | 'single-blend';
  budget: 'basic' | 'premium' | 'luxury';
  timeOfDay: 'morning' | 'lunch' | 'afternoon' | 'evening';
  activityLevel: 'sedentary' | 'moderate' | 'active' | 'athlete';
  flavorPreferences: {
    sweet: number; // 0-10
    sour: number;
    bitter: number;
    umami: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type HealthGoal = 'energy-boost' | 'calm-stomach' | 'meal-replacement' | 'longevity' | 'gut-health' | 'brain-health' | 'immune-support';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  nutrition: NutritionInfo;
  allergens: string[];
  cost: number; // CHF per 100g
  quality: 'premium' | 'standard' | 'basic';
}

export type IngredientCategory = 
  | 'frozen-fruits' 
  | 'milks' 
  | 'yogurts' 
  | 'superfoods' 
  | 'foams' 
  | 'sweeteners';

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  longevityCompounds: string[];
}

export interface Recipe {
  id: string;
  name: string;
  goal: HealthGoal;
  layers: RecipeLayer[];
  totalNutrition: NutritionInfo;
  cost: number;
  prepTime: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}

export interface RecipeLayer {
  id: string;
  name: string;
  type: 'base' | 'gradient' | 'foam';
  ingredients: LayerIngredient[];
  instructions: string;
  color: string;
  thickness: 'thick' | 'medium' | 'thin';
}

export interface LayerIngredient {
  ingredient: Ingredient;
  amount: number; // grams or ml
  unit: 'g' | 'ml' | 'tsp' | 'tbsp' | 'cup';
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  menu: ShopMenuItem[];
  capabilities: ShopCapabilities;
  rating: number;
  distance?: number; // km from user
  matchScore?: number; // 0-100%
}

export interface ShopMenuItem {
  id: string;
  name: string;
  ingredients: string[];
  price: number;
  category: 'smoothie' | 'juice' | 'bowl' | 'other';
}

export interface ShopCapabilities {
  hasFrozenFruits: string[];
  hasMilks: string[];
  hasYogurts: string[];
  hasSuperfoods: string[];
  hasFoams: string[];
  canMakeLayered: boolean;
  prepTime: number; // minutes
}

export interface Mood {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  recommendedGoals: HealthGoal[];
}

export interface GeneratedRecipe {
  recipe: Recipe;
  userProfile: UserProfile;
  mood: Mood;
  shopMatches: ShopMatch[];
  price: number;
  generatedAt: Date;
}

export interface ShopMatch {
  shop: Shop;
  matchScore: number;
  missingIngredients: string[];
  suggestedSwaps: string[];
  estimatedPrice: number;
  prepTime: number;
}

export interface Order {
  id: string;
  userId: string;
  recipeId: string;
  shopId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  totalPrice: number;
  estimatedReadyTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

// New types for enhanced user flow
export interface Enhancement {
  id: string;
  name: string;
  description: string;
  cost: number; // CHF
  healthImpact: {
    energy: number;
    calm: number;
    meal: number;
    longevity: number;
  };
  allergens: string[];
  category: 'protein' | 'superfood' | 'vitamin' | 'mineral';
}

export interface ShopRecommendation {
  shop: Shop;
  matchScore: number; // 0-100%
  compatibleSmoothies: ShopMenuItem[];
  enhancements: Enhancement[];
  totalCost: number;
  allergens: string[];
  healthImpact: {
    energy: number;
    calm: number;
    meal: number;
    longevity: number;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number; // CHF per week
  smoothiesPerWeek: number;
  includes: string[];
  delivery: boolean;
  pickup: boolean;
  customization: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  shopId?: string;
  status: 'active' | 'paused' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  nextDelivery: Date;
  preferences: {
    days: string[];
    timeSlots: string[];
    allergies: string[];
    goals: HealthGoal[];
  };
}

export interface RecipeRecommendation {
  recipe: Recipe;
  matchScore: number;
  cost: number;
  prepTime: number;
  healthImpact: {
    energy: number;
    calm: number;
    meal: number;
    longevity: number;
  };
  shoppingList: ShoppingItem[];
  substitutions: IngredientSubstitution[];
}

export interface ShoppingItem {
  ingredient: string;
  amount: number;
  unit: string;
  estimatedCost: number;
  store: string;
  category: string;
}

export interface IngredientSubstitution {
  original: string;
  substitute: string;
  reason: 'allergy' | 'preference' | 'availability' | 'cost';
  healthImpact: number; // -2 to +2
}

export interface UserFlowResult {
  userProfile: UserProfile;
  shopRecommendations: ShopRecommendation[];
  recipeRecommendations: RecipeRecommendation[];
  subscriptionPlans: SubscriptionPlan[];
  selectedPath?: 'shop' | 'recipe' | 'subscription';
}
