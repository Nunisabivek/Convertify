import assert from 'node:assert/strict'
import { binarize, dropOverlapping, findComponents, groupGlyphs, maskBoxes } from './shx-detect.ts'

// A tiny stroke font on a 4×6 grid (y up), like AutoCAD's txt.shx.
const FONT: Record<string, number[][][]> = {
    '0': [[[0, 0], [4, 0], [4, 6], [0, 6], [0, 0]]],
    '1': [[[1, 5], [2, 6], [2, 0]], [[1, 0], [3, 0]]],
    '2': [[[0, 6], [4, 6], [4, 3], [0, 3], [0, 0], [4, 0]]],
    '4': [[[3, 0], [3, 6], [0, 2], [4, 2]]],
    A: [[[0, 0], [2, 6], [4, 0]], [[1, 3], [3, 3]]],
    E: [[[4, 6], [0, 6], [0, 0], [4, 0]], [[0, 3], [3, 3]]],
    N: [[[0, 0], [0, 6], [4, 0], [4, 6]]],
    T: [[[0, 6], [4, 6]], [[2, 6], [2, 0]]],
}

class Img {
    w: number
    h: number
    rgba: Uint8ClampedArray
    constructor(w: number, h: number) {
        this.w = w
        this.h = h
        this.rgba = new Uint8ClampedArray(w * h * 4).fill(255)
    }
    dot(x: number, y: number, c = [0, 0, 0]) {
        const xi = Math.round(x)
        const yi = Math.round(y)
        if (xi < 0 || yi < 0 || xi >= this.w || yi >= this.h) return
        const p = (yi * this.w + xi) * 4
        this.rgba[p] = c[0]
        this.rgba[p + 1] = c[1]
        this.rgba[p + 2] = c[2]
    }
    line(x0: number, y0: number, x1: number, y1: number, c?: number[]) {
        const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2) + 1
        for (let i = 0; i <= n; i++) this.dot(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c)
    }
    /** Stroke text; `x, y` is the baseline start in image pixels (y down), angle 0 or 90 (reads upwards). */
    text(s: string, x: number, y: number, height: number, vertical = false, c?: number[]) {
        const k = height / 6
        let pen = 0
        for (const ch of s) {
            for (const stroke of FONT[ch] || []) {
                for (let i = 1; i < stroke.length; i++) {
                    const map = ([gx, gy]: number[]) =>
                        vertical ? [x - gy * k, y - (pen + gx) * k] : [x + (pen + gx) * k, y - gy * k]
                    const [ax, ay] = map(stroke[i - 1])
                    const [bx, by] = map(stroke[i])
                    this.line(ax, ay, bx, by, c)
                }
            }
            pen += 6 // 4 wide + 2 spacing
        }
    }
}

const scale = 2 // canvas px per point
const img = new Img(900, 700)
img.text('2400', 100, 100, 7 * scale) // a dimension
img.text('NEAT', 100, 200, 7 * scale) // two stacked lines of a note
img.text('ANT', 100, 225, 7 * scale)
img.text('1200', 600, 400, 7 * scale, true) // vertical dimension, reads upwards
img.text('20', 300, 300, 7 * scale) // a two-letter label
img.line(50, 500, 850, 500) // a long wall line: never text
for (let i = 0; i < 40; i++) img.line(400 + i * 4, 560, 420 + i * 4, 640) // diagonal hatch
img.text('TEN', 700, 100, 7 * scale) // will be covered by real text

const bin = binarize(img.rgba, img.w, img.h)
maskBoxes(bin, img.w, img.h, [{ x: 690, y: 75, w: 60, h: 35 }]) // real-text box masks its pixels
const comps = await findComponents(bin, img.w, img.h, async () => {}, 200)
assert.ok(!comps.some((c) => c.maxX - c.minX > 200), 'wall line dropped by maxDim')
const groups = groupGlyphs(comps, { scale })

const hit = (x: number, y: number) => groups.filter((g) => x >= g.x && x <= g.x + g.w && y >= g.y && y <= g.y + g.h)
const dim = hit(110, 95)
assert.equal(dim.length, 1, 'horizontal dimension found')
assert.equal(dim[0].vertical, false)
assert.ok(dim[0].x <= 100 && dim[0].x + dim[0].w >= 100 + 22 * (7 * scale / 6) - 1, 'covers all four digits')
assert.equal(hit(110, 195).length, 1)
assert.equal(hit(110, 220).length, 1)
assert.notEqual(hit(110, 195)[0], hit(110, 220)[0], 'stacked lines stay separate')
const vert = hit(595, 380)
assert.equal(vert.length, 1, 'vertical dimension found')
assert.equal(vert[0].vertical, true)
assert.ok(vert[0].h > vert[0].w * 2)
assert.equal(hit(305, 295).length, 1, 'two-letter label found')
assert.equal(hit(450, 600).length, 0, 'hatch is not text')
assert.equal(hit(710, 95).length, 0, 'masked real text is not found again')
assert.equal(groups.length, 5, `exactly the five strings, got ${JSON.stringify(groups)}`)

