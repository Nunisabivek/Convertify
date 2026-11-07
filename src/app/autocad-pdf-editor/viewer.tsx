"use client"

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { cmdsToSvg, markupBounds, markupPrims, type Markup, type MeasureText, type Prim } from "@/lib/cad/markup"
import { ortho } from "@/lib/cad/measure"
import type { Pt } from "@/lib/cad/geometry"
import type { PageModel, Region, Tool } from "./types"

/** Zoom = CSS px per display point; x/y = where the page's top-left sits in the frame. */
export type View = { zoom: number; x: number; y: number }

export const MIN_ZOOM = 0.03
export const MAX_ZOOM = 8
export const clampZoom = (z: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z))

/**
 * Keeps the page in reach: a sheet smaller than the frame stays fully inside it (so
 * zooming stays anchored at the cursor), a bigger one can't be pushed out of view.
 */
export function clampView(v: View, frameW: number, frameH: number, pageW: number, pageH: number): View {
    const m = 48
    const axis = (pos: number, size: number, frame: number) =>
        size <= frame ? Math.min(frame - size, Math.max(0, pos)) : Math.min(m, Math.max(frame - size - m, pos))
    return { zoom: v.zoom, x: axis(v.x, pageW * v.zoom, frameW), y: axis(v.y, pageH * v.zoom, frameH) }
}

/** The view that shows the whole sheet (or its full width), centred. */
export function fitView(mode: "page" | "width", frameW: number, frameH: number, pageW: number, pageH: number): View {
    const zoom = clampZoom(mode === "page" ? Math.min((frameW - 16) / pageW, (frameH - 16) / pageH) : (frameW - 16) / pageW)
    const sw = pageW * zoom
    const sh = pageH * zoom
    return clampView({ zoom, x: (frameW - sw) / 2, y: sh <= frameH ? (frameH - sh) / 2 : 8 }, frameW, frameH, pageW, pageH)
}

/** Zoom by `factor` keeping the frame point (fx, fy) fixed under the cursor or fingers. */
export function zoomAt(v: View, factor: number, fx: number, fy: number): View {
    const zoom = clampZoom(v.zoom * factor)
    const k = zoom / v.zoom
    return { zoom, x: fx - (fx - v.x) * k, y: fy - (fy - v.y) * k }
}

/** Tools drawn by dragging from one point to another. */
export const DRAG_TOOLS = new Set<Tool>(["region", "arrow", "cloud", "rect", "highlight", "measure", "calibrate"])
/** Tools placed with a single click or tap. */
export const CLICK_TOOLS = new Set<Tool>(["note", "stamp"])

type Props = {
    model: PageModel
    pageNo: number
    height: number
    view: View
    setView: (v: View) => void
    /** Called when the frame size changes so the parent can refit. */
    onFrameSize: (w: number, h: number) => void
    tool: Tool
    color: string
    lineWidth: number
    regionState: (r: Region) => { edited?: string; deleted: boolean; active: boolean }
    onRegionClick: (r: Region) => void
    markups: Markup[]
    selectedMarkup: string | null
    onSelectMarkup: (id: string | null) => void
    onBackgroundTap: () => void
    onDragDone: (tool: Tool, a: Pt, b: Pt) => void
    onPlace: (tool: Tool, at: Pt) => void
    measureText: MeasureText
    /** Label shown live while measuring or calibrating. */
    liveLabel?: (a: Pt, b: Pt) => string
    /** A finished measurement to keep showing (display space). */
    measureLine?: { a: Pt; b: Pt; label: string } | null
    minHit: number
    busy?: string | null
    overlay?: ReactNode
}

type Drag =
    | { mode: "pan"; id: number; cx: number; cy: number; v0: View; moved: boolean }
    | { mode: "draw"; id: number; a: Pt; moved: boolean; cx: number; cy: number }
    | { mode: "click"; id: number; a: Pt; cx: number; cy: number; moved: boolean }

