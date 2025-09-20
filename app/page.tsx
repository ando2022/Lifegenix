'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, Users, Star, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/generate" className="btn-primary text-lg px-8 py-4">
                Generate My Smoothie
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/cafes" className="btn-secondary text-lg px-8 py-4">
                Find a Partner Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pickup or Order</h3>
              <p className="text-gray-600">
                Find nearby partner shops or order custom preparation. 
                Ready in 5-10 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
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
            <div className="card text-center">
              <Shield className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Allergies Respected</h3>
              <p className="text-gray-600 text-sm">
                Every recipe is customized to avoid your allergens and dietary restrictions.
              </p>
            </div>

            <div className="card text-center">
              <Zap className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Science-Based Goals</h3>
              <p className="text-gray-600 text-sm">
                Recipes optimized for energy, digestion, or meal replacement with proven ingredients.
              </p>
            </div>

            <div className="card text-center">
              <Users className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Preparation</h3>
              <p className="text-gray-600 text-sm">
                Simple, one-blend recipes that any café can make perfectly with standard equipment.
              </p>
            </div>

            <div className="card text-center">
              <Star className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Partnerships</h3>
              <p className="text-gray-600 text-sm">
                Connect with quality cafés and juice bars in your area for fresh preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Recipe Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sample Recipe
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Here's what a personalized smoothie looks like with full transparency
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Energy Boost Smoothie</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>⚡ Energy Goal</span>
                    <span>⏱️ 5 min prep</span>
                    <span>🌱 Plant-based</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Ingredients */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Exact Ingredients</h4>
                    <div className="space-y-3">
                      <div className="border-l-4 border-yellow-400 pl-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-gray-900 font-medium">Frozen banana</span>
                            <p className="text-xs text-gray-500">Potassium for muscle function, natural energy</p>
                          </div>
                          <span className="font-medium text-gray-900">120g (1 medium)</span>
                        </div>
                      </div>
                      <div className="border-l-4 border-orange-400 pl-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-gray-900 font-medium">Frozen mango</span>
                            <p className="text-xs text-gray-500">Vitamin C, beta-carotene for immunity</p>
                          </div>
                          <span className="font-medium text-gray-900">80g (½ cup)</span>
                        </div>
                      </div>
                      <div className="border-l-4 border-blue-400 pl-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-gray-900 font-medium">Coconut yogurt</span>
                            <p className="text-xs text-gray-500">Probiotics for gut health, healthy fats</p>
                          </div>
                          <span className="font-medium text-gray-900">100ml (⅓ cup)</span>
                        </div>
                      </div>
                      <div className="border-l-4 border-green-400 pl-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-gray-900 font-medium">Oat milk</span>
                            <p className="text-xs text-gray-500">Beta-glucan fiber, sustained energy</p>
                          </div>
                          <span className="font-medium text-gray-900">150ml (⅔ cup)</span>
                        </div>
                      </div>
                      <div className="border-l-4 border-amber-400 pl-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-gray-900 font-medium">Rolled oats</span>
                            <p className="text-xs text-gray-500">Complex carbs, protein, B-vitamins</p>
                          </div>
                          <span className="font-medium text-gray-900">20g (2 tbsp)</span>
                        </div>
                      </div>
                      <div className="border-l-4 border-purple-400 pl-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-gray-900 font-medium">Raw cacao powder</span>
                            <p className="text-xs text-gray-500">Antioxidants, natural mood booster</p>
                          </div>
                          <span className="font-medium text-gray-900">5g (1 tsp)</span>
                        </div>
                      </div>
                      <div className="border-l-4 border-red-400 pl-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-gray-900 font-medium">Fresh ginger</span>
                            <p className="text-xs text-gray-500">Anti-inflammatory, digestive support</p>
                          </div>
                          <span className="font-medium text-gray-900">2g (¼ tsp grated)</span>
                        </div>
                      </div>
                      <div className="border-l-4 border-yellow-600 pl-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-gray-900 font-medium">Maple syrup</span>
                            <p className="text-xs text-gray-500">Natural sweetener, minerals</p>
                          </div>
                          <span className="font-medium text-gray-900">10ml (2 tsp)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Simple Instructions</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-xs font-bold text-teal-600">1</span>
                        </div>
                        <p className="text-gray-600 text-sm">Add liquid ingredients first: oat milk and maple syrup</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-xs font-bold text-teal-600">2</span>
                        </div>
                        <p className="text-gray-600 text-sm">Add soft ingredients: banana, yogurt, grated ginger</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-xs font-bold text-teal-600">3</span>
                        </div>
                        <p className="text-gray-600 text-sm">Add frozen mango, oats, and cacao powder</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-xs font-bold text-teal-600">4</span>
                        </div>
                        <p className="text-gray-600 text-sm">Blend on high for 60-90 seconds until completely smooth</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-xs font-bold text-teal-600">5</span>
                        </div>
                        <p className="text-gray-600 text-sm">Serve immediately in a chilled glass</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                      <p className="text-sm text-teal-800">
                        <strong>Pro tip:</strong> For thicker consistency, use less oat milk. For protein boost, add 15g plant protein powder.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap gap-4 justify-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Dairy-free</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Gluten-free</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>High protein</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Antioxidants</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real feedback from health-conscious smoothie lovers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
"Finally, a smoothie app that shows exact quantities! 
                No more guessing - I know exactly what I'm drinking and it tastes amazing."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-teal-600 font-semibold">S</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah M.</div>
                  <div className="text-sm text-gray-600">Zurich</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The energy boost recipes are perfect for my morning routine. 
                I love that I can find shops nearby to make them for me."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-teal-600 font-semibold">M</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Michael R.</div>
                  <div className="text-sm text-gray-600">Basel</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "As a café owner, Xova has increased our smoothie sales by 40%. 
                The recipes are easy to follow and customers love the personalization."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-teal-600 font-semibold">A</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Anna K.</div>
                  <div className="text-sm text-gray-600">Café Owner, Geneva</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-mint-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform your smoothie experience?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Join thousands of health-conscious individuals who've discovered personalized nutrition
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate" className="bg-white text-teal-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link href="/cafes" className="border-2 border-white text-white hover:bg-white hover:text-teal-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg">
              Become a Partner
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
