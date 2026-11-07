import assert from 'node:assert/strict'
import { fromHex, sampleColors, sampleInkColor, snapColor, toHex, unit } from './color.ts'

const W = 60
const H = 30
const page = () => new Uint8ClampedArray(W * H * 4).fill(255)
const put = (img: Uint8ClampedArray, x: number, y: number, c: number[], a = 1) => {
    const p = (y * W + x) * 4
    for (let k = 0; k < 3; k++) img[p + k] = Math.round(c[k] * a + 255 * (1 - a))
}
const box = { x: 0, y: 0, w: W, h: H }

// Red text, anti-aliased: the solid pixels decide, not the pink fringe.
{
    const img = page()
    for (let x = 5; x < 50; x += 3) {
        for (let y = 8; y < 22; y++) put(img, x, y, [220, 20, 30])
        for (let y = 8; y < 22; y++) put(img, x + 1, y, [220, 20, 30], 0.4)
    }
    const c = sampleInkColor(img, W, H, box)!
    assert.ok(Math.abs(c.r - 220) < 12 && c.g < 40 && c.b < 45, JSON.stringify(c))
}

// Black text with grey anti-aliasing snaps to pure black.
{
    const img = page()
    for (let x = 5; x < 50; x += 4) for (let y = 8; y < 22; y++) put(img, x, y, [0, 0, 0], 0.75)
    assert.deepEqual(sampleInkColor(img, W, H, box), { r: 0, g: 0, b: 0 })
}

// A thin red line crossing black text: the text's colour wins.
{
    const img = page()
    for (let x = 5; x < 50; x += 2) for (let y = 8; y < 22; y++) put(img, x, y, [10, 10, 10])
    for (let x = 0; x < W; x++) put(img, x, 15, [255, 0, 0])
    assert.deepEqual(sampleInkColor(img, W, H, box), { r: 0, g: 0, b: 0 })
}

// Blue text on a grey background (a filled title-block cell).
{
    const img = page()
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) put(img, x, y, [220, 220, 220])
    for (let x = 5; x < 50; x += 3) for (let y = 8; y < 22; y++) put(img, x, y, [0, 60, 200])
    const c = sampleInkColor(img, W, H, box)!
    assert.ok(c.b > 180 && c.r < 20, JSON.stringify(c))
    const bg = sampleColors(img, W, H, box).bg
    assert.ok(Math.abs(bg.r - 220) <= 4, 'grey paper is the cover colour')
}
assert.deepEqual(sampleColors(page(), W, H, box).bg, { r: 255, g: 255, b: 255 })

// No ink → null; outside the image → null.
assert.equal(sampleInkColor(page(), W, H, box), null)
assert.equal(sampleInkColor(page(), W, H, { x: 100, y: 100, w: 5, h: 5 }), null)

assert.deepEqual(snapColor({ r: 60, g: 60, b: 70 }), { r: 0, g: 0, b: 0 })
assert.deepEqual(snapColor({ r: 128, g: 128, b: 128 }), { r: 128, g: 128, b: 128 })
assert.equal(toHex({ r: 255, g: 0, b: 16 }), '#ff0010')
assert.deepEqual(fromHex('#FF0010'), { r: 255, g: 0, b: 16 })
assert.deepEqual(unit({ r: 255, g: 0, b: 51 }), [1, 0, 0.2])

console.log('cad color tests passed')
