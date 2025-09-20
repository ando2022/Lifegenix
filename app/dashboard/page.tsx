'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, Heart, MapPin, Plus, Clock, Target, Coffee } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SavedSmoothie {
  id: string;
  name: string;
  recipe: any;
  mood: any;
  goals: string[];
  createdAt: string;
  totalNutrition: any;
  cost: number;
  isFavorite: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [smoothies, setSmoothies] = useState<SavedSmoothie[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadUserData = async () => {
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/signin');
        return;
      }
      
      setUser(user);
      
      // Fetch user's saved smoothies
      try {
        const response = await fetch('/api/smoothies');
        if (response.ok) {
          const data = await response.json();
          setSmoothies(data.smoothies);
        }
      } catch (error) {
        console.error('Error fetching smoothies:', error);
      }
      
      setLoading(false);
    };

    loadUserData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const navigateToGenerate = () => {
    router.push('/generate');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Smoothie Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.email}! Ready for your next healthy creation?
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Coffee className="w-5 h-5 text-teal-600" />
                Total Smoothies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-700">{smoothies.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-600" />
                Favorites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">
                {smoothies.filter(s => s.isFavorite === 'true').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Goals Tracked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">
                {Array.from(new Set(smoothies.flatMap(s => s.goals || []))).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">
                {smoothies.filter(s => {
                  const date = new Date(s.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return date > weekAgo;
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generate New Smoothie CTA */}
        <Card className="mb-8 bg-gradient-to-r from-teal-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Generate Your Perfect Smoothie</h2>
                <p className="text-white/90">
                  Create a personalized smoothie based on your health goals and preferences
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={navigateToGenerate}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                <Plus className="w-5 h-5 mr-2" />
                Generate Smoothie
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Saved Smoothies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your Saved Smoothies</CardTitle>
            <CardDescription>
              All your generated smoothie recipes in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            {smoothies.length === 0 ? (
              <div className="text-center py-12">
                <Coffee className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No smoothies yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start your health journey by generating your first personalized smoothie recipe!
                </p>
                <Button onClick={navigateToGenerate} size="lg">
                  <ChefHat className="w-5 h-5 mr-2" />
                  Generate Your First Smoothie
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {smoothies.map((smoothie) => (
                  <Card 
                    key={smoothie.id} 
                    className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                    onClick={() => router.push(`/smoothie/${smoothie.id}`)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-1">
                            {smoothie.name}
                          </CardTitle>
                          <CardDescription>
                            {formatDate(smoothie.createdAt)}
                          </CardDescription>
                        </div>
                        {smoothie.isFavorite === 'true' && (
                          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {smoothie.mood && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-lg">{smoothie.mood.icon || '🎯'}</span>
                            <span>{smoothie.mood.name}</span>
                          </div>
                        )}
                        
                        {smoothie.goals && smoothie.goals.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {smoothie.goals.slice(0, 3).map((goal, idx) => (
                              <span 
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                              >
                                {goal}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {smoothie.totalNutrition && (
                          <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                            <span>{smoothie.totalNutrition.calories || 0} cal</span>
                            <span>{smoothie.totalNutrition.protein || 0}g protein</span>
                            {smoothie.cost && (
                              <span>CHF {Number(smoothie.cost).toFixed(2)}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3 mt-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Find Shops
              </CardTitle>
              <CardDescription>
                Discover smoothie shops near you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/cafes')}
              >
                Explore Shops
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Health Goals
              </CardTitle>
              <CardDescription>
                Update your health preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/profile')}
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Favorites
              </CardTitle>
              <CardDescription>
                View your favorite recipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/favorites')}
              >
                View Favorites
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}