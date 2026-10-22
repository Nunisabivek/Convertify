/** Output quality for tools that render PDF pages to images (PDF to JPG, PDF to PNG). */
export const RENDER_QUALITIES = [
    { id: "standard", label: "Standard", dpi: 150, jpeg: 0.85, hint: "Small files, sharp on screen" },
    { id: "high", label: "High", dpi: 220, jpeg: 0.92, hint: "Crisp text when zoomed or on slides" },
    { id: "max", label: "Maximum", dpi: 300, jpeg: 0.95, hint: "Print quality, largest files" },
] as const

export type RenderQuality = (typeof RENDER_QUALITIES)[number]

// Browsers refuse canvases much past ~16k px a side (less on phones); 8000 keeps A0 posters working.
const MAX_SIDE_PX = 8000

/**
 * pdf.js viewport scale for a target DPI (PDF units are 1/72 inch), capped so a large
 * page can't exceed the canvas limit and fail the whole conversion.
 */
export function renderScale(dpi: number, pageWidthPt: number, pageHeightPt: number): number {
    return Math.min(dpi / 72, MAX_SIDE_PX / Math.max(pageWidthPt, pageHeightPt))
}
