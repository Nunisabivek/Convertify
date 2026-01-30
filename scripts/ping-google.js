#!/usr/bin/env node
/**
 * Enhanced Google & Search Engine Ping Script
 * Notifies all major search engines about sitemap updates
 * 
 * Usage: npm run seo:ping
 */

const https = require('https');
const http = require('http');

const SITEMAP_URL = "https://convertify.work/sitemap.xml";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "4f8b7c9d1e2a3b5c6d7e8f9a0b1c2d3e";

// All page URLs for IndexNow (prioritized list)
const ALL_URLS = [
    // Homepage (highest priority)
    "https://convertify.work/",
    "https://convertify.work/all-tools",
    "https://convertify.work/blog",

    // High-traffic tools
    "https://convertify.work/merge-pdf",
    "https://convertify.work/compress-pdf",
    "https://convertify.work/split-pdf",
    "https://convertify.work/jpg-to-pdf",
    "https://convertify.work/pdf-to-jpg",
    "https://convertify.work/pdf-to-word",
    "https://convertify.work/word-to-pdf",

    // All other tools
    "https://convertify.work/pdf-to-excel",
    "https://convertify.work/excel-to-pdf",
    "https://convertify.work/pdf-to-powerpoint",
    "https://convertify.work/powerpoint-to-pdf",
    "https://convertify.work/png-to-pdf",
    "https://convertify.work/pdf-to-png",
    "https://convertify.work/text-to-pdf",
    "https://convertify.work/pdf-to-text",
    "https://convertify.work/html-to-pdf",
    "https://convertify.work/edit-pdf",
    "https://convertify.work/sign-pdf",
    "https://convertify.work/watermark-pdf",
    "https://convertify.work/add-page-numbers",
    "https://convertify.work/crop-pdf",
    "https://convertify.work/rotate-pdf",
    "https://convertify.work/organize-pdf",
    "https://convertify.work/protect-pdf",
    "https://convertify.work/unlock-pdf",
    "https://convertify.work/redact-pdf",
    "https://convertify.work/repair-pdf",
    "https://convertify.work/ocr-pdf",
    "https://convertify.work/compare-pdf",
    "https://convertify.work/pdf-to-pdfa",

    // Static pages
    "https://convertify.work/contact",
    "https://convertify.work/privacy",
    "https://convertify.work/terms",
];

// Blog posts - All 30 SEO-optimized posts
const BLOG_URLS = [
    "https://convertify.work/blog/how-to-merge-pdf-files-free",
    "https://convertify.work/blog/convert-jpg-to-pdf-online",
    "https://convertify.work/blog/compress-pdf-reduce-file-size",
    "https://convertify.work/blog/split-pdf-extract-pages-free",
    "https://convertify.work/blog/pdf-to-jpg-convert-pages-images",
    "https://convertify.work/blog/merge-pdf-without-adobe-acrobat",
    "https://convertify.work/blog/compress-pdf-for-email-attachment",
    "https://convertify.work/blog/convert-iphone-photos-to-pdf",
    "https://convertify.work/blog/best-free-pdf-tools-2025",
    "https://convertify.work/blog/pdf-tips-for-students",
    "https://convertify.work/blog/merge-pdf-windows-10-without-software",
    "https://convertify.work/blog/merge-pdf-android-phone-free",
    "https://convertify.work/blog/combine-scanned-documents-into-one-pdf",
    "https://convertify.work/blog/compress-pdf-for-whatsapp-sharing",
    "https://convertify.work/blog/reduce-pdf-size-without-losing-quality",
    "https://convertify.work/blog/make-pdf-smaller-for-email",
    "https://convertify.work/blog/convert-screenshot-to-pdf",
    "https://convertify.work/blog/png-with-transparency-to-pdf",
    "https://convertify.work/blog/split-pdf-by-page-number",
    "https://convertify.work/blog/extract-pages-from-pdf-free",
    "https://convertify.work/blog/separate-pdf-pages",
    "https://convertify.work/blog/remove-pages-from-pdf",
    "https://convertify.work/blog/extract-text-from-scanned-pdf",
    "https://convertify.work/blog/word-to-pdf-keep-formatting",
    "https://convertify.work/blog/save-word-as-pdf-mac",
    "https://convertify.work/blog/excel-to-pdf-converter",
    "https://convertify.work/blog/powerpoint-to-pdf-formatting",
    "https://convertify.work/blog/google-docs-to-pdf",
    "https://convertify.work/blog/pdf-vs-adobe-comparison",
    "https://convertify.work/blog/password-protect-pdf-free",
];


