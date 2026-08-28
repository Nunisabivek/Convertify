import assert from 'node:assert/strict'
import { nextHumanFilename, nameFromSources } from './human-filename.ts'

assert.equal(nextHumanFilename('passport-photo.jpg'), 'passport-photo.jpg')
assert.equal(nextHumanFilename('passport-photo.jpg', ['passport-photo.jpg']), 'passport-photo-2.jpg')
assert.equal(
    nextHumanFilename('passport-photo.jpg', ['passport-photo.jpg', 'passport-photo-2.jpg']),
    'passport-photo-3.jpg'
)
assert.equal(nextHumanFilename('passport-photo.jpg', ['PASSPORT-PHOTO.JPG']), 'passport-photo-2.jpg')
assert.equal(nextHumanFilename('bad/name.jpg'), 'bad-name.jpg')
assert.notEqual(nextHumanFilename('passport-photo.jpg'), `passport-${Date.now()}.jpg`)
assert.equal(nameFromSources([{ name: 'portrait-woman.jpg' }], 'pdf'), 'portrait-woman.pdf')
assert.equal(nameFromSources([{ name: 'a.jpg' }, { name: 'b.jpg' }], 'pdf'), 'a-and-1-more.pdf')
assert.equal(nameFromSources([{ name: 'report.pdf' }], 'pdf', 'merged'), 'report-merged.pdf')
assert.notEqual(nameFromSources([{ name: 'photos.jpg' }], 'pdf'), 'images-convertify.pdf')

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
