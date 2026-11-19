"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
    AlertTriangle,
    Camera,
    ChevronLeft,
    ChevronRight,
    Copy,
    Crop,
    FileText,
    ImagePlus,
    Loader2,
    Plus,
    RotateCw,
    SwitchCamera,
    Trash2,
    X,
    Zap,
    ZapOff,
} from "lucide-react"
import { loadPdfjs } from "@/lib/pdfjs"
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import { finishConvert } from "@/lib/native-file"
import { haptic } from "@/lib/haptics"
import { detectDocumentQuad, lerpQuad, type DetectionResult, type Quad } from "@/lib/document-scanner"
import {
    findPage,
    frameToBlob,
    insetQuad,
    imageSize,
    processPage,
    renderPage,
    warmScanWorker,
    type ScanMode,
} from "@/lib/scan/engine"
import { paperFor, pdfPageSize } from "@/lib/scan/paper"
import CornerEditor from "./corner-editor"

interface ScanPage {
    id: string
    name: string
    /** Photo the page was cut from, kept so it can be re-cropped. */
    source: Blob | null
    sourceW: number
    sourceH: number
    /** Page corners in source pixels; null keeps the whole picture. */
    quad: Quad | null
    /** What edge detection found, for the editor's Auto button. */
    autoQuad: Quad | null
    original: Blob | null
    filtered: Blob | null
    url: string
    thumbUrl: string
    mode: ScanMode
    rotation: number
    width: number
    height: number
    busy: boolean
    /** Edges weren't found on an imported photo: worth a look in Crop. */
    checkCrop?: boolean
    error?: string
    text?: string
}

const MODES: { id: ScanMode; label: string }[] = [
    { id: "auto", label: "Auto" },
    { id: "original", label: "Original" },
    { id: "gray", label: "Grayscale" },
    { id: "bw", label: "B&W" },
]

/** Rough live look of each filter in the viewfinder; the real one runs on capture. */
const LIVE_LOOK: Record<ScanMode, string> = {
    auto: "contrast(1.15) brightness(1.05) saturate(1.1)",
    original: "none",
    gray: "grayscale(1) contrast(1.15)",
    bw: "grayscale(1) contrast(1.8) brightness(1.1)",
}

const MODE_KEY = "convertify-scan-mode"
const AUTO_KEY = "convertify-scan-auto"
/** Detections the outline survives without a page, so it doesn't flicker. */
const TRACK_GRACE_FRAMES = 8
/** Long side of the frame the page finder analyses. */
const DETECT_SIZE = 256
/** Steady detections in a row before auto-capture fires (~0.7 s). */
const STEADY_FRAMES = 10
/** Corner movement, as a share of the frame, that still counts as steady. */
const STEADY_TOLERANCE = 0.012

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

function mapQuad(q: Quad, f: (p: { x: number; y: number }) => { x: number; y: number }): Quad {
    return { tl: f(q.tl), tr: f(q.tr), br: f(q.br), bl: f(q.bl) }
}

const cornerMove = (a: Quad, b: Quad) =>
    Math.max(...(["tl", "tr", "br", "bl"] as const).map((k) => Math.hypot(a[k].x - b[k].x, a[k].y - b[k].y)))

/** Ease the outline toward the newest detection: glide over jitter, catch up on real movement. */
function followQuad(prev: Quad | null, next: Quad): Quad {
    if (!prev) return next
    return lerpQuad(prev, next, cornerMove(prev, next) > 24 ? 0.6 : 0.25)
}

/** `object-fit: cover` mapping between video pixels and the element box. */
function coverFit(vw: number, vh: number, ew: number, eh: number) {
    const s = Math.max(ew / vw, eh / vh)
    return { s, ox: (ew - vw * s) / 2, oy: (eh - vh * s) / 2 }
}

function readPref<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
    try {
        const v = localStorage.getItem(key) as T | null
        return v && allowed.includes(v) ? v : fallback
    } catch {
        return fallback
    }
}

function writePref(key: string, value: string) {
    try {
        localStorage.setItem(key, value)
    } catch {
        // private mode
    }
}

type PhotoCapture = { takePhoto: () => Promise<Blob> }

