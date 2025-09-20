import { pgTable, uuid, text, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['user', 'shop_owner', 'admin']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').default('user').notNull(),
  phoneNumber: text('phone_number'),
  preferences: jsonb('preferences'),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  gender: text('gender'),
  age: text('age'), // Changed to text to match existing types
  location: jsonb('location'),
  allergies: text('allergies').array(),
  intolerances: text('intolerances').array(),
  diet: text('diet'),
  goals: text('goals').array(),
  dislikes: text('dislikes').array(),
  sweetnessTolerance: text('sweetness_tolerance'),
  texturePreference: text('texture_preference'),
  budget: text('budget'),
  activityLevel: text('activity_level'),
  flavorPreferences: jsonb('flavor_preferences'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

