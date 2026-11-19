import assert from 'node:assert/strict'
import { rectToQuad, applyH, warpPerspective, rotateRGBA } from './homography.ts'
import { enhance } from './enhance.ts'
import { pageSize, pdfPageSize, paperFor } from './paper.ts'

// --- Homography: page corners land exactly on the quad corners.
{
    const q = { tl: { x: 40, y: 30 }, tr: { x: 300, y: 50 }, br: { x: 320, y: 420 }, bl: { x: 20, y: 400 } }
    const H = rectToQuad(200, 280, q)
    const near = (a: { x: number; y: number }, b: { x: number; y: number }) =>
        assert.ok(Math.hypot(a.x - b.x, a.y - b.y) < 1e-6, `${JSON.stringify(a)} vs ${JSON.stringify(b)}`)
    near(applyH(H, 0, 0), q.tl)
    near(applyH(H, 200, 0), q.tr)
    near(applyH(H, 200, 280), q.br)
    near(applyH(H, 0, 280), q.bl)
}

// --- Warp keeps straight lines straight under strong perspective.
// Source: white page drawn as a trapezoid with horizontal black rules every 40 px
// of page height; after warping each rule must be one flat row.
{
    const SW = 400
    const SH = 400
    const src = new Uint8ClampedArray(SW * SH * 4)
    const q = { tl: { x: 120, y: 40 }, tr: { x: 280, y: 40 }, br: { x: 390, y: 380 }, bl: { x: 10, y: 380 } }
    const PW = 100
    const PH = 200
    const H = rectToQuad(PW, PH, q)
    // Render the page into the photo by forward-mapping a fine grid of page points.
    for (let i = 0; i < src.length; i += 4) {
        src[i] = src[i + 1] = src[i + 2] = 60
        src[i + 3] = 255
    }
    for (let v = 0; v < PH; v += 0.25) {
        for (let u = 0; u < PW; u += 0.25) {
            const p = applyH(H, u, v)
            const x = Math.floor(p.x)
            const y = Math.floor(p.y)
            const ink = Math.floor(v) % 40 === 20
            const j = (y * SW + x) * 4
            src[j] = src[j + 1] = src[j + 2] = ink ? 0 : 250
        }
    }
    const out = warpPerspective(src, SW, SH, q, PW, PH)
    for (const row of [20, 60, 100, 140, 180]) {
        let dark = 0
        for (let x = 5; x < PW - 5; x++) if (out[(row * PW + x) * 4] < 120) dark++
        assert.ok(dark >= PW - 12, `rule at row ${row} is broken (${dark} dark px)`)
        let above = 0
        for (let x = 5; x < PW - 5; x++) if (out[((row - 3) * PW + x) * 4] < 120) above++
        assert.ok(above <= 2, `rule at row ${row} bends into row ${row - 3} (${above} dark px)`)
    }
}

// --- Rotation
{
    const src = new Uint8ClampedArray([1, 0, 0, 255, 2, 0, 0, 255, 3, 0, 0, 255, 4, 0, 0, 255, 5, 0, 0, 255, 6, 0, 0, 255]) // 3x2
    const r90 = rotateRGBA(src, 3, 2, 90)
    assert.equal(r90.width, 2)
    assert.equal(r90.height, 3)
    assert.deepEqual([...r90.data].filter((_, i) => i % 4 === 0), [4, 1, 5, 2, 6, 3])
    const r180 = rotateRGBA(src, 3, 2, 180)
    assert.deepEqual([...r180.data].filter((_, i) => i % 4 === 0), [6, 5, 4, 3, 2, 1])
    assert.equal(rotateRGBA(src, 3, 2, 0).data, src)
}

