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
  Clock,
  BarChart3,
  Smartphone,
  Monitor,
  Globe,
  Calendar,
  Target,
  Zap,
  Heart,
  Coffee
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyticsData {
  totalUsers: number;
  totalEvents: number;
  uniqueSessions: number;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    other: number;
  };
  browserBreakdown: Record<string, number>;
  eventTypes: Record<string, number>;
  dailyActivity: Array<{
    date: string;
    events: number;
    users: number;
    sessions: number;
  }>;
  topPages: Array<{
    page: string;
    views: number;
  }>;
  userJourney: Array<{
    event: string;
    count: number;
    percentage: number;
  }>;
  recentEvents: Array<{
    timestamp: string;
    event: string;
    user: string;
    device: string;
    page: string;
  }>;
  sessionData: Array<{
    sessionId: string;
    userId?: string;
    startTime: string;
    events: number;
    duration: number;
    device: string;
  }>;
}

export default function ComprehensiveAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'all'>('all');
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

      // Get users data
      const { data: users } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      // Get saved smoothies
      const { data: smoothies } = await supabase
        .from('saved_smoothies')
        .select('*')
        .order('created_at', { ascending: false });

      // Process analytics data
      const analyticsData = processAnalyticsData(events || [], users || [], smoothies || []);
      setData(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (events: any[], users: any[], smoothies: any[]): AnalyticsData => {
    // Device breakdown
    const deviceBreakdown = { mobile: 0, desktop: 0, other: 0 };
    const browserBreakdown: Record<string, number> = {};
    const eventTypes: Record<string, number> = {};
    const pageViews: Record<string, number> = {};
    const sessionData: Record<string, any> = {};

    // Process events
    events.forEach(event => {
      // Count event types
      eventTypes[event.event_name] = (eventTypes[event.event_name] || 0) + 1;

      // Device analysis
      if (event.properties?.userAgent) {
        const userAgent = event.properties.userAgent;
        if (userAgent.includes('Mobile') || userAgent.includes('iPhone') || userAgent.includes('Android')) {
          deviceBreakdown.mobile++;
        } else if (userAgent.includes('Windows') || userAgent.includes('Macintosh') || userAgent.includes('Linux')) {
          deviceBreakdown.desktop++;
        } else {
          deviceBreakdown.other++;
        }

        // Browser analysis
        if (userAgent.includes('Chrome')) browserBreakdown['Chrome'] = (browserBreakdown['Chrome'] || 0) + 1;
        else if (userAgent.includes('Safari')) browserBreakdown['Safari'] = (browserBreakdown['Safari'] || 0) + 1;
        else if (userAgent.includes('Firefox')) browserBreakdown['Firefox'] = (browserBreakdown['Firefox'] || 0) + 1;
        else if (userAgent.includes('Edge')) browserBreakdown['Edge'] = (browserBreakdown['Edge'] || 0) + 1;
        else browserBreakdown['Other'] = (browserBreakdown['Other'] || 0) + 1;
      }

      // Page views
      if (event.page) {
        pageViews[event.page] = (pageViews[event.page] || 0) + 1;
      }

      // Session tracking
      if (event.session_id) {
        if (!sessionData[event.session_id]) {
          sessionData[event.session_id] = {
            sessionId: event.session_id,
            userId: event.user_id,
            startTime: event.timestamp,
            events: 0,
            device: event.properties?.userAgent?.includes('Mobile') ? 'Mobile' : 'Desktop'
          };
        }
        sessionData[event.session_id].events++;
      }
    });

    // Calculate session durations
    const sessionArray = Object.values(sessionData).map((session: any) => {
      const endEvents = events.filter(e => e.session_id === session.sessionId).sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      const duration = endEvents.length > 0 ? 
        Math.round((new Date(endEvents[0].timestamp).getTime() - new Date(session.startTime).getTime()) / 1000 / 60) : 0;
      
      return {
        ...session,
        duration: Math.max(duration, 1) // At least 1 minute
      };
    });

    // Daily activity
    const dailyActivity = calculateDailyActivity(events);

    // User journey analysis
    const userJourney = calculateUserJourney(events);

    // Top pages
    const topPages = Object.entries(pageViews)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Recent events
    const recentEvents = events.slice(0, 20).map(event => ({
      timestamp: event.timestamp,
      event: event.event_name,
      user: event.user_id ? (users.find(u => u.id === event.user_id)?.full_name || 'Anonymous') : 'Anonymous',
      device: event.properties?.userAgent?.includes('Mobile') ? '📱 Mobile' : '💻 Desktop',
      page: event.page || '/'
    }));

    return {
      totalUsers: users.length,
      totalEvents: events.length,
      uniqueSessions: Object.keys(sessionData).length,
      deviceBreakdown,
      browserBreakdown,
      eventTypes,
      dailyActivity,
      topPages,
      userJourney,
      recentEvents,
      sessionData: sessionArray
    };
  };

  const calculateDailyActivity = (events: any[]) => {
    const dailyMap: Record<string, { events: number; users: Set<string>; sessions: Set<string> }> = {};
    
    events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = { events: 0, users: new Set(), sessions: new Set() };
      }
      dailyMap[date].events++;
      if (event.user_id) dailyMap[date].users.add(event.user_id);
      if (event.session_id) dailyMap[date].sessions.add(event.session_id);
    });

    return Object.entries(dailyMap)
      .map(([date, data]) => ({
        date,
        events: data.events,
        users: data.users.size,
        sessions: data.sessions.size
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const calculateUserJourney = (events: any[]) => {
    const journeyMap: Record<string, number> = {};
    
    events.forEach(event => {
      journeyMap[event.event_name] = (journeyMap[event.event_name] || 0) + 1;
    });

    const total = events.length;
    return Object.entries(journeyMap)
      .map(([event, count]) => ({
        event,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comprehensive analytics...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Comprehensive Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Complete insights from your XOVA user data</p>
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
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">{data?.totalUsers}</div>
              <p className="text-xs text-blue-600 mt-1">Registered accounts</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{data?.totalEvents}</div>
              <p className="text-xs text-green-600 mt-1">User interactions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                Unique Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">{data?.uniqueSessions}</div>
              <p className="text-xs text-purple-600 mt-1">User visits</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Coffee className="w-5 h-5 text-orange-600" />
                Avg Session Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700">
                {data?.sessionData.length ? Math.round(data.sessionData.reduce((acc, s) => acc + s.duration, 0) / data.sessionData.length) : 0}m
              </div>
              <p className="text-xs text-orange-600 mt-1">Time per session</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="journey">User Journey</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="events">Live Events</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                  <CardDescription>Most visited pages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data?.topPages.slice(0, 8).map((page, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {page.page}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {page.views}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Event Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Types</CardTitle>
                  <CardDescription>User interaction breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(data?.eventTypes || {})
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 8)
                      .map(([event, count]) => (
                      <div key={event} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {event.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Types</CardTitle>
                  <CardDescription>Mobile vs Desktop usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Mobile</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(data?.deviceBreakdown.mobile || 0) / (data?.totalEvents || 1) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {data?.deviceBreakdown.mobile || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Desktop</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(data?.deviceBreakdown.desktop || 0) / (data?.totalEvents || 1) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {data?.deviceBreakdown.desktop || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Other</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${(data?.deviceBreakdown.other || 0) / (data?.totalEvents || 1) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {data?.deviceBreakdown.other || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Browser Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Browser Usage</CardTitle>
                  <CardDescription>Most popular browsers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(data?.browserBreakdown || {})
                      .sort(([,a], [,b]) => b - a)
                      .map(([browser, count]) => (
                      <div key={browser} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {browser}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Journey Tab */}
          <TabsContent value="journey">
            <Card>
              <CardHeader>
                <CardTitle>User Journey Analysis</CardTitle>
                <CardDescription>Most common user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.userJourney.map((journey, idx) => (
                    <div key={idx} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {journey.event.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm text-gray-500">
                          {journey.count} events ({journey.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-teal-500 to-purple-500 h-8 rounded-full flex items-center justify-end pr-3 transition-all"
                          style={{ width: `${journey.percentage}%` }}
                        >
                          {journey.percentage > 15 && (
                            <span className="text-white text-xs font-medium">
                              {journey.percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>Events and users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.dailyActivity.slice(-14).map((day, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="text-sm text-gray-500">
                          {day.events} events
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Events:</span>
                          <span className="ml-2 font-medium">{day.events}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Users:</span>
                          <span className="ml-2 font-medium">{day.users}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Sessions:</span>
                          <span className="ml-2 font-medium">{day.sessions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Session Analysis</CardTitle>
                <CardDescription>User session details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.sessionData.slice(0, 20).map((session, idx) => (
                    <div key={idx} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              Session {session.sessionId.slice(-8)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              session.device === 'Mobile' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {session.device}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(session.startTime).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{session.events} events</div>
                          <div className="text-xs text-gray-500">{session.duration}min</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Live event stream</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data?.recentEvents.map((event, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm py-2 border-b">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="font-medium text-gray-700 min-w-[120px]">
                        {event.event.replace(/_/g, ' ')}
                      </span>
                      <span className="text-gray-500 min-w-[100px]">
                        {event.user}
                      </span>
                      <span className="text-gray-500 min-w-[80px]">
                        {event.device}
                      </span>
                      <span className="text-gray-500 text-xs min-w-[100px]">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        {event.page}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
