"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { PDFDocument } from "pdf-lib"
import { loadPdfjs } from "@/lib/pdfjs"
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import { finishConvert } from "@/lib/native-file"
import { tapHaptic } from "@/lib/haptics"
import {
    detectDocumentQuad,
    lerpQuad,
    warpQuadToCanvas,
    applyDocumentFilter,
    type Quad,
    type ScanFilter,
    type DetectionResult,
} from "@/lib/document-scanner"
import {
    Camera,
    Upload,
    ScanLine,
    RotateCw,
    Trash2,
    Plus,
    FileText,
    Check,
    Copy,
    Download,
    RefreshCw,
    SlidersHorizontal,
    Printer,
    Zap,
    ZapOff,
    SwitchCamera,
    X,
    Sparkles,
} from "lucide-react"

export interface ScannedPage {
    id: string
    sourceName: string
    originalUrl: string
    filteredBlob: Blob | null
    filteredUrl: string
    filter: ScanFilter
    rotation: number // 0, 90, 180, 270
    width: number
    height: number
    extractedText?: string
}

const FILTERS: { id: ScanFilter; label: string; desc: string; icon: string }[] = [
    { id: "xerox", label: "Xerox B&W", desc: "Clean photocopy, removes paper shadows", icon: "📄" },
    { id: "magic", label: "Magic Color", desc: "Bright paper, keeps blue/red stamps", icon: "✨" },
    { id: "grayscale", label: "Grayscale", desc: "Smooth monochrome document", icon: "🔲" },
    { id: "original", label: "Original", desc: "Unfiltered photo colors", icon: "🎨" },
]

