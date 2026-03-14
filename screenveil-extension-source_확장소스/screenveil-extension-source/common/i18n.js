(() => {
  const MESSAGES = {
    en: {
      'popup.title': 'Screen Veil',
      'popup.subtitle': 'Protect selected tabs with automatic blur and instant re-lock.',
      'popup.pinWarning': 'Set a PIN in Settings first.',
      'popup.hotkeyInfo': 'Page shortcut: {{hotkey}}',
      'popup.unsupportedTitle': 'This page is not protected yet.',
      'popup.unsupportedBody': 'You can instantly protect the current website if it is a normal web page.',
      'popup.unsupportedHelp': 'Chrome pages, extension pages, and the Chrome Web Store cannot be protected.',
      'popup.registerTitle': 'Protect this website now',
      'popup.registerBody': 'Add the current domain to Screen Veil and start blurring it when you step away.',
      'popup.registerButton': 'Protect this site',
      'popup.quickLockTitle': 'Quick lock',
      'popup.quickLockBody': 'Change the page shortcut in Settings. Browser-wide shortcuts are managed in chrome://extensions/shortcuts.',
      'popup.lockButton': 'Lock this tab now',
      'popup.settingsButton': 'Open settings',
      'popup.registerSuccess': 'This site is now protected.',
      'popup.registerFailed': 'Could not protect this site.',
      'popup.permissionDenied': 'Permission was not granted for this site.',
      'popup.customSiteTag': 'Custom',

      'options.title': 'Screen Veil Settings',
      'options.intro': 'Settings stay on this device. The default PIN is 1234, so change it right away.',
      'options.idleLabel': 'Lock after how many seconds of inactivity?',
      'options.idleHint': 'Enter a value from 15 to 600 seconds. Recommended: 60',
      'options.pinLabel': 'New PIN',
      'options.pinPlaceholder': 'Example: 2580',
      'options.pinHint': 'At least 4 digits. Saving replaces the current PIN.',
      'options.languageLabel': 'Display language',
      'options.languageHint': 'Pick a language for the popup, settings screen, and lock overlay.',
      'options.blurLabel': 'Blur strength',
      'options.blurHint': 'Raise this for more privacy on large displays or sensitive content.',
      'options.blurValue': '{{strength}} px',
      'options.hotkeyLabel': 'Page quick-lock shortcut',
      'options.hotkeyPlaceholder': 'Click here, then press the shortcut you want',
      'options.hotkeyHint': 'At least one of Ctrl, Alt, or Meta must be included. Example: Ctrl + Shift + P',
      'options.chromeHotkeyHint': 'Browser-wide shortcut: change it in chrome://extensions/shortcuts',
      'options.hotkeyDetail': 'This shortcut blurs a protected page immediately. Chrome-wide command shortcuts must still be changed in chrome://extensions/shortcuts.',
      'options.saveButton': 'Save settings',
      'options.saved': 'Saved.',
      'options.saveFailed': 'Could not save settings.',
      'options.hotkeyRequirement': 'Include at least one of Ctrl, Alt, or Meta.',
      'options.pinTooShort': 'PIN must be at least 4 digits.',
      'options.presetSitesTitle': 'Built-in site presets',
      'options.presetSitesNote': 'Screen Veil already includes work apps, media sites, and major AI chats like ChatGPT, Gemini, Claude, and Perplexity.',
      'options.customSitesTitle': 'Your added websites',
      'options.customSitesEmpty': 'No custom websites added yet.',
      'options.customSitesHint': 'Open any website, then use the popup to protect its current domain instantly.',
      'options.removeButton': 'Remove',
      'options.removeSuccess': 'The custom site was removed.',
      'options.removeConfirm': 'Remove this custom site from Screen Veil?',

      'overlay.badge': 'Screen Veil',
      'overlay.title': 'This screen is protected',
      'overlay.description': 'If you stepped away, Screen Veil locked this page safely. Enter your PIN to continue.',
      'overlay.pinPlaceholder': 'Enter PIN',
      'overlay.unlockButton': 'Unlock',
      'overlay.pinRequired': 'Enter your PIN.',
      'overlay.pinInvalid': 'The PIN is incorrect.',
      'overlay.reloadError': 'The extension was reloaded. Refresh this tab and try again.',

      'category.work': 'Work',
      'category.media': 'Media',
      'category.meeting': 'Meetings',
      'category.ai': 'AI',
      'category.custom': 'Custom',

      'language.option.auto': 'Auto (browser language)',
      'language.option.en': 'English',
      'language.option.ko': 'Korean',
      'language.option.ja': 'Japanese',
      'language.option.zh-CN': 'Chinese (Simplified)',
    },
    ko: {
      'popup.title': 'Screen Veil',
      'popup.subtitle': '선택한 탭을 자동 블러와 빠른 재잠금으로 보호합니다.',
      'popup.pinWarning': '먼저 설정에서 PIN을 저장하세요.',
      'popup.hotkeyInfo': '페이지 단축키: {{hotkey}}',
      'popup.unsupportedTitle': '아직 보호되지 않는 페이지예요.',
      'popup.unsupportedBody': '일반 웹페이지라면 현재 사이트를 즉석에서 보호 대상으로 추가할 수 있어요.',
      'popup.unsupportedHelp': 'Chrome 기본 페이지, 확장 프로그램 페이지, Chrome 웹 스토어는 보호할 수 없습니다.',
      'popup.registerTitle': '이 사이트 바로 보호하기',
      'popup.registerBody': '현재 도메인을 Screen Veil에 추가하고 자리를 비우면 자동 블러가 걸리게 만드세요.',
      'popup.registerButton': '이 사이트 보호하기',
      'popup.quickLockTitle': '빠른 잠금',
      'popup.quickLockBody': '페이지 단축키는 설정에서 바꾸고, 브라우저 전체 단축키는 chrome://extensions/shortcuts 에서 변경하세요.',
      'popup.lockButton': '지금 이 탭 잠그기',
      'popup.settingsButton': '설정 열기',
      'popup.registerSuccess': '이 사이트가 보호 대상으로 추가되었습니다.',
      'popup.registerFailed': '이 사이트를 보호 대상으로 추가하지 못했습니다.',
      'popup.permissionDenied': '이 사이트 권한이 허용되지 않았습니다.',
      'popup.customSiteTag': '사용자 추가',

      'options.title': 'Screen Veil 설정',
      'options.intro': '설정은 이 기기에만 저장됩니다. 기본 PIN은 1234이므로 바로 변경하세요.',
      'options.idleLabel': '몇 초 동안 입력이 없으면 잠글까요?',
      'options.idleHint': '15초~600초 사이로 입력하세요. 추천: 60초',
      'options.pinLabel': '새 PIN',
      'options.pinPlaceholder': '예: 2580',
      'options.pinHint': '최소 4자리. 저장하면 기존 PIN이 바뀝니다.',
      'options.languageLabel': '표시 언어',
      'options.languageHint': '팝업, 설정 화면, 잠금 오버레이에 사용할 언어를 고르세요.',
      'options.blurLabel': '블러 강도',
      'options.blurHint': '큰 화면이나 민감한 콘텐츠일수록 값을 높이면 더 강하게 가려집니다.',
      'options.blurValue': '{{strength}} px',
      'options.hotkeyLabel': '페이지 빠른 잠금 단축키',
      'options.hotkeyPlaceholder': '여기를 클릭하고 원하는 조합을 누르세요',
      'options.hotkeyHint': 'Ctrl / Alt / Meta 중 하나는 꼭 포함되어야 합니다. 예: Ctrl + Shift + P',
      'options.chromeHotkeyHint': '브라우저 전체 단축키: chrome://extensions/shortcuts 에서 변경',
      'options.hotkeyDetail': '이 단축키는 보호가 켜진 사이트에서 즉시 블러를 띄웁니다. 브라우저 전체 단축키는 Chrome 정책상 chrome://extensions/shortcuts 에서 직접 바꿔야 합니다.',
      'options.saveButton': '설정 저장',
      'options.saved': '저장되었습니다.',
      'options.saveFailed': '설정 저장에 실패했습니다.',
      'options.hotkeyRequirement': 'Ctrl, Alt, Meta 중 하나는 꼭 포함해야 합니다.',
      'options.pinTooShort': 'PIN은 최소 4자리여야 합니다.',
      'options.presetSitesTitle': '기본 제공 사이트 프리셋',
      'options.presetSitesNote': 'Screen Veil에는 업무용 SaaS, 영상 사이트, 그리고 ChatGPT, Gemini, Claude, Perplexity 같은 주요 AI 채팅 사이트가 이미 포함되어 있습니다.',
      'options.customSitesTitle': '내가 추가한 사이트',
      'options.customSitesEmpty': '아직 추가한 사이트가 없습니다.',
      'options.customSitesHint': '아무 웹사이트나 연 뒤 팝업에서 현재 도메인을 즉석으로 보호 대상으로 추가할 수 있습니다.',
      'options.removeButton': '삭제',
      'options.removeSuccess': '사용자 추가 사이트를 삭제했습니다.',
      'options.removeConfirm': '이 사용자 추가 사이트를 Screen Veil에서 삭제할까요?',

      'overlay.badge': 'Screen Veil',
      'overlay.title': '화면이 보호되었습니다',
      'overlay.description': '자리를 비우셨다면 Screen Veil가 이 페이지를 안전하게 잠갔습니다. PIN을 입력해 이어서 사용하세요.',
      'overlay.pinPlaceholder': 'PIN 입력',
      'overlay.unlockButton': '잠금 해제',
      'overlay.pinRequired': 'PIN을 입력하세요.',
      'overlay.pinInvalid': 'PIN이 올바르지 않습니다.',
      'overlay.reloadError': '확장 프로그램이 다시 로드되었습니다. 이 탭을 새로고침한 뒤 다시 시도해 주세요.',

      'category.work': '업무',
      'category.media': '영상',
      'category.meeting': '회의',
      'category.ai': 'AI',
      'category.custom': '사용자 추가',

      'language.option.auto': '자동(브라우저 언어)',
      'language.option.en': '영어',
      'language.option.ko': '한국어',
      'language.option.ja': '일본어',
      'language.option.zh-CN': '중국어(간체)',
    },
    ja: {
      'popup.title': 'Screen Veil',
      'popup.subtitle': '選択したタブを自動ぼかしと即時再ロックで保護します。',
      'popup.pinWarning': '先に設定画面でPINを保存してください。',
      'popup.hotkeyInfo': 'ページショートカット: {{hotkey}}',
      'popup.unsupportedTitle': 'このページはまだ保護されていません。',
      'popup.unsupportedBody': '通常のウェブページなら、現在のサイトをその場で保護対象に追加できます。',
      'popup.unsupportedHelp': 'Chromeの内部ページ、拡張機能ページ、Chromeウェブストアは保護できません。',
      'popup.registerTitle': 'このサイトを今すぐ保護',
      'popup.registerBody': '現在のドメインをScreen Veilに追加して、席を離れたときに自動でぼかしをかけます。',
      'popup.registerButton': 'このサイトを保護',
      'popup.quickLockTitle': 'クイックロック',
      'popup.quickLockBody': 'ページ用ショートカットは設定で変更し、ブラウザ全体のショートカットは chrome://extensions/shortcuts で変更してください。',
      'popup.lockButton': 'このタブを今すぐロック',
      'popup.settingsButton': '設定を開く',
      'popup.registerSuccess': 'このサイトを保護対象に追加しました。',
      'popup.registerFailed': 'このサイトを保護対象に追加できませんでした。',
      'popup.permissionDenied': 'このサイトの権限が許可されませんでした。',
      'popup.customSiteTag': 'カスタム',

      'options.title': 'Screen Veil 設定',
      'options.intro': '設定はこの端末にのみ保存されます。初期PINは1234なので、すぐに変更してください。',
      'options.idleLabel': '何秒操作がなければロックしますか？',
      'options.idleHint': '15〜600秒で入力してください。おすすめ: 60秒',
      'options.pinLabel': '新しいPIN',
      'options.pinPlaceholder': '例: 2580',
      'options.pinHint': '4桁以上。保存すると現在のPINが置き換わります。',
      'options.languageLabel': '表示言語',
      'options.languageHint': 'ポップアップ、設定画面、ロックオーバーレイの表示言語を選びます。',
      'options.blurLabel': 'ぼかし強度',
      'options.blurHint': '大きい画面や機密性の高い内容では値を上げるとより見えにくくなります。',
      'options.blurValue': '{{strength}} px',
      'options.hotkeyLabel': 'ページ用クイックロックショートカット',
      'options.hotkeyPlaceholder': 'ここをクリックして、希望するキーの組み合わせを押してください',
      'options.hotkeyHint': 'Ctrl / Alt / Meta のいずれかを必ず含めてください。例: Ctrl + Shift + P',
      'options.chromeHotkeyHint': 'ブラウザ全体のショートカット: chrome://extensions/shortcuts で変更',
      'options.hotkeyDetail': 'このショートカットは保護されたページを即座にぼかします。ブラウザ全体のコマンドショートカットは chrome://extensions/shortcuts で変更してください。',
      'options.saveButton': '設定を保存',
      'options.saved': '保存しました。',
      'options.saveFailed': '設定を保存できませんでした。',
      'options.hotkeyRequirement': 'Ctrl、Alt、Meta のいずれかを含めてください。',
      'options.pinTooShort': 'PINは4桁以上必要です。',
      'options.presetSitesTitle': '組み込みサイトプリセット',
      'options.presetSitesNote': 'Screen Veil には業務アプリ、動画サイト、そして ChatGPT、Gemini、Claude、Perplexity など主要なAIチャットが最初から含まれています。',
      'options.customSitesTitle': '追加したサイト',
      'options.customSitesEmpty': 'まだ追加したサイトはありません。',
      'options.customSitesHint': '任意のウェブサイトを開き、ポップアップからそのドメインをその場で保護対象に追加できます。',
      'options.removeButton': '削除',
      'options.removeSuccess': 'カスタムサイトを削除しました。',
      'options.removeConfirm': 'このカスタムサイトをScreen Veilから削除しますか？',

      'overlay.badge': 'Screen Veil',
      'overlay.title': 'この画面は保護されています',
      'overlay.description': '席を離れた場合、Screen Veil がこのページを安全にロックしました。続行するにはPINを入力してください。',
      'overlay.pinPlaceholder': 'PINを入力',
      'overlay.unlockButton': 'ロック解除',
      'overlay.pinRequired': 'PINを入力してください。',
      'overlay.pinInvalid': 'PINが正しくありません。',
      'overlay.reloadError': '拡張機能が再読み込みされました。このタブを更新してもう一度お試しください。',

      'category.work': '仕事',
      'category.media': '動画',
      'category.meeting': '会議',
      'category.ai': 'AI',
      'category.custom': 'カスタム',

      'language.option.auto': '自動（ブラウザ言語）',
      'language.option.en': '英語',
      'language.option.ko': '韓国語',
      'language.option.ja': '日本語',
      'language.option.zh-CN': '中国語（簡体字）',
    },
    'zh-CN': {
      'popup.title': 'Screen Veil',
      'popup.subtitle': '用自动模糊和快速重新锁定来保护你选择的标签页。',
      'popup.pinWarning': '请先在设置中保存 PIN。',
      'popup.hotkeyInfo': '页面快捷键：{{hotkey}}',
      'popup.unsupportedTitle': '这个页面还没有受到保护。',
      'popup.unsupportedBody': '如果这是普通网页，你可以立即把当前网站加入保护。',
      'popup.unsupportedHelp': 'Chrome 内部页面、扩展页面和 Chrome 网上应用店无法被保护。',
      'popup.registerTitle': '立即保护这个网站',
      'popup.registerBody': '把当前域名加入 Screen Veil，这样你离开座位时它就会自动模糊。',
      'popup.registerButton': '保护这个网站',
      'popup.quickLockTitle': '快速锁定',
      'popup.quickLockBody': '页面快捷键可在设置中修改，浏览器级快捷键请在 chrome://extensions/shortcuts 中修改。',
      'popup.lockButton': '立即锁定此标签页',
      'popup.settingsButton': '打开设置',
      'popup.registerSuccess': '这个网站已加入保护。',
      'popup.registerFailed': '无法将这个网站加入保护。',
      'popup.permissionDenied': '没有获得此网站的权限。',
      'popup.customSiteTag': '自定义',

      'options.title': 'Screen Veil 设置',
      'options.intro': '设置只保存在此设备中。默认 PIN 是 1234，请立即修改。',
      'options.idleLabel': '无操作多少秒后锁定？',
      'options.idleHint': '请输入 15 到 600 秒之间的值。推荐：60 秒',
      'options.pinLabel': '新的 PIN',
      'options.pinPlaceholder': '例如：2580',
      'options.pinHint': '至少 4 位。保存后会替换当前 PIN。',
      'options.languageLabel': '显示语言',
      'options.languageHint': '选择弹窗、设置页和锁定遮罩层的显示语言。',
      'options.blurLabel': '模糊强度',
      'options.blurHint': '在大屏幕或高度敏感内容上可以调高这个值以获得更强的遮挡。',
      'options.blurValue': '{{strength}} px',
      'options.hotkeyLabel': '页面快速锁定快捷键',
      'options.hotkeyPlaceholder': '点击这里，然后按下你想要的组合键',
      'options.hotkeyHint': 'Ctrl / Alt / Meta 至少要包含一个。例如：Ctrl + Shift + P',
      'options.chromeHotkeyHint': '浏览器级快捷键：在 chrome://extensions/shortcuts 中修改',
      'options.hotkeyDetail': '此快捷键会立即模糊已受保护的页面。浏览器级命令快捷键仍需在 chrome://extensions/shortcuts 中修改。',
      'options.saveButton': '保存设置',
      'options.saved': '已保存。',
      'options.saveFailed': '保存设置失败。',
      'options.hotkeyRequirement': '至少包含 Ctrl、Alt、Meta 其中之一。',
      'options.pinTooShort': 'PIN 至少需要 4 位。',
      'options.presetSitesTitle': '内置站点预设',
      'options.presetSitesNote': 'Screen Veil 已内置办公 SaaS、视频站点，以及 ChatGPT、Gemini、Claude、Perplexity 等主流 AI 聊天站点。',
      'options.customSitesTitle': '你添加的网站',
      'options.customSitesEmpty': '还没有添加任何自定义网站。',
      'options.customSitesHint': '打开任意网页后，可以在弹窗中即时把当前域名加入保护。',
      'options.removeButton': '删除',
      'options.removeSuccess': '已删除自定义网站。',
      'options.removeConfirm': '要把这个自定义网站从 Screen Veil 中删除吗？',

      'overlay.badge': 'Screen Veil',
      'overlay.title': '此屏幕已受保护',
      'overlay.description': '如果你离开了座位，Screen Veil 已安全锁定此页面。输入 PIN 以继续。',
      'overlay.pinPlaceholder': '输入 PIN',
      'overlay.unlockButton': '解锁',
      'overlay.pinRequired': '请输入 PIN。',
      'overlay.pinInvalid': 'PIN 不正确。',
      'overlay.reloadError': '扩展程序已重新加载。请刷新此标签页后重试。',

      'category.work': '工作',
      'category.media': '视频',
      'category.meeting': '会议',
      'category.ai': 'AI',
      'category.custom': '自定义',

      'language.option.auto': '自动（浏览器语言）',
      'language.option.en': '英语',
      'language.option.ko': '韩语',
      'language.option.ja': '日语',
      'language.option.zh-CN': '简体中文',
    },
  };

  function normalizeLanguage(value) {
    if (value === 'auto' || value === 'en' || value === 'ko' || value === 'ja' || value === 'zh-CN') {
      return value;
    }
    return 'auto';
  }

  function getBrowserLanguage() {
    const raw = (
      (typeof chrome !== 'undefined' && chrome.i18n && typeof chrome.i18n.getUILanguage === 'function'
        ? chrome.i18n.getUILanguage()
        : '') ||
      (typeof navigator !== 'undefined' ? navigator.language : '') ||
      'en'
    ).toLowerCase();

    if (raw.startsWith('ko')) return 'ko';
    if (raw.startsWith('ja')) return 'ja';
    if (raw.startsWith('zh')) return 'zh-CN';
    return 'en';
  }

  function resolveLanguage(setting = 'auto') {
    const normalized = normalizeLanguage(setting);
    return normalized === 'auto' ? getBrowserLanguage() : normalized;
  }

  function interpolate(template, vars = {}) {
    return String(template).replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_match, key) => {
      const value = vars[key];
      return value === undefined || value === null ? '' : String(value);
    });
  }

  function t(setting, key, vars = {}) {
    const resolved = resolveLanguage(setting);
    const text = MESSAGES[resolved]?.[key] ?? MESSAGES.en?.[key] ?? key;
    return interpolate(text, vars);
  }

  function categoryLabel(setting, category) {
    return t(setting, `category.${category}`);
  }

  function languageLabel(setting, value) {
    return t(setting, `language.option.${value}`);
  }

  self.PeekProofI18n = {
    MESSAGES,
    normalizeLanguage,
    getBrowserLanguage,
    resolveLanguage,
    t,
    categoryLabel,
    languageLabel,
  };
})();
