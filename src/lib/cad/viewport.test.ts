import assert from 'node:assert/strict'
import { PDFDocument, degrees } from 'pdf-lib'
import { budgetScale, frameMapper, pixelBudget, viewportTransform } from './viewport.ts'
import { apply, invert, mul, normDeg, orientedCorners, type Mat } from './geometry.ts'

const close = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) <= eps

// Matrix basics.
const m: Mat = [2, 0.5, -0.3, 1.5, 10, -4]
const id = mul(m, invert(m))
for (const [k, v] of [1, 0, 0, 1, 0, 0].entries()) assert.ok(close(id[k], v), `m × m⁻¹ = I at ${k}`)
assert.equal(normDeg(270), -90)
assert.equal(normDeg(-180), 180)
const oc = orientedCorners({ x: 0, y: 0 }, 90, 10, 1, 2)
assert.ok(close(oc[1].x, 1) && close(oc[1].y, 10) && close(oc[2].x, -2) && close(oc[2].y, 10) && close(oc[3].x, -2) && close(oc[3].y, 0))

// Same transform as pdf.js's PageViewport, for every /Rotate and an offset view box.
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
for (const rot of [0, 90, 180, 270]) {
    const doc = await PDFDocument.create()
    const p = doc.addPage([600, 800])
    p.setMediaBox(-50, 20, 700, 800)
    p.setCropBox(30, 40, 500, 700)
    p.setRotation(degrees(rot))
    const pdf = await pdfjs.getDocument({ data: await doc.save(), verbosity: 0 }).promise
    const page = await pdf.getPage(1)
    for (const scale of [1, 1.37]) {
        const vp = page.getViewport({ scale })
        const mine = viewportTransform({ view: page.view as [number, number, number, number], rotate: page.rotate }, scale)
        mine.m.forEach((v, k) => assert.ok(close(v, vp.transform[k]), `rot ${rot} scale ${scale} m[${k}] ${v} vs ${vp.transform[k]}`))
        assert.ok(close(mine.width, vp.width) && close(mine.height, vp.height), `size at rot ${rot}`)
    }
    const f = frameMapper({ view: page.view as [number, number, number, number], rotate: page.rotate })
    // Round trip display → user → display.
    const u = f.toUser(123, 45)
    const d = f.toDisplay(u.x, u.y)
    assert.ok(close(d.x, 123) && close(d.y, 45))
    // Reading left-to-right on screen is user-space angle +rot (a page shown turned
    // 90° clockwise shows user +y pointing right).
    const ang = f.userAngleOf(1, 0)
    assert.ok(close(normDeg(ang - rot), 0, 1e-9), `screen +x is user angle ${rot} at /Rotate ${rot}, got ${ang}`)
    // And back.
    assert.ok(close(f.displayAngleOf(ang), 0, 1e-9))
    // The view box's visible top-left corner is display (0, 0).
    const corner = f.toUser(0, 0)
    const vb = page.view
    const corners = [[vb[0], vb[3]], [vb[2], vb[3]], [vb[2], vb[1]], [vb[0], vb[1]]]
    assert.ok(corners.some(([x, y]) => close(x, corner.x) && close(y, corner.y)), `display origin is a crop corner at rot ${rot}`)
    await pdf.destroy()
}

// The identity frame flips y.
const flat = viewportTransform({ view: [0, 0, 100, 200], rotate: 0 }, 2)
const p = apply(flat.m, 10, 20)
assert.deepEqual([p.x, p.y], [20, 360])

// Pixel budget: A0 at 16 MP drops below scale 2 and fits; small pages keep scale 2.
const a0 = [2384, 3370]
const s16 = budgetScale(a0[0], a0[1], pixelBudget(false))
assert.ok(s16 < 2 && a0[0] * a0[1] * s16 * s16 <= 16_000_001)
const s8 = budgetScale(a0[0], a0[1], pixelBudget(true))
assert.ok(a0[0] * a0[1] * s8 * s8 <= 8_000_001 && s8 < s16)
assert.equal(budgetScale(595, 842, pixelBudget(false)), 2)

console.log('cad viewport tests passed')
