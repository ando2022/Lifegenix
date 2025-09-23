'use client';

import { Clock, Star, Zap, Shield, Brain, Heart } from 'lucide-react';

export default function SophisticatedExample() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            See What You'll Get
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Here's an example of a sophisticated smoothie recipe generated for someone focused on longevity and cognitive health.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Recipe Card */}
          <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Longevity Focus</h3>
                <p className="text-violet-600 font-medium">For: Cognitive Health & Energy</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-yellow-500 mb-1">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="ml-1 font-semibold">8.5/10</span>
                </div>
                <p className="text-sm text-gray-600">Longevity Score</p>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Key Ingredients:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                  <span>Frozen blueberries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                  <span>Frozen banana</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                  <span>Blue spirulina powder</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                  <span>Coconut yogurt</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                  <span>Chia seeds</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                  <span>Raw honey</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-violet-50 rounded-lg">
                <p className="text-xs text-violet-700">
                  <strong>Sign up for exact measurements, costs, and detailed instructions</strong>
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-violet-600" />
                <span className="text-sm text-gray-700">Cognitive Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-violet-600" />
                <span className="text-sm text-gray-700">Heart Health</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-violet-600" />
                <span className="text-sm text-gray-700">Antioxidants</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-violet-600" />
                <span className="text-sm text-gray-700">Sustained Energy</span>
              </div>
            </div>

            <div className="flex items-center justify-center text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>8 min prep</span>
              </div>
            </div>
          </div>

          {/* Why This Works */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why This Recipe Works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Evidence-Based Ingredients</h4>
                    <p className="text-gray-600 text-sm">Every ingredient backed by peer-reviewed research for longevity benefits.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Exact Measurements</h4>
                    <p className="text-gray-600 text-sm">Precise weights ensure optimal nutrient ratios and consistent results.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Michelin-Star Tweaks</h4>
                    <p className="text-gray-600 text-sm">Professional techniques for texture, taste, and nutritional optimization.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Cost Transparency</h4>
                    <p className="text-gray-600 text-sm">Know exactly what you're spending per smoothie and per health benefit.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 italic">
                "This isn't just a smoothie—it's a precision-engineered nutrition system designed for your specific health goals and lifestyle."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
