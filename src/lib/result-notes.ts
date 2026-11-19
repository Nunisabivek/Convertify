function kb(bytes: number): string {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Done-sheet line after a size job: what the user cares about is before → after. */
export function sizeNote(beforeBytes: number, afterBytes: number, shrunk: boolean): string {
    if (Math.abs(afterBytes - beforeBytes) <= beforeBytes * 0.02) return `Already the right size · ${kb(afterBytes)}`
    // Fit-to-size can grow a tiny file up to a form's minimum.
    if (afterBytes > beforeBytes) return `${kb(beforeBytes)} → ${kb(afterBytes)}`
    const pct = Math.round((1 - afterBytes / beforeBytes) * 100)
    const line = `${kb(beforeBytes)} → ${kb(afterBytes)} · ${pct}% smaller`
    return shrunk ? `${line} · resolution lowered to fit` : line
}

/** Passport / ID crop. */
export function cropNote(shrunk: boolean) {
    return shrunk ? 'Cropped, and had to shrink a little' : 'Cropped to the size the form asks for'
}

export function missedBandNote(gotLabel: string, minKb: number, maxKb: number, tooBig: boolean) {
    const band = `${minKb}–${maxKb} KB`
    if (tooBig) return `Could not hit ${band}. Smallest we got is ${gotLabel}.`
    return `Could not hit ${band}. Largest we got is ${gotLabel}.`
}
