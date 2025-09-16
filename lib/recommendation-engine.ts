import { 
  UserProfile, 
  Shop, 
  ShopMenuItem, 
  Enhancement, 
  ShopRecommendation, 
  RecipeRecommendation,
  SubscriptionPlan,
  UserFlowResult,
  HealthGoal,
  Ingredient
} from './types';

// Enhancement database
const ENHANCEMENTS: Enhancement[] = [
  {
    id: 'collagen',
    name: 'Collagen Boost',
    description: 'Grass-fed collagen peptides for skin and joint health',
    cost: 3,
    healthImpact: { energy: 1, calm: 0, meal: 2, longevity: 3 },
    allergens: [],
    category: 'protein'
  },
  {
    id: 'spirulina',
    name: 'Spirulina',
    description: 'Blue-green algae superfood for energy and longevity',
    cost: 2,
    healthImpact: { energy: 3, calm: 1, meal: 1, longevity: 4 },
    allergens: [],
    category: 'superfood'
  },
  {
    id: 'whey-protein',
    name: 'Whey Protein',
    description: 'Complete protein for muscle recovery and meal replacement',
    cost: 4,
    healthImpact: { energy: 2, calm: 0, meal: 4, longevity: 1 },
    allergens: ['dairy'],
    category: 'protein'
  },
  {
    id: 'chia-seeds',
    name: 'Chia Seeds',
    description: 'Omega-3 rich seeds for gut health and longevity',
    cost: 2,
    healthImpact: { energy: 1, calm: 2, meal: 2, longevity: 3 },
    allergens: [],
    category: 'superfood'
  },
  {
    id: 'matcha',
    name: 'Matcha',
    description: 'Green tea powder for focus and antioxidants',
    cost: 3,
    healthImpact: { energy: 4, calm: 1, meal: 0, longevity: 3 },
    allergens: [],
    category: 'superfood'
  },
  {
    id: 'cacao',
    name: 'Raw Cacao',
    description: 'Antioxidant-rich chocolate for brain health',
    cost: 2,
    healthImpact: { energy: 2, calm: 1, meal: 1, longevity: 3 },
    allergens: [],
    category: 'superfood'
  }
];

// Subscription plans
const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 45,
    smoothiesPerWeek: 5,
    includes: ['Standard ingredients', 'Pickup from partner shops', 'Basic customization'],
    delivery: false,
    pickup: true,
    customization: false
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 65,
    smoothiesPerWeek: 7,
    includes: ['Premium superfoods', 'Home delivery', 'Personal nutritionist consultation'],
    delivery: true,
    pickup: true,
    customization: true
  },
  {
    id: 'luxury',
    name: 'Luxury Plan',
    price: 95,
    smoothiesPerWeek: 10,
    includes: ['Custom formulations', 'Bi-weekly health check-ins', 'Exclusive ingredient access'],
    delivery: true,
    pickup: true,
    customization: true
  }
];

export class RecommendationEngine {
  
  /**
   * Main function to generate all recommendations based on user profile
   */
  static generateRecommendations(userProfile: UserProfile, shops: Shop[]): UserFlowResult {
    const shopRecommendations = this.generateShopRecommendations(userProfile, shops);
    const recipeRecommendations = this.generateRecipeRecommendations(userProfile);
    
    return {
      userProfile,
      shopRecommendations,
      recipeRecommendations,
      subscriptionPlans: SUBSCRIPTION_PLANS
    };
  }

  /**
   * Generate shop recommendations with allergen filtering and enhancements
   */
  static generateShopRecommendations(userProfile: UserProfile, shops: Shop[]): ShopRecommendation[] {
    return shops
      .map(shop => this.analyzeShop(userProfile, shop))
      .filter(recommendation => recommendation.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5); // Top 5 recommendations
  }

  /**
   * Analyze a single shop for user compatibility
   */
  private static analyzeShop(userProfile: UserProfile, shop: Shop): ShopRecommendation {
    // Filter smoothies by allergens
    const compatibleSmoothies = shop.menu.filter(smoothie => 
      this.isCompatibleWithAllergies(smoothie, userProfile.allergies, userProfile.intolerances)
    );

    if (compatibleSmoothies.length === 0) {
      return {
        shop,
        matchScore: 0,
        compatibleSmoothies: [],
        enhancements: [],
        totalCost: 0,
        allergens: [],
        healthImpact: { energy: 0, calm: 0, meal: 0, longevity: 0 }
      };
    }

    // Calculate match score based on goals and preferences
    const matchScore = this.calculateShopMatchScore(userProfile, compatibleSmoothies);
    
    // Get available enhancements
    const enhancements = this.getAvailableEnhancements(userProfile, shop);
    
    // Calculate health impact
    const healthImpact = this.calculateHealthImpact(compatibleSmoothies, enhancements, userProfile.goals);
    
    // Calculate total cost
    const totalCost = this.calculateTotalCost(compatibleSmoothies, enhancements, userProfile.budget);

    return {
      shop,
      matchScore,
      compatibleSmoothies,
      enhancements,
      totalCost,
      allergens: this.extractAllergens(compatibleSmoothies),
      healthImpact
    };
  }

