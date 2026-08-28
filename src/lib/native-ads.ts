/**
 * Native AdMob for the Capacitor Android shell only.
 *
 * Google sample (TEST) ad unit IDs — never put live units here until Play
 * is approved and the owner swaps them in one place:
 *   android/app/src/main/res/values/strings.xml  (App ID)
 *   this file (banner + interstitial unit IDs)
 *
 * The public website (convertify.work) never calls this. Adsterra stays
 * website-only. If an ad fails to load, we fail silently.
 */
import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'

/** Google sample App ID is in Android strings.xml; these are sample units. */
const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111'
const TEST_INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712'

const INTERSTITIAL_EVERY_N_CONVERSIONS = 3
const INTERSTITIAL_MIN_INTERVAL_MS = 3 * 60 * 1000
const STATE_KEY = 'convertify:admob-interstitial'

type AdMobModule = typeof import('@capacitor-community/admob')

interface InterstitialGate {
    conversions: number
    lastShownAt: number
    conversionsAtLastShow: number
}

let startPromise: Promise<void> | null = null
let admob: AdMobModule | null = null
let interstitialReady = false
let interstitialShowing = false

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

function canShowInterstitial(gate: InterstitialGate): boolean {
    const conversionsSince = gate.conversions - gate.conversionsAtLastShow
    const elapsed = gate.lastShownAt === 0 ? INTERSTITIAL_MIN_INTERVAL_MS : Date.now() - gate.lastShownAt
    // Stricter of the two caps: need 3 conversions AND 3 minutes.
    return conversionsSince >= INTERSTITIAL_EVERY_N_CONVERSIONS && elapsed >= INTERSTITIAL_MIN_INTERVAL_MS
}

function setBannerInset(height: number): void {
    const px = Math.max(0, Math.round(height))
    const root = document.querySelector('.mobile-app') as HTMLElement | null
    ;(root ?? document.documentElement).style.setProperty('--ad-banner-h', `${px}px`)
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
        // Sample App ID has no UMP message. Do not block test ads.
        return true
    }
}

async function prepareInterstitial(plugin: AdMobModule): Promise<void> {
    interstitialReady = false
    try {
        await plugin.AdMob.prepareInterstitial({ adId: TEST_INTERSTITIAL_ID })
        interstitialReady = true
    } catch {
        interstitialReady = false
    }
}

async function showBanner(plugin: AdMobModule): Promise<void> {
    await plugin.AdMob.addListener(plugin.BannerAdPluginEvents.SizeChanged, (size) => {
        setBannerInset(size?.height ?? 0)
    })
    await plugin.AdMob.addListener(plugin.BannerAdPluginEvents.FailedToLoad, () => {
        setBannerInset(0)
    })
    await plugin.AdMob.showBanner({
        adId: TEST_BANNER_ID,
        adSize: plugin.BannerAdSize.ADAPTIVE_BANNER,
        position: plugin.BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
    })
}

async function startNativeAdsInternal(): Promise<void> {
    if (!adsAllowed()) return
    const plugin = await loadPlugin()
    if (!plugin) return

    await plugin.AdMob.initialize()
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
    }

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

/**
 * After a file is ready to share/save. Never on cold start, back, picker, or tap.
 * At most once every 3 conversions and 3 minutes (whichever is stricter).
 * Only shows if an interstitial is already loaded — never waits and interrupts Share.
 */
export async function noteSuccessfulConversion(): Promise<void> {
    if (!adsAllowed()) return
    try {
        await startNativeAds()
        const plugin = admob
        if (!plugin) return

        const gate = readGate()
        gate.conversions += 1
        writeGate(gate)

        if (!canShowInterstitial(gate)) return
        if (!interstitialReady || interstitialShowing) return

        interstitialShowing = true
        interstitialReady = false
        await plugin.AdMob.showInterstitial()
        gate.lastShownAt = Date.now()
        gate.conversionsAtLastShow = gate.conversions
        writeGate(gate)
    } catch {
        interstitialShowing = false
        interstitialReady = false
        if (admob) void prepareInterstitial(admob)
    }
}