export function DrawingView(p: Props) {
    const frameRef = useRef<HTMLDivElement>(null)
    const [draft, setDraft] = useState<{ a: Pt; b: Pt } | null>(null)
    const [spaceDown, setSpaceDown] = useState(false)
    const [panning, setPanning] = useState(false)
    const dragRef = useRef<Drag | null>(null)
    const touchesRef = useRef(0)
    const suppressClickUntil = useRef(0)
    // Latest props for native listeners registered once.
    const live = useRef(p)
    useLayoutEffect(() => {
        live.current = p
    })

    const { model, view, tool } = p
    const W = model.width
    const H = model.height
    const z = view.zoom

    // Frame size → parent (for fit and clamping).
    useEffect(() => {
        const el = frameRef.current
        if (!el) return
        const ro = new ResizeObserver(() => live.current.onFrameSize(el.clientWidth, el.clientHeight))
        ro.observe(el)
        live.current.onFrameSize(el.clientWidth, el.clientHeight)
        return () => ro.disconnect()
    }, [])

    // Space held = pan with the mouse, whatever the tool.
    useEffect(() => {
        const typing = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement | null
            return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)
        }
        const down = (e: KeyboardEvent) => {
            if (e.code === "Space" && !typing(e)) {
                e.preventDefault()
                setSpaceDown(true)
            }
        }
        const up = (e: KeyboardEvent) => {
            if (e.code === "Space") setSpaceDown(false)
        }
        window.addEventListener("keydown", down)
        window.addEventListener("keyup", up)
        return () => {
            window.removeEventListener("keydown", down)
            window.removeEventListener("keyup", up)
        }
    }, [])

    // Wheel: Ctrl/⌘ (and trackpad pinch) zooms at the cursor; a plain wheel pans the
    // drawing and lets the page scroll once the drawing can't move further.
    // Touch: two fingers pinch-zoom and pan the drawing, not the web page.
    useEffect(() => {
        const el = frameRef.current
        if (!el) return
        // Frame coordinates are measured inside its border (where the stage is positioned).
        const local = (cx: number, cy: number) => {
            const r = el.getBoundingClientRect()
            return { x: cx - r.left - el.clientLeft, y: cy - r.top - el.clientTop }
        }
        const clamp = (v: View) => {
            const c = live.current
            return clampView(v, el.clientWidth, el.clientHeight, c.model.width, c.model.height)
        }
        const onWheel = (e: WheelEvent) => {
            const c = live.current
            const v = c.view
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault()
                const k = e.deltaMode === 1 ? 0.05 : e.deltaMode === 2 ? 1 : 0.0025
                const f = Math.exp(-Math.max(-60, Math.min(60, e.deltaY)) * k * (e.ctrlKey && !e.metaKey && Math.abs(e.deltaY) < 10 ? 4 : 1))
                const at = local(e.clientX, e.clientY)
                c.setView(clamp(zoomAt(v, f, at.x, at.y)))
                return
            }
            const line = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? el.clientHeight : 1
            let dx = e.deltaX * line
            let dy = e.deltaY * line
            if (e.shiftKey && !dx) {
                dx = dy
                dy = 0
            }
            const next = clamp({ zoom: v.zoom, x: v.x - dx, y: v.y - dy })
            if (Math.abs(next.x - v.x) > 0.5 || Math.abs(next.y - v.y) > 0.5) {
                e.preventDefault()
                c.setView(next)
            }
        }
        let pinch: { d0: number; m0: { x: number; y: number }; v0: View } | null = null
        const two = (e: TouchEvent) => {
            const [a, b] = [e.touches[0], e.touches[1]]
            return { d: Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY), m: local((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2) }
        }
        const onTouchStart = (e: TouchEvent) => {
            touchesRef.current = e.touches.length
            if (e.touches.length >= 2) {
                e.preventDefault()
                const t = two(e)
                pinch = { d0: Math.max(1, t.d), m0: t.m, v0: live.current.view }
                // A second finger turns any drawing gesture into a pinch.
                dragRef.current = null
                setDraft(null)
            }
        }
        const onTouchMove = (e: TouchEvent) => {
            touchesRef.current = e.touches.length
            if (!pinch || e.touches.length < 2) return
            e.preventDefault()
            const t = two(e)
            const { v0, m0, d0 } = pinch
            const zoom = clampZoom(v0.zoom * (t.d / d0))
            const k = zoom / v0.zoom
            live.current.setView(clamp({ zoom, x: t.m.x - (m0.x - v0.x) * k, y: t.m.y - (m0.y - v0.y) * k }))
        }
        const onTouchEnd = (e: TouchEvent) => {
            touchesRef.current = e.touches.length
            if (pinch && e.touches.length < 2) {
                pinch = null
                suppressClickUntil.current = Date.now() + 350
            }
        }
        const stopGesture = (e: Event) => e.preventDefault()
        el.addEventListener("wheel", onWheel, { passive: false })
        el.addEventListener("touchstart", onTouchStart, { passive: false })
        el.addEventListener("touchmove", onTouchMove, { passive: false })
        el.addEventListener("touchend", onTouchEnd)
        el.addEventListener("touchcancel", onTouchEnd)
        // iOS Safari: keep its own page pinch out of the drawing.
        el.addEventListener("gesturestart", stopGesture)
        return () => {
            el.removeEventListener("wheel", onWheel)
            el.removeEventListener("touchstart", onTouchStart)
            el.removeEventListener("touchmove", onTouchMove)
            el.removeEventListener("touchend", onTouchEnd)
            el.removeEventListener("touchcancel", onTouchEnd)
            el.removeEventListener("gesturestart", stopGesture)
        }
    }, [])

    const toPage = (cx: number, cy: number): Pt => {
        const el = frameRef.current!
        const r = el.getBoundingClientRect()
        return { x: (cx - r.left - el.clientLeft - view.x) / z, y: (cy - r.top - el.clientTop - view.y) / z }
    }

    const onPointerDown = (e: React.PointerEvent) => {
        if (e.pointerType === "mouse" && e.button !== 0 && e.button !== 1) return
        if (dragRef.current) return
        if ((e.target as HTMLElement).closest?.("[data-overlay]")) return
        const touch = e.pointerType === "touch"
        if (touch && touchesRef.current >= 2) return
        const onHit = !!(e.target as HTMLElement).closest?.("[data-hit]")
        const pan = !touch && (e.button === 1 || spaceDown || (tool === "select" && !onHit))
        if (pan) {
            e.preventDefault()
            dragRef.current = { mode: "pan", id: e.pointerId, cx: e.clientX, cy: e.clientY, v0: view, moved: false }
            setPanning(true)
            frameRef.current?.setPointerCapture(e.pointerId)
            return
        }
        if (DRAG_TOOLS.has(tool)) {
            e.preventDefault()
            const a = toPage(e.clientX, e.clientY)
            dragRef.current = { mode: "draw", id: e.pointerId, a, moved: false, cx: e.clientX, cy: e.clientY }
            setDraft({ a, b: a })
            frameRef.current?.setPointerCapture(e.pointerId)
        } else if (CLICK_TOOLS.has(tool)) {
            dragRef.current = { mode: "click", id: e.pointerId, a: toPage(e.clientX, e.clientY), cx: e.clientX, cy: e.clientY, moved: false }
        }
    }

    const onPointerMove = (e: React.PointerEvent) => {
        const d = dragRef.current
        if (!d || d.id !== e.pointerId) return
        if (e.pointerType === "touch" && touchesRef.current >= 2) {
            dragRef.current = null
            setDraft(null)
            return
        }
        if (Math.hypot(e.clientX - d.cx, e.clientY - d.cy) > 4) d.moved = true
        if (d.mode === "pan") {
            const el = frameRef.current!
            p.setView(clampView({ zoom: d.v0.zoom, x: d.v0.x + e.clientX - d.cx, y: d.v0.y + e.clientY - d.cy }, el.clientWidth, el.clientHeight, W, H))
        } else if (d.mode === "draw") {
            const b = toPage(e.clientX, e.clientY)
            setDraft({ a: d.a, b: e.shiftKey ? ortho(d.a, b) : b })
        }
    }

    const finish = (e: React.PointerEvent, cancelled: boolean) => {
        const d = dragRef.current
        if (!d || d.id !== e.pointerId) return
        dragRef.current = null
        setPanning(false)
        if (frameRef.current?.hasPointerCapture(e.pointerId)) frameRef.current.releasePointerCapture(e.pointerId)
        if (cancelled) {
            setDraft(null)
            return
        }
        if (d.mode === "pan") {
            if (d.moved) suppressClickUntil.current = Date.now() + 250
        } else if (d.mode === "draw") {
            const raw = toPage(e.clientX, e.clientY)
            const b = e.shiftKey ? ortho(d.a, raw) : raw
            setDraft(null)
            if (Math.hypot(b.x - d.a.x, b.y - d.a.y) * z >= 6) p.onDragDone(tool, d.a, b)
        } else if (!d.moved) {
            p.onPlace(tool, d.a)
        }
    }

    const clickable = tool === "select" && !spaceDown
    const sorted = [...model.regions].sort((a, b) => b.box.w * b.box.h - a.box.w * a.box.h)
    const draftMarkup: Markup | null =
        draft && ["arrow", "cloud", "rect", "highlight", "measure"].includes(tool)
            ? { id: "draft", page: p.pageNo, kind: tool as Markup["kind"], color: p.color, width: p.lineWidth, a: draft.a, b: draft.b }
            : null

    return (
        <div
            ref={frameRef}
            data-testid="cad-frame"
            className="relative overflow-hidden rounded-xl border bg-slate-200/50 shadow-inner select-none"
            style={{
                height: p.height,
                // One finger scrolls the web page in select mode; drawing tools take the finger.
                touchAction: tool === "select" ? "pan-x pan-y" : "none",
                cursor: panning ? "grabbing" : spaceDown ? "grab" : tool === "select" ? "default" : "crosshair",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(e) => finish(e, false)}
            onPointerCancel={(e) => finish(e, true)}
            onClickCapture={(e) => {
                if (Date.now() < suppressClickUntil.current) {
                    e.stopPropagation()
                    e.preventDefault()
                }
            }}
            onClick={(e) => {
                if (tool === "select" && !(e.target as HTMLElement).closest?.("[data-overlay],[data-hit]")) p.onBackgroundTap()
            }}
            onContextMenu={(e) => {
                if (tool !== "select") e.preventDefault()
            }}
        >
            <div
                data-testid="cad-stage"
                data-w={W}
                data-h={H}
                data-zoom={z}
                className="absolute left-0 top-0 bg-white shadow"
                style={{ width: W * z, height: H * z, transform: `translate3d(${view.x}px, ${view.y}px, 0)`, transformOrigin: "0 0" }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={model.url}
                    alt={`Page ${p.pageNo}`}
                    draggable={false}
                    style={{ width: W * z, height: H * z, display: "block", pointerEvents: "none" }}
                />

                <svg
                    width={W * z}
                    height={H * z}
                    viewBox={`0 0 ${W} ${H}`}
                    className="absolute left-0 top-0 overflow-visible"
                    style={{ pointerEvents: "none" }}
                >
                    {p.markups.map((m) => (
                        <g
                            key={m.id}
                            data-hit=""
                            data-markup={m.kind}
                            style={{ pointerEvents: clickable ? "auto" : "none", cursor: clickable ? "pointer" : undefined }}
                            onClick={(e) => {
                                e.stopPropagation()
                                p.onSelectMarkup(m.id)
                            }}
                        >
                            <title>{markupTitle(m)}</title>
                            <Prims prims={markupPrims(m, p.measureText)} hitWidth={12 / z} />
                        </g>
                    ))}
                    {p.selectedMarkup &&
                        (() => {
                            const m = p.markups.find((x) => x.id === p.selectedMarkup)
                            if (!m) return null
                            const b = markupBounds(m, p.measureText)
                            const pad = 4 / z
                            return (
                                <rect
                                    x={b.x - pad}
                                    y={b.y - pad}
                                    width={b.w + 2 * pad}
                                    height={b.h + 2 * pad}
                                    fill="none"
                                    stroke="#026EFF"
                                    strokeWidth={1.5 / z}
                                    strokeDasharray={`${5 / z} ${3 / z}`}
                                />
                            )
                        })()}
                    {draftMarkup && (
                        <g opacity={0.75}>
                            <Prims prims={markupPrims(draftMarkup, p.measureText)} />
                        </g>
                    )}
                    {draft && (tool === "region" || tool === "calibrate") &&
                        (tool === "region" ? (
                            <rect
                                x={Math.min(draft.a.x, draft.b.x)}
                                y={Math.min(draft.a.y, draft.b.y)}
                                width={Math.abs(draft.b.x - draft.a.x)}
                                height={Math.abs(draft.b.y - draft.a.y)}
                                fill="rgba(251,146,60,0.2)"
                                stroke="#ea580c"
                                strokeWidth={1.5 / z}
                                strokeDasharray={`${5 / z} ${3 / z}`}
                            />
                        ) : (
                            <line x1={draft.a.x} y1={draft.a.y} x2={draft.b.x} y2={draft.b.y} stroke="#026EFF" strokeWidth={2 / z} strokeDasharray={`${6 / z} ${3 / z}`} />
                        ))}
                    {p.measureLine && !draft && (
                        <line
                            x1={p.measureLine.a.x}
                            y1={p.measureLine.a.y}
                            x2={p.measureLine.b.x}
                            y2={p.measureLine.b.y}
                            stroke="#026EFF"
                            strokeWidth={2 / z}
                            strokeDasharray={`${6 / z} ${3 / z}`}
                        />
                    )}
                </svg>

                {/* Small labels get a bigger tap area, drawn underneath every real box so a
                    tap on a label's own box always picks that label. */}
                {p.minHit > 0 &&
                    sorted.map((r) => {
                        const w = r.box.w * z
                        const h = r.box.h * z
                        if (w >= p.minHit && h >= p.minHit) return null
                        const hw = Math.max(w, p.minHit)
                        const hh = Math.max(h, p.minHit)
                        return (
                            <div
                                key={`pad-${r.id}`}
                                data-hit=""
                                data-pad-for={r.id}
                                aria-hidden
                                className="absolute"
                                style={{
                                    left: r.box.x * z,
                                    top: r.box.y * z,
                                    width: hw,
                                    height: hh,
                                    transform: `rotate(${r.box.angle}deg) translate(${-(hw - w) / 2}px, ${-(hh - h) / 2}px)`,
                                    transformOrigin: "0 0",
                                    pointerEvents: clickable ? "auto" : "none",
                                    cursor: "pointer",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    p.onRegionClick(r)
                                }}
                            />
                        )
                    })}
                {sorted.map((r) => {
                    const s = p.regionState(r)
                    const w = Math.max(r.box.w * z, 2)
                    const h = Math.max(r.box.h * z, 2)
                    const tone = s.active
                        ? "bg-blue-200/60 border-2 border-blue-600"
                        : s.deleted
                          ? "bg-red-200/50 border border-red-500"
                          : s.edited !== undefined
                            ? "bg-green-100/80 border border-green-500"
                            : r.kind === "shx"
                              ? "bg-violet-100/40 border border-violet-400 hover:bg-violet-200/60"
                              : "bg-orange-100/40 border border-orange-400 hover:bg-orange-200/60"
                    return (
                        <div
                            key={r.id}
                            data-hit=""
                            data-region={r.kind}
                            data-id={r.id}
                            className={`absolute overflow-hidden whitespace-nowrap ${tone}`}
                            style={{
                                left: r.box.x * z,
                                top: r.box.y * z,
                                width: w,
                                height: h,
                                transform: `rotate(${r.box.angle}deg)`,
                                transformOrigin: "0 0",
                                pointerEvents: clickable ? "auto" : "none",
                                cursor: "pointer",
                                fontSize: h * 0.78,
                                lineHeight: `${h}px`,
                                color: r.color,
                                fontFamily: "Helvetica, Arial, sans-serif",
                            }}
                            onClick={(e) => {
                                e.stopPropagation()
                                p.onRegionClick(r)
                            }}
                            title={regionTitle(r, s)}
                        >
                            {s.edited !== undefined && h >= 6 ? s.edited : null}
                        </div>
                    )
                })}
            </div>

            {draft && p.liveLabel && (tool === "measure" || tool === "calibrate") && (
                <div
                    className="pointer-events-none absolute z-10 rounded bg-slate-900/85 px-2 py-1 font-mono text-xs text-white"
                    style={{ left: draft.b.x * z + view.x + 14, top: draft.b.y * z + view.y + 14 }}
                >
                    {p.liveLabel(draft.a, draft.b)}
                </div>
            )}

            {p.busy && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
                    <span className="rounded-lg bg-white px-4 py-2 text-sm text-slate-700 shadow">{p.busy}</span>
                </div>
            )}
            {p.overlay}
        </div>
    )
}

