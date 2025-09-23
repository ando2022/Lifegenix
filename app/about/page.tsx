'use client';

import { useState } from 'react';
import { Heart, Users, Zap, Shield, Mail, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to your backend
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-violet-600 to-fuchsia-500 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About Xova
            </h1>
            <p className="text-xl text-violet-100 mb-8 max-w-3xl mx-auto">
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

        {/* Why Xova Works (moved from recipe page) */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Why Xova Works For You</h2>
              <ul className="space-y-4 text-gray-700 text-lg">
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center mr-3">✓</span>
                  <span><strong className="text-gray-900">Transparency & Trust:</strong> Every ingredient is listed, no hidden additives.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center mr-3">✓</span>
                  <span><strong className="text-gray-900">Taste‑First Approach:</strong> Optimized for deliciousness, not just health.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center mr-3">✓</span>
                  <span><strong className="text-gray-900">Simple Preparation:</strong> Easy‑to‑follow steps for a quick blend.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center mr-3">✓</span>
                  <span><strong className="text-gray-900">Personalized Nutrition:</strong> Tailored to your unique profile and goals.</span>
                </li>
              </ul>
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
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <Heart className="w-12 h-12 text-violet-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Health First</h3>
                <p className="text-gray-600 text-sm">
                  Every recipe is designed with your health and wellness as the top priority, 
                  backed by scientific research and nutritional expertise.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <Users className="w-12 h-12 text-violet-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalization</h3>
                <p className="text-gray-600 text-sm">
                  We understand that one size doesn't fit all. Our platform adapts to your 
                  unique needs, preferences, and health goals.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <Zap className="w-12 h-12 text-violet-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">
                  We continuously push the boundaries of what's possible in personalized 
                  nutrition, using the latest technology and scientific discoveries.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <Shield className="w-12 h-12 text-violet-600 mx-auto mb-4" />
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
                  Xova was born from a simple observation: despite the growing awareness 
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
                  for our single-mix smoothie system, which combines the latest nutritional science 
                  with practical convenience.
                </p>
                
                <p className="text-gray-600 mb-6">
                  Today, Xova serves thousands of health-conscious individuals across 
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

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-violet-600">X</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Xova Team</h3>
                <p className="text-violet-600 font-medium mb-4 text-lg">Founding Team</p>
                <p className="text-gray-600 mb-6">
                  Our team combines expertise in data science, nutrition research, and technology 
                  to create personalized wellness solutions. We're passionate about making 
                  science-backed health accessible to everyone through innovative technology.
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
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What We Collect</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Health goals and dietary preferences</li>
                    <li>• Allergies and food intolerances</li>
                    <li>• Mood and wellness data</li>
                    <li>• Recipe preferences and feedback</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
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
                  <a href="/privacy" className="text-violet-600 hover:text-violet-700 font-medium">
                    Read our Privacy Policy
                  </a>
                  <a href="/terms" className="text-violet-600 hover:text-violet-700 font-medium">
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

            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  
                  <div className="text-center">
                    <button
                      type="submit"
                      className="inline-flex items-center px-8 py-4 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-colors shadow-lg"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </button>
                  </div>
                  
                  <div className="text-center text-sm text-gray-500">
                    <p>We'll respond to your message within 24 hours.</p>
                    <p className="mt-1">For urgent inquiries, please contact us directly.</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
