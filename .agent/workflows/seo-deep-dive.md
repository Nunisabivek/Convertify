---
description: Deep-dive SEO improvement loop combining GSC, PageAudit, Perplexity, and NotebookLM.
---

# SEO Deep Dive & Optimization Workflow

This workflow automates the analysis of underperforming pages using Google Search Console and PageAudit, leverages User-assisted Perplexity search for keywords, and synthesizes a strategy via NotebookLM to implement code fixes.

## 1. GSC Analysis (Agent)
[ ] **Open Google Search Console**
   - Navigate to "Performance" -> "Pages".
   - Sort by **Impressions** to find high-visibility/low-CTR pages.
   - Select the top candidate page.
[ ] **Analyze Queries ('Right' vs 'Wrong')**
   - Switch to the "Queries" tab for that specific page.
   - **Identify 'What is Wrong'**: Find keywords with **High Impressions but Low CTR/Position** (>10). These are your primary opportunities.
   - **Identify 'What is Right'**: Note keywords with **High Impressions AND High Position** (<5). Ensure these are preserved and used as semantic anchors.
   - *Output*: List of Opportunity Keywords (Wrong) and Anchor Keywords (Right).

## 2. Technical Audit (Agent)
[ ] **Run PageAudit**
   - Navigate to `pageaudit.com`.
   - Audit the specific URL identifying in Step 1.
   - Capture "Critical Errors" (Title length, H1, missing alt tags).
   - *Output*: List of technical fixes needed.

## 3. Semantic Search (User Action Required)
[ ] **Agent Generates Prompt**: The agent will create a specific query for Perplexity based on Step 1 & 2 (e.g., "LSI keywords for [Topic]...").
[ ] **User Action**:
   - Go to Perplexity.ai.
   - Paste the agent's prompt.
   - Copy the results.
   - Paste the results back into the chat.

## 4. Strategy Synthesis (NotebookLM)
[ ] **Agent Prepares Data**: The agent will compile:
   - GSC Query Data
   - PageAudit Errors
   - Perplexity Keywords (from User)
[ ] **User/Agent Action**:
   - If NotebookLM is open/accessible: The user (or agent) pastes this compiled data into NotebookLM to generate a "Content Optimization Plan".
   - *Alternative*: The Agent uses its own LLM to synthesize this data into a specific coding plan.

## 5. Code Implementation (Agent)
[ ] **Update Codebase**:
   - `src/lib/seo-data.ts`: Update Title, Description, Keywords.
   - `src/app/[tool]/page.tsx`: Update H1 or content structure.
   - `src/lib/tool-content-data.ts`: Enhance descriptions/features with LSI keywords.
[ ] **Verify**: Run `npm run build` to ensure no errors.
