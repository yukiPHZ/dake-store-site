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

## Cloudflare Pages

- Build command: none
- Build output directory: `public`

`wrangler.toml` keeps the Pages output directory explicit.
