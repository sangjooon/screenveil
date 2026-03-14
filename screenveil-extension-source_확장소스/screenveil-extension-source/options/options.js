const i18n = self.PeekProofI18n;

const idleInput = document.getElementById('idleSeconds');
const pinInput = document.getElementById('pin');
const languageSelect = document.getElementById('languageSelect');
const blurInput = document.getElementById('blurStrength');
const blurValue = document.getElementById('blurValue');
const hotkeyRecorder = document.getElementById('hotkeyRecorder');
const saveButton = document.getElementById('saveButton');
const message = document.getElementById('message');
const presetSitesList = document.getElementById('presetSitesList');
const customSitesList = document.getElementById('customSitesList');
const customSitesEmpty = document.getElementById('customSitesEmpty');

const titleEl = document.getElementById('titleEl');
const introEl = document.getElementById('introEl');
const idleLabel = document.getElementById('idleLabel');
const idleHint = document.getElementById('idleHint');
const pinLabel = document.getElementById('pinLabel');
const pinHint = document.getElementById('pinHint');
const languageLabel = document.getElementById('languageLabel');
const languageHint = document.getElementById('languageHint');
const blurLabel = document.getElementById('blurLabel');
const blurHint = document.getElementById('blurHint');
const hotkeyLabel = document.getElementById('hotkeyLabel');
const hotkeyHint = document.getElementById('hotkeyHint');
const chromeHotkeyHint = document.getElementById('chromeHotkeyHint');
const hotkeyDetail = document.getElementById('hotkeyDetail');
const presetSitesTitle = document.getElementById('presetSitesTitle');
const presetSitesNote = document.getElementById('presetSitesNote');
const customSitesTitle = document.getElementById('customSitesTitle');
const customSitesHint = document.getElementById('customSitesHint');

const state = {
  language: 'auto',
  capturedHotkey: null,
  presetSites: [],
  customSites: [],
};

blurInput.addEventListener('input', updateBlurValue);
languageSelect.addEventListener('change', () => {
  state.language = languageSelect.value;
  renderStaticText();
  updateBlurValue();
  renderPresetSites();
  renderCustomSites();
});

hotkeyRecorder.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') return;

  event.preventDefault();
  const hotkey = captureHotkey(event);
  if (!hotkey) {
    setMessage(i18n.t(state.language, 'options.hotkeyRequirement'), true);
    return;
  }

  state.capturedHotkey = hotkey;
  hotkeyRecorder.value = hotkey.label;
  setMessage('');
});

saveButton.addEventListener('click', onSave);
customSitesList.addEventListener('click', onCustomSitesClick);

init().catch((error) => {
  console.error(error);
  setMessage(String(error), true);
});

async function init() {
  const settings = await chrome.runtime.sendMessage({ type: 'PP_GET_SETTINGS' });
  state.language = settings.language || 'auto';
  state.capturedHotkey = settings.hotkey || null;
  state.presetSites = settings.presetSites || [];
  state.customSites = settings.customSites || [];

  idleInput.value = settings.idleSeconds || 60;
  pinInput.placeholder = i18n.t(state.language, 'options.pinPlaceholder');
  languageSelect.value = state.language;
  blurInput.value = settings.blurStrength || 14;
  hotkeyRecorder.value = settings.hotkey?.label || 'Ctrl + Shift + P';

  renderStaticText();
  updateBlurValue();
  renderPresetSites();
  renderCustomSites();
}

function renderStaticText() {
  document.documentElement.lang = i18n.resolveLanguage(state.language);
  titleEl.textContent = i18n.t(state.language, 'options.title');
  introEl.textContent = i18n.t(state.language, 'options.intro');
  idleLabel.textContent = i18n.t(state.language, 'options.idleLabel');
  idleHint.textContent = i18n.t(state.language, 'options.idleHint');
  pinLabel.textContent = i18n.t(state.language, 'options.pinLabel');
  pinInput.placeholder = i18n.t(state.language, 'options.pinPlaceholder');
  pinHint.textContent = i18n.t(state.language, 'options.pinHint');
  languageLabel.textContent = i18n.t(state.language, 'options.languageLabel');
  languageHint.textContent = i18n.t(state.language, 'options.languageHint');
  blurLabel.textContent = i18n.t(state.language, 'options.blurLabel');
  blurHint.textContent = i18n.t(state.language, 'options.blurHint');
  hotkeyLabel.textContent = i18n.t(state.language, 'options.hotkeyLabel');
  hotkeyRecorder.placeholder = i18n.t(state.language, 'options.hotkeyPlaceholder');
  hotkeyHint.textContent = i18n.t(state.language, 'options.hotkeyHint');
  chromeHotkeyHint.textContent = i18n.t(state.language, 'options.chromeHotkeyHint');
  hotkeyDetail.textContent = i18n.t(state.language, 'options.hotkeyDetail');
  saveButton.textContent = i18n.t(state.language, 'options.saveButton');
  presetSitesTitle.textContent = i18n.t(state.language, 'options.presetSitesTitle');
  presetSitesNote.textContent = i18n.t(state.language, 'options.presetSitesNote');
  customSitesTitle.textContent = i18n.t(state.language, 'options.customSitesTitle');
  customSitesHint.textContent = i18n.t(state.language, 'options.customSitesHint');

  Array.from(languageSelect.options).forEach((option) => {
    option.textContent = i18n.languageLabel(state.language, option.value);
  });
}

