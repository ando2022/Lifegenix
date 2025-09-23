'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {/* Copyright */}
        <div className="mt-3 pt-3 border-t border-gray-800 text-center text-gray-400">
          <p className="text-sm">&copy; {new Date().getFullYear()} Xova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
