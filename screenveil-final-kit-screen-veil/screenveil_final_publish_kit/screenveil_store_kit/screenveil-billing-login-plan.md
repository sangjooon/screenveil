# Screen Veil billing + account login plan

## Final choices
- Brand: Screen Veil
- Domain: https://screenveil.app
- Chrome Web Store publisher account: sangjunpark.dev@gmail.com
- Public support email for beta: sangjunpark.dev@gmail.com
- Stable install URL before the first public store URL exists: https://screenveil.app/install
- Billing provider: Lemon Squeezy
- Product gating model: Account login + entitlement check

## Recommended rollout
1. Publish the extension first as free / beta.
2. Launch website login next.
3. Add paid plans after the install funnel and privacy copy are stable.
4. Gate premium features by entitlement from your API.

## Data model
### users
- id
- email
- password_hash or social_login_provider
- created_at
- last_login_at

### subscriptions
- id
- user_id
- provider (`lemonsqueezy`)
- provider_customer_id
- provider_subscription_id
- status (`trialing`, `active`, `past_due`, `canceled`, `expired`)
- plan_code (`monthly`, `yearly`)
- renews_at
- ends_at
- created_at
- updated_at

### entitlements
- user_id
- feature_key
- enabled
- source (`plan`, `manual`, `promo`)
- updated_at

## Minimum backend routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/billing/checkout`
- `POST /api/billing/portal`
- `GET /api/billing/status`
- `POST /api/webhooks/lemonsqueezy`
- `GET /api/entitlements`

## Checkout flow
1. User signs in on `screenveil.app`.
2. User clicks upgrade.
3. Your backend creates a Lemon Squeezy checkout.
4. Pass the signed-in email and your internal `user_id` into checkout custom data.
5. Lemon Squeezy completes payment.
6. Webhook updates `subscriptions` and `entitlements`.
7. The extension signs in to your website account and fetches `/api/entitlements`.
8. Premium features unlock locally in the extension UI.

## Extension-side gating
Keep the core privacy lock usable without a server dependency during beta. Only gate premium features later, for example:
- more protected custom domains
- team policy sync
- cloud backup of settings
- admin controls
- advanced activity rules

## Notes
- Use `https://screenveil.app/install` as the stable install URL in marketing.
- After your first Chrome Web Store upload, replace the placeholder in `install/index.html` with the real store listing URL.
- You can later switch the public support address to `support@screenveil.app` once domain mail is ready.
