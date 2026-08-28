export const INTERSTITIAL_EVERY_N_CONVERSIONS = 3
export const INTERSTITIAL_MIN_INTERVAL_MS = 3 * 60 * 1000

export interface InterstitialGate {
    conversions: number
    lastShownAt: number
    conversionsAtLastShow: number
}

/**
 * Pure gate: show only after 3 conversions since the last interstitial
 * (and 3 minutes once one has already been shown). Never on launch.
 *
 * `gate.conversions` is the count AFTER recording this conversion.
 */
export function shouldOfferInterstitial(gate: InterstitialGate, now = Date.now()): boolean {
    const since = gate.conversions - gate.conversionsAtLastShow
    if (since < INTERSTITIAL_EVERY_N_CONVERSIONS) return false
    if (gate.lastShownAt === 0) return true
    return now - gate.lastShownAt >= INTERSTITIAL_MIN_INTERVAL_MS
}
