"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react"
import type { PDFDocumentProxy } from "pdfjs-dist"
import { FileUploader } from "@/components/tools/file-uploader"
import { ProcessingWait } from "@/components/tools/processing-wait"
import { AdBanner } from "@/components/ads/banner"
import { Button } from "@/components/ui/button"
import MobileWorkBar from "@/components/mobile/MobileWorkBar"
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import { finishConvert } from "@/lib/native-file"
import { takeJob, releaseJob } from "@/lib/jobs/session"
import { assertFitsPhone } from "@/lib/jobs/media"
import { loadPdfjs } from "@/lib/pdfjs"
import type { Pt } from "@/lib/cad/geometry"
import { stampBox, todayLabel, type Markup, type MeasureText, type StampLabel } from "@/lib/cad/markup"
import { calibrate, formatLength, measure, parseLength, scaleRatio, type Calibration, type Unit } from "@/lib/cad/measure"
import { deviceProfile, pagesToKeep, type TierProfile } from "@/lib/cad/device"
import type { ExportReport, PageInfo, RegionEdit } from "@/lib/cad/export"
import { AlertTriangle, Check, ChevronLeft, Download, Type } from "lucide-react"
import { loadPage, manualRegion, release, sampleRegionColors } from "./analyze"
import { PageWorker, isAbort } from "./engine"
import { CalibrateEditor, ChangeLists, MeasureResult, NoteEditor, ProgressBar, Sheet, TextEditor, Toolbar, toolHint } from "./panels"
import { regionKey, type PageImage, type PageModel, type Region, type Tool } from "./types"
import { DrawingView, clampView, fitView, zoomAt, type View } from "./viewer"

type Step = "upload" | "analyzing" | "editing" | "exporting" | "done"

type Dialog =
    | { kind: "note"; at: Pt }
    | { kind: "calibrate"; a: Pt; b: Pt }
    | { kind: "measure"; a: Pt; b: Pt; label: string }
    | null

const yieldToUi = () => new Promise<void>((r) => setTimeout(r, 0))
/** Timeline marks (cad:start:3, cad:shown:3, cad:analysed:3, cad:aborted:3) for DevTools and tests. */
const mark = (name: string) => {
    try {
        performance.mark(name)
    } catch {
        // Old browsers without User Timing.
    }
}

/** Markup sizes scale with the sheet so they read the same on A4 and A0. */
const sheetUnit = (m: PageModel) => Math.max(0.6, Math.hypot(m.width, m.height) / 1200)
const WIDTHS = [0.6, 1.2, 2.5]

function boxBounds(b: Region["box"]) {
    const r = (b.angle * Math.PI) / 180
    const ux = Math.cos(r)
    const uy = Math.sin(r)
    const pts = [
        [0, 0],
        [b.w, 0],
        [b.w, b.h],
        [0, b.h],
    ].map(([s, t]) => ({ x: b.x + s * ux - t * uy, y: b.y + s * uy + t * ux }))
    const xs = pts.map((p) => p.x)
    const ys = pts.map((p) => p.y)
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }
}

