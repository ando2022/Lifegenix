'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, Star, TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CafesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-teal-600 to-mint-500 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              For Cafés & Juice Bars
            </h1>
            <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
              Join our partner network and increase your smoothie sales by up to 40% with 
              personalized, science-backed recipes that customers love.
            </p>
            <Link href="#partner-form" className="bg-white text-teal-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg inline-flex items-center">
              Become a Partner
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Partner with Xova?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Boost your business with personalized smoothie offerings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card text-center">
                <TrendingUp className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">40% Sales Increase</h3>
                <p className="text-gray-600 text-sm">
                  Partner cafés see an average 40% increase in smoothie sales within the first 3 months.
                </p>
              </div>

              <div className="card text-center">
                <DollarSign className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Higher Ticket Size</h3>
                <p className="text-gray-600 text-sm">
                  Personalized smoothies command premium pricing, increasing your average order value.
                </p>
              </div>

              <div className="card text-center">
                <Users className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">New Customer Acquisition</h3>
                <p className="text-gray-600 text-sm">
                  Attract health-conscious customers who specifically seek personalized nutrition options.
                </p>
              </div>

              <div className="card text-center">
                <Star className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Brand Image</h3>
                <p className="text-gray-600 text-sm">
                  Position your café as a cutting-edge, health-focused establishment with science-backed offerings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How the Partnership Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Simple integration with maximum impact
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-teal-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Setup</h3>
                <p className="text-gray-600">
                  Receive your Essentials Booster Kit and complete our 10-minute training. 
                  You'll be ready to serve personalized smoothies in under an hour.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-teal-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Receive Orders</h3>
                <p className="text-gray-600">
                  Customers send you personalized recipe specifications through our platform. 
                  You receive clear instructions and prep timers for each order.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-teal-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Prepare & Serve</h3>
                <p className="text-gray-600">
                  Follow our standardized preparation methods to create beautiful, 
                  layered smoothies that exceed customer expectations every time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Essentials Kit */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Essentials Booster Kit
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to create professional layered smoothies
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Included in Your Kit</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">Premium chia seeds (500g)</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">Organic flax seeds (500g)</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">Raw cacao powder (250g)</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">Ginger powder (100g)</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">Vanilla extract (50ml)</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">Coconut cream (400ml)</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">Aquafaba preparation guide</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Training Materials</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">10-minute video training</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">Layering technique guide</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">Foam preparation methods</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">Quality control checklist</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">Customer service scripts</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">Marketing materials</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">Ongoing support access</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commission Model */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Simple Commission Model
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Fair pricing that benefits both you and your customers
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-3xl font-bold text-teal-600 mb-2">8-12%</div>
                      <div className="text-lg font-semibold text-gray-900 mb-2">Platform Fee</div>
                      <p className="text-gray-600 text-sm">
                        Small commission on orders placed through Xova platform
                      </p>
                    </div>

                    <div>
                      <div className="text-3xl font-bold text-teal-600 mb-2">CHF 200</div>
                      <div className="text-lg font-semibold text-gray-900 mb-2">Setup Fee</div>
                      <p className="text-gray-600 text-sm">
                        One-time onboarding fee includes Essentials Kit and training
                      </p>
                    </div>

                    <div>
                      <div className="text-3xl font-bold text-teal-600 mb-2">25%+</div>
                      <div className="text-lg font-semibold text-gray-900 mb-2">Higher Margins</div>
                      <p className="text-gray-600 text-sm">
                        Premium pricing on personalized smoothies increases your profit margins
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Revenue Calculation</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Average order value:</span>
                            <span className="font-medium">CHF 12.50</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Orders per day:</span>
                            <span className="font-medium">15</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Daily revenue:</span>
                            <span className="font-medium">CHF 187.50</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Platform fee (10%):</span>
                            <span className="font-medium">CHF 18.75</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Your revenue:</span>
                            <span className="font-medium">CHF 168.75</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly revenue:</span>
                            <span className="font-bold text-teal-600">CHF 5,062.50</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Partner Success Stories
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Real results from our partner cafés
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
                  "Xova has transformed our smoothie business. We've seen a 45% increase in sales 
                  and our customers love the personalized approach. The training was excellent."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-teal-600 font-semibold">A</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Anna K.</div>
                    <div className="text-sm text-gray-600">Owner, Vitality Bar Lausanne</div>
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
                  "The Essentials Kit made it so easy to get started. Our staff learned the techniques 
                  quickly and customers are amazed by the beautiful layered smoothies."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-teal-600 font-semibold">M</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Marco S.</div>
                    <div className="text-sm text-gray-600">Manager, GreenBar Zurich</div>
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
                  "We've attracted a whole new customer base of health-conscious individuals. 
                  The commission model is fair and the support team is fantastic."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-teal-600 font-semibold">S</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sophie L.</div>
                    <div className="text-sm text-gray-600">Owner, Healthy Café Geneva</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Application Form */}
        <section id="partner-form" className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Become a Partner
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join our network and start serving personalized smoothies today
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Café Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Your café name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="+41 XX XXX XX XX"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Street address, city, postal code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website/Menu URL
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="https://your-cafe.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Smoothie Sales (per day)
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option value="">Select range</option>
                      <option value="0-5">0-5 smoothies</option>
                      <option value="6-15">6-15 smoothies</option>
                      <option value="16-30">16-30 smoothies</option>
                      <option value="30+">30+ smoothies</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your café
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Describe your café, target customers, and why you're interested in partnering with Xova..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                    I agree to the <Link href="/terms" className="text-teal-600 hover:underline">Terms of Service</Link> and 
                    <Link href="/privacy" className="text-teal-600 hover:underline ml-1">Privacy Policy</Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary text-lg py-3"
                >
                  Submit Partnership Application
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-teal-600 to-mint-500">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to boost your smoothie sales?
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Join the future of personalized nutrition and grow your business with Xova
            </p>
            <Link href="#partner-form" className="bg-white text-teal-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg inline-flex items-center">
              Apply Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
