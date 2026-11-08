import assert from 'node:assert/strict'
import { UNITS, anchorAllowed, anchorSize, bannerDocument, normalizeSrc, wideSize, type AdsterraUnit, type BannerSize } from './adsterra.ts'

const unit: AdsterraUnit = { key: 'a1b2c3d4e5f60718293a4b5c6d7e8f90', src: '//www.highperformanceformat.com/a1b2c3d4e5f60718293a4b5c6d7e8f90/invoke.js' }
const all: Record<BannerSize, AdsterraUnit | null> = { rectangle: unit, leaderboard: unit, mobile: unit, skyscraper: unit }
const none: Record<BannerSize, AdsterraUnit | null> = { rectangle: null, leaderboard: null, mobile: null, skyscraper: null }

// Dashboard codes use protocol-relative URLs; only https .js URLs are accepted.
assert.equal(normalizeSrc(unit.src), 'https://www.highperformanceformat.com/a1b2c3d4e5f60718293a4b5c6d7e8f90/invoke.js')
assert.equal(normalizeSrc('http://example.com/x/invoke.js'), null)
assert.equal(normalizeSrc('javascript:alert(1)'), null)
assert.equal(normalizeSrc('https://example.com/page.html'), null)
assert.equal(normalizeSrc('not a url'), null)

// The iframe document carries this unit's own atOptions, sized for the slot.
const doc = bannerDocument(unit, 'rectangle')!
assert.match(doc, /atOptions=\{"key":"a1b2c3d4e5f60718293a4b5c6d7e8f90","format":"iframe","height":250,"width":300,"params":\{\}\}/)
assert.match(doc, /<script src="https:\/\/www\.highperformanceformat\.com\/a1b2c3d4e5f60718293a4b5c6d7e8f90\/invoke\.js"><\/script>/)
assert.match(bannerDocument(unit, 'mobile')!, /"height":50,"width":320/)
assert.match(bannerDocument(unit, 'leaderboard')!, /"height":90,"width":728/)
assert.match(bannerDocument(unit, 'skyscraper')!, /"height":300,"width":160/)

// The live units: every configured code builds a valid banner document.
for (const [size, u] of Object.entries(UNITS) as [BannerSize, AdsterraUnit | null][]) {
    assert.ok(u, `${size} unit set`)
    assert.ok(bannerDocument(u!, size), `${size} unit builds`)
    assert.ok(u!.src.includes(u!.key), `${size} src matches its key`)
}
// A malformed key or URL never reaches the page.
assert.equal(bannerDocument({ ...unit, key: 'abc"};alert(1);//' }, 'rectangle'), null)
assert.equal(bannerDocument({ ...unit, src: 'http://insecure.example/x/invoke.js' }, 'rectangle'), null)

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
