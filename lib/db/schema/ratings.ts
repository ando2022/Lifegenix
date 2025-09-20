import { pgTable, uuid, text, timestamp, integer, decimal, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

export const ratingCategoryEnum = pgEnum('rating_category', [
  'taste',
  'quality', 
  'service',
  'value',
  'ambiance',
  'cleanliness'
]);

export const shops = pgTable('shops', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  country: text('country').default('Switzerland'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  instagram: text('instagram'),
  description: text('description'),
  category: text('category').default('juice-bar'), // juice-bar, cafe, smoothie-shop
  priceRange: text('price_range'), // $, $$, $$$
  openingHours: text('opening_hours'), // JSON string
  amenities: text('amenities').array(), // wifi, outdoor-seating, delivery, etc.
  dietaryOptions: text('dietary_options').array(), // vegan, gluten-free, etc.
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0'),
  totalReviews: integer('total_reviews').default(0),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const shopReviews = pgTable('shop_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  title: text('title'),
  comment: text('comment'),
  categoryRatings: text('category_ratings'), // JSON: {taste: 5, service: 4, etc.}
  visitDate: timestamp('visit_date'),
  orderDetails: text('order_details'), // What they ordered
  photos: text('photos').array(), // Photo URLs
  isVerified: boolean('is_verified').default(false), // Verified purchase
  helpfulCount: integer('helpful_count').default(0),
  reportCount: integer('report_count').default(0),
  isHidden: boolean('is_hidden').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const reviewHelpfulness = pgTable('review_helpfulness', {
  id: uuid('id').defaultRandom().primaryKey(),
  reviewId: uuid('review_id').references(() => shopReviews.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  isHelpful: boolean('is_helpful').notNull(), // true = helpful, false = not helpful
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const shopFavorites = pgTable('shop_favorites', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const shopMenuItems = pgTable('shop_menu_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 6, scale: 2 }),
  currency: text('currency').default('CHF'),
  category: text('category'), // smoothies, juices, bowls, etc.
  ingredients: text('ingredients').array(),
  allergens: text('allergens').array(),
  dietaryTags: text('dietary_tags').array(), // vegan, gluten-free, etc.
  calories: integer('calories'),
  isAvailable: boolean('is_available').default(true),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0'),
  reviewCount: integer('review_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const shopVisits = pgTable('shop_visits', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id).notNull(),
  userId: uuid('user_id').references(() => users.id),
  sessionId: text('session_id').notNull(),
  visitType: text('visit_type').notNull(), // view, contact, order, favorite
  recipeId: text('recipe_id'), // If visiting for a specific recipe
  duration: integer('duration'), // Time spent viewing (seconds)
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Aggregate table for shop analytics
export const shopAnalytics = pgTable('shop_analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id).notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  views: integer('views').default(0),
  contacts: integer('contacts').default(0),
  favorites: integer('favorites').default(0),
  orders: integer('orders').default(0),
  averageSessionDuration: integer('average_session_duration').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
