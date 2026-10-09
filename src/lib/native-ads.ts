/**
 * Native AdMob for the Capacitor Android shell only (`IS_MOBILE_BUILD`).
 *
 * Live IDs from the owner. When they change, swap them in exactly two places:
 *   android/app/src/main/res/values/strings.xml  ->  `admob_app_id`
 *     (AndroidManifest `APPLICATION_ID` meta reads that string - do not duplicate)
 *   this file -> `BANNER_AD_UNIT_ID` + `INTERSTITIAL_AD_UNIT_ID`
 *
 * convertify.work never calls this module. Adsterra stays website-only.
 * Ad failures are silent. Share/Save on the Done sheet never waits for an ad.
 */
import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import { shouldOfferInterstitial, type InterstitialGate } from '@/lib/interstitial-gate'

export { shouldOfferInterstitial, type InterstitialGate }

/** Live banner unit. App ID is only in strings.xml (`admob_app_id`). */
export const BANNER_AD_UNIT_ID = 'ca-app-pub-4814181825408625/7919857158'
/** Live interstitial unit. Shown only after a successful convert + gate. */
export const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-4814181825408625/4065381782'

const STATE_KEY = 'convertify:admob-interstitial'

type AdMobModule = typeof import('@capacitor-community/admob')

let startPromise: Promise<void> | null = null
let admob: AdMobModule | null = null
let interstitialReady = false
let interstitialShowing = false
let interstitialQueued = false
let lastNoteAt = 0
const NOTE_DEBOUNCE_MS = 2000
/** Hide native banner (no tap steal) without collapsing reserved space. */
const holds = new Set<string>()
let lastBannerHeight = 50
let bannerLaidOut = false

function adsAllowed(): boolean {
    if (typeof window === 'undefined') return false
    if (IS_MOBILE_BUILD) return true
    try {
        const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor
        return typeof cap?.isNativePlatform === 'function' && cap.isNativePlatform()
    } catch {
        return false
    }
}

function readGate(): InterstitialGate {
    try {
        const raw = localStorage.getItem(STATE_KEY)
        if (raw) {
            const parsed = JSON.parse(raw) as Partial<InterstitialGate>
            return {
                conversions: Number(parsed.conversions) || 0,
                lastShownAt: Number(parsed.lastShownAt) || 0,
                conversionsAtLastShow: Number(parsed.conversionsAtLastShow) || 0,
            }
        }
    } catch {
        // ignore corrupt storage
    }
    return { conversions: 0, lastShownAt: 0, conversionsAtLastShow: 0 }
}

function writeGate(gate: InterstitialGate): void {
    try {
        localStorage.setItem(STATE_KEY, JSON.stringify(gate))
    } catch {
        // ignore
    }
}

function setBannerInset(height: number): void {
    const px = Math.max(0, Math.round(height))
    if (px > 0) lastBannerHeight = px
    const value = `${px}px`
    document.documentElement.style.setProperty('--ad-banner-h', value)
    const root = document.querySelector('.mobile-app') as HTMLElement | null
    root?.style.setProperty('--ad-banner-h', value)
}

function onBannerSize(height: number): void {
    // hideBanner reports 0. Keep the last real height so nav/CTAs do not jump.
    if (holds.size > 0 && height <= 0) {
        setBannerInset(lastBannerHeight)
        return
    }
    setBannerInset(height)
}

async function loadPlugin(): Promise<AdMobModule | null> {
    if (admob) return admob
    try {
        const { Capacitor } = await import('@capacitor/core')
        if (!Capacitor.isNativePlatform()) return null
        admob = await import('@capacitor-community/admob')
        return admob
    } catch {
        return null
    }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('timeout')), ms)
        promise.then(
            (value) => {
                clearTimeout(timer)
                resolve(value)
            },
            (error) => {
                clearTimeout(timer)
                reject(error)
            },
        )
    })
}

