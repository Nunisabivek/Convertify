// Convertify extension: popup.
// Lists the tools, searches them (with synonyms), and opens the chosen tool on
// convertify.work. Relies on tools.js, which popup.html loads first.

'use strict';

const RATE_PROMPT_MIN_OPENS = 3;
const RATE_PROMPT_SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
const PLAY_STORE_LINK = PLAY_STORE_URL + '&referrer=' + encodeURIComponent('utm_source=chrome_extension&utm_medium=popup');

// Words people type that don't narrow the search.
const STOP_WORDS = new Set([
    'a', 'an', 'and', 'as', 'at', 'by', 'for', 'from', 'how', 'i', 'in', 'into', 'is', 'it', 'me', 'my',
    'of', 'on', 'online', 'or', 'the', 'to', 'tool', 'tools', 'with', 'free', 'file', 'files',
    'convert', 'converter', 'conversion',
]);

// Query word -> words the tools actually use.
const SYNONYMS = {
    combine: ['merge'], join: ['merge'], append: ['merge'], unite: ['merge'], concatenate: ['merge'], together: ['merge'],
    shrink: ['compress', 'resize'], reduce: ['compress'], smaller: ['compress'], small: ['compress'],
    minimize: ['compress'], minimise: ['compress'], optimize: ['compress'], optimise: ['compress'], lighter: ['compress'],
    kb: ['compress', 'fit'], mb: ['compress', 'fit'], size: ['compress', 'fit', 'resize'],
    docx: ['word'], doc: ['word'],
    xlsx: ['excel'], xls: ['excel'], spreadsheet: ['excel', 'csv'], sheet: ['excel'], sheets: ['excel'],
    pptx: ['powerpoint'], ppt: ['powerpoint'], slides: ['powerpoint'], slide: ['powerpoint'],
    presentation: ['powerpoint'], deck: ['powerpoint'],
    photo: ['jpg', 'png', 'image'], photos: ['jpg', 'png', 'image'], picture: ['jpg', 'png', 'image'],
    pictures: ['jpg', 'png', 'image'], pic: ['jpg', 'png', 'image'], pics: ['jpg', 'png', 'image'],
    image: ['jpg', 'png'], images: ['jpg', 'png', 'image'], img: ['jpg', 'png', 'image'],
    screenshot: ['png'], jpeg: ['jpg'],
    heif: ['heic'], iphone: ['heic'],
    tif: ['tiff'], txt: ['text'], md: ['markdown'],
    scanner: ['scan'], camera: ['scan'], webcam: ['scan'], paper: ['scan'],
    password: ['protect', 'unlock'], encrypt: ['protect'], lock: ['protect'], secure: ['protect'],
    decrypt: ['unlock'], unprotect: ['unlock'],
    signature: ['sign'], esign: ['sign'],
    blackout: ['redact'], censor: ['redact'], hide: ['redact'],
    turn: ['rotate'], flip: ['rotate'], sideways: ['rotate'], landscape: ['rotate'],
    number: ['numbers'], numbering: ['numbers'], paginate: ['numbers'],
    stamp: ['watermark'],
    rearrange: ['reorder', 'organize'], arrange: ['reorder', 'organize'], sort: ['reorder', 'organize'],
    order: ['reorder'], move: ['reorder'],
    remove: ['delete', 'unlock'], erase: ['delete'],
    annotate: ['edit'], highlight: ['edit'], draw: ['edit', 'sign'], write: ['edit'], fill: ['edit'], type: ['edit'],
    fix: ['repair'], corrupt: ['repair'], corrupted: ['repair'], broken: ['repair'], damaged: ['repair'], recover: ['repair'],
    diff: ['compare'], difference: ['compare'], differences: ['compare'],
    trim: ['crop'], margin: ['crop'], margins: ['crop'], cut: ['crop', 'split'],
    extract: ['split', 'text'], separate: ['split'],
    cad: ['autocad'], dwg: ['autocad'],
    bg: ['background'], transparent: ['background'], backdrop: ['background'],
    dimensions: ['resize'], scale: ['resize'], pixels: ['resize'], px: ['resize'], enlarge: ['resize'],
    id: ['passport'], visa: ['passport'],
    barcode: ['qr'],
    encode: ['base64'], decode: ['base64'], b64: ['base64'],
    web: ['html'], webpage: ['html'], website: ['html'],
    animated: ['gif'], animation: ['gif'], vector: ['svg'],
};
const SYNONYM_ENTRIES = Object.entries(SYNONYMS);

