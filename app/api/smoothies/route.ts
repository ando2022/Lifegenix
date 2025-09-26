import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { db, savedSmoothies, users } from '@/lib/db';
import { eq, desc, and } from 'drizzle-orm';

// GET - Fetch user's saved smoothies or a specific smoothie
export async function GET(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const dbUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email!))
      .limit(1);

    if (dbUsers.length === 0) {
      return NextResponse.json({ smoothies: [] });
    }

    // Check if requesting a specific smoothie
    const url = new URL(request.url);
    const smoothieId = url.searchParams.get('id');

    if (smoothieId) {
      // Fetch specific smoothie
      const smoothie = await db
        .select()
        .from(savedSmoothies)
        .where(
          and(
            eq(savedSmoothies.id, smoothieId),
            eq(savedSmoothies.userId, dbUsers[0].id)
          )
        )
        .limit(1);

      if (smoothie.length === 0) {
        return NextResponse.json({ error: 'Smoothie not found' }, { status: 404 });
      }

      return NextResponse.json({ smoothie: smoothie[0] });
    } else {
      // Fetch all user's smoothies
      const smoothies = await db
        .select()
        .from(savedSmoothies)
        .where(eq(savedSmoothies.userId, dbUsers[0].id))
        .orderBy(desc(savedSmoothies.createdAt));

      return NextResponse.json({ smoothies });
    }
  } catch (error) {
    console.error('Error fetching smoothies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch smoothies' },
      { status: 500 }
    );
  }
}

// POST - Save a new smoothie
export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, recipe, mood, userProfile, goals, totalNutrition, cost } = body;
    
    // Get user from database
    const dbUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email!))
      .limit(1);
    
    let userId: string;
    
    if (dbUsers.length === 0) {
      // Create user if doesn't exist
      const [newUser] = await db
        .insert(users)
        .values({
          email: user.email!,
          fullName: user.user_metadata?.full_name || null,
        })
        .returning();
      userId = newUser.id;
    } else {
      userId = dbUsers[0].id;
    }
    
    // Extract ingredient names from recipe
    let ingredients: string[] = [];
    if (recipe?.layers) {
      recipe.layers.forEach((layer: any) => {
        layer.ingredients?.forEach((ing: any) => {
          if (ing.ingredient?.name) {
            ingredients.push(ing.ingredient.name);
          }
        });
      });
    } else if (recipe?.ingredients) {
      recipe.ingredients.forEach((ing: any) => {
        if (ing.ingredient?.name) {
          ingredients.push(ing.ingredient.name);
        }
      });
    }
    
    // Save the smoothie
    const [savedSmoothie] = await db
      .insert(savedSmoothies)
      .values({
        userId,
        name: name || `Smoothie ${new Date().toLocaleDateString()}`,
        recipe,
        mood,
        userProfile,
        goals: goals || [],
        ingredients,
        totalNutrition,
        cost: cost ? String(cost) : null,
      })
      .returning();
    
    return NextResponse.json({ 
      success: true, 
      smoothie: savedSmoothie 
    });
  } catch (error) {
    console.error('Error saving smoothie:', error);
    return NextResponse.json(
      { error: 'Failed to save smoothie' },
      { status: 500 }
    );
  }
}