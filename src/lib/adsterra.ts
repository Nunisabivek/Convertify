/**
 * Adsterra display banners for the website (the Android app uses AdMob, see native-ads.ts).
 *
 * Paste each unit's values from Adsterra's "Get code" box: `key` is the value of atOptions.key,
 * `src` is the invoke.js URL. A size left as null renders nothing, and the slot reserves no space.
 * Not secrets: both appear in every page's HTML.
 *
 * Plain module (no "use client", no DOM) so the unit test can import it.
 */
export type BannerSize = 'rectangle' | 'leaderboard' | 'mobile'

export interface AdsterraUnit {
    key: string
    src: string
}

export const UNITS: Record<BannerSize, AdsterraUnit | null> = {
    rectangle: null, // 300x250
    leaderboard: null, // 728x90
    mobile: null, // 320x50
}

export const SIZES: Record<BannerSize, { width: number; height: number }> = {
    rectangle: { width: 300, height: 250 },
    leaderboard: { width: 728, height: 90 },
    mobile: { width: 320, height: 50 },
}

/** Narrowest viewport (CSS px) that gets the 728x90 leaderboard instead of the 320x50. */
export const LEADERBOARD_MIN_WIDTH = 768

/** The size a wide placement uses at a given viewport width, falling back when a unit is not set up. */
export function wideSize(viewportWidth: number, units: Record<BannerSize, AdsterraUnit | null> = UNITS): BannerSize | null {
    const order: BannerSize[] = viewportWidth >= LEADERBOARD_MIN_WIDTH ? ['leaderboard', 'rectangle'] : ['mobile', 'rectangle']
    return order.find((s) => units[s]) ?? null
}

/** The sticky bottom banner only uses the short sizes; a 300x250 would cover the page. */
export function anchorSize(viewportWidth: number, units: Record<BannerSize, AdsterraUnit | null> = UNITS): BannerSize | null {
    const size: BannerSize = viewportWidth >= LEADERBOARD_MIN_WIDTH ? 'leaderboard' : 'mobile'
    return units[size] ? size : null
}

const KEY_RE =/^[a-z0-9]{8,64}$/i

/** Only https invoke.js URLs; protocol-relative ones from the dashboard are upgraded. */
export function normalizeSrc(src: string): string | null {
    const s = src.trim().replace(/^\/\//, 'https://')
    try {
        const u = new URL(s)
        if (u.protocol !== 'https:' || !u.pathname.endsWith('.js')) return null
        return u.href
    } catch {
        return null
    }
}

/**
 * HTML for one banner's iframe. Each banner gets its own document because Adsterra's tag reads a
 * global `atOptions`; two tags on one page would overwrite each other.
 */
export function bannerDocument(unit: AdsterraUnit, size: BannerSize): string | null {
    const src = normalizeSrc(unit.src)
    if (!src || !KEY_RE.test(unit.key)) return null
    const { width, height } = SIZES[size]
    const options = JSON.stringify({ key: unit.key, format: 'iframe', height, width, params: {} })
    return (
        '<!doctype html><html><head><meta charset="utf-8">' +
        '<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>' +
        `</head><body><script>atOptions=${options};</script>` +
        `<script src="${src.replace(/"/g, '&quot;')}"></script></body></html>`
    )
}

/** True once at least one banner size is set up. */
export const ADSTERRA_ON = Object.values(UNITS).some(Boolean)

/**
 * Routes where a sticky bottom banner would sit on top of the working area (canvas editors and
 * page-picking grids). In-page banners still show there.
 */
const NO_ANCHOR_PREFIXES = [
    '/autocad-pdf-editor',
    '/edit-pdf',
    '/sign-pdf',
    '/redact-pdf',
    '/organize-pdf',
    '/reorder-pdf',
    '/crop-pdf',
    '/compare-pdf',
    '/scan-document',
    '/passport-photo',
    '/remove-background',
    '/admin',
]

export function anchorAllowed(pathname: string): boolean {
    return !NO_ANCHOR_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}
