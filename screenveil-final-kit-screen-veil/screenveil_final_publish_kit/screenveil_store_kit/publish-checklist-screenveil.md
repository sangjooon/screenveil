# Screen Veil publish checklist

## Brand and account
- [ ] Brand name: `Screen Veil`
- [ ] Domain: `screenveil.app`
- [ ] Chrome Web Store publisher account: `sangjunpark.dev@gmail.com`
- [ ] Public support email for beta: `sangjunpark.dev@gmail.com`
- [ ] Enable 2-step verification on the publisher account before publish/update

## Website
- [ ] Buy/connect `screenveil.app`
- [ ] Host `landing-page/index.html` at `https://screenveil.app/`
- [ ] Host `privacy/privacy.html` at `https://screenveil.app/privacy`
- [ ] Host `support/index.html` at `https://screenveil.app/support`
- [ ] Host `install/index.html` at `https://screenveil.app/install`
- [ ] After first Chrome Web Store upload, edit `install/index.html` and replace `REAL_CHROME_WEB_STORE_URL`

## Extension package
- [ ] Upload `screenveil-extension-store-ready.zip` to the Chrome Web Store
- [ ] Verify `manifest.json` is at the ZIP root
- [ ] Use visibility `Unlisted` first for external beta, or `Private` for very small tester groups
- [ ] Set geographic distribution to `All regions` if you want worldwide distribution

## Store listing assets
- [ ] Upload store icon: `assets/screenveil-icon-128.png`
- [ ] Upload small promo tile: `assets/screenveil-promo-440x280.png`
- [ ] Upload marquee tile: `assets/screenveil-marquee-1400x560.png`
- [ ] Upload at least 1 screenshot: `assets/screenveil-screenshot-1280x800.png`
- [ ] Paste copy from `store-listing-copy.md`
- [ ] Set homepage URL to `https://screenveil.app`
- [ ] Set support URL to `https://screenveil.app/support`
- [ ] Set privacy policy URL to `https://screenveil.app/privacy`

## Privacy tab / dashboard answers
- [ ] Single purpose: Blur and lock user-selected websites when the user is idle, switches away, or manually triggers a privacy lock.
- [ ] Declare optional host permissions are requested only after user action
- [ ] Declare no remote code
- [ ] Declare local-only processing for overlay, media-state checks, and settings storage

## Payments and accounts
- [ ] Create Lemon Squeezy store
- [ ] Create monthly and yearly variants
- [ ] Set website URL to `https://screenveil.app`
- [ ] Prepare webhook endpoint before turning on paid plans
- [ ] Keep account login and billing on your website, not in the extension popup
