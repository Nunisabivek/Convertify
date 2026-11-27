import assert from 'node:assert/strict'
import { PDFDocument } from 'pdf-lib'
import { inlineRuns, latinOnly, markdownToPdf, parseBlocks } from './markdown-pdf.ts'

// Inline styles become runs; links keep only their text; snake_case is not italic.
assert.deepEqual(inlineRuns('a **b** *c* `d` [e](https://x.y) snake_case_name'), [
    { text: 'a ', style: 'r' },
    { text: 'b', style: 'b' },
    { text: ' ', style: 'r' },
    { text: 'c', style: 'i' },
    { text: ' ', style: 'r' },
    { text: 'd', style: 'c' },
    { text: ' ', style: 'r' },
    { text: 'e', style: 'r' },
    { text: ' snake_case_name', style: 'r' },
])
assert.deepEqual(inlineRuns('**x**', 'i'), [{ text: 'x', style: 'bi' }])

// Blocks: heading, joined paragraph, nested and numbered lists, code kept verbatim, quote, rule.
const md = '# Title #\n\nline one\nline two\n\n- a\n  - b\n3. c\n\n```js\n  const x = 1 // **not bold**\n```\n> quoted\n\n---\n'
assert.deepEqual(parseBlocks(md), [
    { kind: 'h', level: 1, text: 'Title' },
    { kind: 'p', text: 'line one line two' },
    { kind: 'li', marker: '•', depth: 0, text: 'a' },
    { kind: 'li', marker: '•', depth: 1, text: 'b' },
    { kind: 'li', marker: '3.', depth: 0, text: 'c' },
    { kind: 'code', lines: ['  const x = 1 // **not bold**'] },
    { kind: 'quote', text: 'quoted' },
    { kind: 'hr' },
])

// Long input wraps and paginates; a 400-char word and non-Latin text don't crash it.
const long = ['# Report', 'x'.repeat(400), 'Привет café — “quotes”', ...Array.from({ length: 120 }, (_, i) => `- item **${i}** with *some* words to wrap across the line`)].join('\n')
const doc = await PDFDocument.load(await markdownToPdf(long))
assert.ok(doc.getPageCount() >= 3, `expected several pages, got ${doc.getPageCount()}`)
assert.deepEqual(doc.getPage(0).getSize(), { width: 595, height: 842 })

// GFM table: separator row dropped, cells trimmed.
assert.deepEqual(parseBlocks(['| a | b |', '|:--|--:|', '| 1 | **2** |', ''].join('\n')), [{ kind: 'table', rows: [['a', 'b'], ['1', '**2**']] }])

// Non-Latin scripts can't be drawn with the built-in fonts, so the client prints those instead.
assert.ok(latinOnly('Résumé — “café” • why? 50%'))
assert.ok(!latinOnly('नमस्ते दुनिया'))
assert.ok(!latinOnly('你好'))
// Emoji don't force the print fallback; they're dropped from the PDF, © stays.
assert.ok(latinOnly('Done ✅ 🚀 👍🏽 © 2026'))
await markdownToPdf('# Release ✅\n\n- shipped 🚀 © 2026')

console.log('markdown-pdf test passed')
