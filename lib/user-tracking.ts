import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/types';

export interface UserSession {
  id: string;
  userId?: string;
  sessionId: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    language: string;
    screenResolution: string;
    timezone: string;
  };
  location?: {
    city: string;
    country: string;
    ip?: string;
  };
  referrer?: string;
  startTime: Date;
  lastActivity: Date;
  pageViews: number;
  events: UserEvent[];
}

export interface UserEvent {
  id: string;
  sessionId: string;
  userId?: string;
  eventType: EventType;
  eventName: string;
  properties: Record<string, any>;
  timestamp: Date;
  page: string;
}

export type EventType = 
  | 'page_view'
  | 'user_action' 
  | 'registration'
  | 'recipe_generation'
  | 'shop_interaction'
  | 'error'
  | 'conversion';

export class UserTracker {
  private supabase = createClient();
  private sessionId: string;
  private userId?: string;
  private session: UserSession | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    if (typeof window !== 'undefined') {
      this.initializeSession();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeSession() {
    // Get current user if logged in
    const { data: { user } } = await this.supabase.auth.getUser();
    this.userId = user?.id;

    // Create session object
    this.session = {
      id: `${this.sessionId}_${Date.now()}`,
      userId: this.userId,
      sessionId: this.sessionId,
      deviceInfo: this.getDeviceInfo(),
      location: await this.getLocationInfo(),
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
      startTime: new Date(),
      lastActivity: new Date(),
      pageViews: 0,
      events: []
    };

    // Track session start
    await this.trackEvent('user_action', 'session_start', {
      isReturningUser: !!this.userId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      referrer: typeof document !== 'undefined' ? document.referrer : ''
    });
  }

  private getDeviceInfo() {
    return {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      platform: typeof navigator !== 'undefined' ? navigator.platform : '',
      language: typeof navigator !== 'undefined' ? navigator.language : '',
      screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  private async getLocationInfo() {
    try {
      // You can integrate with a geolocation service here
      // For now, we'll get basic info from the browser
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        city: data.city,
        country: data.country_name,
        ip: data.ip
      };
    } catch (error) {
      console.warn('Could not get location info:', error);
      return undefined;
    }
  }

  async trackUserRegistration(user: any, profile: UserProfile) {
    this.userId = user.id;
    
    // Update session with user ID
    if (this.session) {
      this.session.userId = user.id;
    }

    // Track registration event
    await this.trackEvent('registration', 'user_registered', {
      userId: user.id,
      email: user.email,
      registrationMethod: 'email',
      profileComplete: this.isProfileComplete(profile),
      allergies: profile.allergies,
      diet: profile.diet,
      goals: profile.goals,
      location: profile.location?.city
    });

    // Store user profile in database
    await this.storeUserProfile(user.id, profile);
  }

  async trackPageView(page: string, additionalProps?: Record<string, any>) {
    if (this.session) {
      this.session.pageViews++;
      this.session.lastActivity = new Date();
    }

    await this.trackEvent('page_view', 'page_viewed', {
      page,
      timestamp: new Date().toISOString(),
      ...additionalProps
    });
  }

  async trackRecipeGeneration(profile: UserProfile, mood: any, recipe: any) {
    await this.trackEvent('recipe_generation', 'recipe_generated', {
      userId: this.userId,
      goal: recipe.goal,
      moodId: mood.id,
      moodName: mood.name,
      recipeId: recipe.id,
      recipeName: recipe.name,
      recipeCost: recipe.cost,
      prepTime: recipe.prepTime,
      ingredients: recipe.ingredients?.map((ing: any) => ing.ingredient.name),
      userAllergies: profile.allergies,
      userDiet: profile.diet,
      userGoals: profile.goals
    });
  }

  async trackShopInteraction(action: string, shopId: string, additionalProps?: Record<string, any>) {
    await this.trackEvent('shop_interaction', action, {
      shopId,
      userId: this.userId,
      ...additionalProps
    });
  }

  async trackConversion(conversionType: string, value?: number, additionalProps?: Record<string, any>) {
    await this.trackEvent('conversion', conversionType, {
      userId: this.userId,
      value,
      currency: 'CHF',
      timestamp: new Date().toISOString(),
      ...additionalProps
    });
  }

  async trackError(error: Error, context?: string) {
    await this.trackEvent('error', 'error_occurred', {
      userId: this.userId,
      errorMessage: error.message,
      errorStack: error.stack,
      context,
      page: window.location.pathname,
      timestamp: new Date().toISOString()
    });
  }

  private async trackEvent(eventType: EventType, eventName: string, properties: Record<string, any>) {
    const event: UserEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: this.sessionId,
      userId: this.userId,
      eventType,
      eventName,
      properties,
      timestamp: new Date(),
      page: typeof window !== 'undefined' ? window.location.pathname : '/'
    };

    // Add to session events
    if (this.session) {
      this.session.events.push(event);
    }

    // Store in database
    try {
      await this.supabase.from('user_events').insert({
        id: event.id,
        session_id: event.sessionId,
        user_id: event.userId,
        event_type: event.eventType,
        event_name: event.eventName,
        properties: event.properties,
        timestamp: event.timestamp.toISOString(),
        page: event.page
      });
    } catch (error) {
      console.error('Failed to store event:', error);
    }

    // Also send to external analytics if configured
    await this.sendToAnalytics(event);
  }

  private async storeUserProfile(userId: string, profile: UserProfile) {
    try {
      // Store in profiles table
      await this.supabase.from('profiles').upsert({
        user_id: userId,
        gender: profile.gender,
        age: profile.age?.toString(),
        location: profile.location,
        allergies: profile.allergies,
        intolerances: profile.intolerances,
        diet: profile.diet,
        goals: profile.goals,
        dislikes: profile.dislikes,
        sweetness_tolerance: profile.sweetnessTolerance,
        texture_preference: profile.texturePreference,
        budget: profile.budget,
        activity_level: profile.activityLevel,
        flavor_preferences: profile.flavorPreferences,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to store user profile:', error);
    }
  }

  private isProfileComplete(profile: UserProfile): boolean {
    return !!(
      profile.allergies.length > 0 ||
      profile.diet !== 'none' ||
      profile.goals.length > 0
    );
  }

  private async sendToAnalytics(event: UserEvent) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', event.eventName, {
        event_category: event.eventType,
        event_label: event.page,
        user_id: event.userId,
        session_id: event.sessionId,
        custom_properties: event.properties
      });
    }

