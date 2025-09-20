'use client';

import { Heart, Users, Zap, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-teal-600 to-mint-500 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About LifeGenix
            </h1>
            <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
              We're on a mission to make personalized nutrition accessible, 
              delicious, and scientifically-backed for everyone.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                To revolutionize the way people approach nutrition by combining cutting-edge science 
                with personalized convenience, making healthy eating both accessible and enjoyable.
              </p>
              <p className="text-lg text-gray-600">
                We believe that nutrition should be as unique as you are. That's why we've created 
                a platform that turns your mood, health goals, and dietary preferences into 
                scientifically-optimized smoothie recipes that you can enjoy at home or through 
                our network of partner cafés.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card text-center">
                <Heart className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Health First</h3>
                <p className="text-gray-600 text-sm">
                  Every recipe is designed with your health and wellness as the top priority, 
                  backed by scientific research and nutritional expertise.
                </p>
              </div>

              <div className="card text-center">
                <Users className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalization</h3>
                <p className="text-gray-600 text-sm">
                  We understand that one size doesn't fit all. Our platform adapts to your 
                  unique needs, preferences, and health goals.
                </p>
              </div>

              <div className="card text-center">
                <Zap className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">
                  We continuously push the boundaries of what's possible in personalized 
                  nutrition, using the latest technology and scientific discoveries.
                </p>
              </div>

              <div className="card text-center">
                <Shield className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
                <p className="text-gray-600 text-sm">
                  We believe in complete transparency about our ingredients, methods, 
                  and the science behind our recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                Our Story
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  LifeGenix was born from a simple observation: despite the growing awareness 
                  of nutrition's importance, most people still struggle to find healthy options 
                  that truly work for their individual needs.
                </p>
                
                <p className="text-gray-600 mb-6">
                  Our founder, a data scientist with a passion for longevity research, noticed 
                  that while smoothies were popular, they were often generic and didn't consider 
                  individual health goals, allergies, or dietary preferences. This led to the 
                  creation of a platform that could personalize nutrition at scale.
                </p>
                
                <p className="text-gray-600 mb-6">
                  We started with a simple question: "What if we could turn your mood into a 
                  scientifically-optimized smoothie recipe?" This question became the foundation 
                  for our 3-layer smoothie system, which combines the latest nutritional science 
                  with practical convenience.
                </p>
                
                <p className="text-gray-600 mb-6">
                  Today, LifeGenix serves thousands of health-conscious individuals across 
                  Switzerland, helping them achieve their wellness goals through personalized 
                  nutrition that's both delicious and effective.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Passionate experts in nutrition, technology, and wellness
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="card text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-teal-600">AD</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Anastasia Dobson</h3>
                <p className="text-teal-600 font-medium mb-2">Founder & CEO</p>
                <p className="text-gray-600 text-sm">
                  Data scientist with expertise in longevity research and personalized nutrition. 
                  Passionate about making science-backed health accessible to everyone.
                </p>
              </div>

              <div className="card text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-teal-600">DR</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dr. Sarah Chen</h3>
                <p className="text-teal-600 font-medium mb-2">Head of Nutrition Science</p>
                <p className="text-gray-600 text-sm">
                  Registered dietitian with 10+ years of experience in clinical nutrition 
                  and functional medicine. Ensures all recipes meet scientific standards.
                </p>
              </div>

              <div className="card text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-teal-600">MR</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Marcus Rodriguez</h3>
                <p className="text-teal-600 font-medium mb-2">Head of Technology</p>
                <p className="text-gray-600 text-sm">
                  Full-stack developer with expertise in AI and machine learning. 
                  Builds the technology that powers our personalization engine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Privacy */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Data Privacy & Security
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Your privacy and data security are our top priorities
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What We Collect</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Health goals and dietary preferences</li>
                    <li>• Allergies and food intolerances</li>
                    <li>• Mood and wellness data</li>
                    <li>• Recipe preferences and feedback</li>
                  </ul>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How We Protect It</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• End-to-end encryption for all data</li>
                    <li>• GDPR and Swiss privacy law compliance</li>
                    <li>• Regular security audits and updates</li>
                    <li>• No data sharing with third parties</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-gray-600 mb-4">
                  You have complete control over your data. You can view, edit, or delete 
                  your information at any time through your account settings.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/privacy" className="text-teal-600 hover:text-teal-700 font-medium">
                    Read our Privacy Policy
                  </a>
                  <a href="/terms" className="text-teal-600 hover:text-teal-700 font-medium">
                    View Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Have questions or want to learn more? We'd love to hear from you.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-900">Email:</span>
                      <span className="text-gray-600 ml-2">hello@xova.ch</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Phone:</span>
                      <span className="text-gray-600 ml-2">+41 44 123 45 67</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Address:</span>
                      <span className="text-gray-600 ml-2">Switzerland</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday:</span>
                      <span className="text-gray-900">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday:</span>
                      <span className="text-gray-900">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday:</span>
                      <span className="text-gray-900">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
