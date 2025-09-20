import { UserProfile, HealthGoal, Ingredient, GeneratedRecipe, Mood } from '@/lib/types';
import { ingredients } from '@/data/ingredients';

export interface SingleMixRecipe {
  id: string;
  name: string;
  goal: HealthGoal;
  ingredients: SingleMixIngredient[];
  instructions: string[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    longevityCompounds: string[];
  };
  cost: number;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  color: string;
  createdAt: Date;
}

export interface SingleMixIngredient {
  ingredient: Ingredient;
  amount: number;
  unit: string;
  purpose: 'base' | 'protein' | 'superfood' | 'flavor' | 'sweetener' | 'liquid';
}

export class SingleMixRecipeGenerator {
  private ingredients: Ingredient[];

  constructor() {
    this.ingredients = ingredients;
  }

  generateRecipe(userProfile: UserProfile, mood: Mood, goal: HealthGoal): GeneratedRecipe {
    const recipe = this.createSingleMixRecipe(goal, userProfile);
    
    return {
      recipe: {
        id: recipe.id,
        name: recipe.name,
        goal: recipe.goal,
        layers: [], // Empty for single mix
        totalNutrition: recipe.totalNutrition,
        cost: recipe.cost,
        prepTime: recipe.prepTime,
        difficulty: recipe.difficulty,
        createdAt: recipe.createdAt
      },
      singleMixRecipe: recipe,
      userProfile,
      mood,
      shopMatches: [], // Will be populated by shop matching service
      price: recipe.cost,
      generatedAt: new Date()
    };
  }

  private createSingleMixRecipe(goal: HealthGoal, userProfile: UserProfile): SingleMixRecipe {
    const recipeIngredients = this.selectIngredients(goal, userProfile);
    
    const recipe: SingleMixRecipe = {
      id: this.generateRecipeId(),
      name: this.generateRecipeName(goal),
      goal,
      ingredients: recipeIngredients,
      instructions: this.generateInstructions(recipeIngredients),
      totalNutrition: this.calculateTotalNutrition(recipeIngredients),
      cost: 0, // Will be calculated
      prepTime: 3, // Single mix is faster
      difficulty: 'easy',
      servings: 1,
      color: this.getDominantColor(recipeIngredients),
      createdAt: new Date()
    };

    recipe.cost = this.calculateRecipePrice(recipeIngredients);
    return recipe;
  }

  private selectIngredients(goal: HealthGoal, userProfile: UserProfile): SingleMixIngredient[] {
    const ingredients: SingleMixIngredient[] = [];

    // Base fruits (2 types)
    const fruits = this.selectFruits(goal, userProfile);
    fruits.forEach((fruit, index) => {
      ingredients.push({
        ingredient: fruit,
        amount: index === 0 ? 120 : 80, // Primary fruit gets more
        unit: 'g',
        purpose: 'base'
      });
    });

    // Liquid base
    const milk = this.selectMilk(userProfile);
    ingredients.push({
      ingredient: milk,
      amount: 150,
      unit: 'ml',
      purpose: 'liquid'
    });

    // Protein source
    const protein = this.selectProtein(goal, userProfile);
    if (protein) {
      ingredients.push({
        ingredient: protein,
        amount: protein.category === 'yogurts' ? 100 : 20,
        unit: protein.category === 'yogurts' ? 'g' : 'g',
        purpose: 'protein'
      });
    }

    // Superfoods (1-2 types)
    const superfoods = this.selectSuperfoods(goal, userProfile);
    superfoods.forEach(superfood => {
      ingredients.push({
        ingredient: superfood,
        amount: this.getSuperfoodAmount(superfood),
        unit: this.getSuperfoodUnit(superfood),
        purpose: 'superfood'
      });
    });

    // Natural sweetener
    const sweetener = this.selectSweetener(goal, userProfile);
    if (sweetener) {
      ingredients.push({
        ingredient: sweetener,
        amount: 10,
        unit: 'ml',
        purpose: 'sweetener'
      });
    }

    // Flavor enhancer
    const enhancer = this.selectFlavorEnhancer(goal, userProfile);
    if (enhancer) {
      ingredients.push({
        ingredient: enhancer,
        amount: enhancer.id === 'ginger-powder' ? 0.5 : 2,
        unit: enhancer.id === 'ginger-powder' ? 'g' : 'g',
        purpose: 'flavor'
      });
    }

    return ingredients;
  }

