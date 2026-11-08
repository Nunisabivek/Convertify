import assert from 'node:assert/strict'
import vm from 'node:vm'
import { bundleCadWorker } from '../../../scripts/build-cad-worker.mjs'
import { detectPixels } from './detect.ts'

// The generated worker (public/cad-detect-worker.js) must find exactly what the
// TypeScript modules find: load the bundle in a VM and compare on a synthetic sheet.
const src: string = bundleCadWorker()
assert.ok(!/^\s*(import|export)\b/m.test(src), 'no module syntax left in the classic worker')
const sandbox: { self: { __cad?: Record<string, Record<string, unknown>> } } = { self: {} }
vm.runInNewContext(src, sandbox)
const bundled = sandbox.self.__cad!.detect.detectPixels as typeof detectPixels
assert.equal(typeof bundled, 'function')

// Stroke "letters" in rows, some red, a long line, a hatch and a box; seeded so runs repeat.
let seed = 7
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const W = 1200
const H = 800
const rgba = new Uint8ClampedArray(W * H * 4).fill(255)
const dot = (x: number, y: number, c: number[]) => {
    const p = (Math.round(y) * W + Math.round(x)) * 4
    if (x < 0 || y < 0 || x >= W || y >= H) return
    rgba[p] = c[0]
    rgba[p + 1] = c[1]
    rgba[p + 2] = c[2]
}
const line = (x0: number, y0: number, x1: number, y1: number, c = [0, 0, 0]) => {
    const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2) + 1
    for (let i = 0; i <= n; i++) dot(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c)
}
for (let row = 0; row < 8; row++) {
    const c = row % 3 === 0 ? [200, 0, 0] : [0, 0, 0]
    const h = 10 + (row % 3) * 4
    const y = 60 + row * 80
    for (let k = 0; k < 6 + row; k++) {
        const x = 80 + k * h * 0.9
        line(x, y, x + h * 0.6 * rnd(), y - h, c)
        line(x + h * 0.6, y, x + h * 0.6 * rnd(), y - h, c)
        line(x, y - h * rnd(), x + h * 0.6, y - h * rnd(), c)
    }
}
line(20, 760, 1180, 760)
for (let i = 0; i < 30; i++) line(700 + i * 5, 500, 720 + i * 5, 580)
line(900, 100, 960, 100)
line(960, 100, 960, 160)
line(960, 160, 900, 160)
line(900, 160, 900, 100)
const textBoxes = [{ x: 600, y: 40, w: 120, h: 30 }]

const plain = (v: unknown) => JSON.parse(JSON.stringify(v))
const ours = await detectPixels(rgba, W, H, { scale: 2, textBoxes })
const theirs = await bundled(rgba, W, H, { scale: 2, textBoxes })
assert.ok(ours.groups.length >= 5, `synthetic sheet has text lines (${ours.groups.length})`)
assert.deepEqual(plain(theirs), plain(ours))
console.log(`cad worker bundle matches (${ours.groups.length} SHX lines)`)
