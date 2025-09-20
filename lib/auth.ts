import { createSupabaseServerClient } from './supabase-server';
import { supabase } from './supabase';
import { db, users } from './db';
import { eq } from 'drizzle-orm';

export async function getServerUser() {
  const supabaseClient = createSupabaseServerClient();
  const { data: { user }, error } = await supabaseClient.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  // Get or create user in our database
  const dbUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, user.email!))
    .limit(1);
  
  if (dbUsers.length === 0) {
    // Create user if doesn't exist
    const [newUser] = await db
      .insert(users)
      .values({
        email: user.email!,
        fullName: user.user_metadata?.full_name || null,
        avatarUrl: user.user_metadata?.avatar_url || null,
      })
      .returning();
    return newUser;
  }
  
  return dbUsers[0];
}

export async function requireAuth() {
  const user = await getServerUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

// Client-side auth functions
export async function getClientUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return error ? null : user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = '/';
}