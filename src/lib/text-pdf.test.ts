import assert from 'node:assert/strict'
import { PDFDocument } from 'pdf-lib'
import { htmlToText, textToPdf } from './text-pdf.ts'

// A 500-char line, non-Latin text and 200 lines: no truncation crash, wraps and paginates.
const text = ['x'.repeat(500), 'Привет 你好 café — “quotes”', ...Array.from({ length: 200 }, (_, i) => `Line ${i}`)].join('\n')
const doc = await PDFDocument.load(await textToPdf(text))
assert.ok(doc.getPageCount() >= 4, `expected several pages, got ${doc.getPageCount()}`)

// Entities decoded, <style>/<script> dropped, block elements become line breaks.
// The parse step is the browser's DOMParser in the app; a tiny stand-in here.
const parse = (h: string) => h.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
const html = '<style>p{color:red}</style><h1>Title</h1><p>Fish &amp; chips</p><script>var x=1</script><p>a<br>b</p>'
assert.equal(htmlToText(html, parse), 'Title\nFish & chips\na\nb')

console.log('text-pdf tests passed')
