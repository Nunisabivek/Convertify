import assert from 'node:assert/strict'
import { RENDER_QUALITIES, renderScale } from './render-quality.ts'

// A4 is 595x842 pt: 300 DPI gives the usual 2480x3508 px print size.
const a4 = renderScale(300, 595, 842)
assert.equal(Math.round(595 * a4), 2479)
assert.equal(Math.round(842 * a4), 3508)

// An A0 poster (2384x3370 pt) at 300 DPI would be ~14000 px tall; it is capped at 8000.
const a0 = renderScale(300, 2384, 3370)
assert.equal(Math.round(3370 * a0), 8000)

// Higher settings never produce smaller images.
const dpis = RENDER_QUALITIES.map((q) => q.dpi)
assert.deepEqual([...dpis].sort((a, b) => a - b), dpis)

console.log('render-quality tests passed')