export default function AutocadPdfEditorClient() {
    const [step, setStep] = useState<Step>("upload")
    const [file, setFile] = useState<File | null>(null)
    const [progress, setProgress] = useState(0)
    const [progressStatus, setProgressStatus] = useState("Reading file...")
    const [numPages, setNumPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [models, setModels] = useState<Map<number, PageModel>>(new Map())
    // Rendered page images: only the current page and its neighbours keep one.
    const [images, setImages] = useState<Map<number, PageImage>>(new Map())
    // The just-rendered canvas of the current page, shown until its PNG has decoded.
    const [preview, setPreview] = useState<{ page: number; canvas: HTMLCanvasElement } | null>(null)
    const [pageBusy, setPageBusy] = useState<{ page: number; label: string; done: number | null } | null>(null)
    const [pageError, setPageError] = useState<string | null>(null)
    const [edits, setEdits] = useState<Map<string, string>>(new Map())
    // Regions the user chose to delete entirely (remove original, write nothing).
    const [deletedKeys, setDeletedKeys] = useState<Set<string>>(new Set())
    const [colorOverrides, setColorOverrides] = useState<Map<string, string>>(new Map())
    const [activeKey, setActiveKey] = useState<string | null>(null)
    const [draftText, setDraftText] = useState("")
    const [draftColor, setDraftColor] = useState("#000000")
    const [markups, setMarkups] = useState<Markup[]>([])
    const [selectedMarkup, setSelectedMarkup] = useState<string | null>(null)
    const [tool, setTool] = useState<Tool>("select")
    const [markupColor, setMarkupColor] = useState("#e00000")
    const [widthLevel, setWidthLevel] = useState(1)
    const [stampLabel, setStampLabel] = useState<StampLabel>("APPROVED")
    const [stampDate, setStampDate] = useState(true)
    const [calibrations, setCalibrations] = useState<Map<number, Calibration>>(new Map())
    const [dialog, setDialog] = useState<Dialog>(null)
    const [exportUrl, setExportUrl] = useState<string | null>(null)
    const [report, setReport] = useState<ExportReport | null>(null)
    const [autocadMode, setAutocadMode] = useState(false)
    const [view, setView] = useState<View>({ zoom: 0.5, x: 0, y: 0 })
    const [fitMode, setFitMode] = useState<"page" | "width" | null>("page")
    const [frame, setFrame] = useState({ w: 0, h: 0 })
    // Layout follows the window size, not "is this a phone": width picks the bottom sheet
    // or the popover and the toolbar shape; height sizes the drawing frame.
    const [vp, setVp] = useState(IS_MOBILE_BUILD ? { w: 390, h: 800 } : { w: 1280, h: 800 })
    const [coarse, setCoarse] = useState(IS_MOBILE_BUILD)
    // Toolbar and legend heights, so the frame can fill the rest of the screen.
    const [chrome, setChrome] = useState({ toolbar: IS_MOBILE_BUILD ? 92 : 104, legend: 16 })
    // Top of the bottom sheet on screen (CSS px), while one is open.
    const [sheetTop, setSheetTop] = useState<number | null>(null)

    const pdfBytesRef = useRef<ArrayBuffer | null>(null)
    const pdfRef = useRef<PDFDocumentProxy | null>(null)
    const abortRef = useRef<AbortController | null>(null)
    const toolbarRef = useRef<HTMLDivElement>(null)
    const legendRef = useRef<HTMLDivElement>(null)
    const genRef = useRef(0)
    const modelsRef = useRef(models)
    const imagesRef = useRef(images)
    const previewRef = useRef(preview)
    const exportUrlRef = useRef<string | null>(null)
    useLayoutEffect(() => {
        modelsRef.current = models
        imagesRef.current = images
        previewRef.current = preview
        exportUrlRef.current = exportUrl
    }, [models, images, preview, exportUrl])
    // Device tier (pixel budget, cache size), decided once in the browser.
    const profileRef = useRef<TierProfile | null>(null)
    const profile = () => (profileRef.current ??= deviceProfile(IS_MOBILE_BUILD))
    const workerRef = useRef<PageWorker | null>(null)
    // The page being rendered/analysed right now; leaving the page aborts it.
    const jobRef = useRef<{ page: number; ac: AbortController } | null>(null)
    const jobsStartedRef = useRef(0)

    const model = models.get(currentPage)
    /** Bottom-sheet editor and compact toolbar below 640 px wide. */
    const narrow = vp.w < 640
    /** Compact toolbar: phones, and landscape phones (short screens) in a single row. */
    const toolbarMode: "compact" | "medium" | "full" = vp.w < 640 || vp.h < 500 ? "compact" : vp.w < 1100 ? "medium" : "full"

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth
            const h = window.innerHeight
            setVp((old) => {
                // A keyboard that shrinks the window (Android WebView) mustn't refit the drawing
                // under the text you're typing; keep the old height until it closes.
                const el = document.activeElement as HTMLElement | null
                const typing = !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA") && w === old.w && h < old.h
                const next = typing ? old : { w, h }
                return old.w === next.w && old.h === next.h ? old : next
            })
            setCoarse(IS_MOBILE_BUILD || window.matchMedia("(pointer: coarse)").matches)
        }
        update()
        window.addEventListener("resize", update)
        window.addEventListener("orientationchange", update)
        return () => {
            window.removeEventListener("resize", update)
            window.removeEventListener("orientationchange", update)
        }
    }, [])

    // Toolbar and legend sizes change rarely (wrapping, tool options): watch them.
    useEffect(() => {
        if (step !== "editing") return
        const tb = toolbarRef.current
        const lg = legendRef.current
        if (!tb || !lg) return
        const measure = () => {
            const toolbar = Math.round(tb.offsetHeight)
            const legend = Math.round(lg.offsetHeight)
            setChrome((c) => (c.toolbar === toolbar && c.legend === legend ? c : { toolbar, legend }))
        }
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(tb)
        ro.observe(lg)
        return () => ro.disconnect()
    }, [step])

    // Page images are object URLs: free them (and stop any page work) when the editor goes away.
    useEffect(
        () => () => {
            jobRef.current?.ac.abort()
            workerRef.current?.cancel()
            imagesRef.current.forEach((im) => URL.revokeObjectURL(im.url))
            if (previewRef.current) release(previewRef.current.canvas)
            if (exportUrlRef.current) URL.revokeObjectURL(exportUrlRef.current)
            void pdfRef.current?.destroy()
        },
        [],
    )

    // When entering edit mode, scroll the toolbar to just below the site header so
    // the drawing gets the rest of the viewport.
    useEffect(() => {
        if (step !== "editing") return
        const id = requestAnimationFrame(() => {
            if (!toolbarRef.current) return
            const rect = toolbarRef.current.getBoundingClientRect()
            const targetY = window.scrollY + rect.top - (IS_MOBILE_BUILD ? 8 : 72)
            if (Math.abs(window.scrollY - targetY) > 4) window.scrollTo({ top: targetY, behavior: "smooth" })
        })
        return () => cancelAnimationFrame(id)
    }, [step, currentPage])

    // Load pdf.js while the upload screen sits idle: on slow phones evaluating it is a
    // few hundred ms that would otherwise land right after the file is chosen.
    useEffect(() => {
        if (step !== "upload") return
        const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void }
        const go = () => void loadPdfjs().catch(() => {})
        if (w.requestIdleCallback) {
            const id = w.requestIdleCallback(go, { timeout: 4000 })
            return () => w.cancelIdleCallback?.(id)
        }
        const t = window.setTimeout(go, 1200)
        return () => window.clearTimeout(t)
    }, [step])

    const measureText = useMemo<MeasureText>(() => {
        let ctx: CanvasRenderingContext2D | null = null
        return (text, size, bold) => {
            if (!ctx && typeof document !== "undefined") ctx = document.createElement("canvas").getContext("2d")
            if (!ctx) return text.length * size * 0.55
            ctx.font = `${bold ? "bold " : ""}100px Helvetica, Arial, sans-serif`
            return (ctx.measureText(text).width * size) / 100
        }
    }, [])

    const fit = (mode: "page" | "width", m: PageModel | undefined = model) => {
        if (!m || !frame.w || !frame.h) return
        // On narrow screens the sheet sits at the top so the bottom sheet covers empty space.
        setView(fitView(mode, frame.w, frame.h, m.width, m.height, narrow ? "top" : "center"))
        setFitMode(mode)
    }

    // A newly shown sheet fits the frame; a resized frame refits (or just re-clamps
    // when the user has zoomed in by hand).
    const fitRef = useRef(fitMode)
    useLayoutEffect(() => {
        fitRef.current = fitMode
    }, [fitMode])
    const fittedRef = useRef("")
    useEffect(() => {
        if (!model || !frame.w || !frame.h) return
        if (fittedRef.current !== model.key) {
            fittedRef.current = model.key
            fit("page", model)
        } else if (fitRef.current) fit(fitRef.current, model)
        else setView((v) => clampView(v, frame.w, frame.h, model.width, model.height))
    }, [model, frame.w, frame.h]) // eslint-disable-line react-hooks/exhaustive-deps

    const userView = useCallback((v: View) => {
        setView(v)
        setFitMode(null)
    }, [])
    const zoomBy = (factor: number) => {
        if (!model) return
        userView(clampView(zoomAt(view, factor, frame.w / 2, frame.h / 2), frame.w, frame.h, model.width, model.height))
    }

    const handleAnalyze = useCallback(async (selectedFile: File) => {
        setFile(selectedFile)
        setStep("analyzing")
        setProgress(5)
        setProgressStatus("Reading file...")
        const ac = takeJob()
        abortRef.current = ac
        const gen = ++genRef.current
        try {
            assertFitsPhone(selectedFile)
            const buffer = await selectedFile.arrayBuffer()
            pdfBytesRef.current = buffer.slice(0)
            setProgress(30)
            setProgressStatus("Opening the drawing...")
            const pdfjsLib = await loadPdfjs()
            const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise
            if (ac.signal.aborted || gen !== genRef.current) {
                void pdf.destroy()
                throw new DOMException("Aborted", "AbortError")
            }
            pdfRef.current = pdf
            setNumPages(pdf.numPages)
            // Sheets render when opened, the first one now: its image shows as soon as it's
            // drawn, with progress on the drawing while its text is found.
            jobsStartedRef.current = 0
            setModels(new Map())
            setImages(new Map())
            setCurrentPage(1)
            setFitMode("page")
            setProgress(100)
            setStep("editing")
        } catch (e) {
            if ((e as Error)?.name === "AbortError" || ac.signal.aborted) {
                setStep("upload")
                return
            }
            console.error(e)
            alert((e as Error)?.message || "Failed to analyze PDF. Try another AutoCAD-exported PDF.")
            setStep("upload")
        } finally {
            if (abortRef.current === ac) abortRef.current = null
            releaseJob(ac)
        }
    }, [])

    /** Frees the preview canvas unless it belongs to page `keep`. */
    const dropPreview = (keep?: number) =>
        setPreview((prev) => {
            if (!prev || prev.page === keep) return prev
            release(prev.canvas)
            return null
        })

    /** Drops images of pages far from `current`, within the tier's megapixel cap. */
    const trimImages = (current: number) =>
        setImages((prev) => {
            const prof = profileRef.current
            if (!prof) return prev
            const keep = pagesToKeep(new Map([...prev].map(([n, im]) => [n, im.mp])), current, prof.neighbours, prof.cacheMP)
            if (keep.size === prev.size) return prev
            const next = new Map<number, PageImage>()
            prev.forEach((im, n) => (keep.has(n) ? next.set(n, im) : URL.revokeObjectURL(im.url)))
            return next
        })

    // Renders (and, the first time, analyses) a page. Evicted images are re-rendered on return.
    const runJob = async (pdf: PDFDocumentProxy, n: number, gen: number) => {
        const ac = new AbortController()
        jobRef.current = { page: n, ac }
        jobsStartedRef.current++
        mark(`cad:start:${n}`)
        const prof = profile()
        workerRef.current ??= new PageWorker()
        setPageError(null)
        const live = () => !ac.signal.aborted && gen === genRef.current
        try {
            const m = await loadPage(pdf, n, {
                budget: prof.budget,
                maxScale: prof.maxScale,
                analyse: !modelsRef.current.get(n)?.analyzed,
                key: `${gen}:${n}`,
                signal: ac.signal,
                worker: workerRef.current,
                onPreview: (canvas, base) => {
                    if (!live()) return false
                    setPreview((prev) => {
                        if (prev && prev.canvas !== canvas) release(prev.canvas)
                        return { page: n, canvas }
                    })
                    setModels((prev) => (prev.has(n) ? prev : new Map(prev).set(n, base)))
                    return true
                },
                onImage: (img, base) => {
                    if (!live()) return URL.revokeObjectURL(img.url)
                    mark(`cad:shown:${n}`)
                    setImages((prev) => {
                        const old = prev.get(n)
                        if (old && old.url !== img.url) URL.revokeObjectURL(old.url)
                        return new Map(prev).set(n, img)
                    })
                    setModels((prev) => (prev.has(n) ? prev : new Map(prev).set(n, base)))
                    trimImages(n)
                },
                onStatus: (label, done) => {
                    if (live()) setPageBusy({ page: n, label, done })
                },
            })
            if (live() && m) {
                mark(`cad:analysed:${n}`)
                setModels((prev) => new Map(prev).set(n, m))
            }
        } catch (e) {
            if (isAbort(e) || !live()) return mark(`cad:aborted:${n}`)
            console.error(e)
            setPageError(`Couldn't render page ${n}: ${(e as Error)?.message || e}`)
        } finally {
            if (jobRef.current?.ac === ac) {
                jobRef.current = null
                setPageBusy(null)
            } else setPageBusy((b) => (b?.page === n ? null : b))
        }
    }

    // Leaving a page cancels its render and analysis, so quick paging never queues stale work.
    useEffect(() => {
        const job = jobRef.current
        if (job && job.page !== currentPage) {
            job.ac.abort()
            jobRef.current = null
        }
    }, [currentPage])

    const needsWork = step === "editing" && numPages > 0 && (!images.has(currentPage) || !models.get(currentPage)?.analyzed)
    useEffect(() => {
        const pdf = pdfRef.current
        if (!needsWork || !pdf || jobRef.current?.page === currentPage) return
        const gen = genRef.current
        // A short pause after paging, so flicking through sheets renders only the one you stop on.
        const timer = window.setTimeout(() => void runJob(pdf, currentPage, gen), jobsStartedRef.current ? 80 : 0)
        return () => window.clearTimeout(timer)
    }, [needsWork, currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

    const updateModel = (n: number, fn: (m: PageModel) => PageModel) =>
        setModels((prev) => {
            const m = prev.get(n)
            return m ? new Map(prev).set(n, fn(m)) : prev
        })

    const closeEditors = () => {
        setActiveKey(null)
        setDraftText("")
        setDialog(null)
    }

    const openRegion = (page: number, r: Region) => {
        const key = regionKey(page, r.id)
        setSelectedMarkup(null)
        setDialog(null)
        setActiveKey(key)
        // A deleted region starts empty; otherwise pending edit, else the detected text.
        setDraftText(deletedKeys.has(key) ? "" : (edits.get(key) ?? r.originalText ?? ""))
        setDraftColor(colorOverrides.get(key) ?? r.color)
    }

    const activeRegion = (() => {
        if (!activeKey || !model) return null
        const [pPart, id] = activeKey.split(":")
        if (pPart !== `p${currentPage}`) return null
        return model.regions.find((r) => r.id === id) ?? null
    })()

    // The bottom sheet must not hide the text being edited: move the drawing so the region
    // sits in the visible band between the toolbar and the sheet.
    useEffect(() => {
        if (!narrow || !activeRegion || sheetTop == null) return
        const frameEl = document.querySelector<HTMLElement>("[data-testid=cad-frame]")
        if (!frameEl) return
        const fr = frameEl.getBoundingClientRect()
        const tb = toolbarRef.current?.getBoundingClientRect()
        const visTop = Math.max(fr.top, tb && tb.bottom < fr.bottom ? tb.bottom : 0) + 8
        const visBottom = Math.min(fr.bottom, sheetTop) - 8
        if (visBottom - visTop < 24) return
        const b = boxBounds(activeRegion.box)
        const top = fr.top + frameEl.clientTop + view.y + b.y * view.zoom
        const h = b.h * view.zoom
        if (top >= visTop && top + h <= visBottom) return
        const want = h < visBottom - visTop ? visTop + (visBottom - visTop - h) / 2 : visTop
        userView({ ...view, y: view.y + (want - top) })
    }, [activeKey, sheetTop, narrow]) // eslint-disable-line react-hooks/exhaustive-deps

    const saveDraft = () => {
        if (!activeKey) return
        // Typing text = replace. Saving empty text just cancels (Delete blanks a region).
        if (draftText.trim() !== "") {
            setEdits((prev) => new Map(prev).set(activeKey, draftText))
            if (deletedKeys.has(activeKey)) {
                const d = new Set(deletedKeys)
                d.delete(activeKey)
                setDeletedKeys(d)
            }
        }
        if (activeRegion) {
            const next = new Map(colorOverrides)
            if (draftColor.toLowerCase() !== activeRegion.color.toLowerCase()) next.set(activeKey, draftColor)
            else next.delete(activeKey)
            setColorOverrides(next)
        }
        closeEditors()
    }

    const deleteActive = () => {
        if (!activeKey) return
        const next = new Map(edits)
        next.delete(activeKey)
        setEdits(next)
        setDeletedKeys((prev) => new Set(prev).add(activeKey))
        closeEditors()
    }

    const addMarkup = (m: Omit<Markup, "id" | "page" | "color" | "width"> & Partial<Pick<Markup, "color" | "width">>) => {
        if (!model) return
        const full: Markup = {
            id: `k${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
            page: currentPage,
            color: markupColor,
            width: WIDTHS[widthLevel] * sheetUnit(model),
            ...m,
        }
        setMarkups((prev) => [...prev, full])
    }

    const cal = calibrations.get(currentPage) ?? null
    const lengthLabel = (a: Pt, b: Pt, c: Calibration | null = cal) => {
        const r = measure(a, b, c)
        return formatLength(r.value, r.unit) + (r.paper ? " on paper" : "")
    }

    const onDragDone = async (t: Tool, a: Pt, b: Pt) => {
        if (!model) return
        const page = currentPage
        if (t === "region") {
            const x = Math.min(a.x, b.x)
            const y = Math.min(a.y, b.y)
            const w = Math.abs(b.x - a.x)
            const h = Math.abs(b.y - a.y)
            if (w < 3 || h < 3) return
            const { color, paper } = await sampleRegionColors(images.get(page), { x, y, w, h })
            const r = manualRegion(model, `m${Date.now().toString(36)}`, x, y, w, h, color, paper)
            updateModel(page, (m) => ({ ...m, regions: [...m.regions, r] }))
            setTool("select")
            openRegion(page, r)
        } else if (t === "measure") {
            setDialog({ kind: "measure", a, b, label: lengthLabel(a, b) })
        } else if (t === "calibrate") {
            setDialog({ kind: "calibrate", a, b })
        } else if (t === "arrow" || t === "cloud" || t === "rect" || t === "highlight") {
            addMarkup({ kind: t, a, b })
        }
    }

    const onPlace = (t: Tool, at: Pt) => {
        if (!model) return
        const size = Math.max(9, 8 * sheetUnit(model))
        if (t === "note") setDialog({ kind: "note", at })
        else if (t === "stamp") {
            const probe: Markup = { id: "", page: currentPage, kind: "stamp", color: markupColor, width: 1, a: at, b: at, text: stampLabel, date: stampDate ? todayLabel() : undefined, size: size * 1.5 }
            const s = stampBox(probe, measureText)
            addMarkup({ kind: "stamp", a: { x: at.x - s.w / 2, y: at.y - s.h / 2 }, b: at, text: stampLabel, date: probe.date, size: size * 1.5 })
        }
    }

    const undoMarkup = () => {
        setMarkups((prev) => prev.slice(0, -1))
        setSelectedMarkup(null)
    }
    const deleteMarkup = (id: string) => {
        setMarkups((prev) => prev.filter((m) => m.id !== id))
        if (selectedMarkup === id) setSelectedMarkup(null)
    }

    const changeCount = edits.size + deletedKeys.size + markups.length

    // Keyboard: + / - / 0 zoom, Esc cancels, Delete removes the selected markup, Ctrl+Z undoes.
    const keyRef = useRef<(e: KeyboardEvent) => void>(() => {})
    useLayoutEffect(() => {
        keyRef.current = onKey
    })
    const onKey = (e: KeyboardEvent) => {
        if (step !== "editing") return
        const t = e.target as HTMLElement | null
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
            if (markups.length) {
                e.preventDefault()
                undoMarkup()
            }
            return
        }
        if (e.ctrlKey || e.metaKey || e.altKey) return
        if (e.key === "+" || e.key === "=") zoomBy(1.25)
        else if (e.key === "-" || e.key === "_") zoomBy(1 / 1.25)
        else if (e.key === "0") fit("page")
        else if (e.key === "Escape") {
            closeEditors()
            setSelectedMarkup(null)
            setTool("select")
        } else if ((e.key === "Delete" || e.key === "Backspace") && selectedMarkup) {
            e.preventDefault()
            deleteMarkup(selectedMarkup)
        }
    }
    useEffect(() => {
        const h = (e: KeyboardEvent) => keyRef.current(e)
        window.addEventListener("keydown", h)
        return () => window.removeEventListener("keydown", h)
    }, [])

    const handleExport = async () => {
        if (!pdfBytesRef.current || changeCount === 0) {
            alert("No changes to apply. Tap a text region to edit it, or add a markup first.")
            return
        }
        closeEditors()
        setStep("exporting")
        setProgress(10)
        setProgressStatus("Loading PDF...")
        const ac = takeJob()
        abortRef.current = ac
        try {
            const lib = await import("pdf-lib")
            const { applyCadEdits } = await import("@/lib/cad/export")
            const { loadPdf } = await import("@/lib/pdf-password")
            const doc = await loadPdf(pdfBytesRef.current.slice(0))
            const pages = new Map<number, PageInfo>()
            models.forEach((m, n) => pages.set(n, { frame: m.frame, items: m.items }))
            const regionEdits: RegionEdit[] = []
            for (const key of new Set([...edits.keys(), ...deletedKeys])) {
                const [pPart, id] = key.split(":")
                const page = Number(pPart.slice(1))
                const r = models.get(page)?.regions.find((x) => x.id === id)
                if (!r) continue
                regionEdits.push({
                    key,
                    page,
                    runKey: r.kind === "text" ? r.id : undefined,
                    place: r.place,
                    color: colorOverrides.get(key) ?? r.color,
                    paper: r.paper,
                    family: r.family,
                    bold: r.bold,
                    text: deletedKeys.has(key) ? null : (edits.get(key) ?? null),
                })
            }
            setProgress(25)
            setProgressStatus("Applying edits and markups...")
            const rep = await applyCadEdits(lib, doc, pages, regionEdits, markups, {
                autocadMode,
                onPage: async (done, total) => {
                    setProgress(Math.round(25 + (55 * done) / Math.max(1, total)))
                    await yieldToUi()
                },
            })
            if (ac.signal.aborted) throw new DOMException("Aborted", "AbortError")
            setProgress(85)
            setProgressStatus("Building PDF...")
            const out = await doc.save()
            const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" })
            const filename = file ? file.name.replace(/\.pdf$/i, "") + "-edited.pdf" : "edited.pdf"
            setReport(rep)
            setProgress(100)
            if (IS_MOBILE_BUILD) {
                await finishConvert(blob, filename, `Applied ${changeCount} change${changeCount === 1 ? "" : "s"}.`)
                setStep("editing")
            } else {
                setExportUrl(URL.createObjectURL(blob))
                setStep("done")
            }
        } catch (e) {
            if ((e as Error)?.name !== "AbortError") {
                console.error(e)
                alert("Failed to export. Please try again.")
            }
            setStep("editing")
        } finally {
            if (abortRef.current === ac) abortRef.current = null
            releaseJob(ac)
        }
    }

    // Back to the editor from the "done" screen without losing any work.
    const continueEditing = () => {
        if (exportUrl) URL.revokeObjectURL(exportUrl)
        setExportUrl(null)
        setStep("editing")
    }

    const reset = () => {
        genRef.current++
        jobRef.current?.ac.abort()
        jobRef.current = null
        if (exportUrl) URL.revokeObjectURL(exportUrl)
        images.forEach((im) => URL.revokeObjectURL(im.url))
        setImages(new Map())
        dropPreview()
        void pdfRef.current?.destroy()
        pdfRef.current = null
        setFile(null)
        setStep("upload")
        setNumPages(0)
        setCurrentPage(1)
        setModels(new Map())
        setPageBusy(null)
        setPageError(null)
        setEdits(new Map())
        setDeletedKeys(new Set())
        setColorOverrides(new Map())
        setMarkups([])
        setSelectedMarkup(null)
        setCalibrations(new Map())
        closeEditors()
        setTool("select")
        setExportUrl(null)
        setReport(null)
        setAutocadMode(false)
        pdfBytesRef.current = null
    }

    if (step === "analyzing" || step === "exporting") {
        if (IS_MOBILE_BUILD) {
            return (
                <div className="mobile-job px-1">
                    <MobileWorkBar
                        note={progressStatus || (step === "analyzing" ? "Finding text..." : "Saving PDF...")}
                        sizeLabel={file ? file.name : undefined}
                        onCancel={() => {
                            abortRef.current?.abort()
                            setStep(step === "exporting" ? "editing" : "upload")
                        }}
                    />
                    <p className="mt-3 text-center text-sm text-slate-500">{progress}%</p>
                </div>
            )
        }
        return (
            <ProcessingWait
                progress={progress}
                title={step === "analyzing" ? "Finding text on the drawing..." : "Saving edited PDF..."}
                status={progressStatus}
            />
        )
    }

    if (step === "upload") {
        return (
            <div className="container mx-auto max-w-4xl px-4">
                <div className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <div>
                        <strong>Made for AutoCAD-exported PDFs:</strong> correct labels, notes and dimensions without opening AutoCAD, and
                        mark up the drawing with clouds, arrows, stamps and measurements. We find real text and SHX text drawn as lines, so
                        you can tap, type a fix and save.
                    </div>
                </div>
                <FileUploader
                    onFilesSelected={(f) => handleAnalyze(f[0])}
                    multiple={false}
                    accept={{ "application/pdf": [".pdf"] }}
                    fileTypeLabel="AutoCAD PDF"
                    iconType="pdf"
                />
                {!IS_MOBILE_BUILD ? (
                    <div className="mt-6">
                        <AdBanner variant="rectangle" />
                    </div>
                ) : null}
            </div>
        )
    }

    if (step === "done" && exportUrl) {
        const removed = report?.removed.length ?? 0
        const covered = report?.covered.length ?? 0
        return (
            <div className="container mx-auto max-w-2xl space-y-8 px-4 py-12 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <Check className="h-10 w-10" />
                </div>
                <div>
                    <h2 className="mb-2 text-3xl font-bold">Edited PDF Ready</h2>
                    <p className="text-slate-600">
                        Applied {edits.size} edit{edits.size === 1 ? "" : "s"}
                        {deletedKeys.size > 0 && `, ${deletedKeys.size} deletion${deletedKeys.size === 1 ? "" : "s"}`}
                        {markups.length > 0 && ` and ${markups.length} markup${markups.length === 1 ? "" : "s"}`}. Your file is ready to download.
                    </p>
                    {removed + covered > 0 && (
                        <p className="mt-2 text-sm text-slate-500">
                            {removed > 0 && `${removed} original label${removed === 1 ? " was" : "s were"} removed from the PDF's text. `}
                            {covered > 0 && `${covered} ${covered === 1 ? "was" : "were"} covered with a paper-coloured box (SHX lines or text that couldn't be removed safely).`}
                        </p>
                    )}
                    {(report?.substituted ?? 0) > 0 && (
                        <p className="mt-1 text-sm text-amber-700">
                            Some characters aren&apos;t in the standard PDF fonts and were replaced (for example ⌀ became Ø).
                        </p>
                    )}
                </div>
                <a href={exportUrl} download={file ? file.name.replace(/\.pdf$/i, "") + "-edited.pdf" : "edited.pdf"} className="inline-flex">
                    <Button size="xl" className="h-auto rounded-xl px-8 py-6 text-lg">
                        <Download className="mr-2 h-5 w-5" /> Download Edited PDF
                    </Button>
                </a>

                <div className="mx-auto flex max-w-xl gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left text-sm text-amber-900">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <div>
                        {autocadMode ? (
                            <>
                                <strong className="mb-1 block">Exported in AutoCAD-friendly mode.</strong>
                                <span className="block">
                                    No cover boxes were drawn, so PDFIMPORT brings in no filled-rectangle artefacts. Text that could be removed
                                    from the PDF is gone; SHX lines and anything that couldn&apos;t be removed still come in under your new text —
                                    delete those in AutoCAD after import.
                                </span>
                            </>
                        ) : (
                            <>
                                <strong className="mb-1 block">Sending this PDF to a colleague? It looks like the original, with your changes.</strong>
                                <span className="block">
                                    <strong>Planning to re-import into AutoCAD?</strong> Tick &ldquo;AutoCAD-friendly mode&rdquo; next time. Where a
                                    label couldn&apos;t be removed, this export hides it under a paper-coloured box, which PDFIMPORT turns into a
                                    filled SOLID.
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="pt-4">
                    <AdBanner variant="rectangle" />
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="outline" onClick={continueEditing}>
                        <ChevronLeft className="mr-1 h-4 w-4" /> Back to Editing
                    </Button>
                    <Button variant="outline" onClick={reset}>
                        Edit Another File
                    </Button>
                </div>
                <p className="text-xs text-slate-400">&ldquo;Back to Editing&rdquo; keeps all your current edits and markups.</p>
            </div>
        )
    }

    // The frame fills the visible screen below the toolbar (stuck under the site header)
    // and the legend: the whole drawing area is usable without scrolling the page.
    const stickyTop = IS_MOBILE_BUILD ? 8 : 72
    const reserve = IS_MOBILE_BUILD ? 96 : 12
    const availH = Math.round(Math.max(vp.h < 500 ? 180 : 280, vp.h - stickyTop - chrome.toolbar - 12 - chrome.legend - 12 - reserve))
    const pageKeyPrefix = `p${currentPage}:`
    const pageMarkups = markups.filter((m) => m.page === currentPage)
    const regionByKey = (key: string) => model?.regions.find((r) => regionKey(currentPage, r.id) === key)
    const toFrame = (p: Pt) => ({ x: p.x * view.zoom + view.x, y: p.y * view.zoom + view.y })

    let overlay: ReactNode = null
    if (activeRegion && activeKey) {
        const b = boxBounds(activeRegion.box)
        const tl = toFrame(b)
        overlay = (
            <Sheet
                narrow={narrow}
                frame={frame}
                onSheetTop={setSheetTop}
                anchor={{ x: tl.x, y: tl.y, w: b.w * view.zoom, h: b.h * view.zoom }}
                title={
                    <>
                        <Type className="h-3.5 w-3.5 text-[#026EFF]" />
                        {activeRegion.kind === "shx" ? "Replace SHX text" : "Fix this text"}
                        {activeRegion.originalText ? <span className="truncate font-normal text-slate-400">was &ldquo;{activeRegion.originalText}&rdquo;</span> : null}
                    </>
                }
            >
                <TextEditor
                    narrow={narrow}
                    value={draftText}
                    onChange={setDraftText}
                    color={draftColor}
                    onColor={setDraftColor}
                    onSave={saveDraft}
                    onDelete={deleteActive}
                    onCancel={closeEditors}
                />
            </Sheet>
        )
    } else if (dialog && model) {
        const at = dialog.kind === "note" ? dialog.at : dialog.b
        const f = toFrame(at)
        const anchor = { x: f.x, y: f.y, w: 1, h: 1 }
        if (dialog.kind === "note") {
            overlay = (
                <Sheet narrow={narrow} frame={frame} anchor={anchor} onSheetTop={setSheetTop} title="Add a note">
                    <NoteEditor
                        onCancel={() => setDialog(null)}
                        onAdd={(text) => {
                            if (text.trim()) addMarkup({ kind: "note", a: dialog.at, b: dialog.at, text: text.trimEnd(), size: Math.max(9, 8 * sheetUnit(model)) })
                            setDialog(null)
                        }}
                    />
                </Sheet>
            )
        } else if (dialog.kind === "calibrate") {
            overlay = (
                <Sheet narrow={narrow} frame={frame} anchor={anchor} onSheetTop={setSheetTop} title="Set the drawing scale">
                    <CalibrateEditor
                        paperLabel={lengthLabel(dialog.a, dialog.b, null).replace(" on paper", "")}
                        defaultUnit={cal?.unit ?? "mm"}
                        onCancel={() => {
                            setDialog(null)
                            setTool("measure")
                        }}
                        onSet={(len, unit: Unit) => {
                            const v = parseLength(len)
                            if (v == null) return "Enter a length greater than zero, e.g. 3600"
                            const c = calibrate(dialog.a, dialog.b, v, unit)
                            if (!c) return "Draw a longer line, then try again"
                            setCalibrations((prev) => new Map(prev).set(currentPage, c))
                            setDialog(null)
                            setTool("measure")
                            return null
                        }}
                    />
                </Sheet>
            )
        } else {
            overlay = (
                <Sheet narrow={narrow} frame={frame} anchor={anchor} onSheetTop={setSheetTop} title="Measurement">
                    <MeasureResult
                        label={dialog.label}
                        calibrated={!!cal}
                        onClose={() => setDialog(null)}
                        onAdd={() => {
                            addMarkup({ kind: "measure", a: dialog.a, b: dialog.b, text: dialog.label, size: Math.max(8, 7 * sheetUnit(model)) })
                            setDialog(null)
                        }}
                    />
                </Sheet>
            )
        }
    }

    const scaleLabel = cal ? `Scale ${scaleRatio(cal) ?? "set"} · ${cal.unit}` : null

    return (
        <div className="mx-auto w-full max-w-[1400px] space-y-3 pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] sm:pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(1rem,env(safe-area-inset-right))]">
            <div ref={toolbarRef}>
                <Toolbar
                    mode={toolbarMode}
                    oneRow={toolbarMode === "compact" && vp.w >= 640}
                    stickyClass={IS_MOBILE_BUILD ? "top-2 border-[#026EFF]/20" : "top-16"}
                    page={currentPage}
                    numPages={numPages}
                    onPage={(n) => {
                        closeEditors()
                        setSelectedMarkup(null)
                        const next = Math.max(1, Math.min(numPages, n))
                        setCurrentPage(next)
                        trimImages(next)
                        dropPreview(next)
                    }}
                    zoomPct={Math.round(view.zoom * 100)}
                    onZoom={zoomBy}
                    fitMode={fitMode}
                    onFit={(m) => fit(m)}
                    tool={tool}
                    onTool={(t) => {
                        closeEditors()
                        setSelectedMarkup(null)
                        setTool(t)
                    }}
                    color={markupColor}
                    onColor={setMarkupColor}
                    widthLevel={widthLevel}
                    onWidth={setWidthLevel}
                    stampLabel={stampLabel}
                    onStampLabel={setStampLabel}
                    stampDate={stampDate}
                    onStampDate={setStampDate}
                    scaleLabel={scaleLabel}
                    onCalibrate={() => {
                        closeEditors()
                        setTool("calibrate")
                    }}
                    onClearScale={() =>
                        setCalibrations((prev) => {
                            const n = new Map(prev)
                            n.delete(currentPage)
                            return n
                        })
                    }
                    canUndo={markups.length > 0}
                    onUndo={undoMarkup}
                    autocadMode={autocadMode}
                    onAutocadMode={setAutocadMode}
                    changeCount={changeCount}
                    onClearAll={() => {
                        if (confirm("Clear all text edits, deletions and markups on every page?")) {
                            setEdits(new Map())
                            setDeletedKeys(new Set())
                            setColorOverrides(new Map())
                            setMarkups([])
                            setSelectedMarkup(null)
                            closeEditors()
                        }
                    }}
                    showExport={!IS_MOBILE_BUILD}
                    onExport={() => void handleExport()}
                />
            </div>

            <div
                ref={legendRef}
                className={`flex items-center gap-x-4 gap-y-1 text-xs text-slate-500 ${toolbarMode === "compact" ? "flex-nowrap overflow-hidden whitespace-nowrap" : "flex-wrap"}`}
            >
                {model &&
                    (model.analyzed ? (
                        <span className={toolbarMode === "compact" ? "shrink-0" : ""}>
                            {toolbarMode === "compact"
                                ? `${model.textCount + model.shxCount} found`
                                : `${model.textCount} text and ${model.shxCount} SHX region${model.shxCount === 1 ? "" : "s"} found on this page`}
                        </span>
                    ) : (
                        <span>Finding text on this page...</span>
                    ))}
                {/* On phones the legend stays one line: the frame gets the height instead. */}
                <span className="inline-flex shrink-0 items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded-sm border border-orange-400 bg-orange-200/60" /> Text
                </span>
                <span className="inline-flex shrink-0 items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded-sm border border-violet-400 bg-violet-200/60" /> SHX{toolbarMode === "compact" ? "" : " lines"}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded-sm border border-green-500 bg-green-200/70" /> Edited
                </span>
                <span className="hidden truncate text-slate-400 sm:inline">
                    {tool === "select" ? (coarse ? "Pinch to zoom, tap text to edit" : "Ctrl + wheel to zoom, drag to pan") : toolHint(tool)}
                </span>
            </div>

            {model ? (
                <DrawingView
                    model={model}
                    image={images.get(currentPage)}
                    preview={preview?.page === currentPage ? preview.canvas : null}
                    onImageShown={() => dropPreview(-1)}
                    progress={pageBusy?.page === currentPage ? pageBusy : null}
                    pageNo={currentPage}
                    height={availH}
                    view={view}
                    setView={userView}
                    onFrameSize={(w, h) => setFrame((f) => (f.w === w && f.h === h ? f : { w, h }))}
                    tool={tool}
                    color={markupColor}
                    lineWidth={WIDTHS[widthLevel] * sheetUnit(model)}
                    regionState={(r) => {
                        const key = regionKey(currentPage, r.id)
                        return { edited: edits.get(key), deleted: deletedKeys.has(key), active: activeKey === key }
                    }}
                    onRegionClick={(r) => openRegion(currentPage, r)}
                    markups={pageMarkups}
                    selectedMarkup={selectedMarkup}
                    onSelectMarkup={(id) => {
                        closeEditors()
                        setSelectedMarkup(id)
                    }}
                    onBackgroundTap={() => {
                        closeEditors()
                        setSelectedMarkup(null)
                    }}
                    onDragDone={(t, a, b) => void onDragDone(t, a, b)}
                    onPlace={onPlace}
                    measureText={measureText}
                    liveLabel={(a, b) => lengthLabel(a, b, tool === "calibrate" ? null : cal)}
                    measureLine={dialog?.kind === "measure" ? dialog : null}
                    minHit={coarse ? 28 : 12}
                    overlay={overlay}
                />
            ) : (
                <div
                    data-testid="cad-loading"
                    className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-slate-100 px-6 text-center text-sm text-slate-600"
                    style={{ height: availH }}
                >
                    {pageError ?? (pageBusy?.page === currentPage ? pageBusy.label : `Rendering page ${currentPage}...`)}
                    {!pageError && <ProgressBar done={pageBusy?.page === currentPage ? pageBusy.done : null} />}
                </div>
            )}

            {selectedMarkup && pageMarkups.some((m) => m.id === selectedMarkup) && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600">Markup selected.</span>
                    <Button size="sm" variant="outline" className="h-8 border-red-300 text-red-600" onClick={() => deleteMarkup(selectedMarkup)}>
                        Delete markup
                    </Button>
                </div>
            )}

            <ChangeLists
                edits={[...edits.entries()]
                    .filter(([k]) => k.startsWith(pageKeyPrefix))
                    .map(([key, text]) => ({ key, text, original: regionByKey(key)?.originalText }))}
                deleted={[...deletedKeys].filter((k) => k.startsWith(pageKeyPrefix)).map((key) => ({ key, original: regionByKey(key)?.originalText }))}
                markups={pageMarkups}
                selected={selectedMarkup}
                onRemoveEdit={(key) => {
                    const n = new Map(edits)
                    n.delete(key)
                    setEdits(n)
                }}
                onRestore={(key) => {
                    const d = new Set(deletedKeys)
                    d.delete(key)
                    setDeletedKeys(d)
                }}
                onSelectMarkup={(id) => {
                    closeEditors()
                    setTool("select")
                    setSelectedMarkup(id)
                }}
                onDeleteMarkup={deleteMarkup}
            />

            {IS_MOBILE_BUILD ? (
                <div className="sticky bottom-0 z-30 -mx-4 border-t border-slate-100 bg-white/95 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur">
                    <button type="button" className="mobile-choose-btn w-full" disabled={changeCount === 0} onClick={() => void handleExport()}>
                        Save edited PDF{changeCount > 0 ? ` (${changeCount})` : ""}
                    </button>
                    <p className="mt-1 text-center text-xs text-slate-500">Tap outlined text to correct it. Pinch to zoom the drawing.</p>
                </div>
            ) : (
                <div className="pt-4">
                    <AdBanner variant="rectangle" />
                </div>
            )}
        </div>
    )
}
