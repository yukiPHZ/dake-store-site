# DAKE Store

> Site-specific source of truth: `ORIGINAL.md`  
> DAKE Network registry: `dakeapp-site/ORIGINAL.md`

Public HTML uses the shared DAKE navigation from `https://dakeapp.com/assets/`
and keeps a plain `すべてのDAKE` fallback. Run the central installer when adding
a page: `node ..\dakeapp-site\scripts\apply-dake-network.js public`.

DAKE Store is a static sales shelf for DAKE products that are ready to purchase through Stripe.

This site is not the source of truth. Product information is derived from each product's `ORIGINAL.md` through `store_products.generated.json`.

## Source Policy

- `ORIGINAL.md` is the source of truth.
- `public/assets/data/store_products.generated.json` is generated data.
- Do not edit generated JSON manually.
- To update product information, update the source `ORIGINAL.md`, regenerate the JSON in `DAKE_series`, then copy it here.

## Public Shelf

- Public products satisfy `status == available`, `payment_status == stripe_ready`, and have `stripe_payment_link`.
- `booth_only`, `preparing`, `free_download`, and `not_for_sale` items may remain in generated JSON but are not public Store products.
- BOOTH, GitHub Release, and `download_url` are not Store listing conditions or alternative purchase buttons.
- Stripe Secret Key is never placed in this static site.

## Stripe Payment Link

Stripe Payment Link is the Store purchase path.

- `stripe_payment_link` is read from generated JSON.
- Products without `stripe_payment_link` are hidden from the public Store shelf even when BOOTH or download data exists.
- Stripe Secret Key must never be placed in this static site.
- Single Desktop delivery uses `/download/`, Pages Functions, Stripe Checkout Session read-back, and the private `DAKE_DESKTOP_RELEASES` R2 binding.
- `STRIPE_SECRET_KEY` is configured only as a Cloudflare Secret. Do not place it in `wrangler.toml`, HTML, JavaScript, generated JSON, or Markdown.
- The current P2 implementation allowlists `DAKE_Mail_Draft` as a pilot mapping to `desktop/DAKE_Mail_Draft/current.zip`. Production binding, object upload, Payment Link redirect update, and deployment are separate explicit operations.

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
- Only Stripe-ready products with a Payment Link are listed on the public Store shelf.
- BOOTH remains an independent sales channel and is not rendered as a Store purchase alternative.
- Eligible single Desktop products are verified from Stripe server-side and downloaded from private R2; no public `download_url` is issued.
- Refunds, support, redistribution limits, and disclaimers follow the shared DAKE Store operation rule.

Do not place Stripe Secret Key, Webhook Secret, or API keys in this static site.
## Legal Pages

The static MVP includes the minimum legal and policy pages for public sales in Japan.

- `/legal/`: Specified Commercial Transactions Act notice
- `/privacy/`: Privacy policy
- `/terms/`: Terms, refund, cancellation, and support policy

The pages keep personal contact details minimal for safety. Address, phone number, and contact details are disclosed without delay when legally required or requested through the appropriate purchase/support path.

Stripe handles payment processing. DAKE Store does not store credit card numbers and does not maintain a purchaser database in the static MVP.
## Presentation Polish

Phase 9 adjusted the public Store presentation layer only.

- Product data still comes from `store_products.generated.json`.
- Product names, prices, descriptions, Stripe URLs, and BOOTH URLs are not hand-edited in this repo.
- Purchase actions use the current Stripe Payment Link. Non-Stripe routes are not rendered as purchase alternatives.
- Footer navigation links `/legal/`, `/privacy/`, and `/terms/` are present across the Store pages.

## Visual Tone Refinement

The public Store UI is kept close to DAKE's quiet white/black presentation.

- Top-page internal source wording is not shown to general users.
- Product cards keep images and tags in separate normal-flow areas.
- Product detail pages avoid exposing internal fields such as payment status, raw payment links, download URLs, and source paths.
- Purchase actions remain data-driven by the canonical Stripe Payment Link.
## Visual Layout Refinement

The Store presentation keeps a quiet shelf layout rather than a sales landing page.

- Header labels and redundant top navigation are not shown on the main Store views.
- The `DAKE Store` title links quietly back to `/`.
- Product cards use a 4 / 2 / 1 column shelf layout across desktop, tablet, and mobile.
- Product screenshots are contained without cropping or stretching.
- Tags and badges stay below the image area in normal document flow.
- Footer links keep legal pages and quiet DAKE network links separate.
- Product data, generated JSON, prices, Stripe links, and BOOTH links are not edited in this repo.
