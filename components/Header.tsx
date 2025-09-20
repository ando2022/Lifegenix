'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Zap, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'For Shoppers', href: '/shoppers' },
    { name: 'For Cafés', href: '/cafes' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-8 h-8">
              {/* Molecular X Symbol */}
              <svg width="32" height="32" viewBox="0 0 32 32" className="absolute inset-0">
                <defs>
                  <radialGradient id="headerAtom1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="70%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </radialGradient>
                  <radialGradient id="headerAtom2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="70%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </radialGradient>
                </defs>
                
                {/* Molecular bonds forming X */}
                <line x1="8" y1="8" x2="24" y2="24" stroke="#14b8a6" strokeWidth="2" opacity="0.8"/>
                <line x1="24" y1="8" x2="8" y2="24" stroke="#22c55e" strokeWidth="2" opacity="0.8"/>
                
                {/* Corner atoms */}
                <circle cx="8" cy="8" r="4" fill="url(#headerAtom1)"/>
                <circle cx="24" cy="8" r="4" fill="url(#headerAtom2)"/>
                <circle cx="8" cy="24" r="4" fill="url(#headerAtom2)"/>
                <circle cx="24" cy="24" r="4" fill="url(#headerAtom1)"/>
                
                {/* Central atom */}
                <circle cx="16" cy="16" r="5" fill="url(#headerAtom1)"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-gradient">Xova</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-teal-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
            <Link href="/generate">
              <Button size="sm">
                Generate Smoothie
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-teal-600 hover:bg-gray-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-600 hover:text-teal-600 hover:bg-gray-50 rounded-md font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Link
                  href="/generate"
                  className="block w-full text-center btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Generate Smoothie
                </Link>
                <Link
                  href="/cafes"
                  className="block w-full text-center btn-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Shop
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
