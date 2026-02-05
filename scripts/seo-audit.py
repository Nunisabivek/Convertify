#!/usr/bin/env python3
"""
SEO Audit Script for Convertify
Checks PageSpeed Insights, site health, and identifies critical SEO issues
"""

import requests
import json
import sys
from urllib.parse import quote

# Configuration
SITE_URL = "https://convertify.work"
PAGES_TO_CHECK = [
    "/",
    "/merge-pdf",
    "/compress-pdf",
    "/jpg-to-pdf",
    "/pdf-to-word",
    "/word-to-pdf",
    "/split-pdf",
    "/blog",
    "/all-tools"
]

def check_pagespeed(url, strategy="mobile"):
    """Check PageSpeed Insights for a URL"""
    encoded_url = quote(url, safe='')
    api_url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={encoded_url}&strategy={strategy}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY&category=BEST_PRACTICES"
    
    try:
        response = requests.get(api_url, timeout=60)
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Status {response.status_code}"}
    except Exception as e:
        return {"error": str(e)}

def analyze_page(data, page_name):
    """Extract key metrics from PageSpeed data"""
    if "error" in data:
        return {"error": data["error"]}
    
    try:
        lighthouse = data.get("lighthouseResult", {})
        categories = lighthouse.get("categories", {})
        audits = lighthouse.get("audits", {})
        
        return {
            "page": page_name,
            "performance": categories.get("performance", {}).get("score", 0) * 100,
            "seo": categories.get("seo", {}).get("score", 0) * 100,
            "accessibility": categories.get("accessibility", {}).get("score", 0) * 100,
            "best_practices": categories.get("best-practices", {}).get("score", 0) * 100,
            "core_web_vitals": {
                "lcp": audits.get("largest-contentful-paint", {}).get("displayValue", "N/A"),
                "fid": audits.get("max-potential-fid", {}).get("displayValue", "N/A"),
                "cls": audits.get("cumulative-layout-shift", {}).get("displayValue", "N/A"),
            },
            "seo_issues": []
        }
    except Exception as e:
        return {"error": str(e)}

def check_critical_seo_issues():
    """Check for common SEO issues that affect traffic"""
    issues = []
    
    # Check if site is accessible
    try:
        response = requests.get(SITE_URL, timeout=10)
        if response.status_code != 200:
            issues.append(f"Homepage returns {response.status_code}")
        
        # Check for noindex tag
        if 'noindex' in response.text.lower():
            issues.append("CRITICAL: noindex tag found on homepage")
        
        # Check for canonical
        if 'rel="canonical"' not in response.text:
            issues.append("WARNING: No canonical tag found")
            
    except Exception as e:
        issues.append(f"Cannot access site: {str(e)}")
    
    return issues

def main():
    print("=" * 70)
    print("CONVERTIFY SEO AUDIT REPORT")
    print("=" * 70)
    print()
    
    # Check critical issues first
    print("🔍 CHECKING CRITICAL SEO ISSUES...")
    print("-" * 70)
    critical_issues = check_critical_seo_issues()
    if critical_issues:
        for issue in critical_issues:
            print(f"  ⚠️  {issue}")
    else:
        print("  ✅ No critical issues found")
    print()
    
    # Check PageSpeed for key pages
    print("📊 PAGE SPEED & SEO SCORES")
    print("-" * 70)
    
    results = []
    for page in PAGES_TO_CHECK:
        url = f"{SITE_URL}{page}"
        print(f"\n  Checking: {page or '/'}")
        
        data = check_pagespeed(url)
        result = analyze_page(data, page or "homepage")
        results.append(result)
        
        if "error" in result:
            print(f"    ❌ Error: {result['error']}")
        else:
            print(f"    Performance: {result['performance']:.0f}/100")
            print(f"    SEO: {result['seo']:.0f}/100")
            print(f"    Accessibility: {result['accessibility']:.0f}/100")
            print(f"    Best Practices: {result['best_practices']:.0f}/100")
            print(f"    LCP: {result['core_web_vitals']['lcp']}")
            print(f"    CLS: {result['core_web_vitals']['cls']}")
    
    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY & RECOMMENDATIONS")
    print("=" * 70)
    
    # Find pages with issues
    low_seo = [r for r in results if r.get("seo", 100) < 90]
    low_perf = [r for r in results if r.get("performance", 100) < 70]
    
    if low_seo:
        print(f"\n⚠️  {len(low_seo)} pages with SEO score < 90:")
        for r in low_seo:
            print(f"   - {r['page']}: {r['seo']:.0f}/100")
    
    if low_perf:
        print(f"\n⚠️  {len(low_perf)} pages with Performance score < 70:")
        for r in low_perf:
            print(f"   - {r['page']}: {r['performance']:.0f}/100")
    
    if not low_seo and not low_perf:
        print("\n✅ All checked pages have good scores!")
    
    print("\n" + "=" * 70)
    print("CRITICAL ISSUES AFFECTING TRAFFIC:")
    print("=" * 70)
    
    # Common issues that kill traffic
    recommendations = [
        "1. CHECK GOOGLE SEARCH CONSOLE MANUALLY for:",
        "   - Indexing issues (Page indexing report)",
        "   - Manual actions",
        "   - Core Web Vitals issues",
        "   - Mobile usability issues",
        "",
        "2. VERIFY SITEMAP STATUS:",
        "   - Check if sitemap.xml is submitted in GSC",
        "   - Verify sitemap has no errors",
        "",
        "3. CHECK FOR DUPLICATE CONTENT:",
        "   - Ensure canonical tags are set correctly",
        "   - Check for www vs non-www redirects",
        "",
        "4. BACKLINK ANALYSIS:",
        "   - Check for toxic backlinks in GSC",
        "   - Look for sudden backlink drops",
        "",
        "5. CONTENT QUALITY:",
        "   - Check for thin content on tool pages",
        "   - Ensure FAQ schema is implemented",
        "   - Verify unique H1 tags on all pages"
    ]
    
    for rec in recommendations:
        print(rec)
    
    # Save results
    output = {
        "audit_date": "2026-02-05",
        "site": SITE_URL,
        "critical_issues": critical_issues,
        "page_results": results,
        "recommendations": recommendations
    }
    
    with open("seo-audit-results.json", "w") as f:
        json.dump(output, f, indent=2)
    
    print(f"\n💾 Full results saved to: seo-audit-results.json")

if __name__ == "__main__":
    main()