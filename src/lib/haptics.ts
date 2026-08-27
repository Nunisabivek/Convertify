export async function tapHaptic(kind: 'light' | 'medium' = 'light') {
    try {
        const { Capacitor } = await import('@capacitor/core')
        if (!Capacitor.isNativePlatform()) return
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
        await Haptics.impact({
            style: kind === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light,
        })
    } catch {
        // web / missing plugin
    }
}
