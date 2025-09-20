import { pgTable, uuid, text, timestamp, jsonb, decimal, integer, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

export const recipes = pgTable('recipes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  name: text('name').notNull(),
  goal: text('goal').notNull(),
  mood: jsonb('mood'),
  layers: jsonb('layers').notNull(),
  totalNutrition: jsonb('total_nutrition'),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  prepTime: integer('prep_time'),
  difficulty: text('difficulty'),
  generationCount: integer('generation_count').default(0),
  isFavorite: boolean('is_favorite').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const ingredients = pgTable('ingredients', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  category: text('category').notNull(),
  nutrition: jsonb('nutrition'),
  allergens: text('allergens').array(),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  quality: text('quality'),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

