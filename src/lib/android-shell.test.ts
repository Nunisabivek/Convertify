import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
    INTERSTITIAL_EVERY_N_CONVERSIONS,
    INTERSTITIAL_MIN_INTERVAL_MS,
} from './interstitial-gate.ts'

const ANDROID_V1_TOOL_IDS = [
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
] as const

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const css = readFileSync(join(root, 'src/styles/mobile.css'), 'utf8')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
    scripts: Record<string, string>
    devDependencies: Record<string, string>
}
const ads = readFileSync(join(root, 'src/lib/native-ads.ts'), 'utf8')
const strings = readFileSync(join(root, 'android/app/src/main/res/values/strings.xml'), 'utf8')
const layout = readFileSync(join(root, 'src/components/mobile/MobileLayout.tsx'), 'utf8')

assert.match(css, /--ad-banner-h:\s*50px/)
assert.match(css, /--chrome-bottom:\s*calc\(var\(--nav-h\) \+ var\(--ad-banner-h\) \+ var\(--inset-bottom\)\)/)
assert.match(css, /\.mobile-content::after/)
assert.match(css, /height:\s*calc\(var\(--chrome-bottom\) \+ 80px\)/)

assert.ok(pkg.devDependencies['cross-env'])
assert.match(pkg.scripts['dev:mobile'], /^cross-env NEXT_PUBLIC_MOBILE_BUILD=true /)
assert.match(pkg.scripts['build:mobile'], /^cross-env NEXT_PUBLIC_MOBILE_BUILD=true /)
assert.equal(pkg.scripts.mobile, 'npm run build:mobile && npm run cap:sync')

assert.match(strings, /ca-app-pub-4814181825408625~1021995058/)
assert.match(ads, /ca-app-pub-4814181825408625\/7919857158/)
assert.match(ads, /ca-app-pub-4814181825408625\/4065381782/)
assert.match(ads, /localStorage\.getItem\(STATE_KEY\)/)
assert.match(ads, /convertify:admob-interstitial/)
assert.equal(INTERSTITIAL_EVERY_N_CONVERSIONS, 3)
assert.equal(INTERSTITIAL_MIN_INTERVAL_MS, 3 * 60 * 1000)

assert.match(layout, /document\.title = heading/)

const chromePages: Array<[string, string]> = [
    ['src/app/page.tsx', "appChromeTitle('Convertify'"],
    ['src/app/all-tools/page.tsx', "appChromeTitle('All tools'"],
    ['src/app/about/page.tsx', "appChromeTitle('About'"],
    ['src/app/privacy/page.tsx', "appChromeTitle('Privacy'"],
]
for (const [rel, needle] of chromePages) {
    const src = readFileSync(join(root, rel), 'utf8')
    assert.ok(src.includes(needle), `${rel} missing ${needle}`)
    const titleLine = src.split('\n').find((line) => /^\s+title: appChromeTitle/.test(line))
    assert.ok(titleLine, `${rel} missing metadata title`)
    assert.equal(titleLine.includes('), '), false, `${rel} has a broken quoted title: ${titleLine}`)
}

for (const id of ANDROID_V1_TOOL_IDS) {
    const src = readFileSync(join(root, `src/app/${id}/page.tsx`), 'utf8')
    assert.ok(src.includes(`appToolTitle('${id}'`), `${id} metadata title not wired`)
}

console.log('android-shell tests passed')
