import { IS_MOBILE_BUILD } from './is-mobile-build.ts'
import { ANDROID_SHORT_NAMES } from './mobile-tools.ts'

/** Android recents / WebView `<title>` — never website SEO strings. */
export const MOBILE_HOME_TITLE = 'Convertify'
export const MOBILE_TOOLS_TITLE = 'All tools'
export const MOBILE_ABOUT_TITLE = 'About'
export const MOBILE_PRIVACY_TITLE = 'Privacy'

export function appDocumentTitle(webTitle: string, mobileTitle = MOBILE_HOME_TITLE): string {
    return IS_MOBILE_BUILD ? mobileTitle : webTitle
}

export function toolDocumentTitle(toolId: string, webTitle: string): string {
    return appDocumentTitle(webTitle, ANDROID_SHORT_NAMES[toolId] ?? MOBILE_HOME_TITLE)
}

/** Short title for the current Android shell route. */
export function mobileRouteTitle(pathname: string): string {
    const path = (pathname || '/').replace(/\/$/, '') || '/'
    if (path === '/') return MOBILE_HOME_TITLE
    if (path === '/all-tools') return MOBILE_TOOLS_TITLE
    if (path === '/about') return MOBILE_ABOUT_TITLE
    if (path === '/privacy') return MOBILE_PRIVACY_TITLE
    const slug = path.replace(/^\//, '')
    return ANDROID_SHORT_NAMES[slug] ?? MOBILE_HOME_TITLE
}

/** Swap SEO titles for short app names during `NEXT_PUBLIC_MOBILE_BUILD`. */
export function applyMobileSeoTitles<T extends Record<string, { title: string }>>(data: T): T {
    if (!IS_MOBILE_BUILD) return data
    for (const id of Object.keys(data)) {
        const short = ANDROID_SHORT_NAMES[id]
        if (short) data[id].title = short
    }
    return data
}
