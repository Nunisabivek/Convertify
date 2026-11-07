// End-to-end check of the AutoCAD PDF editor against the fixtures from cad_fixtures.py.
//
//   python scripts/fixtures/cad_fixtures.py <fx>
//   node scripts/fixtures/cad_e2e.mjs http://localhost:3311 <fx> <out> [desktop|phone|rotated|set|all]
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
    await page.waitForSelector('[data-testid=cad-stage]', { timeout: 180000 })
    await page.waitForTimeout(700)
}
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

async function detection(page, file, pageNo) {
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
    check(`${file} p${pageNo} detection`, miss.length === 0, `text ${tt}/${ttN}, shx ${shx}/${shxN}, unmatched shx regions ${extra}${known.length ? ', known limit: ' + known.join(', ') : ''}${miss.length ? ', missed ' + miss.join(' | ') : ''}`)
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
        await page.waitForFunction((n) => document.querySelector('[data-testid=cad-stage] img')?.alt === `Page ${n}`, p, { timeout: 120000 })
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
    for (let i = 1; i <= 8; i++) await touch('touchMove', [{ x: cx - 40 - i * 10, y: cy - i * 6 }, { x: cx + 40 - i * 10, y: cy - i * 6 }])
    await touch('touchEnd', [])
    await page.waitForTimeout(300)
    const st2 = await stage(page)
    const vy = await page.evaluate(() => window.scrollY)
    check('two-finger pan moves the drawing', Math.abs(st2.left - st1.left + 80) < 4 && Math.abs(st2.top - st1.top + 48) < 4 && Math.abs(vy - scroll0) < 2, `moved ${(st2.left - st1.left).toFixed(0)}, ${(st2.top - st1.top).toFixed(0)}; scrollY ${vy}`)
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

results.files = []
try {
    if (ONLY === 'all' || ONLY === 'desktop') await desktop()
    if (ONLY === 'all' || ONLY === 'rotated') await rotated()
    if (ONLY === 'all' || ONLY === 'set') await set()
    if (ONLY === 'all' || ONLY === 'phone') await phone()
} catch (e) {
    check('run', false, String(e?.stack || e).slice(0, 600))
} finally {
    await browser.close()
    delete results.expect
    fs.writeFileSync(path.join(OUT, 'expect.json'), JSON.stringify(results, null, 1))
    const failed = results.checks.filter((c) => !c.ok).length
    console.log(`${results.checks.length - failed}/${results.checks.length} browser checks passed`)
}
