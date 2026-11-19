"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Maximize2, Wand2, X } from "lucide-react"
import type { Quad } from "@/lib/document-scanner"
import { haptic } from "@/lib/haptics"
import { EDGES, EDGE_ENDS, edgeMid, slideEdge, type Corner, type Edge } from "@/lib/scan/crop"

const CORNERS: Corner[] = ["tl", "tr", "br", "bl"]

type Drag =
    | { kind: "corner"; corner: Corner; x: number; y: number }
    | { kind: "edge"; edge: Edge; start: Quad; fromX: number; fromY: number; x: number; y: number }
const LOUPE = 112 // px
const ZOOM = 2.5

const full = (w: number, h: number): Quad => ({ tl: { x: 0, y: 0 }, tr: { x: w, y: 0 }, br: { x: w, y: h }, bl: { x: 0, y: h } })

function convex(q: Quad): boolean {
    const p = [q.tl, q.tr, q.br, q.bl]
    let sign = 0
    for (let i = 0; i < 4; i++) {
        const a = p[i]
        const b = p[(i + 1) % 4]
        const c = p[(i + 2) % 4]
        const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x)
        if (Math.abs(cross) < 1e-6) return false
        const s = Math.sign(cross)
        if (sign && s !== sign) return false
        sign = s
    }
    return true
}

/**
 * Full-screen crop: drag the four corners onto the page's corners, or the
 * handle in the middle of an edge to slide that whole edge in or out. A loupe
 * above the finger shows the spot magnified, so it lands exactly on the
 * paper's edge even on a small screen.
 */
