import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import { ANDROID_SHORT_NAMES } from '@/lib/mobile-tools'

/** Document <title> in the Android shell. Website SEO titles stay unchanged. */
export function appChromeTitle(
    appTitle: string,
    webTitle: string,
    mobile = IS_MOBILE_BUILD,
): string {
    return mobile ? appTitle : webTitle
}

export function appToolTitle(
    toolId: string,
    webTitle: string,
    mobile = IS_MOBILE_BUILD,
): string {
    if (!mobile) return webTitle
    return ANDROID_SHORT_NAMES[toolId] ?? 'Convertify'
}