async function maybeRequestConsent(plugin: AdMobModule): Promise<void> {
    try {
        const info = await withTimeout(plugin.AdMob.requestConsentInfo(), 6000)
        if (info?.status === plugin.AdmobConsentStatus.REQUIRED || info?.isConsentFormAvailable) {
            await withTimeout(plugin.AdMob.showConsentForm(), 15000)
        }
    } catch (err) {
        // UMP optional / missing / outside EEA. Fail open: never block ad initialization.
        console.warn('[AdMob] UMP consent completed or bypassed:', err)
    }
}

let interstitialRetryTimer: ReturnType<typeof setTimeout> | null = null
let interstitialRetryCount = 0
const MAX_INTERSTITIAL_RETRIES = 12

function scheduleInterstitialRetry(plugin: AdMobModule): void {
    if (interstitialRetryTimer || interstitialReady || interstitialShowing) return
    if (interstitialRetryCount >= MAX_INTERSTITIAL_RETRIES) return
    interstitialRetryCount++
    const delayMs = Math.min(60000, 20000 * Math.pow(1.4, interstitialRetryCount - 1))
    interstitialRetryTimer = setTimeout(() => {
        interstitialRetryTimer = null
        void prepareInterstitial(plugin)
    }, delayMs)
}

async function prepareInterstitial(plugin: AdMobModule): Promise<void> {
    if (interstitialReady || interstitialShowing) return
    try {
        await plugin.AdMob.prepareInterstitial({
            adId: INTERSTITIAL_AD_UNIT_ID,
            isTesting: false,
        })
        interstitialReady = true
        interstitialRetryCount = 0
        if (interstitialRetryTimer) {
            clearTimeout(interstitialRetryTimer)
            interstitialRetryTimer = null
        }
    } catch (err) {
        interstitialReady = false
        console.warn('[AdMob] prepareInterstitial failed (will auto-retry):', err)
        scheduleInterstitialRetry(plugin)
    }
}

let bannerRetryTimer: ReturnType<typeof setTimeout> | null = null
let bannerRetryCount = 0
const MAX_BANNER_RETRIES = 12

function scheduleBannerRetry(plugin: AdMobModule): void {
    if (bannerRetryTimer) return
    if (bannerRetryCount >= MAX_BANNER_RETRIES) return
    bannerRetryCount++
    const delayMs = Math.min(60000, 15000 * Math.pow(1.4, bannerRetryCount - 1))
    console.log(`[AdMob] scheduling banner retry #${bannerRetryCount} in ${Math.round(delayMs / 1000)}s`)
    bannerRetryTimer = setTimeout(async () => {
        bannerRetryTimer = null
        try {
            await plugin.AdMob.showBanner({
                adId: BANNER_AD_UNIT_ID,
                adSize: plugin.BannerAdSize.ADAPTIVE_BANNER,
                position: plugin.BannerAdPosition.BOTTOM_CENTER,
                margin: 0,
                isTesting: false,
            })
            bannerLaidOut = true
            bannerRetryCount = 0
        } catch {
            scheduleBannerRetry(plugin)
        }
    }, delayMs)
}

