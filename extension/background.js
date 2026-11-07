// Convertify extension: service worker.
// Cleans up storage left by v1 and provides a right-click menu that opens tools
// on convertify.work. The menu only opens a page; it never sends the current
// page, image or link anywhere.

importScripts('tools.js');

// v1 kept a paid tier and a daily limit in these keys. 2.0 is fully free.
const LEGACY_STORAGE_KEYS = ['isPro', 'licenseKey', 'dailyUsage', 'lastResetDate'];

const MENU_PARENT_ID = 'convertify';
const MENU_ALL_TOOLS_ID = 'all-tools';
const MENU_TOOL_PREFIX = 'tool:';

chrome.runtime.onInstalled.addListener(handleInstalled);
chrome.contextMenus.onClicked.addListener(handleMenuClick);

function handleInstalled() {
    return Promise.all([
        chrome.storage.local.remove(LEGACY_STORAGE_KEYS),
        rebuildContextMenus(),
    ]);
}

// Menus persist across updates, so clear them first to avoid duplicate-id errors.
function rebuildContextMenus() {
    return new Promise(resolve => {
        chrome.contextMenus.removeAll(() => {
            const contexts = ['page'];
            createMenu({ id: MENU_PARENT_ID, title: 'Convertify', contexts });
            for (const slug of POPULAR_TOOLS) {
                createMenu({
                    id: MENU_TOOL_PREFIX + slug,
                    parentId: MENU_PARENT_ID,
                    title: `Open ${TOOLS_BY_SLUG.get(slug).name}`,
                    contexts,
                });
            }
            createMenu({ id: 'separator', parentId: MENU_PARENT_ID, type: 'separator', contexts });
            createMenu({ id: MENU_ALL_TOOLS_ID, parentId: MENU_PARENT_ID, title: 'Open all tools', contexts }, resolve);
        });
    });
}

function createMenu(properties, done) {
    chrome.contextMenus.create(properties, () => {
        if (chrome.runtime.lastError) {
            console.error(`Context menu "${properties.id}":`, chrome.runtime.lastError.message);
        }
        if (done) done();
    });
}

async function handleMenuClick(info, tab) {
    const id = String(info.menuItemId);
    let path;
    if (id === MENU_ALL_TOOLS_ID) {
        path = 'all-tools';
    } else if (id.startsWith(MENU_TOOL_PREFIX) && TOOLS_BY_SLUG.has(id.slice(MENU_TOOL_PREFIX.length))) {
        path = id.slice(MENU_TOOL_PREFIX.length);
        await recordToolOpen(path);
    } else {
        return;
    }

    const createProperties = { url: siteUrl(path, 'context_menu') };
    if (tab && tab.id >= 0) {
        createProperties.windowId = tab.windowId;
        createProperties.index = tab.index + 1;
    }
    await chrome.tabs.create(createProperties);
}
