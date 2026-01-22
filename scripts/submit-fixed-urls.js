const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'a29f8518-295e-44e3-a00c-469addc370ce2';

const HOST = 'convertify.work';
const KEY_LOCATION = `https://${HOST}/${API_KEY}.txt`;

// List of URLs we KNOW exist or have just fixed
const urlsToSubmit = [
    // Tools (All fixed/verified)
    `https://${HOST}/add-page-numbers`,
    `https://${HOST}/compare-pdf`,
    `https://${HOST}/crop-pdf`,
    `https://${HOST}/edit-pdf`,
    `https://${HOST}/html-to-pdf`,
    `https://${HOST}/jpg-to-pdf`,
    `https://${HOST}/ocr-pdf`,
    `https://${HOST}/organize-pdf`,
    `https://${HOST}/pdf-to-excel`,
    `https://${HOST}/pdf-to-pdfa`,
    `https://${HOST}/pdf-to-powerpoint`,
    `https://${HOST}/pdf-to-text`,
    `https://${HOST}/pdf-to-word`,
    `https://${HOST}/powerpoint-to-pdf`,
    `https://${HOST}/protect-pdf`,
    `https://${HOST}/redact-pdf`,
    `https://${HOST}/repair-pdf`,
    `https://${HOST}/rotate-pdf`,
    `https://${HOST}/sign-pdf`,
    `https://${HOST}/text-to-pdf`,
    `https://${HOST}/unlock-pdf`,
    `https://${HOST}/watermark-pdf`,
    `https://${HOST}/word-to-pdf`,
    `https://${HOST}/compress-pdf`,

    // Existing Blog Posts
    `https://${HOST}/blog/best-free-pdf-tools-2025`,
    `https://${HOST}/blog/compress-pdf-for-email-attachment`,
    `https://${HOST}/blog/compress-pdf-for-whatsapp`,
    `https://${HOST}/blog/compress-pdf-reduce-file-size`,
    `https://${HOST}/blog/convert-iphone-photos-to-pdf`,
    `https://${HOST}/blog/convert-jpg-to-pdf-online`,
    `https://${HOST}/blog/convert-word-to-pdf-keep-formatting`,
    `https://${HOST}/blog/how-to-merge-pdf-files-free`,
    `https://${HOST}/blog/merge-pdf-windows-10-without-software`,
    `https://${HOST}/blog/merge-pdf-without-adobe-acrobat`,
    `https://${HOST}/blog/pdf-tips-for-students`,
    `https://${HOST}/blog/pdf-to-jpg-convert-pages-images`,
    `https://${HOST}/blog/split-pdf-extract-pages-free`,
    `https://${HOST}/blog/merge-pdf-android-phone-free`,
    `https://${HOST}/blog/combine-scanned-documents-into-one-pdf`,
    `https://${HOST}/blog/compress-pdf-for-whatsapp-sharing`,
    `https://${HOST}/blog/reduce-pdf-size-without-losing-quality`
];

function submitToIndexNow() {
    try {
        const key = API_KEY;

        const data = JSON.stringify({
            host: HOST,
            key: key,
            keyLocation: KEY_LOCATION,
            urlList: urlsToSubmit
        });

        const options = {
            hostname: 'api.indexnow.org',
            port: 443,
            path: '/indexnow',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            console.log(`StatusCode: ${res.statusCode}`);
            res.on('data', (d) => {
                process.stdout.write(d);
            });
        });

        req.on('error', (error) => {
            console.error(error);
        });

        req.write(data);
        req.end();
        console.log(`Submitted ${urlsToSubmit.length} URLs to IndexNow.`);

    } catch (e) {
        console.error("Error reading API key or submitting:", e);
    }
}

submitToIndexNow();
