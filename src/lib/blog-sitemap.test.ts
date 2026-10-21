import assert from 'node:assert/strict'
import { INDEXED_BLOG_SLUGS, allIndexableBlogPosts } from './blog-data.ts'
import { INDEXABLE_BLOG_SITEMAP_ENTRIES } from './blog-sitemap-entries.ts'

// The sitemap, the blog index and the per-post robots tag must agree, or
// Google gets a sitemap URL that says noindex (or an indexable post it can't find).
const sitemap = INDEXABLE_BLOG_SITEMAP_ENTRIES.map((e) => e.slug).sort()
const listed = allIndexableBlogPosts.map((p) => p.slug).sort()

assert.deepEqual(listed, [...INDEXED_BLOG_SLUGS].sort(), 'every allowlisted slug must exist and pass the word floor')
assert.deepEqual(sitemap, listed, 'blog-sitemap-entries.ts must list exactly the indexable posts')

console.log(`blog sitemap tests passed (${listed.length} indexable posts)`)
