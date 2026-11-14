# DAKE Store Original

## Identity

- Domain: `https://store.dakeapp.com/`
- Repository: `dake-store-site`
- Cloudflare Pages project: `dake-store-site`
- Public root: `public/`
- State: beta

## Role

DAKE Store is the quiet sales shelf for DAKE products that are ready to purchase
through Stripe. The site must not become a loud sales landing page.

The public shelf shows only products whose canonical data is `available`, whose
`payment_status` is `stripe_ready`, and whose Stripe Payment Link exists. BOOTH
is a parallel sales channel, not a public Store shelf condition. Products may
remain in generated data without being public Store products.

## Technical Boundaries

- The site is static and lives under `public/`.
- Product facts and URLs must come from their repository sources of truth.
- Do not invent availability, pricing, or release state.

## DAKE Network

- The registry source is `dakeapp-site/ORIGINAL.md`.
- Shared assets are served from `https://dakeapp.com/assets/`.
- Every public HTML page keeps a plain `すべてのDAKE` fallback link.
- Do not maintain a separate network list in this repository.

## Protected

- Do not alter product URLs or commercial status without source confirmation.
- Do not change DNS, Cloudflare settings, or Git remotes without an explicit
  instruction.

## Deploy

Push `main`, confirm the Cloudflare Pages deployment, then verify `/`, a product
page, and the shared DAKE navigation.
