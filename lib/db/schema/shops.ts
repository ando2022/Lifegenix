import { pgTable, uuid, text, timestamp, jsonb, decimal, boolean, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

export const shops = pgTable('shops', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  postalCode: text('postal_code'),
  coordinates: jsonb('coordinates').notNull(),
  phoneNumber: text('phone_number'),
  email: text('email'),
  website: text('website'),
  images: text('images').array(),
  capabilities: jsonb('capabilities'),
  businessHours: jsonb('business_hours'),
  status: text('status').default('pending'), // pending, active, suspended
  rating: decimal('rating', { precision: 3, scale: 2 }),
  reviewCount: integer('review_count').default(0),
  subscriptionTier: text('subscription_tier'), // starter, professional, enterprise
  subscriptionStatus: text('subscription_status'), // active, cancelled, past_due
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const shopMenuItems = pgTable('shop_menu_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  ingredients: text('ingredients').array(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url'),
  isAvailable: boolean('is_available').default(true),
  nutritionInfo: jsonb('nutrition_info'),
  allergens: text('allergens').array(),
  preparationTime: integer('preparation_time'), // in minutes
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

