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
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "a29f8518-295e-44e3-a00c-469addc370ce2";

// All page URLs for IndexNow (prioritized list)
const ALL_URLS = [
    // Homepage (highest priority)
    "https://convertify.work/",
    "https://convertify.work/all-tools",
    "https://convertify.work/blog",
    "https://convertify.work/security",

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
    "https://convertify.work/reorder-pdf",
    "https://convertify.work/delete-pdf-pages",
    "https://convertify.work/extract-pdf",

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
            console.log(`📡 IndexNow response status: ${res.statusCode}`);
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
    console.log('🔍 Convertify SEO Indexing Tool');
    console.log('==============================');
    console.log(`📊 Total URLs for IndexNow: ${ALL_URLS.length + BLOG_URLS.length}`);
    console.log(`   - Tool pages: ${ALL_URLS.length}`);
    console.log(`   - Blog posts: ${BLOG_URLS.length}`);

    try {
        const success = await submitIndexNow();

        console.log('\n📋 Summary');
        console.log('==========');
        console.log(`IndexNow: ${success ? '✅ Success' : '⚠️ Failed - Check IndexNow key and domain'}`);

        console.log('\n💡 Next Steps:');
        console.log('1. Google: Sitemaps are processed automatically from robots.txt');
        console.log('2. Bing/Other: IndexNow has notified Bing, Yandex, and Seznam');
        console.log(`3. Target: Indexing all ${ALL_URLS.length + BLOG_URLS.length} pages`);

        if (success) {
            process.exit(0);
        } else {
            process.exit(1);
        }
    } catch (error) {
        console.error('\n❌ Fatal Error during indexing:', error);
        process.exit(1);
    }
}

main();
