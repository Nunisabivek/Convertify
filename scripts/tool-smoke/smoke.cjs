// End-to-end smoke test: run every tool on a deployed site with real files, in a real browser.
//
//   npm run test:tools                       (fixtures -> smoke -> content check, against production)
//   node scripts/tool-smoke/smoke.cjs [baseUrl] [tool,tool#variant,...]
//
// Files live in $SMOKE_DIR (default: <os tmp>/convertify-smoke): fx/ inputs (fixtures.py), out/ downloads,
// shots/ screenshots of failures, smoke.json report (read by check.py). Browser: $CHROME_PATH, else the
// installed Google Chrome, headless. Ads and analytics are blocked so third-party scripts can't flake a run.
// Why this exists: reading client.tsx missed a worker 404 that broke 15 tools in production and a
// Permissions-Policy header that blocked the camera scanner. Only running the tools catches those.
const { chromium } = require('playwright-core')
const fs = require('fs')
const os = require('os')
const path = require('path')

const DIR = process.env.SMOKE_DIR || path.join(os.tmpdir(), 'convertify-smoke')
const FX = path.join(DIR, 'fx')
const OUT = path.join(DIR, 'out')
const SHOTS = path.join(DIR, 'shots')
const BASE = process.argv[2] || 'https://convertify.work'
const ONLY = process.argv[3] ? process.argv[3].split(',') : null

// [tool or tool#variant, input files, accepted output kinds]
const T = [
  ['merge-pdf', ['text.pdf', 'scan.pdf'], ['pdf']],
  ['merge-pdf#locked', ['locked.pdf', 'text.pdf'], ['pdf']],
  ['split-pdf', ['text.pdf'], ['pdf', 'zip']],
  ['split-pdf#locked', ['locked.pdf'], ['pdf', 'zip']],
  ['compress-pdf', ['scan.pdf'], ['pdf']],
  ['pdf-to-word', ['text.pdf'], ['zip']],
  ['word-to-pdf', ['letter.docx'], ['pdf']],
  ['pdf-to-jpg', ['text.pdf'], ['jpg', 'zip']],
  ['jpg-to-pdf', ['photo.jpg'], ['pdf']],
  ['jpg-to-pdf#exif', ['rotated6.jpg'], ['pdf']],
  ['pdf-to-png', ['text.pdf'], ['png', 'zip']],
  ['png-to-pdf', ['alpha.png', 'page2.png'], ['pdf']],
  ['excel-to-pdf', ['sheet.xlsx'], ['pdf']],
  ['rotate-pdf', ['text.pdf'], ['pdf']],
  ['rotate-pdf#locked', ['locked.pdf'], ['pdf']],
  ['add-page-numbers', ['text.pdf'], ['pdf']],
  ['watermark-pdf', ['text.pdf'], ['pdf']],
  ['organize-pdf', ['text.pdf'], ['pdf']],
  ['pdf-to-text', ['text.pdf'], ['txt']],
  ['text-to-pdf', ['notes.txt'], ['pdf']],
  ['html-to-pdf', [], ['pdf']],
  ['markdown-to-pdf', ['readme.md'], ['text']],
  ['tiff-to-pdf', ['scan.tiff'], ['pdf']],
  ['autocad-pdf-editor', ['cad.pdf'], ['pdf']],
  ['sign-pdf', ['text.pdf'], ['pdf']],
  ['crop-pdf', ['text.pdf'], ['pdf']],
  ['redact-pdf', ['text.pdf'], ['pdf']],
  ['repair-pdf', ['text.pdf'], ['pdf']],
  ['pdf-to-excel', ['text.pdf'], ['zip']],
  ['delete-pdf-pages', ['text.pdf'], ['pdf']],
  ['reorder-pdf', ['text.pdf'], ['pdf']],
  ['unlock-pdf', ['locked.pdf'], ['pdf']],
  ['protect-pdf', ['text.pdf'], ['pdf']],
  ['edit-pdf', ['text.pdf'], ['pdf']],
  ['compare-pdf', [], ['txt', 'pdf']],
  ['pdf-to-powerpoint', ['text.pdf'], ['zip']],
  ['fit-to-size', ['photo.jpg'], ['jpg', 'pdf']],
  ['passport-photo', ['photo.jpg'], ['jpg', 'png']],
  ['remove-background', ['photo.jpg'], ['png', 'jpg']],
  ['image-compressor', ['alpha.png'], ['jpg', 'zip']],
  ['resize-image', ['photo.jpg'], ['jpg', 'zip']],
  ['heic-to-jpg', ['photo.heic'], ['jpg', 'zip']],
  ['jpg-to-png', ['photo.jpg'], ['png', 'zip']],
  ['png-to-jpg', ['alpha.png'], ['jpg', 'zip']],
  ['webp-converter', ['pic.webp'], ['webp', 'jpg', 'png', 'zip']],
  ['bmp-to-jpg', ['pic.bmp'], ['jpg', 'zip']],
  ['gif-to-png', ['anim.gif'], ['png', 'zip']],
  ['svg-to-png', ['logo.svg'], ['png', 'zip']],
  ['qr-code-generator', [], ['png']],
  ['csv-to-json', [], ['json', 'text']],
  ['json-to-csv', ['data.json'], ['csv', 'text']],
  ['xml-to-json', ['data.xml'], ['json', 'text']],
  ['base64', [], ['text']],
  ['ocr-pdf', ['photo.jpg'], ['pdf']],
]

