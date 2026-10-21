type Box = { x: number; y: number; width: number; height: number }

/**
 * A page as the reader sees it: its displayed size after /Rotate, and a mapper from
 * displayed coordinates (origin bottom-left of the visible page) to PDF user space.
 * Draw text with `rotate: degrees(frame.rotate)` so it reads upright on screen.
 * Without this, page numbers and crops land sideways on rotated (often scanned)
 * pages, and off-target when the visible box doesn't start at 0,0.
 */
export function visualFrame(rotation: number, box: Box) {
    const r = ((Math.round(rotation / 90) * 90) % 360 + 360) % 360
    const { x, y, width: W, height: H } = box
    const turned = r === 90 || r === 270
    const toPage = (vx: number, vy: number) =>
        r === 90 ? { x: x + W - vy, y: y + vx }
            : r === 180 ? { x: x + W - vx, y: y + H - vy }
                : r === 270 ? { x: x + vy, y: y + H - vx }
                    : { x: x + vx, y: y + vy }
    return { width: turned ? H : W, height: turned ? W : H, rotate: r, toPage }
}

/** A rectangle given in displayed coordinates, as a PDF-space box (for setCropBox). */
export function visualRectToPage(frame: ReturnType<typeof visualFrame>, left: number, bottom: number, width: number, height: number): Box {
    const a = frame.toPage(left, bottom)
    const b = frame.toPage(left + width, bottom + height)
    return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), width: Math.abs(b.x - a.x), height: Math.abs(b.y - a.y) }
}
