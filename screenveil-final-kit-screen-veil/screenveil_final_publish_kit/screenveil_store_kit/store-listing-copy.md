# Screen Veil — Chrome Web Store copy pack

## 1) Store title
Screen Veil — Privacy Blur for Work Tabs

## 2) Short description (EN)
Blur sensitive tabs when you step away. Protect work apps, AI chats, media, and any site with instant re-unlock.

## 3) Short description (KO)
자리를 비우면 민감한 탭을 자동 블러. 업무앱, AI 대화, 미디어, 임의 사이트까지 빠르게 다시 열 수 있습니다.

## 4) Long description (EN)
Screen Veil helps you protect sensitive browser tabs in shared spaces, offices, classrooms, libraries, and cafes.

When you're idle, switch tabs, or trigger your own quick-lock shortcut, Screen Veil blurs the page and asks for a PIN before anyone nearby can keep reading. It works with work tools, AI chats, media sites, and user-added domains.

Why people install Screen Veil
• Protect email, docs, calendars, chat, dashboards, and AI conversations when you step away
• Add your current site instantly — even if it isn't in the built-in presets
• Keep videos counted as "active" while they're playing, then auto-protect when playback stops and you're idle
• Choose your interface language inside the extension
• Adjust blur strength for different screens and privacy needs
• Unlock in seconds with a local PIN

Built-in presets include
• Work: Gmail, Google Calendar, Google Docs/Sheets/Slides, Notion, Slack, Discord, Jira/Confluence, Trello, Figma, GitHub, GitLab, Linear, Asana, ClickUp, Miro, Canva, HubSpot
• Media: YouTube, Netflix, Disney+, Prime Video
• AI: ChatGPT, OpenAI Platform, Gemini, Google AI Studio, Claude, Perplexity, Copilot, Poe, DeepSeek, Grok
• Meetings: Google Meet, Microsoft Teams

Privacy first
• No remote code
• No ads
• No remote analytics
• Your PIN hash, site rules, language choice, and blur settings stay in extension storage on your device
• Screen Veil does not upload your email, documents, prompts, messages, video content, or page text to our servers

Good to know
• Browser UI such as the tab strip and address bar cannot be blurred by a standard Chrome extension
• You control which sites are protected

## 5) Long description (KO)
Screen Veil은 사무실, 학교, 도서관, 카페처럼 주변 시선이 있는 공간에서 민감한 브라우저 탭을 빠르게 가려주는 프라이버시 확장 프로그램입니다.

사용자가 일정 시간 입력하지 않거나, 탭을 전환하거나, 직접 지정한 빠른 잠금 단축키를 누르면 Screen Veil이 페이지를 블러 처리하고 PIN 입력 전까지 내용을 가립니다. 업무 도구, AI 대화, 미디어 사이트, 사용자가 직접 추가한 도메인까지 보호할 수 있습니다.

주요 기능
• 자리를 비웠을 때 이메일, 문서, 캘린더, 채팅, 대시보드, AI 대화 보호
• 기본 프리셋에 없는 사이트도 현재 도메인을 즉시 등록해 보호
• 영상이 재생 중이면 활동 중으로 간주하고, 재생이 멈추고 사용자가 유휴 상태면 자동 보호
• 확장 내부에서 언어 선택 가능
• 화면 크기나 민감도에 맞게 블러 강도 조절 가능
• 로컬 PIN으로 빠르게 잠금 해제

기본 지원 사이트
• 업무: Gmail, Google Calendar, Google Docs/Sheets/Slides, Notion, Slack, Discord, Jira/Confluence, Trello, Figma, GitHub, GitLab, Linear, Asana, ClickUp, Miro, Canva, HubSpot
• 미디어: YouTube, Netflix, Disney+, Prime Video
• AI: ChatGPT, OpenAI Platform, Gemini, Google AI Studio, Claude, Perplexity, Copilot, Poe, DeepSeek, Grok
• 미팅: Google Meet, Microsoft Teams

프라이버시 원칙
• 원격 코드 사용 안 함
• 광고 없음
• 원격 분석 없음
• PIN 해시, 보호 사이트 규칙, 언어 선택, 블러 설정은 사용자 기기의 확장 저장소에만 저장
• 이메일, 문서, 프롬프트, 메시지, 영상 내용, 페이지 텍스트를 서버로 업로드하지 않음

알아둘 점
• 일반 Chrome 확장만으로는 브라우저 탭 영역과 주소창 자체를 블러 처리할 수 없음
• 어떤 사이트를 보호할지는 사용자가 직접 제어

## 6) Single purpose description (Privacy tab, EN)
Blur and lock user-selected websites when the user is idle, switches away, or manually triggers a privacy lock.

## 7) Single purpose description (Privacy tab, KO)
사용자가 선택한 웹사이트를 유휴 상태, 탭 전환, 또는 수동 잠금 시 블러 처리하고 PIN으로 다시 열 수 있게 하는 프라이버시 보호 확장 프로그램입니다.

## 8) Permission justifications (EN)

### idle
Used to detect when the user becomes idle so Screen Veil can blur protected tabs automatically.

### storage
Used to store settings locally on the user's device, including the PIN hash, protected site rules, blur strength, language preference, and shortcut preference.

### scripting
Used to inject the local blur overlay into user-protected tabs.

### tabs
Used to read the current tab's URL and title so the extension can identify supported services and let the user instantly protect the current domain.

### optional host permissions: http://*/* and https://*/*
These permissions are requested only after a user action, when the user enables protection for a built-in preset or chooses to protect the current domain. They are needed so the extension can run the blur overlay on that site.

## 9) Remote code declaration
No. Screen Veil does not use remote code.

## 10) Privacy / data usage notes for the dashboard
Suggested answers:
- User data collection: No user data is collected or transmitted to a remote server.
- Local handling only: The extension processes page state locally to apply the overlay, detect media playback, and store settings on-device.
- No sale / transfer: Screen Veil does not sell user data and does not transfer it for unrelated advertising, analytics, or data-broker purposes.
- No remote analytics: No third-party analytics SDKs or remote logging are included.

## 11) URLs you should prepare before publishing
- Homepage / official site: https://screenveil.app
- Support URL: https://screenveil.app/support
- Privacy Policy URL: https://screenveil.app/privacy
- Contact email: sangjunpark.dev@gmail.com

## 12) Screenshot plan (store requires at least 1)
Recommended 5 screenshots:
1. Gmail protected with blur overlay visible
2. ChatGPT conversation protected
3. YouTube paused -> auto-protect state
4. Popup showing “Protect this site” on a custom domain
5. Options page showing language selector + blur strength slider

Capture size recommendation from Chrome docs:
- 1280x800 preferred
- 640x400 accepted
