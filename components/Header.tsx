'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="bg-white/70 backdrop-blur border-b border-violet-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
                  {/* Logo - simplified wordmark */}
                  <Link href="/" className="flex items-center">
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                      Xova
                    </span>
                  </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-violet-700 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link href="/dashboard">
                <span className="inline-flex items-center rounded-md ring-1 ring-violet-600 text-violet-700 bg-white hover:bg-violet-50 text-sm font-medium h-9 px-3">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </span>
              </Link>
            ) : (
              <Link href="/auth/signin">
                <span className="inline-flex items-center rounded-md ring-1 ring-violet-600 text-violet-700 bg-white hover:bg-violet-50 text-sm font-medium h-9 px-3">
                  Log In
                </span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-violet-700 hover:bg-violet-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-violet-100">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-600 hover:text-violet-700 hover:bg-violet-50 rounded-md font-medium"
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
