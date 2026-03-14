const PRESET_SITE_DEFINITIONS = [
  { id: 'gmail', name: 'Gmail', category: 'work', origins: ['https://mail.google.com/*'] },
  { id: 'google-calendar', name: 'Google Calendar', category: 'work', origins: ['https://calendar.google.com/*'] },
  { id: 'google-workspace', name: 'Google Docs / Sheets / Slides', category: 'work', origins: ['https://docs.google.com/*'] },
  { id: 'notion', name: 'Notion', category: 'work', origins: ['https://*.notion.so/*'] },
  { id: 'slack', name: 'Slack', category: 'work', origins: ['https://app.slack.com/*'] },
  { id: 'discord', name: 'Discord', category: 'work', origins: ['https://discord.com/*'] },
  { id: 'atlassian', name: 'Jira / Confluence', category: 'work', origins: ['https://*.atlassian.net/*'] },
  { id: 'trello', name: 'Trello', category: 'work', origins: ['https://trello.com/*'] },
  { id: 'figma', name: 'Figma', category: 'work', origins: ['https://www.figma.com/*'] },
  { id: 'github', name: 'GitHub', category: 'work', origins: ['https://github.com/*'] },
  { id: 'gitlab', name: 'GitLab', category: 'work', origins: ['https://gitlab.com/*'] },
  { id: 'linear', name: 'Linear', category: 'work', origins: ['https://linear.app/*'] },
  { id: 'asana', name: 'Asana', category: 'work', origins: ['https://app.asana.com/*'] },
  { id: 'clickup', name: 'ClickUp', category: 'work', origins: ['https://app.clickup.com/*'] },
  { id: 'miro', name: 'Miro', category: 'work', origins: ['https://miro.com/*'] },
  { id: 'canva', name: 'Canva', category: 'work', origins: ['https://www.canva.com/*'] },
  { id: 'hubspot', name: 'HubSpot', category: 'work', origins: ['https://app.hubspot.com/*'] },
  { id: 'youtube', name: 'YouTube', category: 'media', origins: ['https://*.youtube.com/*'] },
  { id: 'netflix', name: 'Netflix', category: 'media', origins: ['https://www.netflix.com/*'] },
  { id: 'disneyplus', name: 'Disney+', category: 'media', origins: ['https://www.disneyplus.com/*'] },
  { id: 'primevideo', name: 'Prime Video', category: 'media', origins: ['https://www.primevideo.com/*'] },
  { id: 'google-meet', name: 'Google Meet', category: 'meeting', origins: ['https://meet.google.com/*'] },
  { id: 'teams', name: 'Microsoft Teams', category: 'meeting', origins: ['https://teams.microsoft.com/*'] },
  { id: 'chatgpt', name: 'ChatGPT', category: 'ai', origins: ['https://chatgpt.com/*', 'https://chat.openai.com/*'] },
  { id: 'openai-platform', name: 'OpenAI Platform', category: 'ai', origins: ['https://platform.openai.com/*'] },
  { id: 'gemini', name: 'Gemini', category: 'ai', origins: ['https://gemini.google.com/*'] },
  { id: 'google-ai-studio', name: 'Google AI Studio', category: 'ai', origins: ['https://aistudio.google.com/*'] },
  { id: 'claude', name: 'Claude / Claude Code Web', category: 'ai', origins: ['https://claude.ai/*'] },
  { id: 'perplexity', name: 'Perplexity', category: 'ai', origins: ['https://www.perplexity.ai/*'] },
  { id: 'copilot', name: 'Microsoft Copilot', category: 'ai', origins: ['https://copilot.microsoft.com/*'] },
  { id: 'poe', name: 'Poe', category: 'ai', origins: ['https://poe.com/*'] },
  { id: 'deepseek', name: 'DeepSeek', category: 'ai', origins: ['https://chat.deepseek.com/*', 'https://www.deepseek.com/*', 'https://deepseek.com/*'] },
  { id: 'grok', name: 'Grok', category: 'ai', origins: ['https://grok.com/*'] },
];

const PRESET_SITES = PRESET_SITE_DEFINITIONS.map(buildSite);

