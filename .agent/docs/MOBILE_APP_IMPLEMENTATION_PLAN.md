# Convertify Mobile App - Implementation Plan

> **Project**: Convertify PDF Tools Mobile Application  
> **Target Platforms**: Android & iOS  
> **Tech Stack**: Capacitor + Next.js + AdMob + Google Stitch  
> **Created**: January 30, 2026  
> **Estimated Timeline**: 3 Weeks  

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Phase 0: Design with Google Stitch](#phase-0-design-with-google-stitch)
4. [Phase 1: Capacitor Foundation](#phase-1-capacitor-foundation)
5. [Phase 2: Mobile UI Implementation](#phase-2-mobile-ui-implementation)
6. [Phase 3: AdMob Integration](#phase-3-admob-integration)
7. [Phase 4: Native Features](#phase-4-native-features)
8. [Phase 5: Testing & Optimization](#phase-5-testing--optimization)
9. [Phase 6: Store Submission](#phase-6-store-submission)
10. [Cost Analysis](#cost-analysis)
11. [Risk Mitigation](#risk-mitigation)
12. [Success Metrics](#success-metrics)

---

## Executive Summary

Transform the Convertify web application into a native mobile app for Android and iOS using **Capacitor** as the bridge technology. The app will:

- ✅ Reuse 95% of existing Next.js codebase
- ✅ Support all 22 PDF tools with WebAssembly processing
- ✅ Monetize with Google AdMob ads
- ✅ Follow Material Design 3 guidelines (designed in Google Stitch)
- ✅ Work offline for core features
- ✅ Achieve <100ms interaction latency (no lag)

### Key Benefits

| Benefit | Impact |
|---------|--------|
| Single Codebase | Maintain one repo for web + mobile |
| Native Distribution | Google Play + App Store visibility |
| Offline Support | Process PDFs without internet |
| Better Monetization | AdMob typically outperforms web ads |
| Native UX | Haptics, file picker, share sheet |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CONVERTIFY MOBILE APP                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     PRESENTATION LAYER                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │   │
│  │  │   Home      │  │  Tool Pages │  │  Settings   │         │   │
│  │  │   Screen    │  │  (22 tools) │  │  Premium    │         │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘         │   │
│  │                                                              │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │           Mobile-Optimized Components                │   │   │
│  │  │  • Bottom Navigation  • Floating Action Button      │   │   │
│  │  │  • Pull-to-Refresh    • Native File Picker          │   │   │
│  │  │  • Haptic Feedback    • Gesture Navigation          │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      BUSINESS LOGIC                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │   │
│  │  │  PDF-lib    │  │  File       │  │   Ad        │         │   │
│  │  │  (WASM)     │  │  Management │  │  Manager    │         │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      CAPACITOR BRIDGE                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │   │
│  │  │ AdMob    │ │Filesystem│ │  Share   │ │ Haptics  │       │   │
│  │  │ Plugin   │ │  Plugin  │ │  Plugin  │ │  Plugin  │       │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────┐    ┌──────────────────────┐             │
│  │     ANDROID APP      │    │       iOS APP        │             │
│  │   (WebView + Native) │    │  (WKWebView + Native)│             │
│  └──────────────────────┘    └──────────────────────┘             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Tool Sync System (AUTO-SYNC)

> **✅ IMPLEMENTED**: `src/lib/tools-registry.ts`

### How It Works

Both the website AND mobile app read from a **single source of truth**:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TOOL SYNC ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                  ┌──────────────────────┐                          │
│                  │  tools-registry.ts   │ ◄── SINGLE SOURCE        │
│                  │  (Add tools here!)   │                          │
│                  └──────────┬───────────┘                          │
│                             │                                       │
│              ┌──────────────┴──────────────┐                       │
│              │                             │                        │
│              ▼                             ▼                        │
│    ┌─────────────────┐          ┌─────────────────┐                │
│    │   WEBSITE       │          │   MOBILE APP    │                │
│    │                 │          │                 │                │
│    │ • Homepage      │          │ • Home Screen   │                │
│    │ • /all-tools    │          │ • Tool Grid     │                │
│    │ • Navigation    │          │ • Search        │                │
│    │ • Sitemap       │          │ • Offline List  │                │
│    └─────────────────┘          └─────────────────┘                │
│                                                                     │
│    npm run build ───────────────────────► npx cap sync             │
│    (Website updated)                      (Mobile updated)          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Adding a New Tool (3 Steps)

**Step 1**: Add tool to `src/lib/tools-registry.ts`:

```typescript
// In the appropriate category's tools array:
{
  id: 'new-tool',
  name: 'New Tool',
  description: 'What this tool does.',
  icon: { lucide: 'FileText', material: 'description' },
  href: 'new-tool',
  color: { text: 'text-blue-600', bg: 'bg-blue-50', hex: '#2563EB' },
  status: 'active',  // or 'new', 'beta', 'coming-soon'
  keywords: ['keyword1', 'keyword2'],
  offlineSupported: true,
  premium: false,
  priority: 50,
},
```

**Step 2**: Create the tool page at `src/app/new-tool/page.tsx`

**Step 3**: Build and sync:
```bash
npm run build     # Updates website
npx cap sync      # Updates mobile app
```

**That's it!** The tool now appears everywhere automatically.

### What Gets Synced

| Component | Reads From Registry |
|-----------|---------------------|
| Homepage tool grid | ✅ Yes |
| /all-tools page | ✅ Yes |
| Mobile home screen | ✅ Yes |
| Mobile tool categories | ✅ Yes |
| Search functionality | ✅ Yes |
| Sitemap generation | ✅ Yes |
| Offline tool list | ✅ Yes |

### Registry Features

```typescript
import { 
  getAllTools,           // Get all tools sorted by priority
  getActiveTools,        // Active tools only (no coming-soon)
  getToolsByCategory,    // Filter by category
  getToolById,           // Get single tool
  getOfflineTools,       // Tools that work offline
  searchTools,           // Search by keyword
  getToolsForMobile,     // Mobile-optimized format
} from '@/lib/tools-registry';
```

### Files Created

- `src/lib/tools-registry.ts` - Central tool definitions
- `src/components/tools/tools-grid.tsx` - Reusable grid component

---

## Phase 0: Design with Google Stitch

**Duration**: 1-2 Days  
**Goal**: Generate all mobile UI mockups before coding

### Step 0.1: Access Google Stitch

1. Go to [stitch.withgoogle.com](https://stitch.withgoogle.com)
2. Sign in with Google account
3. Create new project: "Convertify Mobile"

### Step 0.2: Generate Screen Designs

Use these prompts to generate each screen:

#### Home Screen
```
A mobile PDF tools app home screen with Material Design 3, dark theme with 
blue/purple gradient accents. Features:
- App bar with "Convertify" logo and search icon
- Grid of tool tiles (4 columns) with icons: Merge, Split, Compress, Convert
- Categories: "Convert", "Edit", "Organize" 
- Bottom navigation: Home, Tools, Recent, Settings
- Floating action button for quick access
```

#### Tool Page (Merge PDF)
```
Mobile PDF merge tool screen with Material Design 3, dark theme:
- Back arrow and "Merge PDF" title in app bar
- Large drop zone with dashed border and upload icon
- "Select PDF Files" prominent button
- List of added files with thumbnails, names, reorder handles
- "Merge PDFs" primary button at bottom
- AdMob banner placeholder at very bottom
```

#### Processing Screen
```
PDF processing screen for mobile app, dark theme:
- Centered circular progress indicator (60% complete)
- "Merging your PDFs..." status text
- File names being processed
- Cancel button below
- Subtle animated background
```

#### Success Screen
```
PDF download success screen, Material Design 3:
- Large green checkmark icon with celebration animation
- "Your PDF is Ready!" heading
- File info card: name, size, pages
- Row of action buttons: Download, Share, Open
- "Process Another" secondary button
- Native ad placement below
```

#### Settings Screen
```
Mobile app settings screen, Material Design 3 dark theme:
- Sections: Appearance, Storage, Premium, About
- Dark mode toggle switch
- "Clear cache" with storage used indicator
- Premium upgrade card with gradient background
- Version info at bottom
```

#### Premium/Upgrade Screen
```
Premium subscription screen for PDF app:
- "Go Premium" hero section with crown icon
- Feature comparison: Free vs Premium table
- Pricing cards: Monthly $2.99, Annual $19.99
- "Watch Ad for 1 Free Use" alternative option
- Secure payment badges at bottom
```

### Step 0.3: Iterate and Refine

Follow-up prompts to refine designs:
- "Make the primary color more purple like #7C3AED"
- "Add Convertify branding with the logo"
- "Include an AdMob banner at the bottom of the screen"
- "Make touch targets larger for accessibility"

### Step 0.4: Export Design Specs

For each screen, note:
- Color hex codes
- Font sizes and weights
- Spacing values
- Component dimensions
- Icon names (Material Icons)

### Deliverables
- [ ] 6-8 high-fidelity screen mockups
- [ ] Color palette extracted
- [ ] Typography scale documented
- [ ] Component inventory list

---

## Phase 1: Capacitor Foundation

**Duration**: 2-3 Days  
**Goal**: Set up Capacitor and achieve first Android/iOS builds

### Step 1.1: Install Capacitor

```bash
# Navigate to project
cd d:\Convertify

# Install Capacitor core
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init "Convertify" "com.convertify.app" --web-dir=out
```

### Step 1.2: Configure Next.js for Static Export

Update `next.config.ts`:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',  // Enable static export
  images: {
    unoptimized: true,  // Required for static export
  },
  trailingSlash: true,  // Better for mobile routing
};

export default nextConfig;
```

### Step 1.3: Create Capacitor Config

Create `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.convertify.app',
  appName: 'Convertify',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0F172A',
      showSpinner: true,
      spinnerColor: '#7C3AED',
    },
  },
};

export default config;
```

### Step 1.4: Add Mobile Platforms

```bash
# Build the Next.js static export
npm run build

# Add Android platform
npx cap add android

# Add iOS platform (requires macOS)
npx cap add ios

# Sync web assets to native projects
npx cap sync
```

### Step 1.5: Configure Android Project

Edit `android/app/src/main/res/values/strings.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Convertify</string>
    <string name="title_activity_main">Convertify</string>
    <string name="package_name">com.convertify.app</string>
</resources>
```

Edit `android/app/src/main/AndroidManifest.xml` to add permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### Step 1.6: Test First Build

```bash
# Open Android project in Android Studio
npx cap open android

# Or run directly (requires Android SDK)
npx cap run android

# For iOS (requires Xcode on macOS)
npx cap open ios
```

### Deliverables
- [ ] Capacitor initialized
- [ ] Static export working
- [ ] Android APK builds successfully
- [ ] iOS app builds successfully (if on macOS)

---

## Phase 2: Mobile UI Implementation

**Duration**: 4-5 Days  
**Goal**: Create mobile-optimized components matching Stitch designs

### Step 2.1: Create Mobile Layout Component

Create `src/components/mobile/MobileLayout.tsx`:

```tsx
'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Capacitor } from '@capacitor/core';

interface MobileLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/', icon: 'home', label: 'Home' },
  { href: '/all-tools', icon: 'grid_view', label: 'Tools' },
  { href: '/recent', icon: 'history', label: 'Recent' },
  { href: '/settings', icon: 'settings', label: 'Settings' },
];

export default function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname();
  const isNative = Capacitor.isNativePlatform();
  
  if (!isNative) return <>{children}</>;
  
  return (
    <div className="mobile-layout">
      <main className="mobile-content">
        {children}
      </main>
      
      <nav className="mobile-bottom-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="material-icons">{item.icon}</span>
            <span className="label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
```

### Step 2.2: Create Mobile Styles

Create `src/styles/mobile.css`:

```css
/* Mobile-specific styles */
@media (max-width: 768px) {
  .mobile-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding-bottom: calc(60px + env(safe-area-inset-bottom));
  }
  
  .mobile-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .mobile-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: calc(60px + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    background: var(--surface-color, #1E293B);
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 1000;
  }
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 16px;
    color: var(--text-muted, #94A3B8);
    text-decoration: none;
    transition: color 0.2s;
  }
  
  .nav-item.active {
    color: var(--primary-color, #7C3AED);
  }
  
  .nav-item .label {
    font-size: 10px;
    margin-top: 4px;
  }
  
  /* Touch-friendly buttons */
  .mobile-button {
    min-height: 48px;
    min-width: 48px;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 12px;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Safe area for notched devices */
  .safe-area-top {
    padding-top: env(safe-area-inset-top);
  }
  
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

### Step 2.3: Create Tool Grid Component

Create `src/components/mobile/ToolGrid.tsx`:

```tsx
'use client';

import Link from 'next/link';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

interface Tool {
  id: string;
  name: string;
  icon: string;
  href: string;
  color: string;
}

const tools: Tool[] = [
  { id: 'merge', name: 'Merge PDF', icon: 'merge_type', href: '/merge-pdf', color: '#4F46E5' },
  { id: 'split', name: 'Split PDF', icon: 'call_split', href: '/split-pdf', color: '#7C3AED' },
  { id: 'compress', name: 'Compress', icon: 'compress', href: '/compress-pdf', color: '#EC4899' },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', icon: 'image', href: '/pdf-to-jpg', color: '#F59E0B' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', icon: 'picture_as_pdf', href: '/jpg-to-pdf', color: '#10B981' },
  { id: 'pdf-to-word', name: 'PDF to Word', icon: 'description', href: '/pdf-to-word', color: '#3B82F6' },
  // ... add all 22 tools
];

export default function ToolGrid() {
  const handleToolPress = async () => {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  };
  
  return (
    <div className="tool-grid">
      {tools.map((tool) => (
        <Link
          key={tool.id}
          href={tool.href}
          className="tool-card"
          onClick={handleToolPress}
          style={{ '--tool-color': tool.color } as React.CSSProperties}
        >
          <div className="tool-icon">
            <span className="material-icons">{tool.icon}</span>
          </div>
          <span className="tool-name">{tool.name}</span>
        </Link>
      ))}
    </div>
  );
}
```

### Step 2.4: Create Mobile File Picker

Create `src/components/mobile/FilePicker.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { FilePicker as NativeFilePicker } from '@capawesome/capacitor-file-picker';

interface FilePickerProps {
  accept: string[];
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
}

export default function FilePicker({ accept, multiple = true, onFilesSelected }: FilePickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleNativePick = async () => {
    if (Capacitor.isNativePlatform()) {
      const result = await NativeFilePicker.pickFiles({
        types: accept,
        multiple,
      });
      
      // Convert to File objects
      const files = await Promise.all(
        result.files.map(async (f) => {
          const response = await fetch(f.path!);
          const blob = await response.blob();
          return new File([blob], f.name, { type: f.mimeType });
        })
      );
      
      onFilesSelected(files);
    }
  };
  
  const handleWebPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files));
    }
  };
  
  return (
    <div 
      className={`file-picker ${isDragging ? 'dragging' : ''}`}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
    >
      <div className="picker-content">
        <span className="material-icons">upload_file</span>
        <p>Drop PDF files here or</p>
        
        {Capacitor.isNativePlatform() ? (
          <button onClick={handleNativePick} className="pick-button">
            Select Files
          </button>
        ) : (
          <label className="pick-button">
            Select Files
            <input
              type="file"
              accept={accept.join(',')}
              multiple={multiple}
              onChange={handleWebPick}
              hidden
            />
          </label>
        )}
      </div>
    </div>
  );
}
```

### Step 2.5: Implement Pull-to-Refresh

Create `src/hooks/usePullToRefresh.ts`:

```typescript
'use client';

import { useEffect, useRef } from 'react';

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const startY = useRef(0);
  const isPulling = useRef(false);
  
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].pageY;
        isPulling.current = true;
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current) return;
      
      const pullDistance = e.touches[0].pageY - startY.current;
      if (pullDistance > 80) {
        // Show pull indicator
        document.body.classList.add('pulling');
      }
    };
    
    const handleTouchEnd = async () => {
      if (document.body.classList.contains('pulling')) {
        document.body.classList.remove('pulling');
        document.body.classList.add('refreshing');
        await onRefresh();
        document.body.classList.remove('refreshing');
      }
      isPulling.current = false;
    };
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh]);
}
```

### Deliverables
- [ ] Mobile layout with bottom navigation
- [ ] Tool grid matching Stitch design
- [ ] Native file picker integration
- [ ] Pull-to-refresh implemented
- [ ] Haptic feedback on interactions
- [ ] Safe area insets handled

---

## Phase 3: AdMob Integration

**Duration**: 2-3 Days  
**Goal**: Implement banner, interstitial, and rewarded ads

### Step 3.1: Install AdMob Plugin

```bash
npm install @capacitor-community/admob
npx cap sync
```

### Step 3.2: Configure AdMob

Update `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.convertify.app',
  appName: 'Convertify',
  webDir: 'out',
  plugins: {
    AdMob: {
      // Replace with your actual AdMob app IDs after registration
      androidAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
      iosAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
      // Use test ads during development
      initializeForTesting: true,
    },
  },
};

export default config;
```

### Step 3.3: Create Ad Manager

Create `src/lib/admob.ts`:

```typescript
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  AdMobBannerSize,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
  AdOptions,
  RewardAdOptions,
  AdLoadInfo,
  AdMobRewardItem,
} from '@capacitor-community/admob';

// Test ad IDs - replace with production IDs before release
const AD_IDS = {
  banner: {
    android: 'ca-app-pub-3940256099942544/6300978111', // Test ID
    ios: 'ca-app-pub-3940256099942544/2934735716', // Test ID
  },
  interstitial: {
    android: 'ca-app-pub-3940256099942544/1033173712', // Test ID
    ios: 'ca-app-pub-3940256099942544/4411468910', // Test ID
  },
  rewarded: {
    android: 'ca-app-pub-3940256099942544/5224354917', // Test ID
    ios: 'ca-app-pub-3940256099942544/1712485313', // Test ID
  },
};

class AdManager {
  private initialized = false;
  private operationCount = 0;
  private readonly INTERSTITIAL_FREQUENCY = 3; // Show every 3 operations
  
  async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform() || this.initialized) return;
    
    await AdMob.initialize({
      initializeForTesting: process.env.NODE_ENV === 'development',
    });
    
    this.initialized = true;
    console.log('AdMob initialized');
  }
  
  async showBanner(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    
    const platform = Capacitor.getPlatform();
    const adId = platform === 'android' ? AD_IDS.banner.android : AD_IDS.banner.ios;
    
    const options: BannerAdOptions = {
      adId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    };
    
    await AdMob.showBanner(options);
  }
  
  async hideBanner(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    await AdMob.hideBanner();
  }
  
  async prepareInterstitial(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    
    const platform = Capacitor.getPlatform();
    const adId = platform === 'android' 
      ? AD_IDS.interstitial.android 
      : AD_IDS.interstitial.ios;
    
    await AdMob.prepareInterstitial({ adId });
  }
  
  async showInterstitialIfDue(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    
    this.operationCount++;
    
    if (this.operationCount >= this.INTERSTITIAL_FREQUENCY) {
      this.operationCount = 0;
      await AdMob.showInterstitial();
      // Prepare next one
      this.prepareInterstitial();
      return true;
    }
    
    return false;
  }
  
  async showRewardedAd(): Promise<AdMobRewardItem | null> {
    if (!Capacitor.isNativePlatform()) return null;
    
    const platform = Capacitor.getPlatform();
    const adId = platform === 'android' 
      ? AD_IDS.rewarded.android 
      : AD_IDS.rewarded.ios;
    
    await AdMob.prepareRewardedAd({ adId });
    const result = await AdMob.showRewardedAd();
    
    return result.reward || null;
  }
}

export const adManager = new AdManager();
```

### Step 3.4: Create Banner Component

Create `src/components/mobile/AdBanner.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { adManager } from '@/lib/admob';

interface AdBannerProps {
  // Reserve space for banner even when not showing
  reserveSpace?: boolean;
}

export default function AdBanner({ reserveSpace = true }: AdBannerProps) {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      adManager.showBanner();
      
      return () => {
        adManager.hideBanner();
      };
    }
  }, []);
  
  // On web, show placeholder or nothing
  if (!Capacitor.isNativePlatform()) {
    if (!reserveSpace) return null;
    
    return (
      <div className="ad-banner-placeholder">
        {/* Web ad component can go here */}
      </div>
    );
  }
  
  // Native banner is rendered by AdMob, just reserve space
  return reserveSpace ? <div className="ad-banner-space" style={{ height: 60 }} /> : null;
}
```

### Step 3.5: Integrate Ads in Tool Flow

Create `src/hooks/useToolWithAds.ts`:

```typescript
'use client';

import { useState, useCallback } from 'react';
import { adManager } from '@/lib/admob';

interface UseToolWithAdsOptions {
  onProcess: () => Promise<void>;
  onSuccess?: () => void;
}

export function useToolWithAds({ onProcess, onSuccess }: UseToolWithAdsOptions) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessAd, setShowSuccessAd] = useState(false);
  
  const processWithAds = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      await onProcess();
      
      // Show interstitial after processing (if due)
      const adShown = await adManager.showInterstitialIfDue();
      
      if (!adShown) {
        // If no interstitial, proceed to success immediately
        onSuccess?.();
      } else {
        // Wait a moment after ad, then show success
        setTimeout(() => onSuccess?.(), 500);
      }
    } catch (error) {
      console.error('Processing failed:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [onProcess, onSuccess]);
  
  return {
    isProcessing,
    processWithAds,
  };
}
```

### Step 3.6: AdMob Policy Compliance

Create `src/components/mobile/AdDisclosure.tsx`:

```tsx
export default function AdDisclosure() {
  return (
    <div className="ad-disclosure">
      <p>This app contains ads to support free PDF tools.</p>
      <p>
        <a href="/privacy-policy">Privacy Policy</a> | 
        <a href="/terms">Terms of Use</a>
      </p>
    </div>
  );
}
```

### Ad Placement Strategy

| Screen | Ad Type | Placement | Frequency |
|--------|---------|-----------|-----------|
| Home | Banner | Bottom (persistent) | Always |
| Tool Page | Banner | Bottom | Always |
| Processing | None | - | - |
| Success | Interstitial | After result | Every 3rd use |
| Premium | Rewarded | "Watch to unlock" | User-initiated |

### Deliverables
- [ ] AdMob plugin installed and configured
- [ ] Banner ads on main screens
- [ ] Interstitial ads after tool completion
- [ ] Rewarded ads for premium features
- [ ] Ad frequency limiting (avoid spam)
- [ ] Privacy policy updated

---

## Phase 4: Native Features

**Duration**: 2-3 Days  
**Goal**: Add native capabilities that improve UX

### Step 4.1: Install Native Plugins

```bash
# File system access
npm install @capacitor/filesystem

# Share functionality
npm install @capacitor/share

# Haptic feedback
npm install @capacitor/haptics

# Status bar customization
npm install @capacitor/status-bar

# Splash screen
npm install @capacitor/splash-screen

# Local notifications (optional)
npm install @capacitor/local-notifications

# Sync all plugins
npx cap sync
```

### Step 4.2: File System Integration

Create `src/lib/filesystem.ts`:

```typescript
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export async function saveFile(
  data: ArrayBuffer | Blob,
  filename: string
): Promise<string> {
  if (!Capacitor.isNativePlatform()) {
    // Fallback to browser download
    const blob = data instanceof Blob ? data : new Blob([data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return url;
  }
  
  // Convert to base64 for native filesystem
  const base64 = await blobToBase64(data);
  
  const result = await Filesystem.writeFile({
    path: `Convertify/${filename}`,
    data: base64,
    directory: Directory.Documents,
    recursive: true,
  });
  
  return result.uri;
}

async function blobToBase64(data: ArrayBuffer | Blob): Promise<string> {
  const blob = data instanceof Blob ? data : new Blob([data]);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function listSavedFiles(): Promise<string[]> {
  if (!Capacitor.isNativePlatform()) return [];
  
  try {
    const result = await Filesystem.readdir({
      path: 'Convertify',
      directory: Directory.Documents,
    });
    return result.files.map(f => f.name);
  } catch {
    return [];
  }
}
```

### Step 4.3: Share Integration

Create `src/lib/share.ts`:

```typescript
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

export async function shareFile(
  filePath: string,
  title: string
): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    // Use Web Share API if available
    if (navigator.share) {
      await navigator.share({
        title,
        url: filePath,
      });
      return true;
    }
    return false;
  }
  
  const result = await Share.share({
    title,
    url: filePath,
    dialogTitle: 'Share your PDF',
  });
  
  return result.activityType !== undefined;
}
```

### Step 4.4: Status Bar Customization

Create `src/lib/statusbar.ts`:

```typescript
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

export async function configureStatusBar(isDarkMode: boolean): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  
  await StatusBar.setStyle({
    style: isDarkMode ? Style.Dark : Style.Light,
  });
  
  if (Capacitor.getPlatform() === 'android') {
    await StatusBar.setBackgroundColor({
      color: isDarkMode ? '#0F172A' : '#FFFFFF',
    });
  }
}
```

### Step 4.5: Haptic Feedback Utility

Create `src/lib/haptics.ts`:

```typescript
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export async function hapticLight(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await Haptics.impact({ style: ImpactStyle.Light });
}

export async function hapticMedium(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await Haptics.impact({ style: ImpactStyle.Medium });
}

export async function hapticSuccess(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await Haptics.notification({ type: NotificationType.Success });
}

export async function hapticError(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await Haptics.notification({ type: NotificationType.Error });
}
```

### Deliverables
- [ ] Native file saving to device
- [ ] Share sheet integration
- [ ] Haptic feedback on all interactions
- [ ] Status bar theming
- [ ] Splash screen configured

---

## Phase 5: Testing & Optimization

**Duration**: 3-4 Days  
**Goal**: Ensure app is performant and bug-free

### Step 5.1: Performance Optimization

```typescript
// Preload WASM on app start
// src/app/layout.tsx

'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export default function RootLayout({ children }) {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Preload PDF-lib WASM during splash screen
      import('pdf-lib').then(() => {
        console.log('PDF-lib preloaded');
      });
    }
  }, []);
  
  return <html>{children}</html>;
}
```

### Step 5.2: Memory Management

```typescript
// Clear processed files from memory
// src/hooks/usePdfProcessor.ts

export function usePdfProcessor() {
  const processedPdfs = useRef<Map<string, Uint8Array>>(new Map());
  
  const clearMemory = useCallback(() => {
    processedPdfs.current.clear();
    // Force garbage collection hint
    if (window.gc) window.gc();
  }, []);
  
  // Auto-clear after download
  const downloadAndClear = useCallback(async (id: string) => {
    const pdf = processedPdfs.current.get(id);
    if (pdf) {
      await saveFile(pdf, `processed-${id}.pdf`);
      processedPdfs.current.delete(id);
    }
  }, []);
  
  return { clearMemory, downloadAndClear };
}
```

### Step 5.3: Error Boundary

Create `src/components/mobile/ErrorBoundary.tsx`:

```tsx
'use client';

import { Component, ReactNode } from 'react';
import { hapticError } from '@/lib/haptics';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error) {
    hapticError();
    console.error('App error:', error);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen">
          <span className="material-icons">error</span>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Restart App
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### Step 5.4: Testing Checklist

#### Android Testing
- [ ] Test on Android 10, 11, 12, 13, 14
- [ ] Test on low-end device (2GB RAM)
- [ ] Test on high-end device (flagship)
- [ ] Test landscape orientation
- [ ] Test with large PDFs (50+ MB)
- [ ] Test offline functionality
- [ ] Test ad loading/display
- [ ] Test file saving/sharing

#### iOS Testing
- [ ] Test on iOS 14, 15, 16, 17
- [ ] Test on iPhone SE (small screen)
- [ ] Test on iPhone Pro Max (large screen)
- [ ] Test on iPad (if supporting)
- [ ] Test with notch/Dynamic Island
- [ ] Test Face ID areas

### Step 5.5: Performance Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| App Launch | <2s | Stopwatch from tap to usable |
| Tool Load | <500ms | Time to interactive |
| PDF Merge (5 files) | <3s | Console timing |
| Memory Usage | <150MB | Android Profiler |
| Battery Drain | <5%/hr active | Device settings |
| Crash Rate | <0.1% | Firebase Crashlytics |

### Deliverables
- [ ] Performance benchmarks met
- [ ] Memory leaks fixed
- [ ] Error handling complete
- [ ] Testing on 5+ devices
- [ ] Crash reporting integrated

---

## Phase 6: Store Submission

**Duration**: 2-3 Days  
**Goal**: Publish to Google Play and App Store

### Step 6.1: Prepare Store Assets

#### App Icon
- Android: 512x512 PNG (Play Store), plus adaptive icons
- iOS: 1024x1024 PNG (no alpha), plus all required sizes

#### Screenshots (Required)
- Phone: At least 2 screenshots (1080x1920 or 1242x2688)
- Tablet: Optional but recommended
- Showcase key features: Home, Tool in action, Success

#### Feature Graphic (Android)
- 1024x500 PNG for Play Store header

### Step 6.2: App Store Metadata

```yaml
# App Store / Play Store Listing

Title: Convertify - Free PDF Tools

Short Description (80 chars):
Free PDF merge, split, compress & convert tools. Works offline!

Full Description:
Convertify is your all-in-one PDF toolkit that works completely offline. 
No file uploads, no servers - your documents never leave your device.

🔧 22 FREE PDF TOOLS:
• Merge PDF - Combine multiple PDFs into one
• Split PDF - Extract pages from PDF
• Compress PDF - Reduce file size up to 90%
• PDF to Word - Convert to editable DOCX
• Word to PDF - Create PDFs from Word docs
• PDF to JPG - Export pages as images
• JPG to PDF - Create PDFs from photos
• Rotate PDF - Fix page orientation
• And 14 more tools!

🔒 100% PRIVATE:
All processing happens on your device. We never see your files.

⚡ FAST & EFFICIENT:
Process PDFs in seconds with our optimized engine.

📱 WORKS OFFLINE:
No internet required after installation.

Keywords: PDF, merge, split, compress, convert, free, offline, private

Category: Productivity

Content Rating: Everyone
```

### Step 6.3: Privacy Policy

Required for both stores. Key points:
- No data collection (processing is local)
- Ads served by AdMob (link to Google's privacy policy)
- Analytics via Google Analytics (anonymized)
- No account required

### Step 6.4: Google Play Submission

1. **Create Developer Account**
   - Go to [Google Play Console](https://play.google.com/console)
   - Pay one-time $25 fee
   - Complete identity verification

2. **Create App**
   - New app > Convertify
   - Select "App" (not game)
   - Free with ads

3. **Production Release**
   - Build AAB (Android App Bundle)
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   - Upload to Production track
   - Complete all policy declarations

4. **Review Time**: 1-3 days typically

### Step 6.5: App Store Submission (iOS)

1. **Apple Developer Account**
   - Enroll at [developer.apple.com](https://developer.apple.com)
   - $99/year fee
   - Requires Apple device for verification

2. **Configure in Xcode**
   - Open `ios/App/App.xcworkspace`
   - Set signing team
   - Update bundle identifier

3. **Archive and Upload**
   - Product > Archive
   - Distribute App > App Store Connect
   - Upload

4. **App Store Connect**
   - Add screenshots, description
   - Set pricing (Free)
   - Submit for review

5. **Review Time**: 1-7 days typically

### Step 6.6: Post-Launch

- [ ] Monitor crash reports
- [ ] Respond to reviews
- [ ] Track revenue from AdMob
- [ ] Plan Version 1.1 features
- [ ] A/B test ad placements

### Deliverables
- [ ] All store assets prepared
- [ ] Privacy policy published
- [ ] Google Play listing live
- [ ] App Store listing live
- [ ] Analytics configured

---

## Cost Analysis

### One-Time Costs

| Item | Cost |
|------|------|
| Google Play Developer | $25 |
| **Total One-Time** | **$25** |

### Annual Costs

| Item | Cost |
|------|------|
| Apple Developer Program | $99/year |
| **Total Annual** | **$99/year** |

### Optional Costs

| Item | Cost | Notes |
|------|------|-------|
| Firebase (Crashlytics) | Free | Up to 500 issues/month |
| Better Android devices | $200-500 | For testing |
| Code signing certificate | Free | Included in dev accounts |

### Revenue Projection

| Month | Downloads | MAU | Ad Revenue |
|-------|-----------|-----|------------|
| 1 | 500 | 300 | $30-50 |
| 3 | 3,000 | 1,500 | $150-300 |
| 6 | 10,000 | 5,000 | $500-1,000 |
| 12 | 30,000 | 15,000 | $1,500-3,000 |

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| AdMob policy violation | Account suspension | Follow all policies, test thoroughly |
| WebView performance issues | Poor reviews | Pre-load assets, optimize bundle |
| iOS rejection | Delayed launch | Review guidelines before submitting |
| Memory crashes on low-end | Bad UX | Limit file sizes, clear memory |
| WASM not supported | App unusable | Detect capability, show fallback |

---

## Success Metrics

### Phase 1 (Launch)
- [ ] 100 downloads in first week
- [ ] 4.0+ star rating
- [ ] <2% crash rate
- [ ] $50+ ad revenue

### Phase 2 (Growth - Month 3)
- [ ] 5,000 total downloads
- [ ] 1,000+ monthly active users
- [ ] 4.3+ star rating
- [ ] $200+ monthly ad revenue

### Phase 3 (Scale - Month 6)
- [ ] 20,000+ total downloads
- [ ] 5,000+ monthly active users
- [ ] Featured in "Tools" category
- [ ] $1,000+ monthly ad revenue

---

## Appendix

### A. Useful Commands

```bash
# Build for development
npm run build && npx cap sync

# Open Android Studio
npx cap open android

# Open Xcode
npx cap open ios

# Run on connected device
npx cap run android
npx cap run ios

# Live reload during development
ionic cap run android -l --external
```

### B. Key Files Structure

```
Convertify/
├── capacitor.config.ts      # Capacitor configuration
├── android/                 # Android native project
│   └── app/
│       ├── build.gradle
│       └── src/main/
│           ├── AndroidManifest.xml
│           └── res/
├── ios/                     # iOS native project
│   └── App/
│       ├── Info.plist
│       └── Assets.xcassets/
├── src/
│   ├── components/mobile/   # Mobile-specific components
│   ├── lib/
│   │   ├── admob.ts        # Ad management
│   │   ├── filesystem.ts   # File operations
│   │   └── haptics.ts      # Haptic feedback
│   └── styles/mobile.css   # Mobile styles
└── out/                     # Built static files
```

### C. Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [AdMob Plugin Docs](https://github.com/capacitor-community/admob)
- [Google Stitch](https://stitch.withgoogle.com)
- [Material Design 3](https://m3.material.io)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/app-store-connect)

---

*Document Version: 1.0*  
*Last Updated: January 30, 2026*  
*Author: AI Assistant (Antigravity)*
