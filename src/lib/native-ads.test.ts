import assert from 'node:assert/strict'
import { shouldOfferInterstitial, type InterstitialGate } from './interstitial-gate.ts'

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

console.log('interstitial-gate tests passed')