const DEFAULT_HOTKEY = Object.freeze({
  ctrl: true,
  alt: false,
  shift: true,
  meta: false,
  code: 'KeyP',
  key: 'P',
  label: 'Ctrl + Shift + P',
});

const DEFAULT_SETTINGS = {
  idleSeconds: 60,
  blurStrength: 14,
  language: 'auto',
  protectedSites: {},
  customSites: [],
  pinHash: '',
  hotkey: DEFAULT_HOTKEY,
};

chrome.runtime.onInstalled.addListener(async () => {
  await bootstrapSettings();
  await ensureObserversOnProtectedTabs();
});

chrome.runtime.onStartup.addListener(async () => {
  await bootstrapSettings();
  await ensureObserversOnProtectedTabs();
});

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName !== 'local') return;

  if (changes.idleSeconds) {
    const nextIdle = clampIdle(changes.idleSeconds.newValue);
    await chrome.idle.setDetectionInterval(nextIdle);
  }

  if (
    changes.hotkey ||
    changes.protectedSites ||
    changes.language ||
    changes.blurStrength ||
    changes.customSites
  ) {
    await ensureObserversOnProtectedTabs();
  }
});

chrome.idle.onStateChanged.addListener(async (state) => {
  if (state === 'idle' || state === 'locked') {
    await lockProtectedTabs();
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;

  const site = await getSiteForUrl(tab.url);
  if (!site) return;

  const { protectedSites = {} } = await chrome.storage.local.get(['protectedSites']);
  if (!protectedSites[site.id]) return;

  await ensureContentReady(tabId);
  await updateTabConfig(tabId, site.id);

  if (await shouldLockNow()) {
    const activity = await getTabActivitySnapshot(tabId);
    if (!activity.mediaActive) {
      await lockTab(tabId);
    }
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'quick-lock-current-tab') return;

  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id || !tab.url) return;

  const site = await getSiteForUrl(tab.url);
  if (!site) return;

  await ensureContentReady(tab.id);
  await lockTab(tab.id);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then((result) => sendResponse(result))
    .catch((error) => sendResponse({ ok: false, error: String(error) }));
  return true;
});

async function handleMessage(message, sender) {
  switch (message?.type) {
    case 'PP_GET_STATUS':
      return await getStatus(message.url);

    case 'PP_GET_SETTINGS':
      return await getSettings();

    case 'PP_GET_PAGE_CONFIG':
      return await getPageConfig(message.url || sender.tab?.url || '');

    case 'PP_SAVE_SETTINGS':
      return await saveSettings(message.payload || {});

    case 'PP_TOGGLE_SITE':
      return await toggleSite(message.url, Boolean(message.enabled), message.tabId || sender.tab?.id);

    case 'PP_ADD_CURRENT_SITE':
      return await addCurrentSite(message.url, message.tabId || sender.tab?.id);

    case 'PP_REMOVE_CUSTOM_SITE':
      return await removeCustomSite(message.siteId);

    case 'PP_LOCK_TAB':
      if (!message.tabId) return { ok: false, error: 'No tabId provided.' };
      await ensureContentReady(message.tabId);
      await lockTab(message.tabId);
      return { ok: true };

    case 'PP_HOTKEY_LOCK_REQUEST':
      if (!sender.tab?.id) return { ok: false, error: 'No sender tab.' };
      await ensureContentReady(sender.tab.id);
      await lockTab(sender.tab.id);
      return { ok: true };

    case 'PP_VERIFY_PIN': {
      const valid = await verifyPin(message.pin || '');
      if (valid && sender.tab?.id) {
        await unlockTab(sender.tab.id);
      }
      return { ok: valid };
    }

    case 'PP_MEDIA_STATE':
      return await handleMediaState(message, sender);

    default:
      return { ok: false, error: 'Unknown message type.' };
  }
}

async function bootstrapSettings() {
  const stored = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
  const next = { ...DEFAULT_SETTINGS, ...stored };

  if (!next.pinHash) {
    next.pinHash = await hashText('1234');
  }

  if (!next.protectedSites || typeof next.protectedSites !== 'object') {
    next.protectedSites = {};
  }

  next.customSites = normalizeCustomSiteRecords(next.customSites);
  next.idleSeconds = clampIdle(next.idleSeconds);
  next.blurStrength = clampBlur(next.blurStrength);
  next.language = normalizeLanguage(next.language);
  next.hotkey = normalizeHotkey(next.hotkey || DEFAULT_HOTKEY);

  await chrome.storage.local.set(next);
  await chrome.idle.setDetectionInterval(next.idleSeconds);
}

