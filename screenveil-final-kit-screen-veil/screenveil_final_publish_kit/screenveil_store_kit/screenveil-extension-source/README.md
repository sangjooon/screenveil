# Screen Veil v0.4.0

Screen Veil is a Chrome extension MVP that can:

- blur selected work, media, meeting, and AI tabs after an idle timeout,
- keep video tabs active while media is still playing,
- unlock with a PIN,
- let the user set a per-page quick-lock shortcut,
- let the user register the current domain instantly from the popup,
- let the user choose the UI language,
- let the user control blur strength.

## Built-in site presets

Work:
- Gmail
- Google Calendar
- Google Docs / Sheets / Slides
- Notion
- Slack
- Discord
- Jira / Confluence
- Trello
- Figma
- GitHub
- GitLab
- Linear
- Asana
- ClickUp
- Miro
- Canva
- HubSpot

Media:
- YouTube
- Netflix
- Disney+
- Prime Video

Meetings:
- Google Meet
- Microsoft Teams

AI:
- ChatGPT
- OpenAI Platform
- Gemini
- Google AI Studio
- Claude / Claude Code Web
- Perplexity
- Microsoft Copilot
- Poe
- DeepSeek
- Grok

## New in v0.4.0

- Protect the current domain instantly from the popup, even if it was not a built-in preset.
- Choose the display language: Auto, English, Korean, Japanese, or Simplified Chinese.
- Adjust blur strength from 4px to 40px.
- Manage custom sites from the settings page.

## Notes

- Default PIN is `1234`. Change it immediately.
- Settings are stored locally in Chrome storage.
- Current-domain registration only works on normal `http` / `https` pages.
- Chrome internal pages, extension pages, and the Chrome Web Store cannot be protected.
- Browser UI such as the tab strip and address bar cannot be blurred by this extension because content scripts only run inside web pages.
