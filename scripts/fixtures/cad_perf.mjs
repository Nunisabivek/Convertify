// Performance numbers for the AutoCAD PDF editor (before/after comparisons).
//
//   node scripts/fixtures/cad_perf.mjs http://localhost:3320 scripts/fixtures/cad <out> <label> [desktop|low|all]
//
// For the A1 sheet and the A0 sheet (page 3 of cad-set.pdf, extracted on its own):
// time from choosing the file to the first page image shown and to analysis done,
// total main-thread long-task time in that window, and peak JS heap. Then walks the
// 6-sheet set and reports the peak heap and how many page images (object URLs) are
// still held. "desktop" is 1366x900 unthrottled; "low" is a 360x740 touch phone with
// ?cadTier=low and 6x CPU throttling. Writes <out>/perf-<label>.json and, for desktop,
// <out>/regions-<label>.json (every detected region, to prove detection is unchanged).
import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const BASE = process.argv[2] || 'http://localhost:3320'
const FX = process.argv[3]
const OUT = process.argv[4]
const LABEL = process.argv[5] || 'run'
const ONLY = process.argv[6] || 'all'
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
fs.mkdirSync(OUT, { recursive: true })

const a0 = path.join(OUT, 'cad-a0-only.pdf')
if (!fs.existsSync(a0))
    execFileSync('python', ['-c', 'import fitz,sys; s=fitz.open(sys.argv[1]); d=fitz.open(); d.insert_pdf(s, from_page=2, to_page=2); d.save(sys.argv[2])', path.join(FX, 'cad-set.pdf'), a0])

const notes = new Set()
const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--enable-precise-memory-info'] })

// Runs in the page before any script: records when a file is chosen, when a page image
// loads, when analysis is done, long tasks, and which object URLs are alive.
const INIT = () => {
    const w = window
    w.__perf = { t0: 0, shown: 0, done: 0, longtasks: [], loaf: [], urls: new Map() }
    document.addEventListener('change', (e) => {
        if (e.target && e.target.type === 'file') w.__perf.t0 = performance.now()
    }, true)
    const mark = () => {
        const s = document.querySelector('[data-testid=cad-stage]')
        if (!s) return
        const img = s.querySelector('img')
        // Newer builds show the rendered canvas first, then swap in the PNG.
        if (!w.__perf.shown && ((img && img.complete && img.naturalWidth > 0) || s.querySelector('canvas'))) w.__perf.shown = performance.now()
        // Older builds analyse before showing anything (no data-analyzed attribute).
        if (!w.__perf.done && (s.dataset.analyzed === undefined || s.dataset.analyzed === 'true') && w.__perf.shown) w.__perf.done = performance.now()
    }
    document.addEventListener('load', mark, true)
    new MutationObserver(mark).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-analyzed', 'src'] })
    try {
        new PerformanceObserver((l) => l.getEntries().forEach((e) => w.__perf.longtasks.push([e.startTime, e.duration]))).observe({ type: 'longtask', buffered: true })
    } catch {}
    // Long animation frames name the scripts behind the long tasks (Chrome 123+).
    try {
        new PerformanceObserver((l) =>
            l.getEntries().forEach((e) =>
                w.__perf.loaf.push([
                    e.startTime,
                    e.duration,
                    Math.round(e.renderStart ? e.renderStart - e.startTime : e.duration),
                    (e.scripts || []).map((sc) => `${sc.invoker}${sc.sourceFunctionName ? ' ' + sc.sourceFunctionName : ''} ${Math.round(sc.duration)}ms`).join('; '),
                ]),
            ),
        ).observe({ type: 'long-animation-frame', buffered: true })
    } catch {}
    const create = URL.createObjectURL.bind(URL)
    const revoke = URL.revokeObjectURL.bind(URL)
    URL.createObjectURL = (o) => {
        const u = create(o)
        if (o && o.type && o.type.startsWith('image/')) w.__perf.urls.set(u, o.size)
        return u
    }
    URL.revokeObjectURL = (u) => {
        w.__perf.urls.delete(u)
        revoke(u)
    }
}