async function showBanner(plugin: AdMobModule): Promise<void> {
    await plugin.AdMob.addListener(plugin.BannerAdPluginEvents.Loaded, () => {
        bannerLaidOut = true
        bannerRetryCount = 0
        if (bannerRetryTimer) {
            clearTimeout(bannerRetryTimer)
            bannerRetryTimer = null
        }
        setBannerInset(lastBannerHeight)
    })
    await plugin.AdMob.addListener(plugin.BannerAdPluginEvents.SizeChanged, (size) => {
        const h = size?.height ?? 0
        if (h > 0) {
            bannerLaidOut = true
            bannerRetryCount = 0
        }
        onBannerSize(h)
    })
    await plugin.AdMob.addListener(plugin.BannerAdPluginEvents.FailedToLoad, (err) => {
        // Visible in logcat. Code 3 = no fill: pending review, app-ads.txt crawling, or low demand.
        console.warn('[AdMob] banner failed to load (will auto-retry)', err?.code, err?.message)
        bannerLaidOut = false
        // When not loaded, collapse empty space so UI doesn't have an empty gap
        setBannerInset(0)
        scheduleBannerRetry(plugin)
    })
    // Start with typical phone adaptive-banner row until size or failure resolves
    setBannerInset(lastBannerHeight)
    try {
        await plugin.AdMob.showBanner({
            adId: BANNER_AD_UNIT_ID,
            adSize: plugin.BannerAdSize.ADAPTIVE_BANNER,
            position: plugin.BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: false,
        })
        bannerLaidOut = true
    } catch (err) {
        console.warn('[AdMob] initial showBanner call failed:', err)
        bannerLaidOut = false
        setBannerInset(0)
        scheduleBannerRetry(plugin)
    }
}

async function applyHolds(): Promise<void> {
    const plugin = admob
    if (!plugin || !bannerLaidOut) return
    try {
        // Banner stays visible everytime below per user requirement
        await plugin.AdMob.resumeBanner()
    } catch {
        // fail silently
    }
}

/**
 * Hide the native banner so it cannot steal taps (convert progress, Done sheet).
 * Reserved `--ad-banner-h` space stays so the shell does not jump.
 */
export function holdNativeAds(reason: string): void {
    if (!adsAllowed() || !reason) return
    const before = holds.size
    holds.add(reason)
    if (before === 0) void applyHolds()
}

export function releaseNativeAds(reason: string): void {
    if (!adsAllowed() || !reason) return
    holds.delete(reason)
    if (holds.size === 0) void applyHolds()
}

async function startNativeAdsInternal(): Promise<void> {
    if (!adsAllowed()) return
    const plugin = await loadPlugin()
    if (!plugin) return

    // 1. Gather consent if required (fail-open, non-blocking)
    await maybeRequestConsent(plugin)

    // 2. Initialize AdMob SDK
    await plugin.AdMob.initialize({
        // Production/Play: never register test devices or force test creatives.
        initializeForTesting: false,
    })

    // 3. Setup interstitial event listeners
    await plugin.AdMob.addListener(plugin.InterstitialAdPluginEvents.Dismissed, () => {
        interstitialShowing = false
        interstitialReady = false
        void prepareInterstitial(plugin)
    })
    await plugin.AdMob.addListener(plugin.InterstitialAdPluginEvents.FailedToShow, () => {
        interstitialShowing = false
        interstitialReady = false
        void prepareInterstitial(plugin)
    })
    await plugin.AdMob.addListener(plugin.InterstitialAdPluginEvents.FailedToLoad, (err) => {
        console.warn('[AdMob] interstitial failed to load (will auto-retry)', err?.code, err?.message)
        interstitialReady = false
        scheduleInterstitialRetry(plugin)
    })
    await plugin.AdMob.addListener(plugin.InterstitialAdPluginEvents.Loaded, () => {
        interstitialReady = true
        interstitialRetryCount = 0
        if (interstitialRetryTimer) {
            clearTimeout(interstitialRetryTimer)
            interstitialRetryTimer = null
        }
    })

    // 4. Request banner
    await showBanner(plugin)

    // 5. Prefetch interstitial in the background
    void prepareInterstitial(plugin)
}

/** Banner on the first Android shell screen. Safe to call more than once. */
export function startNativeAds(): Promise<void> {
    if (!adsAllowed()) return Promise.resolve()
    if (!startPromise) {
        startPromise = startNativeAdsInternal().catch(() => {
            // fail silently
        })
    }
    return startPromise
}

