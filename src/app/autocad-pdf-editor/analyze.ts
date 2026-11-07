import type { PDFDocumentProxy } from "pdfjs-dist"
import { sampleColors, toHex } from "@/lib/cad/color"
import { boundsOf, dist, padBox, type Box, type Pt } from "@/lib/cad/geometry"
import { binarize, dropOverlapping, findComponents, groupGlyphs, maskBoxes } from "@/lib/cad/shx-detect"
import { mergeTextItems, placedItems, runCorners, type RawTextItem } from "@/lib/cad/text-runs"
import { budgetScale, frameMapper, viewportTransform, type PageFrame } from "@/lib/cad/viewport"
import type { PageModel, Region } from "./types"

/** Helvetica cap height as a fraction of the font size (SHX boxes measure caps). */
const CAP = 0.72
const yieldToUi = () => new Promise<void>((r) => setTimeout(r, 0))

type Status = (status: string, pct: number) => void

/**
 * Renders one page within a pixel budget and finds its editable text: real text
 * (merged into lines, any angle) and SHX text drawn as strokes (horizontal and
 * vertical), with the ink and paper colour of each. Regions are in display space.
 */
export async function analyzePage(
    pdf: PDFDocumentProxy,
    pageNo: number,
    budget: number,
    onStatus: Status = () => {},
): Promise<PageModel> {
    const page = await pdf.getPage(pageNo)
    const frame: PageFrame = {
        view: [page.view[0], page.view[1], page.view[2], page.view[3]],
        rotate: page.rotate,
        userUnit: page.userUnit || 1,
    }
    const map = frameMapper(frame)
    const vp1 = page.getViewport({ scale: 1 })
    const ours = viewportTransform(frame, 1).m
    if (vp1.transform.some((v: number, i: number) => Math.abs(v - ours[i]) > 0.01))
        console.warn("AutoCAD editor: page frame differs from pdf.js viewport", vp1.transform, ours)

    const scale = budgetScale(vp1.width, vp1.height, budget)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.floor(viewport.width))
    canvas.height = Math.max(1, Math.floor(viewport.height))
    const W = canvas.width
    const H = canvas.height
    // No willReadFrequently: it forces a CPU canvas and dense drawings render far slower.
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, W, H)
    onStatus(`Rendering page ${pageNo}...`, 20)
    await page.render({ canvas, viewport }).promise

    // Encode off the main thread while the pixels are read for detection.
    const blob = new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not encode the page image"))), "image/png"),
    )
    onStatus(`Reading text on page ${pageNo}...`, 50)
    const tc = await page.getTextContent()
    const raws = (tc.items as Array<Partial<RawTextItem>>).filter((it): it is RawTextItem => typeof it.str === "string")
    const styles = tc.styles as Record<string, { fontFamily?: string }>
    const runs = mergeTextItems(raws)
    const img = ctx.getImageData(0, 0, W, H).data

    const regions: Region[] = []
    const textBoxesPx: Box[] = []
    runs.forEach((run, k) => {
        const cu = runCorners(run)
        const cd = cu.map((p) => map.toDisplay(p.x, p.y))
        const px = boundsOf(cd.map((p) => ({ x: p.x * scale, y: p.y * scale })))
        textBoxesPx.push(px)
        // Mirrored glyphs are rare in CAD; they stay masked from SHX detection but aren't editable.
        if (run.mirrored) return
        const { ink, bg } = sampleColors(img, W, H, px)
        const fam = styles[run.fontName ?? ""]?.fontFamily ?? ""
        regions.push({
            id: `t${k}`,
            kind: "text",
            originalText: run.text,
            box: { x: cd[3].x, y: cd[3].y, w: dist(cd[0], cd[1]), h: dist(cd[0], cd[3]), angle: map.displayAngleOf(run.angle) },
            place: { origin: run.origin, angle: run.angle, size: run.size, width: run.width, cover: runCorners(run, 0.15) },
            color: toHex(ink ?? { r: 0, g: 0, b: 0 }),
            paper: toHex(bg),
            family: /mono/i.test(fam) ? "mono" : /serif/i.test(fam) && !/sans/i.test(fam) ? "serif" : "sans",
        })
    })
    const textCount = regions.length

    onStatus(`Looking for SHX text on page ${pageNo}...`, 70)
    await yieldToUi()
    const binary = binarize(img, W, H)
    maskBoxes(binary, W, H, textBoxesPx.map((b) => padBox(b, 2)))
    const comps = await findComponents(binary, W, H, yieldToUi, 60 * scale * 1.4)
    const groups = dropOverlapping(groupGlyphs(comps, { scale }), textBoxesPx, 0.3, 2 * scale)
    const unit = frame.userUnit || 1
    groups.forEach((g, k) => {
        const b = { x: g.x / scale, y: g.y / scale, w: g.w / scale, h: g.h / scale }
        // Vertical SHX text (vertical dimensions) reads bottom to top, glyph tops to the left.
        const start: Pt = g.vertical ? { x: b.x + b.w, y: b.y + b.h } : { x: b.x, y: b.y + b.h }
        const dir: Pt = g.vertical ? { x: 0, y: -1 } : { x: 1, y: 0 }
        const along = g.vertical ? b.h : b.w
        const cap = g.vertical ? b.w : b.h
        const pad = Math.max(1, 0.18 * cap)
        const cover = padBox(b, pad)
        const coverPts = [
            { x: cover.x, y: cover.y },
            { x: cover.x + cover.w, y: cover.y },
            { x: cover.x + cover.w, y: cover.y + cover.h },
            { x: cover.x, y: cover.y + cover.h },
        ].map((p) => map.toUser(p.x, p.y))
        const { ink, bg } = sampleColors(img, W, H, g)
        regions.push({
            id: `s${k}`,
            kind: "shx",
            box: g.vertical ? { x: b.x, y: b.y + b.h, w: b.h, h: b.w, angle: -90 } : { x: b.x, y: b.y, w: b.w, h: b.h, angle: 0 },
            place: {
                origin: map.toUser(start.x, start.y),
                angle: map.userAngleOf(dir.x, dir.y),
                size: cap / CAP / unit,
                width: along / unit,
                cover: coverPts,
            },
            color: toHex(ink ?? { r: 0, g: 0, b: 0 }),
            paper: toHex(bg),
            family: "sans",
        })
    })

    const url = URL.createObjectURL(await blob)
    canvas.width = 0
    canvas.height = 0
    page.cleanup()
    onStatus("Done", 100)
    return {
        url,
        renderScale: scale,
        width: vp1.width,
        height: vp1.height,
        frame,
        regions,
        items: placedItems(raws, runs, (_run, k) => `t${k}`),
        textCount,
        shxCount: regions.length - textCount,
    }
}

