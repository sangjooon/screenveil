# Screen Veil billing + account login plan

## Public values
- Brand: Screen Veil
- Domain: https://screenveil.app
- Support email: screenveil.app@gmail.com
- Stable install URL before the real store page exists: https://screenveil.app/install

## Recommended free vs paid split
### Free
- Local PIN lock / unlock
- Built-in site presets
- Current-domain protection
- Blur strength slider
- Language selection
- Quick lock shortcut

### Paid later
- Account sync across devices
- Cloud backup for protected-site rules and settings
- Unlimited profiles
- Team policy presets
- Priority support

## Minimum website routes
- /
- /privacy
- /support
- /install
- /app/login
- /app/register
- /app/billing

## Minimum backend routes
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh
- GET /api/me
- POST /api/billing/checkout
- GET /api/billing/portal
- GET /api/billing/status
- GET /api/entitlements
- POST /api/webhooks/lemonsqueezy

## Billing flow
1. User creates a Screen Veil account on your website.
2. User clicks Upgrade.
3. Your backend creates a Lemon Squeezy checkout for the chosen plan.
4. Include the user's email and your own `user_id` in the checkout payload.
5. Redirect the user to Lemon Squeezy checkout.
6. Lemon Squeezy webhook arrives on your backend after purchase.
7. Your backend marks the subscription active.
8. The extension signs in with the same account and reads `/api/entitlements`.
9. Paid features unlock when the entitlement is active.

## Database tables
### users
- id
- email
- password_hash
- created_at

### subscriptions
- id
- user_id
- lemonsqueezy_customer_id
- lemonsqueezy_subscription_id
- variant_id
- status
- renews_at
- ends_at
- updated_at

### entitlements
- user_id
- plan
- feature_flags_json
- updated_at

## Practical release order
1. Publish the free extension first.
2. Get 20 to 50 testers.
3. Build website authentication.
4. Add Lemon Squeezy monthly and yearly plans.
5. Add extension login.
6. Put sync or premium profiles behind paid access.
