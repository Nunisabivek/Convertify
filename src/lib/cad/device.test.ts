import assert from 'node:assert/strict'
import { IOS_CANVAS_LIMIT, TIERS, decideTier, pagesToKeep, tierOverride, tierProfile, type DeviceSignals } from './device.ts'
import { budgetScale } from './viewport.ts'

const base: DeviceSignals = { screenW: 1920, screenH: 1080, devicePixelRatio: 1, touch: false, coarse: false }

// Desktop, including touch laptops (fine primary pointer).
assert.equal(decideTier(base), 'desktop')
assert.equal(decideTier({ ...base, touch: true, memoryGb: 8, cores: 8 }), 'desktop')
// Low-end: ≤ 2 GB or ≤ 2 cores, whatever the screen.
assert.equal(decideTier({ ...base, memoryGb: 2 }), 'low')
assert.equal(decideTier({ ...base, cores: 2 }), 'low')
assert.equal(decideTier({ screenW: 360, screenH: 740, devicePixelRatio: 2, touch: true, coarse: true, memoryGb: 1, cores: 8 }), 'low')
// Phones: touch-first and a short side under 600 CSS px, either orientation.
assert.equal(decideTier({ screenW: 390, screenH: 844, devicePixelRatio: 3, touch: true, coarse: true, cores: 6 }), 'phone')
assert.equal(decideTier({ screenW: 844, screenH: 390, devicePixelRatio: 3, touch: true, coarse: true }), 'phone')
assert.equal(decideTier({ screenW: 390, screenH: 844, devicePixelRatio: 3, touch: true, coarse: false, memoryGb: 4 }), 'phone')
// Tablets: iPad portrait and landscape (Safari gives no deviceMemory).
assert.equal(decideTier({ screenW: 820, screenH: 1180, devicePixelRatio: 2, touch: true, coarse: true, cores: 8 }), 'tablet')
assert.equal(decideTier({ screenW: 1180, screenH: 820, devicePixelRatio: 2, touch: true, coarse: true }), 'tablet')
// Unknown values (0 / undefined) don't make a device "low".
assert.equal(decideTier({ ...base, memoryGb: 0, cores: 0 }), 'desktop')

// Budgets: 4 / 8 / 12 / 16 MP, all under the iOS canvas limit.
assert.deepEqual(TIERS.map((t) => tierProfile(t).budget), [4e6, 8e6, 12e6, 16e6])
for (const t of TIERS) assert.ok(tierProfile(t, 3).budget < IOS_CANVAS_LIMIT)
// HiDPI raises the scale cap for small sheets, never above the budget.
assert.equal(tierProfile('desktop', 1).maxScale, 2)
assert.equal(tierProfile('desktop', 2).maxScale, 3)
assert.equal(tierProfile('phone', 3).maxScale, 4)
assert.equal(tierProfile('low', 3).maxScale, 2)
const a4: [number, number] = [595, 842]
const a0: [number, number] = [3370, 2384]
for (const t of TIERS)
    for (const dpr of [1, 2, 3]) {
        const p = tierProfile(t, dpr)
        for (const [w, h] of [a4, a0]) {
            const s = budgetScale(w, h, p.budget, p.maxScale)
            assert.ok(Math.floor(w * s) * Math.floor(h * s) <= p.budget, `${t} dpr ${dpr} ${w}x${h}`)
        }
    }
// A4 on a 3x phone renders sharper than at 2x; A0 still fills exactly the budget.
assert.ok(budgetScale(...a4, tierProfile('phone', 3).budget, tierProfile('phone', 3).maxScale) > 2)
assert.ok(Math.abs(a0[0] * a0[1] * budgetScale(...a0, 8e6, tierProfile('phone', 3).maxScale) ** 2 - 8e6) < 1)

// Test override from the query string or localStorage.
assert.equal(tierOverride('?cadTier=low', null), 'low')
assert.equal(tierOverride('?x=1&cadTier=TABLET', null), 'tablet')
assert.equal(tierOverride('', 'phone'), 'phone')
assert.equal(tierOverride('?cadTier=bogus', 'desktop'), 'desktop')
assert.equal(tierOverride('', null), null)

// Cache: current page always, then nearest neighbours within the megapixel cap.
const sizes = new Map([
    [1, 16],
    [2, 4],
    [3, 16],
    [4, 4],
    [5, 1],
])
assert.deepEqual([...pagesToKeep(sizes, 3, 1, 48)].sort(), [2, 3, 4])
assert.deepEqual([...pagesToKeep(sizes, 3, 1, 22)].sort(), [2, 3])
assert.deepEqual([...pagesToKeep(sizes, 3, 1, 6)].sort(), [3])
assert.deepEqual([...pagesToKeep(sizes, 1, 1, 48)].sort(), [1, 2])
// A page without an image yet keeps only neighbours that fit.
assert.deepEqual([...pagesToKeep(new Map([[2, 4], [4, 16]]), 3, 1, 18)].sort(), [2])

console.log('device tests passed')
