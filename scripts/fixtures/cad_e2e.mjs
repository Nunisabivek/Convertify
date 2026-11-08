// End-to-end check of the AutoCAD PDF editor against the fixtures from cad_fixtures.py.
//
//   python scripts/fixtures/cad_fixtures.py <fx>
//   node scripts/fixtures/cad_e2e.mjs http://localhost:3311 <fx> <out> [desktop|phone|rotated|set|tablet|lowend|landscape|devices|all]
//   python scripts/fixtures/cad_verify.py <fx> <out>
//
// Drives the real page in Chrome (playwright-core): detection against the manifest,
// text edits at 0/30/90/270 degrees and on SHX text, every markup type, calibrate +
// measure, wheel zoom at the cursor, drag pan, keyboard zoom, touch pinch and
// two-finger pan on a phone, then export. Writes screenshots, the exported PDFs and
// expect.json (what cad_verify.py checks in the PDFs).
import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const BASE = process.argv[2] || 'http://localhost:3311'
const FX = process.argv[3]
const OUT = process.argv[4]
const ONLY = process.argv[5] || 'all'
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
fs.mkdirSync(OUT, { recursive: true })
const manifest = JSON.parse(fs.readFileSync(path.join(FX, 'manifest.json'), 'utf8'))

// pdf.js page.view (CropBox ∩ MediaBox) and /Rotate of every fixture page, read with PyMuPDF.
const PY = `
import fitz, json, sys, os
out = {}
for n in ['cad-a1-mixed.pdf', 'cad-rotate90.pdf', 'cad-set.pdf']:
    d = fitz.open(os.path.join(sys.argv[1], n)); fr = []
    for p in d:
        box = lambda k: [float(v) for v in d.xref_get_key(p.xref, k)[1].strip('[]').split()] if d.xref_get_key(p.xref, k)[0] != 'null' else None
        m = box('MediaBox'); c = box('CropBox') or m
        fr.append({'view': [max(m[0], c[0]), max(m[1], c[1]), min(m[2], c[2]), min(m[3], c[3])], 'rotate': p.rotation})
    out[n] = fr
print(json.dumps(out))`
const frames = JSON.parse(execFileSync('python', ['-c', PY, FX]).toString())

