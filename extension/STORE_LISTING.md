# Chrome Web Store listing: Convertify 2.0.0

Item ID: `bccnoegccgifcibpnmhaaehlpoaojpkb`
Listing: https://chromewebstore.google.com/detail/bccnoegccgifcibpnmhaaehlpoaojpkb
Upload file: `convertify-extension-v2.0.0.zip` in the repo root (21 KB, `manifest.json` at the zip root).

This file is not part of the package.

---

## 1. Listing text

### Name

The store takes the name from `manifest.json`, so you don't type it in:

```
Convertify - All-in-One PDF & File Converter
```

### Summary (127 of 132 characters)

The store also takes the summary from the manifest `description`:

```
Quick launcher for 50 free Convertify tools: merge, split, compress and convert PDFs, images and data files on convertify.work.
```

### Category

Tools (under Productivity). Language: English.

### Detailed description

Paste this into **Store listing → Description**:

```
Convertify puts 50 free file tools one click away. Open the popup, type what you want to do, and the right tool opens on convertify.work in a new tab. No account, no sign-up, no daily limit, no watermark.

The tools run on convertify.work, in your browser. Your files are processed on your own device and aren't uploaded to a server. The extension itself never sees your files: it's a fast way to find and open the right tool.

WHAT'S INCLUDED

Organize PDF: Merge, Split, Compress (to a target size in KB or MB), Organize, Rotate, Delete pages, Reorder pages, Crop, Fit to Size, Repair.

Edit and secure PDF: Edit (add text, draw, highlight), Sign, Add page numbers, Watermark, Redact, Protect with a password (AES-256), Unlock, Compare two PDFs, AutoCAD PDF Editor.

Convert from PDF: PDF to Word, JPG, PNG, Excel, PowerPoint and Text.

Convert to PDF: JPG, PNG, Word, Excel, HTML, Text, Markdown and TIFF to PDF, plus a camera document scanner (Scan to PDF).

Image tools: Image Compressor, Resize Image, Passport Photo, Remove Background, HEIC to JPG, JPG to PNG, PNG to JPG, WebP Converter, BMP to JPG, GIF to PNG, SVG to PNG.

Data tools: QR Code Generator, CSV to JSON, JSON to CSV, XML to JSON, Base64.

FIND TOOLS FAST

- Search in your own words: "combine" finds Merge PDF, "100kb" finds Compress PDF, "docx" finds the Word tools, "photo to pdf" finds JPG to PDF.
- Keyboard friendly: Ctrl+K (Cmd+K on Mac) jumps to search, the arrow keys pick a tool, Enter opens it.
- Your last four tools stay at the top of the popup.
- Right-click any page for quick links to Merge PDF, Compress PDF, PDF to Word, JPG to PDF and the full tool list.

GOOD TO KNOW

- There's no OCR (text recognition). Scanned PDFs stay image-only, so tools that read text (PDF to Word, PDF to Excel, PDF to Text) need a PDF with selectable text.
- PDF to Word and Word to PDF carry the text over; layout, images and styling aren't kept.
- Excel to PDF prints cell values as text, without colours, borders or charts.

PRIVACY

The extension collects no personal data, sends nothing to any server, and loads no remote code. It stores only your recent tools and a small counter on your own device. Links to convertify.work are tagged with utm_source=chrome_extension so the website's analytics can see how many visits come from the extension.

Also on Android: search "Convertify" on Google Play.
```

### Single purpose

Paste this into **Privacy practices → Single purpose description**:

```
Convertify is a launcher for the free file tools on convertify.work. The popup and the right-click menu list and search the tools and open the one the user picks in a new tab.
```

---

## 2. Permission justifications

The manifest asks for two permissions and no host permissions. Chrome shows no install warning for either of them.

| Permission | Justification to paste |
|---|---|
| `storage` | Saves the user's last four opened tools, a count of how many tools they have opened, and whether they dismissed the optional rating card. All of it stays in chrome.storage.local on the user's device and is never sent anywhere. On update it also deletes settings left by version 1. |
| `contextMenus` | Adds a "Convertify" entry to the page right-click menu with links to Merge PDF, Compress PDF, PDF to Word, JPG to PDF and the full tool list. Clicking one opens that page on convertify.work in a new tab. Nothing from the current page is read or sent. |

Removed in 2.0.0: `activeTab` and `web_accessible_resources`, which nothing used. Opening a tab with `chrome.tabs.create` needs no permission.

