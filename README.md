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

## Cloudflare Pages

- Build command: none
- Build output directory: `public`

`wrangler.toml` keeps the Pages output directory explicit.