async function lockProtectedTabs() {
  const { protectedSites = {} } = await chrome.storage.local.get(['protectedSites']);
  const tabs = await chrome.tabs.query({});

  for (const tab of tabs) {
    if (!tab.id || !tab.url) continue;
    const site = await getSiteForUrl(tab.url);
    if (!site) continue;
    if (!protectedSites[site.id]) continue;

    await ensureContentReady(tab.id);
    const activity = await getTabActivitySnapshot(tab.id);
    if (activity.mediaActive) continue;

    await lockTab(tab.id);
  }
}

async function ensureObserversOnProtectedTabs() {
  const { protectedSites = {} } = await chrome.storage.local.get(['protectedSites']);
  const tabs = await chrome.tabs.query({});

  for (const tab of tabs) {
    if (!tab.id || !tab.url) continue;
    const site = await getSiteForUrl(tab.url);
    if (!site) continue;
    if (!protectedSites[site.id]) continue;
    await ensureContentReady(tab.id);
    await updateTabConfig(tab.id, site.id);
  }
}

async function ensureContentReady(tabId) {
  try {
    await chrome.scripting.insertCSS({
      target: { tabId },
      files: ['content/overlay.css'],
    });
  } catch (error) {
    // Ignore duplicate insertion or unsupported pages.
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['common/i18n.js', 'content/overlay.js'],
    });
  } catch (error) {
    // Ignore duplicate injection or unsupported pages.
  }
}

async function updateTabConfig(tabId, siteId = null) {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab?.url) return;

    const pageConfig = await getPageConfig(tab.url, siteId);
    await chrome.tabs.sendMessage(tabId, {
      type: 'PP_CONFIG_UPDATE',
      ...pageConfig,
    });
  } catch (error) {
    // Ignore tabs that cannot receive messages yet.
  }
}

async function getTabActivitySnapshot(tabId) {
  try {
    const result = await chrome.tabs.sendMessage(tabId, { type: 'PP_GET_ACTIVITY_SNAPSHOT' });
    return {
      mediaActive: Boolean(result?.mediaActive),
    };
  } catch (error) {
    return { mediaActive: false };
  }
}

async function handleMediaState(message, sender) {
  if (!sender.tab?.id || !sender.tab.url) {
    return { ok: false, error: 'Missing sender tab.' };
  }

  if (message.active) {
    return { ok: true };
  }

  const site = await getSiteForUrl(sender.tab.url);
  if (!site) return { ok: true };

  const { protectedSites = {} } = await chrome.storage.local.get(['protectedSites']);
  if (!protectedSites[site.id]) return { ok: true };

  if (await shouldLockNow()) {
    await lockTab(sender.tab.id);
  }

  return { ok: true };
}

async function shouldLockNow() {
  const { idleSeconds = 60 } = await chrome.storage.local.get(['idleSeconds']);
  const state = await chrome.idle.queryState(clampIdle(idleSeconds));
  return state === 'idle' || state === 'locked';
}

async function lockTab(tabId) {
  await ensureContentReady(tabId);

  try {
    await chrome.tabs.sendMessage(tabId, { type: 'PP_LOCK' });
  } catch (error) {
    // Ignore if page cannot receive messages.
  }
}

async function unlockTab(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: 'PP_UNLOCK' });
  } catch (error) {
    // Ignore if tab is gone.
  }
}

