# Android Play release (Convertify)

This repo ships a **debug-signed** APK. That is enough to install on a phone or emulator. Google Play requires a **release keystore** that only the owner should create and keep.

## Build a debug APK

```bash
npm install
npm run mobile
cd android
./gradlew assembleDebug
```

The APK is at `android/app/build/outputs/apk/debug/app-debug.apk`.

`npm run mobile` runs a static Next.js export (`NEXT_PUBLIC_MOBILE_BUILD=true`) and `npx cap sync android`. Website Adsterra code is stripped in that export. There is no AdMob SDK in this v1.

## Add a Play release keystore later

1. Create a keystore (once) and store the password somewhere safe — not in git:

```bash
keytool -genkeypair -v -keystore convertify-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias convertify
```

2. Put the `.jks` file **outside** the repo (or gitignore it).
3. In `android/gradle.properties` (or a local `keystore.properties` that is gitignored), set:

```
CONVERTIFY_STORE_FILE=/absolute/path/to/convertify-release.jks
CONVERTIFY_STORE_PASSWORD=...
CONVERTIFY_KEY_ALIAS=convertify
CONVERTIFY_KEY_PASSWORD=...
```

4. Wire those values into `android/app/build.gradle` `signingConfigs.release` and use that config for the `release` build type.
5. Build the Play artifact:

```bash
cd android
./gradlew bundleRelease
```

Upload `android/app/build/outputs/bundle/release/app-release.aab`.

Do not invent or commit a production keystore in this repository.