const CATEGORY_ICONS = {
    organize: '<rect x="8" y="3" width="12" height="15" rx="2"/><path d="M5 7v12a2 2 0 0 0 2 2h9"/>',
    edit: '<path d="M4 20h4L19.5 8.5a2.12 2.12 0 0 0-3-3L5 17v3Z"/><path d="m14.5 7.5 3 3"/>',
    'from-pdf': '<path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M13 3v6h6"/><path d="M9 15h6m-2.5-2.5L15 15l-2.5 2.5"/>',
    'to-pdf': '<path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M13 3v6h6"/><path d="M12 12v6m-2.5-2.5L12 18l2.5-2.5"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m21 15-5-5L5 20"/>',
    data: '<path d="M8 4H7a2 2 0 0 0-2 2v3.5a2 2 0 0 1-2 2v1a2 2 0 0 1 2 2V18a2 2 0 0 0 2 2h1"/><path d="M16 4h1a2 2 0 0 1 2 2v3.5a2 2 0 0 0 2 2v1a2 2 0 0 0-2 2V18a2 2 0 0 1-2 2h-1"/>',
};

const els = {
    search: document.getElementById('search'),
    shortcut: document.getElementById('shortcut'),
    recent: document.getElementById('recent'),
    recentTitle: document.getElementById('recentTitle'),
    recentList: document.getElementById('recentList'),
    results: document.getElementById('results'),
    status: document.getElementById('status'),
    rateCard: document.getElementById('rateCard'),
    ratePlay: document.getElementById('ratePlay'),
    rateExtension: document.getElementById('rateExtension'),
    rateLater: document.getElementById('rateLater'),
};

const searchIndex = TOOLS.map(tool => ({
    tool,
    nameWords: toWords(tool.name),
    keywordWords: toWords(tool.keywords),
    descWords: toWords(tool.desc),
}));

let shownSlugs = [];
let activeIndex = -1;
let recentSlugs = [];

init();

async function init() {
    const isMac = /mac/i.test(navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform);
    els.shortcut.textContent = isMac ? '⌘K' : 'Ctrl K';
    els.search.placeholder = `Search ${TOOLS.length} tools (try “combine”)`;

    els.search.addEventListener('input', render);
    els.search.addEventListener('keydown', onSearchKeydown);
    document.addEventListener('keydown', onDocumentKeydown);
    for (const list of [els.results, els.recentList]) {
        list.addEventListener('click', onToolClick);
        list.addEventListener('auxclick', onToolClick);
        // Keep focus in the search box so arrow keys keep working after a click.
        list.addEventListener('mousedown', event => event.preventDefault());
    }
    els.ratePlay.addEventListener('click', () => finishRatePrompt(PLAY_STORE_LINK));
    els.rateExtension.addEventListener('click', () => finishRatePrompt(CHROME_STORE_REVIEWS_URL));
    els.rateLater.addEventListener('click', snoozeRatePrompt);

    await loadState();
    render();
    els.search.focus();
}

async function loadState() {
    const data = await chrome.storage.local.get(['toolOpenCount', 'recentTools', 'ratePromptDone', 'ratePromptSnoozedUntil']);
    recentSlugs = (Array.isArray(data.recentTools) ? data.recentTools : []).filter(slug => TOOLS_BY_SLUG.has(slug));
    els.rateCard.hidden = !shouldShowRatePrompt(data, Date.now());
}