function updateBlurValue() {
  blurValue.textContent = i18n.t(state.language, 'options.blurValue', { strength: blurInput.value || 14 });
}

function renderPresetSites() {
  presetSitesList.innerHTML = '';
  state.presetSites.forEach((site) => {
    const li = document.createElement('li');
    li.textContent = `${site.name} (${i18n.categoryLabel(state.language, site.category)})`;
    presetSitesList.appendChild(li);
  });
}

function renderCustomSites() {
  customSitesList.innerHTML = '';

  if (!state.customSites.length) {
    customSitesEmpty.textContent = i18n.t(state.language, 'options.customSitesEmpty');
    return;
  }

  customSitesEmpty.textContent = '';
  state.customSites.forEach((site) => {
    const row = document.createElement('div');
    row.className = 'custom-site-row';
    row.dataset.siteId = site.id;

    const meta = document.createElement('div');
    meta.className = 'custom-site-meta';

    const name = document.createElement('div');
    name.className = 'custom-site-name';
    name.textContent = `${site.name} (${i18n.categoryLabel(state.language, site.category)})`;

    const pattern = document.createElement('div');
    pattern.className = 'custom-site-pattern';
    pattern.textContent = (site.origins || []).join(' · ');

    const removeButton = document.createElement('button');
    removeButton.className = 'secondary';
    removeButton.dataset.removeSiteId = site.id;
    removeButton.textContent = i18n.t(state.language, 'options.removeButton');

    meta.appendChild(name);
    meta.appendChild(pattern);
    row.appendChild(meta);
    row.appendChild(removeButton);
    customSitesList.appendChild(row);
  });
}

async function onSave() {
  const payload = {
    idleSeconds: Number(idleInput.value),
    blurStrength: Number(blurInput.value),
    hotkey: state.capturedHotkey,
    language: languageSelect.value,
  };

  const pin = pinInput.value.trim();
  if (pin) {
    if (pin.length < 4) {
      setMessage(i18n.t(state.language, 'options.pinTooShort'), true);
      return;
    }
    payload.pin = pin;
  }

  const result = await chrome.runtime.sendMessage({
    type: 'PP_SAVE_SETTINGS',
    payload,
  });

  if (!result?.ok) {
    setMessage(i18n.t(state.language, 'options.saveFailed'), true);
    return;
  }

  state.language = languageSelect.value;
  pinInput.value = '';
  renderStaticText();
  updateBlurValue();
  renderPresetSites();
  renderCustomSites();
  setMessage(i18n.t(state.language, 'options.saved'));
}

async function onCustomSitesClick(event) {
  const button = event.target.closest('[data-remove-site-id]');
  if (!button) return;

  const siteId = button.dataset.removeSiteId;
  if (!siteId) return;

  if (!window.confirm(i18n.t(state.language, 'options.removeConfirm'))) {
    return;
  }

  const result = await chrome.runtime.sendMessage({
    type: 'PP_REMOVE_CUSTOM_SITE',
    siteId,
  });

  if (!result?.ok) {
    setMessage(result?.error || i18n.t(state.language, 'options.saveFailed'), true);
    return;
  }

  state.customSites = state.customSites.filter((site) => site.id !== siteId);
  renderCustomSites();
  setMessage(i18n.t(state.language, 'options.removeSuccess'));
}

function setMessage(text, isError = false) {
  message.textContent = text || '';
  message.classList.toggle('error', Boolean(text) && isError);
}

function captureHotkey(event) {
  const disallowedCodes = new Set([
    'ShiftLeft',
    'ShiftRight',
    'ControlLeft',
    'ControlRight',
    'AltLeft',
    'AltRight',
    'MetaLeft',
    'MetaRight',
  ]);

  if (disallowedCodes.has(event.code)) {
    return null;
  }

  const hotkey = {
    ctrl: event.ctrlKey,
    alt: event.altKey,
    shift: event.shiftKey,
    meta: event.metaKey,
    code: event.code,
    key: prettifyKey(event),
  };

  if (!hotkey.ctrl && !hotkey.alt && !hotkey.meta) {
    return null;
  }

  hotkey.label = formatHotkey(hotkey);
  return hotkey;
}

function prettifyKey(event) {
  if (event.code.startsWith('Key')) return event.code.slice(3).toUpperCase();
  if (event.code.startsWith('Digit')) return event.code.slice(5);
  if (event.code.startsWith('Numpad')) return `Num ${event.code.slice(6)}`;
  if (event.key && event.key.length === 1) return event.key.toUpperCase();
  return event.code.replace(/([A-Z])/g, ' $1').trim();
}

function formatHotkey(hotkey) {
  const parts = [];
  if (hotkey.ctrl) parts.push('Ctrl');
  if (hotkey.alt) parts.push('Alt');
  if (hotkey.shift) parts.push('Shift');
  if (hotkey.meta) parts.push('Meta');
  parts.push(hotkey.key);
  return parts.join(' + ');
}
