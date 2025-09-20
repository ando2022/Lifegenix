import { pgTable, uuid, text, timestamp, jsonb, integer, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

export const eventTypeEnum = pgEnum('event_type', [
  'page_view',
  'user_action', 
  'registration',
  'recipe_generation',
  'shop_interaction',
  'error',
  'conversion'
]);

export const userEvents = pgTable('user_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: text('session_id').notNull(),
  userId: uuid('user_id').references(() => users.id),
  eventType: eventTypeEnum('event_type').notNull(),
  eventName: text('event_name').notNull(),
  properties: jsonb('properties'),
  page: text('page'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userSessions = pgTable('user_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: text('session_id').notNull().unique(),
  userId: uuid('user_id').references(() => users.id),
  deviceInfo: jsonb('device_info'),
  location: jsonb('location'),
  referrer: text('referrer'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  lastActivity: timestamp('last_activity'),
  pageViews: integer('page_views').default(0),
  duration: integer('duration'), // in seconds
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recipeGenerations = pgTable('recipe_generations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  sessionId: text('session_id').notNull(),
  recipeId: text('recipe_id').notNull(),
  recipeName: text('recipe_name'),
  goal: text('goal'),
  moodId: text('mood_id'),
  moodName: text('mood_name'),
  ingredients: jsonb('ingredients'),
  cost: text('cost'), // Store as text to avoid precision issues
  prepTime: integer('prep_time'),
  userProfile: jsonb('user_profile'), // Snapshot of user preferences at time of generation
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const shopInteractions = pgTable('shop_interactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  sessionId: text('session_id').notNull(),
  shopId: text('shop_id').notNull(),
  shopName: text('shop_name'),
  action: text('action').notNull(), // 'view', 'contact', 'order', etc.
  recipeId: text('recipe_id'),
  properties: jsonb('properties'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const conversions = pgTable('conversions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  sessionId: text('session_id').notNull(),
  conversionType: text('conversion_type').notNull(), // 'recipe_generated', 'shop_contacted', 'subscription_started'
  value: text('value'), // Store as text for currency precision
  currency: text('currency').default('CHF'),
  properties: jsonb('properties'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const userAnalytics = pgTable('user_analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  date: text('date').notNull(), // YYYY-MM-DD format
  pageViews: integer('page_views').default(0),
  recipesGenerated: integer('recipes_generated').default(0),
  shopInteractions: integer('shop_interactions').default(0),
  conversions: integer('conversions').default(0),
  sessionDuration: integer('session_duration').default(0), // in seconds
  lastActivity: timestamp('last_activity'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
