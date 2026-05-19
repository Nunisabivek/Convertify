#!/usr/bin/env node
/**
 * Enhanced Google & Search Engine Ping Script
 * Notifies all major search engines about sitemap updates.
 *
 * URLs are pulled live from the deployed sitemap.xml so this script can
 * never drift out of sync with what the site actually publishes. The old
 * hardcoded list submitted ~15 URLs that 404'd, which wastes IndexNow
 * budget and signals low quality.
 *
 * Usage: npm run seo:ping
 */

const https = require('https');

const SITEMAP_URL = "https://convertify.work/sitemap.xml";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "a29f8518-295e-44e3-a00c-469addc370ce2";

function fetchText(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Convertify-SEO-Ping' } }, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`GET ${url} -> ${res.statusCode}`));
                res.resume();
                return;
            }
            let data = '';
            res.on('data', (c) => (data += c));
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function getSitemapUrls() {
    const xml = await fetchText(SITEMAP_URL);
    const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
    // De-dupe defensively.
    return [...new Set(urls)];
}

async function submitIndexNow(allUrls) {
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

    try {
        const urls = await getSitemapUrls();
        if (urls.length === 0) {
            throw new Error('Sitemap returned 0 URLs — aborting to avoid an empty submission.');
        }
        console.log(`📊 Pulled ${urls.length} canonical URLs from ${SITEMAP_URL}`);

        const success = await submitIndexNow(urls);

        console.log('\n📋 Summary');
        console.log('==========');
        console.log(`IndexNow: ${success ? '✅ Success' : '⚠️ Failed - Check IndexNow key and domain'}`);

        console.log('\n💡 Next Steps:');
        console.log('1. Google: Sitemap is processed automatically from robots.txt');
        console.log('2. Bing/Other: IndexNow has notified Bing, Yandex, and Seznam');
        console.log(`3. Target: indexing all ${urls.length} canonical pages`);

        process.exit(success ? 0 : 1);
    } catch (error) {
        console.error('\n❌ Fatal Error during indexing:', error.message);
        process.exit(1);
    }
}

main();
