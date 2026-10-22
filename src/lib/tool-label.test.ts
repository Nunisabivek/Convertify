import assert from 'node:assert/strict'
import { toolLabel } from './tool-label.ts'

assert.equal(toolLabel('/png-to-pdf'), 'PNG to PDF')
assert.equal(toolLabel('heic-to-jpg'), 'HEIC to JPG')
assert.equal(toolLabel('/compress-pdf'), 'Compress PDF')
assert.equal(toolLabel('pdf-to-text'), 'PDF to Text')
assert.equal(toolLabel('/qr-code-generator'), 'QR Code Generator')

console.log('tool-label tests passed')
