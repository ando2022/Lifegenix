# Phase 7: Advanced Features

## Duration: 2 weeks

## Objectives
- AI-powered recipe optimization
- Nutritional tracking and insights
- Loyalty and rewards program
- Referral system
- Multi-language support
- API for third-party integrations
- Mobile app considerations

## Technical Implementation

### 1. AI Recipe Optimization (Day 1-3)

**src/lib/ai/recipe-optimizer.ts**
```typescript
import OpenAI from 'openai';
import { db } from '@/lib/db';
import { recipes, users, profiles, ingredients } from '@/db/schema';
import { eq } from 'drizzle-orm';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OptimizationContext {
  userId: string;
  goals: string[];
  restrictions: string[];
  preferences: any;
  history: any[];
  budget: number;
  season: string;
}

export class RecipeOptimizer {
  async generateOptimizedRecipe(context: OptimizationContext) {
    const [userProfile, nutritionHistory, ingredientPrices] = await Promise.all([
      this.getUserProfile(context.userId),
      this.getNutritionHistory(context.userId),
      this.getCurrentIngredientPrices(),
    ]);

    const prompt = this.buildOptimizationPrompt(
      userProfile,
      nutritionHistory,
      context
    );

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert nutritionist and smoothie recipe creator. 
          Create optimized 3-layer smoothie recipes based on user health goals, 
          restrictions, and nutritional needs. Return JSON format only.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const recipe = JSON.parse(completion.choices[0].message.content);
    return this.validateAndEnhanceRecipe(recipe, context);
  }

  async optimizeExistingRecipe(recipeId: string, userId: string) {
    const [recipe, userProfile, recentNutrition] = await Promise.all([
      this.getRecipe(recipeId),
      this.getUserProfile(userId),
      this.getRecentNutrition(userId, 7),
    ]);

    const nutritionGaps = this.identifyNutritionGaps(
      recentNutrition,
      userProfile.goals
    );

    const optimizations = await this.generateOptimizations(
      recipe,
      nutritionGaps,
      userProfile
    );

    return {
      original: recipe,
      optimized: optimizations.recipe,
      improvements: optimizations.improvements,
      nutritionImpact: optimizations.nutritionImpact,
      costImpact: optimizations.costDifference,
    };
  }

  private async generateOptimizations(
    recipe: any,
    gaps: any,
    profile: any
  ) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Optimize smoothie recipes for nutritional gaps while maintaining taste.'
        },
        {
          role: 'user',
          content: JSON.stringify({ recipe, gaps, profile })
        }
      ],
      temperature: 0.5,
    });

    return JSON.parse(completion.choices[0].message.content);
  }

  private identifyNutritionGaps(history: any[], goals: string[]) {
    const targetNutrients = this.getTargetNutrients(goals);
    const actualIntake = this.calculateAverageIntake(history);

    const gaps = {};
    Object.keys(targetNutrients).forEach(nutrient => {
      const target = targetNutrients[nutrient];
      const actual = actualIntake[nutrient] || 0;
      const percentage = (actual / target) * 100;

      if (percentage < 80) {
        gaps[nutrient] = {
          target,
          actual,
          deficit: target - actual,
          percentage,
        };
      }
    });

    return gaps;
  }

  async personalizeForMood(recipe: any, mood: string) {
    const moodIngredients = {
      stressed: ['ashwagandha', 'lavender', 'chamomile', 'magnesium'],
      energetic: ['matcha', 'maca', 'guarana', 'b-vitamins'],
      focused: ['lions-mane', 'ginkgo', 'rhodiola', 'l-theanine'],
      calm: ['reishi', 'passionflower', 'valerian', 'cbd'],
      happy: ['cacao', 'saffron', 'turmeric', 'omega-3'],
    };

    const ingredients = moodIngredients[mood] || [];
    return this.incorporateIngredients(recipe, ingredients);
  }

  private buildOptimizationPrompt(profile: any, history: any, context: any): string {
    return `
    Create an optimized 3-layer smoothie recipe for:
    
    User Profile:
    - Goals: ${context.goals.join(', ')}
    - Restrictions: ${context.restrictions.join(', ')}
    - Budget: CHF ${context.budget}
    - Season: ${context.season}
    
    Recent Nutrition (7-day average):
    ${JSON.stringify(history, null, 2)}
    
    Requirements:
    1. Address nutritional gaps
    2. Stay within budget
    3. Use seasonal ingredients when possible
    4. Create 3 distinct layers with different colors/textures
    5. Include longevity-promoting compounds
    6. Optimize for bioavailability
    
    Return JSON with:
    - name, description
    - layers (array with ingredients, amounts, instructions)
    - totalNutrition
    - longevityCompounds
    - estimatedCost
    - preparationTime
    `;
  }
}

// AI-powered ingredient substitution
export class IngredientSubstitutionAI {
  async findSubstitutes(
    originalIngredient: string,
    reason: 'allergy' | 'unavailable' | 'preference' | 'cost',
    context: any
  ) {
    const embedding = await this.getIngredientEmbedding(originalIngredient);
    const candidates = await this.findSimilarIngredients(embedding, context);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in ingredient substitution for smoothies.'
        },
        {
          role: 'user',
          content: `Find substitutes for ${originalIngredient} because of ${reason}.
                   Consider: nutrition, taste, texture, cost.
                   Candidates: ${JSON.stringify(candidates)}
                   Context: ${JSON.stringify(context)}`
        }
      ],
    });

    return JSON.parse(completion.choices[0].message.content);
  }

  private async getIngredientEmbedding(ingredient: string) {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: ingredient,
    });
    return response.data[0].embedding;
  }

  private async findSimilarIngredients(embedding: number[], context: any) {
    // Use vector similarity search in database
    const query = sql`
      SELECT name, nutrition, 
        1 - (embedding <=> ${embedding}::vector) as similarity
      FROM ingredients
      WHERE category = ${context.category}
      ORDER BY similarity DESC
      LIMIT 10
    `;
    return await db.execute(query);
  }
}
```

