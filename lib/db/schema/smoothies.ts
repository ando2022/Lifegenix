import { pgTable, uuid, text, timestamp, jsonb, decimal } from 'drizzle-orm/pg-core';
import { users } from './users';

export const savedSmoothies = pgTable('saved_smoothies', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  recipe: jsonb('recipe').notNull(), // Store the full recipe object
  mood: jsonb('mood'), // Store mood selection
  userProfile: jsonb('user_profile'), // Store user profile at time of generation
  ingredients: text('ingredients').array(), // Array of ingredient names for searching
  goals: text('goals').array(), // Health goals
  totalNutrition: jsonb('total_nutrition'), // Nutrition breakdown
  cost: decimal('cost', { precision: 10, scale: 2 }),
  imageUrl: text('image_url'), // Optional image if we generate one
  notes: text('notes'), // User notes
  isFavorite: text('is_favorite').default('false'), // Store as text to avoid boolean issues
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type SavedSmoothie = typeof savedSmoothies.$inferSelect;
export type NewSavedSmoothie = typeof savedSmoothies.$inferInsert;