'use client';

import { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function TestAnalyticsPage() {
  const { trackCustomEvent } = useAnalytics();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [customEventName, setCustomEventName] = useState('');
  const [customProperties, setCustomProperties] = useState('');

  const addResult = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    setTestResults(prev => [`${icon} [${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const testEvent = async (eventName: string, properties?: Record<string, any>) => {
    try {
      addResult(`Testing event: ${eventName}`, 'info');
      await trackCustomEvent(eventName, properties);
      addResult(`✅ Event "${eventName}" tracked successfully!`, 'success');
    } catch (error) {
      addResult(`❌ Failed to track "${eventName}": ${error}`, 'error');
    }
  };

  const testCustomEvent = async () => {
    if (!customEventName.trim()) {
      addResult('Please enter an event name', 'error');
      return;
    }

    let properties = {};
    if (customProperties.trim()) {
      try {
        properties = JSON.parse(customProperties);
      } catch (error) {
        addResult('Invalid JSON in properties field', 'error');
        return;
      }
    }

    await testEvent(customEventName, properties);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Test Page</h1>
          <p className="text-gray-600">
            Test your analytics tracking and verify events are being saved to Supabase.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Tests</CardTitle>
              <CardDescription>Test common analytics events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => testEvent('profile_started', { 
                  source: 'test', 
                  device: 'desktop',
                  timestamp: new Date().toISOString()
                })}
                className="w-full"
                variant="outline"
              >
                Test Profile Started
              </Button>
              
              <Button 
                onClick={() => testEvent('profile_submitted', { 
                  time_spent_seconds: 120,
                  allergies_count: 2,
                  goals: ['energy-boost', 'longevity'],
                  diet: 'vegan',
                  age_range: '26-35'
                })}
                className="w-full"
                variant="outline"
              >
                Test Profile Submitted
              </Button>
              
              <Button 
                onClick={() => testEvent('menu_viewed', { 
                  moods_displayed: 8,
                  mood_names: ['Energized', 'Relaxed', 'Focused'],
                  timestamp: new Date().toISOString()
                })}
                className="w-full"
                variant="outline"
              >
                Test Menu Viewed
              </Button>
              
              <Button 
                onClick={() => testEvent('smoothie_selected', { 
                  mood: 'Energized',
                  mood_id: 'energized',
                  recipe_name: 'Green Energy Smoothie',
                  recipe_cost: 8.50,
                  ingredients_count: 6,
                  goals: ['energy-boost'],
                  generation_time_ms: 1500
                })}
                className="w-full"
                variant="outline"
              >
                Test Smoothie Selected
              </Button>
              
              <Button 
                onClick={() => testEvent('checkout_started', { 
                  shops_available: 3,
                  top_match_score: 0.95,
                  recipe_id: 'recipe_123',
                  recipe_cost: 8.50,
                  timestamp: new Date().toISOString()
                })}
                className="w-full"
                variant="outline"
              >
                Test Checkout Started
              </Button>
            </CardContent>
          </Card>

          {/* Custom Event */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Event Test</CardTitle>
              <CardDescription>Test any custom event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  value={customEventName}
                  onChange={(e) => setCustomEventName(e.target.value)}
                  placeholder="e.g., button_clicked"
                />
              </div>
              
              <div>
                <Label htmlFor="properties">Properties (JSON)</Label>
                <Textarea
                  id="properties"
                  value={customProperties}
                  onChange={(e) => setCustomProperties(e.target.value)}
                  placeholder='{"key": "value", "count": 1}'
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={testCustomEvent}
                className="w-full"
                disabled={!customEventName.trim()}
              >
                Test Custom Event
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Check these results and then verify in your Supabase dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tests run yet. Click a test button above to start.
              </div>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Verify</CardTitle>
            <CardDescription>Check if your events are being saved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">1. Run Tests Above</h4>
                  <p className="text-sm text-gray-600">
                    Click the test buttons to generate sample events
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">2. Check Supabase Dashboard</h4>
                  <p className="text-sm text-gray-600">
                    Go to your Supabase project → Table Editor → user_events table
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">3. Run This Query</h4>
                  <p className="text-sm text-gray-600">
                    In Supabase SQL Editor, run:
                  </p>
                  <code className="block mt-2 p-2 bg-gray-100 rounded text-xs">
                    SELECT * FROM user_events ORDER BY timestamp DESC LIMIT 10;
                  </code>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">4. Check Analytics Dashboard</h4>
                  <p className="text-sm text-gray-600">
                    Visit <code>/admin/analytics</code> to see your data visualized
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environment Check */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Environment Check</CardTitle>
            <CardDescription>Verify your configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">
                  NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-yellow-600" />
                )}
                <span className="text-sm">
                  NEXT_PUBLIC_GA_MEASUREMENT_ID: {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'Not set (optional)'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}