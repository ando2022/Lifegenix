'use client';

import { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { userTracker } from '@/lib/user-tracking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';

export default function TestAnalyticsPage() {
  const [events, setEvents] = useState<string[]>([]);
  const { trackCustomEvent, trackConversion, trackError } = useAnalytics();

  const addEvent = (eventDescription: string) => {
    setEvents(prev => [...prev, `${new Date().toLocaleTimeString()}: ${eventDescription}`]);
  };

  const testPageView = async () => {
    await userTracker.trackPageView('/test-analytics', { test: true });
    addEvent('Page view tracked');
  };

  const testCustomEvent = async () => {
    await trackCustomEvent('test_button_click', {
      button_name: 'Test Custom Event',
      page: '/test-analytics',
      timestamp: new Date().toISOString()
    });
    addEvent('Custom event tracked');
  };

  const testRecipeGeneration = async () => {
    const mockRecipe = {
      id: 'test-recipe-123',
      name: 'Test Energy Smoothie',
      goal: 'energy-boost',
      cost: 12.50
    };
    
    const mockProfile: any = {
      id: 'test-user',
      allergies: ['nuts'],
      diet: 'vegan'
    };

    const mockMood: any = {
      id: 'energetic',
      name: 'Energetic'
    };

    await userTracker.trackRecipeGeneration(mockProfile, mockMood, mockRecipe);
    addEvent('Recipe generation tracked');
  };

  const testShopInteraction = async () => {
    await userTracker.trackShopInteraction('shop_viewed', 'test-shop-123', {
      shopName: 'Test Juice Bar',
      city: 'Zürich'
    });
    addEvent('Shop interaction tracked');
  };

  const testConversion = async () => {
    await trackConversion('recipe_generated', 12.50, {
      recipe_id: 'test-recipe-123',
      goal: 'energy-boost'
    });
    addEvent('Conversion tracked');
  };

  const testError = async () => {
    const testError = new Error('This is a test error for analytics');
    await trackError(testError, 'analytics_test');
    addEvent('Error tracked');
  };

  const getSessionData = async () => {
    const sessionData = await userTracker.getSessionData();
    console.log('Current session data:', sessionData);
    addEvent('Session data logged to console');
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>🔬 Analytics Testing Dashboard</CardTitle>
            <p className="text-gray-600">
              Use this page to test your analytics implementation. 
              Check your browser console and Supabase database to see the tracked events.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Test Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button onClick={testPageView} variant="outline">
                Track Page View
              </Button>
              
              <Button onClick={testCustomEvent} variant="outline">
                Track Custom Event
              </Button>
              
              <Button onClick={testRecipeGeneration} variant="outline">
                Track Recipe Generation
              </Button>
              
              <Button onClick={testShopInteraction} variant="outline">
                Track Shop Interaction
              </Button>
              
              <Button onClick={testConversion} variant="outline">
                Track Conversion
              </Button>
              
              <Button onClick={testError} variant="outline">
                Track Error
              </Button>
              
              <Button onClick={getSessionData} variant="outline">
                Log Session Data
              </Button>
              
              <Button onClick={clearEvents} variant="destructive">
                Clear Events
              </Button>
            </div>

            {/* Event Log */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Event Log</h3>
              <div className="bg-gray-100 rounded-lg p-4 max-h-64 overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-gray-500 italic">No events tracked yet. Click the buttons above to test.</p>
                ) : (
                  <div className="space-y-1">
                    {events.map((event, index) => (
                      <div key={index} className="text-sm font-mono">
                        {event}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Verify Tracking</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>1. Browser Console:</strong> Open Developer Tools (F12) → Console tab to see debug logs</p>
                <p><strong>2. Supabase Database:</strong> Check the <code>user_events</code> table for tracked events</p>
                <p><strong>3. Google Analytics:</strong> Go to Realtime reports to see live activity</p>
                <p><strong>4. Network Tab:</strong> Watch for requests to Google Analytics and Supabase</p>
              </div>
            </div>

            {/* Environment Check */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Environment Check</h3>
              <div className="text-yellow-800 space-y-1">
                <p><strong>GA Measurement ID:</strong> {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? '✅ Configured' : '❌ Missing'}</p>
                <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}</p>
                <p><strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
