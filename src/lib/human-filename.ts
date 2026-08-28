/**
 * User-visible output names: passport-photo.jpg, then passport-photo-2.jpg.
 * Never append epoch timestamps.
 */

export function nextHumanFilename(desired: string, taken: string[] = []): string {
    const safe = desired.replace(/[/\\?%*:|"<>]/g, '-').slice(0, 120) || 'converted-file'
    const dot = safe.lastIndexOf('.')
    const base = dot > 0 ? safe.slice(0, dot) : safe
    const ext = dot > 0 ? safe.slice(dot) : ''
    const used = new Set(taken.map((name) => name.toLowerCase()))
    if (!used.has(safe.toLowerCase())) return safe
    for (let n = 2; n < 1000; n++) {
        const candidate = `${base}-${n}${ext}`
        if (!used.has(candidate.toLowerCase())) return candidate
    }
    return `${base}-copy${ext}`
}
