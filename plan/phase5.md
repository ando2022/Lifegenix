# Phase 5: Marketplace Features

## Duration: 3-4 days (AI-Assisted)

## Objectives
- Advanced shop matching algorithm
- Recipe-to-shop recommendation system
- Distance and similarity scoring
- Shop reviews and ratings
- Real-time availability updates
- Discovery and search features

## Technical Implementation

### 1. Matching Algorithm (Day 1-2)

**src/lib/marketplace/matching-engine.ts**
```typescript
import { haversineDistance } from '@/lib/utils/geo';
import { db } from '@/lib/db';
import { shops, shopInventory, shopMenuItems, shopAnalytics } from '@/db/schema';
import { eq, and, gte, lte, inArray, sql } from 'drizzle-orm';

interface MatchingCriteria {
  recipe: Recipe;
  userLocation: { lat: number; lng: number };
  maxDistance: number;
  priceRange: { min: number; max: number };
  preferredShops: string[];
  dietary: string[];
  timePreference: 'fastest' | 'best_match' | 'cheapest';
}

interface ShopMatch {
  shop: Shop;
  score: number;
  distance: number;
  availability: {
    canMake: boolean;
    missingIngredients: string[];
    alternativeIngredients: Map<string, string>;
  };
  pricing: {
    basePrice: number;
    withModifications: number;
    deliveryFee: number;
  };
  timing: {
    preparationTime: number;
    waitTime: number;
    pickupTime: Date;
  };
  compatibility: {
    ingredientMatch: number;
    capabilityMatch: number;
    dietaryMatch: number;
    overallScore: number;
  };
}

export class MatchingEngine {
  private weights = {
    distance: 0.25,
    ingredientMatch: 0.3,
    price: 0.2,
    rating: 0.15,
    availability: 0.1,
  };

  async findMatches(criteria: MatchingCriteria): Promise<ShopMatch[]> {
    // Get shops within distance
    const nearbyShops = await this.getNearbyShops(
      criteria.userLocation,
      criteria.maxDistance
    );

    // Score each shop
    const matches = await Promise.all(
      nearbyShops.map(shop => this.scoreShop(shop, criteria))
    );

    // Filter and sort
    return matches
      .filter(m => m.score > 0.5)
      .sort((a, b) => {
        switch (criteria.timePreference) {
          case 'fastest':
            return a.timing.waitTime - b.timing.waitTime;
          case 'cheapest':
            return a.pricing.withModifications - b.pricing.withModifications;
          default:
            return b.score - a.score;
        }
      })
      .slice(0, 20);
  }

  private async getNearbyShops(
    location: { lat: number; lng: number },
    maxDistance: number
  ): Promise<Shop[]> {
    // Use PostGIS for efficient geographic queries
    const query = sql`
      SELECT *,
        ST_Distance(
          ST_MakePoint(${location.lng}, ${location.lat})::geography,
          ST_MakePoint(coordinates->>'lng', coordinates->>'lat')::geography
        ) / 1000 as distance
      FROM shops
      WHERE status = 'active'
        AND ST_DWithin(
          ST_MakePoint(${location.lng}, ${location.lat})::geography,
          ST_MakePoint(coordinates->>'lng', coordinates->>'lat')::geography,
          ${maxDistance * 1000}
        )
      ORDER BY distance
    `;

    return await db.execute(query);
  }

  private async scoreShop(
    shop: Shop,
    criteria: MatchingCriteria
  ): Promise<ShopMatch> {
    const [
      ingredientScore,
      availability,
      pricing,
      timing,
      rating,
    ] = await Promise.all([
      this.calculateIngredientMatch(shop, criteria.recipe),
      this.checkAvailability(shop, criteria.recipe),
      this.calculatePricing(shop, criteria.recipe),
      this.estimateTiming(shop),
      this.getShopRating(shop.id),
    ]);

    const distance = haversineDistance(
      criteria.userLocation,
      shop.coordinates
    );

    // Calculate weighted score
    const score = this.calculateOverallScore({
      distance,
      maxDistance: criteria.maxDistance,
      ingredientScore,
      pricing,
      rating,
      availability: availability.canMake,
    });

    return {
      shop,
      score,
      distance,
      availability,
      pricing,
      timing,
      compatibility: {
        ingredientMatch: ingredientScore,
        capabilityMatch: this.calculateCapabilityMatch(shop, criteria.recipe),
        dietaryMatch: this.calculateDietaryMatch(shop, criteria.dietary),
        overallScore: score,
      },
    };
  }

  private async calculateIngredientMatch(
    shop: Shop,
    recipe: Recipe
  ): Promise<number> {
    const inventory = await db
      .select()
      .from(shopInventory)
      .where(eq(shopInventory.shopId, shop.id));

    const requiredIngredients = this.extractIngredients(recipe);
    const availableIngredients = new Set(
      inventory.map(item => item.ingredientId)
    );

    let matchCount = 0;
    for (const ingredient of requiredIngredients) {
      if (availableIngredients.has(ingredient.id)) {
        matchCount++;
      }
    }

    return matchCount / requiredIngredients.length;
  }

  private async checkAvailability(
    shop: Shop,
    recipe: Recipe
  ): Promise<any> {
    const inventory = await db
      .select()
      .from(shopInventory)
      .where(eq(shopInventory.shopId, shop.id));

    const requiredIngredients = this.extractIngredients(recipe);
    const missingIngredients: string[] = [];
    const alternatives = new Map<string, string>();

    for (const required of requiredIngredients) {
      const available = inventory.find(
        item => item.ingredientId === required.id
      );

      if (!available || available.quantity < required.amount) {
        missingIngredients.push(required.name);
        
        // Find alternative
        const alt = await this.findAlternative(shop.id, required);
        if (alt) {
          alternatives.set(required.name, alt.name);
        }
      }
    }

    return {
      canMake: missingIngredients.length === 0 || alternatives.size >= missingIngredients.length,
      missingIngredients,
      alternativeIngredients: alternatives,
    };
  }

  private calculateOverallScore(factors: any): number {
    const distanceScore = 1 - (factors.distance / factors.maxDistance);
    
    return (
      distanceScore * this.weights.distance +
      factors.ingredientScore * this.weights.ingredientMatch +
      (1 - factors.pricing.normalized) * this.weights.price +
      factors.rating * this.weights.rating +
      (factors.availability ? 1 : 0.5) * this.weights.availability
    );
  }

  // Helper methods...
  private extractIngredients(recipe: Recipe): any[] {
    const ingredients: any[] = [];
    recipe.layers.forEach(layer => {
      layer.ingredients.forEach(ing => {
        ingredients.push({
          id: ing.ingredient.id,
          name: ing.ingredient.name,
          amount: ing.amount,
        });
      });
    });
    return ingredients;
  }

  private async findAlternative(shopId: string, ingredient: any): Promise<any> {
    // Find similar ingredient in shop inventory
    const alternatives = await db
      .select()
      .from(shopInventory)
      .innerJoin(ingredients, eq(shopInventory.ingredientId, ingredients.id))
      .where(
        and(
          eq(shopInventory.shopId, shopId),
          eq(ingredients.category, ingredient.category),
          gte(shopInventory.quantity, ingredient.amount)
        )
      )
      .limit(1);

    return alternatives[0];
  }
}
```