### 2. Nutritional Tracking System (Day 4-5)

**src/lib/nutrition/tracker.ts**
```typescript
import { db } from '@/lib/db';
import { nutritionLogs, healthMetrics, nutritionGoals } from '@/db/schema';
import { eq, gte, and } from 'drizzle-orm';

export class NutritionTracker {
  async logConsumption(userId: string, recipeId: string, portions: number = 1) {
    const recipe = await this.getRecipeNutrition(recipeId);
    
    const nutritionData = {
      userId,
      recipeId,
      consumedAt: new Date(),
      portions,
      calories: recipe.calories * portions,
      protein: recipe.protein * portions,
      carbs: recipe.carbs * portions,
      fat: recipe.fat * portions,
      fiber: recipe.fiber * portions,
      sugar: recipe.sugar * portions,
      micronutrients: recipe.micronutrients,
      longevityCompounds: recipe.longevityCompounds,
    };

    await db.insert(nutritionLogs).values(nutritionData);
    
    // Update daily totals
    await this.updateDailyTotals(userId);
    
    // Check goal progress
    const progress = await this.checkGoalProgress(userId);
    
    // Generate insights
    const insights = await this.generateInsights(userId);
    
    return {
      logged: nutritionData,
      progress,
      insights,
    };
  }

  async getDailyReport(userId: string, date: Date = new Date()) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await db
      .select()
      .from(nutritionLogs)
      .where(
        and(
          eq(nutritionLogs.userId, userId),
          gte(nutritionLogs.consumedAt, startOfDay),
          lte(nutritionLogs.consumedAt, endOfDay)
        )
      );

    const totals = this.calculateTotals(logs);
    const goals = await this.getUserGoals(userId);
    const achievements = this.checkAchievements(totals, goals);
    const recommendations = await this.generateRecommendations(totals, goals);

    return {
      date,
      totals,
      goals,
      achievements,
      recommendations,
      logs,
      score: this.calculateNutritionScore(totals, goals),
    };
  }

  async getWeeklyAnalysis(userId: string) {
    const weekData = await this.getWeekData(userId);
    
    const analysis = {
      trends: this.analyzeTrends(weekData),
      patterns: this.identifyPatterns(weekData),
      strengths: this.identifyStrengths(weekData),
      improvements: this.suggestImprovements(weekData),
      predictedOutcomes: await this.predictOutcomes(weekData),
    };

    return analysis;
  }

  private calculateNutritionScore(totals: any, goals: any): number {
    const factors = [
      { name: 'calories', weight: 0.2, optimal: goals.calories },
      { name: 'protein', weight: 0.25, optimal: goals.protein },
      { name: 'fiber', weight: 0.2, optimal: goals.fiber },
      { name: 'sugar', weight: 0.15, optimal: goals.maxSugar, inverse: true },
      { name: 'micronutrients', weight: 0.2, optimal: goals.micronutrients },
    ];

    let score = 0;
    factors.forEach(factor => {
      const actual = totals[factor.name];
      const optimal = factor.optimal;
      
      let factorScore;
      if (factor.inverse) {
        factorScore = actual <= optimal ? 1 : optimal / actual;
      } else {
        factorScore = Math.min(actual / optimal, 1.5) / 1.5;
      }
      
      score += factorScore * factor.weight;
    });

    return Math.round(score * 100);
  }

  async generateInsights(userId: string) {
    const weekData = await this.getWeekData(userId);
    const insights = [];

    // Protein intake insight
    const avgProtein = this.calculateAverage(weekData, 'protein');
    if (avgProtein < 50) {
      insights.push({
        type: 'warning',
        category: 'protein',
        message: 'Your protein intake is below recommended levels',
        suggestion: 'Add protein-rich ingredients like Greek yogurt or protein powder',
      });
    }

    // Longevity compounds
    const longevityScore = this.calculateLongevityScore(weekData);
    if (longevityScore > 80) {
      insights.push({
        type: 'success',
        category: 'longevity',
        message: 'Excellent longevity compound intake!',
        detail: 'Your smoothies are rich in anti-aging nutrients',
      });
    }

    // Variety insight
    const variety = this.calculateVariety(weekData);
    if (variety < 5) {
      insights.push({
        type: 'info',
        category: 'variety',
        message: 'Try more recipe variations',
        suggestion: 'Dietary diversity improves gut health',
      });
    }

    return insights;
  }
}

// Health metrics tracking
export class HealthMetricsTracker {
  async recordMetrics(userId: string, metrics: any) {
    const enhanced = await this.enhanceWithWearableData(userId, metrics);
    
    await db.insert(healthMetrics).values({
      userId,
      date: new Date(),
      weight: enhanced.weight,
      bodyFat: enhanced.bodyFat,
      muscleMass: enhanced.muscleMass,
      bloodPressure: enhanced.bloodPressure,
      restingHeartRate: enhanced.restingHeartRate,
      sleepQuality: enhanced.sleepQuality,
      energyLevel: enhanced.energyLevel,
      digestiveHealth: enhanced.digestiveHealth,
      mood: enhanced.mood,
      bloodMarkers: enhanced.bloodMarkers,
    });

    const correlations = await this.analyzeCorrelations(userId);
    const predictions = await this.generatePredictions(userId);

    return {
      recorded: enhanced,
      correlations,
      predictions,
    };
  }

  private async enhanceWithWearableData(userId: string, metrics: any) {
    // Integrate with Apple Health, Google Fit, Fitbit, etc.
    const wearableData = await this.fetchWearableData(userId);
    return { ...metrics, ...wearableData };
  }

  private async analyzeCorrelations(userId: string) {
    const data = await this.getUserHealthData(userId, 30);
    
    return {
      smoothieToEnergy: this.correlate(data.smoothieIntake, data.energyLevels),
      nutritionToSleep: this.correlate(data.nutrition, data.sleepQuality),
      fiberToDigestion: this.correlate(data.fiber, data.digestiveHealth),
    };
  }
}
```

