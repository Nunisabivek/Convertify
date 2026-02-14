// ============================================================================
// CONVERTIFY CHROME EXTENSION - POPUP LOGIC
// Search, navigation, usage tracking & monetization
// ============================================================================

const TOOLS_URL = 'https://convertify.work';
const FREE_DAILY_LIMIT = 3;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initUsageDisplay();
    initToolButtons();
    initSearch();
    initUpgradeButtons();
});

// ============================================================================
// USAGE TRACKING
// ============================================================================

async function initUsageDisplay() {
    const badge = document.getElementById('usageBadge');
    const usageText = document.getElementById('usageText');
    const upgradeBanner = document.getElementById('upgradeBanner');
    const proBanner = document.getElementById('proBanner');

    try {
        const data = await getUsageData();

        if (data.isPro) {
            usageText.textContent = '👑 Pro';
            badge.className = 'usage-badge pro';

            upgradeBanner.classList.add('hidden');
            proBanner.classList.remove('hidden');

            if (data.licenseKey) {
                // Show last 4 chars of license
                const last4 = data.licenseKey.slice(-4);
                document.getElementById('licenseKeyDisplay').textContent = `License: ••••-${last4}`;
            }
        } else {
            const remaining = Math.max(0, FREE_DAILY_LIMIT - data.usage);
            usageText.textContent = `${remaining}/${FREE_DAILY_LIMIT} left`;

            upgradeBanner.classList.remove('hidden');
            proBanner.classList.add('hidden');

            if (remaining === 0) {
                badge.className = 'usage-badge expired';
            } else if (remaining === 1) {
                badge.className = 'usage-badge warning';
            } else {
                badge.className = 'usage-badge';
            }
        }
    } catch (e) {
        // Extension API not available (testing in browser)
        usageText.textContent = `${FREE_DAILY_LIMIT}/${FREE_DAILY_LIMIT} left`;
    }
}

function getUsageData() {
    return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ type: 'CHECK_USAGE' }, (response) => {
                resolve(response || { usage: 0, limit: FREE_DAILY_LIMIT, isPro: false, licenseKey: null, canUse: true });
            });
        } else {
            // Fallback for testing
            resolve({ usage: 0, limit: FREE_DAILY_LIMIT, isPro: false, licenseKey: null, canUse: true });
        }
    });
}

function incrementUsage() {
    return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ type: 'INCREMENT_USAGE' }, (response) => {
                resolve(response);
            });
        } else {
            resolve({ success: true });
        }
    });
}

// ============================================================================
// TOOL BUTTONS
// ============================================================================

function initToolButtons() {
    // Quick action buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => handleToolClick(btn.dataset.tool));
    });

    // Full tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => handleToolClick(btn.dataset.tool));
    });
}

async function handleToolClick(toolSlug) {
    const data = await getUsageData();

    if (!data.isPro && data.usage >= FREE_DAILY_LIMIT) {
        showLimitModal();
        return;
    }

    // Increment usage
    await incrementUsage();

    // Open tool on convertify.work
    const url = `${TOOLS_URL}/${toolSlug}?from=extension`;

    if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url });
    } else {
        window.open(url, '_blank');
    }

    // Refresh usage display
    initUsageDisplay();
}

// ============================================================================
// SEARCH
// ============================================================================

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const toolsContainer = document.getElementById('toolsContainer');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        filterTools(query);
    });

    // Auto-focus search
    searchInput.focus();
}

function filterTools(query) {
    const sections = document.querySelectorAll('.section');
    const allToolBtns = document.querySelectorAll('.tool-btn');
    const quickBtns = document.querySelectorAll('.quick-btn');
    let anyVisible = false;

    if (!query) {
        // Show everything
        sections.forEach(s => s.classList.remove('hidden'));
        allToolBtns.forEach(b => b.classList.remove('hidden'));
        quickBtns.forEach(b => b.style.display = '');
        removeNoResults();
        return;
    }

    // Hide quick actions during search
    const quickSection = sections[0];
    quickSection.classList.add('hidden');

    // Filter tool buttons
    sections.forEach((section, index) => {
        if (index === 0) return; // Skip quick actions

        let sectionHasVisible = false;

        section.querySelectorAll('.tool-btn').forEach(btn => {
            const toolName = btn.querySelector('.tool-name').textContent.toLowerCase();
            const toolDesc = btn.querySelector('.tool-desc').textContent.toLowerCase();
            const toolSlug = btn.dataset.tool.toLowerCase().replace(/-/g, ' ');

            const matches = toolName.includes(query) ||
                toolDesc.includes(query) ||
                toolSlug.includes(query);

            if (matches) {
                btn.classList.remove('hidden');
                sectionHasVisible = true;
                anyVisible = true;
            } else {
                btn.classList.add('hidden');
            }
        });

        section.classList.toggle('hidden', !sectionHasVisible);
    });

    // Show/hide no results
    if (!anyVisible) {
        showNoResults(query);
    } else {
        removeNoResults();
    }
}

