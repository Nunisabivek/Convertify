import type { Pt } from './geometry.ts'

/**
 * CAD markups (arrow, revision cloud, rectangle, highlight, text note, stamp,
 * measurement) as drawing primitives in display space (points, y down). The same
 * primitives are drawn as SVG in the editor and as vector PDF content on export,
 * so what you see is what gets written.
 */
export type MarkupKind = 'arrow' | 'cloud' | 'rect' | 'highlight' | 'note' | 'stamp' | 'measure'

export const STAMPS = ['APPROVED', 'REVISED', 'FOR CONSTRUCTION', 'NOT FOR CONSTRUCTION'] as const
export type StampLabel = (typeof STAMPS)[number]

export type Markup = {
    id: string
    page: number
    kind: MarkupKind
    /** "#rrggbb" */
    color: string
    /** Line width in points. */
    width: number
    /** Start / first corner / anchor (top-left of a note or stamp). */
    a: Pt
    /** End / opposite corner (unused for notes and stamps). */
    b: Pt
    /** Note text, stamp label, or measurement label. */
    text?: string
    /** Stamp date line. */
    date?: string
    /** Text size in points (notes, stamps, measurement labels). */
    size?: number
}

export type PathCmd = { op: 'M' | 'L' | 'C'; pts: Pt[] } | { op: 'Z'; pts: [] }

export type Prim =
    | {
          t: 'path'
          cmds: PathCmd[]
          stroke?: string
          fill?: string
          width: number
          opacity?: number
          multiply?: boolean
      }
    | {
          t: 'text'
          text: string
          /** Baseline start, display space. */
          at: Pt
          /** Clockwise on screen, degrees. */
          angle: number
          size: number
          color: string
          bold?: boolean
      }

/** Text advance in points for a string at `size` (pdf-lib metrics on export, canvas in the editor). */
export type MeasureText = (text: string, size: number, bold: boolean) => number

const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y })
const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y })
const mulv = (a: Pt, k: number): Pt => ({ x: a.x * k, y: a.y * k })
const len = (a: Pt) => Math.hypot(a.x, a.y)

export function normRect(a: Pt, b: Pt) {
    return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) }
}

/** Filled triangular arrowhead with its tip at `tip`, pointing away from `from`. */
export function arrowHead(from: Pt, tip: Pt, headLen: number): Pt[] {
    const d = sub(tip, from)
    const l = len(d) || 1
    const u = mulv(d, 1 / l)
    const n = { x: -u.y, y: u.x }
    const base = sub(tip, mulv(u, headLen))
    const half = headLen * 0.38
    return [tip, add(base, mulv(n, half)), sub(base, mulv(n, half))]
}

/**
 * Revision cloud around a rectangle: the outline split into chords of about
 * `arc` points, each bulging outwards as a cubic curve. Corners go clockwise on
 * screen (y down), so the outward normal of edge direction (dx, dy) is (dy, -dx).
 */
export function cloudCmds(a: Pt, b: Pt, arc?: number): PathCmd[] {
    const r = normRect(a, b)
    const corners: Pt[] = [
        { x: r.x, y: r.y },
        { x: r.x + r.w, y: r.y },
        { x: r.x + r.w, y: r.y + r.h },
        { x: r.x, y: r.y + r.h },
    ]
    const size = arc ?? Math.max(6, Math.min(24, (2 * (r.w + r.h)) / 24))
    const cmds: PathCmd[] = [{ op: 'M', pts: [corners[0]] }]
    for (let e = 0; e < 4; e++) {
        const p0 = corners[e]
        const p1 = corners[(e + 1) % 4]
        const d = sub(p1, p0)
        const l = len(d)
        if (l === 0) continue
        const n = Math.max(1, Math.round(l / size))
        const out = { x: d.y / l, y: -d.x / l }
        for (let i = 0; i < n; i++) {
            const s = add(p0, mulv(d, i / n))
            const t = add(p0, mulv(d, (i + 1) / n))
            const h = (l / n) * 0.6
            cmds.push({ op: 'C', pts: [add(s, mulv(out, h)), add(t, mulv(out, h)), t] })
        }
    }
    cmds.push({ op: 'Z', pts: [] })
    return cmds
}

const poly = (pts: Pt[], close = true): PathCmd[] => [
    { op: 'M', pts: [pts[0]] },
    ...pts.slice(1).map((p): PathCmd => ({ op: 'L', pts: [p] })),
    ...(close ? [{ op: 'Z', pts: [] } as PathCmd] : []),
]

/** Keep text readable: an angle on screen folded into (-90, 90]. */
export function uprightAngle(deg: number): number {
    let d = ((deg % 360) + 360) % 360
    if (d > 180) d -= 360
    if (d > 90) d -= 180
    if (d <= -90) d += 180
    return d
}

export function stampBox(m: Markup, measureText: MeasureText) {
    const size = m.size ?? 16
    const label = m.text || 'APPROVED'
    const dateSize = size * 0.55
    const pad = size * 0.45
    const labelW = measureText(label, size, true)
    const dateW = m.date ? measureText(m.date, dateSize, false) : 0
    const w = Math.max(labelW, dateW) + 2 * pad
    const h = pad + size * 0.72 + (m.date ? size * 0.35 + dateSize * 0.72 : 0) + pad
    return { x: m.a.x, y: m.a.y, w, h, size, dateSize, pad, labelW, dateW }
}

export const NOTE_LINE_HEIGHT = 1.25

