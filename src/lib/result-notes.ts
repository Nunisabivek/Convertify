export function qualityNote(shrunk: boolean) {
    return shrunk ? 'Had to shrink a little' : 'Kept full size'
}

/** Passport / ID crop — never "Kept full size". */
export function cropNote(shrunk: boolean) {
    return shrunk ? 'Cropped, and had to shrink a little' : 'Cropped to the size the form asks for'
}

export function missedBandNote(gotLabel: string, minKb: number, maxKb: number, tooBig: boolean) {
    const band = `${minKb}–${maxKb} KB`
    if (tooBig) return `Could not hit ${band}. Smallest we got is ${gotLabel}.`
    return `Could not hit ${band}. Largest we got is ${gotLabel}.`
}
