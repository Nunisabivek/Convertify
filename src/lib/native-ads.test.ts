import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { shouldOfferInterstitial, type InterstitialGate } from './interstitial-gate.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const adsSrc = readFileSync(join(root, 'src/lib/native-ads.ts'), 'utf8')
const stringsSrc = readFileSync(join(root, 'android/app/src/main/res/values/strings.xml'), 'utf8')
const SAMPLE_PUBLISHER = '3940256099942544'

assert.match(stringsSrc, /ca-app-pub-4814181825408625~1021995058/)
assert.match(adsSrc, /ca-app-pub-4814181825408625\/7919857158/)
assert.match(adsSrc, /ca-app-pub-4814181825408625\/4065381782/)
assert.equal(adsSrc.includes(SAMPLE_PUBLISHER), false)
assert.equal(stringsSrc.includes(SAMPLE_PUBLISHER), false)
assert.match(adsSrc, /initializeForTesting:\s*false/)
assert.match(adsSrc, /isTesting:\s*false/)
assert.equal((adsSrc.match(/isTesting:\s*false/g) || []).length >= 2, true)

const empty: InterstitialGate = { conversions: 0, lastShownAt: 0, conversionsAtLastShow: 0 }

assert.equal(shouldOfferInterstitial(empty), false)
assert.equal(shouldOfferInterstitial({ ...empty, conversions: 1 }), false)
assert.equal(shouldOfferInterstitial({ ...empty, conversions: 2 }), false)
assert.equal(shouldOfferInterstitial({ ...empty, conversions: 3 }), true)

const shownAt = 1_000_000
const afterShow: InterstitialGate = {
    conversions: 3,
    lastShownAt: shownAt,
    conversionsAtLastShow: 3,
}
assert.equal(shouldOfferInterstitial({ ...afterShow, conversions: 5 }, shownAt + 10 * 60 * 1000), false)
assert.equal(shouldOfferInterstitial({ ...afterShow, conversions: 6 }, shownAt + 60 * 1000), false)
assert.equal(shouldOfferInterstitial({ ...afterShow, conversions: 6 }, shownAt + 3 * 60 * 1000), true)

assert.match(adsSrc, /export function holdNativeAds/)
assert.match(adsSrc, /export function flushQueuedInterstitial/)
assert.match(adsSrc, /interstitialQueued/)
console.log('interstitial-gate tests passed')
