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
    return IS_MOBILE_BUILD && typeof window !== 'undefined'
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

async function maybeRequestConsent(plugin: AdMobModule): Promise<boolean> {
    try {
        let info = await withTimeout(plugin.AdMob.requestConsentInfo(), 5000)
        if (info.isConsentFormAvailable && info.status === plugin.AdmobConsentStatus.REQUIRED) {
            info = await withTimeout(plugin.AdMob.showConsentForm(), 15000)
        }
        return info.canRequestAds !== false
    } catch {
        // UMP missing or slow - never block the shell. Fail open for ads.
        return true
    }
}

async function prepareInterstitial(plugin: AdMobModule): Promise<void> {
    interstitialReady = false
    try {
        await plugin.AdMob.prepareInterstitial({
            adId: INTERSTITIAL_AD_UNIT_ID,
            isTesting: false,
        })
        interstitialReady = true
    } catch {
        interstitialReady = false
    }
}

async function showBanner(plugin: AdMobModule): Promise<void> {
    await plugin.AdMob.addListener(plugin.BannerAdPluginEvents.SizeChanged, (size) => {
        onBannerSize(size?.height ?? 0)
    })
    await plugin.AdMob.addListener(plugin.BannerAdPluginEvents.FailedToLoad, () => {
        if (holds.size === 0) setBannerInset(0)
    })
    // Typical phone adaptive-banner row until SizeChanged reports the real height.
    setBannerInset(lastBannerHeight)
    await plugin.AdMob.showBanner({
        adId: BANNER_AD_UNIT_ID,
        adSize: plugin.BannerAdSize.ADAPTIVE_BANNER,
        position: plugin.BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: false,
    })
    bannerLaidOut = true
    if (holds.size > 0) {
        await plugin.AdMob.hideBanner().catch(() => {})
        setBannerInset(lastBannerHeight)
    }
}

async function applyHolds(): Promise<void> {
    const plugin = admob
    if (!plugin || !bannerLaidOut) return
    try {
        if (holds.size > 0) {
            await plugin.AdMob.hideBanner()
            setBannerInset(lastBannerHeight)
        } else {
            await plugin.AdMob.resumeBanner()
        }
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

    await plugin.AdMob.initialize({
        // Production/Play: never register test devices or force test creatives.
        initializeForTesting: false,
    })
    const canRequest = await maybeRequestConsent(plugin)
    if (!canRequest) return

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
    await plugin.AdMob.addListener(plugin.InterstitialAdPluginEvents.FailedToLoad, () => {
        interstitialReady = false
    })
    await plugin.AdMob.addListener(plugin.InterstitialAdPluginEvents.Loaded, () => {
        interstitialReady = true
    })

    try {
        await showBanner(plugin)
    } catch {
        setBannerInset(0)
        bannerLaidOut = false
    }

    // Prefetch in the background so a later convert can show without waiting.
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
    if (holds.has('job')) return

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
 * After a file is ready to share/save. Never on cold start, back, picker, or tap.
 * At most once every 3 conversions and 3 minutes (whichever is stricter).
 * Only queues if an interstitial is already loaded - never waits and never
 * blocks Share/Save on the Done sheet. Actual show happens in
 * `flushQueuedInterstitial` after the sheet closes.
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
    if (!interstitialReady || interstitialShowing) return
    interstitialQueued = true
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
