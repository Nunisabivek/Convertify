"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FileUploader } from "@/components/tools/file-uploader"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { Button } from "@/components/ui/button"
import {
    Ruler,
    Download,
    ChevronLeft,
    ChevronRight,
    Undo2,
    Plus,
    Check,
    X,
    AlertTriangle,
    ZoomIn,
    ZoomOut,
    Maximize2,
    MoveHorizontal,
    Trash2,
    RotateCcw,
} from "lucide-react"

type Step = "upload" | "analyzing" | "editing" | "exporting" | "done"

type Cluster = {
    id: string
    x: number
    y: number
    w: number
    h: number
    originalText?: string
    rotation?: number
    // For real-text clusters: the original glyph baseline and font size in PDF
    // points, captured from getTextContent. Used to place the replacement at the
    // exact original position and size (instead of guessing from the bbox).
    pdfBaselineX?: number
    pdfBaselineY?: number
    fontSizePt?: number
}

type PageData = {
    width: number
    height: number
    canvasDataUrl: string
    clusters: Cluster[]
    scale: number
}

const RENDER_SCALE = 2

function findConnectedComponents(binary: Uint8Array, w: number, h: number) {
    const visited = new Uint8Array(w * h)
    const components: Array<{ minX: number; minY: number; maxX: number; maxY: number; count: number }> = []
    const stack: number[] = []

    for (let i = 0; i < binary.length; i++) {
        if (!binary[i] || visited[i]) continue
        let minX = w
        let minY = h
        let maxX = 0
        let maxY = 0
        let count = 0
        stack.length = 0
        // Mark visited on PUSH (not pop) so each pixel enters the stack at most
        // once. Avoids the 4x stack churn that made large connected components
        // (e.g. a building's full wall outline) extremely slow.
        visited[i] = 1
        stack.push(i)
        while (stack.length) {
            const px = stack.pop()!
            const x = px % w
            const y = (px - x) / w
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            if (y < minY) minY = y
            if (y > maxY) maxY = y
            count++
            let n: number
            if (x > 0) { n = px - 1; if (binary[n] && !visited[n]) { visited[n] = 1; stack.push(n) } }
            if (x < w - 1) { n = px + 1; if (binary[n] && !visited[n]) { visited[n] = 1; stack.push(n) } }
            if (y > 0) { n = px - w; if (binary[n] && !visited[n]) { visited[n] = 1; stack.push(n) } }
            if (y < h - 1) { n = px + w; if (binary[n] && !visited[n]) { visited[n] = 1; stack.push(n) } }
        }
        components.push({ minX, minY, maxX, maxY, count })
    }
    return components
}

function clusterComponents(
    comps: Array<{ minX: number; minY: number; maxX: number; maxY: number; count: number }>,
    pageWidth: number,
    pageHeight: number,
) {
    const minStrokePx = 2
    const maxStrokePx = Math.min(pageWidth, pageHeight) * 0.05
    const candidates = comps.filter((c) => {
        const w = c.maxX - c.minX
        const h = c.maxY - c.minY
        const longest = Math.max(w, h)
        return longest >= minStrokePx && longest <= maxStrokePx && c.count >= 2
    })

    // Asymmetric proximity: generous horizontally so letters/words on the same
    // line merge into one editable region, but tight vertically so separate text
    // lines stay as distinct clickable regions (avoids merging stacked lines like
    // a title block into one blob).
    const proximityPadX = 8 * RENDER_SCALE
    const proximityPadY = 1.5 * RENDER_SCALE
    const parent = candidates.map((_, i) => i)
    const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])))
    const union = (a: number, b: number) => {
        const ra = find(a)
        const rb = find(b)
        if (ra !== rb) parent[ra] = rb
    }

    const grid = new Map<string, number[]>()
    const cellSize = 40 * RENDER_SCALE
    candidates.forEach((c, idx) => {
        const cx = Math.floor(((c.minX + c.maxX) / 2) / cellSize)
        const cy = Math.floor(((c.minY + c.maxY) / 2) / cellSize)
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const key = `${cx + dx}:${cy + dy}`
                if (!grid.has(key)) grid.set(key, [])
                grid.get(key)!.push(idx)
            }
        }
    })

    const seen = new Set<string>()
    candidates.forEach((c, i) => {
        const cx = Math.floor(((c.minX + c.maxX) / 2) / cellSize)
        const cy = Math.floor(((c.minY + c.maxY) / 2) / cellSize)
        const key = `${cx}:${cy}`
        if (seen.has(key + ":" + i)) return
        const neighbors = grid.get(key) || []
        for (const j of neighbors) {
            if (i === j) continue
            const a = c
            const b = candidates[j]
            const overlapX = a.minX - proximityPadX <= b.maxX + proximityPadX && b.minX - proximityPadX <= a.maxX + proximityPadX
            const overlapY = a.minY - proximityPadY <= b.maxY + proximityPadY && b.minY - proximityPadY <= a.maxY + proximityPadY
            if (overlapX && overlapY) union(i, j)
        }
    })

    const groups = new Map<number, { minX: number; minY: number; maxX: number; maxY: number; count: number }>()
    candidates.forEach((c, i) => {
        const root = find(i)
        const g = groups.get(root)
        if (!g) {
            groups.set(root, { minX: c.minX, minY: c.minY, maxX: c.maxX, maxY: c.maxY, count: 1 })
        } else {
            if (c.minX < g.minX) g.minX = c.minX
            if (c.minY < g.minY) g.minY = c.minY
            if (c.maxX > g.maxX) g.maxX = c.maxX
            if (c.maxY > g.maxY) g.maxY = c.maxY
            g.count++
        }
    })

    const minTextHeightPx = 6 * RENDER_SCALE
    const maxTextHeightPx = 80 * RENDER_SCALE
    const result: Cluster[] = []
    let idx = 0
    for (const g of groups.values()) {
        const w = g.maxX - g.minX
        const h = g.maxY - g.minY
        if (h < minTextHeightPx || h > maxTextHeightPx) continue
        if (w < minTextHeightPx * 0.5) continue
        if (w / h > 60) continue
        if (g.count < 3) continue
        result.push({
            id: `c${idx++}`,
            x: g.minX,
            y: g.minY,
            w,
            h,
        })
    }
    return result
}

