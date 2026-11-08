import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist"
import { sampleColors, toHex } from "@/lib/cad/color"
import { detectPixels, type PixelResult } from "@/lib/cad/detect"
import { boundsOf, dist, padBox, type Box, type Pt } from "@/lib/cad/geometry"
import { mergeTextItems, placedItems, runCorners, type RawTextItem, type TextRun } from "@/lib/cad/text-runs"
import { budgetScale, frameMapper, viewportTransform, type PageFrame } from "@/lib/cad/viewport"
import { abortError, isAbort, yieldToMain, type PageWorker } from "./engine"
import type { PageImage, PageModel, Region } from "./types"

/** Helvetica cap height as a fraction of the font size (SHX boxes measure caps). */
const CAP = 0.72

type Rendered = { page: PDFPageProxy; frame: PageFrame; width: number; height: number; scale: number; canvas: HTMLCanvasElement }
type PageText = { raws: RawTextItem[]; runs: TextRun[]; styles: Record<string, { fontFamily?: string }>; boxesPx: Box[] }

export const release = (c: HTMLCanvasElement) => {
    c.width = 0
    c.height = 0
}

/** Renders one page with pdf.js within the pixel budget. Aborting cancels the render. */
async function renderPage(pdf: PDFDocumentProxy, pageNo: number, budget: number, maxScale: number, signal: AbortSignal): Promise<Rendered> {
    const page = await pdf.getPage(pageNo)
    if (signal.aborted) throw abortError()
    const frame: PageFrame = {
        view: [page.view[0], page.view[1], page.view[2], page.view[3]],
        rotate: page.rotate,
        userUnit: page.userUnit || 1,
    }
    const vp1 = page.getViewport({ scale: 1 })
    const ours = viewportTransform(frame, 1).m
    if (vp1.transform.some((v: number, i: number) => Math.abs(v - ours[i]) > 0.01))
        console.warn("AutoCAD editor: page frame differs from pdf.js viewport", vp1.transform, ours)

    const scale = budgetScale(vp1.width, vp1.height, budget, maxScale)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.floor(viewport.width))
    canvas.height = Math.max(1, Math.floor(viewport.height))
    // No willReadFrequently: it forces a CPU canvas and dense drawings render far slower.
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const task = page.render({ canvas, viewport })
    const onAbort = () => task.cancel()
    signal.addEventListener("abort", onAbort)
    try {
        await task.promise
    } catch (e) {
        release(canvas)
        throw signal.aborted ? abortError() : e
    } finally {
        signal.removeEventListener("abort", onAbort)
    }
    return { page, frame, width: vp1.width, height: vp1.height, scale, canvas }
}

/** Real text, merged into lines, with each line's box in canvas pixels. */
async function readText(r: Rendered): Promise<PageText> {
    const tc = await r.page.getTextContent()
    const raws = (tc.items as Array<Partial<RawTextItem>>).filter((it): it is RawTextItem => typeof it.str === "string")
    const runs = mergeTextItems(raws)
    const map = frameMapper(r.frame)
    const boxesPx = runs.map((run) => boundsOf(runCorners(run).map((p) => map.toDisplay(p.x, p.y)).map((p) => ({ x: p.x * r.scale, y: p.y * r.scale }))))
    return { raws, runs, styles: tc.styles as PageText["styles"], boxesPx }
}

function baseModel(key: string, r: Rendered): PageModel {
    return { key, width: r.width, height: r.height, frame: r.frame, regions: [], items: [], textCount: 0, shxCount: 0, analyzed: false }
}

/** Editable regions from the text lines and the pixel results. Regions are in display space. */
function buildModel(key: string, r: Rendered, text: PageText, px: PixelResult): PageModel {
    const { frame, scale } = r
    const map = frameMapper(frame)
    const regions: Region[] = []
    text.runs.forEach((run, k) => {
        // Mirrored glyphs are rare in CAD; they stay masked from SHX detection but aren't editable.
        if (run.mirrored) return
        const cd = runCorners(run).map((p) => map.toDisplay(p.x, p.y))
        const { ink, bg } = px.textColors[k]
        const fam = text.styles[run.fontName ?? ""]?.fontFamily ?? ""
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
    const unit = frame.userUnit || 1
    px.groups.forEach((g, k) => {
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
            color: toHex(g.ink ?? { r: 0, g: 0, b: 0 }),
            paper: toHex(g.bg),
            family: "sans",
        })
    })
    return {
        ...baseModel(key, r),
        regions,
        items: placedItems(text.raws, text.runs, (_run, k) => `t${k}`),
        textCount,
        shxCount: regions.length - textCount,
        analyzed: true,
    }
}

