export type PositionedText = { x: number; y: number; width: number; height: number; str: string }

/**
 * Turn one page's positioned text (pdf.js getTextContent items) into spreadsheet rows.
 * - Items on the same baseline form a row.
 * - Fragments closer than a word gap are joined into one cell, so a sentence stays one cell.
 * - Columns come from where cells start across the whole page, so a table's columns line up
 *   even when a row has empty cells.
 * ponytail: start-x clustering only; right-aligned number columns with very different widths
 * can land one column off. Upgrade path: cluster on cell centres or right edges per column.
 */
export function pageToRows(items: PositionedText[], colTol = 10): string[][] {
    const lines: PositionedText[][] = []
    const sorted = items.filter((i) => i.str.trim()).sort((a, b) => b.y - a.y || a.x - b.x)
    for (const it of sorted) {
        const line = lines.find((l) => Math.abs(l[0].y - it.y) <= Math.max(2, l[0].height * 0.4))
        if (line) line.push(it)
        else lines.push([it])
    }

    const cells = lines.map((line) => {
        line.sort((a, b) => a.x - b.x)
        const out: { x: number; text: string }[] = []
        let end = -Infinity
        for (const it of line) {
            const gap = it.x - end
            const last = out[out.length - 1]
            // A word gap is roughly a third of the font size; table columns sit much further apart.
            if (last && gap < Math.max(4, it.height * 0.8)) last.text += (gap > 0.5 ? ' ' : '') + it.str
            else out.push({ x: it.x, text: it.str })
            end = Math.max(end, it.x + it.width)
        }
        return out.map((c) => ({ x: c.x, text: c.text.replace(/\s+/g, ' ').trim() })).filter((c) => c.text)
    })

    const anchors: number[] = []
    for (const x of cells.flat().map((c) => c.x).sort((a, b) => a - b)) {
        if (!anchors.length || x - anchors[anchors.length - 1] > colTol) anchors.push(x)
    }
    const column = (x: number) => {
        let i = 0
        while (i + 1 < anchors.length && anchors[i + 1] <= x) i++
        return i
    }

    return cells
        .filter((row) => row.length)
        .map((row) => {
            const out: string[] = []
            for (const c of row) {
                const i = column(c.x)
                out[i] = out[i] ? `${out[i]} ${c.text}` : c.text
            }
            return Array.from(out, (v) => v ?? '')
        })
}