function tryShowInterstitial(): void {
    const plugin = admob
    if (!plugin) return
    if (!interstitialReady || interstitialShowing) return

    interstitialShowing = true
    interstitialReady = false
    interstitialQueued = false
    void plugin.AdMob.showInterstitial()
        .then(() => {
            const shown = readGate()
            shown.lastShownAt = Date.now()
            shown.conversionsAtLastShow = shown.conversions
            writeGate(shown)
        })
        .catch(() => {
            interstitialShowing = false
            interstitialReady = false
            if (admob) void prepareInterstitial(admob)
        })
}

/**
 * Show interstitial ad immediately after conversion succeeds (if ready & allowed).
 * Resolves when the user closes the ad (or if failed/not loaded), so the result
 * screen showing where the file is saved can be revealed smoothly afterwards.
 */
export async function showInterstitialAfterConversion(): Promise<void> {
    if (!adsAllowed()) return
    const plugin = await loadPlugin()
    if (!plugin) return

    const now = Date.now()
    if (now - lastNoteAt < NOTE_DEBOUNCE_MS) return
    lastNoteAt = now

    const gate = readGate()
    gate.conversions += 1
    writeGate(gate)

    if (!shouldOfferInterstitial(gate, now)) return
    if (!interstitialReady || interstitialShowing) {
        // Interstitial was not ready yet; prefetch now so subsequent conversions have one ready
        void prepareInterstitial(plugin)
        return
    }

    return new Promise<void>((resolve) => {
        let settled = false
        const done = () => {
            if (settled) return
            settled = true
            resolve()
        }

        // 35s safety timer to accommodate 15-30s video interstitials
        const timer = setTimeout(done, 35000)

        const subDismiss = plugin.AdMob.addListener(
            plugin.InterstitialAdPluginEvents.Dismissed,
            () => {
                cleanup()
                void plugin.AdMob.resumeBanner().catch(() => {})
                done()
            },
        )
        const subFail = plugin.AdMob.addListener(
            plugin.InterstitialAdPluginEvents.FailedToShow,
            () => {
                cleanup()
                void plugin.AdMob.resumeBanner().catch(() => {})
                done()
            },
        )

        const cleanup = () => {
            clearTimeout(timer)
            subDismiss.then((h) => h.remove()).catch(() => {})
            subFail.then((h) => h.remove()).catch(() => {})
        }

        interstitialShowing = true
        interstitialReady = false

        plugin.AdMob.showInterstitial()
            .then(() => {
                const shown = readGate()
                shown.lastShownAt = Date.now()
                shown.conversionsAtLastShow = shown.conversions
                writeGate(shown)
            })
            .catch(() => {
                interstitialShowing = false
                interstitialReady = false
                cleanup()
                done()
                if (admob) void prepareInterstitial(admob)
            })
    })
}

/**
 * After a file is ready to share/save. Never on cold start, back, picker, or tap.
 * At most once every 3 conversions and 3 minutes (whichever is stricter).
 * Shows interstitial immediately if loaded when conversion is complete,
 * with flushQueuedInterstitial as fallback after sheet closes.
 */
export function noteSuccessfulConversion(): void {
    if (!adsAllowed()) return
    const now = Date.now()
    // Same convert used to fire intercept + CONVERT_OFFER, so 2 jobs looked like 3.
    if (now - lastNoteAt < NOTE_DEBOUNCE_MS) return
    lastNoteAt = now

    const gate = readGate()
    gate.conversions += 1
    writeGate(gate)

    const plugin = admob
    if (!plugin) {
        void startNativeAds()
        return
    }
    if (!shouldOfferInterstitial(gate, now)) return
    if (!interstitialReady || interstitialShowing) {
        void prepareInterstitial(plugin)
        return
    }
    interstitialQueued = true
    tryShowInterstitial()
}

/**
 * Show a queued interstitial after Share/Save had a chance (Done sheet closed).
 * Short delay so Close does not feel like it opened the ad.
 */
export function flushQueuedInterstitial(): void {
    if (!adsAllowed() || !interstitialQueued) return
    window.setTimeout(() => {
        if (!interstitialQueued) return
        interstitialQueued = false
        tryShowInterstitial()
    }, 360)
}