  private selectFruits(goal: HealthGoal, userProfile: UserProfile): Ingredient[] {
    const availableFruits = this.ingredients.filter(ing => 
      ing.category === 'frozen-fruits' && 
      !this.hasAllergen(ing, userProfile.allergies) &&
      !userProfile.dislikes.includes(ing.name.toLowerCase())
    );

    const goalFruits: { [key in HealthGoal]: string[] } = {
      'energy-boost': ['banana-frozen', 'mango-frozen'],
      'calm-stomach': ['banana-frozen', 'blueberries-frozen'],
      'meal-replacement': ['banana-frozen', 'strawberries-frozen'],
      'longevity': ['blueberries-frozen', 'strawberries-frozen'],
      'gut-health': ['banana-frozen', 'blueberries-frozen'],
      'brain-health': ['blueberries-frozen', 'mango-frozen'],
      'immune-support': ['strawberries-frozen', 'mango-frozen']
    };

    const preferredFruits = goalFruits[goal];
    const selectedFruits = preferredFruits
      .map(fruitId => availableFruits.find(f => f.id === fruitId))
      .filter(Boolean) as Ingredient[];

    // Fill with available fruits if preferred ones aren't available
    while (selectedFruits.length < 2 && availableFruits.length > selectedFruits.length) {
      const remainingFruits = availableFruits.filter(f => !selectedFruits.includes(f));
      selectedFruits.push(remainingFruits[0]);
    }

    return selectedFruits.slice(0, 2);
  }

  private selectMilk(userProfile: UserProfile): Ingredient {
    const availableMilks = this.ingredients.filter(ing => 
      ing.category === 'milks' && 
      !this.hasAllergen(ing, userProfile.allergies)
    );

    // Prefer almond milk for better taste (based on your feedback)
    const almondMilk = availableMilks.find(m => m.id === 'almond-milk');
    if (almondMilk) return almondMilk;

    // Fallback to coconut milk for creamy texture
    const coconutMilk = availableMilks.find(m => m.id === 'coconut-milk');
    if (coconutMilk) return coconutMilk;

    return availableMilks[0] || this.ingredients.find(ing => ing.id === 'almond-milk')!;
  }

  private selectProtein(goal: HealthGoal, userProfile: UserProfile): Ingredient | null {
    const availableProteins = this.ingredients.filter(ing => 
      (ing.category === 'yogurts' || ing.category === 'proteins') && 
      !this.hasAllergen(ing, userProfile.allergies)
    );

    // For meal replacement, prioritize protein
    if (goal === 'meal-replacement') {
      const greekYogurt = availableProteins.find(p => p.id === 'greek-yogurt');
      if (greekYogurt) return greekYogurt;
    }

    // For other goals, use lighter options
    const coconutYogurt = availableProteins.find(p => p.id === 'coconut-yogurt');
    if (coconutYogurt) return coconutYogurt;

    return availableProteins[0] || null;
  }

  private selectSuperfoods(goal: HealthGoal, userProfile: UserProfile): Ingredient[] {
    const availableSuperfoods = this.ingredients.filter(ing => 
      ing.category === 'superfoods' && 
      !this.hasAllergen(ing, userProfile.allergies)
    );

    const goalSuperfoods: { [key in HealthGoal]: string[] } = {
      'energy-boost': ['oats', 'cacao-powder'],
      'calm-stomach': ['chia-seeds', 'ginger-powder'],
      'meal-replacement': ['chia-seeds', 'oats'],
      'longevity': ['turmeric-powder', 'chia-seeds'],
      'gut-health': ['chia-seeds', 'ginger-powder'],
      'brain-health': ['cacao-powder', 'turmeric-powder'],
      'immune-support': ['ginger-powder', 'turmeric-powder']
    };

    const preferredSuperfoods = goalSuperfoods[goal];
    const selectedSuperfoods = preferredSuperfoods
      .map(superfoodId => availableSuperfoods.find(s => s.id === superfoodId))
      .filter(Boolean) as Ingredient[];

    return selectedSuperfoods.slice(0, 2);
  }

  private selectSweetener(goal: HealthGoal, userProfile: UserProfile): Ingredient | null {
    const availableSweeteners = this.ingredients.filter(ing => 
      (ing.id === 'maple-syrup' || ing.id === 'raw-honey') &&
      !this.hasAllergen(ing, userProfile.allergies)
    );

    // Prefer maple syrup (vegan-friendly)
    const mapleSyrup = availableSweeteners.find(s => s.id === 'maple-syrup');
    if (mapleSyrup) return mapleSyrup;

    return availableSweeteners[0] || null;
  }

  private selectFlavorEnhancer(goal: HealthGoal, userProfile: UserProfile): Ingredient | null {
    const availableEnhancers = this.ingredients.filter(ing => 
      (ing.id === 'ginger-powder' || ing.id === 'cinnamon-powder' || ing.id === 'vanilla-extract') &&
      !this.hasAllergen(ing, userProfile.allergies)
    );

    const goalEnhancers: { [key in HealthGoal]: string[] } = {
      'energy-boost': ['cinnamon-powder'],
      'calm-stomach': ['ginger-powder'],
      'meal-replacement': ['vanilla-extract'],
      'longevity': ['ginger-powder'],
      'gut-health': ['ginger-powder'],
      'brain-health': ['cinnamon-powder'],
      'immune-support': ['ginger-powder']
    };

    const preferredEnhancers = goalEnhancers[goal];
    const selected = preferredEnhancers
      .map(enhancerId => availableEnhancers.find(e => e.id === enhancerId))
      .filter(Boolean) as Ingredient[];

    return selected[0] || null;
  }