async function session(kind) {
    const low = kind === 'low'
    const ctx = await browser.newContext(
        low
            ? { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 11; Low) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36' }
            : { viewport: { width: 1366, height: 900 } },
    )
    await ctx.addInitScript(INIT)
    const page = await ctx.newPage()
    page.on('console', (m) => /AutoCAD editor|worker/i.test(m.text()) && notes.add(m.text().slice(0, 160)))
    page.on('pageerror', (e) => notes.add('pageerror: ' + String(e).slice(0, 160)))
    page.on('worker', (w) => notes.add('worker: ' + w.url().split('/').pop()))
    const cdp = await ctx.newCDPSession(page)
    await cdp.send('Performance.enable')
    if (low) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 })
    // Heap sampled from outside the page (answers even during long JS tasks).
    let peak = 0
    let peakAll = 0
    let polling = true
    const poll = (async () => {
        while (polling) {
            try {
                const h = await cdp.send('Runtime.getHeapUsage')
                peak = Math.max(peak, h.usedSize)
                peakAll = Math.max(peakAll, h.usedSize + (h.backingStorageSize || 0))
            } catch {}
            await new Promise((r) => setTimeout(r, 100))
        }
    })()
    const stop = async () => {
        polling = false
        await poll
    }
    const resetPeak = () => {
        peak = 0
        peakAll = 0
    }
    const url = BASE + '/autocad-pdf-editor' + (low ? '?cadTier=low' : '')
    return { ctx, page, cdp, url, stop, resetPeak, peaks: () => ({ heapMB: +(peak / 1e6).toFixed(1), heapWithBuffersMB: +(peakAll / 1e6).toFixed(1) }) }
}

const waitDone = (page) => page.waitForFunction(() => window.__perf.done > 0, null, { timeout: 600000, polling: 100 })
const collect = (page) =>
    page.evaluate(() => {
        const p = window.__perf
        const lt = p.longtasks.filter(([s]) => s >= p.t0 - 1 && s <= p.done)
        return {
            shownMs: Math.round(p.shown - p.t0),
            doneMs: Math.round(p.done - p.t0),
            longTaskMs: Math.round(lt.reduce((a, [, d]) => a + d, 0)),
            longTasks: lt.length,
            maxLongTaskMs: Math.round(Math.max(0, ...lt.map(([, d]) => d))),
            frames: p.loaf.filter(([s, d]) => s >= p.t0 - 1 && s <= p.done && d > 100).map(([s, d, js, sc]) => `${Math.round(s - p.t0)}+${Math.round(d)}ms (script ${js}ms) ${sc}`.slice(0, 220)),
            imageMP: (() => {
                const i = document.querySelector('[data-testid=cad-stage] img')
                return i ? +((i.naturalWidth * i.naturalHeight) / 1e6).toFixed(2) : 0
            })(),
        }
    })

const RUNS = +(process.env.RUNS || 3)
async function timeOne(kind, file) {
    const runs = []
    for (let i = 0; i < RUNS; i++) runs.push(await timeOnce(kind, file))
    const med = (k) => [...runs].map((r) => r[k]).sort((a, b) => a - b)[Math.floor(runs.length / 2)]
    const out = {}
    for (const k of Object.keys(runs[0])) out[k] = typeof runs[0][k] === 'number' ? med(k) : runs[0][k]
    out.runs = runs.map((r) => `${r.shownMs}/${r.doneMs}/${r.longTaskMs}`).join(' ')
    return out
}
async function timeOnce(kind, file) {
    const s = await session(kind)
    await s.page.goto(s.url, { waitUntil: 'load' })
    await s.page.waitForTimeout(1500)
    s.resetPeak()
    await s.page.locator('input[type=file]').first().setInputFiles(file)
    await waitDone(s.page)
    await s.page.waitForTimeout(300)
    const r = { ...(await collect(s.page)), ...s.peaks() }
    await s.stop()
    await s.ctx.close()
    return r
}