async function getStatus(url) {
  const stored = await chrome.storage.local.get([
    'protectedSites',
    'idleSeconds',
    'pinHash',
    'hotkey',
    'language',
    'blurStrength',
    'customSites',
  ]);

  const protectedSites = stored.protectedSites || {};
  const site = await getSiteForUrl(url || '', stored.customSites || []);
  const registerableSite = site ? null : createRegisterableSiteCandidate(url || '', stored.customSites || []);

  return {
    ok: true,
    site: serializeSite(site),
    enabled: site ? Boolean(protectedSites[site.id]) : false,
    idleSeconds: clampIdle(stored.idleSeconds),
    hasPin: Boolean(stored.pinHash),
    hotkey: normalizeHotkey(stored.hotkey || DEFAULT_HOTKEY),
    language: normalizeLanguage(stored.language),
    blurStrength: clampBlur(stored.blurStrength),
    registerableSite: serializeSite(registerableSite),
  };
}

async function getSettings() {
  const stored = await chrome.storage.local.get([
    'idleSeconds',
    'pinHash',
    'hotkey',
    'language',
    'blurStrength',
    'customSites',
  ]);

  const customSites = normalizeCustomSiteRecords(stored.customSites || []).map(buildCustomSiteFromRecord);

  return {
    ok: true,
    idleSeconds: clampIdle(stored.idleSeconds),
    blurStrength: clampBlur(stored.blurStrength),
    hasPin: Boolean(stored.pinHash),
    hotkey: normalizeHotkey(stored.hotkey || DEFAULT_HOTKEY),
    language: normalizeLanguage(stored.language),
    presetSites: PRESET_SITES.map(serializeSite),
    customSites: customSites.map(serializeSite),
  };
}

async function getPageConfig(url, siteIdHint = null) {
  const stored = await chrome.storage.local.get([
    'protectedSites',
    'hotkey',
    'language',
    'blurStrength',
    'customSites',
  ]);

  const site = siteIdHint
    ? (await getAllSites(stored.customSites || [])).find((item) => item.id === siteIdHint) || null
    : await getSiteForUrl(url || '', stored.customSites || []);

  return {
    ok: true,
    site: serializeSite(site),
    enabled: site ? Boolean((stored.protectedSites || {})[site.id]) : false,
    hotkey: normalizeHotkey(stored.hotkey || DEFAULT_HOTKEY),
    language: normalizeLanguage(stored.language),
    blurStrength: clampBlur(stored.blurStrength),
  };
}

async function saveSettings(payload) {
  const update = {};

  if (payload.idleSeconds !== undefined) {
    update.idleSeconds = clampIdle(payload.idleSeconds);
  }

  if (payload.blurStrength !== undefined) {
    update.blurStrength = clampBlur(payload.blurStrength);
  }

  if (payload.language !== undefined) {
    update.language = normalizeLanguage(payload.language);
  }

  if (typeof payload.pin === 'string' && payload.pin.trim().length >= 4) {
    update.pinHash = await hashText(payload.pin.trim());
  }

  if (payload.hotkey) {
    update.hotkey = normalizeHotkey(payload.hotkey);
  }

  await chrome.storage.local.set(update);

  if (update.idleSeconds) {
    await chrome.idle.setDetectionInterval(update.idleSeconds);
  }

  await ensureObserversOnProtectedTabs();

  return { ok: true };
}

async function toggleSite(url, enabled, tabId = null) {
  const stored = await chrome.storage.local.get(['protectedSites', 'customSites']);
  const site = await getSiteForUrl(url || '', stored.customSites || []);
  if (!site) {
    return { ok: false, error: 'This site is not supported yet.' };
  }

  const protectedSites = { ...(stored.protectedSites || {}) };
  protectedSites[site.id] = enabled;
  await chrome.storage.local.set({ protectedSites });

  const activeTabId = tabId || (await findTabIdByUrl(url));
  if (activeTabId) {
    await ensureContentReady(activeTabId);
    await updateTabConfig(activeTabId, site.id);
    if (!enabled) {
      await unlockTab(activeTabId);
    }
  }

  return {
    ok: true,
    site: serializeSite(site),
    enabled,
  };
}

