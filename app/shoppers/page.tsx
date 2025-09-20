'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, Star, Zap, Shield, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ShoppersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-teal-600 to-mint-500 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              For Health-Conscious Shoppers
            </h1>
            <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
              Get personalized smoothie recipes that match your mood, respect your allergies, 
              and support your health goals. Available at partner shops or for home preparation.
            </p>
            <Link href="/generate" className="bg-white text-teal-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg inline-flex items-center">
              Start Creating Recipes
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Xova Works for You
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From mood to smoothie in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-teal-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Profile Setup</h3>
                <p className="text-gray-600">
                  Tell us about your allergies, dietary preferences, and health goals. 
                  Takes just 2 minutes and we'll remember your preferences.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-teal-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mood-Based Recipes</h3>
                <p className="text-gray-600">
                  Share how you're feeling today and get a personalized 3-layer smoothie 
                  recipe optimized for your specific needs and goals.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-teal-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Shop or Make at Home</h3>
                <p className="text-gray-600">
                  Find nearby partner shops that can make your recipe, or get detailed 
                  instructions to prepare it yourself at home.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Recipe */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Sample Layered Recipe
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Here's what a personalized longevity smoothie looks like with exact measurements
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
                      <span>💰 CHF 8.50</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Layer 1 */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 layer-gradient-1 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">1</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Base Layer (Thick)</h4>
                          <p className="text-sm text-gray-600">Frozen fruits + milk blend</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Frozen Banana</span>
                          <span className="font-medium">120g</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Frozen Mango</span>
                          <span className="font-medium">80g</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Oat Milk</span>
                          <span className="font-medium">140ml</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        <strong>Instructions:</strong> Blend frozen fruits with milk until thick and smooth
                      </p>
                    </div>

                    {/* Layer 2 */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 layer-gradient-2 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">2</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Yogurt Gradient</h4>
                          <p className="text-sm text-gray-600">Superfoods + yogurt blend</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Coconut Yogurt</span>
                          <span className="font-medium">120g</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Oats</span>
                          <span className="font-medium">2 tsp</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Cacao Powder</span>
                          <span className="font-medium">1 tsp</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        <strong>Instructions:</strong> Mix yogurt with superfoods and blend with base layer leftovers for gradient effect
                      </p>
                    </div>

                    {/* Layer 3 */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 layer-gradient-3 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">3</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Light Foam</h4>
                          <p className="text-sm text-gray-600">Whipped foam + enhancers</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Aquafaba</span>
                          <span className="font-medium">60ml</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Ginger Powder</span>
                          <span className="font-medium">¼ tsp</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Maple Syrup</span>
                          <span className="font-medium">1 tsp (optional)</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        <strong>Instructions:</strong> Whip aquafaba to soft peaks and add taste enhancers
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-3">Nutritional Benefits</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-teal-600">320</div>
                        <div className="text-xs text-gray-600">calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-teal-600">18g</div>
                        <div className="text-xs text-gray-600">protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-teal-600">45g</div>
                        <div className="text-xs text-gray-600">carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-teal-600">8g</div>
                        <div className="text-xs text-gray-600">fiber</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Xova?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Science-backed personalization for your health and wellness
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card text-center">
                <Shield className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Allergy-Safe Recipes</h3>
                <p className="text-gray-600 text-sm">
                  Every recipe is customized to avoid your specific allergens and dietary restrictions. 
                  No more guessing or worrying about ingredients.
                </p>
              </div>

              <div className="card text-center">
                <Zap className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Science-Based Goals</h3>
                <p className="text-gray-600 text-sm">
                  Recipes optimized for specific health goals: energy boost, digestive comfort, 
                  or complete meal replacement with proven ingredients.
                </p>
              </div>

              <div className="card text-center">
                <Users className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Shop Network</h3>
                <p className="text-gray-600 text-sm">
                  Find partner cafés and juice bars in your area that can prepare your 
                  personalized recipe with professional techniques.
                </p>
              </div>

              <div className="card text-center">
                <Star className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Beautiful Layered Drinks</h3>
                <p className="text-gray-600 text-sm">
                  Professional 3-layer smoothie techniques that create stunning visual 
                  effects while maximizing nutritional benefits.
                </p>
              </div>

              <div className="card text-center">
                <CheckCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Exact Measurements</h3>
                <p className="text-gray-600 text-sm">
                  Get precise ingredient amounts and preparation instructions for 
                  consistent results every time, whether at home or at a shop.
                </p>
              </div>

              <div className="card text-center">
                <Zap className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mood-Based Personalization</h3>
                <p className="text-gray-600 text-sm">
                  Your daily mood influences your recipe selection, ensuring you get 
                  the right nutrients and flavors for how you're feeling.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Pay only for what you use, with no hidden fees or subscriptions required
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Pay Per Recipe</h3>
                <div className="text-4xl font-bold text-teal-600 mb-4">CHF 5</div>
                <p className="text-gray-600 mb-6">per generated recipe</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Personalized 3-layer recipe</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Exact measurements & instructions</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Shop matching & recommendations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Nutritional analysis</span>
                  </li>
                </ul>
                <Link href="/generate" className="w-full btn-primary text-center block">
                  Get Started
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-100 relative">
                <div className="absolute top-4 right-4">
                  <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Unlimited Access</h3>
                <div className="text-4xl font-bold text-teal-600 mb-4">CHF 9</div>
                <p className="text-gray-600 mb-6">per month</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Unlimited recipe generation</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Save favorite recipes</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Priority shop matching</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Advanced personalization</span>
                  </li>
                </ul>
                <Link href="/generate" className="w-full btn-primary text-center block">
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-teal-600 to-mint-500">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform your smoothie routine?
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Join thousands of health-conscious individuals who've discovered personalized nutrition
            </p>
            <Link href="/generate" className="bg-white text-teal-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg inline-flex items-center">
              Create Your First Recipe
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