### 2. Recommendation System (Day 3-4)

**src/lib/marketplace/recommendation-service.ts**
```typescript
import { MatchingEngine } from './matching-engine';
import { db } from '@/lib/db';
import { shops, shopOrders, recipes, users } from '@/db/schema';
import { eq, desc, gte, sql } from 'drizzle-orm';

interface RecommendationContext {
  userId: string;
  location: { lat: number; lng: number };
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  weather?: 'hot' | 'cold' | 'rainy' | 'sunny';
  previousOrders: string[];
  preferences: UserPreferences;
}

export class RecommendationService {
  private matchingEngine: MatchingEngine;

  constructor() {
    this.matchingEngine = new MatchingEngine();
  }

  async getPersonalizedRecommendations(
    context: RecommendationContext
  ): Promise<ShopRecommendation[]> {
    const [
      userHistory,
      trendingShops,
      newShops,
      similarUsers,
    ] = await Promise.all([
      this.getUserOrderHistory(context.userId),
      this.getTrendingShops(context.location),
      this.getNewShops(context.location),
      this.findSimilarUsers(context.userId),
    ]);

    // Collaborative filtering
    const collaborativeRecs = await this.collaborativeFiltering(
      similarUsers,
      userHistory
    );

    // Content-based filtering
    const contentRecs = await this.contentBasedFiltering(
      context.preferences,
      userHistory
    );

    // Hybrid recommendations
    const recommendations = this.mergeRecommendations([
      { weight: 0.3, items: collaborativeRecs },
      { weight: 0.3, items: contentRecs },
      { weight: 0.2, items: trendingShops },
      { weight: 0.2, items: newShops },
    ]);

    // Apply contextual filters
    return this.applyContextualFilters(recommendations, context);
  }

  async getShopRecommendationsForRecipe(
    recipe: Recipe,
    location: { lat: number; lng: number }
  ): Promise<ShopRecommendation[]> {
    const matches = await this.matchingEngine.findMatches({
      recipe,
      userLocation: location,
      maxDistance: 10,
      priceRange: { min: 0, max: 100 },
      preferredShops: [],
      dietary: [],
      timePreference: 'best_match',
    });

    return matches.map(match => ({
      shop: match.shop,
      score: match.score,
      reason: this.generateRecommendationReason(match),
      highlights: this.extractHighlights(match),
      estimatedWait: match.timing.waitTime,
      price: match.pricing.withModifications,
    }));
  }

  private async getUserOrderHistory(userId: string) {
    return await db
      .select()
      .from(shopOrders)
      .where(eq(shopOrders.userId, userId))
      .orderBy(desc(shopOrders.createdAt))
      .limit(50);
  }

  private async getTrendingShops(location: { lat: number; lng: number }) {
    const query = sql`
      SELECT s.*, COUNT(o.id) as order_count
      FROM shops s
      LEFT JOIN shop_orders o ON s.id = o.shop_id
        AND o.created_at >= NOW() - INTERVAL '7 days'
      WHERE ST_DWithin(
        ST_MakePoint(${location.lng}, ${location.lat})::geography,
        ST_MakePoint(s.coordinates->>'lng', s.coordinates->>'lat')::geography,
        10000
      )
      GROUP BY s.id
      ORDER BY order_count DESC
      LIMIT 10
    `;

    return await db.execute(query);
  }

  private async collaborativeFiltering(
    similarUsers: string[],
    userHistory: any[]
  ) {
    // Get shops ordered by similar users but not by current user
    const userShops = new Set(userHistory.map(o => o.shopId));
    
    const recommendations = await db
      .select({
        shopId: shopOrders.shopId,
        count: sql`COUNT(*)`.as('order_count'),
        avgRating: sql`AVG(rating)`.as('avg_rating'),
      })
      .from(shopOrders)
      .where(
        and(
          inArray(shopOrders.userId, similarUsers),
          not(inArray(shopOrders.shopId, Array.from(userShops)))
        )
      )
      .groupBy(shopOrders.shopId)
      .orderBy(desc(sql`order_count`))
      .limit(20);

    return recommendations;
  }

  private async contentBasedFiltering(
    preferences: UserPreferences,
    userHistory: any[]
  ) {
    // Find shops with similar characteristics to user's preferred shops
    const preferredCharacteristics = await this.extractPreferredCharacteristics(
      userHistory
    );

    const query = sql`
      SELECT s.*,
        (
          CASE WHEN s.capabilities->>'canMakeLayered' = ${preferredCharacteristics.layered} THEN 0.2 ELSE 0 END +
          CASE WHEN s.subscription_tier = ${preferredCharacteristics.tier} THEN 0.2 ELSE 0 END +
          (1 - ABS(s.rating - ${preferredCharacteristics.avgRating}) / 5) * 0.3 +
          array_length(
            ARRAY(
              SELECT unnest(s.capabilities->'hasSuperfoods')
              INTERSECT
              SELECT unnest(${preferredCharacteristics.superfoods}::text[])
            ), 1
          ) * 0.3
        ) as similarity_score
      FROM shops s
      WHERE s.status = 'active'
      ORDER BY similarity_score DESC
      LIMIT 20
    `;

    return await db.execute(query);
  }

  private mergeRecommendations(
    sources: Array<{ weight: number; items: any[] }>
  ): ShopRecommendation[] {
    const scoreMap = new Map<string, number>();

    sources.forEach(({ weight, items }) => {
      items.forEach((item, index) => {
        const shopId = item.shopId || item.id;
        const currentScore = scoreMap.get(shopId) || 0;
        const itemScore = (items.length - index) / items.length;
        scoreMap.set(shopId, currentScore + weight * itemScore);
      });
    });

    return Array.from(scoreMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([shopId, score]) => ({ shopId, score }));
  }

  private generateRecommendationReason(match: ShopMatch): string {
    const reasons = [];

    if (match.distance < 1) {
      reasons.push('Very close to you');
    }
    if (match.compatibility.ingredientMatch > 0.9) {
      reasons.push('Has all ingredients');
    }
    if (match.pricing.withModifications < 10) {
      reasons.push('Great value');
    }
    if (match.timing.waitTime < 15) {
      reasons.push('Quick preparation');
    }

    return reasons.join(' • ');
  }
}
```

