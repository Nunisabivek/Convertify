/**
 * One device tier for the AutoCAD editor, from what the browser tells us about the
 * hardware. The tier sets how many pixels a page is rendered at, how much rendered
 * imagery stays cached, and how far render scale may follow devicePixelRatio.
 *
 *   low      ≤ 2 GB RAM or ≤ 2 cores (cheap Android phones): ~4 MP pages
 *   phone    touch-first, short screen side < 600 CSS px:      ~8 MP
 *   tablet   touch-first, short side ≥ 600 (iPad, Android tab): ~12 MP
 *   desktop  everything else:                                  ~16 MP
 *
 * Every budget stays under iOS Safari's 16.7 MP canvas limit.
 */
export type Tier = 'low' | 'phone' | 'tablet' | 'desktop'

export const TIERS: readonly Tier[] = ['low', 'phone', 'tablet', 'desktop']

export type DeviceSignals = {
    /** navigator.deviceMemory in GB (Chromium only; rounded down, capped at 8). */
    memoryGb?: number
    /** navigator.hardwareConcurrency. */
    cores?: number
    /** screen.width / screen.height in CSS px. */
    screenW: number
    screenH: number
    devicePixelRatio: number
    /** navigator.maxTouchPoints > 0. */
    touch: boolean
    /** matchMedia('(pointer: coarse)'): the primary pointer is a finger. */
    coarse: boolean
}

export type TierProfile = {
    tier: Tier
    /** Max canvas pixels for one rendered page. */
    budget: number
    /** Max render scale (canvas px per point); grows with devicePixelRatio, never past the budget. */
    maxScale: number
    /** Total megapixels of rendered page images kept at once (current page always kept). */
    cacheMP: number
    /** Pages either side of the current one whose images may stay cached. */
    neighbours: number
}

/** iOS Safari refuses canvases above 16,777,216 pixels. */
export const IOS_CANVAS_LIMIT = 16_777_216

const BUDGET: Record<Tier, number> = { low: 4_000_000, phone: 8_000_000, tablet: 12_000_000, desktop: 16_000_000 }
const CACHE_MP: Record<Tier, number> = { low: 6, phone: 18, tablet: 28, desktop: 48 }

export function decideTier(s: DeviceSignals): Tier {
    if ((s.memoryGb !== undefined && s.memoryGb > 0 && s.memoryGb <= 2) || (s.cores !== undefined && s.cores > 0 && s.cores <= 2)) return 'low'
    const short = Math.min(s.screenW, s.screenH)
    // Touch laptops have a touchscreen but a fine primary pointer: they stay desktop.
    const handheld = s.coarse || (s.touch && short < 600)
    if (!handheld) return 'desktop'
    return short < 600 ? 'phone' : 'tablet'
}

export function tierProfile(tier: Tier, devicePixelRatio = 1): TierProfile {
    const dpr = Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? devicePixelRatio : 1
    // Small sheets (A4, A3) are limited by maxScale, not the budget: on a HiDPI screen
    // render them sharper so zoomed-in text stays crisp. Big sheets hit the budget first.
    const maxScale = tier === 'low' ? 2 : Math.min(4, Math.max(2, dpr * 1.5))
    return { tier, budget: Math.min(BUDGET[tier], IOS_CANVAS_LIMIT - 1), maxScale, cacheMP: CACHE_MP[tier], neighbours: 1 }
}

/** `?cadTier=low` or localStorage "cadTier" forces a tier (tests, support). */
export function tierOverride(search: string, stored: string | null | undefined): Tier | null {
    const q = /[?&]cadTier=([a-z]+)/i.exec(search)?.[1]?.toLowerCase()
    const pick = (v: string | null | undefined) => (v && (TIERS as readonly string[]).includes(v) ? (v as Tier) : null)
    return pick(q) ?? pick(stored?.toLowerCase())
}

/** Reads the signals from the browser (call only in the browser). */
export function readSignals(): DeviceSignals {
    const nav = navigator as Navigator & { deviceMemory?: number }
    return {
        memoryGb: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : undefined,
        cores: typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : undefined,
        screenW: window.screen?.width || window.innerWidth,
        screenH: window.screen?.height || window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        touch: (nav.maxTouchPoints ?? 0) > 0,
        coarse: !!window.matchMedia?.('(pointer: coarse)').matches,
    }
}

/** The tier profile for this browser, honouring a test override. */
export function deviceProfile(forceMobile = false): TierProfile {
    const s = readSignals()
    let stored: string | null = null
    try {
        stored = window.localStorage.getItem('cadTier')
    } catch {
        // Private mode or storage disabled.
    }
    const forced = tierOverride(window.location.search, stored)
    let tier = forced ?? decideTier(s)
    // The Android app is always a phone or tablet, never a desktop.
    if (!forced && forceMobile && tier === 'desktop') tier = Math.min(s.screenW, s.screenH) < 600 ? 'phone' : 'tablet'
    return tierProfile(tier, s.devicePixelRatio)
}

/**
 * Which rendered page images to keep: the current page always, then its neighbours
 * nearest first while the total stays within `capMP`. `sizes` maps page → megapixels
 * of each page that currently has an image. Returns the pages to keep.
 */
export function pagesToKeep(sizes: Map<number, number>, current: number, neighbours: number, capMP: number): Set<number> {
    const keep = new Set<number>()
    let total = 0
    if (sizes.has(current)) {
        keep.add(current)
        total += sizes.get(current)!
    }
    const near = [...sizes.keys()]
        .filter((p) => p !== current && Math.abs(p - current) <= neighbours)
        .sort((a, b) => Math.abs(a - current) - Math.abs(b - current) || a - b)
    for (const p of near) {
        const mp = sizes.get(p)!
        if (total + mp > capMP) continue
        keep.add(p)
        total += mp
    }
    return keep
}
