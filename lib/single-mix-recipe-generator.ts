import { UserProfile, HealthGoal, Ingredient, GeneratedRecipe, Mood } from '@/lib/types';

interface SingleMixIngredient {
  ingredient: Ingredient;
  amount: number;
  unit: string;
  purpose: "base" | "protein" | "superfood" | "flavor" | "sweetener" | "liquid";
}
import { ingredients } from '@/data/ingredients';
import { pickCuratedForGoal } from '@/lib/curated-library';

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

  generateRecipe(userProfile: UserProfile, mood: string, goal: HealthGoal, sleepQuality?: number): GeneratedRecipe {
    const recipe = this.createSingleMixRecipe(goal, userProfile, mood, sleepQuality);
    
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
      mood: mood as Mood,
      shopMatches: [], // Will be populated by shop matching service
      price: recipe.cost,
      generatedAt: new Date()
    };
  }

  private createSingleMixRecipe(goal: HealthGoal, userProfile: UserProfile, mood: string, sleepQuality?: number): SingleMixRecipe {
    const recipeIngredients = this.selectIngredients(goal, userProfile, mood, sleepQuality);
    
    const recipe: SingleMixRecipe = {
      id: this.generateRecipeId(),
      name: this.generateRecipeName(goal, mood, userProfile),
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

  private selectIngredients(goal: HealthGoal, userProfile: UserProfile, mood: string, sleepQuality?: number): SingleMixIngredient[] {
    // Safety check - ensure userProfile is valid
    if (!userProfile) {
      console.warn('UserProfile is undefined, using default values');
      userProfile = {
        allergies: [],
        intolerances: [],
        goals: [],
        dislikes: [],
        diet: 'balanced',
        sweetnessTolerance: 'medium'
      } as UserProfile;
    }
    
    let selected: SingleMixIngredient[] = [];
    
    // 1. BASE INGREDIENTS - Always start with a solid foundation
    selected = [...selected, ...this.getBaseIngredients(userProfile, mood, sleepQuality)];
    
    // 2. MOOD-SPECIFIC INGREDIENTS - Address current emotional state
    selected = [...selected, ...this.getMoodSpecificIngredients(mood, goal, sleepQuality)];
    
    // 3. HEALTH GOAL INGREDIENTS - Target specific health objectives
    selected = [...selected, ...this.getHealthGoalIngredients(userProfile.goals, goal)];
    
    // 4. SLEEP QUALITY INGREDIENTS - Address sleep recovery or optimization
    selected = [...selected, ...this.getSleepQualityIngredients(sleepQuality, mood)];
    
    // 5. ALLERGY/INTOLERANCE SUBSTITUTIONS - Replace problematic ingredients
    selected = this.applyAllergySubstitutions(selected, userProfile);
    
    // 6. DIETARY PREFERENCE ADJUSTMENTS - Honor user's dietary choices
    selected = this.applyDietaryPreferences(selected, userProfile);
    
    // 7. NUTRIENT GAPS FILLING - Ensure comprehensive nutrition
    selected = [...selected, ...this.fillNutrientGaps(selected, userProfile, goal)];
    
    // 8. BALANCE AND OPTIMIZATION - Final adjustments for taste and nutrition
    selected = this.optimizeIngredientBalance(selected, userProfile, mood, sleepQuality);
    
    // Filter out any null ingredients and return
    return selected.filter(item => item.ingredient);
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

  private lookup(id: string): Ingredient {
    // Resolve common synonyms and legacy IDs to existing database IDs
    const synonymMap: Record<string, string> = {
      // fruits
      'banana': 'banana-frozen',
      'blueberries': 'blueberries-frozen',
      'strawberries': 'strawberries-frozen',
      'mango': 'mango-frozen',
      'pineapple': 'pineapple-frozen',
      'mixed-berries': 'mixed-berries-frozen',
      // nuts/seeds
      'walnuts': 'chia-seeds',
      // proteins/sweeteners/flavors
      'protein-powder': 'greek-yogurt',
      'honey': 'raw-honey',
      'vanilla-extract': 'cinnamon-powder',
      'chamomile': 'ginger-powder'
    };

    const tryIds = [id, synonymMap[id]].filter(Boolean) as string[];
    for (const tryId of tryIds) {
      const foundExact = this.ingredients.find(i => i.id === tryId);
      if (foundExact) return foundExact;
    }

    // Heuristic fallbacks by hint words
    const idLower = id.toLowerCase();
    const byHints: Array<{hint: string, fallback: string}> = [
      { hint: 'milk', fallback: 'oat-milk' },
      { hint: 'yogurt', fallback: 'coconut-yogurt' },
      { hint: 'berry', fallback: 'blueberries-frozen' },
      { hint: 'banana', fallback: 'banana-frozen' },
      { hint: 'mango', fallback: 'mango-frozen' },
      { hint: 'strawberry', fallback: 'strawberries-frozen' },
      { hint: 'pineapple', fallback: 'pineapple-frozen' },
      { hint: 'powder', fallback: 'ginger-powder' },
      { hint: 'seed', fallback: 'chia-seeds' },
      { hint: 'honey', fallback: 'maple-syrup' },
    ];
    for (const { hint, fallback } of byHints) {
      if (idLower.includes(hint)) {
        const found = this.ingredients.find(i => i.id === fallback);
        if (found) return found;
      }
    }

    // Ultimate safe fallback to avoid runtime crashes
    const fallbacks = ['banana-frozen', 'oat-milk', 'ginger-powder', 'chia-seeds', 'coconut-yogurt', 'maple-syrup'];
    for (const fb of fallbacks) {
      const found = this.ingredients.find(i => i.id === fb);
      if (found) {
        console.warn(`Ingredient not found: ${id}. Using fallback: ${fb}`);
        return found;
      }
    }

    // As a last resort, return the first ingredient in the database
    return this.ingredients[0];
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

  // 1. BASE INGREDIENTS - Always start with a solid foundation
  private getBaseIngredients(userProfile: UserProfile, mood: string, sleepQuality?: number): SingleMixIngredient[] {
    const baseIngredients: SingleMixIngredient[] = [];
    
    // Always include a liquid base
    const liquid = this.getSafeLiquid(userProfile);
    if (liquid) {
      baseIngredients.push({ ingredient: liquid, amount: 1, unit: 'cup', purpose: 'liquid' });
    }
    
    // Add a primary fruit for taste and nutrition
    const primaryFruit = this.getPrimaryFruit(userProfile, mood);
    if (primaryFruit) {
      baseIngredients.push({ ingredient: primaryFruit, amount: 0.5, unit: 'cup', purpose: 'base' });
    }
    
    return baseIngredients;
  }

  // 2. MOOD-SPECIFIC INGREDIENTS - Address current emotional state
  private getMoodSpecificIngredients(mood: string, goal: HealthGoal, sleepQuality?: number): SingleMixIngredient[] {
    const hour = new Date().getHours();
    const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 18 ? 'afternoon' : 'evening';
    
    const moodIngredients: SingleMixIngredient[] = [];
    
    // Mood-specific ingredient additions
    if (mood === 'tired') {
      // Add energizing ingredients
      const banana = this.lookup('banana-frozen');
      const spinach = this.lookup('spinach');
      if (banana) moodIngredients.push({ ingredient: banana, amount: 0.5, unit: 'medium', purpose: 'base' });
      if (spinach) moodIngredients.push({ ingredient: spinach, amount: 1, unit: 'cup', purpose: 'superfood' });
    }
    
    if (mood === 'stressed') {
      // Add calming-friendly flavors using existing ingredients
      const vanilla = this.lookup('vanilla-extract');
      const ginger = this.lookup('ginger-powder');
      if (vanilla) moodIngredients.push({ ingredient: vanilla, amount: 0.25, unit: 'tsp', purpose: 'flavor' });
      if (ginger) moodIngredients.push({ ingredient: ginger, amount: 0.25, unit: 'tsp', purpose: 'flavor' });
    }
    
    if (mood === 'hungry') {
      // Add satiating ingredients
      const chia = this.lookup('chia-seeds');
      const protein = this.lookup('greek-yogurt');
      if (chia) moodIngredients.push({ ingredient: chia, amount: 1, unit: 'tbsp', purpose: 'superfood' });
      if (protein) moodIngredients.push({ ingredient: protein, amount: 1, unit: 'scoop', purpose: 'protein' });
    }
    
    if (mood === 'focused') {
      // Add brain-boosting ingredients
      const blueberries = this.lookup('blueberries-frozen');
      const chiaSeeds = this.lookup('chia-seeds');
      if (blueberries) moodIngredients.push({ ingredient: blueberries, amount: 0.5, unit: 'cup', purpose: 'base' });
      if (chiaSeeds) moodIngredients.push({ ingredient: chiaSeeds, amount: 1, unit: 'tbsp', purpose: 'superfood' });
    }
    
    // Sleep quality specific additions
    if (sleepQuality && sleepQuality <= 2) {
      // Add recovery ingredients for poor sleep
      const cacao = this.lookup('cacao-powder'); // Contains magnesium
      const chia = this.lookup('chia-seeds'); // Contains B-vitamins and minerals
      if (cacao) moodIngredients.push({ ingredient: cacao, amount: 1, unit: 'tsp', purpose: 'superfood' });
      if (chia) moodIngredients.push({ ingredient: chia, amount: 1, unit: 'tbsp', purpose: 'superfood' });
    }
    
    if (sleepQuality && sleepQuality >= 3) {
      // Add optimization ingredients for good sleep
      const greekYogurt = this.lookup('greek-yogurt'); // High protein
      const flaxSeeds = this.lookup('flax-seeds'); // Contains omega-3
      if (greekYogurt) moodIngredients.push({ ingredient: greekYogurt, amount: 0.5, unit: 'cup', purpose: 'protein' });
      if (flaxSeeds) moodIngredients.push({ ingredient: flaxSeeds, amount: 1, unit: 'tbsp', purpose: 'superfood' });
    }

    // Time-of-day specific additions
    if (timeOfDay === 'evening' && (mood === 'stressed' || mood === 'tired')) {
      // Add sleep-supporting ingredients
      const cacao = this.lookup('cacao-powder'); // Contains magnesium for relaxation
      if (cacao) moodIngredients.push({ ingredient: cacao, amount: 1, unit: 'tsp', purpose: 'superfood' });
    }
    
    if (timeOfDay === 'morning' && mood === 'tired') {
      // Add morning energizers
      const ginger = this.lookup('ginger-powder'); // Natural energizer
      if (ginger) moodIngredients.push({ ingredient: ginger, amount: 0.5, unit: 'tsp', purpose: 'flavor' });
    }
    
    return moodIngredients;
  }

  // 3. HEALTH GOAL INGREDIENTS - Target specific health objectives
  private getHealthGoalIngredients(goals: string[], goal: HealthGoal): SingleMixIngredient[] {
    const goalIngredients: SingleMixIngredient[] = [];
    
    // Ensure goals is an array
    const safeGoals = Array.isArray(goals) ? goals : [];
    
    // Energy goals
    if (safeGoals.includes('Energy') || goal === 'energy-boost') {
      const banana = this.lookup('banana-frozen');
      const oats = this.lookup('oats');
      if (banana) goalIngredients.push({ ingredient: banana, amount: 0.5, unit: 'medium', purpose: 'base' });
      if (oats) goalIngredients.push({ ingredient: oats, amount: 2, unit: 'tbsp', purpose: 'superfood' });
    }
    
    // Detox goals
    if (safeGoals.includes('Detox') || goal === 'gut-health') {
      const ginger = this.lookup('ginger-powder');
      const chia = this.lookup('chia-seeds');
      if (ginger) goalIngredients.push({ ingredient: ginger, amount: 0.5, unit: 'tsp', purpose: 'flavor' });
      if (chia) goalIngredients.push({ ingredient: chia, amount: 1, unit: 'tbsp', purpose: 'superfood' });
    }
    
    // Longevity goals
    if (safeGoals.includes('Longevity') || goal === 'longevity') {
      const cacao = this.lookup('cacao-powder');
      const flax = this.lookup('flax-seeds');
      if (cacao) goalIngredients.push({ ingredient: cacao, amount: 1, unit: 'tsp', purpose: 'superfood' });
      if (flax) goalIngredients.push({ ingredient: flax, amount: 1, unit: 'tbsp', purpose: 'superfood' });
    }
    
    // Focus goals
    if (safeGoals.includes('Focus') || goal === 'brain-health') {
      const blueberries = this.lookup('blueberries-frozen');
      const chia = this.lookup('chia-seeds');
      if (blueberries) goalIngredients.push({ ingredient: blueberries, amount: 0.5, unit: 'cup', purpose: 'base' });
      if (chia) goalIngredients.push({ ingredient: chia, amount: 1, unit: 'tbsp', purpose: 'superfood' });
    }
    
    // Immune goals
    if (safeGoals.includes('Immune') || goal === 'immune-support') {
      const ginger = this.lookup('ginger-powder');
      const strawberries = this.lookup('strawberries-frozen');
      if (ginger) goalIngredients.push({ ingredient: ginger, amount: 0.5, unit: 'tsp', purpose: 'flavor' });
      if (strawberries) goalIngredients.push({ ingredient: strawberries, amount: 0.5, unit: 'cup', purpose: 'base' });
    }
    
    return goalIngredients;
  }

  // 4. SLEEP QUALITY INGREDIENTS - Address sleep recovery or optimization
  private getSleepQualityIngredients(sleepQuality?: number, mood?: string): SingleMixIngredient[] {
    const sleepIngredients: SingleMixIngredient[] = [];
    
    if (sleepQuality && sleepQuality <= 2) {
      // Poor sleep - recovery ingredients
      const cacao = this.lookup('cacao-powder'); // Magnesium
      const chia = this.lookup('chia-seeds'); // B-vitamins
      if (cacao) sleepIngredients.push({ ingredient: cacao, amount: 1, unit: 'tsp', purpose: 'superfood' });
      if (chia) sleepIngredients.push({ ingredient: chia, amount: 1, unit: 'tbsp', purpose: 'superfood' });
    }
    
    if (sleepQuality && sleepQuality >= 3) {
      // Good sleep - optimization ingredients
      const greekYogurt = this.lookup('greek-yogurt'); // Protein
      const flax = this.lookup('flax-seeds'); // Omega-3
      if (greekYogurt) sleepIngredients.push({ ingredient: greekYogurt, amount: 0.5, unit: 'cup', purpose: 'protein' });
      if (flax) sleepIngredients.push({ ingredient: flax, amount: 1, unit: 'tbsp', purpose: 'superfood' });
    }
    
    return sleepIngredients;
  }

  // 5. ALLERGY/INTOLERANCE SUBSTITUTIONS - Replace problematic ingredients
  private applyAllergySubstitutions(ingredients: SingleMixIngredient[], userProfile: UserProfile): SingleMixIngredient[] {
    const substitutionMap: Record<string, string> = {
      'almond-milk': 'coconut-milk',
      'oat-milk': 'coconut-milk',
      'greek-yogurt': 'coconut-yogurt',
      'soy-yogurt': 'coconut-yogurt',
      'strawberries-frozen': 'blueberries-frozen',
      'mango-frozen': 'banana-frozen'
    };
    
    const safeAllergies = Array.isArray(userProfile.allergies) ? userProfile.allergies : [];
    
    return ingredients.map(item => {
      if (this.hasAllergen(item.ingredient, safeAllergies)) {
        const substituteId = substitutionMap[item.ingredient.id];
        if (substituteId) {
          const substitute = this.lookup(substituteId);
          if (substitute && !this.hasAllergen(substitute, safeAllergies)) {
            return { ...item, ingredient: substitute };
          }
        }
      }
      return item;
    }).filter(item => !this.hasAllergen(item.ingredient, safeAllergies));
  }

  // 6. DIETARY PREFERENCE ADJUSTMENTS - Honor user's dietary choices
  private applyDietaryPreferences(ingredients: SingleMixIngredient[], userProfile: UserProfile): SingleMixIngredient[] {
    return ingredients.filter(item => {
      // Filter out disliked ingredients (with null check)
      if (userProfile.dislikes && Array.isArray(userProfile.dislikes) && 
          userProfile.dislikes.includes(item.ingredient.name.toLowerCase())) {
        return false;
      }
      
      // Apply dietary restrictions (with null check)
      if (userProfile.diet === 'vegan' && ['greek-yogurt', 'soy-yogurt'].includes(item.ingredient.id)) {
        return false;
      }
      
      if (userProfile.diet === 'keto' && ['oats', 'banana-frozen'].includes(item.ingredient.id)) {
        return false;
      }
      
      return true;
    });
  }

  // 7. NUTRIENT GAPS FILLING - Ensure comprehensive nutrition
  private fillNutrientGaps(ingredients: SingleMixIngredient[], userProfile: UserProfile, goal: HealthGoal): SingleMixIngredient[] {
    const gapIngredients: SingleMixIngredient[] = [];
    
    // Check if we have protein
    const hasProtein = ingredients.some(item => 
      ['greek-yogurt', 'coconut-yogurt', 'soy-yogurt'].includes(item.ingredient.id)
    );
    
    if (!hasProtein && goal === 'meal-replacement') {
      const yogurt = this.getSafeYogurt(userProfile);
      if (yogurt) {
        gapIngredients.push({ ingredient: yogurt, amount: 0.5, unit: 'cup', purpose: 'protein' });
      }
    }
    
    // Check if we have healthy fats
    const hasHealthyFats = ingredients.some(item => 
      ['chia-seeds', 'flax-seeds', 'coconut-milk'].includes(item.ingredient.id)
    );
    
    if (!hasHealthyFats) {
      const chia = this.lookup('chia-seeds');
      const safeAllergies = Array.isArray(userProfile.allergies) ? userProfile.allergies : [];
      if (chia && !this.hasAllergen(chia, safeAllergies)) {
        gapIngredients.push({ ingredient: chia, amount: 1, unit: 'tbsp', purpose: 'superfood' });
      }
    }
    
    // Add sweetener if needed
    if (userProfile.sweetnessTolerance === 'high' && !ingredients.some(item => item.purpose === 'sweetener')) {
      const sweetener = this.getSafeSweetener(userProfile);
      if (sweetener) {
        gapIngredients.push({ ingredient: sweetener, amount: 1, unit: 'tsp', purpose: 'sweetener' });
      }
    }
    
    return gapIngredients;
  }

  // 8. BALANCE AND OPTIMIZATION - Final adjustments for taste and nutrition
  private optimizeIngredientBalance(ingredients: SingleMixIngredient[], userProfile: UserProfile, mood: string, sleepQuality?: number): SingleMixIngredient[] {
    let optimized = [...ingredients];
    const safeAllergies = Array.isArray(userProfile.allergies) ? userProfile.allergies : [];
    
    // Add flavor enhancers based on mood
    if (mood === 'stressed' && !optimized.some(item => item.ingredient.id === 'cacao-powder')) {
      const cacao = this.lookup('cacao-powder');
      if (cacao && !this.hasAllergen(cacao, safeAllergies)) {
        optimized.push({ ingredient: cacao, amount: 0.5, unit: 'tsp', purpose: 'flavor' });
      }
    }
    
    if (mood === 'tired' && !optimized.some(item => item.ingredient.id === 'ginger-powder')) {
      const ginger = this.lookup('ginger-powder');
      if (ginger && !this.hasAllergen(ginger, safeAllergies)) {
        optimized.push({ ingredient: ginger, amount: 0.25, unit: 'tsp', purpose: 'flavor' });
      }
    }
    
    // Balance acidity with creaminess
    const tartFruits = optimized.filter(item => 
      ['strawberries-frozen', 'blueberries-frozen'].includes(item.ingredient.id)
    );
    
    if (tartFruits.length >= 2 && !optimized.some(item => 
      ['coconut-milk', 'coconut-yogurt'].includes(item.ingredient.id)
    )) {
      const coconut = this.lookup('coconut-milk');
      if (coconut && !this.hasAllergen(coconut, safeAllergies)) {
        optimized.push({ ingredient: coconut, amount: 0.25, unit: 'cup', purpose: 'liquid' });
      }
    }
    
    return optimized;
  }

  // Helper methods
  private getSafeLiquid(userProfile: UserProfile): Ingredient | null {
    const liquids = ['oat-milk', 'almond-milk', 'coconut-milk'];
    const safeAllergies = Array.isArray(userProfile.allergies) ? userProfile.allergies : [];
    for (const liquidId of liquids) {
      const liquid = this.lookup(liquidId);
      if (liquid && !this.hasAllergen(liquid, safeAllergies)) {
        return liquid;
      }
    }
    return null;
  }

  private getPrimaryFruit(userProfile: UserProfile, mood: string): Ingredient | null {
    const fruits = ['banana-frozen', 'mango-frozen', 'strawberries-frozen', 'blueberries-frozen'];
    
    // Mood-based fruit preference
    if (mood === 'tired') {
      const banana = this.lookup('banana-frozen');
      if (banana && !this.hasAllergen(banana, userProfile.allergies || [])) return banana;
    }
    
    if (mood === 'focused') {
      const blueberries = this.lookup('blueberries-frozen');
      if (blueberries && !this.hasAllergen(blueberries, userProfile.allergies || [])) return blueberries;
    }
    
    // Default to first available fruit
    for (const fruitId of fruits) {
      const fruit = this.lookup(fruitId);
      if (fruit && !this.hasAllergen(fruit, userProfile.allergies || []) && 
          (!userProfile.dislikes || !userProfile.dislikes.includes(fruit.name.toLowerCase()))) {
        return fruit;
      }
    }
    return null;
  }

  private getSafeYogurt(userProfile: UserProfile): Ingredient | null {
    const yogurts = ['coconut-yogurt', 'greek-yogurt', 'soy-yogurt'];
    const safeAllergies = Array.isArray(userProfile.allergies) ? userProfile.allergies : [];
    for (const yogurtId of yogurts) {
      const yogurt = this.lookup(yogurtId);
      if (yogurt && !this.hasAllergen(yogurt, safeAllergies)) {
        return yogurt;
      }
    }
    return null;
  }

  private getSafeSweetener(userProfile: UserProfile): Ingredient | null {
    const sweeteners = ['raw-honey', 'maple-syrup'];
    const safeAllergies = Array.isArray(userProfile.allergies) ? userProfile.allergies : [];
    for (const sweetenerId of sweeteners) {
      const sweetener = this.lookup(sweetenerId);
      if (sweetener && !this.hasAllergen(sweetener, safeAllergies)) {
        return sweetener;
      }
    }
    return null;
  }

  private generateRecipeName(goal: HealthGoal, mood: string, userProfile: UserProfile): string {
    const hour = new Date().getHours();
    const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 18 ? 'afternoon' : 'evening';
    
    // Time-based naming
    const timePrefixes = {
      morning: ['Morning', 'Dawn', 'Sunrise', 'Early'],
      afternoon: ['Afternoon', 'Midday', 'Lunch', 'Day'],
      evening: ['Evening', 'Sunset', 'Night', 'Wind-Down']
    };
    
    // Mood-based naming
    const moodAdjectives = {
      energized: ['Energizing', 'Vitality', 'Power', 'Dynamic'],
      tired: ['Revitalizing', 'Rejuvenating', 'Restorative', 'Awakening'],
      stressed: ['Calming', 'Soothing', 'Peaceful', 'Tranquil'],
      focused: ['Focus', 'Clarity', 'Sharp', 'Mental'],
      relaxed: ['Relaxing', 'Serene', 'Gentle', 'Mellow'],
      hungry: ['Satisfying', 'Filling', 'Nourishing', 'Complete']
    };
    
    // Goal-based naming
    const goalNames = {
      'energy-boost': ['Energy', 'Power', 'Vitality', 'Boost'],
      'calm-stomach': ['Digestive', 'Gentle', 'Soothe', 'Calm'],
      'meal-replacement': ['Complete', 'Meal', 'Satisfying', 'Nourishing'],
      'longevity': ['Longevity', 'Anti-Aging', 'Vitality', 'Wellness'],
      'gut-health': ['Gut Health', 'Probiotic', 'Digestive', 'Wellness'],
      'brain-health': ['Brain', 'Cognitive', 'Focus', 'Mental'],
      'immune-support': ['Immunity', 'Defense', 'Protection', 'Wellness']
    };
    
    // Get random elements for variety
    const timePrefix = timePrefixes[timeOfDay][Math.floor(Math.random() * timePrefixes[timeOfDay].length)];
          const moodAdj = moodAdjectives[mood as keyof typeof moodAdjectives]?.[Math.floor(Math.random() * moodAdjectives[mood as keyof typeof moodAdjectives].length)] || 'Balanced';
    const goalName = goalNames[goal][Math.floor(Math.random() * goalNames[goal].length)];
    
    // Create dynamic name based on context
    if (timeOfDay === 'morning' && mood === 'tired') {
      return `${timePrefix} Awakening Smoothie`;
    }
    if (timeOfDay === 'evening' && mood === 'stressed') {
      return `${timePrefix} Calm Smoothie`;
    }
    if (mood === 'hungry' && goal === 'meal-replacement') {
      return `${moodAdj} Meal Smoothie`;
    }
    if (mood === 'focused' && goal === 'brain-health') {
      return `${moodAdj} Focus Smoothie`;
    }
    
    // Default combinations
    return `${timePrefix} ${goalName} Smoothie`;
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
