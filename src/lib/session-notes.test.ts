import assert from 'node:assert/strict'
import { qualityNote, cropNote, missedBandNote } from './result-notes.ts'

assert.equal(qualityNote(false), 'Kept full size')
assert.equal(qualityNote(true), 'Had to shrink a little')
assert.notEqual(cropNote(false), 'Kept full size')
assert.match(cropNote(false), /Cropped/)
assert.match(cropNote(true), /Cropped/)
assert.match(missedBandNote('70.2 KB', 20, 50, true), /Could not hit 20–50 KB/)
assert.match(missedBandNote('70.2 KB', 20, 50, true), /Smallest we got is 70.2 KB/)
assert.match(missedBandNote('8.1 KB', 20, 50, false), /Largest we got is 8.1 KB/)

console.log('session note tests passed')
