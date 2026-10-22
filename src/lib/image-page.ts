export type PageSize = "original" | "a4" | "letter"

// Points (1/72 inch), portrait.
const SIZES = { a4: [595.28, 841.89], letter: [612, 792] } as const

/**
 * Where an image goes when it becomes a PDF page. "original" makes the page exactly the image
 * (no borders). A4/Letter fit the image inside the margins without stretching, centred, and turn
 * the page landscape for wide images, so a mix of screenshots and photos prints as uniform pages.
 */
export function placeImage(imgW: number, imgH: number, size: PageSize, margin = 0) {
    if (size === "original") return { page: [imgW, imgH] as [number, number], x: 0, y: 0, width: imgW, height: imgH }
    const [short, long] = SIZES[size]
    const [pw, ph] = imgW > imgH ? [long, short] : [short, long]
    const scale = Math.min((pw - 2 * margin) / imgW, (ph - 2 * margin) / imgH)
    const width = imgW * scale
    const height = imgH * scale
    return { page: [pw, ph] as [number, number], x: (pw - width) / 2, y: (ph - height) / 2, width, height }
}
