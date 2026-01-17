const https = require('https');

// Your site URLs to submit
const urls = [
    'https://convertify.work',
    'https://convertify.work/all-tools',
    'https://convertify.work/blog',
    'https://convertify.work/merge-pdf',
    'https://convertify.work/split-pdf',
    'https://convertify.work/compress-pdf',
    'https://convertify.work/jpg-to-pdf',
    'https://convertify.work/png-to-pdf',
    'https://convertify.work/word-to-pdf',
    'https://convertify.work/pdf-to-jpg',
    'https://convertify.work/pdf-to-png',
    'https://convertify.work/text-to-pdf',
    'https://convertify.work/pdf-to-text',
    'https://convertify.work/excel-to-pdf',
    'https://convertify.work/powerpoint-to-pdf',
];

// Generate a simple API key (you can use any string, but keep it consistent)
const apiKey = 'convertify-indexnow-' + Date.now();

console.log('📡 Submitting URLs to IndexNow (Bing, Yandex, etc.)...\n');
console.log(`API Key: ${apiKey}\n`);
console.log(`Total URLs: ${urls.length}\n`);

// IndexNow endpoint
const data = JSON.stringify({
    host: 'convertify.work',
    key: apiKey,
    keyLocation: `https://convertify.work/${apiKey}.txt`,
    urlList: urls
});

const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);

    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('✅ SUCCESS! URLs submitted to IndexNow');
            console.log('📊 Search engines notified: Bing, Yandex, Seznam, Naver');
            console.log('\n⚠️  IMPORTANT: Create a file at the following location:');
            console.log(`   https://convertify.work/${apiKey}.txt`);
            console.log(`   File content: ${apiKey}`);
            console.log('\n   This proves you own the domain.');
        } else if (res.statusCode === 202) {
            console.log('✅ SUCCESS! URLs accepted for processing');
        } else {
            console.log('❌ Failed:', responseData);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Note: IndexNow is a free service supported by multiple search engines');
    console.log('   It helps speed up indexing on Bing, Yandex, and others.');
});

req.write(data);
req.end();
