import assert from 'node:assert/strict'
import {
    getSwapInfo,
    listWorkingSwapPairs,
    parseConvertDirection,
    WORKING_CLIENT_IDS,
} from './tool-swap.ts'

const STUBS = [
    'edit-pdf',
    'sign-pdf',
    'ocr-pdf',
    'protect-pdf',
    'unlock-pdf',
    'redact-pdf',
    'compare-pdf',
    'crop-pdf',
    'delete-pdf-pages',
    'reorder-pdf',
    'repair-pdf',
    'pdf-to-excel',
    'pdf-to-pdfa',
    'pdf-to-powerpoint',
    'powerpoint-to-pdf',
]

assert.equal(parseConvertDirection('pdf-to-jpg')?.from, 'PDF')
assert.equal(parseConvertDirection('pdf-to-jpg')?.to, 'JPG')
assert.equal(parseConvertDirection('word-to-pdf')?.fromBadge, 'DOC')
assert.equal(parseConvertDirection('merge-pdf'), null)

const jpg = getSwapInfo('pdf-to-jpg')
assert.ok(jpg)
assert.equal(jpg.target, 'jpg-to-pdf')
assert.equal(jpg.targetDirection, 'JPG → PDF')
assert.equal(getSwapInfo('jpg-to-pdf')?.target, 'pdf-to-jpg')

assert.equal(getSwapInfo('pdf-to-png')?.target, 'png-to-pdf')
assert.equal(getSwapInfo('png-to-pdf')?.target, 'pdf-to-png')
assert.equal(getSwapInfo('pdf-to-word')?.target, 'word-to-pdf')
assert.equal(getSwapInfo('word-to-pdf')?.target, 'pdf-to-word')
assert.equal(getSwapInfo('pdf-to-text')?.target, 'text-to-pdf')
assert.equal(getSwapInfo('text-to-pdf')?.target, 'pdf-to-text')
assert.equal(getSwapInfo('jpg-to-png')?.target, 'png-to-jpg')
assert.equal(getSwapInfo('png-to-jpg')?.target, 'jpg-to-png')
assert.equal(getSwapInfo('csv-to-json')?.target, 'json-to-csv')
assert.equal(getSwapInfo('json-to-csv')?.target, 'csv-to-json')
assert.equal(getSwapInfo('merge-pdf')?.target, 'split-pdf')
assert.equal(getSwapInfo('split-pdf')?.target, 'merge-pdf')

// Excel: only Excel → PDF works. Never send people to the pdf-to-excel stub.
assert.equal(getSwapInfo('excel-to-pdf'), null)
assert.equal(getSwapInfo('pdf-to-excel')?.target, 'excel-to-pdf')
assert.ok(WORKING_CLIENT_IDS.has('excel-to-pdf'))
assert.equal(WORKING_CLIENT_IDS.has('pdf-to-excel'), false)

assert.equal(getSwapInfo('powerpoint-to-pdf'), null)
assert.equal(getSwapInfo('pdf-to-powerpoint'), null)
assert.equal(getSwapInfo('protect-pdf'), null)
assert.equal(getSwapInfo('unlock-pdf'), null)
assert.equal(getSwapInfo('heic-to-jpg'), null)
assert.equal(getSwapInfo('xml-to-json'), null)

for (const stub of STUBS) {
    const swap = getSwapInfo(stub)
    if (swap) {
        assert.equal(STUBS.includes(swap.target), false, `${stub} must not swap to stub ${swap.target}`)
        assert.ok(WORKING_CLIENT_IDS.has(swap.target))
    }
}

const pairs = listWorkingSwapPairs()
const ids = pairs.flatMap((p) => [p.a, p.b])
for (const id of ids) {
    assert.ok(WORKING_CLIENT_IDS.has(id), `${id} is not a working client`)
    assert.equal(STUBS.includes(id), false, `${id} is a stub`)
}

assert.deepEqual(
    pairs.map((p) => [p.a, p.b]),
    [
        ['csv-to-json', 'json-to-csv'],
        ['jpg-to-pdf', 'pdf-to-jpg'],
        ['jpg-to-png', 'png-to-jpg'],
        ['merge-pdf', 'split-pdf'],
        ['pdf-to-png', 'png-to-pdf'],
        ['pdf-to-text', 'text-to-pdf'],
        ['pdf-to-word', 'word-to-pdf'],
    ]
)

const androidV1 = new Set([
    'fit-to-size',
    'passport-photo',
    'remove-background',
    'merge-pdf',
    'split-pdf',
    'compress-pdf',
    'rotate-pdf',
    'jpg-to-pdf',
    'png-to-pdf',
    'pdf-to-jpg',
    'pdf-to-png',
    'word-to-pdf',
    'pdf-to-word',
    'excel-to-pdf',
    'image-compressor',
    'resize-image',
    'heic-to-jpg',
    'webp-converter',
    'watermark-pdf',
    'add-page-numbers',
    'qr-code-generator',
])
const androidPairs = pairs.filter((p) => androidV1.has(p.a) && androidV1.has(p.b))
assert.deepEqual(
    androidPairs.map((p) => [p.a, p.b]),
    [
        ['jpg-to-pdf', 'pdf-to-jpg'],
        ['merge-pdf', 'split-pdf'],
        ['pdf-to-png', 'png-to-pdf'],
        ['pdf-to-word', 'word-to-pdf'],
    ]
)

console.log('tool-swap tests passed')
