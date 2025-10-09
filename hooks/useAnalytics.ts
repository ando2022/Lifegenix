import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { userTracker } from '@/lib/user-tracking';
import * as analytics from '@/lib/analytics';
import { createClient } from '@/lib/supabase/client';

export const useAnalytics = () => {
  const router = useRouter();
  const supabase = createClient();

  // Initialize analytics on mount
  useEffect(() => {
    analytics.initGA();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      analytics.trackPageView(url);
      userTracker.trackPageView(url);
    };

    // Track initial page view
    handleRouteChange(window.location.pathname);

    // Note: Next.js 13+ app router doesn't have router events
    // You might need to implement this differently or use a different approach
    
    return () => {
      // Cleanup if needed
    };
  }, [router]);

  const trackUserRegistration = useCallback(async (user: any, profile: any) => {
    analytics.trackUserRegistration('email', user.id);
    await userTracker.trackUserRegistration(user, profile);
  }, []);

  const trackRecipeGeneration = useCallback(async (profile: any, mood: any, recipe: any) => {
    analytics.trackRecipeGeneration({
      recipeId: recipe.id,
      recipeName: recipe.name,
      goal: recipe.goal,
      cost: recipe.cost,
      userId: profile.id
    });
    await userTracker.trackRecipeGeneration(profile, mood, recipe);
  }, []);

  const trackShopInteraction = useCallback(async (action: string, shopId: string, shopName?: string) => {
    analytics.trackShopInteraction(action, shopId, shopName);
    await userTracker.trackShopInteraction(action, shopId, { shopName });
  }, []);

  const trackConversion = useCallback(async (conversionType: string, value?: number, additionalData?: Record<string, any>) => {
    analytics.trackConversion(conversionType, value, 'CHF', additionalData);
    await userTracker.trackConversion(conversionType, value, additionalData);
  }, []);

  const trackError = useCallback(async (error: Error, context?: string) => {
    analytics.trackError(error, context);
    await userTracker.trackError(error, context);
  }, []);

  const trackCustomEvent = useCallback(async (eventName: string, properties?: Record<string, any>) => {
    try {
      // Track to Google Analytics
      analytics.trackEvent(eventName, 'custom', eventName, undefined, properties);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Generate session ID if not exists
      let sessionId = sessionStorage.getItem('xova_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('xova_session_id', sessionId);
      }

      // Insert event into Supabase
      const { error } = await supabase
        .from('user_events')
        .insert({
          session_id: sessionId,
          user_id: user?.id || null,
          event_type: 'user_action',
          event_name: eventName,
          properties: properties || {},
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to track event:', error);
      } else {
        console.log('Event tracked:', eventName, properties);
      }
    } catch (error) {
      console.error('Error tracking custom event:', error);
    }
  }, [supabase]);

  const setUserProperties = useCallback((properties: Record<string, any>) => {
    analytics.setUserProperties(properties);
  }, []);

  const setAnalyticsConsent = useCallback((granted: boolean) => {
    analytics.setAnalyticsConsent(granted);
  }, []);

  return {
    trackUserRegistration,
    trackRecipeGeneration,
    trackShopInteraction,
    trackConversion,
    trackError,
    trackCustomEvent,
    setUserProperties,
    setAnalyticsConsent,
  };
};

// Hook for tracking user engagement (time on page, scroll depth, etc.)
export const useEngagementTracking = () => {
  useEffect(() => {
    let startTime = Date.now();
    let maxScrollDepth = 0;
    let clickCount = 0;

    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollDepth = Math.round((scrollTop + windowHeight) / documentHeight * 100);
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
      }
    };

    const trackClicks = () => {
      clickCount++;
    };

    const trackEngagement = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      analytics.trackEngagement({
        action: 'page_engagement',
        category: 'engagement',
        timeSpent,
        scrollDepth: maxScrollDepth,
        clickCount
      });
    };

    // Add event listeners
    window.addEventListener('scroll', trackScrollDepth);
    document.addEventListener('click', trackClicks);

    // Track engagement before page unload
    window.addEventListener('beforeunload', trackEngagement);

    // Track engagement periodically (every 30 seconds)
    const interval = setInterval(trackEngagement, 30000);

    return () => {
      window.removeEventListener('scroll', trackScrollDepth);
      document.removeEventListener('click', trackClicks);
      window.removeEventListener('beforeunload', trackEngagement);
      clearInterval(interval);
      
      // Track final engagement
      trackEngagement();
    };
  }, []);
};

// Hook for A/B testing (for future use)
export const useABTesting = () => {
  const getVariant = useCallback((testName: string): 'A' | 'B' => {
    // Simple hash-based variant assignment
    const userId = localStorage.getItem('userId') || 'anonymous';
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return Math.abs(hash) % 2 === 0 ? 'A' : 'B';
  }, []);

  const trackABTest = useCallback((testName: string, variant: string, outcome?: string) => {
    analytics.trackEvent('ab_test', 'experiment', testName, undefined, {
      test_name: testName,
      variant,
      outcome
    });
  }, []);

  return {
    getVariant,
    trackABTest
  };
};
