import { UserProfile, HealthGoal, Recipe, RecipeLayer, LayerIngredient, Ingredient, GeneratedRecipe, Mood } from '@/lib/types';
import { ingredients } from '@/data/ingredients';

export class RecipeGenerator {
  private ingredients: Ingredient[];

  constructor() {
    this.ingredients = ingredients;
  }

  generateRecipe(userProfile: UserProfile, mood: Mood, goal: HealthGoal): GeneratedRecipe {
    const recipe = this.createRecipe(goal, userProfile);
    
    return {
      recipe,
      userProfile,
      mood,
      shopMatches: [], // Will be populated by shop matching service
      price: this.calculateRecipePrice(recipe),
      generatedAt: new Date()
    };
  }

  private createRecipe(goal: HealthGoal, userProfile: UserProfile): Recipe {
    const baseLayer = this.createBaseLayer(goal, userProfile);
    const gradientLayer = this.createGradientLayer(goal, userProfile, baseLayer);
    const foamLayer = this.createFoamLayer(goal, userProfile);

    const recipe: Recipe = {
      id: this.generateRecipeId(),
      name: this.generateRecipeName(goal),
      goal,
      layers: [baseLayer, gradientLayer, foamLayer],
      totalNutrition: this.calculateTotalNutrition([baseLayer, gradientLayer, foamLayer]),
      cost: 0, // Will be calculated
      prepTime: 5,
      difficulty: 'easy',
      createdAt: new Date()
    };

    recipe.cost = this.calculateRecipePrice(recipe);
    return recipe;
  }

  private createBaseLayer(goal: HealthGoal, userProfile: UserProfile): RecipeLayer {
    const fruits = this.selectFruits(goal, userProfile);
    const milk = this.selectMilk(userProfile);
    
    const layerIngredients: LayerIngredient[] = [
      {
        ingredient: fruits[0],
        amount: 120,
        unit: 'g'
      },
      {
        ingredient: fruits[1],
        amount: 80,
        unit: 'g'
      },
      {
        ingredient: milk,
        amount: 140,
        unit: 'ml'
      }
    ];

    return {
      id: 'base-layer',
      name: 'Base Layer',
      type: 'base',
      ingredients: layerIngredients,
      instructions: 'Blend frozen fruits with milk until thick and smooth',
      color: this.getLayerColor(fruits[0].name),
      thickness: 'thick'
    };
  }

  private createGradientLayer(goal: HealthGoal, userProfile: UserProfile, baseLayer: RecipeLayer): RecipeLayer {
    const yogurt = this.selectYogurt(goal, userProfile);
    const superfoods = this.selectSuperfoods(goal, userProfile);
    
    const layerIngredients: LayerIngredient[] = [
      {
        ingredient: yogurt,
        amount: 120,
        unit: 'g'
      },
      {
        ingredient: superfoods[0],
        amount: this.getSuperfoodAmount(superfoods[0]),
        unit: 'tsp'
      }
    ];

    if (superfoods[1]) {
      layerIngredients.push({
        ingredient: superfoods[1],
        amount: this.getSuperfoodAmount(superfoods[1]),
        unit: 'tsp'
      });
    }

    return {
      id: 'gradient-layer',
      name: 'Yogurt Gradient',
      type: 'gradient',
      ingredients: layerIngredients,
      instructions: 'Mix yogurt with superfoods and blend with base layer leftovers for gradient effect',
      color: this.getGradientColor(baseLayer.color),
      thickness: 'medium'
    };
  }

  private createFoamLayer(goal: HealthGoal, userProfile: UserProfile): RecipeLayer {
    const foam = this.selectFoam(userProfile);
    const enhancers = this.selectEnhancers(goal, userProfile);
    
    const layerIngredients: LayerIngredient[] = [
      {
        ingredient: foam,
        amount: foam.id === 'aquafaba' ? 60 : 40,
        unit: 'ml'
      }
    ];

    if (enhancers.length > 0) {
      layerIngredients.push({
        ingredient: enhancers[0],
        amount: 0.25,
        unit: 'tsp'
      });
    }

    return {
      id: 'foam-layer',
      name: 'Light Foam',
      type: 'foam',
      ingredients: layerIngredients,
      instructions: 'Whip foam to soft peaks and add taste enhancers',
      color: '#f8fafc',
      thickness: 'thin'
    };
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

    // Prefer oat milk for most diets
    const oatMilk = availableMilks.find(m => m.id === 'oat-milk');
    if (oatMilk && userProfile.diet !== 'gluten-free') {
      return oatMilk;
    }

    return availableMilks[0] || this.ingredients.find(ing => ing.id === 'oat-milk')!;
  }

  private selectYogurt(goal: HealthGoal, userProfile: UserProfile): Ingredient {
    const availableYogurts = this.ingredients.filter(ing => 
      ing.category === 'yogurts' && 
      !this.hasAllergen(ing, userProfile.allergies)
    );

    // Prefer Greek yogurt for meal replacement, coconut for others
    if (goal === 'meal-replacement') {
      const greekYogurt = availableYogurts.find(y => y.id === 'greek-yogurt');
      if (greekYogurt) return greekYogurt;
    }

    const coconutYogurt = availableYogurts.find(y => y.id === 'coconut-yogurt');
    if (coconutYogurt) return coconutYogurt;

    return availableYogurts[0] || this.ingredients.find(ing => ing.id === 'coconut-yogurt')!;
  }