export default function AutocadPdfEditorClient() {
    const [step, setStep] = useState<Step>("upload")
    const [file, setFile] = useState<File | null>(null)
    const [progress, setProgress] = useState(0)
    const [progressStatus, setProgressStatus] = useState("Reading file...")
    const [numPages, setNumPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageData, setPageData] = useState<Map<number, PageData>>(new Map())
    const [edits, setEdits] = useState<Map<string, string>>(new Map())
    // Clusters the user chose to delete entirely (remove original, write nothing).
    const [deletedKeys, setDeletedKeys] = useState<Set<string>>(new Set())
    const [activeClusterKey, setActiveClusterKey] = useState<string | null>(null)
    const [draftText, setDraftText] = useState("")
    const [exportUrl, setExportUrl] = useState<string | null>(null)
    const [drawMode, setDrawMode] = useState(false)
    const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
    const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const [viewportHeight, setViewportHeight] = useState(0)
    const [zoomMode, setZoomMode] = useState<"fit-page" | "fit-width" | number>("fit-page")
    const [autocadMode, setAutocadMode] = useState(false)

    const pdfBytesRef = useRef<ArrayBuffer | null>(null)
    const canvasWrapperRef = useRef<HTMLDivElement>(null)
    const toolbarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const update = () => {
            if (canvasWrapperRef.current) setContainerWidth(canvasWrapperRef.current.clientWidth)
            setViewportHeight(window.innerHeight)
        }
        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [step])

    // When entering edit mode, scroll the toolbar to just below the site header
    // so the canvas occupies the full remaining viewport — no page scroll needed
    // to see the whole drawing in fit-page mode.
    useEffect(() => {
        if (step !== "editing") return
        const id = requestAnimationFrame(() => {
            if (!toolbarRef.current) return
            const rect = toolbarRef.current.getBoundingClientRect()
            const headerOffset = 72
            const targetY = window.scrollY + rect.top - headerOffset
            if (Math.abs(window.scrollY - targetY) > 4) {
                window.scrollTo({ top: targetY, behavior: "smooth" })
            }
        })
        return () => cancelAnimationFrame(id)
    }, [step, currentPage])

    const handleAnalyze = useCallback(async (selectedFile: File) => {
        setFile(selectedFile)
        setStep("analyzing")
        setProgress(5)
        setProgressStatus("Reading file...")

        try {
            const buffer = await selectedFile.arrayBuffer()
            pdfBytesRef.current = buffer.slice(0)

            const pdfjsLib = await import("pdfjs-dist")
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

            const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise
            setNumPages(pdf.numPages)
            setProgress(15)

            const newPageData = new Map<number, PageData>()
            for (let i = 1; i <= pdf.numPages; i++) {
                setProgressStatus(`Analyzing page ${i} of ${pdf.numPages}...`)
                const baseShare = 20 + ((i - 1) / pdf.numPages) * 75
                setProgress(baseShare)

                const page = await pdf.getPage(i)
                const viewport = page.getViewport({ scale: RENDER_SCALE })
                const canvas = document.createElement("canvas")
                canvas.width = Math.floor(viewport.width)
                canvas.height = Math.floor(viewport.height)
                // NOTE: do NOT pass willReadFrequently — it forces a slow CPU
                // canvas backend; rendering a dense AutoCAD vector drawing on CPU
                // can take 30s+. GPU rendering is far faster; the rare pixel
                // fallback reads pixels only once.
                const ctx = canvas.getContext("2d")!
                ctx.fillStyle = "#ffffff"
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                await page.render({ canvas, viewport }).promise

                let clusters: Cluster[] = []

                // PRIMARY: extract clickable regions from getTextContent() — works for most
                // AutoCAD-exported PDFs whose text is stored as positioned glyphs (even when
                // Acrobat displays them as non-selectable). Each item gives us original text.
                const tc = await page.getTextContent()
                let textIdx = 0
                for (const raw of tc.items as Array<{
                    str: string
                    transform: number[]
                    width: number
                    height: number
                }>) {
                    if (!raw.str || raw.str.trim().length === 0) continue
                    if (!raw.transform || raw.transform.length < 6) continue

                    const [a, b, c, d, e, f] = raw.transform
                    const w = raw.width || 0
                    const h = raw.height || Math.max(Math.abs(d), Math.abs(b)) || 0
                    if (w === 0 || h === 0) continue

                    // width/height in the text item are already in PDF page units.
                    // We need the UNIT direction vectors from the transform to know
                    // which way the glyph baseline and ascent point (handles rotated text).
                    const baselineLen = Math.sqrt(a * a + b * b) || 1
                    const ascentLen = Math.sqrt(c * c + d * d) || 1
                    const ubx = a / baselineLen
                    const uby = b / baselineLen
                    const ucx = c / ascentLen
                    const ucy = d / ascentLen

                    const corners = [
                        [e, f],
                        [e + w * ubx, f + w * uby],
                        [e + w * ubx + h * ucx, f + w * uby + h * ucy],
                        [e + h * ucx, f + h * ucy],
                    ]
                    const canvasCorners = corners.map(([px, py]) =>
                        viewport.convertToViewportPoint(px, py),
                    )
                    let minX = Infinity
                    let minY = Infinity
                    let maxX = -Infinity
                    let maxY = -Infinity
                    for (const [cx, cy] of canvasCorners) {
                        if (cx < minX) minX = cx
                        if (cy < minY) minY = cy
                        if (cx > maxX) maxX = cx
                        if (cy > maxY) maxY = cy
                    }

                    // Detect rotation: a=0,d=0 means rotated 90° (typical CAD vertical dimensions)
                    const isRotated = Math.abs(a) < 0.01 && Math.abs(d) < 0.01
                    clusters.push({
                        id: `t${textIdx++}`,
                        x: minX,
                        y: minY,
                        w: maxX - minX,
                        h: maxY - minY,
                        originalText: raw.str,
                        rotation: isRotated ? 90 : 0,
                        // Original glyph baseline (e, f) and font size in PDF points.
                        // ascentLen is the magnitude of the ascent vector = the
                        // effective font size. Used to place the replacement exactly.
                        pdfBaselineX: e,
                        pdfBaselineY: f,
                        fontSizePt: ascentLen,
                    })
                }

                // FALLBACK: if no text items found, fall back to pixel clustering for SHX-only PDFs
                if (clusters.length === 0) {
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                    const binary = new Uint8Array(canvas.width * canvas.height)
                    for (let p = 0, j = 0; p < imageData.data.length; p += 4, j++) {
                        const luminance = (imageData.data[p] + imageData.data[p + 1] + imageData.data[p + 2]) / 3
                        binary[j] = luminance < 180 ? 1 : 0
                    }
                    const comps = findConnectedComponents(binary, canvas.width, canvas.height)
                    clusters = clusterComponents(comps, canvas.width, canvas.height)
                }

                newPageData.set(i, {
                    width: canvas.width,
                    height: canvas.height,
                    canvasDataUrl: canvas.toDataURL("image/png"),
                    clusters,
                    scale: RENDER_SCALE,
                })
            }

            setPageData(newPageData)
            setProgress(100)
            setProgressStatus("Done")
            setStep("editing")
        } catch (e) {
            console.error(e)
            alert("Failed to analyze PDF. Make sure it's a valid AutoCAD-exported PDF.")
            setStep("upload")
        }
    }, [])

    const clusterKey = (page: number, id: string) => `p${page}:${id}`

    const openCluster = (page: number, c: Cluster) => {
        const key = clusterKey(page, c.id)
        setActiveClusterKey(key)
        // If the region is already marked deleted, start with an empty draft;
        // otherwise pre-fill with any pending edit or the detected original text.
        setDraftText(deletedKeys.has(key) ? "" : edits.get(key) ?? c.originalText ?? "")
    }

    const saveDraft = () => {
        if (!activeClusterKey) return
        // Typing text = replace. Saving with empty text just cancels (use the
        // Delete button to blank a region entirely).
        if (draftText.trim() !== "") {
            const next = new Map(edits)
            next.set(activeClusterKey, draftText)
            setEdits(next)
            // Typing replacement text un-deletes the region.
            if (deletedKeys.has(activeClusterKey)) {
                const d = new Set(deletedKeys)
                d.delete(activeClusterKey)
                setDeletedKeys(d)
            }
        }
        setActiveClusterKey(null)
        setDraftText("")
    }

    // Delete a region's text completely (remove original, write nothing).
    const deleteActiveCluster = () => {
        if (!activeClusterKey) return
        const next = new Map(edits)
        next.delete(activeClusterKey)
        setEdits(next)
        const d = new Set(deletedKeys)
        d.add(activeClusterKey)
        setDeletedKeys(d)
        setActiveClusterKey(null)
        setDraftText("")
    }

    const cancelDraft = () => {
        setActiveClusterKey(null)
        setDraftText("")
    }

    const removeEdit = (key: string) => {
        const next = new Map(edits)
        next.delete(key)
        setEdits(next)
    }

    const restoreDeleted = (key: string) => {
        const d = new Set(deletedKeys)
        d.delete(key)
        setDeletedKeys(d)
    }

    const addManualCluster = (page: number, x: number, y: number, w: number, h: number) => {
        const pd = pageData.get(page)
        if (!pd) return
        const id = `m${Date.now()}`
        const newClusters = [...pd.clusters, { id, x, y, w, h }]
        const newPageData = new Map(pageData)
        newPageData.set(page, { ...pd, clusters: newClusters })
        setPageData(newPageData)
        openCluster(page, { id, x, y, w, h })
    }

    const handleExport = async () => {
        if (!pdfBytesRef.current || (edits.size === 0 && deletedKeys.size === 0)) {
            alert("No changes to apply. Click a region to edit or delete its text first.")
            return
        }
        setStep("exporting")
        setProgress(10)
        setProgressStatus("Loading PDF...")

        try {
            const { PDFDocument, rgb, StandardFonts, PDFName, decodePDFRawStream, degrees } = await import("pdf-lib")
            const pdfDoc = await PDFDocument.load(pdfBytesRef.current.slice(0))
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const pages = pdfDoc.getPages()
            const ctx = pdfDoc.context

            setProgress(30)
            setProgressStatus("Applying edits...")

            for (let i = 1; i <= numPages; i++) {
                const pd = pageData.get(i)
                const pdfPage = pages[i - 1]
                if (!pd || !pdfPage) continue

                const pageHeight = pdfPage.getHeight()
                const pageWidth = pdfPage.getWidth()
                const scaleX = pageWidth / pd.width
                const scaleY = pageHeight / pd.height

                // Clusters with a replacement, OR marked for full deletion.
                // Both need the original removed; deletions just draw nothing.
                const editedClusters = pd.clusters
                    .map((c) => {
                        const key = clusterKey(i, c.id)
                        return { c, key, newText: edits.get(key), isDeleted: deletedKeys.has(key) }
                    })
                    .filter((x) => x.newText || x.isDeleted)
                if (editedClusters.length === 0) continue

                // Each affected cluster's bounding box in PDF coordinates.
                const boxes = editedClusters.map(({ c, key }) => ({
                    key,
                    left: c.x * scaleX,
                    right: (c.x + c.w) * scaleX,
                    top: pageHeight - c.y * scaleY,
                    bottom: pageHeight - (c.y + c.h) * scaleY,
                }))

                // ---- Phase 1: surgically remove the ORIGINAL text from the
                // content stream for clusters that map to real PDF text blocks.
                // This gives a clean result in both PDF viewers and AutoCAD with
                // no overlap and no white-rectangle artifact. Clusters that are
                // pure vector (SHX) strokes won't match and fall back to Phase 2.
                const removedKeys = new Set<string>()
                try {
                    const Contents = pdfPage.node.Contents()
                    const streamObjs: unknown[] = []
                    if (Contents) {
                        if (Contents.constructor.name === "PDFArray") {
                            const arr = Contents as unknown as { size: () => number; get: (n: number) => never }
                            for (let k = 0; k < arr.size(); k++) streamObjs.push(ctx.lookup(arr.get(k)))
                        } else {
                            streamObjs.push(ctx.lookup(Contents as never))
                        }
                    }
                    let full = ""
                    for (const s of streamObjs) {
                        try {
                            full += new TextDecoder("latin1").decode(decodePDFRawStream(s as never).decode()) + "\n"
                        } catch {
                            /* skip undecodable stream */
                        }
                    }

                    // Extract the page CTM. AutoCAD exports use a single global
                    // uniform-scale transform; we only attempt removal in that
                    // safe case to avoid deleting the wrong text on complex PDFs.
                    const cmRe = /(-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+) cm/
                    const cm = full.match(cmRe)
                    let ctm: number[] | null = null
                    if (cm) {
                        const v = cm.slice(1, 7).map(Number)
                        if (v[1] === 0 && v[2] === 0 && Math.abs(v[0]) > 0 && Math.abs(v[3]) > 0) ctm = v
                    }

                    if (full && ctm) {
                        const [a, , , d, e, f] = ctm
                        const newFull = full.replace(/BT[\s\S]*?ET/g, (block) => {
                            const tm = block.match(/(-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+) Tm/)
                            if (!tm) return block
                            const te = +tm[5]
                            const tf = +tm[6]
                            const fx = a * te + e
                            const fy = d * tf + f
                            for (const box of boxes) {
                                const tolX = 4
                                // The text-block origin (fx, fy) is the glyph
                                // baseline-left. The baseline sits at/near the
                                // cluster's bottom edge. Keying the vertical match
                                // on the baseline (not the full cluster span) keeps
                                // us from catching the line directly above/below.
                                const lineH = Math.max(box.top - box.bottom, 4)
                                if (
                                    fx >= box.left - tolX &&
                                    fx <= box.right + tolX &&
                                    Math.abs(fy - box.bottom) <= lineH * 0.6
                                ) {
                                    removedKeys.add(box.key)
                                    return ""
                                }
                            }
                            return block
                        })
                        if (removedKeys.size > 0) {
                            const bytes = Uint8Array.from(newFull, (ch) => ch.charCodeAt(0))
                            const ref = ctx.register(ctx.stream(bytes))
                            pdfPage.node.set(PDFName.of("Contents"), ref)
                        }
                    }
                } catch (err) {
                    console.warn("Text removal skipped for page", i, err)
                }

                // ---- Phase 2: draw replacement text (skip for deletions). For
                // clusters whose original was removed in Phase 1, no cover is
                // needed. For unremoved (vector) clusters we draw a white cover in
                // standard mode — this is the only way to hide pure vector strokes.
                for (const { c, key, newText, isDeleted } of editedClusters) {
                    const wasRemoved = removedKeys.has(key)
                    const pdfX = c.x * scaleX
                    const pdfYTop = c.y * scaleY
                    const pdfW = c.w * scaleX
                    const pdfH = c.h * scaleY

                    if (!wasRemoved && !autocadMode) {
                        const padY = pdfH * 0.35
                        const padX = Math.max(pdfW * 0.05, 1.5)
                        pdfPage.drawRectangle({
                            x: pdfX - padX,
                            y: pageHeight - pdfYTop - pdfH - padY,
                            width: pdfW + padX * 2,
                            height: pdfH + padY * 2,
                            color: rgb(1, 1, 1),
                            borderWidth: 0,
                        })
                    }

                    // Deletions write nothing — the original is gone (or covered).
                    if (isDeleted) continue

                    if (c.fontSizePt && c.pdfBaselineX != null && c.pdfBaselineY != null) {
                        // Real-text cluster: place the replacement at the ORIGINAL
                        // glyph baseline and font size captured from getTextContent.
                        // Helvetica's cap height (~0.72·size) closely matches a
                        // typical embedded sans-serif at the same size — no guessing.
                        pdfPage.drawText(newText as string, {
                            x: c.pdfBaselineX,
                            y: c.pdfBaselineY,
                            size: c.fontSizePt,
                            font,
                            color: rgb(0, 0, 0),
                            ...(c.rotation === 90 ? { rotate: degrees(90) } : {}),
                        })
                    } else {
                        // Vector (SHX) fallback: the pixel-detected bbox height is the
                        // visible cap height, so scale up so Helvetica's cap matches.
                        const fontSize = pdfH * 1.38
                        pdfPage.drawText(newText as string, {
                            x: pdfX,
                            y: pageHeight - pdfYTop - pdfH,
                            size: fontSize,
                            font,
                            color: rgb(0, 0, 0),
                        })
                    }
                }
            }

            setProgress(80)
            setProgressStatus("Building PDF...")

            const out = await pdfDoc.save()
            const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)
            setExportUrl(url)
            setProgress(100)
            setStep("done")
        } catch (e) {
            console.error(e)
            alert("Failed to export. Please try again.")
            setStep("editing")
        }
    }

    // Return to the editor from the "done" screen WITHOUT discarding work —
    // all edits, deletions, page data and the loaded file stay in memory.
    const continueEditing = () => {
        if (exportUrl) URL.revokeObjectURL(exportUrl)
        setExportUrl(null)
        setStep("editing")
    }

    const reset = () => {
        if (exportUrl) URL.revokeObjectURL(exportUrl)
        setFile(null)
        setStep("upload")
        setNumPages(0)
        setCurrentPage(1)
        setPageData(new Map())
        setEdits(new Map())
        setDeletedKeys(new Set())
        setActiveClusterKey(null)
        setDraftText("")
        setExportUrl(null)
        setDrawMode(false)
        setDrawStart(null)
        setDrawEnd(null)
        setAutocadMode(false)
        pdfBytesRef.current = null
    }

    if (step === "analyzing" || step === "exporting") {
        return (
            <ProcessingWait
                progress={progress}
                title={step === "analyzing" ? "Analyzing AutoCAD PDF..." : "Building Edited PDF..."}
                status={progressStatus}
            />
        )
    }

    if (step === "upload") {
        return (
            <div className="container mx-auto max-w-4xl px-4">
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 mb-6 flex gap-3 text-sm">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <strong>How this differs from a normal PDF editor:</strong> AutoCAD exports SHX text as vector strokes (not real text). Standard editors can&apos;t touch them. We scan the strokes and let you click each text region to edit it.
                    </div>
                </div>
                <FileUploader
                    onFilesSelected={(f) => handleAnalyze(f[0])}
                    multiple={false}
                    accept={{ "application/pdf": [".pdf"] }}
                    fileTypeLabel="AutoCAD PDF"
                    iconType="pdf"
                />
                <div className="mt-6">
                    <AdBanner variant="rectangle" />
                </div>
            </div>
        )
    }

    if (step === "done" && exportUrl) {
        return (
            <div className="container mx-auto max-w-2xl py-12 px-4 text-center space-y-8">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
                    <Check className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold mb-2">Edited PDF Ready</h2>
                    <p className="text-slate-600">
                        Applied {edits.size} edit{edits.size === 1 ? "" : "s"}
                        {deletedKeys.size > 0 && ` and ${deletedKeys.size} deletion${deletedKeys.size === 1 ? "" : "s"}`}.
                        Your file is ready to download.
                    </p>
                </div>
                <a
                    href={exportUrl}
                    download={file ? file.name.replace(/\.pdf$/i, "") + "-edited.pdf" : "edited.pdf"}
                    className="inline-flex"
                >
                    <Button size="xl" className="text-lg px-8 py-6 h-auto rounded-xl">
                        <Download className="w-5 h-5 mr-2" /> Download Edited PDF
                    </Button>
                </a>

                <div className="text-left bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 flex gap-3 text-sm max-w-xl mx-auto">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        {autocadMode ? (
                            <>
                                <strong className="block mb-1">Exported in AutoCAD-friendly mode.</strong>
                                <span className="block">
                                    No white cover was drawn. When imported into AutoCAD (PDFIMPORT), there are no filled-rectangle artifacts. The original text strokes still come in alongside your new text — delete the originals manually in AutoCAD after import.
                                </span>
                            </>
                        ) : (
                            <>
                                <strong className="block mb-1">Sending this PDF to a colleague? It looks identical to the original.</strong>
                                <span className="block">
                                    <strong>Planning to re-import into AutoCAD?</strong> Tick &ldquo;AutoCAD-friendly mode&rdquo; in the editor next time. This export draws a white background behind replacement text, which AutoCAD&apos;s PDFIMPORT converts into visible filled SOLIDs on the dark canvas.
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="pt-4">
                    <AdBanner variant="rectangle" />
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                    <Button variant="outline" onClick={continueEditing}>
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Editing
                    </Button>
                    <Button variant="outline" onClick={reset}>
                        Edit Another File
                    </Button>
                </div>
                <p className="text-xs text-slate-400">
                    &ldquo;Back to Editing&rdquo; keeps all your current edits so you can make more changes.
                </p>
            </div>
        )
    }

    const pd = pageData.get(currentPage)
    if (!pd) return null

    // Reserve vertical space for site header (~65) + sticky toolbar (~60)
    // + legend (~28) + small breathing room (~20) when the toolbar is
    // auto-scrolled to top. Leaves the rest for the canvas.
    const reservedV = 175
    const availH = Math.max(400, viewportHeight - reservedV)
    const availW = containerWidth > 0 ? containerWidth : pd.width

    let displayScale: number
    if (zoomMode === "fit-page") {
        const sx = availW / pd.width
        const sy = availH / pd.height
        displayScale = Math.min(sx, sy)
    } else if (zoomMode === "fit-width") {
        displayScale = availW / pd.width
    } else {
        displayScale = zoomMode
    }
    // Sensible bounds — don't let zoom collapse to invisible or blow past readability
    displayScale = Math.max(0.1, Math.min(displayScale, 4))

    const renderWidth = pd.width * displayScale
    const renderHeight = pd.height * displayScale

    const zoomPct = Math.round(displayScale * 100)
    const setExplicitZoom = (multiplier: number) => {
        setZoomMode(Math.max(0.1, Math.min(displayScale * multiplier, 4)))
    }

    const currentPageEdits = Array.from(edits.entries()).filter(([k]) => k.startsWith(`p${currentPage}:`))
    const currentPageDeleted = Array.from(deletedKeys).filter((k) => k.startsWith(`p${currentPage}:`))

    return (
        <div className="w-full px-4 space-y-4 mx-auto max-w-[1400px]">
            <div ref={toolbarRef} className="flex flex-wrap items-center gap-2 bg-white border rounded-xl p-2 sm:p-3 sticky top-16 z-20 shadow-md">
                <div className="flex items-center gap-1">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-mono px-2">
                        Page {currentPage} / {numPages}
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                        disabled={currentPage >= numPages}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1" />

                <div className="flex items-center gap-1">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setExplicitZoom(1 / 1.25)}
                        title="Zoom out"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-mono px-2 min-w-[56px] text-center">{zoomPct}%</span>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setExplicitZoom(1.25)}
                        title="Zoom in"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={zoomMode === "fit-page" ? "default" : "outline"}
                        onClick={() => setZoomMode("fit-page")}
                        title="Fit whole page in view"
                    >
                        <Maximize2 className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Fit Page</span>
                    </Button>
                    <Button
                        size="sm"
                        variant={zoomMode === "fit-width" ? "default" : "outline"}
                        onClick={() => setZoomMode("fit-width")}
                        title="Fit page width"
                    >
                        <MoveHorizontal className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Fit Width</span>
                    </Button>
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1" />

                <Button
                    size="sm"
                    variant={drawMode ? "default" : "outline"}
                    onClick={() => {
                        setDrawMode(!drawMode)
                        setDrawStart(null)
                        setDrawEnd(null)
                    }}
                >
                    <Plus className="w-4 h-4 mr-1" />
                    {drawMode ? "Drawing..." : "Add Region"}
                </Button>

                {(edits.size > 0 || deletedKeys.size > 0) && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            if (confirm("Clear all edits and deletions across all pages?")) {
                                setEdits(new Map())
                                setDeletedKeys(new Set())
                            }
                        }}
                    >
                        <Undo2 className="w-4 h-4 mr-1" /> Clear All ({edits.size + deletedKeys.size})
                    </Button>
                )}

                <label
                    className="ml-auto flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none"
                    title="Skip the white background behind replacement text. The PDF will show old + new text overlapping in PDF viewers, but it imports into AutoCAD cleanly (no filled rectangle artifact)."
                >
                    <input
                        type="checkbox"
                        checked={autocadMode}
                        onChange={(e) => setAutocadMode(e.target.checked)}
                        className="rounded border-slate-300 w-4 h-4"
                    />
                    <span className="hidden sm:inline">AutoCAD-friendly mode</span>
                    <span className="sm:hidden">AutoCAD mode</span>
                </label>

                <Button
                    size="sm"
                    onClick={handleExport}
                    disabled={edits.size === 0 && deletedKeys.size === 0}
                    className="bg-orange-600 hover:bg-orange-700"
                >
                    <Download className="w-4 h-4 mr-1" /> Export PDF
                </Button>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-4 flex-wrap">
                <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm bg-orange-200/60 border border-orange-400" /> Detected text region (click to edit)
                </span>
                <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm bg-green-200/70 border border-green-500" /> Edited
                </span>
                <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm bg-red-200/70 border border-red-500" /> Deleted
                </span>
                <span>
                    {pd.clusters.length} regions detected on this page
                </span>
            </div>

            <div
                ref={canvasWrapperRef}
                className="bg-slate-200/40 border rounded-xl overflow-auto shadow-inner"
                style={{
                    maxHeight: `${availH}px`,
                    WebkitOverflowScrolling: "touch",
                    // Let the user pan/pinch the drawing with touch; only lock that
                    // down while actively drawing a manual region.
                    touchAction: drawMode ? "none" : "pan-x pan-y pinch-zoom",
                }}
            >
            <div
                className="relative bg-white mx-auto"
                style={{ width: renderWidth, height: renderHeight, cursor: drawMode ? "crosshair" : "default" }}
                onMouseDown={(e) => {
                    if (!drawMode) return
                    const rect = e.currentTarget.getBoundingClientRect()
                    setDrawStart({ x: e.clientX - rect.left, y: e.clientY - rect.top })
                    setDrawEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top })
                }}
                onMouseMove={(e) => {
                    if (!drawMode || !drawStart) return
                    const rect = e.currentTarget.getBoundingClientRect()
                    setDrawEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top })
                }}
                onMouseUp={() => {
                    if (!drawMode || !drawStart || !drawEnd) return
                    const x = Math.min(drawStart.x, drawEnd.x) / displayScale
                    const y = Math.min(drawStart.y, drawEnd.y) / displayScale
                    const w = Math.abs(drawEnd.x - drawStart.x) / displayScale
                    const h = Math.abs(drawEnd.y - drawStart.y) / displayScale
                    if (w > 5 && h > 5) addManualCluster(currentPage, x, y, w, h)
                    setDrawStart(null)
                    setDrawEnd(null)
                    setDrawMode(false)
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={pd.canvasDataUrl}
                    alt={`Page ${currentPage}`}
                    style={{ width: renderWidth, height: renderHeight, display: "block", pointerEvents: "none" }}
                />

                {pd.clusters.map((c) => {
                    const key = clusterKey(currentPage, c.id)
                    const isEdited = edits.has(key)
                    const isDeleted = deletedKeys.has(key)
                    const isActive = activeClusterKey === key
                    return (
                        <div
                            key={c.id}
                            onClick={(e) => {
                                if (drawMode) return
                                e.stopPropagation()
                                openCluster(currentPage, c)
                            }}
                            className={`absolute cursor-pointer transition-colors ${
                                isActive
                                    ? "bg-blue-200/60 border-2 border-blue-600"
                                    : isDeleted
                                    ? "bg-red-200/50 border border-red-500 hover:bg-red-200/70"
                                    : isEdited
                                    ? "bg-green-200/50 border border-green-500 hover:bg-green-200/70"
                                    : "bg-orange-100/40 border border-orange-400 hover:bg-orange-200/60"
                            }`}
                            style={{
                                left: c.x * displayScale,
                                top: c.y * displayScale,
                                width: c.w * displayScale,
                                height: c.h * displayScale,
                            }}
                            title={
                                isDeleted
                                    ? `Deleted${c.originalText ? `: "${c.originalText}"` : ""} — click to restore or edit`
                                    : isEdited
                                    ? `Edited: "${edits.get(key)}"${c.originalText ? ` (was "${c.originalText}")` : ""}`
                                    : c.originalText
                                    ? `"${c.originalText}" — click to edit or delete`
                                    : "Click to edit this text region"
                            }
                        />

                    )
                })}

                {drawMode && drawStart && drawEnd && (
                    <div
                        className="absolute border-2 border-dashed border-orange-600 bg-orange-200/30 pointer-events-none"
                        style={{
                            left: Math.min(drawStart.x, drawEnd.x),
                            top: Math.min(drawStart.y, drawEnd.y),
                            width: Math.abs(drawEnd.x - drawStart.x),
                            height: Math.abs(drawEnd.y - drawStart.y),
                        }}
                    />
                )}

                {activeClusterKey &&
                    (() => {
                        const [pPart, idPart] = activeClusterKey.split(":")
                        if (pPart !== `p${currentPage}`) return null
                        const c = pd.clusters.find((x) => x.id === idPart)
                        if (!c) return null
                        return (
                            <div
                                className="absolute bg-white border-2 border-blue-600 rounded-md shadow-lg p-2 flex gap-1 items-center z-20"
                                style={{
                                    left: c.x * displayScale,
                                    top: (c.y + c.h) * displayScale + 4,
                                    minWidth: Math.max(200, c.w * displayScale),
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <input
                                    autoFocus
                                    type="text"
                                    value={draftText}
                                    onChange={(e) => setDraftText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") saveDraft()
                                        if (e.key === "Escape") cancelDraft()
                                    }}
                                    placeholder="Type replacement text"
                                    className="flex-1 px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:border-blue-500"
                                />
                                <Button size="sm" onClick={saveDraft} className="bg-blue-600 hover:bg-blue-700 h-8 px-2" title="Save replacement text">
                                    <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={deleteActiveCluster}
                                    className="h-8 px-2 text-red-600 border-red-300 hover:bg-red-50"
                                    title="Delete this text completely (leave it blank)"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelDraft} className="h-8 px-2" title="Cancel">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )
                    })()}
            </div>
            </div>

            {currentPageEdits.length > 0 && (
                <div className="bg-slate-50 border rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Ruler className="w-4 h-4" /> Edits on this page
                    </h3>
                    <ul className="space-y-1 text-sm">
                        {currentPageEdits.map(([key, text]) => {
                            const id = key.split(":")[1]
                            const cluster = pd.clusters.find((c) => c.id === id)
                            return (
                                <li key={key} className="flex justify-between items-center bg-white border rounded px-3 py-2 gap-2">
                                    <span className="font-mono text-sm flex-1 truncate">
                                        {cluster?.originalText && (
                                            <span className="text-slate-400 line-through mr-2">&ldquo;{cluster.originalText}&rdquo;</span>
                                        )}
                                        <span className="text-green-700">&ldquo;{text}&rdquo;</span>
                                    </span>
                                    <button
                                        onClick={() => removeEdit(key)}
                                        className="text-slate-400 hover:text-red-600 text-xs"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}

            {currentPageDeleted.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Deleted on this page
                    </h3>
                    <ul className="space-y-1 text-sm">
                        {currentPageDeleted.map((key) => {
                            const id = key.split(":")[1]
                            const cluster = pd.clusters.find((c) => c.id === id)
                            return (
                                <li key={key} className="flex justify-between items-center bg-white border rounded px-3 py-2 gap-2">
                                    <span className="font-mono text-sm flex-1 truncate text-slate-400 line-through">
                                        {cluster?.originalText ? `“${cluster.originalText}”` : "(text region)"}
                                    </span>
                                    <button
                                        onClick={() => restoreDeleted(key)}
                                        className="text-slate-400 hover:text-blue-600 text-xs inline-flex items-center gap-1"
                                        title="Restore this text"
                                    >
                                        <RotateCcw className="w-4 h-4" /> Restore
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}

            <div className="pt-4">
                <AdBanner variant="rectangle" />
            </div>
        </div>
    )
}
