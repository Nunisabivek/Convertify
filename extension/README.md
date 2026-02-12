# Convertify Chrome Extension

> 30+ PDF & File Conversion Tools — 100% Free & Private

## 🚀 Install Locally (Developer Mode)

1. Open Chrome and go to `chrome://extensions/`
2. Toggle **Developer mode** ON (top-right)
3. Click **Load unpacked**
4. Select this `extension/` folder
5. Pin the Convertify icon in your toolbar — done!

## 💰 Monetization Model

### Free Tier
- **3 conversions per day**
- All basic tools available
- Usage resets daily at midnight

### Pro Tier ($4.99/month)
- **Unlimited conversions**
- Batch processing (multiple files)
- All 30+ tools unlocked
- No watermarks
- Priority support

### How Revenue Works
1. User hits 3-conversion daily limit → **Upgrade modal** appears
2. Clicking "Upgrade" redirects to `convertify.work/pricing?from=extension&upgrade=true`
3. User pays via Razorpay on your website
4. Extension checks pro status via your API

### Monetization Touchpoints
- 👑 **Usage badge** in header (shows remaining free uses)
- 🔒 **Limit modal** when free tier exhausted
- ⬆️ **Upgrade banner** at bottom of popup
- 🔗 **Website links** drive traffic back to convertify.work

## 🛠️ Tools Included (30+)

### Organize PDF
- Merge PDF, Split PDF, Compress PDF, Rotate PDF
- Delete Pages, Reorder Pages, OCR PDF

### Convert from PDF
- PDF to Word, PDF to JPG, PDF to PNG
- PDF to Excel, PDF to PowerPoint, PDF to Text

### Convert to PDF
- Word to PDF, JPG to PDF, PNG to PDF
- Excel to PDF, PowerPoint to PDF, HTML to PDF, Text to PDF

### Edit & Secure
- Edit PDF, Sign PDF, Watermark PDF
- Protect PDF, Unlock PDF, Page Numbers, Redact PDF

### Advanced
- Compare PDF, PDF to PDF/A, Repair PDF

## 📁 File Structure

```
extension/
├── manifest.json      # Chrome Manifest V3 config
├── background.js      # Service worker (context menus, usage tracking)
├── popup.html         # Extension popup UI
├── popup.css          # Premium dark mode styles
├── popup.js           # Search, navigation, monetization logic
├── icons/
│   ├── icon.svg       # Source SVG icon
│   ├── icon16.png     # 16x16 toolbar icon
│   ├── icon32.png     # 32x32 icon
│   ├── icon48.png     # 48x48 icon
│   └── icon128.png    # 128x128 Chrome Web Store icon
└── README.md          # This file
```

## 🏪 Publish to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay $5 one-time developer fee
3. Zip the `extension/` folder contents
4. Upload the ZIP
5. Fill in listing details:
   - **Name**: Convertify - All-in-One PDF & File Converter
   - **Category**: Productivity
   - **Description**: Use the description from manifest.json
   - **Screenshots**: Take 1280x800 screenshots of the popup
6. Submit for review (takes 1-3 business days)

## 🔗 SEO Benefits

- Chrome Web Store listing ranks on Google
- Backlink to convertify.work
- Branded search volume increases
- Users from extension drive website traffic via `?from=extension` tracking