  private selectSuperfoods(goal: HealthGoal, userProfile: UserProfile): Ingredient[] {
    const availableSuperfoods = this.ingredients.filter(ing => 
      ing.category === 'superfoods' && 
      !this.hasAllergen(ing, userProfile.allergies)
    );

    const goalSuperfoods: { [key in HealthGoal]: string[] } = {
      'energy-boost': ['oats', 'cacao-powder'],
      'calm-stomach': ['chia-seeds', 'ginger-powder'],
      'meal-replacement': ['chia-seeds', 'flax-seeds'],
      'longevity': ['turmeric-powder', 'spirulina'],
      'gut-health': ['probiotic-powder', 'ginger-powder'],
      'brain-health': ['cacao-powder', 'turmeric-powder'],
      'immune-support': ['spirulina', 'ginger-powder']
    };

    const preferredSuperfoods = goalSuperfoods[goal];
    const selectedSuperfoods = preferredSuperfoods
      .map(superfoodId => availableSuperfoods.find(s => s.id === superfoodId))
      .filter(Boolean) as Ingredient[];

    return selectedSuperfoods.slice(0, 2);
  }

  private selectFoam(userProfile: UserProfile): Ingredient {
    const availableFoams = this.ingredients.filter(ing => 
      ing.category === 'foams' && 
      !this.hasAllergen(ing, userProfile.allergies)
    );

    // Prefer aquafaba for most diets
    const aquafaba = availableFoams.find(f => f.id === 'aquafaba');
    if (aquafaba) return aquafaba;

    return availableFoams[0] || this.ingredients.find(ing => ing.id === 'aquafaba')!;
  }

  private selectEnhancers(goal: HealthGoal, userProfile: UserProfile): Ingredient[] {
    const availableEnhancers = this.ingredients.filter(ing => 
      (ing.id === 'ginger-powder' || ing.id === 'cacao-powder') &&
      !this.hasAllergen(ing, userProfile.allergies)
    );

    const goalEnhancers: { [key in HealthGoal]: string[] } = {
      'energy-boost': ['cacao-powder'],
      'calm-stomach': ['ginger-powder'],
      'meal-replacement': ['cacao-powder'],
      'longevity': ['cacao-powder'],
      'gut-health': ['ginger-powder'],
      'brain-health': ['cacao-powder'],
      'immune-support': ['ginger-powder']
    };

    const preferredEnhancers = goalEnhancers[goal];
    return preferredEnhancers
      .map(enhancerId => availableEnhancers.find(e => e.id === enhancerId))
      .filter(Boolean) as Ingredient[];
  }

  private hasAllergen(ingredient: Ingredient, userAllergies: string[]): boolean {
    return ingredient.allergens.some(allergen => userAllergies.includes(allergen));
  }

  private getSuperfoodAmount(superfood: Ingredient): number {
    return superfood.id === 'oats' ? 2 : 1; // 2 tsp oats, 1 tsp others
  }

  private getLayerColor(fruitName: string): string {
    const colorMap: { [key: string]: string } = {
      'Frozen Banana': '#fbbf24',
      'Frozen Blueberries': '#7c3aed',
      'Frozen Mango': '#f59e0b',
      'Frozen Strawberries': '#ef4444'
    };
    return colorMap[fruitName] || '#7c3aed';
  }

  private getGradientColor(baseColor: string): string {
    // Create a lighter version of the base color
    const colorMap: { [key: string]: string } = {
      '#7c3aed': '#a855f7', // Purple to lighter purple
      '#fbbf24': '#fcd34d', // Yellow to lighter yellow
      '#f59e0b': '#fbbf24', // Orange to lighter orange
      '#ef4444': '#f87171'  // Red to lighter red
    };
    return colorMap[baseColor] || '#a855f7';
  }

  private generateRecipeName(goal: HealthGoal): string {
    const nameMap: { [key in HealthGoal]: string } = {
      'energy-boost': 'Energy Boost Smoothie',
      'calm-stomach': 'Calm Stomach Smoothie',
      'meal-replacement': 'Meal Replacement Smoothie',
      'longevity': 'Longevity Smoothie',
      'gut-health': 'Gut Health Smoothie',
      'brain-health': 'Brain Health Smoothie',
      'immune-support': 'Immune Support Smoothie'
    };
    return nameMap[goal];
  }

  private generateRecipeId(): string {
    return `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateTotalNutrition(layers: RecipeLayer[]) {
    let totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      longevityCompounds: [] as string[]
    };

    layers.forEach(layer => {
      layer.ingredients.forEach(layerIngredient => {
        const nutrition = layerIngredient.ingredient.nutrition;
        const amount = layerIngredient.amount;
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
    });

    return totalNutrition;
  }

  private calculateRecipePrice(recipe: Recipe): number {
    let totalPrice = 0;

    recipe.layers.forEach(layer => {
      layer.ingredients.forEach(layerIngredient => {
        const cost = layerIngredient.ingredient.cost;
        const amount = layerIngredient.amount;
        const price = cost * (amount / 100); // Cost is per 100g/ml
        totalPrice += price;
      });
    });

    return Math.round(totalPrice * 100) / 100; // Round to 2 decimal places
  }
}
