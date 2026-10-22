import assert from 'node:assert/strict'
import { placeImage } from './image-page.ts'

const r = (n: number) => Math.round(n * 10) / 10

// Original: page is the image, no borders.
assert.deepEqual(placeImage(1920, 1080, 'original'), { page: [1920, 1080], x: 0, y: 0, width: 1920, height: 1080 })

// A wide screenshot on A4 turns the page landscape and fills the width.
const wide = placeImage(1920, 1080, 'a4')
assert.deepEqual(wide.page.map(r), [841.9, 595.3])
assert.equal(r(wide.width), 841.9)
assert.equal(r(wide.y * 2 + wide.height), 595.3) // centred vertically

// A tall phone screenshot on Letter stays portrait, fits the height, keeps its aspect ratio.
const tall = placeImage(1080, 2400, 'letter', 36)
assert.deepEqual(tall.page, [612, 792])
assert.equal(r(tall.height), 792 - 72)
assert.equal(r(tall.width / tall.height), r(1080 / 2400))
assert.ok(tall.x >= 36 && tall.y >= 36)

console.log('image-page tests passed')