  private hasAllergen(ingredient: Ingredient, userAllergies: string[]): boolean {
    return ingredient.allergens.some(allergen => userAllergies.includes(allergen));
  }

  private getSuperfoodAmount(superfood: Ingredient): number {
    const amounts: { [key: string]: number } = {
      'oats': 20, // 20g for thickness
      'chia-seeds': 10, // 10g for omega-3
      'cacao-powder': 5, // 5g for flavor
      'turmeric-powder': 2, // 2g for anti-inflammatory
      'ginger-powder': 1, // 1g for digestive
      'spirulina': 3 // 3g for nutrients
    };
    return amounts[superfood.id] || 5;
  }

  private getSuperfoodUnit(superfood: Ingredient): string {
    return 'g'; // All superfoods measured in grams for precision
  }

  private generateInstructions(ingredients: SingleMixIngredient[]): string[] {
    const instructions = [
      "Add liquid ingredients first: milk and sweetener (if using)",
      "Add soft ingredients: yogurt and any fresh ginger",
      "Add frozen fruits and dry ingredients (oats, powders)",
      "Blend on high speed for 60-90 seconds until completely smooth",
      "Check consistency - add more liquid if too thick",
      "Serve immediately in a chilled glass"
    ];

    // Add specific tips based on ingredients
    const hasOats = ingredients.some(ing => ing.ingredient.id === 'oats');
    if (hasOats) {
      instructions.push("Pro tip: Let sit 2 minutes after blending for oats to fully hydrate");
    }

    const hasChiaSeeds = ingredients.some(ing => ing.ingredient.id === 'chia-seeds');
    if (hasChiaSeeds) {
      instructions.push("Note: Chia seeds will continue to thicken the smoothie over time");
    }

    return instructions;
  }

  private getDominantColor(ingredients: SingleMixIngredient[]): string {
    // Get color from primary fruit
    const primaryFruit = ingredients.find(ing => ing.purpose === 'base');
    if (!primaryFruit) return '#7c3aed';

    const colorMap: { [key: string]: string } = {
      'Frozen Banana': '#fbbf24',
      'Frozen Blueberries': '#7c3aed',
      'Frozen Mango': '#f59e0b',
      'Frozen Strawberries': '#ef4444'
    };

    return colorMap[primaryFruit.ingredient.name] || '#7c3aed';
  }

  private generateRecipeName(goal: HealthGoal): string {
    const nameMap: { [key in HealthGoal]: string } = {
      'energy-boost': 'Morning Energy Smoothie',
      'calm-stomach': 'Gentle Digestive Smoothie',
      'meal-replacement': 'Complete Meal Smoothie',
      'longevity': 'Anti-Aging Power Smoothie',
      'gut-health': 'Probiotic Gut Smoothie',
      'brain-health': 'Cognitive Boost Smoothie',
      'immune-support': 'Immunity Shield Smoothie'
    };
    return nameMap[goal];
  }

  private generateRecipeId(): string {
    return `single-mix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateTotalNutrition(ingredients: SingleMixIngredient[]) {
    let totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      longevityCompounds: [] as string[]
    };

    ingredients.forEach(singleMixIngredient => {
      const nutrition = singleMixIngredient.ingredient.nutrition;
      const amount = singleMixIngredient.amount;
      const multiplier = amount / 100; // Assuming nutrition is per 100g/ml

      totalNutrition.calories += nutrition.calories * multiplier;
      totalNutrition.protein += nutrition.protein * multiplier;
      totalNutrition.carbs += nutrition.carbs * multiplier;
      totalNutrition.fat += nutrition.fat * multiplier;
      totalNutrition.fiber += nutrition.fiber * multiplier;
      totalNutrition.sugar += nutrition.sugar * multiplier;
      
      nutrition.longevityCompounds.forEach(compound => {
        if (!totalNutrition.longevityCompounds.includes(compound)) {
          totalNutrition.longevityCompounds.push(compound);
        }
      });
    });

    return totalNutrition;
  }

  private calculateRecipePrice(ingredients: SingleMixIngredient[]): number {
    let totalPrice = 0;

    ingredients.forEach(singleMixIngredient => {
      const cost = singleMixIngredient.ingredient.cost;
      const amount = singleMixIngredient.amount;
      const price = cost * (amount / 100); // Cost is per 100g/ml
      totalPrice += price;
    });

    return Math.round(totalPrice * 100) / 100; // Round to 2 decimal places
  }
}
