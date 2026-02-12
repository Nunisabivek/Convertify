// Convertify Extension - Background Service Worker
// Handles context menus, usage tracking, and premium checks

const FREE_DAILY_LIMIT = 3;
const TOOLS_URL = 'https://convertify.work';

// ============================================================================
// CONTEXT MENUS
// ============================================================================

chrome.runtime.onInstalled.addListener(() => {
    // Create parent menu
    chrome.contextMenus.create({
        id: 'convertify-parent',
        title: '🔧 Convertify Tools',
        contexts: ['page', 'image', 'link']
    });

    // Image context menus
    chrome.contextMenus.create({
        id: 'convert-image-to-pdf',
        parentId: 'convertify-parent',
        title: '📸 Convert Image to PDF',
        contexts: ['image']
    });

    // Page context menus
    chrome.contextMenus.create({
        id: 'save-page-as-pdf',
        parentId: 'convertify-parent',
        title: '📄 Save Page as PDF',
        contexts: ['page']
    });

    // Separator
    chrome.contextMenus.create({
        id: 'separator-1',
        parentId: 'convertify-parent',
        type: 'separator',
        contexts: ['page', 'image', 'link']
    });

    // Quick tools
    chrome.contextMenus.create({
        id: 'open-merge',
        parentId: 'convertify-parent',
        title: '📎 Merge PDFs',
        contexts: ['page']
    });

    chrome.contextMenus.create({
        id: 'open-compress',
        parentId: 'convertify-parent',
        title: '📦 Compress PDF',
        contexts: ['page']
    });

    chrome.contextMenus.create({
        id: 'open-all-tools',
        parentId: 'convertify-parent',
        title: '🛠️ All 30+ Tools →',
        contexts: ['page', 'image', 'link']
    });

    // Initialize usage tracking
    chrome.storage.local.get(['dailyUsage', 'lastResetDate', 'isPro'], (data) => {
        const today = new Date().toDateString();
        if (data.lastResetDate !== today) {
            chrome.storage.local.set({
                dailyUsage: 0,
                lastResetDate: today
            });
        }
        if (data.isPro === undefined) {
            chrome.storage.local.set({ isPro: false });
        }
    });
});

// ============================================================================
// CONTEXT MENU CLICKS
// ============================================================================

chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case 'convert-image-to-pdf':
            chrome.tabs.create({ url: `${TOOLS_URL}/jpg-to-pdf?from=extension` });
            break;
        case 'save-page-as-pdf':
            chrome.tabs.create({ url: `${TOOLS_URL}/html-to-pdf?url=${encodeURIComponent(tab.url)}&from=extension` });
            break;
        case 'open-merge':
            chrome.tabs.create({ url: `${TOOLS_URL}/merge-pdf?from=extension` });
            break;
        case 'open-compress':
            chrome.tabs.create({ url: `${TOOLS_URL}/compress-pdf?from=extension` });
            break;
        case 'open-all-tools':
            chrome.tabs.create({ url: `${TOOLS_URL}/all-tools?from=extension` });
            break;
    }
});

// ============================================================================
// USAGE TRACKING & LIMITS
// ============================================================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'CHECK_USAGE') {
        chrome.storage.local.get(['dailyUsage', 'lastResetDate', 'isPro'], (data) => {
            const today = new Date().toDateString();
            let usage = data.dailyUsage || 0;

            // Reset if new day
            if (data.lastResetDate !== today) {
                usage = 0;
                chrome.storage.local.set({ dailyUsage: 0, lastResetDate: today });
            }

            sendResponse({
                usage: usage,
                limit: FREE_DAILY_LIMIT,
                isPro: data.isPro || false,
                canUse: (data.isPro || false) || usage < FREE_DAILY_LIMIT
            });
        });
        return true; // async
    }

    if (message.type === 'INCREMENT_USAGE') {
        chrome.storage.local.get(['dailyUsage', 'isPro'], (data) => {
            if (!data.isPro) {
                chrome.storage.local.set({ dailyUsage: (data.dailyUsage || 0) + 1 });
            }
            sendResponse({ success: true });
        });
        return true;
    }

    if (message.type === 'UPGRADE_PRO') {
        chrome.tabs.create({ url: `${TOOLS_URL}/pricing?from=extension&upgrade=true` });
        sendResponse({ success: true });
        return true;
    }

    if (message.type === 'SET_PRO') {
        chrome.storage.local.set({ isPro: true });
        sendResponse({ success: true });
        return true;
    }
});