    // Mixpanel (if you want to add it)
    if (typeof mixpanel !== 'undefined') {
      mixpanel.track(event.eventName, {
        ...event.properties,
        $user_id: event.userId,
        $session_id: event.sessionId,
        page: event.page,
        timestamp: event.timestamp
      });
    }
  }

  async getSessionData(): Promise<UserSession | null> {
    return this.session;
  }

  async getUserAnalytics(userId: string, timeframe: 'day' | 'week' | 'month' = 'week') {
    const startDate = new Date();
    if (timeframe === 'day') {
      startDate.setDate(startDate.getDate() - 1);
    } else if (timeframe === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    try {
      const { data: events } = await this.supabase
        .from('user_events')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false });

      return this.analyzeUserEvents(events || []);
    } catch (error) {
      console.error('Failed to get user analytics:', error);
      return null;
    }
  }

  private analyzeUserEvents(events: any[]) {
    const analysis = {
      totalEvents: events.length,
      pageViews: events.filter(e => e.event_type === 'page_view').length,
      recipesGenerated: events.filter(e => e.event_name === 'recipe_generated').length,
      shopInteractions: events.filter(e => e.event_type === 'shop_interaction').length,
      conversions: events.filter(e => e.event_type === 'conversion').length,
      errors: events.filter(e => e.event_type === 'error').length,
      mostVisitedPages: this.getMostFrequent(events.filter(e => e.event_type === 'page_view').map(e => e.page)),
      favoriteGoals: this.getMostFrequent(events.filter(e => e.event_name === 'recipe_generated').map(e => e.properties?.goal)),
      sessionDuration: this.calculateAverageSessionDuration(events)
    };

    return analysis;
  }

  private getMostFrequent(items: string[]): Array<{item: string, count: number}> {
    const frequency = items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(frequency)
      .map(([item, count]) => ({ item, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private calculateAverageSessionDuration(events: any[]): number {
    // Implementation for calculating average session duration
    // This is a simplified version
    return events.length > 0 ? events.length * 2 : 0; // Rough estimate
  }
}

// Global tracker instance
let trackerInstance: UserTracker | null = null;

export const getUserTracker = (): UserTracker => {
  if (typeof window === 'undefined') {
    // Prevent usage on server
    throw new Error('UserTracker is client-only');
  }
  if (!trackerInstance) {
    trackerInstance = new UserTracker();
  }
  return trackerInstance;
};