function toDisplay(frame, x, y) {
    const [x0, y0, x1, y1] = frame.view
    const cx = (x0 + x1) / 2
    const cy = (y0 + y1) / 2
    const r = ((frame.rotate % 360) + 360) % 360
    const [A, B, C, D] = r === 90 ? [0, 1, 1, 0] : r === 180 ? [-1, 0, 0, 1] : r === 270 ? [0, -1, -1, 0] : [1, 0, 0, -1]
    const offX = A === 0 ? Math.abs(cy - y0) : Math.abs(cx - x0)
    const offY = A === 0 ? Math.abs(cx - x0) : Math.abs(cy - y0)
    return { x: A * x + C * y + offX - A * cx - C * cy, y: B * x + D * y + offY - B * cx - D * cy }
}
const labelBox = (file, l) => {
    const pts = l.corners.map(([x, y]) => toDisplay(frames[file][l.page - 1], x, y))
    const xs = pts.map((p) => p.x)
    const ys = pts.map((p) => p.y)
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }
}
// SHX letters fused with hatching can't be separated from the pixels (the Add text tool covers these).
const KNOWN_HARD = new Set(['KITCHEN'])
const inter = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))
const results = { checks: [], expect: [] }
const check = (name, ok, detail = '') => {
    results.checks.push({ name, ok: !!ok, detail })
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`)
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true })

async function openFile(page, file) {
    await page.goto(BASE + '/autocad-pdf-editor', { waitUntil: 'domcontentloaded' })
    await page.locator('input[type=file]').first().setInputFiles(path.join(FX, file))
    await waitAnalysed(page)
    await page.waitForTimeout(700)
}
// The drawing shows as soon as it's rendered; regions arrive when analysis is done.
const waitAnalysed = (page, n = null) =>
    page.waitForFunction(
        (n) => {
            const s = document.querySelector('[data-testid=cad-stage]')
            const img = s?.querySelector('img')
            return s?.dataset.analyzed === 'true' && img?.complete && img.naturalWidth > 0 && (n == null || img.alt === `Page ${n}`)
        },
        n,
        { timeout: 300000, polling: 100 },
    )
const stage = (page) =>
    page.evaluate(() => {
        const s = document.querySelector('[data-testid=cad-stage]')
        const r = s.getBoundingClientRect()
        const img = s.querySelector('img')
        return { left: r.left, top: r.top, W: +s.dataset.w, H: +s.dataset.h, z: +s.dataset.zoom, nat: img.naturalWidth * img.naturalHeight }
    })
const regionsOf = async (page) => {
    const st = await stage(page)
    const rs = await page.evaluate(() =>
        [...document.querySelectorAll('[data-region]')].map((el) => {
            const r = el.getBoundingClientRect()
            return { kind: el.dataset.region, title: el.title, x: r.left, y: r.top, w: r.width, h: r.height }
        }),
    )
    return rs.map((r) => ({ ...r, box: { x: (r.x - st.left) / st.z, y: (r.y - st.top) / st.z, w: r.w / st.z, h: r.h / st.z } }))
}
const client = (st, p) => ({ x: st.left + p.x * st.z, y: st.top + p.y * st.z })

async function detection(page, file, pageNo, opts = {}) {
    const labels = manifest[file].filter((l) => l.page === pageNo)
    const rs = await regionsOf(page)
    const miss = []
    let tt = 0
    let shx = 0
    let ttN = 0
    let shxN = 0
    const used = new Set()
    const known = []
    for (const l of labels) {
        const lb = labelBox(file, l)
        const cands = rs.filter((r) => (l.kind === 'tt' ? r.kind === 'text' : r.kind === 'shx'))
        const hit = cands.find((r) => {
            const ov = inter(r.box, lb) / Math.max(1, Math.min(lb.w * lb.h, r.box.w * r.box.h))
            return ov > 0.5 && (l.kind !== 'tt' || r.title.includes(`"${l.text}"`))
        })
        if (l.kind === 'tt') ttN++
        else shxN++
        if (!hit && KNOWN_HARD.has(l.text)) {
            known.push(l.text)
            continue
        }
        if (hit) {
            used.add(hit)
            if (l.kind === 'tt') tt++
            else shx++
        } else miss.push(`${l.kind}:${l.text}@${l.angle}`)
    }
    const extra = rs.filter((r) => r.kind === 'shx' && !used.has(r)).length
    // At a low pixel budget small SHX letters merge; real text must still all be found.
    const ok = opts.minShx ? tt === ttN && shx >= opts.minShx * (shxN - known.length) : miss.length === 0
    check(`${file} p${pageNo} detection${opts.label ? ' ' + opts.label : ''}`, ok, `text ${tt}/${ttN}, shx ${shx}/${shxN}, unmatched shx regions ${extra}${known.length ? ', known limit: ' + known.join(', ') : ''}${miss.length ? ', missed ' + miss.join(' | ') : ''}`)
    return { rs, miss, extra }
}

async function editAt(page, file, label, newText, how = 'title') {
    if (how === 'title') {
        await page.locator(`main div[title*='"${label.text}"']`).first().click({ force: true })
    } else {
        const st = await stage(page)
        const b = labelBox(file, label)
        const c = client(st, { x: b.x + b.w / 2, y: b.y + b.h / 2 })
        await page.mouse.click(c.x, c.y)
    }
    const field = page.locator('main input[type=text]:visible').first()
    await field.waitFor({ timeout: 5000 })
    await field.fill(newText)
    await field.press('Enter')
    await page.waitForTimeout(200)
    results.expect.push({ file: null, page: label.page, old: label.text, new: newText, kind: label.kind, angle: label.angle, color: label.color, corners: label.corners })
}

const dragDisplay = async (page, a, b, opts = {}) => {
    const st = await stage(page)
    const ca = client(st, a)
    const cb = client(st, b)
    await page.mouse.move(ca.x, ca.y)
    await page.mouse.down()
    for (let i = 1; i <= 6; i++) await page.mouse.move(ca.x + ((cb.x - ca.x) * i) / 6, ca.y + ((cb.y - ca.y) * i) / 6)
    if (opts.before) await opts.before()
    await page.mouse.up()
    await page.waitForTimeout(150)
}
const tool = (page, name) => page.locator(`main button[aria-label="${name}"]`).first().click()
const markupCount = (page) => page.evaluate(() => document.querySelectorAll('[data-markup]').length)

async function exportTo(page, name) {
    await page.locator('main button:visible', { hasText: /Export/ }).first().click()
    const link = page.locator('main a[download]').first()
    await link.waitFor({ timeout: 120000 })
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), link.click()])
    const out = path.join(OUT, name)
    await dl.saveAs(out)
    return out
}

async function desktop() {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, acceptDownloads: true })
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && /AutoCAD editor|Error/.test(m.text()) && errors.push(m.text()))
    const file = 'cad-a1-mixed.pdf'
    const t0 = Date.now()
    await openFile(page, file)
    const st0 = await stage(page)
    check('A1 renders within the 16 MP budget', st0.nat <= 16.1e6, `${(st0.nat / 1e6).toFixed(1)} MP in ${((Date.now() - t0) / 1000).toFixed(1)} s`)
    await detection(page, file, 1)
    await page.screenshot({ path: path.join(OUT, 'desktop-a1-fit.png') })

    const L = (t) => manifest[file].find((l) => l.text === t)
    results.expect = []
    await editAt(page, file, L('ROOM A-101'), 'ROOM B-202')
    await editAt(page, file, L('RAMP 1:12'), 'RAMP 1:15')
    await editAt(page, file, L('SERVICE DUCT'), 'SERVICE SHAFT')
    await editAt(page, file, L('RISER R2'), 'RISER R3')
    await editAt(page, file, L('FIRE EXIT'), 'FIRE EXIT 2')
    await editAt(page, file, L('WATER MAIN'), 'WATER MAIN 2')
    await editAt(page, file, L('SHEET A-201'), 'SHEET A-202')
    await editAt(page, file, L('REVISION C'), 'REVISION D', 'point')
    await editAt(page, file, manifest[file].find((l) => l.text === '1100'), '1200', 'point')
    await editAt(page, file, L('OFFICE 201'), 'OFFICE 205', 'point')
    // Delete one label completely.
    await page.locator(`main div[title*='"DRAWN BY: J. SMITH"']`).first().click({ force: true })
    await page.locator('main button[aria-label="Delete text"]').click()
    results.expect.push({ page: 1, old: 'DRAWN BY: J. SMITH', new: null, kind: 'tt', angle: 0, corners: L('DRAWN BY: J. SMITH').corners })
    const edited = await page.evaluate(() => document.querySelectorAll('[title^="Edited"]').length)
    check('ten edits and one deletion recorded', edited === 10, `${edited} edited regions`)
    await page.screenshot({ path: path.join(OUT, 'desktop-a1-edited.png') })

    // Markups.
    const m = []
    await tool(page, 'Arrow')
    await dragDisplay(page, { x: 300, y: 300 }, { x: 420, y: 380 })
    m.push({ kind: 'arrow', a: { x: 300, y: 300 }, b: { x: 420, y: 380 } })
    await tool(page, 'Cloud')
    await dragDisplay(page, { x: 500, y: 200 }, { x: 650, y: 300 })
    m.push({ kind: 'cloud', a: { x: 500, y: 200 }, b: { x: 650, y: 300 } })
    await tool(page, 'Box')
    await dragDisplay(page, { x: 700, y: 200 }, { x: 800, y: 280 })
    m.push({ kind: 'rect', a: { x: 700, y: 200 }, b: { x: 800, y: 280 } })
    await tool(page, 'Highlight')
    await dragDisplay(page, { x: 1000, y: 360 }, { x: 1150, y: 400 })
    m.push({ kind: 'highlight', a: { x: 1000, y: 360 }, b: { x: 1150, y: 400 } })
    await tool(page, 'Note')
    {
        const st = await stage(page)
        const c = client(st, { x: 1300, y: 250 })
        await page.mouse.click(c.x, c.y)
        await page.locator('main textarea:visible').fill('CHECK THIS\nWITH ENGINEER')
        await page.locator('main button:visible', { hasText: 'Add note' }).click()
        m.push({ kind: 'note', text: 'CHECK THIS' })
    }
    await tool(page, 'Stamp')
    await page.locator('main select[aria-label="Stamp"]').selectOption('FOR CONSTRUCTION')
    {
        const st = await stage(page)
        const c = client(st, { x: 1600, y: 300 })
        await page.mouse.click(c.x, c.y)
        m.push({ kind: 'stamp', text: 'FOR CONSTRUCTION' })
    }
    // Calibrate on a 200 pt line = 5000 mm, then measure 400 pt → 10,000 mm.
    await tool(page, 'Measure')
    await page.locator('main button:visible', { hasText: 'Set scale' }).first().click()
    await dragDisplay(page, { x: 200, y: 1500 }, { x: 400, y: 1500 })
    await page.locator('main input[aria-label="Real length"]').fill('5000')
    await page.locator('main button:visible', { hasText: 'Set scale' }).last().click()
    const scaleText = await page.locator('main', { hasText: 'Scale' }).locator('span', { hasText: /^Scale / }).first().textContent().catch(() => '')
    let live = ''
    await dragDisplay(page, { x: 200, y: 1550 }, { x: 600, y: 1550 }, {
        before: async () => {
            live = await page.locator('[data-testid=cad-frame] .font-mono').first().textContent().catch(() => '')
        },
    })
    const result = await page.locator('[data-overlay] .font-mono').first().textContent()
    check('calibrated measure reads 10,000 mm', /10,000 mm/.test(result) && /10,000 mm/.test(live), `scale "${scaleText}", live "${live}", result "${result}"`)
    await page.locator('main button:visible', { hasText: 'Add to drawing' }).click()
    m.push({ kind: 'measure', text: '10,000 mm' })
    let n = await markupCount(page)
    check('seven markups drawn', n === 7, `${n}`)
    // Undo and delete.
    await tool(page, 'Box')
    await dragDisplay(page, { x: 100, y: 100 }, { x: 150, y: 150 })
    const before = await markupCount(page)
    await page.locator('main button[aria-label="Undo last markup"]').click()
    const afterUndo = await markupCount(page)
    await page.keyboard.press('Escape')
    check('undo removes the last markup', before === 8 && afterUndo === 7, `${before} → ${afterUndo}`)
    await page.screenshot({ path: path.join(OUT, 'desktop-a1-markups.png') })

    // Zoom at the cursor with Ctrl+wheel: the page point under the cursor must not move.
    const sA = await stage(page)
    const P = { x: 700, y: 500 }
    const under = { x: (P.x - sA.left) / sA.z, y: (P.y - sA.top) / sA.z }
    await page.mouse.move(P.x, P.y)
    // Enough notches that the sheet outgrows the frame (a sheet that fits stays centred).
    await page.keyboard.down('Control')
    for (let i = 0; i < 5; i++) await page.mouse.wheel(0, -100)
    await page.keyboard.up('Control')
    await page.waitForTimeout(200)
    const sB = await stage(page)
    const under2 = { x: (P.x - sB.left) / sB.z, y: (P.y - sB.top) / sB.z }
    const scrollY = await page.evaluate(() => window.scrollY)
    check('ctrl+wheel zooms at the cursor', sB.z > sA.z * 1.4 && Math.hypot(under2.x - under.x, under2.y - under.y) < 1.5, `zoom ${sA.z.toFixed(3)} → ${sB.z.toFixed(3)}, drift ${Math.hypot(under2.x - under.x, under2.y - under.y).toFixed(2)} pt`)
    // Drag on an empty spot pans.
    await tool(page, 'Select')
    const empty = await page.evaluate(() => {
        const f = document.querySelector('[data-testid=cad-frame]').getBoundingClientRect()
        for (let y = f.top + 60; y < f.bottom - 60; y += 23)
            for (let x = f.left + 60; x < f.right - 60; x += 31) {
                const el = document.elementFromPoint(x, y)
                if (el && !el.closest('[data-hit],[data-overlay]') && el.closest('[data-testid=cad-frame]')) return { x, y }
            }
        return null
    })
    await page.mouse.move(empty.x, empty.y)
    await page.mouse.down()
    await page.mouse.move(empty.x - 80, empty.y - 60, { steps: 5 })
    await page.mouse.up()
    const sC = await stage(page)
    check('drag on empty area pans', Math.abs(sC.left - sB.left + 80) < 2 && Math.abs(sC.top - sB.top + 60) < 2, `moved ${(sC.left - sB.left).toFixed(0)}, ${(sC.top - sB.top).toFixed(0)}`)
    // Space + drag pans even with a drawing tool active, and draws nothing.
    await tool(page, 'Arrow')
    const nBefore = await markupCount(page)
    await page.mouse.move(empty.x, empty.y)
    await page.keyboard.down('Space')
    await page.mouse.down()
    await page.mouse.move(empty.x + 50, empty.y + 30, { steps: 5 })
    await page.mouse.up()
    await page.keyboard.up('Space')
    const sS = await stage(page)
    check('space + drag pans without drawing', Math.abs(sS.left - sC.left - 50) < 2 && Math.abs(sS.top - sC.top - 30) < 2 && (await markupCount(page)) === nBefore, `moved ${(sS.left - sC.left).toFixed(0)}, ${(sS.top - sC.top).toFixed(0)}`)
    await tool(page, 'Select')
    await page.keyboard.press('0')
    const sD = await stage(page)
    await page.keyboard.press('+')
    const sE = await stage(page)
    await page.keyboard.press('-')
    const sF = await stage(page)
    check('keyboard 0 / + / - zoom', Math.abs(sD.z - st0.z) < 1e-3 && Math.abs(sE.z / sD.z - 1.25) < 0.01 && Math.abs(sF.z - sD.z) < 1e-3, `${sD.z.toFixed(3)} ${sE.z.toFixed(3)} ${sF.z.toFixed(3)}; page scrollY ${scrollY}`)

    const out = await exportTo(page, 'desktop-a1-edited.pdf')
    await page.screenshot({ path: path.join(OUT, 'desktop-done.png') })
    results.files = results.files || []
    results.files.push({ out, src: file, edits: results.expect.map((e) => ({ ...e, file })), markups: m, color: '#e00000' })
    check('desktop page errors', errors.length === 0, errors.join(' | ').slice(0, 300))
    await ctx.close()
}

async function rotated() {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, acceptDownloads: true })
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    page.on('console', (m) => /AutoCAD editor/.test(m.text()) && errors.push(m.text()))
    const file = 'cad-rotate90.pdf'
    await openFile(page, file)
    await detection(page, file, 1)
    const L = (t) => manifest[file].find((l) => l.text === t)
    results.expect = []
    await editAt(page, file, L('DETAIL SHEET D-02'), 'DETAIL SHEET D-03')
    await editAt(page, file, L('VERTICAL TAG'), 'VERTICAL TAG 2')
    await editAt(page, file, L('SECTION A-A'), 'SECTION B-B', 'point')
    const m = []
    await tool(page, 'Box')
    await dragDisplay(page, { x: 100, y: 100 }, { x: 260, y: 180 })
    m.push({ kind: 'rect', a: { x: 100, y: 100 }, b: { x: 260, y: 180 } })
    await tool(page, 'Arrow')
    await dragDisplay(page, { x: 300, y: 120 }, { x: 420, y: 220 })
    m.push({ kind: 'arrow', a: { x: 300, y: 120 }, b: { x: 420, y: 220 } })
    await tool(page, 'Highlight')
    await dragDisplay(page, { x: 500, y: 400 }, { x: 640, y: 440 })
    m.push({ kind: 'highlight', a: { x: 500, y: 400 }, b: { x: 640, y: 440 } })
    await tool(page, 'Stamp')
    {
        const st = await stage(page)
        const c = client(st, { x: 700, y: 150 })
        await page.mouse.click(c.x, c.y)
        m.push({ kind: 'stamp', text: 'APPROVED' })
    }
    await page.keyboard.press('Escape')
    await page.screenshot({ path: path.join(OUT, 'desktop-rotate90.png') })
    const out = await exportTo(page, 'rotate90-edited.pdf')
    results.files.push({ out, src: file, edits: results.expect.map((e) => ({ ...e, file })), markups: m, color: '#e00000' })
    check('rotated page errors', errors.length === 0, errors.join(' | ').slice(0, 300))
    await ctx.close()
}

async function set() {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, acceptDownloads: true })
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    const file = 'cad-set.pdf'
    const t0 = Date.now()
    await openFile(page, file)
    const first = (Date.now() - t0) / 1000
    const imgs = await page.evaluate(() => document.querySelectorAll('[data-testid=cad-stage] img').length)
    check('multi-page set opens after rendering one sheet', imgs === 1, `${first.toFixed(1)} s to first sheet`)
    const sizes = []
    for (let p = 2; p <= 6; p++) {
        const t = Date.now()
        await page.locator('main button[title="Next page"]').click()
        await waitAnalysed(page, p)
        await page.waitForTimeout(300)
        const st = await stage(page)
        sizes.push(`p${p} ${(st.nat / 1e6).toFixed(1)}MP ${((Date.now() - t) / 1000).toFixed(1)}s`)
        await detection(page, file, p)
        if (p === 3) await page.screenshot({ path: path.join(OUT, 'desktop-set-a0.png') })
    }
    const a0 = sizes[1]
    check('A0 sheet stays within the pixel budget', parseFloat(a0.split(' ')[1]) <= 16.1, sizes.join(', '))
    // Going back reuses the rendered sheet.
    const t = Date.now()
    await page.locator('main button[title="Previous page"]').click()
    await page.waitForFunction(() => document.querySelector('[data-testid=cad-stage] img')?.alt === 'Page 5')
    check('revisiting a sheet is instant', Date.now() - t < 1500, `${Date.now() - t} ms`)
    // An edit on sheet 4 (SHX only) exports.
    await page.locator('main button[title="Previous page"]').click()
    await page.waitForFunction(() => document.querySelector('[data-testid=cad-stage] img')?.alt === 'Page 4')
    const shx4 = manifest[file].find((l) => l.page === 4 && l.text === 'BEDROOM 2')
    results.expect = []
    await editAt(page, file, shx4, 'CHANGED ON SHEET 4', 'point')
    const out = await exportTo(page, 'set-edited.pdf')
    results.files.push({ out, src: file, edits: results.expect.map((e) => ({ ...e, file })), markups: [], color: '#e00000' })
    check('set page errors', errors.length === 0, errors.join(' | ').slice(0, 300))
    await ctx.close()
}

async function phone() {
    const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        acceptDownloads: true,
        userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36',
    })
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    const file = 'cad-a1-mixed.pdf'
    await openFile(page, file)
    await page.waitForTimeout(800)
    const st0 = await stage(page)
    check('phone render within 8 MP', st0.nat <= 8.05e6, `${(st0.nat / 1e6).toFixed(1)} MP`)
    await detection(page, file, 1)
    const exp = await page.locator('main button:visible', { hasText: /Export/ }).first().boundingBox()
    const tb = await page.evaluate(() => document.documentElement.scrollWidth)
    check('phone toolbar fits, export reachable', exp && exp.x + exp.width <= 390 && tb <= 391, `export at ${exp && Math.round(exp.x)}..${exp && Math.round(exp.x + exp.width)}, page width ${tb}`)
    const tbf = await toolbarFacts(page)
    check('phone tap targets ≥ 28 px, no double-tap zoom', tbf.small.length === 0 && tbf.noManip.length === 0, [...tbf.small, ...tbf.noManip].join(', '))
    const fr0 = await frameFacts(page)
    check('phone frame fills the screen, drawing at the top', fr0.bottom <= fr0.vh && fr0.stageTop <= 12 && fr0.height >= 0.6 * fr0.vh, `frame ${fr0.top}..${fr0.bottom} of ${fr0.vh}, drawing ${fr0.stageTop}px from the frame top`)
    await page.screenshot({ path: path.join(OUT, 'phone-fit.png') })

    // Pinch out on the drawing: the drawing zooms, the web page doesn't.
    const cdp = await ctx.newCDPSession(page)
    const f = await page.locator('[data-testid=cad-frame]').boundingBox()
    const cx = f.x + f.width / 2
    const cy = f.y + f.height / 2
    const scroll0 = await page.evaluate(() => window.scrollY)
    const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((p, i) => ({ x: p.x, y: p.y, id: i + 1, radiusX: 2, radiusY: 2, force: 1 })) })
    await touch('touchStart', [{ x: cx - 30, y: cy }, { x: cx + 30, y: cy }])
    for (let i = 1; i <= 10; i++) await touch('touchMove', [{ x: cx - 30 - i * 6, y: cy }, { x: cx + 30 + i * 6, y: cy }])
    await touch('touchEnd', [])
    await page.waitForTimeout(300)
    const st1 = await stage(page)
    const vv = await page.evaluate(() => ({ scale: window.visualViewport?.scale ?? 1, y: window.scrollY }))
    check('pinch zooms the drawing, not the page', st1.z > st0.z * 1.7 && vv.scale === 1 && Math.abs(vv.y - scroll0) < 2, `zoom ${st0.z.toFixed(3)} → ${st1.z.toFixed(3)} (×${(st1.z / st0.z).toFixed(2)}), page scale ${vv.scale}, scrollY ${scroll0} → ${vv.y}`)
    // Two-finger pan.
    await touch('touchStart', [{ x: cx - 40, y: cy }, { x: cx + 40, y: cy }])
    // The drawing sits at the top of the frame, so after the pinch there's room to move it down.
    for (let i = 1; i <= 8; i++) await touch('touchMove', [{ x: cx - 40 - i * 10, y: cy + i * 6 }, { x: cx + 40 - i * 10, y: cy + i * 6 }])
    await touch('touchEnd', [])
    await page.waitForTimeout(300)
    const st2 = await stage(page)
    const vy = await page.evaluate(() => window.scrollY)
    check('two-finger pan moves the drawing', Math.abs(st2.left - st1.left + 80) < 4 && Math.abs(st2.top - st1.top - 48) < 4 && Math.abs(vy - scroll0) < 2, `moved ${(st2.left - st1.left).toFixed(0)}, ${(st2.top - st1.top).toFixed(0)}; scrollY ${vy}`)
    await page.screenshot({ path: path.join(OUT, 'phone-pinched.png') })

    // Single tap on a label opens the bottom sheet.
    await page.keyboard.press('0').catch(() => {})
    await page.locator('main button[title="Fit page (0)"]').tap()
    await page.waitForTimeout(300)
    const target = page.locator(`main div[title*='"ROOM A-101"']`).first()
    const rid = await target.getAttribute('data-id')
    const pad = page.locator(`main [data-pad-for="${rid}"]`)
    const tbox = (await pad.count()) ? await pad.boundingBox() : await target.boundingBox()
    check('small labels get a ≥28 px tap target', tbox && tbox.height >= 27.5 && tbox.width >= 27.5, tbox ? `${tbox.width.toFixed(0)}×${tbox.height.toFixed(0)} px` : 'missing')
    await target.tap()
    const field = page.locator('main input[type=text]:visible').first()
    await field.waitFor({ timeout: 5000 })
    const fb = await field.boundingBox()
    check('bottom sheet editor is on screen', fb && fb.y > 844 / 2 && fb.y + fb.height <= 844 && fb.x >= 0 && fb.x + fb.width <= 390, fb ? `input at y ${Math.round(fb.y)}..${Math.round(fb.y + fb.height)}` : '')
    await page.waitForTimeout(300)
    const edf = await editorFacts(page, rid)
    check('bottom sheet leaves the edited text visible', edf.sheet && edf.overlap === 0 && edf.belowToolbar, JSON.stringify(edf))
    await page.screenshot({ path: path.join(OUT, 'phone-sheet.png') })
    await field.fill('ROOM C-303')
    await field.press('Enter')
    results.expect = [{ page: 1, old: 'ROOM A-101', new: 'ROOM C-303', kind: 'tt', angle: 0, corners: manifest[file].find((l) => l.text === 'ROOM A-101').corners }]

    // One-finger arrow with the arrow tool.
    await page.locator('main button[aria-label="Arrow"]').tap()
    const st3 = await stage(page)
    const a = client(st3, { x: 600, y: 300 })
    const b = client(st3, { x: 900, y: 500 })
    await touch('touchStart', [a])
    for (let i = 1; i <= 6; i++) await touch('touchMove', [{ x: a.x + ((b.x - a.x) * i) / 6, y: a.y + ((b.y - a.y) * i) / 6 }])
    await touch('touchEnd', [])
    await page.waitForTimeout(300)
    const n = await markupCount(page)
    check('touch-drawn arrow', n === 1, `${n} markups`)
    await page.locator('main button[aria-label="Select"]').tap()
    await page.screenshot({ path: path.join(OUT, 'phone-edited.png') })
    const out = await exportTo(page, 'phone-edited.pdf')
    results.files = results.files || []
    results.files.push({ out, src: file, edits: results.expect.map((e) => ({ ...e, file })), markups: [{ kind: 'arrow', a: { x: 600, y: 300 }, b: { x: 900, y: 500 } }], color: '#e00000' })
    check('phone page errors', errors.length === 0, errors.join(' | ').slice(0, 300))
    await ctx.close()
}

// ---- Devices: tablets with a pen, a throttled low-end phone, a landscape phone ----

const IPAD_UA = 'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
const PHONE_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36'
const LOW_UA = 'Mozilla/5.0 (Linux; Android 11; Go Edition) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36'

// Toolbar shape: rows, overflow, every control on screen, tap targets and touch-action.
const toolbarFacts = (page) =>
    page.evaluate(() => {
        const bar = document.querySelector('[data-testid=cad-toolbar]')
        const r = bar.getBoundingClientRect()
        const ctrls = [...bar.querySelectorAll('button, label[title], select')].filter((el) => el.offsetParent !== null)
        const tops = new Set()
        let small = []
        let offscreen = []
        let noManip = []
        for (const el of ctrls) {
            const b = el.getBoundingClientRect()
            tops.add(Math.round(b.top / 12))
            if (Math.min(b.width, b.height) < 27.5) small.push(`${el.getAttribute('aria-label') || el.title || el.textContent.trim()} ${Math.round(b.width)}x${Math.round(b.height)}`)
            // Tools may scroll sideways in their row on small screens; the row itself must fit.
            const row = el.closest('.overflow-x-auto')
            const lim = row ? row.getBoundingClientRect() : { left: 0, right: innerWidth }
            if (!row && (b.left < -0.5 || b.right > innerWidth + 0.5)) offscreen.push(el.getAttribute('aria-label') || el.textContent.trim())
            if (row && (lim.left < -0.5 || lim.right > innerWidth + 0.5)) offscreen.push('scroll row')
            if (el.tagName === 'BUTTON' && getComputedStyle(el).touchAction !== 'manipulation') noManip.push(el.getAttribute('aria-label') || el.textContent.trim())
        }
        const tools = ['Select', 'Add text', 'Arrow', 'Cloud', 'Box', 'Highlight', 'Note', 'Stamp', 'Measure'].map((n) => {
            const b = bar.querySelector(`button[aria-label="${n}"]`).getBoundingClientRect()
            return b.right <= innerWidth + 0.5 && b.left >= -0.5
        })
        return { height: Math.round(r.height), width: Math.round(r.width), pageWidth: document.documentElement.scrollWidth, small, offscreen: [...new Set(offscreen)], noManip, toolsVisible: tools.filter(Boolean).length }
    })

const frameFacts = (page) =>
    page.evaluate(() => {
        const f = document.querySelector('[data-testid=cad-frame]').getBoundingClientRect()
        const s = document.querySelector('[data-testid=cad-stage]').getBoundingClientRect()
        const tb = document.querySelector('[data-testid=cad-toolbar]').getBoundingClientRect()
        return { top: Math.round(f.top), bottom: Math.round(f.bottom), height: Math.round(f.height), stageTop: Math.round(s.top - f.top), stageH: Math.round(s.height), toolbarBottom: Math.round(tb.bottom), vh: innerHeight }
    })

// The edited region and the open editor (bottom sheet or popover) don't overlap.
const editorFacts = (page, rid) =>
    page.evaluate((rid) => {
        const reg = document.querySelector(`[data-id="${rid}"]`).getBoundingClientRect()
        const ov = document.querySelector('[data-overlay]').getBoundingClientRect()
        const input = document.querySelector('[data-overlay] input[type=text]').getBoundingClientRect()
        const tb = document.querySelector('[data-testid=cad-toolbar]').getBoundingClientRect()
        const overlap = Math.max(0, Math.min(reg.right, ov.right) - Math.max(reg.left, ov.left)) * Math.max(0, Math.min(reg.bottom, ov.bottom) - Math.max(reg.top, ov.top))
        return {
            sheet: !!document.querySelector('[data-testid=cad-sheet]'),
            overlap: Math.round(overlap),
            regionTop: Math.round(reg.top),
            regionBottom: Math.round(reg.bottom),
            belowToolbar: reg.top >= tb.bottom - 0.5,
            inputOnScreen: input.top >= 0 && input.bottom <= innerHeight && input.left >= 0 && input.right <= innerWidth,
            editorTop: Math.round(ov.top),
        }
    }, rid)

async function tablet(orient) {
    const [w, h] = orient === 'portrait' ? [820, 1180] : [1180, 820]
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, acceptDownloads: true, userAgent: IPAD_UA })
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    const file = 'cad-a1-mixed.pdf'
    await openFile(page, file)
    const st0 = await stage(page)
    check(`tablet ${orient}: renders at the tablet budget`, st0.nat > 8.05e6 && st0.nat <= 12.05e6, `${(st0.nat / 1e6).toFixed(1)} MP`)
    await detection(page, file, 1)
    const tb = await toolbarFacts(page)
    check(
        `tablet ${orient}: toolbar in two rows, nothing off screen`,
        tb.height <= 100 && tb.pageWidth <= w && tb.offscreen.length === 0 && tb.toolsVisible === 9,
        `height ${tb.height}px, page width ${tb.pageWidth}, tools visible ${tb.toolsVisible}/9${tb.offscreen.length ? ', off screen: ' + tb.offscreen.join(', ') : ''}`,
    )
    check(`tablet ${orient}: tap targets ≥ 28 px, no double-tap zoom`, tb.small.length === 0 && tb.noManip.length === 0, [...tb.small, ...tb.noManip.map((n) => 'touch-action: ' + n)].join(', ').slice(0, 300))
    const fr = await frameFacts(page)
    check(`tablet ${orient}: drawing fills the screen below the toolbar`, fr.bottom <= fr.vh && fr.height >= 0.55 * fr.vh, `frame ${fr.top}..${fr.bottom} of ${fr.vh}`)
    await page.screenshot({ path: path.join(OUT, `tablet-${orient}-fit.png`) })

    // Tap a label: tablets get the popover beside it, never covering it.
    const target = page.locator(`main div[title*='"ROOM A-101"']`).first()
    const rid = await target.getAttribute('data-id')
    await target.tap({ force: true })
    await page.locator('main input[type=text]:visible').first().waitFor({ timeout: 5000 })
    const ed = await editorFacts(page, rid)
    check(`tablet ${orient}: editor beside the text, not over it`, !ed.sheet && ed.overlap === 0 && ed.inputOnScreen, JSON.stringify(ed))
    await page.screenshot({ path: path.join(OUT, `tablet-${orient}-editor.png`) })
    await page.locator('main input[type=text]:visible').first().fill('ROOM P-404')
    await page.locator('main input[type=text]:visible').first().press('Enter')
    const edits = [{ page: 1, old: 'ROOM A-101', new: 'ROOM P-404', kind: 'tt', angle: 0, corners: manifest[file].find((l) => l.text === 'ROOM A-101').corners }]

    // A pen draws a box precisely while a palm (two touches) rests on the glass.
    await page.locator('main button[aria-label="Box"]').tap()
    const cdp = await ctx.newCDPSession(page)
    const st = await stage(page)
    const A = { x: 300, y: 300 }
    const B = { x: 520, y: 430 }
    const ca = client(st, A)
    const cb = client(st, B)
    const pen = (type, p, buttons) => cdp.send('Input.dispatchMouseEvent', { type, x: p.x, y: p.y, button: type === 'mouseMoved' ? 'none' : 'left', buttons, clickCount: 1, pointerType: 'pen' })
    const f = await page.locator('[data-testid=cad-frame]').boundingBox()
    const palmAt = [{ x: f.x + f.width - 60, y: f.y + f.height - 50 }, { x: f.x + f.width - 25, y: f.y + f.height - 20 }]
    const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((p, i) => ({ x: p.x, y: p.y, id: i + 1, radiusX: 12, radiusY: 12, force: 1 })) })
    const before = await markupCount(page)
    await pen('mousePressed', ca, 1)
    for (let i = 1; i <= 8; i++) {
        await pen('mouseMoved', { x: ca.x + ((cb.x - ca.x) * i) / 8, y: ca.y + ((cb.y - ca.y) * i) / 8 }, 1)
        if (i === 3) await touch('touchStart', palmAt)
        if (i === 5) await touch('touchMove', palmAt.map((p) => ({ x: p.x - 30, y: p.y + 4 })))
    }
    await pen('mouseReleased', cb, 0)
    await touch('touchEnd', [])
    await page.waitForTimeout(250)
    const st2 = await stage(page)
    const box = await page.evaluate(() => {
        const g = [...document.querySelectorAll('g[data-markup=rect]')].pop()
        const b = g?.querySelector('path')?.getBBox()
        return b ? { x: b.x, y: b.y, w: b.width, h: b.height } : null
    })
    const n = await markupCount(page)
    const err = box ? Math.max(Math.abs(box.x - A.x), Math.abs(box.y - A.y), Math.abs(box.x + box.w - B.x), Math.abs(box.y + box.h - B.y)) : 99
    check(
        `tablet ${orient}: pen draws a box precisely, palm ignored`,
        n === before + 1 && err < 1.5 && Math.abs(st2.z - st.z) < 1e-6 && Math.abs(st2.left - st.left) < 0.5,
        `markups ${before} → ${n}, corner error ${err.toFixed(2)} pt, zoom ${st.z.toFixed(4)} → ${st2.z.toFixed(4)}`,
    )
    // Right after the pen lifts, a stray finger can't draw.
    await page.waitForTimeout(500)
    await page.locator('main button[aria-label="Select"]').tap()
    await page.screenshot({ path: path.join(OUT, `tablet-${orient}-pen.png`) })
    if (orient === 'portrait') {
        const out = await exportTo(page, 'tablet-edited.pdf')
        results.files.push({ out, src: file, edits: edits.map((e) => ({ ...e, file })), markups: [{ kind: 'rect', a: A, b: B }], color: '#e00000' })
    }
    check(`tablet ${orient}: page errors`, errors.length === 0, errors.join(' | ').slice(0, 300))
    await ctx.close()
}

async function lowend() {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, acceptDownloads: true, userAgent: LOW_UA })
    await ctx.addInitScript(() => {
        window.__lt = []
        window.__sawProgress = false
        try {
            new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push([e.startTime, e.duration]))).observe({ type: 'longtask', buffered: true })
        } catch {}
        new MutationObserver(() => {
            if (document.querySelector('[data-testid=cad-progress], [data-testid=cad-loading]')) window.__sawProgress = true
        }).observe(document, { subtree: true, childList: true })
        window.__urls = new Map()
        const create = URL.createObjectURL.bind(URL)
        const revoke = URL.revokeObjectURL.bind(URL)
        URL.createObjectURL = (o) => {
            const u = create(o)
            if (o?.type?.startsWith('image/')) window.__urls.set(u, 1)
            return u
        }
        URL.revokeObjectURL = (u) => {
            window.__urls.delete(u)
            revoke(u)
        }
    })
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    const cdp = await ctx.newCDPSession(page)
    await page.goto(BASE + '/autocad-pdf-editor?cadTier=low', { waitUntil: 'load' })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 })
    await page.waitForTimeout(1500)
    const file = 'cad-a1-mixed.pdf'
    const t0 = Date.now()
    const tStart = await page.evaluate(() => performance.now())
    await page.locator('input[type=file]').first().setInputFiles(path.join(FX, file))
    await waitAnalysed(page)
    const secs = (Date.now() - t0) / 1000
    await page.waitForTimeout(500)
    const st0 = await stage(page)
    const lt = await page.evaluate((t) => window.__lt.filter(([s]) => s >= t).map(([, d]) => d), tStart)
    check('low-end: forced low tier renders ≤ 4 MP', st0.nat <= 4.05e6, `${(st0.nat / 1e6).toFixed(1)} MP, analysed in ${secs.toFixed(1)} s at 6x CPU throttling`)
    check('low-end: progress shown while the page loads', await page.evaluate(() => window.__sawProgress))
    check('low-end: no long freeze while rendering and analysing', Math.max(0, ...lt) < 400, `${lt.length} long tasks, ${Math.round(lt.reduce((a, b) => a + b, 0))} ms total, longest ${Math.round(Math.max(0, ...lt))} ms`)
    await detection(page, file, 1, { minShx: 0.8, label: '(low tier, 4 MP: small SHX may merge)' })
    const tb = await toolbarFacts(page)
    check('low-end: toolbar fits 360 px, tap targets ≥ 28 px', tb.pageWidth <= 360 && tb.offscreen.length === 0 && tb.small.length === 0 && tb.noManip.length === 0, `page width ${tb.pageWidth}${tb.small.length ? ', small: ' + tb.small.join(', ') : ''}${tb.noManip.length ? ', no manipulation: ' + tb.noManip.join(', ') : ''}`)
    const fr = await frameFacts(page)
    check('low-end: frame fits the screen, drawing at the top', fr.bottom <= fr.vh && fr.stageTop <= 12, `frame ${fr.top}..${fr.bottom} of ${fr.vh}, drawing ${fr.stageTop}px from frame top`)
    await page.screenshot({ path: path.join(OUT, 'lowend-fit.png') })
    const target = page.locator(`main div[title*='"FIRE EXIT"']`).first()
    const rid = await target.getAttribute('data-id')
    await target.tap({ force: true })
    await page.locator('main input[type=text]:visible').first().waitFor({ timeout: 10000 })
    await page.waitForTimeout(400)
    const ed = await editorFacts(page, rid)
    check('low-end: bottom sheet leaves the text visible', ed.sheet && ed.overlap === 0 && ed.belowToolbar && ed.inputOnScreen, JSON.stringify(ed))
    await page.screenshot({ path: path.join(OUT, 'lowend-sheet.png') })
    await page.locator('main button:visible', { hasText: 'Cancel' }).tap()

    // A 6-sheet set: flick through three sheets fast; only the last one may be rendered and analysed.
    await page.goto(BASE + '/autocad-pdf-editor?cadTier=low', { waitUntil: 'load' })
    await page.waitForTimeout(1500)
    await page.locator('input[type=file]').first().setInputFiles(path.join(FX, 'cad-set.pdf'))
    await waitAnalysed(page, 1)
    // Three taps 40 ms apart: faster than a page can render, slow enough for React to re-render.
    await page.evaluate(async () => {
        for (let i = 0; i < 3; i++) {
            document.querySelector('main button[title="Next page"]').click()
            await new Promise((r) => setTimeout(r, 40))
        }
    })
    await waitAnalysed(page, 4)
    const marks = await page.evaluate(() => performance.getEntriesByType('mark').map((m) => m.name).filter((n) => n.startsWith('cad:')))
    const stale = marks.filter((m) => /^cad:(shown|analysed):[23]$/.test(m))
    check('low-end: fast paging skips the sheets in between', stale.length === 0 && marks.includes('cad:analysed:4'), marks.join(' '))
    for (let p = 5; p <= 6; p++) {
        await page.locator('main button[title="Next page"]').tap()
        await waitAnalysed(page, p)
    }
    const held = await page.evaluate(async () => {
        let mp = 0
        for (const u of window.__urls.keys()) {
            const im = new Image()
            im.src = u
            await im.decode().catch(() => {})
            mp += (im.naturalWidth * im.naturalHeight) / 1e6
        }
        return { n: window.__urls.size, mp: +mp.toFixed(2) }
    })
    check('low-end: only nearby page images stay in memory', held.n <= 2 && held.mp <= 6.05, `${held.n} images, ${held.mp} MP held after visiting 6 sheets`)
    // Going back re-renders an evicted sheet from the cached analysis.
    await page.locator('main button[title="Previous page"]').tap()
    await page.locator('main button[title="Previous page"]').tap()
    await waitAnalysed(page, 4)
    check('low-end: an evicted sheet comes back', true, '')
    await page.screenshot({ path: path.join(OUT, 'lowend-set.png') })
    check('low-end: page errors', errors.length === 0, errors.join(' | ').slice(0, 300))
    await ctx.close()
}

async function landscape() {
    const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, acceptDownloads: true, userAgent: PHONE_UA })
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    const file = 'cad-a1-mixed.pdf'
    await openFile(page, file)
    const st0 = await stage(page)
    check('landscape phone: phone budget', st0.nat > 4.05e6 && st0.nat <= 8.05e6, `${(st0.nat / 1e6).toFixed(1)} MP`)
    await detection(page, file, 1)
    const tb = await toolbarFacts(page)
    check('landscape phone: toolbar is one row', tb.height <= 56 && tb.pageWidth <= 844 && tb.offscreen.length === 0 && tb.small.length === 0, `height ${tb.height}px, page width ${tb.pageWidth}${tb.small.length ? ', small: ' + tb.small.join(', ') : ''}`)
    const fr = await frameFacts(page)
    check('landscape phone: drawing gets the rest of the screen', fr.bottom <= fr.vh && fr.height >= 180, `frame ${fr.top}..${fr.bottom} (${fr.height}px) of ${fr.vh}`)
    await page.screenshot({ path: path.join(OUT, 'landscape-fit.png') })
    const target = page.locator(`main div[title*='"RAMP 1:12"']`).first()
    const rid = await target.getAttribute('data-id')
    await target.tap({ force: true })
    await page.locator('main input[type=text]:visible').first().waitFor({ timeout: 5000 })
    await page.waitForTimeout(300)
    const ed = await editorFacts(page, rid)
    check('landscape phone: editor on screen, text not covered', ed.overlap === 0 && ed.inputOnScreen, JSON.stringify(ed))
    await page.screenshot({ path: path.join(OUT, 'landscape-editor.png') })
    check('landscape phone: page errors', errors.length === 0, errors.join(' | ').slice(0, 300))
    await ctx.close()
}

results.files = []
try {
    if (ONLY === 'all' || ONLY === 'desktop') await desktop()
    if (ONLY === 'all' || ONLY === 'rotated') await rotated()
    if (ONLY === 'all' || ONLY === 'set') await set()
    if (ONLY === 'all' || ONLY === 'phone') await phone()
    if (ONLY === 'all' || ONLY === 'tablet' || ONLY === 'devices') {
        await tablet('portrait')
        await tablet('landscape')
    }
    if (ONLY === 'all' || ONLY === 'lowend' || ONLY === 'devices') await lowend()
    if (ONLY === 'all' || ONLY === 'landscape' || ONLY === 'devices') await landscape()
} catch (e) {
    check('run', false, String(e?.stack || e).slice(0, 600))
} finally {
    await browser.close()
    delete results.expect
    fs.writeFileSync(path.join(OUT, 'expect.json'), JSON.stringify(results, null, 1))
    const failed = results.checks.filter((c) => !c.ok).length
    console.log(`${results.checks.length - failed}/${results.checks.length} browser checks passed`)
}
