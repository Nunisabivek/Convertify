import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

// Capacitor plugin objects are Proxies that turn ANY property into a native call,
// including `then`. Resolving a promise with one (returning it from an async
// function or a .then callback) makes the promise call proxy.then(), which fails
// natively and the await never settles: in 1.3.0-rc this froze file picking,
// share and save on Android. Plugins must be used where they are imported.
const root = join(import.meta.dirname, '..')
const bad: string[] = []
const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
        const p = join(dir, name)
        if (statSync(p).isDirectory()) walk(p)
        else if (/\.(ts|tsx)$/.test(name) && !name.endsWith('.test.ts')) {
            const src = readFileSync(p, 'utf8')
            if (/import\((['"])@\/lib\/convertify-files\1\)\s*\.then\(\s*\(?\w*\)?\s*=>\s*\w+\.default\s*\)/.test(src)) bad.push(p)
            if (/=>\s*\(await import\((['"])@\/lib\/convertify-files\1\)\)\.default\s*$/m.test(src)) bad.push(p)
        }
    }
}
walk(root)
assert.deepEqual(bad, [], `plugin proxy resolved through a promise in: ${bad.join(', ')}`)
console.log('plugin proxy test passed')
