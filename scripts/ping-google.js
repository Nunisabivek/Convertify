const http = require('http'); // Using HTTP instead of HTTPS

const sitemapUrl = "https://convertify.work/sitemap.xml";
const encodedSitemap = encodeURIComponent(sitemapUrl);
const pingUrl = `http://www.google.com/ping?sitemap=${encodedSitemap}`;

console.log(`📡 Pinging Google (HTTP) with sitemap: ${sitemapUrl}`);

http.get(pingUrl, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('✅ Success! Google has been notified.');
        } else {
            console.error(`❌ Failed with status code: ${res.statusCode}`);
            console.log('Google has officially deprecated the public ping endpoint.');
            console.log('Recommendation: Rely on internal links + IndexNow protocol.');
        }
    });
}).on("error", (err) => {
    console.error("❌ Error: " + err.message);
});