**Host permissions:** none.
**Remote code:** answer **"No, I am not using remote code."** All JavaScript ships in the package (`background.js`, `tools.js`, `popup.js`). The manifest CSP is `script-src 'self'`, and there's no `fetch`, `XMLHttpRequest`, `eval`, `new Function` or external `<script>` anywhere.

---

## 3. Privacy practices tab

**Data usage:** leave every data type **unchecked**. The extension collects none of these:

- Personally identifiable information
- Health information
- Financial and payment information
- Authentication information
- Personal communications
- Location
- Web history
- User activity
- Website content

Why each one is accurate (checked in the code for 2.0.0):

- The extension makes no network requests. It only opens tabs whose URLs are fixed strings in `tools.js`.
- It never reads the current page, its URL, the clipboard or any file.
- `chrome.storage.local` holds only `recentTools`, `toolOpenCount`, `ratePromptDone` and `ratePromptSnoozedUntil`. They never leave the device.
- The UTM tags (`utm_source=chrome_extension`, `utm_medium=popup` / `context_menu`) are fixed text in the link. They carry nothing about the user.

**Certifications:** tick all three:

- I do not sell or transfer user data to third parties, outside of the approved use cases.
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
- I do not use or transfer user data to determine creditworthiness or for lending purposes.

**Privacy policy URL:** `https://convertify.work/privacy`. The extension collects nothing, but the website it opens has its own analytics and ads, so linking the site's policy is the honest choice.

---

## 4. What's new in 2.0.0

The store has no release-notes field, so use this text for the top of the description, an announcement or a reply to reviewers:

```
Convertify 2.0 is completely free.
- No Pro plan, no license key and no daily limit. All 50 tools are free.
- The tool list matches convertify.work, with an honest one-line description for each tool.
- Search understands everyday words: "combine", "shrink", "100kb", "docx", "photo".
- Keyboard shortcuts: Ctrl/Cmd+K to search, arrow keys and Enter to open.
- Your four most recent tools stay at the top.
- New light design in the Convertify blue.
- Fewer permissions: only storage and the right-click menu.
```

---

## 5. Upload the update

1. Open the Developer Dashboard at https://chrome.google.com/webstore/devconsole and sign in with the account that owns the listing.
2. Click **Convertify - All-in-One PDF & File Converter** (ID `bccnoegccgifcibpnmhaaehlpoaojpkb`).
3. **Package** (left menu) → **Upload new package** → choose `D:\Convertify\convertify-extension-v2.0.0.zip`. The dashboard should show version **2.0.0**. If it says the version must be higher than the published one, the upload went to the wrong item.
4. **Store listing:**
   - Replace the **Description** with the text in section 1.
   - Under **Screenshots**, delete the old screenshots, especially any that show "Pro", "Upgrade", a price or a daily limit. Upload these three, in this order. Each is 1280x800 PNG:
     1. `extension/store-assets/screenshot-1-tools.png` (tool list with recent tools)
     2. `extension/store-assets/screenshot-2-search.png` (searching "100kb")
     3. `extension/store-assets/screenshot-3-keyboard.png` (keyboard navigation)
   - Leave the store icon as it is: the icon hasn't changed.
   - Check the **small promo tile** (440x280) and any marquee image. If they mention Pro, pricing or "30+ tools", replace them. This repo doesn't include promo tiles.
   - Category: **Tools**. Homepage URL: `https://convertify.work`. Support URL: `https://convertify.work/contact`.
5. **Privacy practices:**
   - Paste the single-purpose text from section 1.
   - Paste the `storage` and `contextMenus` justifications from section 2. If the old `activeTab` justification box is still there, it disappears after the new package is uploaded.
   - Remote code: **No**.
   - Data usage: nothing ticked. Tick the three certifications.
   - Privacy policy URL: `https://convertify.work/privacy`.
   - Click **Save draft**.
6. **Distribution:** make sure nothing still describes paid features or in-app purchases. 2.0.0 has none.
7. Click **Submit for review** (top right). In the dialog, choose whether to publish automatically once approved (the default) or to publish by hand later. Click **Submit**.
8. Review usually takes from a few hours to a few days. With only two permissions and no host access, it's normally quick. Existing users get 2.0.0 automatically, and their old Pro and license data is deleted on update.

### Check before submitting

- [ ] The zip shows version 2.0.0 and its root contains `manifest.json`, `background.js`, `tools.js`, `popup.html`, `popup.css`, `popup.js` and `icons/`.
- [ ] No listing text, screenshot or promo tile mentions Pro, a price, a license or a daily limit.
- [ ] Nothing asks for 5 stars or offers anything in return for a rating.
- [ ] Privacy practices are saved and nothing in Data usage is ticked.