const fsr = (f) => fs.readFileSync(path.join(FX, f), 'utf8')
const btn = (p, re) => p.locator('main button:visible:not([disabled]), main a:visible').filter({ hasText: re }).first()
// DOM click: sticky headers and overlays can't swallow it (a forced mouse click landed on the header).
const press = async (loc, timeout = 30000) => { await loc.waitFor({ state: 'attached', timeout }); await loc.evaluate((el) => el.click()) }
const thenDownload = async (p, wait = 4000) => {
  await p.waitForTimeout(wait)
  const d = btn(p, /download/i)
  if (await d.count()) await press(d)
}
const drag = async (p, sel) => {
  const box = await p.locator(sel).first().boundingBox()
  await p.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.3)
  await p.mouse.down()
  await p.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5, { steps: 8 })
  await p.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.4, { steps: 8 })
  await p.mouse.up()
}

// Tools that need more than "upload, click the main button". Each ends by triggering the download
// (or leaving a text result on the page). Tools without an entry use the generic ACTION click.
const STEPS = {
  'split-pdf': (p) => btn(p, /^Extract \d+ Pages?/).click(),
  'repair-pdf': (p) => btn(p, /Download Repaired/).click(),
  'pdf-to-excel': (p) => btn(p, /Download Excel/).click(),
  'passport-photo': (p) => btn(p, /^Make photo/).click(),
  'unlock-pdf': async (p) => { await p.fill('main input[type=password]', '1234'); await btn(p, /^Unlock PDF/).click(); await thenDownload(p) },
  'protect-pdf': async (p) => {
    const pw = p.locator('main input[type=password]')
    await pw.nth(0).fill('Secret123!'); await pw.nth(1).fill('Secret123!')
    await btn(p, /^Protect PDF/).click(); await thenDownload(p)
  },
  'sign-pdf': async (p) => {
    await drag(p, 'main canvas'); await p.waitForTimeout(500)
    await btn(p, /^Place Signature/).click(); await p.waitForTimeout(800)
    await btn(p, /^Save & Sign/).click(); await thenDownload(p)
  },
  'redact-pdf': async (p) => { await drag(p, 'main canvas'); await p.waitForTimeout(500); await btn(p, /^Apply Redactions/).click(); await thenDownload(p, 6000) },
  'autocad-pdf-editor': async (p) => {
    // A real edit: change a label, then export. check.py confirms the new text replaced the old.
    await p.locator('main div[title*="ROOM A-101"]').first().click({ force: true }); await p.waitForTimeout(800)
    const field = p.locator('main input[type=text]:visible, main textarea:visible').first()
    await field.fill('ROOM B-202'); await field.press('Enter'); await p.waitForTimeout(800)
    await press(btn(p, /Export PDF/))
  },
  'html-to-pdf': async (p) => { await p.fill('main textarea', fsr('page.html')); await btn(p, /^Convert to PDF/).click() },
  'csv-to-json': async (p) => { await p.fill('main textarea', fsr('data.csv')); await btn(p, /^Convert to JSON/).click() },
  'base64': async (p) => { await p.locator('main textarea').first().fill('hello convertify'); await btn(p, /^Encode to Base64/).click() },
  'qr-code-generator': async (p) => {
    await p.locator('main textarea:visible, main input[type=text]:visible, main input[type=url]:visible').first().fill('https://convertify.work')
    await p.waitForTimeout(1500); await btn(p, /save|download/i).click()
  },
  'compare-pdf': async (p) => {
    // The second upload slot replaces the first input, so fill "first" then "last".
    await p.locator('input[type=file]').first().setInputFiles(path.join(FX, 'text.pdf')); await p.waitForTimeout(1500)
    await p.locator('input[type=file]').last().setInputFiles(path.join(FX, 'scan.pdf')); await p.waitForTimeout(1500)
    await press(btn(p, /Compare Documents/))
    await press(btn(p, /Download Report/), 45000)
  },
  'markdown-to-pdf': async (p) => {
    // Saving goes through the print dialog (by design). Capture what the print frame would print.
    await p.evaluate(() => new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.tagName === 'IFRAME') setTimeout(() => { window.__printed = n.contentDocument?.body?.innerText || '' }, 300)
    }))).observe(document.body, { childList: true }))
    await btn(p, /^Download PDF/).click(); await p.waitForTimeout(1500)
    const printed = await p.evaluate(() => window.__printed || '')
    await p.evaluate((t) => { const pre = document.createElement('pre'); pre.textContent = t; document.querySelector('main').appendChild(pre) }, printed)
  },
}
const NO_UPLOAD = new Set(['html-to-pdf', 'csv-to-json', 'base64', 'compare-pdf', 'qr-code-generator'])
const ACTION = /^(convert|merge|split|compress|rotate|add|extract|crop|organize|delete|reorder|resize|remove background|generate|make|save|apply|fit|scan)/i