const regionDump = (page) =>
    page.evaluate(() => {
        const st = document.querySelector('[data-testid=cad-stage]')
        const z = +st.dataset.zoom
        return [...st.querySelectorAll('[data-region]')]
            .map((el) => ({
                id: el.dataset.id,
                kind: el.dataset.region,
                title: el.title,
                x: parseFloat(el.style.left) / z,
                y: parseFloat(el.style.top) / z,
                w: parseFloat(el.style.width) / z,
                h: parseFloat(el.style.height) / z,
                t: el.style.transform,
                color: el.style.color,
            }))
            .sort((a, b) => (a.id < b.id ? -1 : 1))
    })

async function walkSet(kind, dumpRegions) {
    const s = await session(kind)
    await s.page.goto(s.url, { waitUntil: 'load' })
    await s.page.waitForTimeout(1500)
    s.resetPeak()
    const t0 = Date.now()
    await s.page.locator('input[type=file]').first().setInputFiles(path.join(FX, 'cad-set.pdf'))
    await waitDone(s.page)
    const regions = {}
    const analysed = async (n) => {
        await s.page.waitForFunction(
            (n) => {
                const st = document.querySelector('[data-testid=cad-stage]')
                const img = st?.querySelector('img')
                return img?.alt === `Page ${n}` && img.complete && img.naturalWidth > 0 && st.dataset.analyzed !== 'false'
            },
            n,
            { timeout: 600000, polling: 100 },
        )
        await s.page.waitForTimeout(200)
        if (dumpRegions) regions[`cad-set.pdf p${n}`] = await regionDump(s.page)
    }
    await analysed(1)
    for (let n = 2; n <= 6; n++) {
        await s.page.locator('main button[title="Next page"]').click()
        await analysed(n)
    }
    const walkMs = Date.now() - t0
    const held = await s.page.evaluate(async () => {
        const urls = [...window.__perf.urls.keys()]
        let mp = 0
        for (const u of urls) {
            const im = new Image()
            im.src = u
            await im.decode().catch(() => {})
            mp += (im.naturalWidth * im.naturalHeight) / 1e6
        }
        const sizes = [...window.__perf.urls.values()]
        return { images: sizes.length, MB: +(sizes.reduce((a, b) => a + b, 0) / 1e6).toFixed(1), MP: +mp.toFixed(1) }
    })
    const r = { walkMs, heldImages: held.images, heldImageMP: held.MP, heldImageMB: held.MB, ...s.peaks() }
    await s.stop()
    await s.ctx.close()
    return { r, regions }
}

async function dumpSingle(file) {
    const s = await session('desktop')
    await s.page.goto(s.url, { waitUntil: 'load' })
    await s.page.locator('input[type=file]').first().setInputFiles(path.join(FX, file))
    await waitDone(s.page)
    await s.page.waitForTimeout(300)
    const d = await regionDump(s.page)
    await s.stop()
    await s.ctx.close()
    return d
}

const out = { label: LABEL, base: BASE, when: new Date().toISOString() }
for (const kind of ['desktop', 'low']) {
    if (ONLY !== 'all' && ONLY !== kind) continue
    out[kind] = {
        a1: await timeOne(kind, path.join(FX, 'cad-a1-mixed.pdf')),
        a0: await timeOne(kind, a0),
    }
    const { r, regions } = await walkSet(kind, kind === 'desktop')
    out[kind].set = r
    if (kind === 'desktop') {
        regions['cad-a1-mixed.pdf p1'] = await dumpSingle('cad-a1-mixed.pdf')
        regions['cad-rotate90.pdf p1'] = await dumpSingle('cad-rotate90.pdf')
        fs.writeFileSync(path.join(OUT, `regions-${LABEL}.json`), JSON.stringify(regions, null, 1))
    }
    console.log(kind, JSON.stringify(out[kind]))
}
await browser.close()
out.notes = [...notes]
console.log('notes', out.notes)
fs.writeFileSync(path.join(OUT, `perf-${LABEL}.json`), JSON.stringify(out, null, 1))
