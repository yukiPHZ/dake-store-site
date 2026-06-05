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
- Purchase actions are rendered in this priority: Stripe Payment Link, BOOTH, preparing.
- Footer navigation links `/legal/`, `/privacy/`, and `/terms/` are present across the Store pages.

## Visual Tone Refinement

The public Store UI is kept close to DAKE's quiet white/black presentation.

- Top-page internal source wording is not shown to general users.
- Product cards keep images and tags in separate normal-flow areas.
- Product detail pages avoid exposing internal fields such as payment status, raw payment links, download URLs, and source paths.
- Purchase actions remain data-driven: Stripe Payment Link, BOOTH, then preparing.
## Visual Layout Refinement

The Store presentation keeps a quiet shelf layout rather than a sales landing page.

- Header labels and redundant top navigation are not shown on the main Store views.
- Product cards use a 4 / 2 / 1 column shelf layout across desktop, tablet, and mobile.
- Product screenshots are contained without cropping or stretching.
- Tags and badges stay below the image area in normal document flow.
- Product data, generated JSON, prices, Stripe links, and BOOTH links are not edited in this repo.
