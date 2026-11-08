"use client"

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import {
    ArrowUpRight,
    Check,
    ChevronLeft,
    ChevronRight,
    Cloud,
    Download,
    Ellipsis,
    Highlighter,
    Maximize2,
    MousePointer2,
    MoveHorizontal,
    RotateCcw,
    Ruler,
    Square,
    Stamp,
    StickyNote,
    TextCursorInput,
    Trash2,
    Undo2,
    X,
    ZoomIn,
    ZoomOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { STAMPS, type Markup, type StampLabel } from "@/lib/cad/markup"
import { UNITS, type Unit } from "@/lib/cad/measure"
import type { Tool } from "./types"
import { markupTitle } from "./viewer"

export const MARKUP_COLORS = ["#e00000", "#1d4ed8", "#15803d", "#c026d3", "#ea580c", "#000000"]
export const WIDTH_NAMES = ["Thin", "Medium", "Thick"]

const TOOLS: Array<{ id: Tool; label: string; hint: string; icon: ReactNode }> = [
    { id: "select", label: "Select", hint: "Select text to edit, or drag the drawing to pan", icon: <MousePointer2 className="h-4 w-4" /> },
    { id: "region", label: "Add text", hint: "Drag a box around text the editor missed", icon: <TextCursorInput className="h-4 w-4" /> },
    { id: "arrow", label: "Arrow", hint: "Drag from the tail to the tip", icon: <ArrowUpRight className="h-4 w-4" /> },
    { id: "cloud", label: "Cloud", hint: "Drag a revision cloud around a change", icon: <Cloud className="h-4 w-4" /> },
    { id: "rect", label: "Box", hint: "Drag a rectangle", icon: <Square className="h-4 w-4" /> },
    { id: "highlight", label: "Highlight", hint: "Drag over an area to highlight it", icon: <Highlighter className="h-4 w-4" /> },
    { id: "note", label: "Note", hint: "Click where the note should go", icon: <StickyNote className="h-4 w-4" /> },
    { id: "stamp", label: "Stamp", hint: "Pick a stamp, then click where it goes", icon: <Stamp className="h-4 w-4" /> },
    { id: "measure", label: "Measure", hint: "Drag between two points to measure (Shift keeps it straight)", icon: <Ruler className="h-4 w-4" /> },
]

export const toolHint = (t: Tool) =>
    t === "calibrate" ? "Drag along a dimension whose real length you know" : (TOOLS.find((x) => x.id === t)?.hint ?? "")

type ToolbarProps = {
    /** Compact on a short (landscape phone) screen: everything in one row. */
    oneRow?: boolean
    /** compact: phones (two rows, or one on short landscape screens); medium: tablets; full: desktop. */
    mode: "compact" | "medium" | "full"
    stickyClass: string
    page: number
    numPages: number
    onPage: (n: number) => void
    zoomPct: number
    onZoom: (factor: number) => void
    fitMode: "page" | "width" | null
    onFit: (mode: "page" | "width") => void
    tool: Tool
    onTool: (t: Tool) => void
    color: string
    onColor: (c: string) => void
    widthLevel: number
    onWidth: (n: number) => void
    stampLabel: StampLabel
    onStampLabel: (s: StampLabel) => void
    stampDate: boolean
    onStampDate: (b: boolean) => void
    scaleLabel: string | null
    onCalibrate: () => void
    onClearScale: () => void
    canUndo: boolean
    onUndo: () => void
    autocadMode: boolean
    onAutocadMode: (b: boolean) => void
    changeCount: number
    onClearAll: () => void
    showExport: boolean
    onExport: () => void
}

/** No double-tap zoom or 300 ms click delay on any control inside (iOS Safari). */
const TOUCH = "touch-manipulation [&_button]:touch-manipulation [&_label]:touch-manipulation [&_select]:touch-manipulation [&_input]:touch-manipulation"

export function Toolbar(p: ToolbarProps) {
    const compact = p.mode === "compact"
    const full = p.mode === "full"
    const [menu, setMenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!menu) return
        const close = (e: PointerEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) setMenu(false)
        }
        window.addEventListener("pointerdown", close)
        return () => window.removeEventListener("pointerdown", close)
    }, [menu])

    const icon = compact ? "h-8 w-7 p-0 shrink-0" : "h-8 w-8 p-0 shrink-0"
    const nav = (
        <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" className={icon} onClick={() => p.onPage(p.page - 1)} disabled={p.page <= 1} title="Previous page">
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="whitespace-nowrap px-1 font-mono text-xs sm:text-sm">
                {compact ? `${p.page}/${p.numPages}` : `Page ${p.page} / ${p.numPages}`}
            </span>
            <Button size="sm" variant="outline" className={icon} onClick={() => p.onPage(p.page + 1)} disabled={p.page >= p.numPages} title="Next page">
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
    const zoom = (
        <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" className={icon} onClick={() => p.onZoom(1 / 1.25)} title="Zoom out (−)">
                <ZoomOut className="h-4 w-4" />
            </Button>
            <button
                type="button"
                className={`${compact ? "min-w-[40px]" : "min-w-[48px]"} h-8 rounded px-1 text-center font-mono text-xs hover:bg-slate-100 sm:text-sm`}
                onClick={() => p.onFit("page")}
                title="Fit page (0)"
            >
                {p.zoomPct}%
            </button>
            <Button size="sm" variant="outline" className={icon} onClick={() => p.onZoom(1.25)} title="Zoom in (+)">
                <ZoomIn className="h-4 w-4" />
            </Button>
        </div>
    )
    const exportBtn = p.showExport ? (
        <Button size="sm" onClick={p.onExport} disabled={p.changeCount === 0} className={`shrink-0 bg-orange-600 hover:bg-orange-700 ${compact ? "px-2" : ""}`}>
            <Download className="mr-1 h-4 w-4" /> {compact ? "Export" : "Export PDF"}
        </Button>
    ) : null
    const autocadToggle = (
        <label
            className="flex min-h-7 cursor-pointer select-none items-center gap-2 text-xs text-slate-600"
            title="Skip the paper-coloured cover behind replacement text. Text that can't be removed from the PDF stays visible under the new text, but the file imports into AutoCAD without filled-rectangle artefacts."
        >
            <input type="checkbox" checked={p.autocadMode} onChange={(e) => p.onAutocadMode(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            AutoCAD-friendly mode
        </label>
    )

    const tools = TOOLS.map((t) => (
        <Button
            key={t.id}
            size="sm"
            variant={p.tool === t.id || (t.id === "measure" && p.tool === "calibrate") ? "default" : "outline"}
            className={full ? "h-8 shrink-0 px-2" : icon}
            onClick={() => p.onTool(t.id)}
            title={`${t.label}: ${t.hint}`}
            aria-label={t.label}
            aria-pressed={p.tool === t.id}
        >
            {t.icon}
            {full && <span className="ml-1 hidden xl:inline">{t.label}</span>}
        </Button>
    ))
    const style = (
        <div className="flex shrink-0 items-center gap-1">
            {(full ? MARKUP_COLORS : []).map((c) => (
                <button
                    key={c}
                    type="button"
                    onClick={() => p.onColor(c)}
                    className={`h-7 w-7 shrink-0 rounded-full border-2 ${p.color === c ? "border-slate-900 ring-2 ring-white ring-offset-1" : "border-white shadow"}`}
                    style={{ background: c }}
                    title={`Markup colour ${c}`}
                    aria-label={`Markup colour ${c}`}
                />
            ))}
            <label className="relative h-7 w-7 shrink-0 cursor-pointer overflow-hidden rounded-full border shadow" title="Pick any markup colour">
                <span className="absolute inset-0" style={{ background: full ? "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)" : p.color }} />
                <input type="color" value={p.color} onChange={(e) => p.onColor(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label="Markup colour" />
            </label>
            <div className="ml-1 flex items-center gap-0.5 rounded-md border p-0.5" role="group" aria-label="Line width">
                {WIDTH_NAMES.map((name, i) => (
                    <button
                        key={name}
                        type="button"
                        onClick={() => p.onWidth(i)}
                        className={`flex h-7 w-7 items-center justify-center rounded ${p.widthLevel === i ? "bg-slate-800" : "hover:bg-slate-100"}`}
                        title={`${name} lines`}
                        aria-label={`${name} lines`}
                    >
                        <span className={`block w-4 rounded-full ${p.widthLevel === i ? "bg-white" : "bg-slate-700"}`} style={{ height: 1 + i * 1.5 }} />
                    </button>
                ))}
            </div>
            <Button size="sm" variant="outline" className={icon} onClick={p.onUndo} disabled={!p.canUndo} title="Undo last markup (Ctrl+Z)" aria-label="Undo last markup">
                <Undo2 className="h-4 w-4" />
            </Button>
        </div>
    )
    const context =
        p.tool === "stamp" ? (
            <div className="flex shrink-0 items-center gap-2 text-xs">
                <select value={p.stampLabel} onChange={(e) => p.onStampLabel(e.target.value as StampLabel)} className="h-8 rounded border border-slate-300 bg-white px-1 text-xs" aria-label="Stamp">
                    {STAMPS.map((s) => (
                        <option key={s}>{s}</option>
                    ))}
                </select>
                <label className="flex min-h-7 items-center gap-1 whitespace-nowrap px-1">
                    <input type="checkbox" checked={p.stampDate} onChange={(e) => p.onStampDate(e.target.checked)} /> Date
                </label>
            </div>
        ) : p.tool === "measure" || p.tool === "calibrate" ? (
            <div className="flex shrink-0 items-center gap-1 text-xs">
                <span className="whitespace-nowrap text-slate-600">{p.scaleLabel ?? "Not calibrated (paper mm)"}</span>
                <Button size="sm" variant={p.tool === "calibrate" ? "default" : "outline"} className="h-7 px-2 text-xs" onClick={p.onCalibrate}>
                    Set scale
                </Button>
                {p.scaleLabel && (
                    <button type="button" className="inline-flex h-7 w-7 items-center justify-center text-slate-400 hover:text-red-600" onClick={p.onClearScale} title="Forget this sheet's scale" aria-label="Forget scale">
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        ) : null

    const overflow = (
        <div ref={menuRef} className="relative">
            <Button size="sm" variant="outline" className={icon} onClick={() => setMenu((m) => !m)} title="More" aria-label="More options" aria-expanded={menu}>
                <Ellipsis className="h-4 w-4" />
            </Button>
            {menu && (
                <div className={`absolute right-0 top-9 z-40 w-60 rounded-lg border bg-white p-1 text-sm shadow-lg ${TOUCH}`}>
                    <MenuItem onClick={() => { p.onFit("page"); setMenu(false) }} icon={<Maximize2 className="h-4 w-4" />}>Fit page</MenuItem>
                    <MenuItem onClick={() => { p.onFit("width"); setMenu(false) }} icon={<MoveHorizontal className="h-4 w-4" />}>Fit width</MenuItem>
                    <MenuItem onClick={() => { p.onCalibrate(); setMenu(false) }} icon={<Ruler className="h-4 w-4" />}>Set drawing scale</MenuItem>
                    <div className="px-2 py-2">{autocadToggle}</div>
                    {p.changeCount > 0 && (
                        <MenuItem onClick={() => { p.onClearAll(); setMenu(false) }} icon={<RotateCcw className="h-4 w-4" />}>
                            Clear all changes ({p.changeCount})
                        </MenuItem>
                    )}
                </div>
            )}
        </div>
    )

    const divider = <div className="mx-0.5 h-6 w-px shrink-0 bg-slate-200" />
    const scroller = "flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] " + TOUCH
    if (compact && p.oneRow) {
        // Landscape phones: one row, so the drawing keeps most of the short screen.
        return (
            <div data-testid="cad-toolbar" className={`sticky z-20 rounded-xl border bg-white p-1.5 shadow-md ${TOUCH} ${p.stickyClass}`}>
                <div className="flex items-center gap-1">
                    {nav}
                    {divider}
                    {zoom}
                    {divider}
                    <div className={`${scroller} flex-1`}>
                        {tools}
                        {divider}
                        {style}
                        {context && divider}
                        {context}
                    </div>
                    {overflow}
                    {exportBtn}
                </div>
            </div>
        )
    }
    if (compact) {
        return (
            <div data-testid="cad-toolbar" className={`sticky z-20 space-y-2 rounded-xl border bg-white p-2 shadow-md ${TOUCH} ${p.stickyClass}`}>
                <div className="flex items-center gap-1">
                    {nav}
                    {divider}
                    {zoom}
                    <div className="ml-auto flex items-center gap-1">
                        {overflow}
                        {exportBtn}
                    </div>
                </div>
                <div className={`-mx-2 px-2 pb-0.5 ${scroller}`}>
                    {tools}
                    {divider}
                    {style}
                    {context && divider}
                    {context}
                </div>
            </div>
        )
    }
    if (!full) {
        // Tablets and mid-size windows: fit buttons as icons, AutoCAD mode and Clear in the
        // menu, one swatch for colour. Two rows that never wrap into a third.
        return (
            <div data-testid="cad-toolbar" className={`sticky z-20 space-y-2 rounded-xl border bg-white p-2 shadow-md ${TOUCH} ${p.stickyClass}`}>
                <div className="flex items-center gap-1.5">
                    {nav}
                    {divider}
                    {zoom}
                    <Button size="sm" variant={p.fitMode === "page" ? "default" : "outline"} className={icon} onClick={() => p.onFit("page")} title="Fit whole page in view (0)" aria-label="Fit page">
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant={p.fitMode === "width" ? "default" : "outline"} className={icon} onClick={() => p.onFit("width")} title="Fit page width" aria-label="Fit width">
                        <MoveHorizontal className="h-4 w-4" />
                    </Button>
                    <div className="ml-auto flex items-center gap-1.5">
                        {overflow}
                        {exportBtn}
                    </div>
                </div>
                <div className={scroller}>
                    {tools}
                    {divider}
                    {style}
                    {context && divider}
                    {context}
                </div>
            </div>
        )
    }
    return (
        <div data-testid="cad-toolbar" className={`sticky z-20 space-y-2 rounded-xl border bg-white p-2 shadow-md sm:p-3 ${TOUCH} ${p.stickyClass}`}>
            <div className="flex flex-wrap items-center gap-2">
                {nav}
                <div className="h-6 w-px bg-slate-200" />
                {zoom}
                <Button size="sm" variant={p.fitMode === "page" ? "default" : "outline"} className="h-8 px-2" onClick={() => p.onFit("page")} title="Fit whole page in view (0)">
                    <Maximize2 className="mr-1 h-4 w-4" /> Fit Page
                </Button>
                <Button size="sm" variant={p.fitMode === "width" ? "default" : "outline"} className="h-8 px-2" onClick={() => p.onFit("width")} title="Fit page width">
                    <MoveHorizontal className="mr-1 h-4 w-4" /> Fit Width
                </Button>
                <div className="ml-auto flex items-center gap-3">
                    {autocadToggle}
                    {p.changeCount > 0 && (
                        <Button size="sm" variant="outline" className="h-8 px-2" onClick={p.onClearAll}>
                            <RotateCcw className="mr-1 h-4 w-4" /> Clear All ({p.changeCount})
                        </Button>
                    )}
                    {exportBtn}
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-1">
                {tools}
                <div className="mx-1 h-6 w-px bg-slate-200" />
                {style}
                {context && <div className="mx-1 h-6 w-px bg-slate-200" />}
                {context}
            </div>
        </div>
    )
}

function MenuItem({ onClick, icon, children }: { onClick: () => void; icon: ReactNode; children: ReactNode }) {
    return (
        <button type="button" onClick={onClick} className="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-slate-100">
            {icon}
            {children}
        </button>
    )
}

/**
 * A small editor: a popover beside the anchor (frame px) on wide screens, a bottom
 * sheet on narrow ones so it never sits under the finger or off-screen.
 */
export function Sheet({
    narrow,
    anchor,
    frame,
    title,
    onSheetTop,
    children,
}: {
    narrow: boolean
    anchor: { x: number; y: number; w: number; h: number } | null
    frame: { w: number; h: number }
    title?: ReactNode
    /** The bottom sheet's top edge on screen (null when closed), so the drawing can move out from under it. */
    onSheetTop?: (top: number | null) => void
    children: ReactNode
}) {
    const ref = useRef<HTMLDivElement>(null)
    const sheetRef = useRef<HTMLDivElement>(null)
    const keyboard = useKeyboardInset(narrow)
    const reportRef = useRef(onSheetTop)
    useLayoutEffect(() => {
        reportRef.current = onSheetTop
    })
    useLayoutEffect(() => {
        const el = sheetRef.current
        if (!narrow || !el) return
        const report = () => reportRef.current?.(Math.round(el.getBoundingClientRect().top))
        report()
        const ro = new ResizeObserver(report)
        ro.observe(el)
        return () => {
            ro.disconnect()
            reportRef.current?.(null)
        }
    }, [narrow])
    useLayoutEffect(() => {
        const el = sheetRef.current
        if (narrow && el) reportRef.current?.(Math.round(el.getBoundingClientRect().top))
    }, [narrow, keyboard])
    const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
    const pw = Math.min(360, Math.max(220, frame.w - 16))
    useLayoutEffect(() => {
        if (narrow || !anchor || !ref.current) return
        const ph = ref.current.offsetHeight
        const left = Math.max(8, Math.min(anchor.x, frame.w - pw - 8))
        let top = anchor.y + anchor.h + 6
        if (top + ph > frame.h - 8) top = anchor.y - ph - 6
        if (top < 8) top = Math.max(8, Math.min(frame.h - ph - 8, anchor.y + anchor.h + 6))
        setPos((old) => (old && old.left === left && old.top === top ? old : { left, top }))
    }, [narrow, anchor, frame.w, frame.h, pw])

    const stop = {
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
    }
    if (narrow) {
        return (
            <div
                ref={sheetRef}
                data-overlay=""
                data-testid="cad-sheet"
                className={`fixed inset-x-0 z-50 border-t border-slate-200 bg-white p-3 pb-[max(12px,env(safe-area-inset-bottom))] pl-[max(12px,env(safe-area-inset-left))] pr-[max(12px,env(safe-area-inset-right))] shadow-[0_-8px_24px_rgba(2,110,255,0.12)] ${TOUCH}`}
                // Above the on-screen keyboard where the browser doesn't move fixed elements (iOS).
                style={{ bottom: keyboard }}
                {...stop}
            >
                {title && <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-600">{title}</p>}
                {children}
            </div>
        )
    }
    return (
        <div
            ref={ref}
            data-overlay=""
            className={`absolute z-30 rounded-md border-2 border-[#026EFF] bg-white p-2 shadow-lg ${TOUCH}`}
            style={{ left: pos?.left ?? 8, top: pos?.top ?? 8, width: pw, visibility: pos || !anchor ? "visible" : "hidden" }}
            {...stop}
        >
            {title && <p className="mb-1.5 flex items-center gap-1.5 truncate text-xs font-semibold text-slate-600">{title}</p>}
            {children}
        </div>
    )
}

/** How far the on-screen keyboard (or a zoomed visual viewport) covers the bottom of the layout viewport. */
function useKeyboardInset(enabled: boolean) {
    const [inset, setInset] = useState(0)
    useEffect(() => {
        const vv = window.visualViewport
        if (!enabled || !vv) return
        const update = () => setInset(Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)))
        update()
        vv.addEventListener("resize", update)
        vv.addEventListener("scroll", update)
        return () => {
            vv.removeEventListener("resize", update)
            vv.removeEventListener("scroll", update)
        }
    }, [enabled])
    return enabled ? inset : 0
}

export function TextEditor({
    narrow,
    value,
    onChange,
    color,
    onColor,
    onSave,
    onDelete,
    onCancel,
}: {
    narrow: boolean
    value: string
    onChange: (s: string) => void
    color: string
    onColor: (c: string) => void
    onSave: () => void
    onDelete: () => void
    onCancel: () => void
}) {
    const keys = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") onSave()
        if (e.key === "Escape") onCancel()
    }
    const colorPick = (
        <label className="relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded border" title="Text colour (sampled from the drawing)">
            <span className="absolute inset-1 rounded-sm" style={{ background: color }} />
            <input type="color" value={color} onChange={(e) => onColor(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label="Text colour" />
        </label>
    )
    if (narrow) {
        return (
            <>
                <div className="mb-2 flex gap-2">
                    <input
                        autoFocus
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={keys}
                        placeholder="Type the corrected text"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-3 text-base focus:border-[#026EFF] focus:outline-none"
                    />
                    {colorPick}
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={onSave} className="flex-1 min-h-11 rounded-xl bg-[#026EFF] px-3 text-sm font-semibold text-white">
                        Save text
                    </button>
                    <button type="button" onClick={onDelete} className="min-h-11 rounded-xl border border-red-200 px-3 text-sm font-semibold text-red-600">
                        Delete
                    </button>
                    <button type="button" onClick={onCancel} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600">
                        Cancel
                    </button>
                </div>
            </>
        )
    }
    return (
        <div className="flex items-center gap-1">
            <input
                autoFocus
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={keys}
                placeholder="Type replacement text"
                className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-sm focus:border-[#026EFF] focus:outline-none"
            />
            {colorPick}
            <Button size="sm" onClick={onSave} className="h-8 bg-[#026EFF] px-2 hover:bg-[#0256d6]" title="Save replacement text" aria-label="Save">
                <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onDelete} className="h-8 border-red-300 px-2 text-red-600 hover:bg-red-50" title="Delete this text completely (leave it blank)" aria-label="Delete text">
                <Trash2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel} className="h-8 px-2" title="Cancel" aria-label="Cancel">
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}

export function NoteEditor({ onAdd, onCancel }: { onAdd: (text: string) => void; onCancel: () => void }) {
    const [text, setText] = useState("")
    return (
        <div className="space-y-2">
            <textarea
                autoFocus
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) onAdd(text)
                    if (e.key === "Escape") onCancel()
                }}
                placeholder="Note text (Ctrl+Enter to add)"
                className="w-full rounded border border-slate-200 px-2 py-1 text-base focus:border-[#026EFF] focus:outline-none sm:text-sm"
            />
            <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button size="sm" onClick={() => onAdd(text)} disabled={!text.trim()} className="bg-[#026EFF] hover:bg-[#0256d6]">
                    Add note
                </Button>
            </div>
        </div>
    )
}

export function CalibrateEditor({
    paperLabel,
    defaultUnit,
    onSet,
    onCancel,
}: {
    paperLabel: string
    defaultUnit: Unit
    onSet: (length: string, unit: Unit) => string | null
    onCancel: () => void
}) {
    const [len, setLen] = useState("")
    const [unit, setUnit] = useState<Unit>(defaultUnit)
    const [err, setErr] = useState<string | null>(null)
    const submit = () => setErr(onSet(len, unit))
    return (
        <div className="space-y-2 text-sm">
            <p className="text-xs text-slate-500">The line you drew is {paperLabel} on paper. What does it measure in reality?</p>
            <div className="flex gap-2">
                <input
                    autoFocus
                    inputMode="decimal"
                    value={len}
                    onChange={(e) => setLen(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") submit()
                        if (e.key === "Escape") onCancel()
                    }}
                    placeholder="e.g. 3600"
                    aria-label="Real length"
                    className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-base focus:border-[#026EFF] focus:outline-none sm:text-sm"
                />
                <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className="rounded border border-slate-200 px-1" aria-label="Unit">
                    {UNITS.map((u) => (
                        <option key={u}>{u}</option>
                    ))}
                </select>
            </div>
            {err && <p className="text-xs text-red-600">{err}</p>}
            <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button size="sm" onClick={submit} className="bg-[#026EFF] hover:bg-[#0256d6]">
                    Set scale
                </Button>
            </div>
        </div>
    )
}

export function MeasureResult({ label, calibrated, onAdd, onClose }: { label: string; calibrated: boolean; onAdd: () => void; onClose: () => void }) {
    return (
        <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-mono font-semibold">{label}</span>
            {!calibrated && <span className="text-xs text-slate-500">paper size — use Set scale for real units</span>}
            <div className="ml-auto flex gap-1">
                <Button size="sm" onClick={onAdd} className="h-8 bg-[#026EFF] px-2 hover:bg-[#0256d6]">
                    Add to drawing
                </Button>
                <Button size="sm" variant="outline" onClick={onClose} className="h-8 px-2" aria-label="Close measurement">
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

/** A thin bar: `done` 0..1, or null for "working, can't tell how far" (animated). */
export function ProgressBar({ done }: { done: number | null }) {
    return (
        <div className="h-1.5 w-full max-w-[280px] overflow-hidden rounded-full bg-slate-200" aria-hidden>
            {done == null ? (
                <div className="h-full w-1/3 animate-pulse rounded-full bg-[#026EFF]/70" />
            ) : (
                <div className="h-full rounded-full bg-[#026EFF] transition-[width] duration-200" style={{ width: `${Math.round(Math.max(0.03, Math.min(1, done)) * 100)}%` }} />
            )}
        </div>
    )
}

type ListItem = { key: string; original?: string; text?: string }

export function ChangeLists({
    edits,
    deleted,
    markups,
    selected,
    onRemoveEdit,
    onRestore,
    onSelectMarkup,
    onDeleteMarkup,
}: {
    edits: ListItem[]
    deleted: ListItem[]
    markups: Markup[]
    selected: string | null
    onRemoveEdit: (key: string) => void
    onRestore: (key: string) => void
    onSelectMarkup: (id: string) => void
    onDeleteMarkup: (id: string) => void
}) {
    if (!edits.length && !deleted.length && !markups.length) return null
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {edits.length > 0 && (
                <section className="rounded-xl border bg-slate-50 p-4">
                    <h3 className="mb-2 text-sm font-semibold text-slate-700">Edits on this page</h3>
                    <ul className="space-y-1 text-sm">
                        {edits.map((e) => (
                            <li key={e.key} className="flex items-center justify-between gap-2 rounded border bg-white px-3 py-2">
                                <span className="flex-1 truncate font-mono text-sm">
                                    {e.original && <span className="mr-2 text-slate-400 line-through">&ldquo;{e.original}&rdquo;</span>}
                                    <span className="text-green-700">&ldquo;{e.text}&rdquo;</span>
                                </span>
                                <button type="button" onClick={() => onRemoveEdit(e.key)} className="-m-1 inline-flex h-7 w-7 shrink-0 items-center justify-center text-slate-400 hover:text-red-600" aria-label="Undo this edit">
                                    <X className="h-4 w-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {deleted.length > 0 && (
                <section className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <h3 className="mb-2 text-sm font-semibold text-red-800">Deleted on this page</h3>
                    <ul className="space-y-1 text-sm">
                        {deleted.map((e) => (
                            <li key={e.key} className="flex items-center justify-between gap-2 rounded border bg-white px-3 py-2">
                                <span className="flex-1 truncate font-mono text-sm text-slate-400 line-through">{e.original ? `“${e.original}”` : "(text region)"}</span>
                                <button type="button" onClick={() => onRestore(e.key)} className="inline-flex min-h-7 items-center gap-1 text-xs text-slate-400 hover:text-blue-600">
                                    <RotateCcw className="h-4 w-4" /> Restore
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {markups.length > 0 && (
                <section className="rounded-xl border bg-slate-50 p-4">
                    <h3 className="mb-2 text-sm font-semibold text-slate-700">Markups on this page</h3>
                    <ul className="space-y-1 text-sm">
                        {markups.map((m) => (
                            <li
                                key={m.id}
                                className={`flex items-center justify-between gap-2 rounded border bg-white px-3 py-2 ${selected === m.id ? "border-[#026EFF]" : ""}`}
                            >
                                <button type="button" onClick={() => onSelectMarkup(m.id)} className="flex flex-1 items-center gap-2 truncate text-left">
                                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: m.color }} />
                                    <span className="truncate">{markupTitle(m)}</span>
                                </button>
                                <button type="button" onClick={() => onDeleteMarkup(m.id)} className="-m-1 inline-flex h-7 w-7 shrink-0 items-center justify-center text-slate-400 hover:text-red-600" aria-label="Delete markup" title="Delete markup">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    )
}
