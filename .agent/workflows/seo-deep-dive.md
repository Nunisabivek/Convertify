---
description: Deep-dive SEO improvement loop combining GSC, PageAudit, Perplexity Deep Research, and NotebookLM Synthesis Workspace.
---

# SEO Deep Dive & Optimization Workflow (Perplexity + NotebookLM Edition)

This workflow automates the cycle of finding low-performing pages, researching competitor patterns via Perplexity Deep Research, and synthesizing high-converting content strategies using NotebookLM.

## 🌀 Phase 1: Identification & Batch Selection (Agent)
1. **GSC Performance Scrape**:
   - Open Google Search Console.
   - Filter "Performance" -> "Pages" for the last 28 days.
   - Export or list the top 10 pages with **High Impressions (>1000)** but **Low CTR (<2%)**.
   - For each page, identify "Anchor Keywords" (ranking #1-3) and "Missed Opportunities" (ranking #10-50).
2. **Current State Baseline**:
   - Run a `PageAudit.com` technical check for each selected URL.
   - Record baseline Title, Description, and word count.

## 🔍 Phase 2: Perplexity Deep Research (agent)
For each page in the batch, the Agent will generate a **Deep Research Prompt**:
1. **User Action**: 
   - Go to Perplexity.ai and toggle **"Deep Research" / "Pro"** on.
   - Paste the prompt provided by the Agent (example below).
   - **Crucial**: Verify citations and only keep accurate competitor URLs.
   - Copy the final Perplexity report or URLs.

> **Agent-Generated Prompt Format**:
> *"Analyze the top 5 competitors for [URL]. What specific semantic keywords, content structures, and user 'pain point' questions are driving their conversions? Focus on [Specific Niche, e.g., '100KB compression']."*

## 🧠 Phase 3: NotebookLM Synthesis Workspace (Agent)
Instead of just copying keywords, we use NotebookLM to create a finished product.
1. **Importing Sources**:
   - Upload the Perplexity report text or URLs into a new NotebookLM Notebook.
   - Upload the GSC "Opportunity Queries" as a text source.
2. **NotebookLM Instructions**:
   - Use the NotebookLM chat to ask:
     - *"Review these sources and identify patterns in the top-performing competitor content."*
     - *"Generate a step-by-step 'High-Conversion Content Plan' for my page [Page Title] based strictly on these patterns."*
   - Paste the resulting "Content Plan" back into the chat for the Agent to implement.

## 🛠️ Phase 4: Automated Code Implementation (Agent)
Once the "Content Plan" is provided, the Agent performs a surgical update:
1. **Metadata Optimization**:
   - Update `src/lib/seo-data.ts`: Shorten titles (<60 chars), use high-intent keywords in descriptions.
2. **Semantic Content Injection**:
   - Update `src/lib/tool-content-data.ts`: Add specific FAQ questions and benefit bullets identified by NotebookLM.
3. **Template Fixes**:
   - Ensure a single H1 tag exists.
   - Add the "How it Works" or "Security" sections if missing.

## 🔄 Phase 5: Batch Loop (Repeat for All Pages)
1. **Check Build**: Run `npm run build` to verify all updates.
2. **Select Next Page**: Move to the next page in the identification list and repeat Phase 2-4.
3. **Index Request**: After pushing code, go to GSC and manually request a recrawl for the top 5 most important pages.