function shouldShowRatePrompt(data, now) {
    return (Number(data.toolOpenCount) || 0) >= RATE_PROMPT_MIN_OPENS
        && data.ratePromptDone !== true
        && now >= (Number(data.ratePromptSnoozedUntil) || 0);
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function render() {
    const query = els.search.value;
    els.results.replaceChildren();
    shownSlugs = [];

    const hasQuery = query.trim() !== '';
    renderRecent(!hasQuery);

    if (!hasQuery) {
        for (const category of CATEGORIES) {
            const tools = TOOLS.filter(tool => tool.cat === category.id);
            const group = document.createElement('div');
            group.className = 'group';
            group.setAttribute('role', 'group');
            group.setAttribute('aria-labelledby', 'cat-' + category.id);
            const label = document.createElement('div');
            label.className = 'group-title';
            label.id = 'cat-' + category.id;
            label.textContent = category.label;
            group.append(label, ...tools.map(createOption));
            els.results.append(group);
        }
        els.status.textContent = '';
        setActive(-1);
        return;
    }

    const matches = searchTools(query);
    if (matches.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty';
        const title = document.createElement('p');
        title.className = 'empty-title';
        title.textContent = `No tool matches “${query.trim()}”`;
        const hint = document.createElement('p');
        hint.textContent = 'Try a format or an action, like “pdf”, “jpg”, “merge” or “compress”.';
        empty.append(title, hint);
        els.results.append(empty);
        els.status.textContent = 'No tools found';
        setActive(-1);
        return;
    }

    els.results.append(...matches.map(createOption));
    els.status.textContent = matches.length === 1 ? '1 tool found' : `${matches.length} tools found`;
    setActive(0);
}

function renderRecent(visible) {
    els.recent.hidden = !visible;
    if (!visible) return;
    const usingRecent = recentSlugs.length > 0;
    els.recentTitle.textContent = usingRecent ? 'Recent' : 'Popular';
    els.recentList.replaceChildren(...(usingRecent ? recentSlugs : POPULAR_TOOLS).map(slug => {
        const tool = TOOLS_BY_SLUG.get(slug);
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.dataset.slug = slug;
        chip.title = tool.desc;
        const name = document.createElement('span');
        name.className = 'chip-name';
        name.textContent = tool.name;
        chip.append(createIcon(tool.cat), name);
        return chip;
    }));
}

function createOption(tool) {
    shownSlugs.push(tool.slug);
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'tool';
    option.id = 'opt-' + tool.slug;
    option.dataset.slug = tool.slug;
    option.tabIndex = -1;
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', 'false');

    const text = document.createElement('span');
    text.className = 'tool-text';
    const name = document.createElement('span');
    name.className = 'tool-name';
    name.textContent = tool.name;
    const desc = document.createElement('span');
    desc.className = 'tool-desc';
    desc.textContent = tool.desc;
    text.append(name, desc);

    option.append(createIcon(tool.cat), text);
    return option;
}

function createIcon(category) {
    const icon = document.createElement('span');
    icon.className = 'icon icon-' + category;
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
        + CATEGORY_ICONS[category] + '</svg>';
    return icon;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

function toWords(text) {
    return text.toLowerCase().replace(/×/g, 'x').split(/[^a-z0-9]+/).filter(Boolean);
}

function queryTokens(query) {
    // "100kb", "100 kb" and "2.5mb" all mean "a size in KB/MB".
    const normalized = query.toLowerCase().replace(/\b\d+(?:\.\d+)?\s*(k|m)b?\b/g, ' $1b ');
    const words = toWords(normalized);
    const meaningful = words.filter(word => !STOP_WORDS.has(word));
    return meaningful.length ? meaningful : words;
}

// The token itself plus the synonyms of every word it is (or starts) spelling.
function expandToken(token) {
    const variants = new Set([token]);
    for (const [word, targets] of SYNONYM_ENTRIES) {
        if (word === token || (token.length >= 3 && word.startsWith(token))) {
            variants.add(word);
            for (const target of targets) variants.add(target);
        }
    }
    return variants;
}

function searchTools(query) {
    const tokens = queryTokens(query).map(token => ({ token, variants: expandToken(token) }));
    if (tokens.length === 0) return [];
    return searchIndex
        .map((entry, order) => ({ tool: entry.tool, order, score: scoreEntry(entry, tokens) }))
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score || a.order - b.order)
        .map(result => result.tool);
}

// Every token must match. Name beats keywords beats description; the typed word
// beats a synonym; tokens found in the name in the typed order earn a bonus, so
// "pdf to jpg" ranks PDF to JPG above JPG to PDF.
function scoreEntry(entry, tokens) {
    let score = 0;
    let namePositions = [];
    for (const { token, variants } of tokens) {
        let best = 0;
        let namePos = -1;
        for (const variant of variants) {
            const exact = variant === token ? 1 : 0;
            const pos = entry.nameWords.findIndex(word => word.startsWith(variant));
            if (pos >= 0) {
                best = Math.max(best, 5 + exact);
                if (namePos < 0 || pos < namePos) namePos = pos;
            } else if (entry.keywordWords.some(word => word.startsWith(variant))) {
                best = Math.max(best, 3 + exact);
            } else if (entry.descWords.some(word => word.startsWith(variant))) {
                best = Math.max(best, 1 + exact);
            }
        }
        if (best === 0) return 0;
        score += best;
        if (namePos >= 0) namePositions.push(namePos);
    }
    if (namePositions.length > 1 && namePositions.every((pos, i) => i === 0 || pos > namePositions[i - 1])) {
        score += 2;
    }
    return score;
}

// ---------------------------------------------------------------------------
// Keyboard and clicks
// ---------------------------------------------------------------------------

function onDocumentKeydown(event) {
    if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        els.search.focus();
        els.search.select();
    }
}

