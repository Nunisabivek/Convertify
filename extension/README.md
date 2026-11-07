# Convertify Chrome Extension

A free launcher for the tools on [convertify.work](https://convertify.work). The popup lists every tool, searches them, and opens the chosen one in a new tab. The tools themselves run on the website, in the browser; the extension never touches your files.

Chrome Web Store: https://chromewebstore.google.com/detail/bccnoegccgifcibpnmhaaehlpoaojpkb

## Install locally (developer mode)

1. Open `chrome://extensions/`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this `extension/` folder.

## What it does

- **Tool list:** every indexable tool page on the site, grouped by category, each with a one-line description.
- **Search:** matches names, descriptions and synonyms (combine → merge, 100kb → compress, docx → word, photo → jpg/png). Arrow keys move through results, Enter opens one, Ctrl/⌘+K focuses the search box, Esc clears it.
- **Recent tools:** the last 4 tools you opened. Until you've opened one, the row shows popular tools instead.
- **Right-click menu** (on a page): opens Merge PDF, Compress PDF, PDF to Word, JPG to PDF or the full tool list. It only opens a page. Nothing from the current page is sent anywhere.
- **Rating card:** after 3 tool opens, a small card links to the Android app on Google Play and to this extension's Chrome Web Store reviews. "Not now" hides it for 14 days; either link hides it for good. Nothing is ever locked behind a rating.
- **Analytics:** links carry `utm_source=chrome_extension` and `utm_medium=popup` or `utm_medium=context_menu`, so Google Analytics on the website can attribute the visits. The extension itself sends no data anywhere.

## Files

```
extension/
├── manifest.json      Manifest V3
├── tools.js           Tool catalog, URL builder, usage counter (shared)
├── background.js      Service worker: v1 storage cleanup, right-click menu
├── popup.html/.css/.js
├── icons/             16, 32, 48, 128 px
├── README.md          (not packaged)
└── STORE_LISTING.md   Chrome Web Store listing text and upload steps (not packaged)
```

Local storage keys: `toolOpenCount`, `recentTools`, `ratePromptDone`, `ratePromptSnoozedUntil`. Version 1 keys (`isPro`, `licenseKey`, `dailyUsage`, `lastResetDate`) are removed on install or update.

## Keeping the tool list in sync

`tools.js` mirrors the tool slugs in `src/app/sitemap.ts`. When a tool is added to or removed from the sitemap, update `TOOLS` too. Take descriptions from `public/llms.txt` and the tool's own page, and keep them honest. Leave out pages that are noindexed (check `robots` in `src/app/<slug>/page.tsx`).

## Packaging

Zip the runtime files with `manifest.json` at the root of the archive. README.md and STORE_LISTING.md stay out of it:

```
manifest.json background.js tools.js popup.html popup.css popup.js icons/
```

See `STORE_LISTING.md` for the listing text and the upload steps.