async function addCurrentSite(url, tabId = null) {
  const stored = await chrome.storage.local.get(['customSites', 'protectedSites']);
  const site = createRegisterableSiteCandidate(url || '', stored.customSites || []);
  if (!site) {
    return { ok: false, error: 'This page cannot be registered.' };
  }

  const customSites = normalizeCustomSiteRecords(stored.customSites || []);
  if (!customSites.some((item) => item.id === site.id)) {
    customSites.push(site.record);
  }

  const protectedSites = { ...(stored.protectedSites || {}), [site.id]: true };
  await chrome.storage.local.set({ customSites, protectedSites });

  const activeTabId = tabId || (await findTabIdByUrl(url));
  if (activeTabId) {
    await ensureContentReady(activeTabId);
    await updateTabConfig(activeTabId, site.id);
  }

  return { ok: true, site: serializeSite(site), enabled: true };
}

async function removeCustomSite(siteId) {
  if (!siteId || !String(siteId).startsWith('custom-')) {
    return { ok: false, error: 'Invalid custom site.' };
  }

  const stored = await chrome.storage.local.get(['customSites', 'protectedSites']);
  const customSites = normalizeCustomSiteRecords(stored.customSites || []);
  const target = customSites.find((item) => item.id === siteId);
  if (!target) {
    return { ok: false, error: 'Custom site not found.' };
  }

  const nextCustomSites = customSites.filter((item) => item.id !== siteId);
  const protectedSites = { ...(stored.protectedSites || {}) };
  delete protectedSites[siteId];

  await chrome.storage.local.set({ customSites: nextCustomSites, protectedSites });

  try {
    await chrome.permissions.remove({ origins: target.origins });
  } catch (error) {
    // Ignore permission removal errors.
  }

  const removedSite = buildCustomSiteFromRecord(target);
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.id || !tab.url) continue;
    if (!removedSite.matches(tab.url)) continue;
    await updateTabConfig(tab.id);
    await unlockTab(tab.id);
  }

  return { ok: true };
}

async function findTabIdByUrl(url) {
  const tabs = await chrome.tabs.query({});
  const match = tabs.find((tab) => tab.url === url && tab.id);
  return match?.id || null;
}

async function verifyPin(pin) {
  const { pinHash = '' } = await chrome.storage.local.get(['pinHash']);
  if (!pinHash) return false;
  const current = await hashText((pin || '').trim());
  return current === pinHash;
}

function buildSite(definition) {
  const origins = Array.isArray(definition.origins) ? definition.origins.slice() : [definition.pattern];
  return {
    id: definition.id,
    name: definition.name,
    category: definition.category,
    pattern: definition.pattern || origins[0],
    origins,
    matches(url) {
      return origins.some((origin) => matchesOriginPattern(url, origin));
    },
  };
}

function buildCustomSiteFromRecord(record) {
  const normalized = normalizeCustomSiteRecord(record);
  return buildSite(normalized);
}

function normalizeCustomSiteRecords(records) {
  if (!Array.isArray(records)) return [];
  const map = new Map();

  for (const record of records) {
    const normalized = normalizeCustomSiteRecord(record);
    if (!normalized) continue;
    map.set(normalized.id, normalized);
  }

  return Array.from(map.values());
}

function normalizeCustomSiteRecord(record) {
  if (!record || typeof record !== 'object') return null;
  if (!record.id || !record.name || !Array.isArray(record.origins) || !record.origins.length) {
    return null;
  }

  const origins = record.origins.filter((origin) => typeof origin === 'string' && /^https?:\/\/.+\/\*$/.test(origin));
  if (!origins.length) return null;

  const host = typeof record.host === 'string' && record.host ? record.host : deriveHostFromPattern(origins[0]);

  return {
    id: String(record.id),
    name: String(record.name),
    host: host || String(record.name),
    category: 'custom',
    pattern: origins[0],
    origins,
  };
}

async function getAllSites(customSiteRecords = null) {
  const storedCustomSites = customSiteRecords ?? (await chrome.storage.local.get(['customSites'])).customSites;
  const records = storedCustomSites || [];
  const customSites = normalizeCustomSiteRecords(records).map(buildCustomSiteFromRecord);
  return [...PRESET_SITES, ...customSites];
}

async function getSiteForUrl(url, customSiteRecords = null) {
  const allSites = await getAllSites(customSiteRecords);
  return allSites.find((site) => site.matches(url)) || null;
}