function kindOf(buf, name) {
  const h = buf.subarray(0, 8)
  if (h.toString('latin1', 0, 5) === '%PDF-') return 'pdf'
  if (h[0] === 0x89 && h.toString('latin1', 1, 4) === 'PNG') return 'png'
  if (h[0] === 0xff && h[1] === 0xd8) return 'jpg'
  if (h.toString('latin1', 0, 2) === 'PK') return 'zip'
  if (h.toString('latin1', 0, 4) === 'RIFF') return 'webp'
  const t = buf.toString('utf8', 0, 200).trim()
  if (/\.json$/i.test(name) || t.startsWith('[') || t.startsWith('{')) return 'json'
  if (/\.csv$/i.test(name)) return 'csv'
  return 'txt'
}

function browserPath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH
  const candidates = [
    path.join(process.env.PROGRAMFILES || 'C:/Program Files', 'Google/Chrome/Application/chrome.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
  ]
  return candidates.find((c) => fs.existsSync(c))
}

;(async () => {
  for (const d of [OUT, SHOTS]) fs.mkdirSync(d, { recursive: true })
  if (!fs.existsSync(FX)) throw new Error(`No fixtures in ${FX}. Run: python scripts/tool-smoke/fixtures.py`)
  const browser = await chromium.launch({ executablePath: browserPath(), headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, acceptDownloads: true })
  await ctx.route(/tonicgoverness|3nbf4|googletagmanager|google-analytics|googlesyndication|doubleclick/, (r) => r.abort())
  const report = {}
  for (const [id, files, expect] of T) {
    if (ONLY && !ONLY.includes(id)) continue
    const base = id.split('#')[0]
    const p = await ctx.newPage()
    const errs = []
    const r = { ok: false }
    p.on('pageerror', (e) => errs.push('pageerror: ' + String(e).slice(0, 160)))
    p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED|net::/.test(m.text())) errs.push('console: ' + m.text().slice(0, 160)) })
    // Password prompts (pdf-password.ts) get the fixtures' password; any other dialog is recorded.
    p.on('dialog', async (d) => {
      if (d.type() === 'prompt') { r.prompted = (r.prompted || 0) + 1; return d.accept('1234').catch(() => {}) }
      errs.push('dialog: ' + d.message().slice(0, 140)); await d.dismiss().catch(() => {})
    })
    const t0 = Date.now()
    try {
      await p.goto(`${BASE}/${base}`, { waitUntil: 'domcontentloaded', timeout: 45000 })
      await p.waitForTimeout(2500)
      if (!NO_UPLOAD.has(base)) await p.locator('input[type=file]').first().setInputFiles(files.map((f) => path.join(FX, f)), { timeout: 10000 })
      await p.waitForTimeout(2500)
      const dlPromise = p.waitForEvent('download', { timeout: 60000 }).catch(() => null)
      if (STEPS[base]) {
        r.clicked = 'steps'
        await STEPS[base](p).catch((e) => errs.push('steps: ' + String(e).split('\n')[0].slice(0, 140)))
      } else {
        const buttons = p.locator('main button:visible:not([disabled])')
        for (let i = 0, n = await buttons.count(); i < n; i++) {
          const t = ((await buttons.nth(i).innerText().catch(() => '')) || '').trim().replace(/\s+/g, ' ')
          if (ACTION.test(t) && !/swap|clear|reset|choose|select files|browse|add more|another/i.test(t)) {
            r.clicked = t.slice(0, 40)
            await buttons.nth(i).click({ timeout: 5000 }).catch((e) => errs.push('click: ' + String(e).slice(0, 80)))
            break
          }
        }
      }
      let dl = await Promise.race([dlPromise, p.waitForTimeout(20000).then(() => null)])
      if (!dl && !expect.includes('text')) {
        // Result screens that show a Download button instead of downloading straight away.
        const again = p.waitForEvent('download', { timeout: 30000 }).catch(() => null)
        const d = btn(p, /download|save/i)
        if (await d.count()) await press(d).catch(() => {})
        dl = await again
      }
      if (dl) {
        const name = dl.suggestedFilename()
        const dest = path.join(OUT, id.replace('#', '_') + '__' + name)
        await dl.saveAs(dest)
        const buf = fs.readFileSync(dest)
        Object.assign(r, { file: name, bytes: buf.length, kind: kindOf(buf, name) })
        r.ok = buf.length > 0 && expect.includes(r.kind)
        if (!r.ok) r.fail = `unexpected output: ${r.kind}`
      } else if (expect.includes('text')) {
        const out = await p.evaluate(() => [...document.querySelectorAll('main textarea, main pre, main code')].map((e) => e.value ?? e.innerText)).catch(() => [])
        const txt = out.filter((v) => !/^hello convertify$|^name,|Enter text|Output will appear/.test(v.trim())).join(' ').trim()
        r.text = txt.slice(0, 160)
        r.ok = txt.length > 10
        if (!r.ok) r.fail = 'no text output'
      } else r.fail = 'no download'
    } catch (e) {
      r.fail = String(e).split('\n')[0].slice(0, 200)
    }
    r.ms = Date.now() - t0
    r.errs = errs
    if (!r.ok) await p.screenshot({ path: path.join(SHOTS, id.replace('#', '_') + '.png') }).catch(() => {})
    report[id] = r
    console.log(`${r.ok ? 'PASS' : 'FAIL'} ${id.padEnd(22)} ${(r.kind || '').padEnd(4)} ${r.fail || ''}${errs.length ? '  errs: ' + errs.join(' | ').slice(0, 160) : ''}`)
    await p.close()
  }
  fs.writeFileSync(path.join(DIR, 'smoke.json'), JSON.stringify(report, null, 1))
  await browser.close()
  const failed = Object.entries(report).filter(([, r]) => !r.ok).map(([k]) => k)
  console.log(`\n${Object.keys(report).length - failed.length}/${Object.keys(report).length} passed${failed.length ? ' — failed: ' + failed.join(', ') : ''}`)
  process.exitCode = failed.length ? 1 : 0
})()
