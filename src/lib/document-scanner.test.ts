import assert from 'node:assert/strict'
import {
    detectDocumentQuad,
    lerpQuad,
    sampleBilinear,
    type Quad,
} from './document-scanner.ts'

// Test 1: LERP Quad
const q1: Quad = {
    tl: { x: 0, y: 0 },
    tr: { x: 100, y: 0 },
    br: { x: 100, y: 100 },
    bl: { x: 0, y: 100 },
}
const q2: Quad = {
    tl: { x: 10, y: 10 },
    tr: { x: 110, y: 10 },
    br: { x: 110, y: 110 },
    bl: { x: 10, y: 110 },
}

const smoothed = lerpQuad(q1, q2, 0.5)
assert.equal(smoothed.tl.x, 5)
assert.equal(smoothed.tl.y, 5)
assert.equal(smoothed.tr.x, 105)
assert.equal(smoothed.br.x, 105)

// Test 2: Bilinear sampling center
const center = sampleBilinear(q1, 0.5, 0.5)
assert.equal(center.x, 50)
assert.equal(center.y, 50)

// Test 3: Synthetic document edge detection
// Create 320x240 image with dark desk (lum 30) and bright white document in center (lum 240)
const W = 320
const H = 240
const data = new Uint8ClampedArray(W * H * 4)

// Fill background with dark desk
for (let i = 0; i < data.length; i += 4) {
    data[i] = 30
    data[i + 1] = 30
    data[i + 2] = 30
    data[i + 3] = 255
}

// Draw a white rectangle in the middle (x: 40 to 280, y: 30 to 210)
for (let y = 30; y < 210; y++) {
    for (let x = 40; x < 280; x++) {
        const idx = (y * W + x) * 4
        data[idx] = 240
        data[idx + 1] = 240
        data[idx + 2] = 240
        data[idx + 3] = 255
    }
}

const imgData = {
    data,
    width: W,
    height: H,
} as ImageData

const res = detectDocumentQuad(imgData, W, H)
assert.ok(res !== null, 'Should detect synthetic document quad')
assert.ok(res.quad.tl.x >= 35 && res.quad.tl.x <= 45, `TL X was ${res.quad.tl.x}`)
assert.ok(res.quad.tl.y >= 25 && res.quad.tl.y <= 35, `TL Y was ${res.quad.tl.y}`)
assert.ok(res.quad.tr.x >= 270 && res.quad.tr.x <= 285, `TR X was ${res.quad.tr.x}`)
assert.ok(res.quad.br.x >= 270 && res.quad.br.x <= 285, `BR X was ${res.quad.br.x}`)
assert.ok(res.quad.br.y >= 200 && res.quad.br.y <= 215, `BR Y was ${res.quad.br.y}`)
assert.ok(res.docType.length > 0)

// Test 4: Rotated printed page on a striped desk, light falling off across the
// frame and a shadow across the page. Desk stripes are stronger edges than the
// page's shaded side, which used to pull the outline onto the desk.
{
    const W2 = 256
    const H2 = 144
    const page = [
        { x: 92, y: 18 },
        { x: 178, y: 30 },
        { x: 164, y: 128 },
        { x: 78, y: 116 },
    ]
    const inside = (x: number, y: number) =>
        page.every((a, k) => {
            const b = page[(k + 1) % 4]
            return (b.x - a.x) * (y - a.y) - (b.y - a.y) * (x - a.x) >= 0
        })
    const px = new Uint8ClampedArray(W2 * H2 * 4)
    for (let y = 0; y < H2; y++) {
        for (let x = 0; x < W2; x++) {
            let l: number
            if (inside(x + 0.5, y + 0.5)) {
                l = 235 - (x - 78) * 0.6 // shadow toward the right edge
                if (y % 7 < 2 && x > 100 && x < 150) l = 50 // print
            } else {
                l = (110 + 30 * Math.sin(x * 0.7 + y * 0.2)) * (0.8 + (0.4 * x) / W2)
            }
            const i = (y * W2 + x) * 4
            px[i] = px[i + 1] = px[i + 2] = l
            px[i + 3] = 255
        }
    }
    const det = detectDocumentQuad({ data: px, width: W2, height: H2 } as ImageData, W2, H2)
    assert.ok(det, 'Should find the shaded page on a striped desk')
    const found = [det.quad.tl, det.quad.tr, det.quad.br, det.quad.bl]
    found.forEach((p, k) => {
        const err = Math.hypot(p.x - page[k].x, p.y - page[k].y)
        assert.ok(err < 3, `corner ${k} off by ${err.toFixed(1)}px`)
    })
}

console.log('Document scanner unit test passed! Detected:', res.docType, 'Ratio:', res.ratio)
