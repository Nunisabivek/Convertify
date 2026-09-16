import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')

const titleSrc = readFileSync(join(root, 'src/lib/document-title.ts'), 'utf8')
assert.match(titleSrc, /export const MOBILE_HOME_TITLE = 'Convertify'/)
assert.match(titleSrc, /export const MOBILE_TOOLS_TITLE = 'All tools'/)
assert.match(titleSrc, /IS_MOBILE_BUILD \? mobileTitle : webTitle/)
assert.match(titleSrc, /ANDROID_SHORT_NAMES/)
assert.equal(titleSrc.includes('Free Online PDF Tools'), false)
assert.equal(titleSrc.includes('No Pricing'), false)

const layoutSrc = readFileSync(join(root, 'src/app/layout.tsx'), 'utf8')
assert.match(layoutSrc, /IS_MOBILE_BUILD \? "Convertify" : "Convertify — Free Online PDF Tools/)

const homeSrc = readFileSync(join(root, 'src/app/page.tsx'), 'utf8')
assert.match(homeSrc, /appDocumentTitle\('Convertify — Free Online PDF Tools, No Upload', MOBILE_HOME_TITLE\)/)

const toolsSrc = readFileSync(join(root, 'src/app/all-tools/page.tsx'), 'utf8')
assert.match(toolsSrc, /appDocumentTitle\("All Free PDF Tools \| Convertify - No Pricing, No Download, 100% Free", MOBILE_TOOLS_TITLE\)/)

const css = readFileSync(join(root, 'src/styles/mobile.css'), 'utf8')
assert.match(css, /--chrome-bottom:\s*calc\(var\(--nav-h\) \+ var\(--inset-bottom\) \+ var\(--ad-banner-h\)\)/)
assert.match(css, /\.mobile-route-page[\s\S]{0,400}padding-bottom:\s*calc\(var\(--chrome-bottom\)/)
assert.match(css, /\.mobile-app \.mobile-job:has\(\.mobile-job-cta\)[\s\S]{0,280}padding-bottom:\s*calc\(110px \+ var\(--chrome-bottom\)\)/)

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
    scripts: Record<string, string>
    devDependencies: Record<string, string>
}
assert.ok(pkg.devDependencies['cross-env'])
assert.match(pkg.scripts['dev:mobile'], /^cross-env NEXT_PUBLIC_MOBILE_BUILD=true /)
assert.match(pkg.scripts['build:mobile'], /^cross-env NEXT_PUBLIC_MOBILE_BUILD=true /)

const buildSrc = readFileSync(join(root, 'scripts/build-mobile.mjs'), 'utf8')
assert.match(buildSrc, /process\.env\.NEXT_PUBLIC_MOBILE_BUILD\s*=\s*'true'/)

const adsSrc = readFileSync(join(root, 'src/lib/native-ads.ts'), 'utf8')
assert.match(adsSrc, /ca-app-pub-4814181825408625\/7919857158/)
assert.match(adsSrc, /ca-app-pub-4814181825408625\/4065381782/)
assert.equal(adsSrc.includes('ca-app-pub-3940256099942544'), false)

console.log('document-title tests passed')
