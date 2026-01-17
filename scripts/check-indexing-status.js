const https = require('https');

// All your important pages
const pages = [
    '',  // Homepage
    'all-tools',
    'blog',
    'merge-pdf',
    'split-pdf',
    'compress-pdf',
    'jpg-to-pdf',
    'png-to-pdf',
    'word-to-pdf',
    'pdf-to-jpg',
    'pdf-to-png',
    'text-to-pdf',
    'pdf-to-text',
    'excel-to-pdf',
    'powerpoint-to-pdf',
];

console.log('🔍 Checking Indexing Status for Convertify Pages\n');
console.log('━'.repeat(60));
console.log('\nTo check if pages are indexed, visit Google and search:');
console.log('site:convertify.work\n');

pages.forEach((page, index) => {
    const url = page ? `convertify.work/${page}` : 'convertify.work';
    const fullUrl = page ? `https://convertify.work/${page}` : 'https://convertify.work';

    console.log(`${index + 1}. ${url}`);
    console.log(`   Check: https://www.google.com/search?q=site:${encodeURIComponent(url)}`);
    console.log(`   Direct: ${fullUrl}`);
    console.log('');
});

console.log('━'.repeat(60));
console.log('\n📊 Manual Indexing Checklist:\n');
console.log('1. ✅ Submit each URL in Google Search Console');
console.log('2. ✅ Request indexing manually (you can do 10-15 per day)');
console.log('3. ✅ Check "URL Inspection" tool for each page');
console.log('4. ✅ Look for any errors or warnings');
console.log('5. ✅ Submit sitemap.xml if not already done\n');
console.log('🔗 Google Search Console: https://search.google.com/search-console\n');