/** The primitives that draw a markup. */
export function markupPrims(m: Markup, measureText: MeasureText): Prim[] {
    const w = m.width
    switch (m.kind) {
        case 'arrow': {
            const head = arrowHead(m.a, m.b, Math.max(6, w * 5))
            const base = mulv(add(head[1], head[2]), 0.5)
            return [
                { t: 'path', cmds: poly([m.a, base], false), stroke: m.color, width: w },
                { t: 'path', cmds: poly(head), fill: m.color, stroke: m.color, width: Math.min(w, 1) },
            ]
        }
        case 'cloud':
            return [{ t: 'path', cmds: cloudCmds(m.a, m.b), stroke: m.color, width: w }]
        case 'rect': {
            const r = normRect(m.a, m.b)
            return [
                {
                    t: 'path',
                    cmds: poly([
                        { x: r.x, y: r.y },
                        { x: r.x + r.w, y: r.y },
                        { x: r.x + r.w, y: r.y + r.h },
                        { x: r.x, y: r.y + r.h },
                    ]),
                    stroke: m.color,
                    width: w,
                },
            ]
        }
        case 'highlight': {
            const r = normRect(m.a, m.b)
            return [
                {
                    t: 'path',
                    cmds: poly([
                        { x: r.x, y: r.y },
                        { x: r.x + r.w, y: r.y },
                        { x: r.x + r.w, y: r.y + r.h },
                        { x: r.x, y: r.y + r.h },
                    ]),
                    fill: m.color,
                    width: 0,
                    opacity: 0.35,
                    multiply: true,
                },
            ]
        }
        case 'note': {
            const size = m.size ?? 12
            const lines = (m.text || '').split('\n')
            return lines.map(
                (line, i): Prim => ({
                    t: 'text',
                    text: line,
                    at: { x: m.a.x, y: m.a.y + size * 0.8 + i * size * NOTE_LINE_HEIGHT },
                    angle: 0,
                    size,
                    color: m.color,
                }),
            )
        }
        case 'stamp': {
            const s = stampBox(m, measureText)
            const outer = [
                { x: s.x, y: s.y },
                { x: s.x + s.w, y: s.y },
                { x: s.x + s.w, y: s.y + s.h },
                { x: s.x, y: s.y + s.h },
            ]
            const i = Math.max(2, w + 1.5)
            const inner = [
                { x: s.x + i, y: s.y + i },
                { x: s.x + s.w - i, y: s.y + i },
                { x: s.x + s.w - i, y: s.y + s.h - i },
                { x: s.x + i, y: s.y + s.h - i },
            ]
            const prims: Prim[] = [
                { t: 'path', cmds: poly(outer), stroke: m.color, width: Math.max(1.5, w) },
                { t: 'path', cmds: poly(inner), stroke: m.color, width: 0.6 },
                {
                    t: 'text',
                    text: m.text || 'APPROVED',
                    at: { x: s.x + (s.w - s.labelW) / 2, y: s.y + s.pad + s.size * 0.72 },
                    angle: 0,
                    size: s.size,
                    color: m.color,
                    bold: true,
                },
            ]
            if (m.date)
                prims.push({
                    t: 'text',
                    text: m.date,
                    at: { x: s.x + (s.w - s.dateW) / 2, y: s.y + s.h - s.pad },
                    angle: 0,
                    size: s.dateSize,
                    color: m.color,
                })
            return prims
        }
        case 'measure': {
            const head = Math.max(5, w * 4)
            const prims: Prim[] = [
                { t: 'path', cmds: poly([m.a, m.b], false), stroke: m.color, width: w },
                { t: 'path', cmds: poly(arrowHead(m.b, m.a, head)), fill: m.color, stroke: m.color, width: Math.min(w, 1) },
                { t: 'path', cmds: poly(arrowHead(m.a, m.b, head)), fill: m.color, stroke: m.color, width: Math.min(w, 1) },
            ]
            if (m.text) {
                const size = m.size ?? 10
                const raw = (Math.atan2(m.b.y - m.a.y, m.b.x - m.a.x) * 180) / Math.PI
                const ang = uprightAngle(raw)
                const r = (ang * Math.PI) / 180
                const u = { x: Math.cos(r), y: Math.sin(r) }
                const up = { x: Math.sin(r), y: -Math.cos(r) }
                const mid = mulv(add(m.a, m.b), 0.5)
                const tw = measureText(m.text, size, false)
                const at = add(sub(mid, mulv(u, tw / 2)), mulv(up, size * 0.35 + w))
                prims.push({ t: 'text', text: m.text, at, angle: ang, size, color: m.color })
            }
            return prims
        }
    }
}

/** SVG path data for display (and, after mapping points, for export). */
export function cmdsToSvg(cmds: PathCmd[], map: (p: Pt) => Pt = (p) => p, digits = 2): string {
    const f = (n: number) => +n.toFixed(digits)
    return cmds
        .map((c) => (c.op === 'Z' ? 'Z' : c.op + ' ' + c.pts.map((p) => { const q = map(p); return `${f(q.x)} ${f(q.y)}` }).join(' ')))
        .join(' ')
}

/** Rough bounds of a markup, for hit-testing and lists. */
export function markupBounds(m: Markup, measureText: MeasureText) {
    if (m.kind === 'stamp') {
        const s = stampBox(m, measureText)
        return { x: s.x, y: s.y, w: s.w, h: s.h }
    }
    if (m.kind === 'note') {
        const size = m.size ?? 12
        const lines = (m.text || '').split('\n')
        const w = Math.max(...lines.map((l) => measureText(l, size, false)), size)
        return { x: m.a.x, y: m.a.y, w, h: size * (0.3 + lines.length * NOTE_LINE_HEIGHT) }
    }
    const r = normRect(m.a, m.b)
    return { x: r.x - m.width, y: r.y - m.width, w: r.w + 2 * m.width, h: r.h + 2 * m.width }
}

export function todayLabel(d = new Date()): string {
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
