import assert from 'node:assert/strict'
import { shouldAskReview, REVIEW_GAP_MS, REVIEW_MAX_ASKS } from './review-prompt.ts'

const now = 1_800_000_000_000
// Not before the third finished job.
assert.equal(shouldAskReview({ wins: 2, lastAsk: 0, asks: 0 }, now, false), false)
assert.equal(shouldAskReview({ wins: 3, lastAsk: 0, asks: 0 }, now, false), true)
// Never right after a full-screen ad.
assert.equal(shouldAskReview({ wins: 9, lastAsk: 0, asks: 0 }, now, true), false)
// At most every 30 days.
assert.equal(shouldAskReview({ wins: 9, lastAsk: now - REVIEW_GAP_MS + 1000, asks: 1 }, now, false), false)
assert.equal(shouldAskReview({ wins: 9, lastAsk: now - REVIEW_GAP_MS - 1000, asks: 1 }, now, false), true)
// Stops after a few asks for good.
assert.equal(shouldAskReview({ wins: 50, lastAsk: 0, asks: REVIEW_MAX_ASKS }, now, false), false)

console.log('review prompt tests passed')