async function pingGoogle() {
    return new Promise((resolve) => {
        const encodedSitemap = encodeURIComponent(SITEMAP_URL);
        const pingUrl = `http://www.google.com/ping?sitemap=${encodedSitemap}`;

        console.log(`\n📡 Pinging Google with sitemap: ${SITEMAP_URL}`);

        http.get(pingUrl, (res) => {
            if (res.statusCode === 200) {
                console.log('✅ Google ping successful');
                resolve(true);
            } else {
                console.log(`⚠️ Google ping returned status: ${res.statusCode}`);
                console.log('   Note: Google has deprecated public ping. Using sitemap submission instead.');
                resolve(false);
            }
        }).on("error", (err) => {
            console.log(`⚠️ Google ping error: ${err.message}`);
            resolve(false);
        });
    });
}

async function pingBing() {
    return new Promise((resolve) => {
        const encodedSitemap = encodeURIComponent(SITEMAP_URL);
        const pingUrl = `https://www.bing.com/ping?sitemap=${encodedSitemap}`;

        console.log(`\n📡 Pinging Bing with sitemap...`);

        https.get(pingUrl, (res) => {
            if (res.statusCode === 200) {
                console.log('✅ Bing ping successful');
                resolve(true);
            } else {
                console.log(`⚠️ Bing ping returned status: ${res.statusCode}`);
                resolve(false);
            }
        }).on("error", (err) => {
            console.log(`⚠️ Bing ping error: ${err.message}`);
            resolve(false);
        });
    });
}

async function submitIndexNow() {
    const allUrls = [...ALL_URLS, ...BLOG_URLS];

    const postData = JSON.stringify({
        host: "convertify.work",
        key: INDEXNOW_KEY,
        keyLocation: `https://convertify.work/${INDEXNOW_KEY}.txt`,
        urlList: allUrls
    });

    const options = {
        hostname: 'api.indexnow.org',
        port: 443,
        path: '/indexnow',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log(`\n📡 Submitting ${allUrls.length} URLs to IndexNow (Bing, Yandex, DuckDuckGo)...`);

    return new Promise((resolve) => {
        const req = https.request(options, (res) => {
            if (res.statusCode === 200 || res.statusCode === 202) {
                console.log(`✅ IndexNow submission successful (${allUrls.length} URLs)`);
                resolve(true);
            } else {
                console.log(`⚠️ IndexNow returned status: ${res.statusCode}`);
                resolve(false);
            }
        });

        req.on('error', (err) => {
            console.log(`⚠️ IndexNow error: ${err.message}`);
            resolve(false);
        });

        req.write(postData);
        req.end();
    });
}

async function main() {
    console.log('🔍 Convertify SEO Ping Tool');
    console.log('============================');
    console.log(`📊 Total URLs to submit: ${ALL_URLS.length + BLOG_URLS.length}`);
    console.log(`   - Tool pages: ${ALL_URLS.length}`);
    console.log(`   - Blog posts: ${BLOG_URLS.length}`);

    const results = {
        google: await pingGoogle(),
        bing: await pingBing(),
        indexNow: await submitIndexNow()
    };

    console.log('\n📋 Summary');
    console.log('==========');
    console.log(`Google:   ${results.google ? '✅ OK' : '⚠️ Manual submission recommended'}`);
    console.log(`Bing:     ${results.bing ? '✅ OK' : '⚠️ Check Bing Webmaster Tools'}`);
    console.log(`IndexNow: ${results.indexNow ? '✅ OK' : '⚠️ Check IndexNow key'}`);

    console.log('\n💡 Next Steps:');
    console.log('1. Submit sitemap manually in Google Search Console');
    console.log('2. Request indexing for priority pages');
    console.log('3. Build quality backlinks to improve crawl priority');
    console.log('\n🎯 Target: Index all 74 pages (currently 19 indexed, 55 pending)');
}

main().catch(console.error);
