'use client';

import { useState, useEffect } from 'react';
import WebHomePage from '@/components/home/WebHomePage';
import { MobileHomePage } from '@/components/mobile';

export default function Home() {
  const [isNative, setIsNative] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if running on native mobile app
    const checkPlatform = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        setIsNative(Capacitor.isNativePlatform());
      } catch (e) {
        // Fallback to web
        setIsNative(false);
      } finally {
        setLoading(false);
      }
    };

    checkPlatform();
  }, []);

  if (loading) {
    // Show nothing or a skeleton while checking platform
    // This avoids hydration mismatch flash
    return <div className="min-h-screen bg-slate-50" />;
  }

  // Mobile App View (Stitch Design)
  if (isNative) {
    return <MobileHomePage />;
  }

  // Web Website View
  return <WebHomePage />;
}
