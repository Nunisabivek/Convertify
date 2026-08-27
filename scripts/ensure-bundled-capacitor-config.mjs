#!/usr/bin/env node
/**
 * Production / Play builds must load bundled `webDir` assets.
 * Live reload (`npm run cap:live`) may write server.url into the gitignored
 * android assets config; this script strips that before a store build.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tsConfigPath = join(root, 'capacitor.config.ts')
const jsonConfigPath = join(root, 'android/app/src/main/assets/capacitor.config.json')

const ts = readFileSync(tsConfigPath, 'utf8')
if (/\burl\s*:/.test(ts) && ts.includes('server')) {
  const serverBlock = ts.match(/server\s*:\s*\{[\s\S]*?\}/)
if (serverBlock?.[0] && /\burl\s*:/.test(serverBlock[0])) {
    console.error(
      'capacitor.config.ts must not set server.url. Live reload is `npm run cap:live` only.'
    )
    process.exit(1)
  }
}
if (ts.includes('10.0.2.2')) {
  console.error('capacitor.config.ts must not hard-code the emulator live-reload host.')
  process.exit(1)
}

if (!existsSync(jsonConfigPath)) {
  process.exit(0)
}

const json = JSON.parse(readFileSync(jsonConfigPath, 'utf8'))
const server = json.server && typeof json.server === 'object' ? json.server : null
if (server && (server.url || server.cleartext)) {
  delete server.url
  delete server.cleartext
  json.server = server
  writeFileSync(jsonConfigPath, `${JSON.stringify(json, null, '\t')}\n`)
  console.log('Removed Capacitor live-reload server.url; store builds load bundled assets.')
}
