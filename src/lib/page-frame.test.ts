import assert from 'node:assert/strict'
import { visualFrame, visualRectToPage } from './page-frame.ts'

const box = { x: 10, y: 20, width: 600, height: 800 } // offset box, portrait
const z = (n: number) => Math.round(n) || 0

for (const r of [0, 90, 180, 270, -90, 450]) {
    const f = visualFrame(r, box)
    const rr = ((r % 360) + 360) % 360
    assert.equal(f.rotate, rr)
    assert.deepEqual([f.width, f.height], rr % 180 ? [800, 600] : [600, 800])
    // The visible corners map onto the box's corners.
    const pts = [[0, 0], [f.width, 0], [0, f.height], [f.width, f.height]].map(([a, b]) => f.toPage(a, b))
    assert.deepEqual([Math.min(...pts.map((p) => p.x)), Math.min(...pts.map((p) => p.y)), Math.max(...pts.map((p) => p.x)), Math.max(...pts.map((p) => p.y))], [10, 20, 610, 820])
    // Reading direction: one step right on screen is one step along the text's rotated baseline.
    const o = f.toPage(0, 0), s = f.toPage(1, 0)
    const rad = (rr * Math.PI) / 180
    assert.deepEqual([z(s.x - o.x), z(s.y - o.y)], [z(Math.cos(rad)), z(Math.sin(rad))], `direction at ${r}`)
}

// A crop of 10% off the visible top on a page rotated 90: the visible top is the PDF's left edge.
const f = visualFrame(90, { x: 0, y: 0, width: 600, height: 800 })
assert.deepEqual(visualRectToPage(f, 0, 0, 800, 540), { x: 60, y: 0, width: 540, height: 800 })

console.log('page-frame tests passed')
