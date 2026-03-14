(() => {
  if (window.__peekProofInjected) {
    return;
  }
  window.__peekProofInjected = true;

  const overlayId = 'peekproof-overlay';
  const inputId = 'peekproof-pin-input';
  const errorId = 'peekproof-error';

  let overlay = null;
  let badgeEl = null;
  let titleEl = null;
  let descriptionEl = null;
  let unlockButton = null;
  let pinInput = null;
  let errorBox = null;
  let isLocked = false;
  let lastMediaState = null;
  let syncTimer = null;
  let currentConfig = {
    enabled: false,
    language: 'auto',
    blurStrength: 14,
    hotkey: {
      ctrl: true,
      alt: false,
      shift: true,
      meta: false,
      code: 'KeyP',
      key: 'P',
      label: 'Ctrl + Shift + P',
    },
  };

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.style.display = 'none';

    overlay.innerHTML = `
      <div class="peekproof-panel">
        <div class="peekproof-badge" id="peekproof-badge"></div>
        <h1 id="peekproof-title"></h1>
        <p id="peekproof-description"></p>
        <input id="${inputId}" type="password" inputmode="numeric" autocomplete="off" />
        <button id="peekproof-unlock-button"></button>
        <div id="${errorId}" class="peekproof-error"></div>
      </div>
    `;

    document.documentElement.appendChild(overlay);

    badgeEl = overlay.querySelector('#peekproof-badge');
    titleEl = overlay.querySelector('#peekproof-title');
    descriptionEl = overlay.querySelector('#peekproof-description');
    unlockButton = overlay.querySelector('#peekproof-unlock-button');
    pinInput = overlay.querySelector(`#${inputId}`);
    errorBox = overlay.querySelector(`#${errorId}`);

    unlockButton.addEventListener('click', tryUnlock);
    pinInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        tryUnlock();
      }
    });

    applyVisualSettings();
    renderLocalizedText();
  }

  function getI18n() {
    return self.PeekProofI18n || {
      t(_language, key) {
        const fallback = {
          'overlay.badge': 'Screen Veil',
          'overlay.title': 'This screen is protected',
          'overlay.description': 'Enter your PIN to continue.',
          'overlay.pinPlaceholder': 'Enter PIN',
          'overlay.unlockButton': 'Unlock',
          'overlay.pinRequired': 'Enter your PIN.',
          'overlay.pinInvalid': 'The PIN is incorrect.',
          'overlay.reloadError': 'Refresh this tab and try again.',
        };
        return fallback[key] || key;
      },
    };
  }

  function renderLocalizedText() {
    if (!overlay) return;
    const i18n = getI18n();
    badgeEl.textContent = i18n.t(currentConfig.language, 'overlay.badge');
    titleEl.textContent = i18n.t(currentConfig.language, 'overlay.title');
    descriptionEl.textContent = i18n.t(currentConfig.language, 'overlay.description');
    pinInput.placeholder = i18n.t(currentConfig.language, 'overlay.pinPlaceholder');
    unlockButton.textContent = i18n.t(currentConfig.language, 'overlay.unlockButton');
    document.documentElement.lang = i18n.resolveLanguage
      ? i18n.resolveLanguage(currentConfig.language)
      : document.documentElement.lang;
  }

  function applyVisualSettings() {
    if (!overlay) return;
    const strength = clampBlur(currentConfig.blurStrength);
    const alpha = (0.22 + ((strength - 4) / 36) * 0.38).toFixed(2);
    overlay.style.setProperty('--peekproof-blur-strength', `${strength}px`);
    overlay.style.setProperty('--peekproof-overlay-bg', `rgba(7, 11, 19, ${alpha})`);
  }

  async function tryUnlock() {
    const i18n = getI18n();
    const pin = pinInput?.value?.trim() || '';
    if (!pin) {
      showError(i18n.t(currentConfig.language, 'overlay.pinRequired'));
      return;
    }

    try {
      const result = await chrome.runtime.sendMessage({ type: 'PP_VERIFY_PIN', pin });

      if (!result?.ok) {
        showError(i18n.t(currentConfig.language, 'overlay.pinInvalid'));
        pinInput.value = '';
        pinInput.focus();
        return;
      }

      hideOverlay();
    } catch (error) {
      console.error('Screen Veil unlock failed:', error);
      showError(i18n.t(currentConfig.language, 'overlay.reloadError'));
    }
  }

  function showError(message) {
    if (errorBox) errorBox.textContent = message;
  }

  function clearError() {
    if (errorBox) errorBox.textContent = '';
  }

  function showOverlay() {
    if (!overlay) createOverlay();
    isLocked = true;
    overlay.style.display = 'flex';
    document.documentElement.classList.add('peekproof-locked');
    clearError();
    if (pinInput) {
      pinInput.value = '';
      setTimeout(() => pinInput.focus(), 50);
    }
  }

  function hideOverlay() {
    if (!overlay) return;
    isLocked = false;
    overlay.style.display = 'none';
    document.documentElement.classList.remove('peekproof-locked');
    clearError();
  }

  function applyConfig(message) {
    currentConfig = {
      ...currentConfig,
      enabled: Boolean(message?.enabled),
      hotkey: message?.hotkey || currentConfig.hotkey,
      language: typeof message?.language === 'string' ? message.language : currentConfig.language,
      blurStrength: clampBlur(message?.blurStrength ?? currentConfig.blurStrength),
    };

    if (overlay) {
      applyVisualSettings();
      renderLocalizedText();
    }

    if (!currentConfig.enabled) {
      hideOverlay();
    }

    scheduleMediaSync('config', 0);
  }

  function scheduleMediaSync(reason = 'event', delay = 150) {
    if (syncTimer) {
      clearTimeout(syncTimer);
    }

    syncTimer = setTimeout(() => {
      void syncMediaState(reason);
    }, delay);
  }

  async function syncMediaState(reason = 'event') {
    if (!currentConfig.enabled) {
      lastMediaState = false;
      return;
    }

    const mediaActive = hasActiveMedia();
    if (mediaActive === lastMediaState && reason !== 'force') {
      return;
    }

    lastMediaState = mediaActive;

    try {
      await chrome.runtime.sendMessage({
        type: 'PP_MEDIA_STATE',
        active: mediaActive,
        reason,
        url: location.href,
      });
    } catch (error) {
      // Ignore when extension reloads during development.
    }
  }

  function getDeepMediaElements(root = document) {
    const results = [];
    const seen = new Set();

    const visit = (node) => {
      if (!node || seen.has(node)) return;
      seen.add(node);

      if (typeof node.querySelectorAll === 'function') {
        node.querySelectorAll('video, audio').forEach((media) => results.push(media));
        node.querySelectorAll('*').forEach((element) => {
          if (element.shadowRoot) {
            visit(element.shadowRoot);
          }
        });
      }
    };

    visit(root);
    return results;
  }

  function isVisible(element) {
    if (!(element instanceof Element)) return false;
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      Number(style.opacity || '1') > 0
    );
  }

  function isMediaElementActive(element) {
    const tag = element.tagName?.toLowerCase();
    const visuallyRelevant = tag === 'audio' ? true : isVisible(element);
    return visuallyRelevant && !element.paused && !element.ended && element.readyState >= 2;
  }

  function hasActiveMedia() {
    return getDeepMediaElements().some((element) => {
      try {
        return isMediaElementActive(element);
      } catch (error) {
        return false;
      }
    });
  }

  function matchesHotkey(event, hotkey) {
    if (!hotkey?.code) return false;
    if (event.repeat || event.isComposing) return false;

    return (
      Boolean(event.ctrlKey) === Boolean(hotkey.ctrl) &&
      Boolean(event.altKey) === Boolean(hotkey.alt) &&
      Boolean(event.shiftKey) === Boolean(hotkey.shift) &&
      Boolean(event.metaKey) === Boolean(hotkey.meta) &&
      event.code === hotkey.code
    );
  }

  async function handleHotkey(event) {
    if (!currentConfig.enabled || isLocked) return;
    if (!matchesHotkey(event, currentConfig.hotkey)) return;

    event.preventDefault();
    event.stopPropagation();

    try {
      await chrome.runtime.sendMessage({ type: 'PP_HOTKEY_LOCK_REQUEST', url: location.href });
    } catch (error) {
      console.error('Screen Veil hotkey failed:', error);
    }
  }

  function installMediaWatchers() {
    const mediaEvents = ['play', 'playing', 'pause', 'ended', 'seeked', 'seeking', 'ratechange', 'timeupdate', 'volumechange'];
    mediaEvents.forEach((eventName) => {
      document.addEventListener(
        eventName,
        () => {
          scheduleMediaSync(eventName, eventName === 'timeupdate' ? 400 : 120);
        },
        true,
      );
    });

    document.addEventListener(
      'visibilitychange',
      () => {
        scheduleMediaSync('visibilitychange', 0);
      },
      true,
    );

    document.addEventListener(
      'keydown',
      (event) => {
        void handleHotkey(event);
      },
      true,
    );

    const observer = new MutationObserver(() => {
      scheduleMediaSync('mutation', 250);
    });

    if (document.documentElement) {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    window.addEventListener('focus', () => scheduleMediaSync('focus', 0), true);
    window.addEventListener('blur', () => scheduleMediaSync('blur', 0), true);
    window.setInterval(() => scheduleMediaSync('poll', 0), 5000);
  }

  function clampBlur(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 14;
    return Math.max(4, Math.min(40, Math.round(number)));
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'PP_LOCK') {
      showOverlay();
      sendResponse?.({ ok: true });
      return true;
    }

    if (message?.type === 'PP_UNLOCK') {
      hideOverlay();
      sendResponse?.({ ok: true });
      return true;
    }

    if (message?.type === 'PP_CONFIG_UPDATE') {
      applyConfig(message);
      sendResponse?.({ ok: true });
      return true;
    }

    if (message?.type === 'PP_GET_ACTIVITY_SNAPSHOT') {
      sendResponse?.({ ok: true, mediaActive: hasActiveMedia() });
      return true;
    }

    return false;
  });

  installMediaWatchers();

  chrome.runtime
    .sendMessage({ type: 'PP_GET_PAGE_CONFIG', url: location.href })
    .then((config) => {
      applyConfig(config || {});
      scheduleMediaSync('init', 0);
    })
    .catch(() => {
      // Ignore during extension reloads.
    });
})();
