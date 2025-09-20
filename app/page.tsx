'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Zap, Shield, Users, Star, CheckCircle, Lock, Coffee } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGenerateClick = () => {
    if (user) {
      router.push('/generate');
    } else {
      setShowAuthPrompt(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Personalized smoothies in{' '}
              <span className="text-gradient">60 seconds</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Turn your mood into a scientifically-optimized personalized smoothie recipe. 
              Find nearby cafés or get custom orders delivered.
            </p>
            
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/generate" className="btn-primary text-lg px-8 py-4">
                  Generate My Smoothie
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/dashboard" className="btn-secondary text-lg px-8 py-4">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4">
                  Start Free Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/auth/signin" className="btn-secondary text-lg px-8 py-4">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Smoothie Generator Preview - Blurred for non-authenticated users */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Try Our Smoothie Generator
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create your perfect smoothie based on your mood and health goals
            </p>
          </div>

          <div className="relative">
            {/* Blur overlay for non-authenticated users */}
            {!user && (
              <>
                <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10 rounded-xl"></div>
                <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 max-w-md w-full">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-teal-600" />
                    </div>
                    <CardTitle className="text-2xl">Sign Up to Generate Smoothies</CardTitle>
                    <CardDescription className="text-base mt-2">
                      Create a free account to unlock personalized smoothie generation and save your favorite recipes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => router.push('/auth/signup')}
                    >
                      Sign Up Free
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/auth/signin')}
                    >
                      Already have an account? Sign In
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Preview of the generator */}
            <div className={!user ? "pointer-events-none" : ""}>
              <Card className="max-w-4xl mx-auto">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Mood Selection Preview */}
                    <div className="text-center p-4">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">😊</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Select Your Mood</h3>
                      <p className="text-sm text-gray-600">
                        Choose how you're feeling today
                      </p>
                    </div>

                    {/* Goals Preview */}
                    <div className="text-center p-4">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🎯</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Set Health Goals</h3>
                      <p className="text-sm text-gray-600">
                        Energy, longevity, or wellness
                      </p>
                    </div>

                    {/* Recipe Preview */}
                    <div className="text-center p-4">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Coffee className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Get Your Recipe</h3>
                      <p className="text-sm text-gray-600">
                        Personalized to your preferences
                      </p>
                    </div>
                  </div>

                  {user && (
                    <div className="mt-8 text-center">
                      <Button 
                        size="lg" 
                        onClick={() => router.push('/generate')}
                        className="bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700"
                      >
                        <Coffee className="w-5 h-5 mr-2" />
                        Start Generating Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to your perfect personalized smoothie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-teal-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Profile</h3>
              <p className="text-gray-600">
                Tell us about your allergies, diet, and health goals. 
                Takes just 2 minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Recipe</h3>
              <p className="text-gray-600">
                Share your mood and get a personalized smoothie 
                recipe with exact measurements and transparency.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-teal-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Save & Track</h3>
              <p className="text-gray-600">
                Save your favorite recipes and track your health journey 
                in your personal dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Xova?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Science meets convenience for your health and wellness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card hover:shadow-lg transition-shadow">
              <div className="p-6 text-center">
                <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Instant Generation
                </h3>
                <p className="text-gray-600">
                  Get your personalized recipe in under 60 seconds
                </p>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-shadow">
              <div className="p-6 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Allergy Safe
                </h3>
                <p className="text-gray-600">
                  Automatically filters out your allergens and intolerances
                </p>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-shadow">
              <div className="p-6 text-center">
                <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Partner Network
                </h3>
                <p className="text-gray-600">
                  50+ cafés across Switzerland ready to make your smoothie
                </p>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-shadow">
              <div className="p-6 text-center">
                <Star className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Save Favorites
                </h3>
                <p className="text-gray-600">
                  Track your smoothie journey and reorder with one click
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users creating personalized smoothies daily
          </p>
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100"
                onClick={() => router.push('/generate')}
              >
                Generate a Smoothie
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => router.push('/dashboard')}
              >
                View Dashboard
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100"
                onClick={() => router.push('/auth/signup')}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => router.push('/auth/signin')}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}