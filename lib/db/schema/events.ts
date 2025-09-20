import { pgTable, uuid, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

export const eventParticipants = pgTable('event_participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  eventSlug: text('event_slug').notNull(), // e.g., 'free-smoothie'
  email: text('email').notNull(),
  fullName: text('full_name').notNull(),
  phoneNumber: text('phone_number'),
  questionnaire: jsonb('questionnaire'), // Store questionnaire responses
  completedAt: timestamp('completed_at'), // When they showed the green screen
  claimed: boolean('claimed').default(false), // Whether they claimed their smoothie
  claimedAt: timestamp('claimed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Type for questionnaire responses
export type QuestionnaireResponse = {
  drinksSmoothiesRegularly: 'never' | 'rarely' | 'weekly' | 'daily';
  healthGoals: ('energy' | 'longevity' | 'weight' | 'muscle' | 'wellness')[];
  nutritionConsciousness: 'not-at-all' | 'somewhat' | 'very' | 'extremely';
  exerciseFrequency: 'never' | '1-2-week' | '3-4-week' | 'daily';
  preferredFlavors: ('sweet' | 'fruity' | 'green' | 'protein' | 'nutty')[];
};