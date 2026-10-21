import assert from 'node:assert/strict'
import { jpegOrientation, uprightPlacement } from './jpeg-orientation.ts'

// Minimal JPEG: SOI, APP1 Exif with one IFD0 entry (0x0112 Orientation), EOI.
function exifJpeg(orientation: number, littleEndian: boolean): ArrayBuffer {
    const tiff = new DataView(new ArrayBuffer(26))
    tiff.setUint16(0, littleEndian ? 0x4949 : 0x4d4d)
    tiff.setUint16(2, 42, littleEndian)
    tiff.setUint32(4, 8, littleEndian) // IFD0 right after the header
    tiff.setUint16(8, 1, littleEndian) // one entry
    tiff.setUint16(10, 0x0112, littleEndian)
    tiff.setUint16(12, 3, littleEndian) // SHORT
    tiff.setUint32(14, 1, littleEndian)
    tiff.setUint16(18, orientation, littleEndian)
    const app1 = [0xff, 0xe1, 0, 2 + 6 + 26, ...[0x45, 0x78, 0x69, 0x66, 0, 0], ...new Uint8Array(tiff.buffer)]
    return new Uint8Array([0xff, 0xd8, ...app1, 0xff, 0xd9]).buffer
}

for (const le of [true, false]) {
    for (const o of [1, 3, 6, 8]) assert.equal(jpegOrientation(exifJpeg(o, le)), o)
}
assert.equal(jpegOrientation(new Uint8Array([0xff, 0xd8, 0xff, 0xd9]).buffer), 1) // no EXIF
assert.equal(jpegOrientation(new Uint8Array([0x89, 0x50]).buffer), 1) // not a JPEG

// Rotating the image's corners must land exactly on the page: a 400x300 photo stored sideways.
const corners = (o: number, w: number, h: number) => {
    const { page, x, y, rotate } = uprightPlacement(o, w, h)
    const r = (rotate * Math.PI) / 180
    const pts = [[0, 0], [w, 0], [0, h], [w, h]].map(([u, v]) => [x + u * Math.cos(r) - v * Math.sin(r), y + u * Math.sin(r) + v * Math.cos(r)])
    const xs = pts.map((p) => Math.round(p[0]) || 0), ys = pts.map((p) => Math.round(p[1]) || 0)
    return { page, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] }
}
for (const o of [1, 3, 6, 8]) {
    const { page, box } = corners(o, 400, 300)
    assert.deepEqual(box, [0, 0, page[0], page[1]], `orientation ${o}`)
}
assert.deepEqual(uprightPlacement(6, 400, 300).page, [300, 400])

// Direction: the stored top-left pixel (u=0, v=h in PDF space) must land where EXIF says.
// 6: row 0 is the visual right side -> top-right. 8: row 0 is the visual left -> bottom-left. 3: bottom-right.
const topLeft = (o: number, w: number, h: number) => {
    const { x, y, rotate } = uprightPlacement(o, w, h)
    const r = (rotate * Math.PI) / 180
    return [Math.round(x - h * Math.sin(r)) || 0, Math.round(y + h * Math.cos(r)) || 0]
}
assert.deepEqual(topLeft(6, 400, 300), [300, 400])
assert.deepEqual(topLeft(8, 400, 300), [0, 0])
assert.deepEqual(topLeft(3, 400, 300), [400, 0])

console.log('jpeg-orientation tests passed')
