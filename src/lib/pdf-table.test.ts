import assert from 'node:assert/strict'
import { pageToRows, type PositionedText } from './pdf-table.ts'

// Width of a string at 10pt Helvetica, roughly 0.5em per character.
const t = (str: string, x: number, y: number): PositionedText => ({ str, x, y, width: str.length * 5, height: 10 })

const items: PositionedText[] = [
    // A title split into word fragments, the way many PDFs store text.
    t('Quarterly', 72, 760), t('sales', 120, 760), t('report', 148, 760),
    // A 3-column table with a slightly shifted cell and an empty cell.
    t('Name', 72, 720), t('Age', 200, 720), t('City', 320, 720),
    t('Asha', 72, 704), t('31', 203, 704), t('Pune', 320, 704),
    t('Ravi', 72, 688), t('Delhi', 321, 688),
]
// Shuffled input order must not matter.
const rows = pageToRows([...items].reverse())

assert.deepEqual(rows, [
    ['Quarterly sales report'],
    ['Name', 'Age', 'City'],
    ['Asha', '31', 'Pune'],
    ['Ravi', '', 'Delhi'],
])

assert.deepEqual(pageToRows([]), [])
console.log('pdf-table tests passed')
