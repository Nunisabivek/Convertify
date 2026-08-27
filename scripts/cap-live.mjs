#!/usr/bin/env node
/**
 * Debug-only live reload for the Android emulator.
 * Does not change capacitor.config.ts. Capacitor writes a temporary
 * server.url into the gitignored android assets file and reverts it on Ctrl+C.
 *
 * Production/release still uses the bundled `webDir` export over https.
 */
import { spawn } from 'node:child_process'

const host = process.env.CAP_LIVE_HOST || '10.0.2.2'
const port = process.env.CAP_LIVE_PORT || '3000'
const url = `http://${host}:${port}`

console.log(`
Convertify Android live reload (debug only)

WebView will load ${url}
That host is the emulator's alias for this machine. It is NOT written into
capacitor.config.ts, and release/production still uses the static export.

In another terminal, leave this running first:

  npm run dev:mobile

Then start the Android emulator, then this script.

If a route does not hot-reload, pull down to refresh (or press R in logcat).
Ctrl+C stops live mode and restores the bundled-config APK settings.
`)

const child = spawn(
  'npx',
  ['cap', 'run', 'android', '--live-reload', `--host=${host}`, `--port=${port}`],
  { stdio: 'inherit', env: process.env }
)

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 1)
})