export default function OcrPdfClient() {
    const [pages, setPages] = useState<ScanPage[]>([])
    const [active, setActive] = useState(0)
    const [mode, setMode] = useState<ScanMode>("auto")
    const [applyAll, setApplyAll] = useState(false)
    const [autoShoot, setAutoShoot] = useState(true)
    const [cameraOn, setCameraOn] = useState(false)
    const [facing, setFacing] = useState<"environment" | "user">("environment")
    const [hasTorch, setHasTorch] = useState(false)
    const [torchOn, setTorchOn] = useState(false)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const [badge, setBadge] = useState("Point at a page")
    const [tracking, setTracking] = useState(false)
    const [flash, setFlash] = useState(false)
    const [editing, setEditing] = useState<{ id: string; url: string } | null>(null)
    const [exporting, setExporting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [textOpen, setTextOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const videoRef = useRef<HTMLVideoElement>(null)
    const overlayRef = useRef<HTMLCanvasElement>(null)
    const shutterRef = useRef<HTMLButtonElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const photoRef = useRef<PhotoCapture | null>(null)
    const photoBrokenRef = useRef(false)
    const latestRef = useRef<DetectionResult | null>(null)
    const modeRef = useRef(mode)
    const autoRef = useRef(autoShoot)
    const captureRef = useRef<() => void>(() => {})
    const pagesRef = useRef(pages)
    const fileRef = useRef<HTMLInputElement>(null)

    modeRef.current = mode
    autoRef.current = autoShoot
    pagesRef.current = pages

    useEffect(() => {
        setMode(readPref<ScanMode>(MODE_KEY, ["auto", "original", "gray", "bw"], "auto"))
        setAutoShoot(readPref(AUTO_KEY, ["on", "off"] as const, "on") === "on")
    }, [])

    // Free every page image when the scanner closes.
    useEffect(
        () => () => {
            for (const p of pagesRef.current) {
                if (p.url) URL.revokeObjectURL(p.url)
                if (p.thumbUrl) URL.revokeObjectURL(p.thumbUrl)
            }
        },
        [],
    )

    const patch = useCallback((id: string, change: Partial<ScanPage> | ((p: ScanPage) => Partial<ScanPage>)) => {
        setPages((prev) =>
            prev.map((p) => {
                if (p.id !== id) return p
                const c = typeof change === "function" ? change(p) : change
                if (c.url !== undefined && p.url && c.url !== p.url) URL.revokeObjectURL(p.url)
                if (c.thumbUrl !== undefined && p.thumbUrl && c.thumbUrl !== p.thumbUrl) URL.revokeObjectURL(p.thumbUrl)
                return { ...p, ...c }
            }),
        )
    }, [])

    /** Flatten + enhance a page from its source and put the result on screen. */
    const build = useCallback(
        async (id: string, input: { source: Blob; sourceW: number; sourceH: number; quad: Quad | null; mode: ScanMode; rotation: number }) => {
            try {
                const out = await processPage({
                    source: input.source,
                    sourceWidth: input.sourceW,
                    sourceHeight: input.sourceH,
                    quad: input.quad,
                    mode: input.mode,
                    rotation: input.rotation,
                })
                patch(id, {
                    original: out.original,
                    filtered: out.filtered,
                    url: URL.createObjectURL(out.filtered),
                    thumbUrl: URL.createObjectURL(out.thumb),
                    width: out.width,
                    height: out.height,
                    busy: false,
                    error: undefined,
                })
            } catch {
                patch(id, { busy: false, error: "This page couldn't be processed. Delete it and scan again." })
                void haptic("error")
            }
        },
        [patch],
    )

    const addPlaceholder = (name: string): string => {
        const id = newId()
        const page: ScanPage = {
            id,
            name,
            source: null,
            sourceW: 0,
            sourceH: 0,
            quad: null,
            autoQuad: null,
            original: null,
            filtered: null,
            url: "",
            thumbUrl: "",
            mode: modeRef.current,
            rotation: 0,
            width: 0,
            height: 0,
            busy: true,
        }
        setPages((prev) => [...prev, page])
        return id
    }

    // ---------------- Camera ----------------

    const stopCamera = useCallback(() => {
        streamRef.current?.getTracks().forEach((t) => {
            try {
                t.stop()
            } catch {
                // already stopped
            }
        })
        streamRef.current = null
        photoRef.current = null
        if (videoRef.current) videoRef.current.srcObject = null
        setTorchOn(false)
        setHasTorch(false)
        setTracking(false)
        latestRef.current = null
    }, [])

    const startCamera = useCallback(async () => {
        stopCamera()
        setCameraError(null)
        warmScanWorker()
        try {
            let stream: MediaStream
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1080 } },
                    audio: false,
                })
            } catch {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            }
            streamRef.current = stream
            setCameraOn(true)
            const track = stream.getVideoTracks()[0]
            if (track) {
                const caps = (track.getCapabilities?.() || {}) as { torch?: boolean }
                setHasTorch(Boolean(caps.torch))
                // Full-resolution stills where the WebView supports them; video frames otherwise.
                const IC = (window as unknown as { ImageCapture?: new (t: MediaStreamTrack) => PhotoCapture }).ImageCapture
                photoRef.current = IC && !photoBrokenRef.current ? new IC(track) : null
            }
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                await videoRef.current.play().catch(() => {})
            }
        } catch (err) {
            const name = (err as { name?: string })?.name
            const denied = name === "NotAllowedError" || name === "PermissionDeniedError"
            setCameraError(
                denied
                    ? "Camera access is off. Allow it in Settings, or import photos instead."
                    : "The camera couldn't be opened. Import photos or a PDF instead.",
            )
            setCameraOn(false)
        }
    }, [facing, stopCamera])

    // The app opens straight into the camera, like a scanner should.
    useEffect(() => {
        if (IS_MOBILE_BUILD && pagesRef.current.length === 0) void startCamera()
        return () => stopCamera()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (cameraOn) void startCamera()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facing])

    useEffect(() => {
        if (cameraOn && videoRef.current && streamRef.current && videoRef.current.srcObject !== streamRef.current) {
            videoRef.current.srcObject = streamRef.current
            void videoRef.current.play().catch(() => {})
        }
    }, [cameraOn])

    const closeCamera = () => {
        void haptic("tap")
        stopCamera()
        setCameraOn(false)
    }

    const toggleTorch = async () => {
        const track = streamRef.current?.getVideoTracks()[0]
        if (!track) return
        try {
            const next = !torchOn
            await (track as MediaStreamTrack & { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({ advanced: [{ torch: next }] })
            setTorchOn(next)
            void haptic("tap")
        } catch {
            setHasTorch(false)
        }
    }

    // Live edge tracking + auto-capture. Refs only inside the loop; React state
    // changes only when what's shown actually changes.
    useEffect(() => {
        if (!cameraOn) return
        let running = true
        let raf = 0
        const down = document.createElement("canvas")
        const dctx = down.getContext("2d", { willReadFrequently: true })
        let frame = 0
        let misses = 0
        let target: Quad | null = null
        let shown: Quad | null = null
        let prev: Quad | null = null
        let steady = 0
        let armed = true
        let lastShot = 0
        let shownTracking = false
        let shownBadge = ""
        let shownRing = -1
        const show = (t: boolean, b: string) => {
            if (t !== shownTracking) setTracking((shownTracking = t))
            if (b !== shownBadge) setBadge((shownBadge = b))
        }
        const ring = (p: number) => {
            const r = Math.round(p * 10) / 10
            if (r !== shownRing) {
                shownRing = r
                shutterRef.current?.style.setProperty("--p", String(r))
            }
        }

        const loop = () => {
            if (!running) return
            const video = videoRef.current
            const overlay = overlayRef.current
            if (video && overlay && dctx && video.readyState >= 2 && video.videoWidth > 0) {
                const rect = video.getBoundingClientRect()
                const ew = rect.width
                const eh = rect.height
                const dpr = Math.min(2, window.devicePixelRatio || 1)
                const bw = Math.round(ew * dpr)
                const bh = Math.round(eh * dpr)
                if (overlay.width !== bw || overlay.height !== bh) {
                    overlay.width = bw
                    overlay.height = bh
                }
                const vw = video.videoWidth
                const vh = video.videoHeight
                // ~30 fps camera: look for the page every other frame, glide in between.
                if (frame++ % 2 === 0) {
                    const k = DETECT_SIZE / Math.max(vw, vh)
                    const dw = Math.round(vw * k)
                    const dh = Math.round(vh * k)
                    if (down.width !== dw || down.height !== dh) {
                        down.width = dw
                        down.height = dh
                    }
                    dctx.drawImage(video, 0, 0, dw, dh)
                    const det = detectDocumentQuad(dctx.getImageData(0, 0, dw, dh), dw, dh)
                    if (det) {
                        misses = 0
                        const inVideo = mapQuad(det.quad, (p) => ({ x: p.x / k, y: p.y / k }))
                        latestRef.current = { ...det, quad: inVideo }
                        const fit = coverFit(vw, vh, ew, eh)
                        target = mapQuad(inVideo, (p) => ({ x: p.x * fit.s + fit.ox, y: p.y * fit.s + fit.oy }))
                        const moved = prev ? cornerMove(prev, inVideo) / Math.max(vw, vh) : 1
                        steady = moved < STEADY_TOLERANCE ? steady + 1 : 0
                        if (!armed && moved > 0.08) armed = true // a new page came into view
                        prev = inVideo
                        const now = performance.now()
                        if (autoRef.current && armed) {
                            ring(Math.min(1, steady / STEADY_FRAMES))
                            if (steady >= STEADY_FRAMES && now - lastShot > 1500) {
                                armed = false
                                lastShot = now
                                steady = 0
                                ring(0)
                                captureRef.current()
                            }
                            show(true, steady > 2 ? "Hold steady…" : "Page found")
                        } else {
                            ring(0)
                            show(true, autoRef.current ? "Move to the next page" : "Page found")
                        }
                    } else if (++misses > TRACK_GRACE_FRAMES) {
                        target = null
                        shown = null
                        prev = null
                        steady = 0
                        armed = true
                        latestRef.current = null
                        ring(0)
                        show(false, "Point at a page")
                    }
                }
                if (target) shown = followQuad(shown, target)

                const g = overlay.getContext("2d")
                if (g) {
                    g.setTransform(dpr, 0, 0, dpr, 0, 0)
                    g.clearRect(0, 0, ew, eh)
                    if (shown) {
                        const { tl, tr, br, bl } = shown
                        g.fillStyle = "rgba(2, 10, 30, 0.45)"
                        g.beginPath()
                        g.rect(0, 0, ew, eh)
                        g.moveTo(tl.x, tl.y)
                        g.lineTo(bl.x, bl.y)
                        g.lineTo(br.x, br.y)
                        g.lineTo(tr.x, tr.y)
                        g.closePath()
                        g.fill("evenodd")
                        g.beginPath()
                        g.moveTo(tl.x, tl.y)
                        g.lineTo(tr.x, tr.y)
                        g.lineTo(br.x, br.y)
                        g.lineTo(bl.x, bl.y)
                        g.closePath()
                        g.fillStyle = "rgba(59, 139, 255, 0.12)"
                        g.fill()
                        g.strokeStyle = "#3b8bff"
                        g.lineWidth = 3
                        g.lineJoin = "round"
                        g.stroke()
                        g.fillStyle = "#ffffff"
                        for (const p of [tl, tr, br, bl]) {
                            g.beginPath()
                            g.arc(p.x, p.y, 6, 0, Math.PI * 2)
                            g.fill()
                        }
                    }
                }
            }
            raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
        return () => {
            running = false
            cancelAnimationFrame(raf)
        }
    }, [cameraOn])

    /** Full-resolution still, or null to use the video frame. Gives up for the session if it fails. */
    const takePhoto = async (): Promise<Blob | null> => {
        const cap = photoRef.current
        if (!cap || photoBrokenRef.current) return null
        try {
            return await Promise.race([
                cap.takePhoto(),
                new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
            ])
        } catch {
            photoBrokenRef.current = true
            photoRef.current = null
            return null
        }
    }

    const capture = async () => {
        const video = videoRef.current
        if (!video || !video.videoWidth) return
        void haptic("heavy")
        setFlash(true)
        setTimeout(() => setFlash(false), 180)
        const vw = video.videoWidth
        const vh = video.videoHeight
        const det = latestRef.current
        let quad: Quad
        if (det) {
            quad = insetQuad(det.quad)
        } else {
            // No page found: keep what's inside the on-screen guide.
            const r = video.getBoundingClientRect()
            const fit = coverFit(vw, vh, r.width, r.height)
            const toVideo = (x: number, y: number) => ({ x: (x - fit.ox) / fit.s, y: (y - fit.oy) / fit.s })
            const px = r.width * 0.08
            const py = r.height * 0.08
            quad = { tl: toVideo(px, py), tr: toVideo(r.width - px, py), br: toVideo(r.width - px, r.height - py), bl: toVideo(px, r.height - py) }
        }
        let frameBmp: ImageBitmap
        try {
            frameBmp = await createImageBitmap(video)
        } catch {
            return
        }
        const id = addPlaceholder(`Page ${pagesRef.current.length + 1}`)
        const pageMode = modeRef.current
        void (async () => {
            let source: Blob | null = null
            let sw = vw
            let sh = vh
            let pageQuad: Quad | null = quad
            let autoQuad: Quad | null = det ? quad : null
            const photo = await takePhoto()
            if (photo) {
                try {
                    const size = await imageSize(photo)
                    const found = await findPage(photo, size.width, size.height)
                    if (found) {
                        source = photo
                        sw = size.width
                        sh = size.height
                        pageQuad = found
                        autoQuad = found
                    } else if (Math.abs(size.width / size.height - vw / vh) < 0.02) {
                        // Same framing as the preview: scale the preview's corners up.
                        const k = size.width / vw
                        source = photo
                        sw = size.width
                        sh = size.height
                        pageQuad = mapQuad(quad, (p) => ({ x: p.x * k, y: p.y * k }))
                        autoQuad = det ? pageQuad : null
                    }
                } catch {
                    // fall back to the frame
                }
            }
            if (!source) {
                const f = await frameToBlob(frameBmp)
                source = f.blob
                sw = f.width
                sh = f.height
            }
            frameBmp.close()
            patch(id, { source, sourceW: sw, sourceH: sh, quad: pageQuad, autoQuad })
            await build(id, { source, sourceW: sw, sourceH: sh, quad: pageQuad, mode: pageMode, rotation: 0 })
        })()
    }
    captureRef.current = () => void capture()

    const finishCamera = () => {
        void haptic("tap")
        stopCamera()
        setCameraOn(false)
        setActive(Math.max(0, pagesRef.current.length - 1))
    }

    // ---------------- Import ----------------

    const importFiles = async (list: FileList | null) => {
        if (!list || list.length === 0) return
        const files = Array.from(list)
        stopCamera()
        setCameraOn(false)
        setError(null)
        warmScanWorker()
        const firstNew = pagesRef.current.length
        for (const f of files) {
            const isPdf = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
            if (isPdf) {
                try {
                    const pdfjs = await loadPdfjs()
                    const doc = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise
                    for (let n = 1; n <= doc.numPages; n++) {
                        const id = addPlaceholder(`${f.name} · page ${n}`)
                        const page = await doc.getPage(n)
                        const viewport = page.getViewport({ scale: 2 })
                        const canvas = document.createElement("canvas")
                        canvas.width = Math.round(viewport.width)
                        canvas.height = Math.round(viewport.height)
                        // CPU canvas: its toBlob doesn't stall the Android WebView.
                        const ctx = canvas.getContext("2d", { willReadFrequently: true })
                        if (!ctx) continue
                        await (page.render as (p: unknown) => { promise: Promise<void> })({ canvasContext: ctx, viewport }).promise
                        let text = ""
                        try {
                            const content = await page.getTextContent()
                            text = (content.items as { str?: string }[]).map((it) => it.str ?? "").join(" ").trim()
                        } catch {
                            // no text layer
                        }
                        const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.92))
                        if (!blob) {
                            patch(id, { busy: false, error: "This page couldn't be read." })
                            continue
                        }
                        patch(id, { source: blob, sourceW: canvas.width, sourceH: canvas.height, text })
                        await build(id, { source: blob, sourceW: canvas.width, sourceH: canvas.height, quad: null, mode: modeRef.current, rotation: 0 })
                    }
                } catch {
                    setError(`${f.name} couldn't be opened. If it has a password, unlock it first.`)
                }
            } else if (f.type.startsWith("image/") || /\.(jpe?g|png|webp|heic|heif)$/i.test(f.name)) {
                const id = addPlaceholder(f.name)
                try {
                    const size = await imageSize(f)
                    const found = await findPage(f, size.width, size.height)
                    patch(id, { source: f, sourceW: size.width, sourceH: size.height, quad: found, autoQuad: found, checkCrop: !found })
                    await build(id, { source: f, sourceW: size.width, sourceH: size.height, quad: found, mode: modeRef.current, rotation: 0 })
                } catch {
                    patch(id, { busy: false, error: `${f.name} couldn't be opened.` })
                }
            }
        }
        setActive((a) => (pagesRef.current.length > firstNew ? firstNew : a))
    }

    // ---------------- Page actions ----------------

    const page = pages[active] ?? null

    const rerender = async (p: ScanPage, nextMode: ScanMode, rotation: number) => {
        if (!p.original) return
        patch(p.id, { busy: true })
        try {
            const out = await renderPage(p.original, nextMode, rotation)
            patch(p.id, {
                mode: nextMode,
                rotation,
                filtered: out.filtered,
                url: URL.createObjectURL(out.filtered),
                thumbUrl: URL.createObjectURL(out.thumb),
                width: out.width,
                height: out.height,
                busy: false,
            })
        } catch {
            patch(p.id, { busy: false })
            setError("That change couldn't be applied. Try again.")
        }
    }

    const chooseMode = async (m: ScanMode) => {
        void haptic("select")
        setMode(m)
        writePref(MODE_KEY, m)
        const targets = applyAll ? pagesRef.current : page ? [page] : []
        for (const p of targets) {
            if (p.mode !== m && !p.busy) await rerender(p, m, p.rotation)
        }
    }

    const rotate = () => {
        if (!page || page.busy) return
        void haptic("tap")
        void rerender(page, page.mode, (page.rotation + 90) % 360)
    }

    const remove = (index: number) => {
        void haptic("tap")
        setPages((prev) => {
            const p = prev[index]
            if (p?.url) URL.revokeObjectURL(p.url)
            if (p?.thumbUrl) URL.revokeObjectURL(p.thumbUrl)
            return prev.filter((_, i) => i !== index)
        })
        setActive((a) => Math.max(0, Math.min(a, pagesRef.current.length - 2)))
    }

    const moveActive = (dir: -1 | 1) => {
        const to = active + dir
        if (to < 0 || to >= pages.length) return
        void haptic("select")
        setPages((prev) => {
            const next = prev.slice()
            ;[next[active], next[to]] = [next[to], next[active]]
            return next
        })
        setActive(to)
    }

    const openCrop = () => {
        if (!page?.source || page.busy) return
        void haptic("tap")
        setEditing({ id: page.id, url: URL.createObjectURL(page.source) })
    }

    const applyCrop = async (quad: Quad | null) => {
        const ed = editing
        setEditing(null)
        if (ed) URL.revokeObjectURL(ed.url)
        const p = pagesRef.current.find((x) => x.id === ed?.id)
        if (!p || !p.source) return
        patch(p.id, { quad, busy: true, checkCrop: false })
        await build(p.id, { source: p.source, sourceW: p.sourceW, sourceH: p.sourceH, quad, mode: p.mode, rotation: p.rotation })
    }

    const ready = pages.filter((p) => p.filtered && !p.busy)
    const anyBusy = pages.some((p) => p.busy)

    const exportPdf = async () => {
        if (ready.length === 0 || anyBusy) return
        void haptic("heavy")
        setExporting(true)
        setError(null)
        try {
            const { PDFDocument } = await import("pdf-lib")
            const pdf = await PDFDocument.create()
            for (const p of ready) {
                const img = await pdf.embedJpg(await (p.filtered as Blob).arrayBuffer())
                const [w, h] = pdfPageSize(p.width, p.height)
                pdf.addPage([w, h]).drawImage(img, { x: 0, y: 0, width: w, height: h })
            }
            const blob = new Blob([(await pdf.save()) as BlobPart], { type: "application/pdf" })
            const d = new Date()
            const two = (n: number) => String(n).padStart(2, "0")
            const filename = `scan-${d.getFullYear()}${two(d.getMonth() + 1)}${two(d.getDate())}-${two(d.getHours())}${two(d.getMinutes())}.pdf`
            const first = ready[0]
            const kind = paperFor(Math.max(first.width, first.height) / Math.max(1, Math.min(first.width, first.height))).kind
            const paper = { a4: "A4", letter: "Letter", legal: "Legal", card: "ID card size", other: "" }[kind]
            const note = `${ready.length} page${ready.length === 1 ? "" : "s"}${paper ? ` · ${paper}` : ""}`
            if (IS_MOBILE_BUILD) {
                await finishConvert(blob, filename, note)
            } else {
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = filename
                a.click()
                setTimeout(() => URL.revokeObjectURL(url), 1000)
            }
        } catch {
            setError("The PDF couldn't be made. Try again.")
            void haptic("error")
        } finally {
            setExporting(false)
        }
    }

    const pageText = pages
        .filter((p) => p.text)
        .map((p, i) => `Page ${i + 1}\n${p.text}`)
        .join("\n\n")

    // ---------------- Render ----------------

    const editingPage = editing ? pages.find((p) => p.id === editing.id) : null

    return (
        <div className="scan-root">
            <input
                ref={fileRef}
                type="file"
                accept="image/*,application/pdf"
                multiple
                hidden
                onChange={(e) => {
                    void importFiles(e.target.files)
                    e.target.value = ""
                }}
            />

            {cameraOn && (
                <div className="scan-camera">
                    <div className="scan-camera-top">
                        <button type="button" className="scan-icon-btn" aria-label="Close Camera" onClick={closeCamera}>
                            <X size={22} />
                        </button>
                        <div className={`scan-badge${tracking ? " is-on" : ""}`}>{badge}</div>
                        <div className="scan-camera-top-right">
                            <button
                                type="button"
                                className={`scan-pill${autoShoot ? " is-on" : ""}`}
                                onClick={() => {
                                    const next = !autoShoot
                                    setAutoShoot(next)
                                    writePref(AUTO_KEY, next ? "on" : "off")
                                    void haptic("select")
                                }}
                                aria-pressed={autoShoot}
                            >
                                Auto
                            </button>
                            {hasTorch && (
                                <button type="button" className="scan-icon-btn" aria-label="Flash" onClick={toggleTorch}>
                                    {torchOn ? <Zap size={20} fill="currentColor" /> : <ZapOff size={20} />}
                                </button>
                            )}
                            <button
                                type="button"
                                className="scan-icon-btn"
                                aria-label="Switch camera"
                                onClick={() => {
                                    void haptic("tap")
                                    setFacing((f) => (f === "environment" ? "user" : "environment"))
                                }}
                            >
                                <SwitchCamera size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="scan-viewfinder">
                        <video
                            ref={videoRef}
                            playsInline
                            muted
                            autoPlay
                            className="scan-video"
                            style={{ filter: LIVE_LOOK[mode] }}
                        />
                        <canvas ref={overlayRef} className="scan-overlay" />
                        {flash && <div className="scan-flash" />}
                    </div>

                    <div className="scan-camera-bottom">
                        <div className="scan-modes is-dark" role="radiogroup" aria-label="Filter">
                            {MODES.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={mode === m.id}
                                    className={`scan-mode${mode === m.id ? " is-on" : ""}`}
                                    onClick={() => {
                                        setMode(m.id)
                                        writePref(MODE_KEY, m.id)
                                        void haptic("select")
                                    }}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                        <div className="scan-shutter-row">
                            <button type="button" className="scan-side-btn" onClick={() => fileRef.current?.click()}>
                                <ImagePlus size={22} />
                                <span>Import</span>
                            </button>
                            <button ref={shutterRef} type="button" className="scan-shutter" aria-label="Capture page" onClick={() => void capture()}>
                                <span />
                            </button>
                            {pages.length > 0 ? (
                                <button type="button" className="scan-side-btn scan-done-btn" onClick={finishCamera}>
                                    <span className="scan-done-thumb">
                                        {pages[pages.length - 1]?.thumbUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={pages[pages.length - 1].thumbUrl} alt="" />
                                        ) : (
                                            <Loader2 size={18} className="scan-spin" />
                                        )}
                                        <b>{pages.length}</b>
                                    </span>
                                    <span>Done</span>
                                </button>
                            ) : (
                                <span className="scan-side-btn" aria-hidden />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!cameraOn && pages.length === 0 && (
                <div className="scan-intro">
                    <div className="scan-intro-icon">
                        <Camera size={30} />
                    </div>
                    <h2>Scan documents</h2>
                    <p>Point the camera at a page. Edges are found for you, shadows are removed, and the pages are saved as one PDF.</p>
                    {cameraError && <p className="scan-error">{cameraError}</p>}
                    <button type="button" className="scan-primary" onClick={() => void startCamera()}>
                        <Camera size={20} />
                        Scan with camera
                    </button>
                    <button type="button" className="scan-secondary" onClick={() => fileRef.current?.click()}>
                        <ImagePlus size={20} />
                        Import photos or PDF
                    </button>
                </div>
            )}

            {!cameraOn && pages.length > 0 && (
                <div className="scan-review">
                    <div className="scan-review-head">
                        <span className="scan-count">
                            Page {Math.min(active + 1, pages.length)} of {pages.length}
                        </span>
                        <div className="scan-tools">
                            <button type="button" className="scan-tool-btn" onClick={openCrop} disabled={!page?.source || page.busy}>
                                <Crop size={20} />
                                <span>Crop</span>
                            </button>
                            <button type="button" className="scan-tool-btn" onClick={rotate} disabled={!page?.original || page.busy}>
                                <RotateCw size={20} />
                                <span>Rotate</span>
                            </button>
                            <button type="button" className="scan-tool-btn is-danger" onClick={() => remove(active)} disabled={!page}>
                                <Trash2 size={20} />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>

                    <div className="scan-preview">
                        {page?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={page.url} alt={`Page ${active + 1}`} decoding="async" />
                        ) : null}
                        {page?.busy && (
                            <div className="scan-preview-busy">
                                <Loader2 size={28} className="scan-spin" />
                                <span>Cleaning up the page…</span>
                            </div>
                        )}
                        {page?.error && <p className="scan-error scan-preview-error">{page.error}</p>}
                    </div>

                    {page?.checkCrop && !page.busy && (
                        <button type="button" className="scan-hint" onClick={openCrop}>
                            <AlertTriangle size={16} />
                            Edges weren&apos;t found in this photo. Tap to crop it.
                        </button>
                    )}

                    <div className="scan-modes" role="radiogroup" aria-label="Filter">
                        {MODES.map((m) => (
                            <button
                                key={m.id}
                                type="button"
                                role="radio"
                                aria-checked={(page?.mode ?? mode) === m.id}
                                className={`scan-mode${(page?.mode ?? mode) === m.id ? " is-on" : ""}`}
                                onClick={() => void chooseMode(m.id)}
                                disabled={!page || page.busy}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                    {pages.length > 1 && (
                        <label className="scan-switch">
                            <input
                                type="checkbox"
                                checked={applyAll}
                                onChange={(e) => {
                                    setApplyAll(e.target.checked)
                                    void haptic("select")
                                }}
                            />
                            <span className="scan-switch-track" aria-hidden />
                            <span>Filter changes apply to all pages</span>
                        </label>
                    )}

                    <div className="scan-strip">
                        {pages.map((p, i) => (
                            <button
                                key={p.id}
                                type="button"
                                className={`scan-thumb${i === active ? " is-on" : ""}`}
                                onClick={() => {
                                    void haptic("select")
                                    setActive(i)
                                }}
                                aria-label={`Page ${i + 1}`}
                            >
                                {p.thumbUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={p.thumbUrl} alt="" />
                                ) : (
                                    <Loader2 size={18} className="scan-spin" />
                                )}
                                <span>{i + 1}</span>
                            </button>
                        ))}
                        <button type="button" className="scan-thumb scan-thumb-add" onClick={() => void startCamera()} aria-label="Add page">
                            <Plus size={22} />
                        </button>
                    </div>
                    {pages.length > 1 && (
                        <div className="scan-move">
                            <button type="button" className="scan-tool-btn" onClick={() => moveActive(-1)} disabled={active === 0}>
                                <ChevronLeft size={18} />
                                <span>Move earlier</span>
                            </button>
                            <button type="button" className="scan-tool-btn" onClick={() => moveActive(1)} disabled={active >= pages.length - 1}>
                                <span>Move later</span>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                    {error && <p className="scan-error">{error}</p>}

                    <div className="scan-actions">
                        <button type="button" className="scan-secondary" onClick={() => fileRef.current?.click()}>
                            <ImagePlus size={20} />
                            Import
                        </button>
                        <button type="button" className="scan-primary" onClick={() => void exportPdf()} disabled={exporting || anyBusy || ready.length === 0}>
                            {exporting || anyBusy ? <Loader2 size={20} className="scan-spin" /> : <FileText size={20} />}
                            {anyBusy ? "Finishing pages…" : `Save PDF (${ready.length} page${ready.length === 1 ? "" : "s"})`}
                        </button>
                    </div>

                    {pageText && (
                        <div className="scan-text">
                            <button type="button" className="scan-tool-btn" onClick={() => setTextOpen((o) => !o)}>
                                <FileText size={18} />
                                <span>{textOpen ? "Hide text" : "Show text from the PDF"}</span>
                            </button>
                            {textOpen && (
                                <>
                                    <textarea readOnly value={pageText} rows={8} />
                                    <button
                                        type="button"
                                        className="scan-tool-btn"
                                        onClick={() => {
                                            void navigator.clipboard?.writeText(pageText)
                                            setCopied(true)
                                            void haptic("success")
                                            setTimeout(() => setCopied(false), 1600)
                                        }}
                                    >
                                        <Copy size={18} />
                                        <span>{copied ? "Copied" : "Copy text"}</span>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {editing && editingPage && (
                <CornerEditor
                    src={editing.url}
                    width={editingPage.sourceW}
                    height={editingPage.sourceH}
                    quad={editingPage.quad}
                    autoQuad={editingPage.autoQuad}
                    onApply={(q) => void applyCrop(q)}
                    onCancel={() => {
                        URL.revokeObjectURL(editing.url)
                        setEditing(null)
                    }}
                />
            )}
        </div>
    )
}
