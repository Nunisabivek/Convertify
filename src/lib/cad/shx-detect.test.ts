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

console.log('cad shx-detect tests passed')
