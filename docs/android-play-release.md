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

## Live reload on the Android emulator

This is how you watch the app update like `next dev` on the website. It does **not** put a server URL into a Play/release build.

**1. Start the Next dev server** (leave this running):

```bash
npm run dev:mobile
```

That is `NEXT_PUBLIC_MOBILE_BUILD=true next dev -H 0.0.0.0 --port 3000`. The emulator reaches this machine at `10.0.2.2`.

**2. Start the Android emulator** from Android Studio (or `emulator -avd <name>`).

**3. In a second terminal, install the debug app pointed at that server:**

```bash
npm run cap:live
```

The WebView loads `http://10.0.2.2:3000`. Cleartext HTTP is allowed only in the **debug** APK. Production/release still uses the bundled `out/` files over https.

**4. Edit code.** Most UI changes hot-reload. If a tool route looks stale, pull down to refresh the page (or press **R** in Logcat).

**5. Ctrl+C** in the `cap:live` terminal when you are done. That restores the bundled-config settings. A Play build is still:

```bash
npm run mobile
cd android && ./gradlew assembleRelease
```

Never ship an APK that you installed with `cap:live` — that debug package talks to your computer.

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