// --- Enhance: a page half in shadow comes out evenly white, ink stays black.
function shadedPage(w: number, h: number, paper: [number, number, number]) {
    const px = new Uint8ClampedArray(w * h * 4)
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
            const light = 0.5 + 0.5 * Math.min(1, Math.max(0, (x - w * 0.3) / (w * 0.3))) // dark left third
            const ink = y % 24 < 4 && x > 30 && x < w - 30
            const i = (y * w + x) * 4
            px[i] = (ink ? 30 : paper[0]) * light
            px[i + 1] = (ink ? 30 : paper[1]) * light
            px[i + 2] = (ink ? 30 : paper[2]) * light
            px[i + 3] = 255
        }
    return px
}
const W = 600
const HH = 800
const paperAt = (px: Uint8ClampedArray, x: number, y: number) => px[(y * W + x) * 4]
for (const mode of ['bw', 'gray', 'auto'] as const) {
    const px = shadedPage(W, HH, [236, 232, 222])
    enhance(px, W, HH, mode)
    // paper rows (y % 24 >= 8) in the shadow (x = 60) and in the light (x = 500)
    for (const x of [60, 300, 500]) {
        const v = paperAt(px, x, 420)
        assert.ok(v >= 236, `${mode}: paper at x=${x} is ${v}, still shadowed`)
    }
    for (const x of [60, 500]) {
        const v = paperAt(px, x, 386) // ink row (386 % 24 = 2)
        assert.ok(v <= 70, `${mode}: ink at x=${x} is ${v}, washed out`)
    }
}
// Yellow paper turns white in auto mode, a blue stamp stays blue.
{
    const px = shadedPage(W, HH, [240, 226, 170])
    for (let y = 300; y < 340; y++)
        for (let x = 200; x < 260; x++) {
            const i = (y * W + x) * 4
            px[i] = 40
            px[i + 1] = 70
            px[i + 2] = 190
        }
    enhance(px, W, HH, 'auto')
    const i = (420 * W + 500) * 4
    assert.ok(px[i + 2] >= 230 && px[i] >= 230, `yellow cast left: ${px[i]},${px[i + 1]},${px[i + 2]}`)
    const s = (320 * W + 230) * 4
    assert.ok(px[s + 2] > px[s] + 60, `stamp lost its blue: ${px[s]},${px[s + 1]},${px[s + 2]}`)
}
// original is untouched
{
    const px = shadedPage(50, 50, [200, 200, 200])
    const copy = px.slice()
    enhance(px, 50, 50, 'original')
    assert.deepEqual(px, copy)
}

// --- Paper sizes
assert.equal(paperFor(1.414).kind, 'a4')
assert.equal(paperFor(1.29).kind, 'letter')
assert.equal(paperFor(1.585).kind, 'card')
assert.equal(paperFor(2.5).kind, 'other')
{
    const s = pageSize(2400, 3390, 3508) // close to A4: snapped
    assert.equal(s.kind, 'a4')
    assert.ok(Math.abs(s.height / s.width - 297 / 210) < 0.002)
    assert.equal(s.height, 3508)
    const small = pageSize(900, 1280, 3508) // 1080p frame: no 4x upscale
    assert.ok(small.height <= 1410, `upscaled to ${small.height}`)
    const land = pageSize(1600, 1000, 3508)
    assert.ok(land.width > land.height)
}
{
    const [w, h] = pdfPageSize(2480, 3508)
    assert.ok(Math.abs(w - 595.28) < 0.1 && Math.abs(h - 841.89) < 0.1, `${w}x${h}`)
    const [lw, lh] = pdfPageSize(3508, 2480)
    assert.ok(lw > lh)
    const [rw, rh] = pdfPageSize(600, 2400) // receipt: A4 width, tall
    assert.ok(Math.abs(rw - 595.28) < 0.1 && Math.abs(rh - 2381.1) < 1, `${rw}x${rh}`)
}

// --- Speed check on a full A4 page at 300 dpi (informational; the worker runs this).
{
    const w = 2480
    const h = 3508
    const px = shadedPage(w, h, [236, 232, 222])
    const t0 = performance.now()
    enhance(px, w, h, 'auto')
    const t1 = performance.now()
    const src = new Uint8ClampedArray(3000 * 4000 * 4)
    const t2 = performance.now()
    warpPerspective(src, 3000, 4000, { tl: { x: 200, y: 150 }, tr: { x: 2800, y: 200 }, br: { x: 2900, y: 3850 }, bl: { x: 100, y: 3800 } }, w, h)
    const t3 = performance.now()
    console.log(`A4@300dpi on this machine: enhance(auto) ${(t1 - t0).toFixed(0)} ms, warp ${(t3 - t2).toFixed(0)} ms`)
}

console.log('scan engine tests passed')