// Groups overlapping real-text boxes are dropped.
const kept = dropOverlapping(groups, [{ x: dim[0].x, y: dim[0].y, w: dim[0].w, h: dim[0].h }])
assert.equal(kept.length, 4)

// pause() is awaited on big images so the page stays responsive.
let pauses = 0
await findComponents(new Uint8Array(2000 * 2000), 2000, 2000, async () => { pauses++ })
assert.ok(pauses >= 2)

// A bubble twice the letter height touching the line doesn't swallow it.
{
    const letters = [0, 1, 2, 3].map((k) => ({ minX: 100 + k * 14, minY: 100, maxX: 106 + k * 14 + (k % 2) * 3, maxY: 111, count: 24 + k * 5 }))
    const bubble = { minX: 158, minY: 92, maxX: 182, maxY: 116, count: 80 }
    const g = groupGlyphs([...letters, bubble], { scale: 2 })
    assert.ok(g.some((x) => x.count === 4 && x.h === 12), JSON.stringify(g))
    // ...even when a tiny fragment touches both and would chain them together.
    const bar = { minX: 151, minY: 104, maxX: 160, maxY: 105, count: 10 }
    const g2 = groupGlyphs([...letters, bar, bubble], { scale: 2 })
    assert.ok(g2.some((x) => x.count >= 4 && x.h === 12), JSON.stringify(g2))
}

// A row of small square outlines (chairs round a table) is not a word; a row of
// octagonal O's (corners cut, like SHX fonts draw them) still is.
{
    const W = 120
    const H = 30
    const draw = (shape: 'square' | 'octagon') => {
        const bin = new Uint8Array(W * H)
        for (let k = 0; k < 4; k++) {
            const x0 = 5 + k * 16
            for (let t = 0; t <= 10; t++) {
                const cut = shape === 'octagon' && (t < 3 || t > 7)
                if (!cut) {
                    bin[(8) * W + x0 + t] = 1
                    bin[(18) * W + x0 + t] = 1
                    bin[(8 + t) * W + x0] = 1
                    bin[(8 + t) * W + x0 + 10] = 1
                }
            }
            if (shape === 'octagon')
                for (let t = 0; t < 3; t++) {
                    bin[(8 + 2 - t) * W + x0 + t] = 1
                    bin[(8 + 2 - t) * W + x0 + 10 - t] = 1
                    bin[(16 + t) * W + x0 + t] = 1
                    bin[(16 + t) * W + x0 + 10 - t] = 1
                }
        }
        return bin
    }
    const squares = await findComponents(draw('square'), W, H)
    assert.ok(squares.length === 4 && squares.every((c) => c.box), JSON.stringify(squares))
    assert.equal(groupGlyphs(squares, { scale: 2 }).length, 0)
    const os = await findComponents(draw('octagon'), W, H)
    assert.ok(os.length === 4 && os.every((c) => !c.box), JSON.stringify(os))
}

console.log('cad shx-detect tests passed')

// detectPixels (worker and main-thread pipeline) matches the direct calls exactly,
// whatever the slice size, and reports progress in order.
{
    const { detectPixels } = await import('./detect.ts')
    const { sampleColors } = await import('./color.ts')
    const red = new Img(900, 700)
    red.text('2400', 100, 100, 7 * scale, false, [200, 0, 0])
    red.text('NEAT', 100, 200, 7 * scale)
    red.text('1200', 600, 400, 7 * scale, true)
    red.text('TEN', 700, 100, 7 * scale)
    const textBoxes = [{ x: 690, y: 75, w: 60, h: 35 }]
    const b = binarize(red.rgba, red.w, red.h)
    maskBoxes(b, red.w, red.h, textBoxes.map((t) => ({ x: t.x - 2, y: t.y - 2, w: t.w + 4, h: t.h + 4 })))
    const direct = dropOverlapping(groupGlyphs(await findComponents(b, red.w, red.h, undefined, 60 * scale * 1.4), { scale }), textBoxes, 0.3, 2 * scale)
    const expected = {
        textColors: textBoxes.map((t) => sampleColors(red.rgba, red.w, red.h, t)),
        groups: direct.map((g) => ({ ...g, ...sampleColors(red.rgba, red.w, red.h, g) })),
    }
    assert.equal(expected.groups.length, 3)
    assert.deepEqual(await detectPixels(red.rgba, red.w, red.h, { scale, textBoxes }), expected)
    const seen: number[] = []
    const sliced = await detectPixels(red.rgba, red.w, red.h, { scale, textBoxes, slice: 10_000, pause: (f) => { seen.push(f) } })
    assert.deepEqual(sliced, expected)
    assert.ok(seen.length > 50 && seen.every((f, i) => f >= 0 && f <= 1 && (i === 0 || f >= seen[i - 1])), 'progress rises from 0 to 1')
    assert.ok(expected.groups.some((g) => g.ink && g.ink.r > 150 && g.ink.g < 60), 'red SHX ink sampled')
    // A pause that throws cancels the work.
    await assert.rejects(detectPixels(red.rgba, red.w, red.h, { scale, textBoxes, slice: 10_000, pause: (f) => { if (f > 0.5) throw new Error('cancelled') } }), /cancelled/)
}
console.log('detectPixels matches the direct pipeline')