### 3. Loyalty & Rewards Program (Day 6-7)

**src/lib/loyalty/rewards.ts**
```typescript
import { db } from '@/lib/db';
import { loyaltyPoints, rewards, achievements, referrals } from '@/db/schema';

export class LoyaltyProgram {
  private pointsConfig = {
    generation: 10,
    order: 20,
    review: 15,
    referral: 100,
    dailyStreak: 5,
    achievement: 50,
    socialShare: 10,
  };

  async awardPoints(
    userId: string,
    action: string,
    metadata: any = {}
  ) {
    const points = this.calculatePoints(action, metadata);
    
    await db.insert(loyaltyPoints).values({
      userId,
      points,
      action,
      metadata,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    });

    const totalPoints = await this.getTotalPoints(userId);
    const tier = this.calculateTier(totalPoints);
    const achievements = await this.checkAchievements(userId, action);

    // Send notification
    await this.notifyPointsEarned(userId, points, action);

    return {
      awarded: points,
      total: totalPoints,
      tier,
      newAchievements: achievements,
    };
  }

  private calculatePoints(action: string, metadata: any): number {
    let basePoints = this.pointsConfig[action] || 0;
    
    // Apply multipliers
    if (metadata.firstTime) basePoints *= 2;
    if (metadata.premium) basePoints *= 1.5;
    if (metadata.streak > 7) basePoints *= 1.2;
    
    return Math.round(basePoints);
  }

  async redeemReward(userId: string, rewardId: string) {
    const reward = await this.getReward(rewardId);
    const userPoints = await this.getTotalPoints(userId);

    if (userPoints < reward.cost) {
      throw new Error('Insufficient points');
    }

    // Deduct points
    await db.insert(loyaltyPoints).values({
      userId,
      points: -reward.cost,
      action: 'redemption',
      metadata: { rewardId, rewardName: reward.name },
    });

    // Process reward
    const redemption = await this.processRedemption(userId, reward);

    return {
      reward,
      redemption,
      remainingPoints: userPoints - reward.cost,
    };
  }

  private async processRedemption(userId: string, reward: any) {
    switch (reward.type) {
      case 'discount':
        return this.createDiscountCode(userId, reward.value);
      case 'freeGeneration':
        return this.addFreeGenerations(userId, reward.value);
      case 'premiumTrial':
        return this.activatePremiumTrial(userId, reward.value);
      case 'merchandise':
        return this.orderMerchandise(userId, reward);
      default:
        throw new Error('Unknown reward type');
    }
  }

  calculateTier(points: number): string {
    if (points >= 10000) return 'platinum';
    if (points >= 5000) return 'gold';
    if (points >= 2000) return 'silver';
    if (points >= 500) return 'bronze';
    return 'starter';
  }

  async getAvailableRewards(userId: string) {
    const userPoints = await this.getTotalPoints(userId);
    const tier = this.calculateTier(userPoints);

    const rewards = await db
      .select()
      .from(rewards)
      .where(
        and(
          lte(rewards.cost, userPoints),
          or(
            eq(rewards.tierRequired, tier),
            isNull(rewards.tierRequired)
          )
        )
      );

    return rewards.map(reward => ({
      ...reward,
      canRedeem: userPoints >= reward.cost,
      savings: this.calculateSavings(reward),
    }));
  }
}

// Achievement System
export class AchievementSystem {
  private achievements = [
    {
      id: 'first_smoothie',
      name: 'First Steps',
      description: 'Generate your first smoothie',
      points: 50,
      icon: '🥤',
    },
    {
      id: 'week_streak',
      name: 'Consistent Creator',
      description: 'Generate smoothies for 7 days straight',
      points: 100,
      icon: '🔥',
    },
    {
      id: 'nutrition_master',
      name: 'Nutrition Master',
      description: 'Achieve perfect nutrition score for a week',
      points: 200,
      icon: '🏆',
    },
    {
      id: 'shop_explorer',
      name: 'Shop Explorer',
      description: 'Order from 10 different shops',
      points: 150,
      icon: '🗺️',
    },
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Share 5 recipes on social media',
      points: 75,
      icon: '🦋',
    },
  ];

  async checkAndAward(userId: string, context: any) {
    const userAchievements = await this.getUserAchievements(userId);
    const newAchievements = [];

    for (const achievement of this.achievements) {
      if (userAchievements.has(achievement.id)) continue;

      if (await this.checkAchievementCriteria(userId, achievement, context)) {
        await this.awardAchievement(userId, achievement);
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  private async checkAchievementCriteria(
    userId: string,
    achievement: any,
    context: any
  ): Promise<boolean> {
    switch (achievement.id) {
      case 'first_smoothie':
        return context.action === 'generation' && context.isFirst;
      case 'week_streak':
        return context.streak >= 7;
      case 'nutrition_master':
        return await this.checkNutritionScore(userId);
      case 'shop_explorer':
        return await this.checkShopCount(userId) >= 10;
      case 'social_butterfly':
        return await this.checkSocialShares(userId) >= 5;
      default:
        return false;
    }
  }
}
```

