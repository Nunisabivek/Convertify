import assert from 'node:assert/strict'
import { iterateTiffPages } from './tiff-pages.ts'

// Minimal uncompressed RGB TIFF writer: `pages` pages of W x H pixels, with
// optional resolution tags (XResolution/YResolution in dots per inch).
function makeTiff(pages: number, W: number, H: number, dpi?: number): ArrayBuffer {
    const entries = dpi ? 13 : 10
    const ifdSize = 2 + entries * 12 + 4
    const extra = 6 + 16
    const dataSize = W * H * 3
    const per = ifdSize + extra + dataSize
    const buf = Buffer.alloc(8 + per * pages)
    buf.write('II', 0)
    buf.writeUInt16LE(42, 2)
    buf.writeUInt32LE(8, 4)
    for (let p = 0; p < pages; p++) {
        const base = 8 + p * per
        let o = base
        buf.writeUInt16LE(entries, o)
        o += 2
        const bps = base + ifdSize
        const res = bps + 6
        const data = bps + extra
        const ent = (tag: number, type: number, count: number, val: number) => {
            buf.writeUInt16LE(tag, o)
            buf.writeUInt16LE(type, o + 2)
            buf.writeUInt32LE(count, o + 4)
            if (type === 3 && count === 1) buf.writeUInt16LE(val, o + 8)
            else buf.writeUInt32LE(val, o + 8)
            o += 12
        }
        ent(256, 3, 1, W); ent(257, 3, 1, H); ent(258, 3, 3, bps); ent(259, 3, 1, 1); ent(262, 3, 1, 2)
        ent(273, 4, 1, data); ent(277, 3, 1, 3); ent(278, 3, 1, H); ent(279, 4, 1, dataSize)
        if (dpi) { ent(282, 5, 1, res); ent(283, 5, 1, res + 8) }
        ent(284, 3, 1, 1)
        if (dpi) ent(296, 3, 1, 2)
        buf.writeUInt32LE(p < pages - 1 ? base + per : 0, o)
        buf.writeUInt16LE(8, bps); buf.writeUInt16LE(8, bps + 2); buf.writeUInt16LE(8, bps + 4)
        if (dpi) { buf.writeUInt32LE(dpi, res); buf.writeUInt32LE(1, res + 4); buf.writeUInt32LE(dpi, res + 8); buf.writeUInt32LE(1, res + 12) }
        for (let i = 0; i < W * H; i++) {
            buf[data + i * 3] = 200 + p * 20
            buf[data + i * 3 + 1] = 50
            buf[data + i * 3 + 2] = 10
        }
    }
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
}

// Three pages, no resolution tags: page size falls back to pixels.
const plain = [...iterateTiffPages(makeTiff(3, 32, 24))]
assert.equal(plain.length, 3)
assert.deepEqual([plain[0].width, plain[0].height], [32, 24])
assert.deepEqual([plain[0].pageWidthPt, plain[0].pageHeightPt], [32, 24])
assert.equal(plain[0].rgba.length, 32 * 24 * 4)
// Pixels are decoded, not blank, and differ per page.
assert.deepEqual([...plain[0].rgba.subarray(0, 3)], [200, 50, 10])
assert.deepEqual([...plain[2].rgba.subarray(0, 3)], [240, 50, 10])

// 300 dpi: 2480 x 3508 px is A4, so the PDF page should be about 595 x 842 pt.
const [a4] = iterateTiffPages(makeTiff(1, 248, 351, 30))
assert.ok(Math.abs(a4.pageWidthPt - 595.2) < 1 && Math.abs(a4.pageHeightPt - 842.4) < 1, `got ${a4.pageWidthPt} x ${a4.pageHeightPt}`)

// Garbage is reported, not silently turned into an empty PDF.
assert.throws(() => [...iterateTiffPages(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]).buffer)])

console.log('tiff-pages tests passed')