function showNoResults(query) {
    removeNoResults();
    const container = document.getElementById('toolsContainer');
    const div = document.createElement('div');
    div.className = 'no-results';
    div.id = 'noResults';
    div.innerHTML = `
    <div class="no-results-emoji">🔍</div>
    <div class="no-results-text">No tools found for "${query}"</div>
  `;
    container.appendChild(div);
}

function removeNoResults() {
    const existing = document.getElementById('noResults');
    if (existing) existing.remove();
}

// ============================================================================
// UPGRADE / MONETIZATION
// ============================================================================

const CHECKOUT_URL = 'https://convertifiy.lemonsqueezy.com/checkout/buy/dfca0e79-4d34-4d1a-951c-6d677143ad3e';
const ACTIVATE_URL = 'https://api.lemonsqueezy.com/v1/licenses/activate';

function initUpgradeButtons() {
    // Open checkout
    const upgradeBtn = document.getElementById('upgradeBtn');
    const modalUpgradeBtn = document.getElementById('modalUpgradeBtn');

    [upgradeBtn, modalUpgradeBtn].forEach(btn => {
        if (btn) btn.addEventListener('click', openCheckout);
    });

    // Open License Modal
    const enterLicenseBtn = document.getElementById('enterLicenseBtn');
    const modalEnterLicenseBtn = document.getElementById('modalEnterLicenseBtn');

    [enterLicenseBtn, modalEnterLicenseBtn].forEach(btn => {
        if (btn) btn.addEventListener('click', showLicenseModal);
    });

    // Close License Modal
    document.getElementById('licenseCloseBtn').addEventListener('click', hideLicenseModal);

    // Activate Button
    document.getElementById('activateBtn').addEventListener('click', activateLicense);

    // Lost Key
    document.getElementById('lostKeyBtn').addEventListener('click', openCustomerPortal);

    // Manage Subscription
    document.getElementById('manageSubBtn').addEventListener('click', openCustomerPortal);

    // Handle Enter key in input
    document.getElementById('licenseInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') activateLicense();
    });
}

function openCheckout() {
    chrome.tabs.create({ url: CHECKOUT_URL });
}

function openCustomerPortal() {
    chrome.tabs.create({ url: 'https://convertifiy.lemonsqueezy.com/billing' });
}

function showLimitModal() {
    const modal = document.getElementById('limitModal');
    modal.style.display = 'flex';
}

function hideLimitModal() {
    const modal = document.getElementById('limitModal');
    modal.style.display = 'none';
}

function showLicenseModal() {
    hideLimitModal(); // Close potential other modal
    document.getElementById('licenseModal').style.display = 'flex';
    document.getElementById('licenseInput').focus();
}

function hideLicenseModal() {
    document.getElementById('licenseModal').style.display = 'none';
    document.getElementById('licenseError').style.display = 'none';
}

async function activateLicense() {
    const input = document.getElementById('licenseInput');
    const btn = document.getElementById('activateBtn');
    const errorMsg = document.getElementById('licenseError');
    const key = input.value.trim();

    if (!key) return;

    // UI Loading State
    btn.textContent = 'Verifying...';
    btn.classList.add('loading');
    errorMsg.style.display = 'none';
    input.disabled = true;

    try {
        const formData = new FormData();
        formData.append('license_key', key);
        formData.append('instance_name', 'Convertify Extension');

        const response = await fetch(ACTIVATE_URL, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.activated) {
            // Success!
            await setProStatus(true, key);
            hideLicenseModal();
            initUsageDisplay(); // Refresh UI
            alert('Success! Pro features unlocked. 🚀');
        } else {
            throw new Error(data.error || 'Invalid license key');
        }
    } catch (err) {
        errorMsg.textContent = err.message || 'Validation failed';
        errorMsg.style.display = 'block';

        // Reset UI
        btn.textContent = 'Activate License';
        btn.classList.remove('loading');
        input.disabled = false;
    }
}

function setProStatus(isPro, key) {
    return new Promise((resolve) => {
        chrome.storage.local.set({
            isPro: isPro,
            licenseKey: key
        }, () => {
            // Also notify background script
            chrome.runtime.sendMessage({ type: 'SET_PRO', key: key });
            resolve();
        });
    });
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

document.addEventListener('keydown', (e) => {
    // Escape to close modal
    if (e.key === 'Escape') {
        hideLimitModal();
    }

    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});