### 4. Referral System (Day 8-9)

**src/lib/referral/system.ts**
```typescript
export class ReferralSystem {
  async createReferralCode(userId: string) {
    const code = this.generateUniqueCode(userId);
    
    await db.insert(referralCodes).values({
      userId,
      code,
      status: 'active',
      createdAt: new Date(),
    });

    return {
      code,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/ref/${code}`,
      rewards: {
        referrer: '1 month premium',
        referred: '3 free generations',
      },
    };
  }

  async processReferral(code: string, newUserId: string) {
    const referral = await this.validateReferralCode(code);
    
    if (!referral) {
      throw new Error('Invalid referral code');
    }

    // Record referral
    await db.insert(referrals).values({
      referrerId: referral.userId,
      referredId: newUserId,
      code,
      status: 'pending',
      createdAt: new Date(),
    });

    // Award initial bonus to new user
    await this.awardReferredBonus(newUserId);

    // Track for referrer bonus
    await this.trackReferrerProgress(referral.userId);

    return {
      success: true,
      referrer: referral.userId,
      bonus: {
        immediate: '3 free generations',
        onCompletion: 'Referrer gets 1 month premium after your first purchase',
      },
    };
  }

  private async trackReferrerProgress(referrerId: string) {
    const referrals = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, referrerId));

    const milestones = [
      { count: 1, reward: '10 free generations' },
      { count: 3, reward: '1 month premium' },
      { count: 5, reward: 'Lifetime 20% discount' },
      { count: 10, reward: 'VIP status' },
    ];

    const completed = referrals.filter(r => r.status === 'completed').length;
    
    for (const milestone of milestones) {
      if (completed === milestone.count) {
        await this.awardMilestoneReward(referrerId, milestone);
      }
    }
  }

  async createAmbassadorProgram(userId: string) {
    // Special program for power users
    const stats = await this.getUserReferralStats(userId);
    
    if (stats.totalReferrals >= 20) {
      await db.insert(ambassadors).values({
        userId,
        tier: 'gold',
        commission: 15, // 15% commission
        customCode: await this.generateCustomCode(userId),
        benefits: {
          freeSubscription: true,
          earlyAccess: true,
          exclusiveMerchandise: true,
          monthlyCredits: 100,
        },
      });

      return {
        status: 'approved',
        tier: 'gold',
        benefits: 'Free subscription, 15% commission, exclusive perks',
      };
    }

    return {
      status: 'pending',
      requirement: `${20 - stats.totalReferrals} more referrals needed`,
    };
  }
}
```

### 5. Multi-language Support (Day 10-11)

**src/lib/i18n/config.ts**
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: await import('./locales/en.json'),
  },
  de: {
    translation: await import('./locales/de.json'),
  },
  fr: {
    translation: await import('./locales/fr.json'),
  },
  it: {
    translation: await import('./locales/it.json'),
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'de', 'fr', 'it'],
    
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'],
    },
  });

export default i18n;

// Translation hook
export function useTranslation() {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Save preference to user profile
    updateUserLanguagePreference(lng);
  };

  return { t, changeLanguage, currentLanguage: i18n.language };
}
```