  /**
   * Check if smoothie is compatible with user allergies
   */
  private static isCompatibleWithAllergies(
    smoothie: ShopMenuItem, 
    allergies: string[], 
    intolerances: string[]
  ): boolean {
    const allRestrictions = [...allergies, ...intolerances];
    
    // This would check against your ingredient database
    // For now, we'll use a simple check
    const smoothieAllergens = this.extractSmoothieAllergens(smoothie.ingredients);
    
    return !allRestrictions.some(restriction => 
      smoothieAllergens.includes(restriction)
    );
  }

  /**
   * Extract allergens from smoothie ingredients
   */
  private static extractSmoothieAllergens(ingredients: string[]): string[] {
    const allergenMap: { [key: string]: string[] } = {
      'milk': ['dairy'],
      'yogurt': ['dairy'],
      'cheese': ['dairy'],
      'almond': ['tree-nuts'],
      'walnut': ['tree-nuts'],
      'cashew': ['tree-nuts'],
      'wheat': ['gluten'],
      'barley': ['gluten'],
      'soy': ['soy'],
      'egg': ['eggs']
    };

    const allergens: string[] = [];
    ingredients.forEach(ingredient => {
      const ingredientLower = ingredient.toLowerCase();
      Object.entries(allergenMap).forEach(([key, allergenList]) => {
        if (ingredientLower.includes(key)) {
          allergens.push(...allergenList);
        }
      });
    });

    return Array.from(new Set(allergens)); // Remove duplicates
  }

  /**
   * Calculate shop match score based on user goals and preferences
   */
  private static calculateShopMatchScore(userProfile: UserProfile, smoothies: ShopMenuItem[]): number {
    let totalScore = 0;
    
    smoothies.forEach(smoothie => {
      // Goal alignment (40% of score)
      const goalScore = this.calculateGoalAlignment(smoothie, userProfile.goals) * 0.4;
      
      // Budget alignment (30% of score)
      const budgetScore = this.calculateBudgetAlignment(smoothie.price, userProfile.budget) * 0.3;
      
      // Time of day alignment (20% of score)
      const timeScore = this.calculateTimeAlignment(smoothie, userProfile.timeOfDay) * 0.2;
      
      // Flavor preference alignment (10% of score)
      const flavorScore = this.calculateFlavorAlignment(smoothie, userProfile.flavorPreferences) * 0.1;
      
      totalScore += goalScore + budgetScore + timeScore + flavorScore;
    });

    return Math.round((totalScore / smoothies.length) * 100);
  }

  /**
   * Calculate goal alignment for a smoothie
   */
  private static calculateGoalAlignment(smoothie: ShopMenuItem, goals: HealthGoal[]): number {
    // This would use your ingredient database to calculate health impact
    // For now, we'll use simple heuristics
    const smoothieName = smoothie.name.toLowerCase();
    let score = 0;

    goals.forEach(goal => {
      switch (goal) {
        case 'energy-boost':
          if (smoothieName.includes('energy') || smoothieName.includes('power') || smoothieName.includes('boost')) {
            score += 3;
          }
          break;
        case 'calm-stomach':
          if (smoothieName.includes('green') || smoothieName.includes('detox') || smoothieName.includes('calm')) {
            score += 3;
          }
          break;
        case 'meal-replacement':
          if (smoothieName.includes('protein') || smoothieName.includes('meal') || smoothieName.includes('shake')) {
            score += 3;
          }
          break;
        case 'longevity':
          if (smoothieName.includes('antioxidant') || smoothieName.includes('superfood') || smoothieName.includes('berry')) {
            score += 3;
          }
          break;
      }
    });

    return Math.min(score, 10); // Cap at 10
  }

  /**
   * Calculate budget alignment
   */
  private static calculateBudgetAlignment(price: number, budget: string): number {
    const budgetRanges: { [key: string]: { min: number; max: number } } = {
      'basic': { min: 8, max: 12 },
      'premium': { min: 10, max: 16 },
      'luxury': { min: 14, max: 25 }
    };

    const range = budgetRanges[budget];
    if (price >= range.min && price <= range.max) {
      return 10;
    } else if (price < range.min) {
      return 7; // Below budget is okay
    } else {
      return 3; // Above budget is less ideal
    }
  }

