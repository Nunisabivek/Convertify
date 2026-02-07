#!/usr/bin/env node
/**
 * Script to add BreadcrumbSchema and SoftwareApplicationSchema to all tool pages
 * Run with: node scripts/add-schemas-to-tools.js
 */

const fs = require('fs');
const path = require('path');

// List of all tool pages (excluding non-tool pages)
const toolPages = [
    'merge-pdf',
    'split-pdf',
    'compress-pdf',
    'jpg-to-pdf',
    'word-to-pdf',
    'pdf-to-word',
    'excel-to-pdf',
    'pdf-to-excel',
    'pdf-to-jpg',
    'pdf-to-png',
    'png-to-pdf',
    'pdf-to-text',
    'text-to-pdf',
    'powerpoint-to-pdf',
    'pdf-to-powerpoint',
    'pdf-to-pdfa',
    'html-to-pdf',
    'ocr-pdf',
    'edit-pdf',
    'organize-pdf',
    'rotate-pdf',
    'crop-pdf',
    'watermark-pdf',
    'sign-pdf',
    'protect-pdf',
    'unlock-pdf',
    'redact-pdf',
    'compare-pdf',
    'repair-pdf',
    'add-page-numbers',
    'delete-pdf-pages',
    'reorder-pdf'
];

// Tool name mapping (slug to display name)
const toolNames = {
    'merge-pdf': 'PDF Merger',
    'split-pdf': 'PDF Splitter',
    'compress-pdf': 'PDF Compressor',
    'jpg-to-pdf': 'JPG to PDF Converter',
    'word-to-pdf': 'Word to PDF Converter',
    'pdf-to-word': 'PDF to Word Converter',
    'excel-to-pdf': 'Excel to PDF Converter',
    'pdf-to-excel': 'PDF to Excel Converter',
    'pdf-to-jpg': 'PDF to JPG Converter',
    'pdf-to-png': 'PDF to PNG Converter',
    'png-to-pdf': 'PNG to PDF Converter',
    'pdf-to-text': 'PDF to Text Converter',
    'text-to-pdf': 'Text to PDF Converter',
    'powerpoint-to-pdf': 'PowerPoint to PDF Converter',
    'pdf-to-powerpoint': 'PDF to PowerPoint Converter',
    'pdf-to-pdfa': 'PDF to PDF/A Converter',
    'html-to-pdf': 'HTML to PDF Converter',
    'ocr-pdf': 'OCR PDF Tool',
    'edit-pdf': 'PDF Editor',
    'organize-pdf': 'PDF Organizer',
    'rotate-pdf': 'PDF Rotator',
    'crop-pdf': 'PDF Cropper',
    'watermark-pdf': 'PDF Watermark Tool',
    'sign-pdf': 'PDF Signature Tool',
    'protect-pdf': 'PDF Password Protector',
    'unlock-pdf': 'PDF Unlocker',
    'redact-pdf': 'PDF Redaction Tool',
    'compare-pdf': 'PDF Comparison Tool',
    'repair-pdf': 'PDF Repair Tool',
    'add-page-numbers': 'PDF Page Numbering Tool',
    'delete-pdf-pages': 'PDF Page Deleter',
    'reorder-pdf': 'PDF Page Reorder Tool'
};

function addSchemasToToolPage(toolSlug) {
    const pagePath = path.join(__dirname, '..', 'src', 'app', toolSlug, 'page.tsx');

    if (!fs.existsSync(pagePath)) {
        console.log(`⚠️  Page not found: ${toolSlug}`);
        return false;
    }

    let content = fs.readFileSync(pagePath, 'utf8');

    // Check if schemas are already added
    if (content.includes('BreadcrumbSchema') && content.includes('SoftwareApplicationSchema')) {
        console.log(`✓ Schemas already exist: ${toolSlug}`);
        return true;
    }

    // Add imports if not present
    if (!content.includes('BreadcrumbSchema')) {
        const importLine = 'import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"';
        const howToImportIndex = content.indexOf('import { HowToSchema }');
        if (howToImportIndex !== -1) {
            const insertIndex = content.indexOf('\n', howToImportIndex) + 1;
            content = content.slice(0, insertIndex) + importLine + '\n' + content.slice(insertIndex);
        }
    }

    if (!content.includes('SoftwareApplicationSchema')) {
        const importLine = 'import { SoftwareApplicationSchema } from "@/components/seo/software-schema"';
        const breadcrumbImportIndex = content.indexOf('import { BreadcrumbSchema }');
        if (breadcrumbImportIndex !== -1) {
            const insertIndex = content.indexOf('\n', breadcrumbImportIndex) + 1;
            content = content.slice(0, insertIndex) + importLine + '\n' + content.slice(insertIndex);
        }
    }

    // Add schemas to the component
    const toolName = toolNames[toolSlug] || toolSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const displayName = toolSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const schemaCode = `            {/* Structured Data Schemas */}
            <BreadcrumbSchema 
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "${displayName}", url: "/${toolSlug}" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="${toolName}"
                toolSlug="${toolSlug}"
                description={seoData.description}
            />
            
`;

    // Find the return statement and add schemas after the opening div
    const returnMatch = content.match(/return \(\s*<div className="flex flex-col items-center">\s*/);
    if (returnMatch) {
        const insertIndex = returnMatch.index + returnMatch[0].length;
        content = content.slice(0, insertIndex) + '\n' + schemaCode + content.slice(insertIndex);

        // Write back to file
        fs.writeFileSync(pagePath, content, 'utf8');
        console.log(`✅ Added schemas to: ${toolSlug}`);
        return true;
    } else {
        console.log(`❌ Could not find return statement in: ${toolSlug}`);
        return false;
    }
}

// Main execution
console.log('🚀 Adding BreadcrumbSchema and SoftwareApplicationSchema to all tool pages...\n');

let successCount = 0;
let skipCount = 0;
let failCount = 0;

toolPages.forEach(toolSlug => {
    const result = addSchemasToToolPage(toolSlug);
    if (result === true) {
        successCount++;
    } else if (result === false) {
        failCount++;
    } else {
        skipCount++;
    }
});

console.log('\n' + '='.repeat(70));
console.log('📊 SUMMARY');
console.log('='.repeat(70));
console.log(`✅ Successfully updated: ${successCount} pages`);
console.log(`⚠️  Skipped (already done): ${skipCount} pages`);
console.log(`❌ Failed: ${failCount} pages`);
console.log('='.repeat(70));
console.log('\n✨ Done! Run "npm run build" to verify the changes.');
