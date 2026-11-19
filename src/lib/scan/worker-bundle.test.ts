import assert from 'node:assert/strict'
import vm from 'node:vm'
import { bundleScanWorker } from '../../../scripts/build-cad-worker.mjs'
import { enhance } from './enhance.ts'

// The classic worker (public/scan-worker.js) must enhance exactly like the TS module.
const src: string = bundleScanWorker()
assert.ok(!/^\s*(import|export)\b/m.test(src), 'no module syntax left in the classic worker')
const sandbox: { self: Record<string, any> } = { self: {} }
vm.runInNewContext(src, sandbox)
const mods = sandbox.self.__scan
assert.equal(typeof sandbox.self.onmessage, 'function', 'worker installs onmessage')
const bundled = mods.enhance.enhance as typeof enhance

const w = 64
const h = 48
const make = () => {
    const px = new Uint8ClampedArray(w * h * 4)
    for (let i = 0; i < px.length; i += 4) {
        const x = (i / 4) % w
        px[i] = 120 + x
        px[i + 1] = 110 + x
        px[i + 2] = 90 + x
        px[i + 3] = 255
    }
    return px
}
for (const mode of ['auto', 'gray', 'bw'] as const) {
    const a = make()
    const b = make()
    enhance(a, w, h, mode)
    bundled(b, w, h, mode)
    assert.deepEqual(Array.from(b), Array.from(a), `bundled ${mode} differs`)
}
console.log('scan worker bundle test passed')