  /**
   * Calculate time of day alignment
   */
  private static calculateTimeAlignment(smoothie: ShopMenuItem, timeOfDay: string): number {
    const smoothieName = smoothie.name.toLowerCase();
    
    switch (timeOfDay) {
      case 'morning':
        if (smoothieName.includes('energy') || smoothieName.includes('boost') || smoothieName.includes('green')) {
          return 10;
        }
        break;
      case 'lunch':
        if (smoothieName.includes('meal') || smoothieName.includes('protein') || smoothieName.includes('shake')) {
          return 10;
        }
        break;
      case 'afternoon':
        if (smoothieName.includes('focus') || smoothieName.includes('energy') || smoothieName.includes('tropical')) {
          return 10;
        }
        break;
      case 'evening':
        if (smoothieName.includes('calm') || smoothieName.includes('detox') || smoothieName.includes('green')) {
          return 10;
        }
        break;
    }
    
    return 5; // Neutral score
  }

  /**
   * Calculate flavor preference alignment
   */
  private static calculateFlavorAlignment(smoothie: ShopMenuItem, preferences: any): number {
    // This would analyze the smoothie's flavor profile
    // For now, return a neutral score
    return 5;
  }

  /**
   * Get available enhancements for a shop
   */
  private static getAvailableEnhancements(userProfile: UserProfile, shop: Shop): Enhancement[] {
    return ENHANCEMENTS.filter(enhancement => {
      // Check if enhancement is compatible with user allergies
      const hasAllergenConflict = enhancement.allergens.some(allergen => 
        userProfile.allergies.includes(allergen) || userProfile.intolerances.includes(allergen)
      );
      
      if (hasAllergenConflict) return false;
      
      // Check if shop has the capability to add this enhancement
      return this.shopCanProvideEnhancement(shop, enhancement);
    });
  }

  /**
   * Check if shop can provide enhancement
   */
  private static shopCanProvideEnhancement(shop: Shop, enhancement: Enhancement): boolean {
    // This would check shop capabilities
    // For now, assume all shops can provide basic enhancements
    return true;
  }

  /**
   * Calculate health impact of smoothies and enhancements
   */
  private static calculateHealthImpact(
    smoothies: ShopMenuItem[], 
    enhancements: Enhancement[], 
    goals: HealthGoal[]
  ): { energy: number; calm: number; meal: number; longevity: number } {
    let totalImpact = { energy: 0, calm: 0, meal: 0, longevity: 0 };
    
    // Add smoothie impact (this would use your ingredient database)
    smoothies.forEach(smoothie => {
      // Placeholder - would calculate based on ingredients
      totalImpact.energy += 2;
      totalImpact.calm += 1;
      totalImpact.meal += 1;
      totalImpact.longevity += 2;
    });
    
    // Add enhancement impact
    enhancements.forEach(enhancement => {
      totalImpact.energy += enhancement.healthImpact.energy;
      totalImpact.calm += enhancement.healthImpact.calm;
      totalImpact.meal += enhancement.healthImpact.meal;
      totalImpact.longevity += enhancement.healthImpact.longevity;
    });
    
    // Normalize to 0-10 scale
    Object.keys(totalImpact).forEach(key => {
      (totalImpact as any)[key] = Math.min(Math.round((totalImpact as any)[key]), 10);
    });
    
    return totalImpact;
  }

  /**
   * Calculate total cost including enhancements
   */
  private static calculateTotalCost(
    smoothies: ShopMenuItem[], 
    enhancements: Enhancement[], 
    budget: string
  ): number {
    const smoothieCost = smoothies.reduce((sum, smoothie) => sum + smoothie.price, 0);
    const enhancementCost = enhancements.reduce((sum, enhancement) => sum + enhancement.cost, 0);
    
    return smoothieCost + enhancementCost;
  }

  /**
   * Extract allergens from compatible smoothies
   */
  private static extractAllergens(smoothies: ShopMenuItem[]): string[] {
    const allergens: string[] = [];
    smoothies.forEach(smoothie => {
      allergens.push(...this.extractSmoothieAllergens(smoothie.ingredients));
    });
    return Array.from(new Set(allergens)); // Remove duplicates
  }

  /**
   * Generate recipe recommendations (placeholder)
   */
  private static generateRecipeRecommendations(userProfile: UserProfile): RecipeRecommendation[] {
    // This would use your existing recipe generator
    // For now, return empty array
    return [];
  }
}

