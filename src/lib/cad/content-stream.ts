import { IDENTITY, apply, mul, vecAngleDeg, angleDiff, type Mat, type Pt } from './geometry.ts'

/**
 * Finds the text-showing operators (Tj, TJ, ', ") in a page content stream and
 * works out where each one starts in user space, so an edited label can be removed
 * operator by operator instead of hidden under a white box.
 *
 * Safety rules (removal is skipped, and the caller falls back to a cover box, when
 * any of them can't be met):
 *  - Only whole "chains" are removed. A chain is a show operator at a known position
 *    plus any show operators right after it that continue from its advance (no Tm,
 *    Td, TD, T* or BT in between). Removing half a chain would shift the rest.
 *  - A chain is removed only if every pdf.js text item it can produce belongs to an
 *    edited label. The chain's extent along its line runs to the next known start.
 *  - ' and " also move to the next line; they are rewritten to T* (and Tw/Tc for ")
 *    so later text keeps its place.
 */

export type Token = { kind: 'num' | 'name' | 'str' | 'hex' | 'op' | 'open' | 'close' | 'other'; text: string; start: number; end: number }

const WS = new Set([0x00, 0x09, 0x0a, 0x0c, 0x0d, 0x20])
const DELIM = new Set([0x28, 0x29, 0x3c, 0x3e, 0x5b, 0x5d, 0x7b, 0x7d, 0x2f, 0x25])

/** Tokenises a decoded content stream (a latin1 string, one char per byte). */
export function* tokenize(src: string): Generator<Token> {
    const n = src.length
    let i = 0
    while (i < n) {
        const c = src.charCodeAt(i)
        if (WS.has(c)) {
            i++
            continue
        }
        const start = i
        if (c === 0x25) {
            // % comment to end of line
            while (i < n && src.charCodeAt(i) !== 0x0a && src.charCodeAt(i) !== 0x0d) i++
            continue
        }
        if (c === 0x28) {
            // ( literal string ) with nesting and escapes
            let depth = 1
            i++
            while (i < n && depth > 0) {
                const ch = src.charCodeAt(i)
                if (ch === 0x5c) i += 2
                else {
                    if (ch === 0x28) depth++
                    else if (ch === 0x29) depth--
                    i++
                }
            }
            yield { kind: 'str', text: src.slice(start, i), start, end: i }
            continue
        }
        if (c === 0x3c) {
            if (src.charCodeAt(i + 1) === 0x3c) {
                i += 2
                yield { kind: 'open', text: '<<', start, end: i }
                continue
            }
            const close = src.indexOf('>', i + 1)
            i = close < 0 ? n : close + 1
            yield { kind: 'hex', text: src.slice(start, i), start, end: i }
            continue
        }
        if (c === 0x3e) {
            i += src.charCodeAt(i + 1) === 0x3e ? 2 : 1
            yield { kind: 'close', text: '>>', start, end: i }
            continue
        }
        if (c === 0x5b || c === 0x7b) {
            i++
            yield { kind: 'open', text: src[start], start, end: i }
            continue
        }
        if (c === 0x5d || c === 0x7d) {
            i++
            yield { kind: 'close', text: src[start], start, end: i }
            continue
        }
        if (c === 0x29) {
            i++
            yield { kind: 'other', text: ')', start, end: i }
            continue
        }
        if (c === 0x2f) {
            i++
            while (i < n && !WS.has(src.charCodeAt(i)) && !DELIM.has(src.charCodeAt(i))) i++
            yield { kind: 'name', text: src.slice(start, i), start, end: i }
            continue
        }
        while (i < n && !WS.has(src.charCodeAt(i)) && !DELIM.has(src.charCodeAt(i))) i++
        const text = src.slice(start, i)
        if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(text)) {
            yield { kind: 'num', text, start, end: i }
            continue
        }
        yield { kind: 'op', text, start, end: i }
        if (text === 'ID') {
            // Inline image data: skip to whitespace + EI + delimiter.
            let j = i + 1
            const re = /[\x00\t\n\f\r ]EI(?=[\x00\t\n\f\r ]|$)/g
            re.lastIndex = j
            const m = re.exec(src)
            j = m ? m.index + 3 : n
            yield { kind: 'other', text: '<inline image>', start: i, end: j }
            i = j
        }
    }
}

