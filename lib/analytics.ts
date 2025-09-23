export type AppEvent =
  | 'HeroViewed' | 'CTA_Click_Generate' | 'CTA_Click_FindShop'
  | 'Profile_Started' | 'Profile_Allergies_Selected' | 'Profile_Intolerances_Selected' | 'Profile_Goals_Selected' | 'Profile_Completed' | 'Profile_Skipped' | 'Profile_Skipped_Completely'
  | 'CheckIn_Started' | 'CheckIn_Completed' | 'CheckIn_Skipped'
  | 'SoftGate_SetupProfile_Click' | 'SoftGate_ContinueToShops_Click';

export function logEvent(name: AppEvent, meta: Record<string, any> = {}) {
  try {
    if (typeof window !== 'undefined') {
      const payload = { name, ts: Date.now(), ...meta };
      // Placeholder analytics: console + localStorage
      // Replace with your real analytics later
      // optional: navigator.sendBeacon('/api/analytics', JSON.stringify(payload))
      // eslint-disable-next-line no-console
      console.log('[analytics]', payload);
      const events = JSON.parse(localStorage.getItem('xova_events') || '[]');
      events.push(payload);
      localStorage.setItem('xova_events', JSON.stringify(events));
    }
  } catch {}
}
// Google Analytics 4 Integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) { return; }

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer.push(args);
  };

  // Configure GA
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  customParameters?: Record<string, any>
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...customParameters,
    });
  }
};

// Track user registration
export const trackUserRegistration = (method: string, userId?: string) => {
  trackEvent('sign_up', 'engagement', method, undefined, {
    method,
    user_id: userId,
  });
};

// Track recipe generation
export const trackRecipeGeneration = (recipeData: {
  recipeId: string;
  recipeName: string;
  goal: string;
  cost: number;
  userId?: string;
}) => {
  trackEvent('generate_recipe', 'engagement', recipeData.goal, recipeData.cost, {
    recipe_id: recipeData.recipeId,
    recipe_name: recipeData.recipeName,
    goal: recipeData.goal,
    cost: recipeData.cost,
    user_id: recipeData.userId,
  });
};

// Track shop interactions
export const trackShopInteraction = (action: string, shopId: string, shopName?: string) => {
  trackEvent(action, 'shop_interaction', shopName, undefined, {
    shop_id: shopId,
    shop_name: shopName,
  });
};

// Track conversions
export const trackConversion = (
  conversionType: string,
  value?: number,
  currency: string = 'CHF',
  additionalData?: Record<string, any>
) => {
  trackEvent('conversion', 'ecommerce', conversionType, value, {
    currency,
    value,
    ...additionalData,
  });
};

// Track errors
export const trackError = (error: Error, context?: string) => {
  trackEvent('exception', 'error', error.message, undefined, {
    description: error.message,
    fatal: false,
    context,
    stack: error.stack,
  });
};

// Enhanced ecommerce tracking for potential future use
export const trackPurchase = (transactionData: {
  transactionId: string;
  value: number;
  currency: string;
  items: Array<{
    itemId: string;
    itemName: string;
    category: string;
    quantity: number;
    price: number;
  }>;
}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'purchase', {
      transaction_id: transactionData.transactionId,
      value: transactionData.value,
      currency: transactionData.currency,
      items: transactionData.items.map(item => ({
        item_id: item.itemId,
        item_name: item.itemName,
        item_category: item.category,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }
};

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      custom_map: properties,
    });
  }
};

// Track user engagement
export const trackEngagement = (engagementData: {
  action: string;
  category: string;
  timeSpent?: number;
  scrollDepth?: number;
  clickCount?: number;
}) => {
  trackEvent(engagementData.action, engagementData.category, undefined, undefined, {
    time_spent: engagementData.timeSpent,
    scroll_depth: engagementData.scrollDepth,
    click_count: engagementData.clickCount,
  });
};

// Consent management (GDPR compliance)
export const setAnalyticsConsent = (granted: boolean) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    });
  }
};

// Initialize consent (call this before GA initialization)
export const initConsent = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
    });
  }
};