**src/lib/i18n/locales/en.json**
```json
{
  "common": {
    "generate": "Generate",
    "save": "Save",
    "cancel": "Cancel",
    "loading": "Loading...",
    "error": "An error occurred"
  },
  "smoothie": {
    "title": "Personalized Smoothie Generator",
    "generate": "Generate My Smoothie",
    "layers": "Layers",
    "nutrition": "Nutrition Facts",
    "ingredients": "Ingredients",
    "instructions": "Instructions"
  },
  "shop": {
    "nearby": "Nearby Shops",
    "open": "Open Now",
    "closed": "Closed",
    "distance": "{{distance}}km away",
    "rating": "{{rating}} stars",
    "order": "Order Now"
  },
  "profile": {
    "title": "My Profile",
    "preferences": "Preferences",
    "allergies": "Allergies",
    "goals": "Health Goals",
    "history": "Order History"
  }
}
```

### 6. API for Third-party Integration (Day 12-13)

**app/api/v1/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey, rateLimiter } from '@/lib/api/middleware';
import { z } from 'zod';

// API Documentation
export async function GET(request: NextRequest) {
  return NextResponse.json({
    version: '1.0.0',
    endpoints: {
      recipes: {
        generate: 'POST /api/v1/recipes/generate',
        get: 'GET /api/v1/recipes/:id',
        list: 'GET /api/v1/recipes',
      },
      shops: {
        search: 'GET /api/v1/shops/search',
        get: 'GET /api/v1/shops/:id',
        availability: 'GET /api/v1/shops/:id/availability',
      },
      orders: {
        create: 'POST /api/v1/orders',
        status: 'GET /api/v1/orders/:id',
        cancel: 'DELETE /api/v1/orders/:id',
      },
      webhooks: {
        register: 'POST /api/v1/webhooks',
        list: 'GET /api/v1/webhooks',
        delete: 'DELETE /api/v1/webhooks/:id',
      },
    },
    authentication: 'Bearer token in Authorization header',
    rateLimit: '100 requests per minute',
    documentation: 'https://api.lifegenix.com/docs',
  });
}