/**
 * A region the user drew by hand around text the detector missed (display space).
 * Colours are sampled from the page image later; the replacement sits on a
 * baseline near the bottom of the box.
 */
export function manualRegion(model: PageModel, id: string, x: number, y: number, w: number, h: number, color: string, paper: string): Region {
    const map = frameMapper(model.frame)
    const unit = model.frame.userUnit || 1
    const size = (h * 0.72) / unit
    const cover = [
        { x, y },
        { x: x + w, y },
        { x: x + w, y: y + h },
        { x, y: y + h },
    ].map((p) => map.toUser(p.x, p.y))
    return {
        id,
        kind: "manual",
        box: { x, y, w, h, angle: 0 },
        place: { origin: map.toUser(x + h * 0.08, y + h * 0.8), angle: map.userAngleOf(1, 0), size, width: w / unit, cover },
        color,
        paper,
        family: "sans",
    }
}

/** Ink and paper colour inside a display-space box, read back from the page image. */
export async function sampleRegionColors(model: PageModel, box: Box): Promise<{ color: string; paper: string }> {
    const fallback = { color: "#000000", paper: "#ffffff" }
    try {
        const im = new Image()
        im.src = model.url
        await im.decode()
        const s = model.renderScale
        const px = { x: Math.floor(box.x * s), y: Math.floor(box.y * s), w: Math.max(1, Math.ceil(box.w * s)), h: Math.max(1, Math.ceil(box.h * s)) }
        const c = document.createElement("canvas")
        c.width = px.w
        c.height = px.h
        const cx = c.getContext("2d")!
        cx.drawImage(im, px.x, px.y, px.w, px.h, 0, 0, px.w, px.h)
        const { ink, bg } = sampleColors(cx.getImageData(0, 0, px.w, px.h).data, px.w, px.h, { x: 0, y: 0, w: px.w, h: px.h })
        return { color: toHex(ink ?? { r: 0, g: 0, b: 0 }), paper: toHex(bg) }
    } catch {
        return fallback
    }
}