function createRegisterableSiteCandidate(url, existingCustomSites = []) {
  try {
    const parsed = new URL(url);
    if (!isRegisterableUrl(parsed)) return null;

    const host = parsed.hostname;
    const existing = normalizeCustomSiteRecords(existingCustomSites).find((item) => item.host === host);
    if (existing) {
      return buildCustomSiteFromRecord(existing);
    }

    const name = host.replace(/^www\./i, '');
    const record = {
      id: `custom-${slugifyHost(host)}`,
      name,
      host,
      category: 'custom',
      origins: [`https://${host}/*`, `http://${host}/*`],
    };

    return {
      ...buildCustomSiteFromRecord(record),
      record,
    };
  } catch (error) {
    return null;
  }
}

function serializeSite(site) {
  if (!site) return null;
  return {
    id: site.id,
    name: site.name,
    category: site.category,
    pattern: site.pattern,
    origins: Array.isArray(site.origins) && site.origins.length ? site.origins : [site.pattern],
  };
}

function isRegisterableUrl(parsedUrl) {
  if (!(parsedUrl instanceof URL)) return false;
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) return false;
  const host = parsedUrl.hostname.toLowerCase();
  if (!host) return false;
  if (host === 'chromewebstore.google.com' || host === 'chrome.google.com') return false;
  if (host.endsWith('.googleusercontent.com')) return false;
  return true;
}

function matchesOriginPattern(url, pattern) {
  try {
    const parsed = new URL(url);
    const match = String(pattern).match(/^(https?):\/\/([^/]+)\/\*$/);
    if (!match) return false;

    const scheme = `${match[1]}:`;
    const hostPattern = match[2].toLowerCase();

    if (parsed.protocol !== scheme) return false;
    return hostMatches(parsed.hostname.toLowerCase(), hostPattern);
  } catch (error) {
    return false;
  }
}

function hostMatches(hostname, hostPattern) {
  if (hostPattern === '*') return true;
  if (hostPattern.startsWith('*.')) {
    const bare = hostPattern.slice(2);
    return hostname === bare || hostname.endsWith(`.${bare}`);
  }
  return hostname === hostPattern;
}

function deriveHostFromPattern(pattern) {
  const match = String(pattern || '').match(/^https?:\/\/([^/]+)\/\*$/);
  if (!match) return '';
  return match[1].replace(/^\*\./, '');
}

function slugifyHost(host) {
  return String(host || 'site')
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/\.+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'site';
}

function clampIdle(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 60;
  return Math.max(15, Math.min(600, Math.round(number)));
}

function clampBlur(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 14;
  return Math.max(4, Math.min(40, Math.round(number)));
}

function normalizeLanguage(value) {
  return value === 'en' || value === 'ko' || value === 'ja' || value === 'zh-CN' || value === 'auto'
    ? value
    : 'auto';
}

function normalizeHotkey(hotkey) {
  const source = hotkey && typeof hotkey === 'object' ? hotkey : DEFAULT_HOTKEY;
  const code = typeof source.code === 'string' && source.code ? source.code : DEFAULT_HOTKEY.code;
  const key = typeof source.key === 'string' && source.key ? source.key : prettifyCode(code);
  const normalized = {
    ctrl: Boolean(source.ctrl),
    alt: Boolean(source.alt),
    shift: Boolean(source.shift),
    meta: Boolean(source.meta),
    code,
    key,
  };

  if (!normalized.ctrl && !normalized.alt && !normalized.meta) {
    normalized.ctrl = true;
  }

  normalized.label = formatHotkey(normalized);
  return normalized;
}

function formatHotkey(hotkey) {
  const parts = [];
  if (hotkey.ctrl) parts.push('Ctrl');
  if (hotkey.alt) parts.push('Alt');
  if (hotkey.shift) parts.push('Shift');
  if (hotkey.meta) parts.push('Meta');
  parts.push(hotkey.key || prettifyCode(hotkey.code));
  return parts.join(' + ');
}

function prettifyCode(code) {
  if (!code) return 'P';
  if (code.startsWith('Key')) return code.slice(3).toUpperCase();
  if (code.startsWith('Digit')) return code.slice(5);
  if (code.startsWith('Numpad')) return `Num ${code.slice(6)}`;
  return code.replace(/([A-Z])/g, ' $1').trim();
}

async function hashText(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
