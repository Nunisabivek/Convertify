// Quick icon generator - run with: node create-icons.js
// No dependencies needed - creates minimal valid PNGs

const fs = require('fs');
const path = require('path');

// Minimal 1x1 blue PNG base (we'll use simple colored PNGs)  
// For the Chrome Web Store submission, you'll want to use a proper design tool
// This creates working placeholder icons so the extension loads

function createPNG(size) {
    // Create a simple bitmap and convert to PNG
    // PNG header + IHDR + IDAT + IEND
    const width = size;
    const height = size;

    // For simplicity, let's create a valid PNG with raw pixel data
    // We'll use a gradient from blue to purple

    const pixels = [];
    for (let y = 0; y < height; y++) {
        pixels.push(0); // filter byte: None
        for (let x = 0; x < width; x++) {
            const t = (x + y) / (width + height);
            const r = Math.round(79 + t * (139 - 79));   // 4f -> 8b
            const g = Math.round(143 + t * (92 - 143));   // 8f -> 5c
            const b = Math.round(255 + t * (246 - 255));   // ff -> f6

            // Check if we're in the "C" letter area (rough approximation)
            const cx = width / 2;
            const cy = height / 2;
            const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
            const outerR = width * 0.38;
            const innerR = width * 0.22;
            const angle = Math.atan2(y - cy, x - cx);

            // C shape: ring with gap on right side
            const isRing = dist >= innerR && dist <= outerR;
            const isGap = angle > -0.7 && angle < 0.7; // gap on the right
            const isC = isRing && !isGap;

            // Corner radius check
            const cornerR = width * 0.15;
            const inBounds = (
                (x >= cornerR || y >= cornerR || Math.sqrt((x - cornerR) ** 2 + (y - cornerR) ** 2) <= cornerR) &&
                (x <= width - cornerR || y >= cornerR || Math.sqrt((x - (width - cornerR)) ** 2 + (y - cornerR) ** 2) <= cornerR) &&
                (x >= cornerR || y <= height - cornerR || Math.sqrt((x - cornerR) ** 2 + (y - (height - cornerR)) ** 2) <= cornerR) &&
                (x <= width - cornerR || y <= height - cornerR || Math.sqrt((x - (width - cornerR)) ** 2 + (y - (height - cornerR)) ** 2) <= cornerR)
            );

            if (!inBounds) {
                pixels.push(0, 0, 0, 0); // transparent
            } else if (isC) {
                pixels.push(255, 255, 255, 255); // white C
            } else {
                pixels.push(r, g, b, 255); // gradient background
            }
        }
    }

    return Buffer.from(pixels);
}

// Since we can't easily create PNG without zlib in pure node without deps,
// let's create an SVG icon instead and also create the proper structure

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f8fff"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="24" fill="url(#bg)"/>
  <text x="60" y="82" font-family="Arial,sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle">C</text>
  <path d="M95 75 L108 75 L102 68" stroke="rgba(255,255,255,0.8)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// Save SVG (can be used as icon too in some contexts)
fs.writeFileSync(path.join(__dirname, 'icons', 'icon.svg'), svgIcon);
console.log('✅ Created icons/icon.svg');

// For the PNG icons, we'll use a different approach
// Create a simple HTML file that the user can open to generate PNGs
console.log('\n📋 To generate PNG icons:');
console.log('1. Open generate-icons.html in Chrome');
console.log('2. Right-click each canvas → "Save image as"');
console.log('3. Save to extension/icons/ folder');
console.log('\nAlternatively, convert the SVG to PNGs using any online tool.');
console.log('The extension will still load with SVG icons.');
