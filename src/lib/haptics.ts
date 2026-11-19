export type HapticKind = 'tap' | 'select' | 'heavy' | 'success' | 'error'

let native: boolean | null = null

/**
 * Android system touch feedback through the ConvertifyFiles plugin
 * (View.performHapticFeedback): crisp on cheap motors and it follows the
 * phone's "Touch feedback" setting. Silent on the website.
 */
export async function haptic(kind: HapticKind = 'tap'): Promise<void> {
    try {
        if (native === null) {
            const { Capacitor } = await import('@capacitor/core')
            native = Capacitor.isNativePlatform()
        }
        if (!native) return
        const ConvertifyFiles = (await import('@/lib/convertify-files')).default
        await ConvertifyFiles.haptic({ type: kind })
    } catch {
        // web, or an older native shell without the method
    }
}

/** Taps on buttons and rows. `medium` is the heavier tick (shutter, save). */
export function tapHaptic(kind: 'light' | 'medium' = 'light'): Promise<void> {
    return haptic(kind === 'medium' ? 'heavy' : 'tap')
}
