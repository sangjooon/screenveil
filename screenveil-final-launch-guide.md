# Screen Veil final launch guide

## Locked-in values
- Brand: Screen Veil
- Domain: https://screenveil.app
- Support email: screenveil.app@gmail.com
- Temporary install URL to use everywhere before the real Chrome Web Store link exists: https://screenveil.app/install

## Files in this kit
- `screenveil-extension-store-ready.zip` — upload this to Chrome Web Store
- `landing-page/` — homepage for screenveil.app
- `privacy/` — privacy policy page
- `support/` — support page
- `install/` — temporary install landing page; replace the placeholder store URL after your first upload
- `assets/` — icon, promo tile, screenshot, marquee image
- `store-listing-copy.md` — ready-to-paste listing text
- `publish-checklist-screenveil.md` — release checklist
- `screenveil-billing-login-plan.md` — login + Lemon Squeezy plan

## Recommended release order
1. Buy and connect `screenveil.app`.
2. Host `landing-page`, `privacy`, `support`, and `install` as static pages.
3. Create your Chrome Web Store developer item with `screenveil-extension-store-ready.zip`.
4. Use **Unlisted** first and verify install flow.
5. Replace `REAL_CHROME_WEB_STORE_URL` inside `install/index.html` after Chrome gives you the real listing URL.
6. Submit final screenshots and listing copy.
7. Publish the free extension.
8. Then add account login and Lemon Squeezy billing on your website.

## Before you click publish
- Confirm the extension ZIP opens with `manifest.json` at the ZIP root.
- Confirm `screenveil.app/install` points to the final Chrome Web Store URL.
- Confirm privacy policy, support page, and homepage are publicly reachable.
- Capture at least 3 real screenshots from the running extension.
- Check every place that still says `Screen Veil` and not an old brand spelling.
