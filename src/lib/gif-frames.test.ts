import assert from 'node:assert/strict'
import { decodeGif } from './gif-frames.ts'

// Tiny GIF writer: 2x2 canvas, 4-colour palette (black, red, blue, white).
// LZW: a clear code before every 2nd pixel keeps every code 3 bits wide.
function lzw(indices: number[]): number[] {
    const CLEAR = 4, EOI = 5
    const codes: number[] = []
    for (let i = 0; i < indices.length; i += 2) {
        codes.push(CLEAR, indices[i])
        if (i + 1 < indices.length) codes.push(indices[i + 1])
    }
    codes.push(EOI)
    const bytes: number[] = []
    let acc = 0, bits = 0
    for (const c of codes) {
        acc |= c << bits
        bits += 3
        while (bits >= 8) { bytes.push(acc & 255); acc >>= 8; bits -= 8 }
    }
    if (bits > 0) bytes.push(acc & 255)
    return bytes
}
function frameBlock(left: number, top: number, w: number, h: number, pixels: number[], disposal: number, transparent = -1): number[] {
    const data = lzw(pixels)
    return [
        0x21, 0xf9, 0x04, (disposal << 2) | (transparent >= 0 ? 1 : 0), 10, 0, transparent >= 0 ? transparent : 0, 0,
        0x2c, left, 0, top, 0, w, 0, h, 0, 0,
        2, data.length, ...data, 0,
    ]
}
function makeGif(frames: number[][]): ArrayBuffer {
    const header = [...Buffer.from('GIF89a'), 2, 0, 2, 0, 0x81, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 255, 255, 255, 255]
    return new Uint8Array([...header, ...frames.flat(), 0x3b]).buffer
}
const px = (g: { frames: { rgba: Uint8ClampedArray }[] }, f: number, x: number, y: number) =>
    [...g.frames[f].rgba.subarray((y * 2 + x) * 4, (y * 2 + x) * 4 + 4)]
const RED = [255, 0, 0, 255], BLUE = [0, 0, 255, 255], CLEAR = [0, 0, 0, 0]

// Frame 1 fills the canvas red. Frame 2 is only a 1x1 patch at (1,1) in blue.
// Frame 2 must come out as red, red, red, blue: the patch composited on frame 1.
const kept = decodeGif(makeGif([
    frameBlock(0, 0, 2, 2, [1, 1, 1, 1], 1),
    frameBlock(1, 1, 1, 1, [2], 1),
]))
assert.equal(kept.frames.length, 2)
assert.deepEqual([kept.width, kept.height], [2, 2])
assert.deepEqual(px(kept, 0, 0, 0), RED)
assert.deepEqual(px(kept, 1, 0, 0), RED, 'earlier frame must show through a small patch')
assert.deepEqual(px(kept, 1, 1, 1), BLUE)

// Disposal 2 on frame 1 clears it before frame 2 draws, so frame 2 is mostly empty.
const cleared = decodeGif(makeGif([
    frameBlock(0, 0, 2, 2, [1, 1, 1, 1], 2),
    frameBlock(1, 1, 1, 1, [2], 1),
]))
assert.deepEqual(px(cleared, 0, 0, 0), RED)
assert.deepEqual(px(cleared, 1, 0, 0), CLEAR)
assert.deepEqual(px(cleared, 1, 1, 1), BLUE)

// A transparent pixel in frame 2 leaves frame 1's pixel in place.
const transparent = decodeGif(makeGif([
    frameBlock(0, 0, 2, 2, [1, 1, 1, 1], 1),
    frameBlock(0, 0, 2, 2, [0, 2, 2, 2], 1, 0),
]))
assert.deepEqual(px(transparent, 1, 0, 0), RED)
assert.deepEqual(px(transparent, 1, 1, 0), BLUE)

assert.throws(() => decodeGif(new Uint8Array([1, 2, 3]).buffer))
console.log('gif-frames tests passed')
