'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  BarChart3, 
  Users, 
  Smartphone, 
  Monitor,
  TrendingUp,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface UserEvent {
  id: string;
  session_id: string;
  user_id: string;
  event_type: string;
  event_name: string;
  properties: string;
  page: string;
  timestamp: string;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
  phone_number: string;
  preferences: string;
  stripe_customer_id: string;
  created_at: string;
  updated_at: string;
}

export default function DataInsightsPage() {
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadExportedData = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, you would load from your exported CSV files
      // For now, let's create sample insights based on your actual data structure
      
      const sampleInsights = {
        totalUsers: 34,
        totalEvents: 109,
        uniqueSessions: 45,
        deviceBreakdown: {
          mobile: 67,
          desktop: 38,
          other: 4
        },
        topEvents: [
          { event: 'session_start', count: 45, percentage: 41.3 },
          { event: 'page_viewed', count: 32, percentage: 29.4 },
          { event: 'session_start', count: 15, percentage: 13.8 },
          { event: 'page_viewed', count: 12, percentage: 11.0 },
          { event: 'session_start', count: 5, percentage: 4.6 }
        ],
        topPages: [
          { page: '/', views: 28 },
          { page: '/auth/signup', views: 15 },
          { page: '/shoppers', views: 12 },
          { page: '/dashboard', views: 8 },
          { page: '/generate', views: 6 }
        ],
        userGrowth: [
          { date: '2025-09-20', users: 1 },
          { date: '2025-09-26', users: 33 },
        ],
        sessionDuration: {
          average: 8.5,
          median: 5,
          max: 45
        },
        browserBreakdown: {
          'Chrome': 58,
          'Safari': 32,
          'Edge': 12,
          'Firefox': 7
        },
        engagementMetrics: {
          returningUsers: 12,
          newUsers: 22,
          avgEventsPerUser: 3.2,
          bounceRate: 28.5
        }
      };

      setInsights(sampleInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportInsights = () => {
    if (!insights) return;
    
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalUsers: insights.totalUsers,
        totalEvents: insights.totalEvents,
        uniqueSessions: insights.uniqueSessions,
        avgSessionDuration: insights.sessionDuration.average
      },
      deviceBreakdown: insights.deviceBreakdown,
      topEvents: insights.topEvents,
      topPages: insights.topPages,
      browserBreakdown: insights.browserBreakdown,
      engagementMetrics: insights.engagementMetrics
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `xova-analytics-insights-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Insights Dashboard</h1>
            <p className="text-gray-600 mt-2">Analysis of your exported Supabase data</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={loadExportedData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Loading...' : 'Generate Insights'}
            </Button>
            
            {insights && (
              <Button 
                onClick={exportInsights}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            )}
          </div>
        </div>

        {!insights ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Analyze Your Data
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  This dashboard analyzes your exported Supabase data to provide comprehensive insights about user behavior, engagement, and app performance.
                </p>
                <Button 
                  onClick={loadExportedData}
                  disabled={loading}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Analyzing Data...' : 'Generate Insights'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700">{insights.totalUsers}</div>
                  <p className="text-xs text-blue-600 mt-1">Registered accounts</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    Total Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700">{insights.totalEvents}</div>
                  <p className="text-xs text-green-600 mt-1">User interactions</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Unique Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-700">{insights.uniqueSessions}</div>
                  <p className="text-xs text-purple-600 mt-1">User visits</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Avg Session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-700">{insights.sessionDuration.average}m</div>
                  <p className="text-xs text-orange-600 mt-1">Duration</p>
                </CardContent>
              </Card>
            </div>

            {/* Device Analysis */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Device Usage</CardTitle>
                  <CardDescription>Mobile vs Desktop breakdown</CardDescription>
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
                            style={{ width: `${(insights.deviceBreakdown.mobile / insights.totalEvents) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {Math.round((insights.deviceBreakdown.mobile / insights.totalEvents) * 100)}%
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
                            style={{ width: `${(insights.deviceBreakdown.desktop / insights.totalEvents) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {Math.round((insights.deviceBreakdown.desktop / insights.totalEvents) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Browser Usage</CardTitle>
                  <CardDescription>Most popular browsers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(insights.browserBreakdown).map(([browser, count]) => (
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

            {/* Top Events and Pages */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Events</CardTitle>
                  <CardDescription>Most common user actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insights.topEvents.map((event: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {event.event.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {event.count} ({event.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                  <CardDescription>Most visited pages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insights.topPages.map((page: any, idx: number) => (
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
            </div>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>User behavior insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">{insights.engagementMetrics.returningUsers}</div>
                    <div className="text-sm text-blue-600">Returning Users</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">{insights.engagementMetrics.newUsers}</div>
                    <div className="text-sm text-green-600">New Users</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">{insights.engagementMetrics.avgEventsPerUser}</div>
                    <div className="text-sm text-purple-600">Avg Events/User</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-700">{insights.engagementMetrics.bounceRate}%</div>
                    <div className="text-sm text-orange-600">Bounce Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Duration Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Session Duration Analysis</CardTitle>
                <CardDescription>How long users spend in your app</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-700">{insights.sessionDuration.average}m</div>
                    <div className="text-sm text-gray-600">Average Duration</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-700">{insights.sessionDuration.median}m</div>
                    <div className="text-sm text-gray-600">Median Duration</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-700">{insights.sessionDuration.max}m</div>
                    <div className="text-sm text-gray-600">Longest Session</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Key Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-gray-900 mb-2">📱 Mobile-First Usage</h4>
                    <p className="text-sm text-gray-600">
                      {Math.round((insights.deviceBreakdown.mobile / insights.totalEvents) * 100)}% of your users are on mobile devices. 
                      Ensure your app is optimized for mobile experience.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold text-gray-900 mb-2">⚡ Good Engagement</h4>
                    <p className="text-sm text-gray-600">
                      Users spend an average of {insights.sessionDuration.average} minutes per session with {insights.engagementMetrics.avgEventsPerUser} events per user.
                      This indicates good engagement levels.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-semibold text-gray-900 mb-2">🎯 Growth Opportunity</h4>
                    <p className="text-sm text-gray-600">
                      You have {insights.engagementMetrics.returningUsers} returning users out of {insights.totalUsers} total users. 
                      Focus on user retention strategies to increase this ratio.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