export default function CornerEditor({
    src,
    width,
    height,
    quad,
    autoQuad,
    onApply,
    onCancel,
}: {
    src: string
    width: number
    height: number
    quad: Quad | null
    autoQuad: Quad | null
    onApply: (quad: Quad | null) => void
    onCancel: () => void
}) {
    const boxRef = useRef<HTMLDivElement>(null)
    const [box, setBox] = useState({ w: 0, h: 0 })
    const [q, setQ] = useState<Quad>(quad ?? autoQuad ?? full(width, height))
    const [drag, setDrag] = useState<Drag | null>(null)

    useEffect(() => {
        const el = boxRef.current
        if (!el) return
        const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // Image fitted inside the box (object-fit: contain).
    const s = box.w && box.h ? Math.min(box.w / width, box.h / height) : 0
    const ox = (box.w - width * s) / 2
    const oy = (box.h - height * s) / 2
    const toScreen = (p: { x: number; y: number }) => ({ x: ox + p.x * s, y: oy + p.y * s })

    const move = (corner: Corner, clientX: number, clientY: number) => {
        const r = boxRef.current?.getBoundingClientRect()
        if (!r || !s) return
        const x = Math.min(width, Math.max(0, (clientX - r.left - ox) / s))
        const y = Math.min(height, Math.max(0, (clientY - r.top - oy) / s))
        setQ((prev) => ({ ...prev, [corner]: { x, y } }))
        setDrag({ kind: "corner", corner, x: clientX - r.left, y: clientY - r.top })
    }

    const moveEdge = (d: Extract<Drag, { kind: "edge" }>, clientX: number, clientY: number) => {
        const r = boxRef.current?.getBoundingClientRect()
        if (!r || !s) return
        setQ(slideEdge(d.start, d.edge, (clientX - d.fromX) / s, (clientY - d.fromY) / s, width, height))
        setDrag({ ...d, x: clientX - r.left, y: clientY - r.top })
    }

    const ok = convex(q)
    const pts = CORNERS.map((c) => toScreen(q[c]))
    const poly = pts.map((p) => `${p.x},${p.y}`).join(" ")
    const dragPt = !drag ? null : drag.kind === "corner" ? q[drag.corner] : edgeMid(q, drag.edge)

    return (
        <div className="scan-editor" role="dialog" aria-label="Adjust page corners">
            <div className="scan-editor-top">
                <button type="button" className="scan-icon-btn" aria-label="Cancel" onClick={onCancel}>
                    <X size={22} />
                </button>
                <span className="scan-editor-title">Drag the points onto the page edges</span>
                <span style={{ width: 44 }} />
            </div>

            <div ref={boxRef} className="scan-editor-stage">
                {s > 0 && (
                    <>
                        {/* Blob URL of the user's own photo; Next/Image can't host it. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={src}
                            alt=""
                            draggable={false}
                            style={{ position: "absolute", left: ox, top: oy, width: width * s, height: height * s }}
                        />
                        <svg className="scan-editor-svg" width={box.w} height={box.h}>
                            <defs>
                                <mask id="scan-crop-mask">
                                    <rect width={box.w} height={box.h} fill="white" />
                                    <polygon points={poly} fill="black" />
                                </mask>
                            </defs>
                            <rect width={box.w} height={box.h} fill="rgba(0,0,0,0.5)" mask="url(#scan-crop-mask)" />
                            <polygon points={poly} fill="none" stroke={ok ? "#3b8bff" : "#ef4444"} strokeWidth={2.5} />
                        </svg>
                        {CORNERS.map((c, i) => (
                            <div
                                key={c}
                                className={`scan-handle${drag?.kind === "corner" && drag.corner === c ? " is-active" : ""}`}
                                style={{ transform: `translate3d(${pts[i].x - 22}px, ${pts[i].y - 22}px, 0)` }}
                                onPointerDown={(e) => {
                                    e.currentTarget.setPointerCapture(e.pointerId)
                                    void haptic("select")
                                    move(c, e.clientX, e.clientY)
                                }}
                                onPointerMove={(e) => {
                                    if (drag?.kind === "corner" && drag.corner === c) move(c, e.clientX, e.clientY)
                                }}
                                onPointerUp={() => setDrag(null)}
                                onPointerCancel={() => setDrag(null)}
                            >
                                <span />
                            </div>
                        ))}
                        {EDGES.map((edge) => {
                            const m = toScreen(edgeMid(q, edge))
                            const [a, b] = EDGE_ENDS[edge]
                            const angle = (Math.atan2(q[b].y - q[a].y, q[b].x - q[a].x) * 180) / Math.PI
                            const active = drag?.kind === "edge" && drag.edge === edge
                            return (
                                <div
                                    key={edge}
                                    className={`scan-edge-handle${active ? " is-active" : ""}`}
                                    aria-label={`Move the ${edge} edge`}
                                    style={{ transform: `translate3d(${m.x - 22}px, ${m.y - 22}px, 0)` }}
                                    onPointerDown={(e) => {
                                        e.currentTarget.setPointerCapture(e.pointerId)
                                        void haptic("select")
                                        const r = boxRef.current?.getBoundingClientRect()
                                        setDrag({
                                            kind: "edge",
                                            edge,
                                            start: q,
                                            fromX: e.clientX,
                                            fromY: e.clientY,
                                            x: e.clientX - (r?.left ?? 0),
                                            y: e.clientY - (r?.top ?? 0),
                                        })
                                    }}
                                    onPointerMove={(e) => {
                                        if (drag?.kind === "edge" && drag.edge === edge) moveEdge(drag, e.clientX, e.clientY)
                                    }}
                                    onPointerUp={() => setDrag(null)}
                                    onPointerCancel={() => setDrag(null)}
                                >
                                    <span style={{ transform: `rotate(${angle}deg)` }} />
                                </div>
                            )
                        })}
                        {drag && dragPt && (
                            <div
                                className="scan-loupe"
                                style={{
                                    // Above the finger; below it near the top edge.
                                    transform: `translate3d(${Math.min(box.w - LOUPE - 8, Math.max(8, drag.x - LOUPE / 2))}px, ${
                                        drag.y > LOUPE + 60 ? drag.y - LOUPE - 48 : drag.y + 48
                                    }px, 0)`,
                                    backgroundImage: `url(${src})`,
                                    backgroundSize: `${width * s * ZOOM}px ${height * s * ZOOM}px`,
                                    backgroundPosition: `${LOUPE / 2 - dragPt.x * s * ZOOM}px ${LOUPE / 2 - dragPt.y * s * ZOOM}px`,
                                }}
                            />
                        )}
                    </>
                )}
            </div>

            {!ok && <p className="scan-editor-warn">The edges cross over. Drag the points back into a four-sided shape.</p>}

            <div className="scan-editor-actions">
                <button
                    type="button"
                    className="scan-tool-btn"
                    disabled={!autoQuad}
                    onClick={() => {
                        if (!autoQuad) return
                        void haptic("tap")
                        setQ(autoQuad)
                    }}
                >
                    <Wand2 size={20} />
                    <span>Auto</span>
                </button>
                <button
                    type="button"
                    className="scan-tool-btn"
                    onClick={() => {
                        void haptic("tap")
                        setQ(full(width, height))
                    }}
                >
                    <Maximize2 size={20} />
                    <span>Full photo</span>
                </button>
                <button
                    type="button"
                    className="scan-apply-btn"
                    disabled={!ok}
                    onClick={() => {
                        void haptic("success")
                        const f = full(width, height)
                        const isFull = CORNERS.every((c) => Math.hypot(q[c].x - f[c].x, q[c].y - f[c].y) < 1)
                        onApply(isFull ? null : q)
                    }}
                >
                    <Check size={20} />
                    <span>Apply</span>
                </button>
            </div>
        </div>
    )
}
