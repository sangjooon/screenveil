const i18n = self.PeekProofI18n;

let currentTab = null;
let currentStatus = null;
let languageSetting = 'auto';

const titleEl = document.getElementById('titleEl');
const subtitleEl = document.getElementById('subtitleEl');
const supportedCard = document.getElementById('supported');
const registerCard = document.getElementById('registerCard');
const unsupportedCard = document.getElementById('unsupported');
const siteName = document.getElementById('siteName');
const siteUrl = document.getElementById('siteUrl');
const siteToggle = document.getElementById('siteToggle');
const pinWarning = document.getElementById('pinWarning');
const hotkeyInfo = document.getElementById('hotkeyInfo');
const registerTitle = document.getElementById('registerTitle');
const registerBody = document.getElementById('registerBody');
const registerDomain = document.getElementById('registerDomain');
const registerButton = document.getElementById('registerButton');
const unsupportedTitle = document.getElementById('unsupportedTitle');
const unsupportedBody = document.getElementById('unsupportedBody');
const unsupportedHelp = document.getElementById('unsupportedHelp');
const quickLockTitle = document.getElementById('quickLockTitle');
const hotkeyChip = document.getElementById('hotkeyChip');
const quickLockBody = document.getElementById('quickLockBody');
const lockButton = document.getElementById('lockButton');
const settingsButton = document.getElementById('settingsButton');
const popupMessage = document.getElementById('popupMessage');

siteToggle.addEventListener('change', onToggleSite);
registerButton.addEventListener('click', onRegisterCurrentSite);
lockButton.addEventListener('click', onLockCurrentTab);
settingsButton.addEventListener('click', () => chrome.runtime.openOptionsPage());

init().catch((error) => {
  console.error(error);
  showMessage(String(error), true);
});

async function init() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tabs[0] || null;

  if (!currentTab?.url) {
    currentStatus = { language: 'auto', registerableSite: null, site: null };
    languageSetting = 'auto';
    renderStaticText();
    render();
    return;
  }

  currentStatus = await chrome.runtime.sendMessage({
    type: 'PP_GET_STATUS',
    url: currentTab.url,
  });

  languageSetting = currentStatus?.language || 'auto';
  renderStaticText();
  render();
}

function renderStaticText() {
  document.documentElement.lang = i18n.resolveLanguage(languageSetting);
  titleEl.textContent = i18n.t(languageSetting, 'popup.title');
  subtitleEl.textContent = i18n.t(languageSetting, 'popup.subtitle');
  registerTitle.textContent = i18n.t(languageSetting, 'popup.registerTitle');
  registerBody.textContent = i18n.t(languageSetting, 'popup.registerBody');
  registerButton.textContent = i18n.t(languageSetting, 'popup.registerButton');
  unsupportedTitle.textContent = i18n.t(languageSetting, 'popup.unsupportedTitle');
  unsupportedBody.textContent = i18n.t(languageSetting, 'popup.unsupportedBody');
  unsupportedHelp.textContent = i18n.t(languageSetting, 'popup.unsupportedHelp');
  quickLockTitle.textContent = i18n.t(languageSetting, 'popup.quickLockTitle');
  quickLockBody.textContent = i18n.t(languageSetting, 'popup.quickLockBody');
  lockButton.textContent = i18n.t(languageSetting, 'popup.lockButton');
  settingsButton.textContent = i18n.t(languageSetting, 'popup.settingsButton');
}

function render() {
  const site = currentStatus?.site;
  const registerableSite = currentStatus?.registerableSite;
  const hotkeyLabel = currentStatus?.hotkey?.label || 'Ctrl + Shift + P';

  hotkeyChip.textContent = hotkeyLabel;

  supportedCard.style.display = 'none';
  registerCard.style.display = 'none';
  unsupportedCard.style.display = 'none';

  if (site) {
    supportedCard.style.display = 'block';
    siteName.textContent = `${site.name} · ${i18n.categoryLabel(languageSetting, site.category)}`;
    siteUrl.textContent = currentTab?.url || '';
    siteToggle.checked = Boolean(currentStatus.enabled);
    pinWarning.textContent = currentStatus.hasPin ? '' : i18n.t(languageSetting, 'popup.pinWarning');
    hotkeyInfo.textContent = i18n.t(languageSetting, 'popup.hotkeyInfo', { hotkey: hotkeyLabel });
    lockButton.disabled = false;
    return;
  }

  if (registerableSite) {
    registerCard.style.display = 'block';
    registerDomain.textContent = registerableSite.name;
    lockButton.disabled = true;
    return;
  }

  unsupportedCard.style.display = 'block';
  lockButton.disabled = true;
}

async function onToggleSite() {
  const site = currentStatus?.site;
  if (!site || !currentTab?.url) return;

  if (siteToggle.checked) {
    const granted = await chrome.permissions.request({ origins: site.origins || [site.pattern] });
    if (!granted) {
      siteToggle.checked = false;
      showMessage(i18n.t(languageSetting, 'popup.permissionDenied'), true);
      return;
    }
  } else {
    try {
      await chrome.permissions.remove({ origins: site.origins || [site.pattern] });
    } catch (error) {
      // Ignore removal failures.
    }
  }

  const result = await chrome.runtime.sendMessage({
    type: 'PP_TOGGLE_SITE',
    url: currentTab.url,
    tabId: currentTab.id,
    enabled: siteToggle.checked,
  });

  if (!result?.ok) {
    siteToggle.checked = !siteToggle.checked;
    showMessage(result?.error || i18n.t(languageSetting, 'popup.registerFailed'), true);
    return;
  }

  currentStatus.enabled = siteToggle.checked;
  showMessage('');
}

async function onRegisterCurrentSite() {
  const registerableSite = currentStatus?.registerableSite;
  if (!registerableSite || !currentTab?.url) return;

  const granted = await chrome.permissions.request({ origins: registerableSite.origins || [registerableSite.pattern] });
  if (!granted) {
    showMessage(i18n.t(languageSetting, 'popup.permissionDenied'), true);
    return;
  }

  const result = await chrome.runtime.sendMessage({
    type: 'PP_ADD_CURRENT_SITE',
    url: currentTab.url,
    tabId: currentTab.id,
  });

  if (!result?.ok) {
    showMessage(result?.error || i18n.t(languageSetting, 'popup.registerFailed'), true);
    return;
  }

  currentStatus = await chrome.runtime.sendMessage({
    type: 'PP_GET_STATUS',
    url: currentTab.url,
  });
  languageSetting = currentStatus?.language || languageSetting;
  renderStaticText();
  render();
  showMessage(i18n.t(languageSetting, 'popup.registerSuccess'));
}

async function onLockCurrentTab() {
  if (!currentTab?.id || !currentStatus?.site) return;

  const origins = currentStatus.site.origins || [currentStatus.site.pattern];
  const hasPermission = await chrome.permissions.contains({ origins });
  if (!hasPermission) {
    const granted = await chrome.permissions.request({ origins });
    if (!granted) {
      showMessage(i18n.t(languageSetting, 'popup.permissionDenied'), true);
      return;
    }
  }

  await chrome.runtime.sendMessage({ type: 'PP_LOCK_TAB', tabId: currentTab.id });
  window.close();
}

function showMessage(text, isError = false) {
  popupMessage.textContent = text || '';
  popupMessage.classList.toggle('error', Boolean(text) && isError);
}
