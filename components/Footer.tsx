'use client';

import Link from 'next/link';
import { Zap, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="relative w-8 h-8">
                {/* Molecular X Symbol */}
                <svg width="32" height="32" viewBox="0 0 32 32" className="absolute inset-0">
                  <defs>
                    <radialGradient id="footerAtom1" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="70%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#0d9488" />
                    </radialGradient>
                    <radialGradient id="footerAtom2" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="70%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </radialGradient>
                  </defs>
                  
                  {/* Molecular bonds forming X */}
                  <line x1="8" y1="8" x2="24" y2="24" stroke="#14b8a6" strokeWidth="2" opacity="0.8"/>
                  <line x1="24" y1="8" x2="8" y2="24" stroke="#22c55e" strokeWidth="2" opacity="0.8"/>
                  
                  {/* Corner atoms */}
                  <circle cx="8" cy="8" r="4" fill="url(#footerAtom1)"/>
                  <circle cx="24" cy="8" r="4" fill="url(#footerAtom2)"/>
                  <circle cx="8" cy="24" r="4" fill="url(#footerAtom2)"/>
                  <circle cx="24" cy="24" r="4" fill="url(#footerAtom1)"/>
                  
                  {/* Central atom */}
                  <circle cx="16" cy="16" r="5" fill="url(#footerAtom1)"/>
                </svg>
              </div>
              <span className="text-xl font-bold">Xova</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Personalized longevity smoothies, scientifically optimized for your health goals. 
              Available through local shops or subscription delivery.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>hello@xova.ch</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>Switzerland</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+41 44 123 45 67</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shoppers" className="text-gray-300 hover:text-teal-400 transition-colors">
                  For Shoppers
                </Link>
              </li>
              <li>
                <Link href="/cafes" className="text-gray-300 hover:text-teal-400 transition-colors">
                  For Cafés
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-teal-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/allergens" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Allergen Information
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-4">
              Get the latest smoothie recipes and health tips delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button className="btn-primary">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 Xova. All rights reserved.</p>
          <p className="mt-2 text-sm">
            This app is for informational purposes only and is not intended as medical advice. 
            Please consult with a healthcare professional before making dietary changes.
          </p>
        </div>
      </div>
    </footer>
  );
}