export default function OcrPdfClient() {
    const [pages, setPages] = useState<ScannedPage[]>([])
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [statusMessage, setStatusMessage] = useState<string>("")
    const [ocrText, setOcrText] = useState<string>("")
    const [showOcrBox, setShowOcrBox] = useState<boolean>(false)
    const [copied, setCopied] = useState<boolean>(false)

    // Camera viewfinder state
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false)
    const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment")
    const [hasFlash, setHasFlash] = useState<boolean>(false)
    const [flashOn, setFlashOn] = useState<boolean>(false)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const [cameraFilter, setCameraFilter] = useState<ScanFilter>("xerox")
    const [shutterFlashing, setShutterFlashing] = useState<boolean>(false)
    const [detectedDocBadge, setDetectedDocBadge] = useState<string>("Align document in frame")
    const [isTrackingDocument, setIsTrackingDocument] = useState<boolean>(false)

    // Camera refs
    const videoRef = useRef<HTMLVideoElement>(null)
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const animFrameRef = useRef<number | null>(null)
    const downscaleCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const trackedQuadRef = useRef<Quad | null>(null)
    const latestDetectionRef = useRef<DetectionResult | null>(null)

    // File input fallback refs
    const fileInputRef = useRef<HTMLInputElement>(null)
    const addMoreFileRef = useRef<HTMLInputElement>(null)

    const activePage = pages[activeIndex] ?? null

    // Render filter on HTMLImageElement (used for rotation or filter-swapping existing pages)
    const renderFilter = (
        img: HTMLImageElement,
        filter: ScanFilter,
        rotation: number
    ): Promise<{ blob: Blob; url: string }> => {
        return new Promise((resolve) => {
            const isSideways = rotation === 90 || rotation === 270
            const w = isSideways ? img.naturalHeight : img.naturalWidth
            const h = isSideways ? img.naturalWidth : img.naturalHeight

            const canvas = document.createElement("canvas")
            canvas.width = w
            canvas.height = h
            const ctx = canvas.getContext("2d", { willReadFrequently: true })
            if (!ctx) {
                canvas.toBlob((b) => resolve({ blob: b!, url: URL.createObjectURL(b!) }), "image/jpeg", 0.9)
                return
            }

            ctx.save()
            ctx.translate(w / 2, h / 2)
            ctx.rotate((rotation * Math.PI) / 180)
            ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
            ctx.restore()

            if (filter !== "original") {
                applyDocumentFilter(canvas, filter)
            }

            canvas.toBlob((b) => {
                const blob = b || new Blob()
                resolve({ blob, url: URL.createObjectURL(blob) })
            }, "image/jpeg", 0.92)
        })
    }

    // Stop active camera stream tracks
    const stopCamera = useCallback(() => {
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current)
            animFrameRef.current = null
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                try {
                    track.stop()
                } catch {
                    // ignore
                }
            })
            streamRef.current = null
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null
        }
        setFlashOn(false)
        setHasFlash(false)
        setIsTrackingDocument(false)
        trackedQuadRef.current = null
        latestDetectionRef.current = null
    }, [])

    // Start live camera stream
    const startCamera = useCallback(async () => {
        stopCamera()
        setCameraError(null)

        try {
            let stream: MediaStream | null = null
            try {
                // Try ideal resolution with requested facing mode
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: cameraFacing },
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                    },
                    audio: false,
                })
            } catch {
                // Fallback to basic video constraint
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                })
            }

            streamRef.current = stream
            setIsCameraActive(true)

            if (videoRef.current) {
                videoRef.current.srcObject = stream
                await videoRef.current.play().catch(() => {})
            }

            // Check torch / flash capability
            const videoTrack = stream.getVideoTracks()[0]
            if (videoTrack) {
                const capabilities = (videoTrack.getCapabilities?.() || {}) as any
                setHasFlash(Boolean(capabilities.torch))
            }
        } catch (err: any) {
            console.error("Camera access error:", err)
            const msg =
                err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError"
                    ? "Camera permission denied. Please allow camera access in Settings or upload a document photo."
                    : "Could not open camera on this device. Please select a photo or document file."
            setCameraError(msg)
            setIsCameraActive(false)
        }
    }, [cameraFacing, stopCamera])

    // Ensure video element receives stream immediately when viewfinder mounts
    useEffect(() => {
        if (isCameraActive && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current
            void videoRef.current.play().catch(() => {})
        }
    }, [isCameraActive])

    // Toggle camera torch / flash
    const toggleFlash = async () => {
        if (!streamRef.current) return
        const track = streamRef.current.getVideoTracks()[0]
        if (!track) return
        try {
            const next = !flashOn
            await (track as any).applyConstraints({
                advanced: [{ torch: next }],
            })
            setFlashOn(next)
            void tapHaptic("light")
        } catch (err) {
            console.warn("Torch error:", err)
        }
    }

    // Flip camera between front & back
    const switchCamera = () => {
        void tapHaptic("light")
        setCameraFacing((prev) => (prev === "environment" ? "user" : "environment"))
    }

    // Re-start camera when cameraFacing changes and camera is active
    useEffect(() => {
        if (isCameraActive) {
            void startCamera()
        }
    }, [cameraFacing]) // eslint-disable-line react-hooks/exhaustive-deps

    // Cleanup camera when component unmounts
    useEffect(() => {
        return () => {
            stopCamera()
        }
    }, [stopCamera])

    // Real-time document edge tracking animation frame loop
    useEffect(() => {
        if (!isCameraActive) return

        let running = true
        const DOWNSCALE_W = 320
        const DOWNSCALE_H = 240

        if (!downscaleCanvasRef.current) {
            const cvs = document.createElement("canvas")
            cvs.width = DOWNSCALE_W
            cvs.height = DOWNSCALE_H
            downscaleCanvasRef.current = cvs
        }
        const downCanvas = downscaleCanvasRef.current
        const downCtx = downCanvas.getContext("2d", { willReadFrequently: true })

        let scanBeamPos = 0
        let scanBeamDir = 1

        const loop = () => {
            if (!running) return

            const video = videoRef.current
            const overlay = overlayCanvasRef.current

            if (video && overlay && video.readyState >= 2 && downCtx) {
                // Ensure overlay canvas dimensions match video element rendered bounds
                const rect = video.getBoundingClientRect()
                if (overlay.width !== rect.width || overlay.height !== rect.height) {
                    overlay.width = rect.width
                    overlay.height = rect.height
                }

                const oCtx = overlay.getContext("2d")
                if (oCtx) {
                    oCtx.clearRect(0, 0, overlay.width, overlay.height)

                    // Draw video to downscaled canvas for edge analysis
                    downCtx.drawImage(video, 0, 0, DOWNSCALE_W, DOWNSCALE_H)
                    const imgData = downCtx.getImageData(0, 0, DOWNSCALE_W, DOWNSCALE_H)

                    // Detect document quad in real time
                    const detection = detectDocumentQuad(imgData, DOWNSCALE_W, DOWNSCALE_H)

                    const scaleX = overlay.width / DOWNSCALE_W
                    const scaleY = overlay.height / DOWNSCALE_H

                    if (detection) {
                        latestDetectionRef.current = detection
                        const screenQuad: Quad = {
                            tl: { x: detection.quad.tl.x * scaleX, y: detection.quad.tl.y * scaleY },
                            tr: { x: detection.quad.tr.x * scaleX, y: detection.quad.tr.y * scaleY },
                            br: { x: detection.quad.br.x * scaleX, y: detection.quad.br.y * scaleY },
                            bl: { x: detection.quad.bl.x * scaleX, y: detection.quad.bl.y * scaleY },
                        }

                        // Apply LERP smoothing for smooth bounding box
                        const smoothed = lerpQuad(trackedQuadRef.current, screenQuad, 0.38)
                        trackedQuadRef.current = smoothed
                        setIsTrackingDocument(true)
                        setDetectedDocBadge(`📄 ${detection.docType} • Auto-Tracking`)

                        const { tl, tr, br, bl } = smoothed

                        // 1. Semi-transparent backdrop outside the tracked document
                        oCtx.save()
                        oCtx.fillStyle = "rgba(15, 23, 42, 0.42)"
                        oCtx.beginPath()
                        oCtx.rect(0, 0, overlay.width, overlay.height)
                        oCtx.moveTo(tl.x, tl.y)
                        oCtx.lineTo(bl.x, bl.y)
                        oCtx.lineTo(br.x, br.y)
                        oCtx.lineTo(tr.x, tr.y)
                        oCtx.closePath()
                        oCtx.fill("evenodd")
                        oCtx.restore()

                        // 2. Glowing high-contrast emerald edge outline
                        oCtx.save()
                        oCtx.strokeStyle = "#10B981"
                        oCtx.lineWidth = 3
                        oCtx.shadowColor = "#10B981"
                        oCtx.shadowBlur = 10
                        oCtx.beginPath()
                        oCtx.moveTo(tl.x, tl.y)
                        oCtx.lineTo(tr.x, tr.y)
                        oCtx.lineTo(br.x, br.y)
                        oCtx.lineTo(bl.x, bl.y)
                        oCtx.closePath()
                        oCtx.stroke()
                        oCtx.restore()

                        // 3. Tactile corner bracket reticles
                        const BRACKET = 22
                        oCtx.save()
                        oCtx.strokeStyle = "#FFFFFF"
                        oCtx.lineWidth = 4.5
                        oCtx.lineCap = "round"
                        oCtx.lineJoin = "round"

                        // Top-Left corner
                        oCtx.beginPath()
                        oCtx.moveTo(tl.x, tl.y + BRACKET)
                        oCtx.lineTo(tl.x, tl.y)
                        oCtx.lineTo(tl.x + BRACKET, tl.y)
                        oCtx.stroke()

                        // Top-Right corner
                        oCtx.beginPath()
                        oCtx.moveTo(tr.x - BRACKET, tr.y)
                        oCtx.lineTo(tr.x, tr.y)
                        oCtx.lineTo(tr.x, tr.y + BRACKET)
                        oCtx.stroke()

                        // Bottom-Right corner
                        oCtx.beginPath()
                        oCtx.moveTo(br.x, br.y - BRACKET)
                        oCtx.lineTo(br.x, br.y)
                        oCtx.lineTo(br.x - BRACKET, br.y)
                        oCtx.stroke()

                        // Bottom-Left corner
                        oCtx.beginPath()
                        oCtx.moveTo(bl.x + BRACKET, bl.y)
                        oCtx.lineTo(bl.x, bl.y)
                        oCtx.lineTo(bl.x, bl.y - BRACKET)
                        oCtx.stroke()
                        oCtx.restore()

                        // 4. Animated laser scanning beam
                        scanBeamPos += 0.02 * scanBeamDir
                        if (scanBeamPos > 1) {
                            scanBeamPos = 1
                            scanBeamDir = -1
                        } else if (scanBeamPos < 0) {
                            scanBeamPos = 0
                            scanBeamDir = 1
                        }

                        const beamLeftX = tl.x + (bl.x - tl.x) * scanBeamPos
                        const beamLeftY = tl.y + (bl.y - tl.y) * scanBeamPos
                        const beamRightX = tr.x + (br.x - tr.x) * scanBeamPos
                        const beamRightY = tr.y + (br.y - tr.y) * scanBeamPos

                        oCtx.save()
                        const grad = oCtx.createLinearGradient(beamLeftX, beamLeftY, beamRightX, beamRightY)
                        grad.addColorStop(0, "rgba(52, 211, 153, 0)")
                        grad.addColorStop(0.5, "rgba(52, 211, 153, 0.95)")
                        grad.addColorStop(1, "rgba(52, 211, 153, 0)")
                        oCtx.strokeStyle = grad
                        oCtx.lineWidth = 3
                        oCtx.beginPath()
                        oCtx.moveTo(beamLeftX, beamLeftY)
                        oCtx.lineTo(beamRightX, beamRightY)
                        oCtx.stroke()
                        oCtx.restore()
                    } else {
                        // Relax towards default guide frame
                        setIsTrackingDocument(false)
                        setDetectedDocBadge("Align document within frame")

                        const padX = overlay.width * 0.12
                        const padY = overlay.height * 0.12
                        const gw = overlay.width - padX * 2
                        const gh = overlay.height - padY * 2

                        // Subtle darkened mask outside guide area
                        oCtx.save()
                        oCtx.fillStyle = "rgba(15, 23, 42, 0.28)"
                        oCtx.beginPath()
                        oCtx.rect(0, 0, overlay.width, overlay.height)
                        oCtx.rect(padX, padY, gw, gh)
                        oCtx.fill("evenodd")
                        oCtx.restore()

                        // Dashed guide border
                        oCtx.save()
                        oCtx.strokeStyle = "rgba(255, 255, 255, 0.75)"
                        oCtx.lineWidth = 2
                        oCtx.setLineDash([8, 6])
                        oCtx.strokeRect(padX, padY, gw, gh)
                        oCtx.restore()
                    }
                }
            }

            animFrameRef.current = requestAnimationFrame(loop)
        }

        animFrameRef.current = requestAnimationFrame(loop)

        return () => {
            running = false
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
        }
    }, [isCameraActive])

    // Capture current frame, perspective-warp the tracked document, apply filter, and add page
    const handleCaptureFrame = async () => {
        if (!videoRef.current) return

        void tapHaptic("medium")

        // Trigger visual shutter flash
        setShutterFlashing(true)
        setTimeout(() => setShutterFlashing(false), 220)

        const video = videoRef.current
        const vw = video.videoWidth || 1920
        const vh = video.videoHeight || 1080

        let srcQuad: Quad
        const det = latestDetectionRef.current

        if (det && det.quad) {
            // Map downscaled detection quad (320x240) to full video resolution
            const sx = vw / 320
            const sy = vh / 240
            srcQuad = {
                tl: { x: det.quad.tl.x * sx, y: det.quad.tl.y * sy },
                tr: { x: det.quad.tr.x * sx, y: det.quad.tr.y * sy },
                br: { x: det.quad.br.x * sx, y: det.quad.br.y * sy },
                bl: { x: det.quad.bl.x * sx, y: det.quad.bl.y * sy },
            }
        } else {
            // Default 10% guide frame mapped to full video resolution
            srcQuad = {
                tl: { x: vw * 0.1, y: vh * 0.1 },
                tr: { x: vw * 0.9, y: vh * 0.1 },
                br: { x: vw * 0.9, y: vh * 0.9 },
                bl: { x: vw * 0.1, y: vh * 0.9 },
            }
        }

        // Perspective warp into flat, de-skewed document canvas (1200px wide for high resolution)
        const warpedCanvas = warpQuadToCanvas(video, srcQuad, vw, vh, 1200)

        // Apply selected scan filter (Xerox B&W, Magic Color, Grayscale, or Original)
        applyDocumentFilter(warpedCanvas, cameraFilter)

        const blob = await new Promise<Blob>((resolve) => {
            warpedCanvas.toBlob((b) => resolve(b || new Blob()), "image/jpeg", 0.92)
        })

        const pageUrl = URL.createObjectURL(blob)
        const newPage: ScannedPage = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            sourceName: `Scan Page ${pages.length + 1}`,
            originalUrl: pageUrl,
            filteredBlob: blob,
            filteredUrl: pageUrl,
            filter: cameraFilter,
            rotation: 0,
            width: warpedCanvas.width,
            height: warpedCanvas.height,
        }

        setPages((prev) => [...prev, newPage])
        setActiveIndex(pages.length)
    }

    // Process a loaded image URL to create a ScannedPage
    const createScannedPage = async (
        url: string,
        name: string,
        filter: ScanFilter = "xerox",
        rotation = 0,
        text = ""
    ): Promise<ScannedPage> => {
        return new Promise((resolve) => {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.onload = async () => {
                const { blob, url: filteredUrl } = await renderFilter(img, filter, rotation)
                resolve({
                    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                    sourceName: name,
                    originalUrl: url,
                    filteredBlob: blob,
                    filteredUrl,
                    filter,
                    rotation,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    extractedText: text,
                })
            }
            img.src = url
        })
    }

    // Handle files selected via file/gallery picker
    const handleFiles = async (files: FileList | File[] | null) => {
        if (!files || files.length === 0) return
        stopCamera()
        setIsCameraActive(false)
        setIsProcessing(true)
        setStatusMessage("Scanning documents...")

        try {
            const newPages: ScannedPage[] = []

            for (let i = 0; i < files.length; i++) {
                const f = files[i]
                if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
                    setStatusMessage(`Scanning PDF pages in ${f.name}...`)
                    const buffer = await f.arrayBuffer()
                    const pdfjs = await loadPdfjs()
                    const doc = await pdfjs.getDocument({ data: buffer }).promise

                    for (let p = 1; p <= doc.numPages; p++) {
                        const page = await doc.getPage(p)
                        const viewport = page.getViewport({ scale: 1.5 })
                        const canvas = document.createElement("canvas")
                        canvas.width = viewport.width
                        canvas.height = viewport.height
                        const ctx = canvas.getContext("2d")
                        if (ctx) {
                            await (page.render as any)({ canvasContext: ctx, viewport }).promise
                            const pageDataUrl = canvas.toDataURL("image/jpeg", 0.92)

                            let pageText = ""
                            try {
                                const content = await page.getTextContent()
                                pageText = (content.items as any[]).map((it) => it.str).join(" ")
                            } catch {
                                // ignore
                            }

                            const scanned = await createScannedPage(
                                pageDataUrl,
                                `${f.name} (p.${p})`,
                                "xerox",
                                0,
                                pageText.trim()
                            )
                            newPages.push(scanned)
                        }
                    }
                } else if (f.type.startsWith("image/")) {
                    const objUrl = URL.createObjectURL(f)
                    const scanned = await createScannedPage(objUrl, f.name, "xerox", 0)
                    newPages.push(scanned)
                }
            }

            if (newPages.length > 0) {
                setPages((prev) => [...prev, ...newPages])
                if (pages.length === 0) setActiveIndex(0)
            }
        } catch (err) {
            console.error("Scanning error:", err)
            alert("Could not process image. Please try another file.")
        } finally {
            setIsProcessing(false)
            setStatusMessage("")
        }
    }

    // Change filter on currently active page
    const handleFilterChange = async (filter: ScanFilter) => {
        if (!activePage) return
        void tapHaptic("light")
        setIsProcessing(true)
        try {
            const img = new Image()
            img.src = activePage.originalUrl
            await new Promise((res) => (img.onload = res))
            const { blob, url } = await renderFilter(img, filter, activePage.rotation)

            setPages((prev) =>
                prev.map((p, i) =>
                    i === activeIndex
                        ? { ...p, filter, filteredBlob: blob, filteredUrl: url }
                        : p
                )
            )
        } finally {
            setIsProcessing(false)
        }
    }

    // Apply active filter to all pages in the document batch
    const handleApplyFilterToAll = async (filter: ScanFilter) => {
        void tapHaptic("light")
        setIsProcessing(true)
        setStatusMessage("Applying filter to all pages...")
        try {
            const updated = await Promise.all(
                pages.map(async (page) => {
                    const img = new Image()
                    img.src = page.originalUrl
                    await new Promise((res) => (img.onload = res))
                    const { blob, url } = await renderFilter(img, filter, page.rotation)
                    return { ...page, filter, filteredBlob: blob, filteredUrl: url }
                })
            )
            setPages(updated)
        } finally {
            setIsProcessing(false)
            setStatusMessage("")
        }
    }

    // Rotate active page 90 degrees
    const handleRotate = async () => {
        if (!activePage) return
        void tapHaptic("light")
        const nextRotation = (activePage.rotation + 90) % 360
        setIsProcessing(true)
        try {
            const img = new Image()
            img.src = activePage.originalUrl
            await new Promise((res) => (img.onload = res))
            const { blob, url } = await renderFilter(img, activePage.filter, nextRotation)

            setPages((prev) =>
                prev.map((p, i) =>
                    i === activeIndex
                        ? { ...p, rotation: nextRotation, filteredBlob: blob, filteredUrl: url }
                        : p
                )
            )
        } finally {
            setIsProcessing(false)
        }
    }

    // Remove active page
    const handleDeletePage = (index: number) => {
        void tapHaptic("light")
        const next = pages.filter((_, i) => i !== index)
        setPages(next)
        if (activeIndex >= next.length) {
            setActiveIndex(Math.max(0, next.length - 1))
        }
    }

    // Generate PDF from all scanned pages
    const handleExportPdf = async () => {
        if (pages.length === 0) return
        void tapHaptic("medium")
        setIsProcessing(true)
        setStatusMessage("Creating clean PDF...")

        try {
            const pdfDoc = await PDFDocument.create()

            for (const p of pages) {
                if (!p.filteredBlob) continue
                const bytes = await p.filteredBlob.arrayBuffer()
                const embedded = await pdfDoc.embedJpg(bytes)
                const page = pdfDoc.addPage([embedded.width, embedded.height])
                page.drawImage(embedded, {
                    x: 0,
                    y: 0,
                    width: embedded.width,
                    height: embedded.height,
                })
            }

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
            const now = new Date()
            const filename = `scan-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}.pdf`

            if (IS_MOBILE_BUILD) {
                await finishConvert(blob, filename, "Scanned with Xerox document filters")
            } else {
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = filename
                a.click()
                URL.revokeObjectURL(url)
            }
        } catch (err) {
            console.error("Error creating PDF:", err)
            alert("Could not create PDF. Please try again.")
        } finally {
            setIsProcessing(false)
            setStatusMessage("")
        }
    }

    // Extract text / OCR
    const handleExtractText = () => {
        void tapHaptic("light")
        const texts = pages
            .map((p, i) => {
                const txt = p.extractedText?.trim()
                if (txt && txt.length > 0) {
                    return `[PAGE ${i + 1}]\n${txt}`
                }
                return `[PAGE ${i + 1}: ${p.sourceName}]\n(Clean visual scan rendered with ${p.filter.toUpperCase()} filter. No embedded vector font layer found.)`
            })
            .join("\n\n")

        setOcrText(texts)
        setShowOcrBox(true)
    }

    const handleCopyOcr = () => {
        if (!ocrText) return
        void tapHaptic("light")
        navigator.clipboard.writeText(ocrText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownloadOcr = () => {
        if (!ocrText) return
        void tapHaptic("light")
        const blob = new Blob([ocrText], { type: "text/plain;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `scan-text-${Date.now()}.txt`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 space-y-3">
            {/* Hidden fallback file inputs */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />
            <input
                ref={addMoreFileRef}
                type="file"
                accept="image/*,application/pdf"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />

            {/* =========================================================================
                1. LIVE CAMERA VIEWFINDER WITH REAL-TIME EDGE AUTO-TRACKING
               ========================================================================= */}
            {isCameraActive && (
                <div
                    className="fixed inset-0 z-[70] bg-black flex flex-col justify-between overflow-hidden select-none"
                    style={{ bottom: "var(--ad-banner-h, 0px)" }}
                >
                    {/* Viewfinder Top Bar */}
                    <div className="relative z-20 flex items-center justify-between px-4 pt-3 pb-2 bg-gradient-to-b from-black/80 to-transparent">
                        <button
                            type="button"
                            onClick={() => {
                                void tapHaptic("light")
                                stopCamera()
                                setIsCameraActive(false)
                            }}
                            className="p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md active:scale-90 transition cursor-pointer"
                            aria-label="Close Camera"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Real-time document detection pill badge */}
                        <div
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all backdrop-blur-md ${
                                isTrackingDocument
                                    ? "bg-emerald-600/90 text-white shadow-lg ring-1 ring-emerald-300 animate-pulse"
                                    : "bg-black/50 text-slate-300 border border-white/20"
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>{detectedDocBadge}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {hasFlash && (
                                <button
                                    type="button"
                                    onClick={toggleFlash}
                                    className={`p-2.5 rounded-full backdrop-blur-md active:scale-90 transition cursor-pointer ${
                                        flashOn ? "bg-amber-400 text-slate-900" : "bg-black/40 text-white"
                                    }`}
                                    aria-label="Toggle Flash"
                                >
                                    {flashOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={switchCamera}
                                className="p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md active:scale-90 transition cursor-pointer"
                                aria-label="Switch Camera"
                            >
                                <SwitchCamera className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Viewfinder Video Stream & Real-time Canvas Tracking Overlay */}
                    <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden bg-black">
                        <video
                            ref={(el) => {
                                videoRef.current = el
                                if (el && streamRef.current && el.srcObject !== streamRef.current) {
                                    el.srcObject = streamRef.current
                                    void el.play().catch(() => {})
                                }
                            }}
                            playsInline
                            muted
                            autoPlay
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Real-time Edge Tracking Overlay Canvas */}
                        <canvas
                            ref={overlayCanvasRef}
                            className="absolute inset-0 w-full h-full pointer-events-none z-10"
                        />

                        {/* Visual Shutter Flash Overlay */}
                        {shutterFlashing && (
                            <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-200 pointer-events-none" />
                        )}
                    </div>

                    {/* Viewfinder Bottom Controls */}
                    <div
                        className="relative z-20 flex flex-col items-center gap-3 px-4 pt-2 bg-gradient-to-t from-black/95 via-black/80 to-transparent"
                        style={{
                            paddingBottom: "max(calc(var(--ad-banner-h, 0px) + 24px), max(env(safe-area-inset-bottom, 0px), 32px))",
                        }}
                    >
                        {/* Live Filter Selector Chips */}
                        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full px-2 py-1 scrollbar-none">
                            {FILTERS.map((f) => {
                                const isSel = cameraFilter === f.id
                                return (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => {
                                            void tapHaptic("light")
                                            setCameraFilter(f.id)
                                        }}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer backdrop-blur-md ${
                                            isSel
                                                ? "bg-white text-slate-950 shadow-md ring-2 ring-emerald-400 scale-105"
                                                : "bg-black/40 text-white/80 border border-white/20 hover:bg-black/60"
                                        }`}
                                    >
                                        <span>{f.icon}</span>
                                        <span>{f.label}</span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Shutter Button & Gallery/Done Actions */}
                        <div className="flex items-center justify-between w-full max-w-md px-6">
                            {/* Left: Fallback Upload from Files/Gallery */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center gap-1 text-white/80 active:scale-90 transition cursor-pointer text-[11px] font-medium"
                            >
                                <div className="p-3 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 transition">
                                    <Upload className="w-5 h-5 text-white" />
                                </div>
                                <span>Upload</span>
                            </button>

                            {/* Center: Tactile 3D Capture Shutter Button */}
                            <button
                                type="button"
                                onClick={handleCaptureFrame}
                                className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/20 p-1.5 active:scale-90 transition-transform duration-100 cursor-pointer shadow-2xl hover:bg-white/30"
                                aria-label="Capture Document"
                            >
                                <div className="w-full h-full rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center shadow-inner">
                                    <div className="w-12 h-12 rounded-full bg-emerald-600 active:bg-emerald-700 transition shadow-md" />
                                </div>
                            </button>

                            {/* Right: Review Pages / Done */}
                            {pages.length > 0 ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        void tapHaptic("light")
                                        stopCamera()
                                        setIsCameraActive(false)
                                    }}
                                    className="flex flex-col items-center gap-1 text-white active:scale-90 transition cursor-pointer text-[11px] font-bold"
                                >
                                    <div className="relative p-3 rounded-full bg-emerald-600 text-white shadow-lg">
                                        <Check className="w-5 h-5 stroke-[2.8]" />
                                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-emerald-900 text-[10px] font-black flex items-center justify-center shadow-md">
                                            {pages.length}
                                        </span>
                                    </div>
                                    <span>Done ({pages.length})</span>
                                </button>
                            ) : (
                                <div className="w-12" />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================================
                2. EMPTY STATE: INITIAL SCAN / UPLOAD HUB
               ========================================================================= */}
            {!isCameraActive && pages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                    <div className="w-20 h-20 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-600 flex items-center justify-center shadow-xs">
                        <ScanLine className="w-10 h-10 animate-pulse text-teal-600" />
                    </div>

                    <div className="space-y-1.5 max-w-md">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Document Scanner & Xerox Filters
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                            Scan documents with direct camera auto-edge tracking. Removes table shadows and enhances ink like a real Xerox photocopy machine.
                        </p>
                    </div>

                    {cameraError && (
                        <div className="w-full max-w-md p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left">
                            {cameraError}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-1">
                        {/* Direct Live Camera Launch Button with Duolingo Tactile 3D Styling */}
                        <button
                            type="button"
                            onClick={() => {
                                void tapHaptic("medium")
                                void startCamera()
                            }}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#026EFF] hover:bg-blue-700 active:translate-y-0.5 text-white font-bold text-base shadow-md transition cursor-pointer border-b-[3.5px] border-[#0050BD]"
                        >
                            <Camera className="w-5 h-5" />
                            <span>Scan with Camera</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:translate-y-0.5 text-slate-800 font-bold text-base border border-slate-200 border-b-[3px] border-b-slate-300 transition cursor-pointer"
                        >
                            <Upload className="w-5 h-5 text-slate-600" />
                            <span>Upload Photos / PDF</span>
                        </button>
                    </div>

                    {/* Features Strip */}
                    <div className="grid grid-cols-3 gap-2 w-full max-w-md pt-3 border-t border-slate-100 text-left">
                        <div className="p-2">
                            <span className="text-xs font-bold text-emerald-700 block">📐 Auto-Edge Quad</span>
                            <span className="text-[11px] text-slate-500">Tracks paper boundaries live</span>
                        </div>
                        <div className="p-2">
                            <span className="text-xs font-bold text-teal-700 block">📄 Xerox Photocopy</span>
                            <span className="text-[11px] text-slate-500">Crisp ink, removes shadows</span>
                        </div>
                        <div className="p-2">
                            <span className="text-xs font-bold text-blue-700 block">✨ Magic Color</span>
                            <span className="text-[11px] text-slate-500">Retains blue ink & seals</span>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================================
                3. ACTIVE SCANNER WORKSPACE: REVIEW, FILTERS, MULTI-PAGE & PDF EXPORT
               ========================================================================= */}
            {!isCameraActive && pages.length > 0 && activePage && (
                <div className="space-y-3">
                    {/* Top Status & Controls */}
                    <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-900 text-xs font-bold">
                                Page {activeIndex + 1} of {pages.length}
                            </span>
                            <span className="text-xs text-slate-500 truncate max-w-[120px] sm:max-w-[200px]">
                                {activePage.sourceName}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={handleRotate}
                                title="Rotate 90°"
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-700 transition cursor-pointer"
                            >
                                <RotateCw className="w-4 h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDeletePage(activeIndex)}
                                title="Delete Page"
                                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 active:scale-90 text-red-600 transition cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Filter Selector Chips */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                                Document Filters
                            </span>
                            {pages.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleApplyFilterToAll(activePage.filter)}
                                    className="text-xs font-bold text-teal-600 hover:underline cursor-pointer"
                                >
                                    Apply &quot;{activePage.filter}&quot; to all pages
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {FILTERS.map((f) => {
                                const isSel = activePage.filter === f.id
                                return (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => handleFilterChange(f.id)}
                                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                            isSel
                                                ? "bg-teal-50 border-teal-500 text-teal-900 shadow-xs font-bold"
                                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                                        }`}
                                    >
                                        <span className="text-lg">{f.icon}</span>
                                        <div className="min-w-0">
                                            <div className="text-xs font-bold leading-tight truncate">{f.label}</div>
                                            <div className="text-[10px] text-slate-500 leading-tight truncate">{f.desc}</div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Document Preview Canvas */}
                    <div className="relative bg-slate-900 rounded-2xl p-4 flex items-center justify-center min-h-[280px] max-h-[440px] overflow-hidden shadow-inner border border-slate-800">
                        {isProcessing && (
                            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10 text-white text-xs font-semibold">
                                <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
                                <span>{statusMessage || "Enhancing document..."}</span>
                            </div>
                        )}

                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={activePage.filteredUrl}
                            alt="Scanned Document"
                            className="max-h-[400px] max-w-full object-contain rounded-md shadow-lg"
                        />
                    </div>

                    {/* Multi-page Thumbnail Carousel + Add More Pages */}
                    <div className="flex items-center gap-2 overflow-x-auto py-1 px-1">
                        {pages.map((p, idx) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                    void tapHaptic("light")
                                    setActiveIndex(idx)
                                }}
                                className={`relative flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                                    idx === activeIndex
                                        ? "border-teal-600 ring-2 ring-teal-200 shadow-md"
                                        : "border-slate-300 opacity-70 hover:opacity-100"
                                }`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.filteredUrl} alt="" className="w-full h-full object-cover" />
                                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1 rounded">
                                    {idx + 1}
                                </span>
                            </button>
                        ))}

                        {/* Direct Camera Add Page Button */}
                        <button
                            type="button"
                            onClick={() => {
                                void tapHaptic("medium")
                                void startCamera()
                            }}
                            className="flex-shrink-0 w-16 h-20 rounded-xl border-2 border-dashed border-teal-400 bg-teal-50/60 hover:bg-teal-100/60 flex flex-col items-center justify-center text-teal-700 text-[10px] font-bold gap-1 cursor-pointer transition active:scale-95"
                        >
                            <Camera className="w-4 h-4 text-teal-600" />
                            <span>Scan</span>
                        </button>

                        {/* Gallery / File Picker Add Page Button */}
                        <button
                            type="button"
                            onClick={() => addMoreFileRef.current?.click()}
                            className="flex-shrink-0 w-16 h-20 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center text-slate-700 text-[10px] font-bold gap-1 cursor-pointer transition active:scale-95"
                        >
                            <Plus className="w-4 h-4 text-slate-600" />
                            <span>Files</span>
                        </button>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                            {/* Duolingo 3D Tactile Save as PDF Button */}
                            <button
                                type="button"
                                onClick={handleExportPdf}
                                disabled={isProcessing}
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#026EFF] hover:bg-blue-700 active:translate-y-0.5 text-white font-bold text-base shadow-md transition cursor-pointer border-b-[3.5px] border-[#0050BD]"
                            >
                                <Printer className="w-5 h-5" />
                                <span>Save as PDF ({pages.length} {pages.length === 1 ? "page" : "pages"})</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleExtractText}
                                className="flex items-center justify-center gap-1.5 py-3 px-5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-sm border border-teal-200 border-b-[2.5px] border-b-teal-300 transition cursor-pointer"
                            >
                                <ScanLine className="w-4 h-4 text-teal-600" />
                                <span>Extract Text (OCR)</span>
                            </button>
                        </div>
                    </div>

                    {/* OCR Text Box Drawer */}
                    {showOcrBox && (
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                    <FileText className="w-4 h-4 text-teal-600" />
                                    Extracted Document Text
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCopyOcr}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 text-xs font-bold hover:bg-teal-100 transition cursor-pointer"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copied ? "Copied!" : "Copy"}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDownloadOcr}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>.txt</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowOcrBox(false)}
                                        className="text-xs text-slate-400 hover:text-slate-600 px-1 font-bold cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={ocrText}
                                onChange={(e) => setOcrText(e.target.value)}
                                rows={6}
                                className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
