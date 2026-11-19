import assert from 'node:assert/strict'
import { sizeNote, cropNote, missedBandNote } from './result-notes.ts'

assert.equal(sizeNote(400 * 1024, 100 * 1024, false), '400 KB → 100 KB · 75% smaller')
assert.equal(sizeNote(400 * 1024, 100 * 1024, true), '400 KB → 100 KB · 75% smaller · resolution lowered to fit')
assert.equal(sizeNote(3 * 1024 * 1024, 512 * 1024, false), '3.0 MB → 512 KB · 83% smaller')
// Already under the target: no fake "0% smaller".
assert.equal(sizeNote(40 * 1024, 40 * 1024, false), 'Already the right size · 40 KB')
assert.equal(sizeNote(100 * 1024, 101 * 1024, false), 'Already the right size · 101 KB')
// Fit-to-size grew a tiny file up to a form minimum.
assert.equal(sizeNote(8 * 1024, 20 * 1024, false), '8 KB → 20 KB')
assert.match(sizeNote(300, 200, false), /1 KB → 1 KB/)
assert.match(cropNote(false), /Cropped/)
assert.match(cropNote(true), /Cropped/)
assert.match(missedBandNote('70.2 KB', 20, 50, true), /Could not hit 20–50 KB/)
assert.match(missedBandNote('70.2 KB', 20, 50, true), /Smallest we got is 70.2 KB/)
assert.match(missedBandNote('8.1 KB', 20, 50, false), /Largest we got is 8.1 KB/)

console.log('session note tests passed')