### 3. Review System (Day 5-6)

**src/db/schema/reviews.ts**
```typescript
import { pgTable, uuid, text, timestamp, integer, decimal, boolean, jsonb } from 'drizzle-orm/pg-core';

export const shopReviews = pgTable('shop_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  orderId: uuid('order_id').references(() => shopOrders.id),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  images: text('images').array(),
  aspects: jsonb('aspects'), // { taste: 5, service: 4, value: 5, accuracy: 4 }
  isVerifiedPurchase: boolean('is_verified_purchase').default(false),
  helpfulVotes: integer('helpful_votes').default(0),
  unhelpfulVotes: integer('unhelpful_votes').default(0),
  shopResponse: text('shop_response'),
  shopRespondedAt: timestamp('shop_responded_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const recipeRatings = pgTable('recipe_ratings', {
  id: uuid('id').defaultRandom().primaryKey(),
  recipeId: uuid('recipe_id').references(() => recipes.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(), // 1-5
  wouldMakeAgain: boolean('would_make_again'),
  difficulty: integer('difficulty'), // 1-5
  taste: integer('taste'), // 1-5
  nutrition: integer('nutrition'), // 1-5
  value: integer('value'), // 1-5
  modifications: text('modifications'),
  tips: text('tips'),
  images: text('images').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

**app/components/reviews/ReviewSystem.tsx**
```typescript
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Star, ThumbsUp, ThumbsDown, Camera, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface ReviewSystemProps {
  shopId: string;
  orderId?: string;
  existingReview?: any;
}

