import assert from 'node:assert/strict'
import { UNITS, anchorAllowed, anchorSize, bannerFrameUrl, normalizeSrc, wideSize, type AdsterraUnit, type BannerSize } from './adsterra.ts'

const unit: AdsterraUnit = { key: 'a1b2c3d4e5f60718293a4b5c6d7e8f90', src: '//tonicgoverness.com/a1b2c3d4e5f60718293a4b5c6d7e8f90/invoke.js' }
const all: Record<BannerSize, AdsterraUnit | null> = { rectangle: unit, leaderboard: unit, mobile: unit, skyscraper: unit }
const none: Record<BannerSize, AdsterraUnit | null> = { rectangle: null, leaderboard: null, mobile: null, skyscraper: null }

// Dashboard codes use protocol-relative URLs; only https .js URLs are accepted.
assert.equal(normalizeSrc(unit.src), 'https://tonicgoverness.com/a1b2c3d4e5f60718293a4b5c6d7e8f90/invoke.js')
assert.equal(normalizeSrc('http://example.com/x/invoke.js'), null)
assert.equal(normalizeSrc('javascript:alert(1)'), null)
assert.equal(normalizeSrc('https://example.com/page.html'), null)
assert.equal(normalizeSrc('not a url'), null)

// Each banner loads from the separate ad origin, never the site's own (the ad can't reach the page).
assert.equal(bannerFrameUrl(unit, 'rectangle'), 'https://ads.convertify.work/ad-frame.html?k=a1b2c3d4e5f60718293a4b5c6d7e8f90&w=300&h=250')
assert.match(bannerFrameUrl(unit, 'mobile')!, /&w=320&h=50$/)
assert.match(bannerFrameUrl(unit, 'leaderboard')!, /&w=728&h=90$/)
assert.match(bannerFrameUrl(unit, 'skyscraper')!, /&w=160&h=300$/)

// The live units: every configured code builds a frame URL.
for (const [size, u] of Object.entries(UNITS) as [BannerSize, AdsterraUnit | null][]) {
    assert.ok(u, `${size} unit set`)
    assert.ok(bannerFrameUrl(u!, size), `${size} unit builds`)
}
// A malformed key, an insecure URL, or a script host ad-frame.html won't load never reaches the page.
assert.equal(bannerFrameUrl({ ...unit, key: 'abc"};alert(1);//' }, 'rectangle'), null)
assert.equal(bannerFrameUrl({ ...unit, src: 'http://insecure.example/x/invoke.js' }, 'rectangle'), null)
assert.equal(bannerFrameUrl({ ...unit, src: 'https://other.example/a1b2c3d4e5f60718293a4b5c6d7e8f90/invoke.js' }, 'rectangle'), null)

// Wide slots: leaderboard on desktop, 320x50 on phones, rectangle as the fallback; never the skyscraper.
assert.equal(wideSize(1366, all), 'leaderboard')
assert.equal(wideSize(390, all), 'mobile')
assert.equal(wideSize(768, all), 'leaderboard')
assert.equal(wideSize(767, all), 'mobile')
assert.equal(wideSize(1366, { ...none, rectangle: unit }), 'rectangle')
assert.equal(wideSize(390, { ...none, leaderboard: unit }), null)
assert.equal(wideSize(390, none), null)
assert.equal(wideSize(1920, { ...none, skyscraper: unit }), null)

// The sticky banner never falls back to a 300x250.
assert.equal(anchorSize(1366, all), 'leaderboard')
assert.equal(anchorSize(390, all), 'mobile')
assert.equal(anchorSize(390, { ...none, rectangle: unit }), null)

// No sticky banner over the canvas editors.
assert.equal(anchorAllowed('/merge-pdf'), true)
assert.equal(anchorAllowed('/'), true)
assert.equal(anchorAllowed('/autocad-pdf-editor'), false)
assert.equal(anchorAllowed('/edit-pdf'), false)
assert.equal(anchorAllowed('/edit-pdf-online'), true)
assert.equal(anchorAllowed('/admin/stats'), false)

console.log('adsterra tests passed')