export type ShowOp = {
    /** Byte range [start, end) covering the operands and the operator. */
    start: number
    end: number
    op: 'Tj' | 'TJ' | "'" | '"'
    /** Replacement that keeps the line move of ' and ". */
    replacement: string
    /** Start position in user space (only meaningful when `known`). */
    pos: Pt
    angle: number
    size: number
    /** False when this op continues from the previous op's advance. */
    known: boolean
    /** Index of the chain (head op) this op belongs to. */
    chain: number
}

export type ScanResult = { shows: ShowOp[]; unbalancedQ: number }

/** Walks the operators, tracking the CTM (q/Q/cm) and text state. */
export function scanTextOps(src: string, initialCtm: Mat = IDENTITY): ScanResult {
    const shows: ShowOp[] = []
    const stack: Mat[] = []
    let ctm: Mat = initialCtm
    let tm: Mat = IDENTITY
    let tlm: Mat = IDENTITY
    let fontSize = 0
    let th = 1
    let leading = 0
    let rise = 0
    let inText = false
    let advanced = false
    let chainHead = -1
    let operands: Token[] = []
    let depth = 0
    let operandStart = -1

    const nums = (k: number): number[] | null => {
        if (operands.length < k) return null
        const v = operands.slice(operands.length - k).map((t) => (t.kind === 'num' ? Number(t.text) : NaN))
        return v.some((x) => !Number.isFinite(x)) ? null : v
    }
    const moveLine = (tx: number, ty: number) => {
        tlm = mul([1, 0, 0, 1, tx, ty], tlm)
        tm = tlm
        advanced = false
    }
    const show = (tok: Token, op: ShowOp['op'], replacement: string) => {
        if (!inText) return
        const trm = mul([fontSize * th, 0, 0, fontSize, 0, rise], mul(tm, ctm))
        const known = !advanced
        if (known) chainHead = shows.length
        shows.push({
            start: operandStart >= 0 ? operandStart : tok.start,
            end: tok.end,
            op,
            replacement,
            pos: apply(mul(tm, ctm), 0, rise),
            angle: vecAngleDeg(trm[0], trm[1]),
            size: Math.hypot(trm[2], trm[3]),
            known,
            chain: chainHead,
        })
        advanced = true
    }

    for (const tok of tokenize(src)) {
        if (tok.kind === 'open') {
            if (depth === 0 && operandStart < 0) operandStart = tok.start
            depth++
            continue
        }
        if (tok.kind === 'close') {
            depth = Math.max(0, depth - 1)
            if (depth === 0) operands.push({ ...tok, kind: 'other' })
            continue
        }
        if (depth > 0) continue
        if (tok.kind !== 'op') {
            if (tok.kind === 'other' && tok.text === '<inline image>') {
                operands = []
                operandStart = -1
                continue
            }
            if (operandStart < 0) operandStart = tok.start
            operands.push(tok)
            continue
        }
        switch (tok.text) {
            case 'q':
                stack.push(ctm)
                break
            case 'Q':
                if (stack.length) ctm = stack.pop()!
                break
            case 'cm': {
                const v = nums(6)
                if (v) ctm = mul(v as Mat, ctm)
                break
            }
            case 'BT':
                inText = true
                tm = IDENTITY
                tlm = IDENTITY
                advanced = false
                break
            case 'ET':
                inText = false
                break
            case 'Tf': {
                const v = nums(1)
                if (v) fontSize = v[0]
                break
            }
            case 'Tz': {
                const v = nums(1)
                if (v) th = v[0] / 100
                break
            }
            case 'TL': {
                const v = nums(1)
                if (v) leading = v[0]
                break
            }
            case 'Ts': {
                const v = nums(1)
                if (v) rise = v[0]
                break
            }
            case 'Td': {
                const v = nums(2)
                if (v) moveLine(v[0], v[1])
                break
            }
            case 'TD': {
                const v = nums(2)
                if (v) {
                    leading = -v[1]
                    moveLine(v[0], v[1])
                }
                break
            }
            case 'Tm': {
                const v = nums(6)
                if (v) {
                    tlm = v as Mat
                    tm = tlm
                    advanced = false
                }
                break
            }
            case 'T*':
                moveLine(0, -leading)
                break
            case 'Tj':
            case 'TJ':
                show(tok, tok.text, ' ')
                break
            case "'":
                moveLine(0, -leading)
                show(tok, "'", ' T* ')
                break
            case '"': {
                const v = operands.length >= 3 ? operands.slice(operands.length - 3, operands.length - 1) : []
                moveLine(0, -leading)
                const keep = v.length === 2 && v.every((t) => t.kind === 'num') ? ` ${v[0].text} Tw ${v[1].text} Tc T* ` : ' T* '
                show(tok, '"', keep)
                break
            }
        }
        operands = []
        operandStart = -1
    }
    return { shows, unbalancedQ: stack.length }
}