export type LoadOptions = {
    budget: number
    maxScale: number
    /** False when the page was analysed before and only its image needs rendering again. */
    analyse: boolean
    key: string
    signal: AbortSignal
    worker: PageWorker | null
    /**
     * The rendered canvas, to show at once while its PNG encodes. Return true to take it
     * over (the caller frees it once the PNG shows); false and it's freed here.
     */
    onPreview?: (canvas: HTMLCanvasElement, base: PageModel) => boolean
    /** The page image is ready (shown before analysis finishes). `base` is a model without regions. */
    onImage: (img: PageImage, base: PageModel) => void
    /** Status for the progress bar; `done` is 0..1, or null while it can't be measured. */
    onStatus: (label: string, done: number | null) => void
}

/**
 * Renders a page and, when asked, finds its editable text: real text (merged into
 * lines, any angle) and SHX text drawn as strokes, with the ink and paper colour of
 * each. The image arrives first through `onImage` (the PNG encodes in the background
 * while text is found); the pixel work runs in a worker, or in yielding slices on the
 * main thread where a worker can't do it. Returns the analysed model, or null when
 * `analyse` is false.
 */
export async function loadPage(pdf: PDFDocumentProxy, pageNo: number, o: LoadOptions): Promise<PageModel | null> {
    o.onStatus(`Rendering page ${pageNo}...`, null)
    const r = await renderPage(pdf, pageNo, o.budget, o.maxScale, o.signal)
    const { canvas } = r
    const W = canvas.width
    const H = canvas.height
    const textP = o.analyse ? readText(r) : null
    textP?.catch(() => {})
    // toBlob snapshots the canvas now and encodes in the background.
    const blobP = new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not encode the page image"))), "image/png"),
    )
    // Pixels for detection, taken before the canvas is freed: a GPU copy for the worker,
    // or the raw pixels here when there's no worker.
    let bitmap: ImageBitmap | null = null
    let rgba: Uint8ClampedArray | null = null
    if (textP) {
        if (o.worker?.available) bitmap = await createImageBitmap(canvas).catch(() => null)
        if (!bitmap) rgba = canvas.getContext("2d")!.getImageData(0, 0, W, H).data
    }
    // toBlob and createImageBitmap copied the pixels when called, so the canvas itself can
    // go straight on screen: slow devices see the drawing before its PNG is ready.
    canvas.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none"
    const handedOver = !o.signal.aborted && !!o.onPreview?.(canvas, baseModel(o.key, r))
    const shown = blobP.then((blob) => {
        if (!handedOver) release(canvas)
        if (o.signal.aborted) return
        o.onImage({ url: URL.createObjectURL(blob), scale: r.scale, mp: (W * H) / 1e6 }, baseModel(o.key, r))
    })
    // Awaited below; this only stops an "unhandled rejection" if detection is cancelled first.
    shown.catch(() => {})
    try {
        if (!textP) {
            await shown
            return null
        }
        const text = await textP
        const label = `Finding text on page ${pageNo}...`
        o.onStatus(label, 0)
        let px: PixelResult | null = null
        if (bitmap && o.worker) {
            try {
                px = await o.worker.run(bitmap, { scale: r.scale, textBoxes: text.boxesPx }, o.signal, (done) => o.onStatus(label, done))
            } catch (e) {
                if (isAbort(e) || o.signal.aborted) throw abortError()
                console.warn("AutoCAD editor: page worker failed, using the main thread", e)
                o.worker.markBroken()
            }
        }
        if (!px) {
            if (!rgba) {
                // The worker failed after the canvas was handed over: render the pixels again.
                const again = await renderPage(pdf, pageNo, o.budget, o.maxScale, o.signal)
                rgba = again.canvas.getContext("2d")!.getImageData(0, 0, W, H).data
                release(again.canvas)
            }
            px = await detectPixels(rgba, W, H, {
                scale: r.scale,
                textBoxes: text.boxesPx,
                slice: 250_000,
                pause: async (done) => {
                    o.onStatus(label, done)
                    await yieldToMain()
                    if (o.signal.aborted) throw abortError()
                },
            })
        }
        await shown
        if (o.signal.aborted) throw abortError()
        return buildModel(o.key, r, text, px)
    } finally {
        r.page.cleanup()
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
export async function sampleRegionColors(image: PageImage | undefined, box: Box): Promise<{ color: string; paper: string }> {
    const fallback = { color: "#000000", paper: "#ffffff" }
    if (!image) return fallback
    try {
        const im = new Image()
        im.src = image.url
        await im.decode()
        const s = image.scale
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
