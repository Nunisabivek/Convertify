import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'

/**
 * Monetag ads for the website (the Android app uses AdMob, see native-ads.ts).
 *
 * Rule: nothing loads while a visitor is working. On tool pages both zones load only after a
 * file has been saved: the In-Page Push card appears, and the Vignette shows on their next
 * page change. Content pages (blog, home, info) have no work in progress, so the In-Page Push
 * card loads after a short read. No popunder, push-notification, interstitial or MultiTag
 * formats: they hijack clicks or cover the page, which costs search traffic.
 */
// Zones from the Monetag dashboard. In-Page Push comes as a regular ("particular") and a
// "strong" tag; the Vignette as "happy" and "hot". Hot (zone 12092188, same script) is left out
// to keep the milder feed; swap it into vignetteHappy's place to try it.
const IN_PAGE_PUSH = 'https://nap5k.com/tag.min.js'
const VIGNETTE = 'https://n6wxm.com/vignette.min.js'
const ZONES = {
    pushRegular: { zone: '12092108', src: IN_PAGE_PUSH }, // content pages, no work in progress
    pushStrong: { zone: '12092107', src: IN_PAGE_PUSH }, // after a download: the work is done
    vignetteHappy: { zone: '12092189', src: VIGNETTE }, // after a download, shows on the next page change
}
const CONTENT_PAGE_DELAY_MS = 8000
// Let the browser's save prompt finish before anything appears.
const AFTER_DOWNLOAD_DELAY_MS = 1500

const CONTENT_PAGES = ['/', '/all-tools', '/about', '/security', '/pricing', '/privacy', '/terms', '/contact']
const isContentPage = (path: string) => CONTENT_PAGES.includes(path) || path.startsWith('/blog')

const loaded = new Set<string>()
let hooked = false

function loadZone({ zone, src }: { zone: string; src: string }) {
    if (loaded.has(zone)) return
    loaded.add(zone)
    const s = document.createElement('script')
    s.dataset.zone = zone
    s.src = src
    document.body.appendChild(s)
}

function afterWork() {
    setTimeout(() => {
        // One In-Page Push tag per page: the strong one replaces the regular one, never stacks on it.
        if (!loaded.has(ZONES.pushRegular.zone)) loadZone(ZONES.pushStrong)
        loadZone(ZONES.vignetteHappy)
    }, AFTER_DOWNLOAD_DELAY_MS)
}

const isDownload = (el: unknown): el is HTMLAnchorElement => el instanceof HTMLAnchorElement && el.hasAttribute('download')

/**
 * Notices every way a tool saves a file without changing it: a click on an <a download>,
 * a detached a.click() (finishConvert), and file-saver's dispatched click. Same three
 * channels NativeResultSheet intercepts in the app.
 */
function watchDownloads() {
    if (hooked) return
    hooked = true
    document.addEventListener('click', (e) => {
        if (isDownload((e.target as Element | null)?.closest?.('a[download]'))) afterWork()
    }, true)
    const click = HTMLAnchorElement.prototype.click
    HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
        if (isDownload(this)) afterWork()
        return click.call(this)
    }
    const dispatch = EventTarget.prototype.dispatchEvent
    EventTarget.prototype.dispatchEvent = function (this: EventTarget, event: Event) {
        if (event?.type === 'click' && isDownload(this)) afterWork()
        return dispatch.call(this, event)
    }
}

/** Call on every route change from the website layout. Returns a cleanup for the pending timer. */
export function startMonetag(pathname: string): () => void {
    if (IS_MOBILE_BUILD || typeof window === 'undefined') return () => {}
    watchDownloads()
    if (!isContentPage(pathname)) return () => {}
    const t = setTimeout(() => {
        if (!loaded.has(ZONES.pushStrong.zone)) loadZone(ZONES.pushRegular)
    }, CONTENT_PAGE_DELAY_MS)
    return () => clearTimeout(t)
}
