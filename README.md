# DAKE Store

DAKE Store is a static sales-view MVP for DAKE products.

This site is not the source of truth. Product information is derived from each product's `ORIGINAL.md` through `store_products.generated.json`.

## Source Policy

- `ORIGINAL.md` is the source of truth.
- `public/assets/data/store_products.generated.json` is generated data.
- Do not edit generated JSON manually.
- To update product information, update the source `ORIGINAL.md`, regenerate the JSON in `DAKE_series`, then copy it here.

## MVP Scope

- Static product list
- Static product detail view
- BOOTH links when available
- No Stripe Checkout yet
- No Cloudflare Pages Functions yet
- No direct download URL issuing yet

## Stripe Payment Link

The MVP prefers Stripe Payment Link before adding Checkout API or Pages Functions.

- `stripe_payment_link` is read from generated JSON.
- Products without `stripe_payment_link` keep the BOOTH link when available.
- Products without Stripe or BOOTH are shown as preparing.
- Stripe Secret Key must never be placed in this static site.
- Pages Functions, Checkout API, Webhook, R2, and post-purchase downloads are later phases.

## Repository And Deployment

- GitHub repo: https://github.com/yukiPHZ/dake-store-site
- Cloudflare Pages project: `dake-store-site`
- Production branch: `main`
- Build command: blank
- Build output directory: `public`
- Custom domain: `store.dakeapp.com`

The custom domain is added from the Cloudflare Pages project settings after the project is connected to GitHub.

## Cloudflare Pages

- Build command: none
- Build output directory: `public`
- `wrangler.toml`: `pages_build_output_dir = "public"`

`wrangler.toml` keeps the Pages output directory explicit.
## Purchase Operations

MVP purchase operations are defined in `DAKE_series/00_core/DAKE_STORE_OPERATION_RULE.md`.

- Stripe Payment Link is the current Stripe path.
- Products without Stripe keep BOOTH links when available.
- Products without Stripe or BOOTH remain in preparing state.
- Automatic post-purchase `download_url` issuing is not implemented yet.
- GitHub Release and BOOTH may be used together as download or distribution guidance.
- Refunds, support, redistribution limits, and disclaimers follow the shared DAKE Store operation rule.

Do not place Stripe Secret Key, Webhook Secret, or API keys in this static site.
