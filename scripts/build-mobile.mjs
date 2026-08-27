import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tmp = join(root, '.mobile-build-stash')

const KEEP_ROUTES = new Set([
  'index.html',
  'index.txt',
  '404.html',
  'all-tools.html',
  'all-tools.txt',
  'about.html',
  'about.txt',
  'privacy.html',
  'privacy.txt',
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
  'convert-worker.js',
  '_next',
  'pdf.worker.min.mjs',
  'file.svg',
  'vercel.svg',
  'window.svg',
])

function stash(rel) {
  const from = join(root, rel)
  if (!existsSync(from)) return null
  mkdirSync(tmp, { recursive: true })
  const to = join(tmp, rel.replaceAll('/', '__'))
  try {
    renameSync(from, to)
  } catch {
    cpSync(from, to, { recursive: true })
    rmSync(from, { recursive: true, force: true })
  }
  return { from, to }
}

function restore(entry) {
  if (!entry) return
  if (existsSync(entry.from)) rmSync(entry.from, { recursive: true, force: true })
  try {
    renameSync(entry.to, entry.from)
  } catch {
    cpSync(entry.to, entry.from, { recursive: true })
    rmSync(entry.to, { recursive: true, force: true })
  }
}

function copyWorker() {
  const publicDir = join(root, 'public')
  mkdirSync(publicDir, { recursive: true })
  const candidates = [
    join(root, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs'),
    join(root, 'node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs'),
  ]
  const src = candidates.find((p) => existsSync(p))
  if (!src) {
    console.warn('pdf.js worker not found; PDF tools may fail offline')
    return
  }
  copyFileSync(src, join(publicDir, 'pdf.worker.min.mjs'))
}

function mirrorHtml(outDir) {
  // Capacitor's local server is picky about trailing slashes.
  // Ensure both /tool and /tool/ resolve to the exported page.
  for (const name of readdirSync(outDir)) {
    if (!name.endsWith('.html') || name === 'index.html' || name === '404.html') continue
    const slug = name.slice(0, -5)
    const html = join(outDir, name)
    const dir = join(outDir, slug)
    mkdirSync(dir, { recursive: true })
    copyFileSync(html, join(dir, 'index.html'))
    const txt = join(outDir, `${slug}.txt`)
    if (existsSync(txt)) copyFileSync(txt, join(dir, 'index.txt'))
  }
}

function pruneOut(outDir) {
  for (const name of readdirSync(outDir)) {
    if (KEEP_ROUTES.has(name)) continue
    if (name.startsWith('_')) continue
    const keepPrefix = [...KEEP_ROUTES].some((keep) => name === keep || name.startsWith(`${keep}.`))
    if (keepPrefix) continue
    rmSync(join(outDir, name), { recursive: true, force: true })
  }
}

function run(cmd, args) {
  const resolved = process.platform === 'win32' && cmd === 'npx' ? 'npx.cmd' : cmd
  const result = spawnSync(resolved, args, { cwd: root, stdio: 'inherit', env: process.env, shell: process.platform === 'win32' })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

mkdirSync(tmp, { recursive: true })
const stashed = [stash('src/middleware.ts'), stash('src/app/api')]

try {
  copyWorker()
  run('npx', ['next', 'build'])
  const outDir = join(root, 'out')
  if (existsSync(outDir)) {
    pruneOut(outDir)
    mirrorHtml(outDir)
  }
} finally {
  stashed.forEach(restore)
  rmSync(tmp, { recursive: true, force: true })
}