export function ReviewSystem({ shopId, orderId, existingReview }: ReviewSystemProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [aspects, setAspects] = useState({
    taste: 0,
    service: 0,
    value: 0,
    accuracy: 0,
  });
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();

  const submitReview = async () => {
    const response = await fetch('/api/reviews/shop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shopId,
        orderId,
        rating,
        comment,
        aspects,
        images,
      }),
    });

    if (response.ok) {
      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Your Experience</CardTitle>
        <CardDescription>
          Help others by sharing your experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Rating */}
        <div>
          <Label>Overall Rating</Label>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-colors"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratings */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(aspects).map(([aspect, value]) => (
            <div key={aspect}>
              <Label className="capitalize">{aspect}</Label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setAspects(prev => ({ ...prev, [aspect]: star }))}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= value
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comment */}
        <div>
          <Label>Your Review</Label>
          <Textarea
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] mt-2"
          />
        </div>

        {/* Image Upload */}
        <div>
          <Label>Add Photos</Label>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm">
              <Camera className="w-4 h-4 mr-2" />
              Upload Photos
            </Button>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Review ${idx + 1}`}
                className="w-16 h-16 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <Button 
          onClick={submitReview}
          disabled={rating === 0}
          className="w-full"
        >
          Submit Review
        </Button>
      </CardContent>
    </Card>
  );
}

export function ReviewList({ shopId }: { shopId: string }) {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          {[5, 4, 3, 2, 1].map((star) => (
            <Button
              key={star}
              variant={filter === String(star) ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(String(star))}
            >
              {star} ★
            </Button>
          ))}
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review: any) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={review.user.avatar} />
                    <AvatarFallback>
                      {review.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{review.user.name}</p>
                      {review.isVerifiedPurchase && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(review.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-gray-700">{review.comment}</p>

              {review.images?.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {review.images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Review ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-90"
                    />
                  ))}
                </div>
              )}

              {/* Helpful Votes */}
              <div className="flex items-center gap-4 mt-4">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Helpful ({review.helpfulVotes})
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsDown className="w-4 h-4 mr-1" />
                  Not Helpful
                </Button>
              </div>

              {/* Shop Response */}
              {review.shopResponse && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-primary">
                  <p className="text-sm font-semibold mb-1">Response from {shop.name}</p>
                  <p className="text-sm text-gray-700">{review.shopResponse}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(review.shopRespondedAt), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### 4. Real-time Availability (Day 7-8)

**src/lib/realtime/availability-tracker.ts**
```typescript
import { createClient } from '@supabase/supabase-js';
import { db } from '@/lib/db';
import { shops, shopInventory, shopOrders } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export class AvailabilityTracker {
  private supabase;
  private subscriptions: Map<string, any> = new Map();

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  subscribeToShop(shopId: string, callback: (data: any) => void) {
    const subscription = this.supabase
      .channel(`shop:${shopId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shop_inventory',
          filter: `shop_id=eq.${shopId}`,
        },
        (payload) => {
          this.handleInventoryChange(shopId, payload, callback);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shop_orders',
          filter: `shop_id=eq.${shopId}`,
        },
        (payload) => {
          this.handleOrderChange(shopId, payload, callback);
        }
      )
      .subscribe();

    this.subscriptions.set(shopId, subscription);
  }

  private async handleInventoryChange(
    shopId: string,
    payload: any,
    callback: (data: any) => void
  ) {
    const availability = await this.calculateAvailability(shopId);
    callback({
      type: 'inventory_update',
      shopId,
      availability,
      change: payload,
    });
  }

  private async handleOrderChange(
    shopId: string,
    payload: any,
    callback: (data: any) => void
  ) {
    const metrics = await this.getShopMetrics(shopId);
    callback({
      type: 'order_update',
      shopId,
      metrics,
      change: payload,
    });
  }

  async calculateAvailability(shopId: string): Promise<ShopAvailability> {
    const [inventory, activeOrders, shopInfo] = await Promise.all([
      this.getInventoryStatus(shopId),
      this.getActiveOrderCount(shopId),
      this.getShopInfo(shopId),
    ]);

    const estimatedWaitTime = this.estimateWaitTime(
      activeOrders,
      shopInfo.averagePrepTime
    );

    const canAcceptOrders = 
      shopInfo.isOpen &&
      activeOrders < shopInfo.maxConcurrentOrders &&
      estimatedWaitTime < 60;

    return {
      isOpen: shopInfo.isOpen,
      canAcceptOrders,
      estimatedWaitTime,
      activeOrders,
      maxOrders: shopInfo.maxConcurrentOrders,
      inventoryStatus: inventory,
      nextAvailableSlot: this.getNextAvailableSlot(shopInfo, activeOrders),
    };
  }

  private async getInventoryStatus(shopId: string) {
    const inventory = await db
      .select({
        ingredientId: shopInventory.ingredientId,
        quantity: shopInventory.quantity,
        minStock: shopInventory.minStock,
        status: sql`
          CASE 
            WHEN quantity = 0 THEN 'out_of_stock'
            WHEN quantity < min_stock THEN 'low_stock'
            ELSE 'in_stock'
          END
        `.as('status'),
      })
      .from(shopInventory)
      .where(eq(shopInventory.shopId, shopId));

    return {
      totalItems: inventory.length,
      outOfStock: inventory.filter(i => i.status === 'out_of_stock').length,
      lowStock: inventory.filter(i => i.status === 'low_stock').length,
      items: inventory,
    };
  }

  private estimateWaitTime(activeOrders: number, avgPrepTime: number): number {
    // Simple estimation - can be made more sophisticated
    return activeOrders * avgPrepTime * 0.7; // 0.7 factor for parallel preparation
  }

  unsubscribe(shopId: string) {
    const subscription = this.subscriptions.get(shopId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(shopId);
    }
  }

  unsubscribeAll() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();
  }
}
```

### 5. Search & Discovery (Day 9-10)

**app/components/marketplace/SearchDiscovery.tsx**
```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { ShopCard } from './ShopCard';
import { MapView } from './MapView';

export function SearchDiscovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [filters, setFilters] = useState({
    distance: 5,
    priceRange: [0, 50],
    rating: 0,
    dietary: [],
    capabilities: [],
    isOpen: false,
    hasDelivery: false,
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    searchShops();
  }, [debouncedSearch, filters, sortBy]);

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation(position.coords),
        (error) => console.error('Location error:', error)
      );
    }
  };

  const searchShops = async () => {
    if (!userLocation) return;

    setLoading(true);
    try {
      const response = await fetch('/api/marketplace/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: debouncedSearch,
          location: {
            lat: userLocation.latitude,
            lng: userLocation.longitude,
          },
          filters,
          sortBy,
        }),
      });

      const data = await response.json();
      setResults(data.shops);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickFilters = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'new', label: 'New', icon: Sparkles },
    { id: 'nearby', label: 'Nearby', icon: MapPin },
    { id: 'fast', label: 'Fast', icon: Clock },
    { id: 'deals', label: 'Deals', icon: DollarSign },
    { id: 'top-rated', label: 'Top Rated', icon: Star },
  ];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search shops, smoothies, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="lg">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Results</SheetTitle>
              <SheetDescription>
                Refine your search to find the perfect shop
              </SheetDescription>
            </SheetHeader>
            <FilterPanel filters={filters} setFilters={setFilters} />
          </SheetContent>
        </Sheet>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="preparation">Fastest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 flex-wrap">
        {quickFilters.map((filter) => (
          <Button
            key={filter.id}
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => handleQuickFilter(filter.id)}
          >
            <filter.icon className="w-4 h-4 mr-2" />
            {filter.label}
          </Button>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Found {results.length} shops near you
        </p>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            Map
          </Button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : viewMode === 'map' ? (
        <MapView shops={results} userLocation={userLocation} />
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''
        }`}>
          {results.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              viewMode={viewMode}
              userLocation={userLocation}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPanel({ filters, setFilters }: any) {
  const dietaryOptions = [
    'Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'
  ];

  const capabilityOptions = [
    'Layered Smoothies', 'Superfoods', 'Custom Orders', 'Organic'
  ];

  return (
    <div className="space-y-6 py-6">
      {/* Distance */}
      <div>
        <Label>Distance</Label>
        <div className="flex items-center gap-4 mt-2">
          <Slider
            value={[filters.distance]}
            onValueChange={(v) => setFilters(prev => ({ ...prev, distance: v[0] }))}
            max={20}
            step={1}
            className="flex-1"
          />
          <span className="w-12 text-right">{filters.distance}km</span>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label>Price Range (CHF)</Label>
        <div className="flex items-center gap-4 mt-2">
          <Input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              priceRange: [parseInt(e.target.value), prev.priceRange[1]]
            }))}
            className="w-20"
          />
          <span>to</span>
          <Input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              priceRange: [prev.priceRange[0], parseInt(e.target.value)]
            }))}
            className="w-20"
          />
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <Label>Minimum Rating</Label>
        <div className="flex gap-1 mt-2">
          {[0, 1, 2, 3, 4].map((rating) => (
            <Button
              key={rating}
              variant={filters.rating === rating ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, rating }))}
            >
              {rating === 0 ? 'Any' : `${rating}★+`}
            </Button>
          ))}
        </div>
      </div>

      {/* Dietary */}
      <div>
        <Label>Dietary Options</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {dietaryOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.dietary.includes(option)}
                onCheckedChange={(checked) => {
                  setFilters(prev => ({
                    ...prev,
                    dietary: checked
                      ? [...prev.dietary, option]
                      : prev.dietary.filter(d => d !== option)
                  }));
                }}
              />
              <Label className="text-sm font-normal">{option}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Capabilities */}
      <div>
        <Label>Shop Features</Label>
        <div className="space-y-2 mt-2">
          {capabilityOptions.map((capability) => (
            <div key={capability} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.capabilities.includes(capability)}
                onCheckedChange={(checked) => {
                  setFilters(prev => ({
                    ...prev,
                    capabilities: checked
                      ? [...prev.capabilities, capability]
                      : prev.capabilities.filter(c => c !== capability)
                  }));
                }}
              />
              <Label className="text-sm font-normal">{capability}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={filters.isOpen}
            onCheckedChange={(checked) => 
              setFilters(prev => ({ ...prev, isOpen: checked }))
            }
          />
          <Label className="text-sm font-normal">Open Now</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={filters.hasDelivery}
            onCheckedChange={(checked) => 
              setFilters(prev => ({ ...prev, hasDelivery: checked }))
            }
          />
          <Label className="text-sm font-normal">Delivery Available</Label>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => setFilters({
          distance: 5,
          priceRange: [0, 50],
          rating: 0,
          dietary: [],
          capabilities: [],
          isOpen: false,
          hasDelivery: false,
        })}
      >
        Reset Filters
      </Button>
    </div>
  );
}
```

## Testing Checklist

### Matching Algorithm
- [ ] Distance calculations accurate
- [ ] Ingredient matching works correctly
- [ ] Pricing calculations accurate
- [ ] Alternative suggestions logical
- [ ] Scoring weights balanced

### Recommendation System
- [ ] Personalized recommendations relevant
- [ ] Collaborative filtering works
- [ ] Content-based filtering accurate
- [ ] Context awareness functions
- [ ] Trending calculations correct

### Review System
- [ ] Reviews submit correctly
- [ ] Ratings calculate properly
- [ ] Image uploads work
- [ ] Shop responses display
- [ ] Verification badges show

### Real-time Updates
- [ ] Inventory changes reflect instantly
- [ ] Order status updates propagate
- [ ] Wait time estimates accurate
- [ ] Availability status correct
- [ ] WebSocket connections stable

### Search & Discovery
- [ ] Search results relevant
- [ ] Filters apply correctly
- [ ] Sort options work
- [ ] Map view functions
- [ ] Quick filters effective

## Next Phase

[Phase 6: Admin Dashboard](./phase6.md) - Build comprehensive admin control panel