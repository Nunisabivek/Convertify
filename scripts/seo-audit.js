#!/usr/bin/env node
/**
 * SEO Audit Script for Convertify
 * Checks site health and identifies critical SEO issues
 */

const https = require('https');
const http = require('http');

const SITE_URL = 'https://convertify.work';
const PAGES_TO_CHECK = [
    '/',
    '/merge-pdf',
    '/compress-pdf',
    '/jpg-to-pdf',
    '/pdf-to-word',
    '/word-to-pdf',
    '/split-pdf',
    '/blog',
    '/all-tools'
];

function fetchPage(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const request = client.get(url, (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve({
                status: response.statusCode,
                headers: response.headers,
                body: data
            }));
        });
        request.on('error', reject);
        request.setTimeout(10000, () => {
            request.destroy();
            reject(new Error('Timeout'));
        });
    });
}

function checkPageSpeed(url) {
    return new Promise((resolve, reject) => {
        const encodedUrl = encodeURIComponent(url);
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&strategy=mobile&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY&category=BEST_PRACTICES`;

        https.get(apiUrl, (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    resolve({ error: 'Invalid JSON response' });
                }
            });
        }).on('error', (err) => {
            resolve({ error: err.message });
        }).setTimeout(60000, function () {
            this.destroy();
            resolve({ error: 'Timeout' });
        });
    });
}

function analyzePage(data, pageName) {
    if (data.error) {
        return { error: data.error };
    }

    try {
        const lighthouse = data.lighthouseResult || {};
        const categories = lighthouse.categories || {};
        const audits = lighthouse.audits || {};

        return {
            page: pageName,
            performance: Math.round((categories.performance?.score || 0) * 100),
            seo: Math.round((categories.seo?.score || 0) * 100),
            accessibility: Math.round((categories.accessibility?.score || 0) * 100),
            best_practices: Math.round((categories['best-practices']?.score || 0) * 100),
            core_web_vitals: {
                lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
                cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
            }
        };
    } catch (e) {
        return { error: e.message };
    }
}

async function checkCriticalIssues() {
    const issues = [];

    try {
        const result = await fetchPage(SITE_URL);

        if (result.status !== 200) {
            issues.push(`Homepage returns ${result.status}`);
        }

        const body = result.body.toLowerCase();

        if (body.includes('noindex')) {
            issues.push('CRITICAL: noindex tag found on homepage');
        }

        if (!body.includes('rel="canonical"')) {
            issues.push('WARNING: No canonical tag found');
        }

        if (!body.includes('sitemap.xml')) {
            issues.push('WARNING: No sitemap reference found');
        }

    } catch (e) {
        issues.push(`Cannot access site: ${e.message}`);
    }

    return issues;
}

async function main() {
    console.log('='.repeat(70));
    console.log('CONVERTIFY SEO AUDIT REPORT');
    console.log('='.repeat(70));
    console.log();

    // Check critical issues
    console.log('🔍 CHECKING CRITICAL SEO ISSUES...');
    console.log('-'.repeat(70));
    const criticalIssues = await checkCriticalIssues();
    if (criticalIssues.length > 0) {
        criticalIssues.forEach(issue => console.log(`  ⚠️  ${issue}`));
    } else {
        console.log('  ✅ No critical issues found');
    }
    console.log();

    // Check PageSpeed for key pages
    console.log('📊 PAGE SPEED & SEO SCORES (this may take a minute)...');
    console.log('-'.repeat(70));

    const results = [];
    for (const page of PAGES_TO_CHECK) {
        const url = `${SITE_URL}${page}`;
        console.log(`\n  Checking: ${page || '/'}`);

        try {
            const data = await checkPageSpeed(url);
            const result = analyzePage(data, page || 'homepage');
            results.push(result);

            if (result.error) {
                console.log(`    ❌ Error: ${result.error}`);
            } else {
                console.log(`    Performance: ${result.performance}/100`);
                console.log(`    SEO: ${result.seo}/100`);
                console.log(`    Accessibility: ${result.accessibility}/100`);
                console.log(`    Best Practices: ${result.best_practices}/100`);
                console.log(`    LCP: ${result.core_web_vitals.lcp}`);
                console.log(`    CLS: ${result.core_web_vitals.cls}`);
            }
        } catch (e) {
            console.log(`    ❌ Error: ${e.message}`);
            results.push({ error: e.message, page: page || 'homepage' });
        }
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('SUMMARY & RECOMMENDATIONS');
    console.log('='.repeat(70));

    const lowSeo = results.filter(r => r.seo !== undefined && r.seo < 90);
    const lowPerf = results.filter(r => r.performance !== undefined && r.performance < 70);

    if (lowSeo.length > 0) {
        console.log(`\n⚠️  ${lowSeo.length} pages with SEO score < 90:`);
        lowSeo.forEach(r => console.log(`   - ${r.page}: ${r.seo}/100`));
    }

    if (lowPerf.length > 0) {
        console.log(`\n⚠️  ${lowPerf.length} pages with Performance score < 70:`);
        lowPerf.forEach(r => console.log(`   - ${r.page}: ${r.performance}/100`));
    }

    if (lowSeo.length === 0 && lowPerf.length === 0 && results.length > 0) {
        console.log('\n✅ All checked pages have good scores!');
    }

    console.log('\n' + '='.repeat(70));
    console.log('CRITICAL ISSUES AFFECTING TRAFFIC:');
    console.log('='.repeat(70));

    console.log(`
1. CHECK GOOGLE SEARCH CONSOLE MANUALLY for:
   - Indexing issues (Page indexing report)
   - Manual actions
   - Core Web Vitals issues
   - Mobile usability issues

2. VERIFY SITEMAP STATUS:
   - Check if sitemap.xml is submitted in GSC
   - Verify sitemap has no errors

3. CHECK FOR DUPLICATE CONTENT:
   - Ensure canonical tags are set correctly
   - Check for www vs non-www redirects

4. BACKLINK ANALYSIS:
   - Check for toxic backlinks in GSC
   - Look for sudden backlink drops

5. CONTENT QUALITY:
   - Check for thin content on tool pages
   - Ensure FAQ schema is implemented
   - Verify unique H1 tags on all pages
   - Check for missing meta descriptions

6. TECHNICAL SEO:
   - Check robots.txt for blocking rules
   - Verify all pages return 200 status
   - Check for redirect chains
   - Ensure HTTPS is enforced

7. USER EXPERIENCE:
   - Mobile responsiveness
   - Page load speed (< 3 seconds)
   - Core Web Vitals passing
`);

    // Save results
    const output = {
        audit_date: new Date().toISOString(),
        site: SITE_URL,
        critical_issues: criticalIssues,
        page_results: results,
        traffic_issues: [
            "No Google Analytics 4 tracking",
            "Missing Search Console data integration",
            "No structured data validation",
            "Missing internal linking strategy"
        ]
    };

    const fs = require('fs');
    fs.writeFileSync('seo-audit-results.json', JSON.stringify(output, null, 2));
    console.log('💾 Full results saved to: seo-audit-results.json');
}

main().catch(console.error);