function Prims({ prims, hitWidth }: { prims: Prim[]; hitWidth?: number }) {
    return (
        <>
            {prims.map((q, i) => {
                if (q.t === "path") {
                    const d = cmdsToSvg(q.cmds)
                    return (
                        <g key={i}>
                            <path
                                d={d}
                                fill={q.fill ?? "none"}
                                stroke={q.stroke ?? "none"}
                                strokeWidth={q.stroke ? q.width : 0}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity={q.opacity}
                                style={q.multiply ? { mixBlendMode: "multiply" } : undefined}
                            />
                            {hitWidth ? <path d={d} fill={q.fill ? "transparent" : "none"} stroke="transparent" strokeWidth={Math.max(q.width, hitWidth)} /> : null}
                        </g>
                    )
                }
                return (
                    <text
                        key={i}
                        x={q.at.x}
                        y={q.at.y}
                        fontSize={q.size}
                        fill={q.color}
                        fontWeight={q.bold ? 700 : 400}
                        fontFamily="Helvetica, Arial, sans-serif"
                        transform={q.angle ? `rotate(${q.angle} ${q.at.x} ${q.at.y})` : undefined}
                        style={{ whiteSpace: "pre" }}
                    >
                        {q.text}
                    </text>
                )
            })}
        </>
    )
}

const MARKUP_NAMES: Record<Markup["kind"], string> = {
    arrow: "Arrow",
    cloud: "Revision cloud",
    rect: "Rectangle",
    highlight: "Highlight",
    note: "Note",
    stamp: "Stamp",
    measure: "Measurement",
}

export function markupTitle(m: Markup): string {
    const name = MARKUP_NAMES[m.kind]
    return m.text ? `${name}: ${m.text.split("\n")[0]}` : name
}

function regionTitle(r: Region, s: { edited?: string; deleted: boolean }): string {
    const was = r.originalText ? `"${r.originalText}"` : ""
    if (s.deleted) return `Deleted${was ? `: ${was}` : ""} — click to restore or edit`
    if (s.edited !== undefined) return `Edited: "${s.edited}"${was ? ` (was ${was})` : ""}`
    if (r.originalText) return `${was} — click to edit or delete`
    return r.kind === "shx" ? "SHX text (drawn as lines) — click to replace it" : "Click to edit this text region"
}
