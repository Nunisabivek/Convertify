#!/usr/bin/env node

/**
 * PING SEARCH ENGINES — Request re-crawl after content updates
 * 
 * Run this script after deploying changes to request that Google,
 * Bing, and Yandex re-crawl the updated pages.
 * 
 * Usage: node scripts/ping-search-engines.js
 * 
 * What it does:
 * 1. Pings Google's sitemap submission endpoint
 * 2. Submits all tool URLs to IndexNow (Bing + Yandex)
 * 3. Pings Google's URL inspection for high-priority pages
 */

const SITE_URL = 'https://convertify.work'
const INDEXNOW_KEY = 'a29f8518-295e-44e3-a00c-469addc370ce2'

// All important URLs that should be re-crawled
const PRIORITY_URLS = [
    '/',
    '/png-to-pdf',
    '/excel-to-pdf',
    '/pdf-to-jpg',
    '/compress-pdf',
    '/merge-pdf',
    '/split-pdf',
    '/pdf-to-word',
    '/word-to-pdf',
    '/jpg-to-pdf',
    '/heic-to-jpg',
    '/image-compressor',
    '/pdf-to-png',
    '/pdf-to-excel',
    '/autocad-pdf-editor',
    '/all-tools',
    '/sign-pdf',
    '/rotate-pdf',
    '/edit-pdf',
    '/watermark-pdf',
    '/protect-pdf',
    '/qr-code-generator',
    '/webp-converter',
    '/jpg-to-png',
    '/png-to-jpg',
    '/svg-to-png',
    '/bmp-to-jpg',
    '/gif-to-png',
    '/resize-image',
    '/powerpoint-to-pdf',
    '/pdf-to-powerpoint',
    '/html-to-pdf',
    '/csv-to-json',
    '/json-to-csv',
    '/xml-to-json',
    '/base64',
    '/tiff-to-pdf',
    '/ocr-pdf',
    '/pdf-to-text',
    '/text-to-pdf',
    '/markdown-to-pdf',
    '/delete-pdf-pages',
    '/reorder-pdf',
    '/add-page-numbers',
    '/redact-pdf',
    '/unlock-pdf',
    '/compare-pdf',
    '/pdf-to-pdfa',
    '/blog',
]

async function pingGoogleSitemap() {
    console.log('\n📡 Pinging Google Sitemap...')
    try {
        const res = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(SITE_URL + '/sitemap.xml')}`)
        console.log(`   ✅ Google sitemap ping: ${res.status} ${res.statusText}`)
    } catch (e) {
        console.log(`   ❌ Google sitemap ping failed: ${e.message}`)
    }
}

async function submitIndexNow() {
    console.log('\n📡 Submitting to IndexNow (Bing + Yandex)...')
    
    const fullUrls = PRIORITY_URLS.map(path => `${SITE_URL}${path}`)
    
    const endpoints = [
        'https://api.indexnow.org/indexnow',
        'https://www.bing.com/indexnow',
        'https://yandex.com/indexnow',
    ]

    for (const endpoint of endpoints) {
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    host: 'convertify.work',
                    key: INDEXNOW_KEY,
                    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
                    urlList: fullUrls,
                }),
            })
            console.log(`   ✅ ${new URL(endpoint).hostname}: ${res.status} ${res.statusText}`)
        } catch (e) {
            console.log(`   ❌ ${new URL(endpoint).hostname}: ${e.message}`)
        }
    }
}

async function main() {
    console.log('🚀 Convertify Search Engine Ping Script')
    console.log(`   Site: ${SITE_URL}`)
    console.log(`   URLs to submit: ${PRIORITY_URLS.length}`)
    console.log(`   Date: ${new Date().toISOString()}`)

    await pingGoogleSitemap()
    await submitIndexNow()

    console.log('\n✅ Done! Search engines have been notified.')
    console.log('\n📋 Next steps:')
    console.log('   1. Check Google Search Console for indexing status in 24-48h')
    console.log('   2. Use "URL Inspection" in GSC to request indexing for key pages')
    console.log('   3. Monitor Bing Webmaster Tools for IndexNow acknowledgment')
    console.log('   4. If pages remain de-indexed after 7 days, file a reconsideration request')
}

main().catch(console.error)
