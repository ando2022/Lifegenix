'use client';

import { useEffect } from 'react';
import { initGA } from '@/lib/analytics';

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize Google Analytics
    initGA();
  }, []);

  return <>{children}</>;
}
