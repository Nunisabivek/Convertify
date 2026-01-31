# Convertify Mobile App - Quick Reference Checklist

## 📅 3-Week Timeline Overview

### Week 1: Design + Foundation
- [ ] **Day 1-2**: Design screens in Google Stitch
- [ ] **Day 3-4**: Capacitor setup + first Android build
- [ ] **Day 5**: iOS build + testing

### Week 2: Features + Monetization
- [ ] **Day 1-2**: Mobile UI components (matching Stitch designs)
- [ ] **Day 3-4**: AdMob integration (banner + interstitial)
- [ ] **Day 5**: Native features (file picker, share, haptics)

### Week 3: Polish + Launch
- [ ] **Day 1-2**: Performance optimization + bug fixes
- [ ] **Day 3**: Store assets (icons, screenshots, descriptions)
- [ ] **Day 4**: Google Play submission
- [ ] **Day 5**: App Store submission (if on macOS)

---

## 🎨 Stitch Design Prompts

Copy-paste these into [stitch.withgoogle.com](https://stitch.withgoogle.com):

### Home Screen
```
PDF tools mobile app home screen, Material Design 3, dark theme (#0F172A), 
blue-purple gradient accents. Grid of tool tiles with icons. Bottom 
navigation: Home, Tools, Recent, Settings. Floating action button.
```

### Tool Page
```
Mobile PDF merge screen, Material Design 3, dark theme. App bar with 
back arrow and title. Drag-drop file zone with dashed border. File 
list with thumbnails. Primary "Merge PDFs" button at bottom.
```

### Success Screen
```
PDF success download screen, Material Design 3. Green checkmark icon. 
"Your PDF is Ready!" heading. Action buttons: Download, Share, Open. 
Banner ad placeholder at bottom.
```

---

## 💻 Commands Quick Reference

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init "Convertify" "com.convertify.app" --web-dir=out

# Add platforms
npx cap add android
npx cap add ios

# Install plugins
npm install @capacitor-community/admob @capacitor/filesystem @capacitor/share @capacitor/haptics

# Build and sync
npm run build && npx cap sync

# Open in IDEs
npx cap open android
npx cap open ios

# Run on device
npx cap run android
```

---

## 📱 AdMob Test IDs (Development Only)

| Type | Android | iOS |
|------|---------|-----|
| Banner | `ca-app-pub-3940256099942544/6300978111` | `ca-app-pub-3940256099942544/2934735716` |
| Interstitial | `ca-app-pub-3940256099942544/1033173712` | `ca-app-pub-3940256099942544/4411468910` |
| Rewarded | `ca-app-pub-3940256099942544/5224354917` | `ca-app-pub-3940256099942544/1712485313` |

> ⚠️ Replace with your real AdMob IDs before publishing!

---

## 💰 Store Fees

| Platform | Cost | Type |
|----------|------|------|
| Google Play | $25 | One-time |
| Apple App Store | $99 | Annual |

---

## 📋 Store Submission Checklist

### Google Play
- [ ] Developer account created ($25)
- [ ] App icon: 512x512 PNG
- [ ] Feature graphic: 1024x500 PNG
- [ ] Screenshots: min 2 (1080x1920)
- [ ] Privacy policy URL
- [ ] Short description (80 chars)
- [ ] Full description

### App Store
- [ ] Developer account created ($99/year)
- [ ] App icon: 1024x1024 PNG (no alpha)
- [ ] Screenshots for all device sizes
- [ ] Privacy policy URL
- [ ] App description
- [ ] Keywords

---

## 🔗 Quick Links

- [Google Stitch](https://stitch.withgoogle.com) - AI UI Design
- [Capacitor Docs](https://capacitorjs.com/docs) - Framework
- [AdMob Plugin](https://github.com/capacitor-community/admob) - Ads
- [Play Console](https://play.google.com/console) - Android Publishing
- [App Store Connect](https://appstoreconnect.apple.com) - iOS Publishing
- [AdMob Console](https://apps.admob.com) - Ad Management

---

*Full plan: `.agent/docs/MOBILE_APP_IMPLEMENTATION_PLAN.md`*
