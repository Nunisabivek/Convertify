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

console.log('Document scanner unit test passed! Detected:', res.docType, 'Ratio:', res.ratio)