// Recipe Generation Endpoint
const generateRecipeSchema = z.object({
  userId: z.string().optional(),
  preferences: z.object({
    goals: z.array(z.string()),
    allergies: z.array(z.string()),
    diet: z.string(),
    mood: z.string(),
  }),
  options: z.object({
    optimize: z.boolean().default(true),
    includeShops: z.boolean().default(false),
    maxPrice: z.number().optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  // Verify API key
  const client = await verifyApiKey(apiKey);
  if (!client) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  // Rate limiting
  const rateLimitResult = await rateLimiter.check(client.id);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const validated = generateRecipeSchema.parse(body);

    // Generate recipe
    const recipe = await generateRecipeWithAI(validated);

    // Include shop matches if requested
    let shops = null;
    if (validated.options?.includeShops) {
      shops = await findMatchingShops(recipe, client.location);
    }

    // Log API usage
    await logApiUsage(client.id, 'recipe.generate');

    return NextResponse.json({
      success: true,
      recipe,
      shops,
      usage: {
        creditsUsed: 1,
        remaining: client.credits - 1,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Webhook Management
export class WebhookManager {
  async register(clientId: string, config: WebhookConfig) {
    const webhook = await db.insert(webhooks).values({
      clientId,
      url: config.url,
      events: config.events,
      secret: this.generateSecret(),
      status: 'active',
    });

    return {
      id: webhook.id,
      url: webhook.url,
      events: webhook.events,
      secret: webhook.secret,
    };
  }

  async trigger(event: string, data: any) {
    const webhooks = await this.getActiveWebhooks(event);
    
    const promises = webhooks.map(webhook =>
      this.sendWebhook(webhook, event, data)
    );

    await Promise.allSettled(promises);
  }

  private async sendWebhook(webhook: any, event: string, data: any) {
    const signature = this.generateSignature(webhook.secret, data);
    
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Lifegenix-Event': event,
        'X-Lifegenix-Signature': signature,
      },
      body: JSON.stringify({
        event,
        data,
        timestamp: new Date().toISOString(),
      }),
    });

    // Log webhook delivery
    await this.logDelivery(webhook.id, response.status);

    // Retry logic for failed webhooks
    if (!response.ok) {
      await this.scheduleRetry(webhook, event, data);
    }
  }
}
```

### 7. Mobile App API Support (Day 14)

**app/api/mobile/route.ts**
```typescript
// Mobile-specific endpoints with optimizations
export class MobileAPI {
  // Optimized data fetching for mobile
  async getHomeScreenData(userId: string) {
    const [
      user,
      recentRecipes,
      nearbyShops,
      credits,
      notifications,
    ] = await Promise.all([
      this.getUserProfile(userId),
      this.getRecentRecipes(userId, 5),
      this.getNearbyShops(userId, 3),
      this.getUserCredits(userId),
      this.getUnreadNotifications(userId),
    ]);

    return {
      user: this.minimizeUserData(user),
      recentRecipes: recentRecipes.map(r => this.minimizeRecipeData(r)),
      nearbyShops: nearbyShops.map(s => this.minimizeShopData(s)),
      credits,
      notificationCount: notifications.length,
    };
  }

  // Push notification support
  async registerDevice(userId: string, token: string, platform: 'ios' | 'android') {
    await db.insert(deviceTokens).values({
      userId,
      token,
      platform,
      createdAt: new Date(),
    });

    // Subscribe to default topics
    await this.subscribeToTopics(token, ['general', 'offers']);

    return { success: true };
  }

  // Offline support - sync endpoint
  async sync(userId: string, lastSync: Date) {
    const changes = await this.getChangesSince(userId, lastSync);
    
    return {
      recipes: changes.recipes,
      orders: changes.orders,
      favorites: changes.favorites,
      profile: changes.profile,
      serverTime: new Date(),
    };
  }

  // Image optimization for mobile
  async getOptimizedImage(imageId: string, size: 'thumb' | 'medium' | 'large') {
    const dimensions = {
      thumb: { width: 150, height: 150 },
      medium: { width: 600, height: 600 },
      large: { width: 1200, height: 1200 },
    };

    const optimized = await this.optimizeImage(imageId, dimensions[size]);
    
    return new Response(optimized, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  }
}
```

## Testing Checklist

### AI Features
- [ ] Recipe optimization works
- [ ] Nutritional gaps identified correctly
- [ ] Mood personalization functions
- [ ] Substitution suggestions logical
- [ ] AI responses validated

### Nutrition Tracking
- [ ] Consumption logging accurate
- [ ] Daily reports calculate correctly
- [ ] Weekly analysis meaningful
- [ ] Health correlations identified
- [ ] Wearable integration works

### Loyalty Program
- [ ] Points awarded correctly
- [ ] Tier calculation accurate
- [ ] Rewards redeemable
- [ ] Achievements unlock properly
- [ ] Notifications sent

### Referral System
- [ ] Referral codes generate
- [ ] Tracking works correctly
- [ ] Rewards distributed
- [ ] Ambassador program functions
- [ ] Analytics accurate

### Internationalization
- [ ] All strings translated
- [ ] Language switching works
- [ ] Currency formatting correct
- [ ] Date/time localization works
- [ ] RTL languages supported

### API Integration
- [ ] Authentication works
- [ ] Rate limiting enforced
- [ ] Endpoints documented
- [ ] Webhooks deliver
- [ ] Mobile optimizations work

## Performance Optimizations

- AI responses cached
- Batch processing for analytics
- CDN for static assets
- Database query optimization
- WebSocket connection pooling
- Image lazy loading
- Code splitting by route

## Next Phase

[Phase 8: Launch Preparation](./phase8.md) - Final testing, deployment, and go-live