function onSearchKeydown(event) {
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            moveActive(1);
            break;
        case 'ArrowUp':
            event.preventDefault();
            moveActive(-1);
            break;
        case 'Enter': {
            const slug = shownSlugs[activeIndex];
            if (slug) {
                event.preventDefault();
                openTool(slug, event.ctrlKey || event.metaKey);
            }
            break;
        }
        case 'Escape':
            if (els.search.value) {
                event.preventDefault();
                els.search.value = '';
                render();
            }
            break;
    }
}

function moveActive(step) {
    if (shownSlugs.length === 0) return;
    const next = activeIndex < 0
        ? (step > 0 ? 0 : shownSlugs.length - 1)
        : (activeIndex + step + shownSlugs.length) % shownSlugs.length;
    setActive(next);
}

function setActive(index) {
    const previous = document.getElementById('opt-' + shownSlugs[activeIndex]);
    if (previous) {
        previous.classList.remove('active');
        previous.setAttribute('aria-selected', 'false');
    }
    activeIndex = index;
    const current = document.getElementById('opt-' + shownSlugs[index]);
    if (current) {
        current.classList.add('active');
        current.setAttribute('aria-selected', 'true');
        els.search.setAttribute('aria-activedescendant', current.id);
        current.scrollIntoView({ block: 'nearest' });
    } else {
        els.search.removeAttribute('aria-activedescendant');
    }
}

function onToolClick(event) {
    const target = event.target.closest('[data-slug]');
    if (!target) return;
    if (event.type === 'auxclick' && event.button !== 1) return;
    openTool(target.dataset.slug, event.type === 'auxclick' || event.ctrlKey || event.metaKey);
}

// A foreground tab closes the popup, so storage is written before the tab opens.
async function openTool(slug, inBackground) {
    await recordToolOpen(slug);
    await chrome.tabs.create({ url: siteUrl(slug, 'popup'), active: !inBackground });
    if (inBackground) {
        await loadState();
        renderRecent(els.search.value.trim() === '');
    }
}

// ---------------------------------------------------------------------------
// Rating prompt
// ---------------------------------------------------------------------------

async function finishRatePrompt(url) {
    await chrome.storage.local.set({ ratePromptDone: true });
    els.rateCard.hidden = true;
    await chrome.tabs.create({ url });
}

async function snoozeRatePrompt() {
    await chrome.storage.local.set({ ratePromptSnoozedUntil: Date.now() + RATE_PROMPT_SNOOZE_MS });
    els.rateCard.hidden = true;
    els.search.focus();
}
