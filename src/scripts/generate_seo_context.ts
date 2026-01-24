import fs from 'fs';
import { blogPosts } from '../lib/blog-data';
import { toolSeoData } from '../lib/seo-data';

const OUTPUT_FILE = 'convertify_seo_context.md';

async function generate() {
    let content = "# Convertify Website Content for SEO Analysis\n\n";
    content += "This document contains all the text content, SEO metadata, and blog posts from the Convertify website. Used for analysis in NotebookLM.\n\n";

    content += "## 1. Tool Pages SEO Data\n";
    content += "The following section lists every tool available on the site, along with its meta title, description, keywords, and on-page FAQs.\n\n"

    Object.entries(toolSeoData).forEach(([key, data]) => {
        content += `### Tool: ${key}\n`;
        content += `**Title:** ${data.title}\n`;
        content += `**Description:** ${data.description}\n`;
        content += `**H1:** ${data.h1}\n`;
        content += `**Keywords:** ${data.keywords.join(', ')}\n`;
        content += `**FAQs:**\n`;
        data.faqs.forEach(faq => {
            content += `- Q: ${faq.question}\n  A: ${faq.answer}\n`;
        });
        content += "\n";
    });

    content += "## 2. Blog Posts & Tutorials\n";
    content += "The following section contains full-text blog posts written for SEO purposes.\n\n"

    blogPosts.forEach(post => {
        content += `### Blog Post: ${post.title}\n`;
        content += `**Slug:** ${post.slug}\n`;
        content += `**Target Keywords:** ${post.keywords.join(', ')}\n`;
        content += `**Excerpt:** ${post.excerpt}\n`;
        content += `**Content:**\n${post.content}\n`;
        if (post.faqs) {
            content += `**Post FAQs:**\n`;
            post.faqs.forEach(faq => {
                content += `- Q: ${faq.question}\n  A: ${faq.answer}\n`;
            });
        }
        content += "\n---\n\n";
    });

    fs.writeFileSync(OUTPUT_FILE, content);
    console.log(`Successfully generated ${OUTPUT_FILE} with ${content.length} characters.`);
}

generate();
