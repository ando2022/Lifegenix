import { Shop, ShopMatch, Recipe } from '@/lib/types';
import { SingleMixRecipe } from '@/lib/single-mix-recipe-generator';
import { zurichShops } from '@/data/zurich-shops';

export class ShopMatcher {
  private shops: Shop[];

  constructor() {
    this.shops = zurichShops;
  }

  findMatches(recipe: Recipe, userLocation?: { lat: number; lng: number }): ShopMatch[] {
    const matches: ShopMatch[] = [];

    this.shops.forEach(shop => {
      const matchScore = this.calculateMatchScore(recipe, shop);
      const missingIngredients = this.findMissingIngredients(recipe, shop);
      const suggestedSwaps = this.generateSuggestedSwaps(recipe, shop);
      const estimatedPrice = this.estimatePrice(recipe, shop);
      const prepTime = this.estimatePrepTime(recipe, shop);

      if (matchScore > 30) { // Only include shops with at least 30% match
        matches.push({
          shop: {
            ...shop,
            distance: userLocation ? this.calculateDistance(userLocation, shop.coordinates) : undefined
          },
          matchScore,
          missingIngredients,
          suggestedSwaps,
          estimatedPrice,
          prepTime
        });
      }
    });

    // Sort by match score (highest first), then by distance if available
    return matches.sort((a, b) => {
      if (a.matchScore !== b.matchScore) {
        return b.matchScore - a.matchScore;
      }
      if (a.shop.distance && b.shop.distance) {
        return a.shop.distance - b.shop.distance;
      }
      return 0;
    });
  }

  // Single-mix supporting matcher
  findMatchesForSingleMix(singleMixRecipe: SingleMixRecipe, userLocation?: { lat: number; lng: number }): ShopMatch[] {
    const matches: ShopMatch[] = [];

    this.shops.forEach(shop => {
      const matchScore = this.calculateSingleMixMatchScore(singleMixRecipe, shop);
      const missingIngredients = this.findMissingSingleMixIngredients(singleMixRecipe, shop);
      const suggestedSwaps = this.generateSuggestedSingleMixSwaps(singleMixRecipe, shop);
      const estimatedPrice = this.estimatePriceForSingleMix(singleMixRecipe, shop);
      const prepTime = this.estimatePrepTimeForSingleMix(singleMixRecipe, shop);

      if (matchScore > 30) {
        matches.push({
          shop: {
            ...shop,
            distance: userLocation ? this.calculateDistance(userLocation, shop.coordinates) : undefined
          },
          matchScore,
          missingIngredients,
          suggestedSwaps,
          estimatedPrice,
          prepTime
        });
      }
    });

    return matches.sort((a, b) => {
      if (a.matchScore !== b.matchScore) {
        return b.matchScore - a.matchScore;
      }
      if (a.shop.distance && b.shop.distance) {
        return a.shop.distance - b.shop.distance;
      }
      return 0;
    });
  }

  private calculateMatchScore(recipe: Recipe, shop: Shop): number {
    let score = 0;
    let totalIngredients = 0;

    recipe.layers.forEach(layer => {
      layer.ingredients.forEach(layerIngredient => {
        totalIngredients++;
        const ingredient = layerIngredient.ingredient;
        
        if (this.shopHasIngredient(ingredient, shop)) {
          score += 1;
        } else if (this.shopHasSimilarIngredient(ingredient, shop)) {
          score += 0.7;
        }
      });
    });

    // Bonus for layered smoothie capability
    if (recipe.layers.length > 1 && shop.capabilities.canMakeLayered) {
      score += 0.5;
    }

    return totalIngredients > 0 ? Math.round((score / totalIngredients) * 100) : 0;
  }

  private calculateSingleMixMatchScore(singleMixRecipe: SingleMixRecipe, shop: Shop): number {
    let score = 0;
    const totalIngredients = singleMixRecipe.ingredients.length;

    singleMixRecipe.ingredients.forEach(item => {
      const ingredient = item.ingredient as any;
      if (this.shopHasIngredient(ingredient, shop)) {
        score += 1;
      } else if (this.shopHasSimilarIngredient(ingredient, shop)) {
        score += 0.7;
      }
    });

    return totalIngredients > 0 ? Math.round((score / totalIngredients) * 100) : 0;
  }

