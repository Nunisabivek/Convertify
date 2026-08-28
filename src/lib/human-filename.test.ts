import assert from 'node:assert/strict'
import { nextHumanFilename } from './human-filename'

assert.equal(nextHumanFilename('passport-photo.jpg'), 'passport-photo.jpg')
assert.equal(nextHumanFilename('passport-photo.jpg', ['passport-photo.jpg']), 'passport-photo-2.jpg')
assert.equal(
    nextHumanFilename('passport-photo.jpg', ['passport-photo.jpg', 'passport-photo-2.jpg']),
    'passport-photo-3.jpg'
)
assert.equal(nextHumanFilename('passport-photo.jpg', ['PASSPORT-PHOTO.JPG']), 'passport-photo-2.jpg')
assert.equal(nextHumanFilename('bad/name.jpg'), 'bad-name.jpg')
assert.notEqual(nextHumanFilename('passport-photo.jpg'), `passport-${Date.now()}.jpg`)

console.log('human-filename tests passed')
