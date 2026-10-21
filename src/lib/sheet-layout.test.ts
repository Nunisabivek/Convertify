import assert from 'node:assert/strict'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { CELL_PADDING, layoutSheet, toWinAnsi } from './sheet-layout.ts'

const doc = await PDFDocument.create()
const font = await doc.embedFont(StandardFonts.Helvetica)
const bold = await doc.embedFont(StandardFonts.HelveticaBold)
const measure = (t: string, b: boolean) => (b ? bold : font).widthOfTextAtSize(t, 1)
const USABLE = 720
const strip = (s: string) => s.replace(/\s/g, '')

// Every cell's text must survive wrapping, and no line may overflow its column.
function checkAllPresent(rows: string[][], layout: ReturnType<typeof layoutSheet>) {
    const nCols = Math.max(...rows.map((r) => r.length))
    assert.deepEqual(layout.chunks.flat(), [...Array(nCols).keys()])
    for (const cols of layout.chunks) assert.ok(cols.reduce((s, c) => s + layout.colWidths[c], 0) <= USABLE)
    rows.forEach((row, r) => row.forEach((cell, c) => {
        const cellLines = layout.lines[r][c]
        assert.equal(strip(cellLines.join('')), strip(cell), `row ${r} col ${c}`)
        for (const l of cellLines) assert.ok(measure(l, r === 0) * layout.fontSize <= layout.colWidths[c] - 2 * CELL_PADDING + 1e-9)
    }))
}

// 15 columns with a 200-char cell: nothing dropped, the long cell wraps.
const long = 'Quarterly revenue notes: the Lisbon office booked two invoices twice. '.repeat(3).slice(0, 200)
assert.equal(long.length, 200)
const wide = [
    Array.from({ length: 15 }, (_, c) => `Header ${c + 1}`),
    Array.from({ length: 15 }, (_, c) => (c === 7 ? long : `value ${c}`)),
    Array.from({ length: 15 }, (_, c) => (c === 3 ? 'x'.repeat(200) : String(c * 1000))),
]
const a = layoutSheet(wide, USABLE, measure)
checkAllPresent(wide, a)
assert.ok(a.lines[1][7].length > 1 && a.lines[2][3].length > 1, 'long cells wrap onto several lines')

// 40 columns of long text can't fit even at the minimum size: split into chunks, not dropped.
const huge = [0, 1, 2].map((r) => Array.from({ length: 40 }, (_, c) => `row ${r} column ${c} with fairly long text`))
const b = layoutSheet(huge, USABLE, measure)
checkAllPresent(huge, b)
assert.ok(b.chunks.length > 1)

// Non-Latin text becomes something Helvetica can encode instead of throwing.
assert.equal(toWinAnsi('Zoë café €5 – “ok”'), 'Zoë café €5 – “ok”')
assert.equal(toWinAnsi('Łódź ő\tx'), '?ódz o x')
assert.doesNotThrow(() => font.encodeText(toWinAnsi('東京 Ωmega 😀 Привет\u0007')))

console.log('sheet-layout tests passed')