/** A pdf.js text item placed on the page, tagged with the label (run) it belongs to. */
export type PlacedItem = { pos: Pt; angle: number; size: number; width: number; runKey: string }

export type RemovalPlan = {
    /** Byte ranges to replace, with their replacements, sorted by start. */
    edits: Array<{ start: number; end: number; text: string }>
    /** Labels whose every item is produced by a removed chain. */
    removedRuns: Set<string>
}

/**
 * Decide which show operators to remove for the edited labels `editedRuns`.
 * `items` are ALL pdf.js text items on the page (edited or not).
 */
export function planTextRemoval(shows: ShowOp[], items: PlacedItem[], editedRuns: Set<string>): RemovalPlan {
    const lineCoords = (p: Pt, angle: number) => {
        const r = (angle * Math.PI) / 180
        return { along: p.x * Math.cos(r) + p.y * Math.sin(r), across: -p.x * Math.sin(r) + p.y * Math.cos(r) }
    }
    const heads = shows.map((s, i) => ({ s, i })).filter((h) => h.s.known)
    const edited = items.filter((it) => editedRuns.has(it.runKey))
    const sameLine = (a: { pos: Pt; angle: number; size: number }, b: { pos: Pt; angle: number }) => {
        if (angleDiff(a.angle, b.angle) > 2) return null
        const ac = lineCoords(a.pos, a.angle)
        const bc = lineCoords(b.pos, a.angle)
        return Math.abs(ac.across - bc.across) <= Math.max(0.5, 0.3 * a.size) ? { a: ac.along, b: bc.along } : null
    }
    // Only chains that start on, or inside, an edited item can be removed.
    const candidates = heads.filter(({ s }) =>
        edited.some((it) => {
            const l = sameLine(it, s)
            return !!l && l.b >= l.a - 0.3 * it.size && l.b <= l.a + it.width + 0.1 * it.size
        }),
    )

    const removedItems = new Set<number>()
    const removeChains = new Set<number>()
    for (const { s: head, i: idx } of candidates) {
        const eps = 0.05 * head.size
        const hAlong = lineCoords(head.pos, head.angle).along
        // The chain can't extend past the next chain head on the same line.
        let end = Infinity
        for (const { s: other } of heads) {
            if (other === head) continue
            const l = sameLine(head, other)
            if (l && l.b > hAlong + eps && l.b < end) end = l.b
        }
        const mine: number[] = []
        items.forEach((it, k) => {
            const l = sameLine(head, it)
            if (!l) return
            const s = l.b
            const e = l.b + it.width
            if ((e > hAlong + eps && s < end - eps) || Math.abs(s - hAlong) <= eps + 0.01) mine.push(k)
        })
        if (!mine.length || !mine.every((k) => editedRuns.has(items[k].runKey))) continue
        removeChains.add(idx)
        for (const k of mine) removedItems.add(k)
    }

    const edits = shows
        .filter((s) => removeChains.has(s.chain))
        .map((s) => ({ start: s.start, end: s.end, text: s.replacement }))
        .sort((a, b) => a.start - b.start)

    const removedRuns = new Set<string>()
    for (const key of editedRuns) {
        const ks = items.map((it, k) => (it.runKey === key ? k : -1)).filter((k) => k >= 0)
        if (ks.length && ks.every((k) => removedItems.has(k))) removedRuns.add(key)
    }
    return { edits, removedRuns }
}

/** Apply byte-range edits to the stream text. */
export function applyEdits(src: string, edits: Array<{ start: number; end: number; text: string }>): string {
    let out = ''
    let at = 0
    for (const e of edits) {
        if (e.start < at) continue
        out += src.slice(at, e.start) + e.text
        at = e.end
    }
    return out + src.slice(at)
}
