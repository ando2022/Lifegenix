'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyticsData {
  totalUsers: number;
  profilesStarted: number;
  profilesCompleted: number;
  recipesGenerated: number;
  completionRate: number;
  events: any[];
  userProfiles: any[];
  funnelData: {
    stage: string;
    count: number;
    percentage: number;
  }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'all'>('week');
  const supabase = createClient();

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  const loadAnalytics = async () => {
    setLoading(true);
    
    try {
      // Calculate date filter
      let dateFilter: Date | null = null;
      if (timeframe !== 'all') {
        dateFilter = new Date();
        if (timeframe === 'day') dateFilter.setDate(dateFilter.getDate() - 1);
        else if (timeframe === 'week') dateFilter.setDate(dateFilter.getDate() - 7);
        else if (timeframe === 'month') dateFilter.setMonth(dateFilter.getMonth() - 1);
      }

      // Get all user events
      let eventsQuery = supabase
        .from('user_events')
        .select('*')
        .order('timestamp', { ascending: false });

      if (dateFilter) {
        eventsQuery = eventsQuery.gte('timestamp', dateFilter.toISOString());
      }

      const { data: events } = await eventsQuery;

      // Get recipe generations (contains user profile snapshots)
      let recipeQuery = supabase
        .from('recipe_generations')
        .select('*')
        .order('timestamp', { ascending: false });

      if (dateFilter) {
        recipeQuery = recipeQuery.gte('timestamp', dateFilter.toISOString());
      }

      const { data: recipes } = await recipeQuery;

      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Calculate metrics
      const profilesStarted = events?.filter(e => e.event_name === 'profile_started').length || 0;
      const profilesCompleted = events?.filter(e => e.event_name === 'profile_submitted').length || 0;
      const menuViewed = events?.filter(e => e.event_name === 'menu_viewed').length || 0;
      const smoothiesSelected = events?.filter(e => e.event_name === 'smoothie_selected').length || 0;
      const checkoutStarted = events?.filter(e => e.event_name === 'checkout_started').length || 0;
      const registered = events?.filter(e => e.event_name === 'sign_up' || e.event_type === 'registration').length || 0;

      const completionRate = profilesStarted > 0 
        ? Math.round((profilesCompleted / profilesStarted) * 100) 
        : 0;

      // Build funnel data
      const funnelData = [
        { stage: 'Profile Started', count: profilesStarted, percentage: 100 },
        { 
          stage: 'Profile Completed', 
          count: profilesCompleted, 
          percentage: profilesStarted > 0 ? Math.round((profilesCompleted / profilesStarted) * 100) : 0 
        },
        { 
          stage: 'Menu Viewed', 
          count: menuViewed, 
          percentage: profilesCompleted > 0 ? Math.round((menuViewed / profilesCompleted) * 100) : 0 
        },
        { 
          stage: 'Smoothie Selected', 
          count: smoothiesSelected, 
          percentage: menuViewed > 0 ? Math.round((smoothiesSelected / menuViewed) * 100) : 0 
        },
        { 
          stage: 'Checkout Started', 
          count: checkoutStarted, 
          percentage: smoothiesSelected > 0 ? Math.round((checkoutStarted / smoothiesSelected) * 100) : 0 
        },
        { 
          stage: 'Registered', 
          count: registered, 
          percentage: profilesStarted > 0 ? Math.round((registered / profilesStarted) * 100) : 0 
        },
      ];

      // Extract user profiles from recipe generations
      const userProfiles = recipes?.map(r => ({
        timestamp: r.timestamp,
        mood: r.mood_name,
        goals: r.goal,
        profile: r.user_profile,
        recipeName: r.recipe_name,
        cost: r.cost
      })) || [];

      setData({
        totalUsers: totalUsers || 0,
        profilesStarted,
        profilesCompleted,
        recipesGenerated: recipes?.length || 0,
        completionRate,
        events: events || [],
        userProfiles,
        funnelData
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor user behavior and questionnaire responses</p>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex gap-2">
            <Button 
              variant={timeframe === 'day' ? 'default' : 'outline'}
              onClick={() => setTimeframe('day')}
              size="sm"
            >
              24h
            </Button>
            <Button 
              variant={timeframe === 'week' ? 'default' : 'outline'}
              onClick={() => setTimeframe('week')}
              size="sm"
            >
              7d
            </Button>
            <Button 
              variant={timeframe === 'month' ? 'default' : 'outline'}
              onClick={() => setTimeframe('month')}
              size="sm"
            >
              30d
            </Button>
            <Button 
              variant={timeframe === 'all' ? 'default' : 'outline'}
              onClick={() => setTimeframe('all')}
              size="sm"
            >
              All Time
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalUsers}</div>
              <p className="text-xs text-gray-500 mt-1">Registered accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                Profiles Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.profilesStarted}</div>
              <p className="text-xs text-gray-500 mt-1">Began questionnaire</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Profiles Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.profilesCompleted}</div>
              <p className="text-xs text-gray-500 mt-1">
                {data?.completionRate}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                Recipes Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.recipesGenerated}</div>
              <p className="text-xs text-gray-500 mt-1">Total smoothies created</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="funnel" className="space-y-4">
          <TabsList>
            <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
            <TabsTrigger value="profiles">User Profiles</TabsTrigger>
            <TabsTrigger value="events">Recent Events</TabsTrigger>
            <TabsTrigger value="raw">Raw Data</TabsTrigger>
          </TabsList>

          {/* Funnel Tab */}
          <TabsContent value="funnel">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Step-by-step user journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.funnelData.map((stage, idx) => (
                    <div key={idx} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {stage.stage}
                        </span>
                        <span className="text-sm text-gray-500">
                          {stage.count} users ({stage.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-teal-500 to-purple-500 h-8 rounded-full flex items-center justify-end pr-3 transition-all"
                          style={{ width: `${stage.percentage}%` }}
                        >
                          {stage.percentage > 20 && (
                            <span className="text-white text-xs font-medium">
                              {stage.percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Drop-off Analysis */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">📉 Drop-off Points</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    {data?.funnelData.map((stage, idx) => {
                      if (idx === 0) return null;
                      const dropOff = 100 - stage.percentage;
                      if (dropOff > 30) {
                        return (
                          <li key={idx}>
                            • {dropOff}% drop-off at "{stage.stage}"
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Profiles Tab */}
          <TabsContent value="profiles">
            <Card>
              <CardHeader>
                <CardTitle>Questionnaire Responses</CardTitle>
                <CardDescription>User profiles and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                {data?.userProfiles.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No user profiles collected yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data?.userProfiles.slice(0, 20).map((profile, idx) => (
                      <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {profile.recipeName || 'User Profile'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {new Date(profile.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {profile.mood && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                              {profile.mood}
                            </span>
                          )}
                        </div>
                        
                        {profile.profile && (
                          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                            {profile.profile.allergies && profile.profile.allergies.length > 0 && (
                              <div>
                                <span className="font-medium text-gray-700">Allergies:</span>
                                <span className="text-gray-600 ml-2">
                                  {profile.profile.allergies.join(', ')}
                                </span>
                              </div>
                            )}
                            {profile.profile.goals && profile.profile.goals.length > 0 && (
                              <div>
                                <span className="font-medium text-gray-700">Goals:</span>
                                <span className="text-gray-600 ml-2">
                                  {profile.profile.goals.join(', ')}
                                </span>
                              </div>
                            )}
                            {profile.profile.diet && (
                              <div>
                                <span className="font-medium text-gray-700">Diet:</span>
                                <span className="text-gray-600 ml-2">{profile.profile.diet}</span>
                              </div>
                            )}
                            {profile.cost && (
                              <div>
                                <span className="font-medium text-gray-700">Cost:</span>
                                <span className="text-gray-600 ml-2">CHF {profile.cost}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Live activity stream</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data?.events.slice(0, 50).map((event, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm py-2 border-b">
                      <span className={`
                        w-2 h-2 rounded-full
                        ${event.event_name === 'profile_submitted' ? 'bg-green-500' :
                          event.event_name === 'profile_started' ? 'bg-blue-500' :
                          event.event_name === 'smoothie_selected' ? 'bg-purple-500' :
                          'bg-gray-400'}
                      `}></span>
                      <span className="font-medium text-gray-700 min-w-[150px]">
                        {event.event_name}
                      </span>
                      <span className="text-gray-500 text-xs min-w-[150px]">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                      {event.properties && (
                        <span className="text-xs text-gray-400 truncate">
                          {JSON.stringify(event.properties).substring(0, 100)}...
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Raw Data Tab */}
          <TabsContent value="raw">
            <Card>
              <CardHeader>
                <CardTitle>Raw Data Export</CardTitle>
                <CardDescription>Download or view raw analytics data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={() => {
                      const dataStr = JSON.stringify(data, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `xova-analytics-${timeframe}-${new Date().toISOString()}.json`;
                      link.click();
                    }}
                  >
                    Download JSON
                  </Button>

                  <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                    <pre className="text-xs">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