  private shopHasIngredient(ingredient: any, shop: Shop): boolean {
    const ingredientName = ingredient.name.toLowerCase();
    
    switch (ingredient.category) {
      case 'frozen-fruits':
        return shop.capabilities.hasFrozenFruits.some(fruit => 
          fruit.toLowerCase().includes(ingredientName.split(' ')[1]) // e.g., "frozen banana" -> "banana"
        );
      case 'milks':
        return shop.capabilities.hasMilks.some(milk => 
          milk.toLowerCase().includes(ingredientName.split(' ')[0]) // e.g., "oat milk" -> "oat"
        );
      case 'yogurts':
        return shop.capabilities.hasYogurts.some(yogurt => 
          yogurt.toLowerCase().includes(ingredientName.split(' ')[0]) // e.g., "coconut yogurt" -> "coconut"
        );
      case 'superfoods':
        return shop.capabilities.hasSuperfoods.some(superfood => 
          superfood.toLowerCase().includes(ingredientName.split(' ')[0]) // e.g., "chia seeds" -> "chia"
        );
      case 'foams':
        return shop.capabilities.hasFoams.some(foam => 
          foam.toLowerCase().includes(ingredientName.split(' ')[0]) // e.g., "coconut cream" -> "coconut"
        );
      default:
        return false;
    }
  }

  private shopHasSimilarIngredient(ingredient: any, shop: Shop): boolean {
    // Check for similar ingredients that could be substituted
    const similarMap: { [key: string]: string[] } = {
      'oat-milk': ['almond-milk', 'coconut-milk'],
      'almond-milk': ['oat-milk', 'coconut-milk'],
      'coconut-milk': ['oat-milk', 'almond-milk'],
      'greek-yogurt': ['coconut-yogurt', 'soy-yogurt'],
      'coconut-yogurt': ['greek-yogurt', 'soy-yogurt'],
      'chia-seeds': ['flax-seeds'],
      'flax-seeds': ['chia-seeds']
    };

    const similarIngredients = similarMap[ingredient.id] || [];
    return similarIngredients.some(similarId => {
      const similarIngredient = this.findIngredientById(similarId);
      return similarIngredient && this.shopHasIngredient(similarIngredient, shop);
    });
  }

  private findIngredientById(id: string): any {
    // This would normally come from the ingredients database
    // For now, return a mock ingredient
    const mockIngredients: { [key: string]: any } = {
      'oat-milk': { id: 'oat-milk', name: 'Oat Milk', category: 'milks' },
      'almond-milk': { id: 'almond-milk', name: 'Almond Milk', category: 'milks' },
      'coconut-milk': { id: 'coconut-milk', name: 'Coconut Milk', category: 'milks' },
      'greek-yogurt': { id: 'greek-yogurt', name: 'Greek Yogurt', category: 'yogurts' },
      'coconut-yogurt': { id: 'coconut-yogurt', name: 'Coconut Yogurt', category: 'yogurts' },
      'soy-yogurt': { id: 'soy-yogurt', name: 'Soy Yogurt', category: 'yogurts' },
      'chia-seeds': { id: 'chia-seeds', name: 'Chia Seeds', category: 'superfoods' },
      'flax-seeds': { id: 'flax-seeds', name: 'Flax Seeds', category: 'superfoods' }
    };
    return mockIngredients[id];
  }

  private findMissingIngredients(recipe: Recipe, shop: Shop): string[] {
    const missing: string[] = [];

    recipe.layers.forEach(layer => {
      layer.ingredients.forEach(layerIngredient => {
        const ingredient = layerIngredient.ingredient;
        
        if (!this.shopHasIngredient(ingredient, shop) && 
            !this.shopHasSimilarIngredient(ingredient, shop)) {
          missing.push(ingredient.name);
        }
      });
    });

    return missing;
  }

  private findMissingSingleMixIngredients(singleMixRecipe: SingleMixRecipe, shop: Shop): string[] {
    const missing: string[] = [];

    singleMixRecipe.ingredients.forEach(item => {
      const ingredient = item.ingredient as any;
      if (!this.shopHasIngredient(ingredient, shop) && !this.shopHasSimilarIngredient(ingredient, shop)) {
        missing.push(ingredient.name);
      }
    });

    return missing;
  }

