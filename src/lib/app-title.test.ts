import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const src = readFileSync(join(root, 'src/lib/app-title.ts'), 'utf8')
const names = readFileSync(join(root, 'src/lib/mobile-tools.ts'), 'utf8')

assert.match(src, /mobile \? appTitle : webTitle/)
assert.match(src, /mobile = IS_MOBILE_BUILD/)
assert.match(src, /ANDROID_SHORT_NAMES\[toolId\] \?\? 'Convertify'/)
assert.match(names, /'passport-photo': 'Passport photo'/)
assert.match(names, /'fit-to-size': 'Fit to size'/)

function appChromeTitle(appTitle: string, webTitle: string, mobile: boolean): string {
    return mobile ? appTitle : webTitle
}

function appToolTitle(toolId: string, webTitle: string, mobile: boolean, map: Record<string, string>): string {
    if (!mobile) return webTitle
    return map[toolId] ?? 'Convertify'
}

const seoHome = 'Convertify — Free Online PDF Tools, No Upload'
const seoPassport = 'Passport Photo: US 2×2, 630×810 & Visa Sizes'
const seoTools = 'All Free PDF Tools | Convertify - No Pricing, No Download, 100% Free'
const short: Record<string, string> = {
    'passport-photo': 'Passport photo',
    'fit-to-size': 'Fit to size',
}

assert.equal(appChromeTitle('Convertify', seoHome, false), seoHome)
assert.equal(appChromeTitle('Convertify', seoHome, true), 'Convertify')
assert.equal(appChromeTitle('All tools', seoTools, true), 'All tools')
assert.equal(appToolTitle('passport-photo', seoPassport, false, short), seoPassport)
assert.equal(appToolTitle('passport-photo', seoPassport, true, short), 'Passport photo')
assert.equal(appToolTitle('fit-to-size', 'Fit Photo or PDF to 20–50KB or Any Exact Size', true, short), 'Fit to size')
assert.equal(appToolTitle('unknown-tool', seoHome, true, short), 'Convertify')

console.log('app-title tests passed')
