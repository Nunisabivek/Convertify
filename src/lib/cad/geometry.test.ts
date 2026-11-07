import assert from 'node:assert/strict'
import { angleDiff, apply, boundsOf, invert, mul, normDeg, orientedCorners, overlapArea, type Mat } from './geometry.ts'

const near = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} != ${b}`)

// mul(m1, m2) applies m1 first: scale 2 then translate (10, 0).
const m = mul([2, 0, 0, 2, 0, 0], [1, 0, 0, 1, 10, 0])
const p = apply(m, 3, 4)
near(p.x, 16)
near(p.y, 8)

// invert round-trips, including rotation and translation.
const r: Mat = [0, 1, -1, 0, 50, -20]
const q = apply(invert(r), ...(Object.values(apply(r, 7, -3)) as [number, number]))
near(q.x, 7)
near(q.y, -3)
assert.throws(() => invert([0, 0, 0, 0, 1, 1]))

near(normDeg(270), -90)
near(normDeg(-180), 180)
near(angleDiff(359, 1), 2)
near(angleDiff(90, 270), 180)

// A 30° box: corners start-bottom, end-bottom, end-top, start-top.
const c = orientedCorners({ x: 0, y: 0 }, 30, 10, 1, 2)
near(c[1].x, 10 * Math.cos(Math.PI / 6) + Math.sin(Math.PI / 6))
near(c[3].y, 2 * Math.cos(Math.PI / 6))
const b = boundsOf(c)
assert.ok(b.w > 0 && b.h > 0)

assert.equal(overlapArea({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }), 25)
assert.equal(overlapArea({ x: 0, y: 0, w: 1, h: 1 }, { x: 2, y: 2, w: 1, h: 1 }), 0)

console.log('cad geometry tests passed')