  private generateSuggestedSwaps(recipe: Recipe, shop: Shop): string[] {
    const swaps: string[] = [];

    recipe.layers.forEach(layer => {
      layer.ingredients.forEach(layerIngredient => {
        const ingredient = layerIngredient.ingredient;
        
        if (!this.shopHasIngredient(ingredient, shop)) {
          const similarIngredient = this.findSimilarIngredient(ingredient, shop);
          if (similarIngredient) {
            swaps.push(`${ingredient.name} → ${similarIngredient.name}`);
          }
        }
      });
    });

    return swaps;
  }

  private generateSuggestedSingleMixSwaps(singleMixRecipe: SingleMixRecipe, shop: Shop): string[] {
    const swaps: string[] = [];

    singleMixRecipe.ingredients.forEach(item => {
      const ingredient = item.ingredient as any;
      if (!this.shopHasIngredient(ingredient, shop)) {
        const similar = this.findSimilarIngredient(ingredient, shop);
        if (similar) {
          swaps.push(`${ingredient.name} → ${similar.name}`);
        }
      }
    });

    return swaps;
  }

  private findSimilarIngredient(ingredient: any, shop: Shop): any {
    const similarMap: { [key: string]: string[] } = {
      'oat-milk': ['almond-milk', 'coconut-milk'],
      'almond-milk': ['oat-milk', 'coconut-milk'],
      'coconut-milk': ['oat-milk', 'almond-milk'],
      'greek-yogurt': ['coconut-yogurt', 'soy-yogurt'],
      'coconut-yogurt': ['greek-yogurt', 'soy-yogurt'],
      'chia-seeds': ['flax-seeds'],
      'flax-seeds': ['chia-seeds']
    };

    const similarIds = similarMap[ingredient.id] || [];
    for (const similarId of similarIds) {
      const similarIngredient = this.findIngredientById(similarId);
      if (similarIngredient && this.shopHasIngredient(similarIngredient, shop)) {
        return similarIngredient;
      }
    }

    return null;
  }

  private estimatePrice(recipe: Recipe, shop: Shop): number {
    // Base price for layered smoothie
    let basePrice = 8.50;

    // Adjust based on shop's typical pricing
    const shopPricing: { [key: string]: number } = {
      'greenbar-zurich': 1.2,
      'juice-bar-basel': 0.9,
      'healthy-cafe-geneva': 1.0,
      'smoothie-king-bern': 0.8,
      'vitality-bar-lausanne': 1.3
    };

    const multiplier = shopPricing[shop.id] || 1.0;
    return Math.round(basePrice * multiplier * 100) / 100;
  }

  private estimatePriceForSingleMix(singleMixRecipe: SingleMixRecipe, shop: Shop): number {
    // Base price for single-mix smoothie
    let basePrice = 7.5;
    const shopPricing: { [key: string]: number } = {
      'greenbar-zurich': 1.2,
      'juice-bar-basel': 0.9,
      'healthy-cafe-geneva': 1.0,
      'smoothie-king-bern': 0.8,
      'vitality-bar-lausanne': 1.3
    };
    const multiplier = shopPricing[shop.id] || 1.0;
    return Math.round(basePrice * multiplier * 100) / 100;
  }

  private estimatePrepTime(recipe: Recipe, shop: Shop): number {
    let baseTime = shop.capabilities.prepTime;

    // Add time for layered smoothies
    if (recipe.layers.length > 1) {
      baseTime += 2;
    }

    // Add time for missing ingredients (need to substitute)
    const missingCount = this.findMissingIngredients(recipe, shop).length;
    baseTime += missingCount * 0.5;

    return Math.round(baseTime);
  }

  private estimatePrepTimeForSingleMix(singleMixRecipe: SingleMixRecipe, shop: Shop): number {
    let baseTime = shop.capabilities.prepTime;
    // Add time if there are missing ingredients (need substitutions)
    const missingCount = this.findMissingSingleMixIngredients(singleMixRecipe, shop).length;
    baseTime += missingCount * 0.5;
    return Math.round(baseTime);
  }

  private calculateDistance(location1: { lat: number; lng: number }, location2: { lat: number; lng: number }): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(location2.lat - location1.lat);
    const dLon = this.deg2rad(location2.lng - location1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(location1.lat)) * Math.cos(this.deg2rad(location2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}
