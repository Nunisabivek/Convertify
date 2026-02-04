'use client';

import { useState, useEffect } from 'react';
import WebHomePage from '@/components/home/WebHomePage';
import { MobileHomePage } from '@/components/mobile';

export default function Home() {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    // Check if running on native mobile app
    const checkPlatform = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (Capacitor.isNativePlatform()) {
          setIsNative(true);
        }
      } catch (e) {
        // Fallback to web
        setIsNative(false);
      }
    };

    checkPlatform();
  }, []);

  // Mobile App View (Stitch Design)
  if (isNative) {
    return <MobileHomePage />;
  }

  // Web Website View - Default for SSR and non-native clients
  return <WebHomePage />;
}
