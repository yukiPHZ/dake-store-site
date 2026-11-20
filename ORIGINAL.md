# DAKE Store Original

## Identity

- Domain: `https://store.dakeapp.com/`
- Repository: `dake-store-site`
- Cloudflare Pages project: `dake-store-site`
- Public root: `public/`
- State: public

## Role

DAKE Store is the quiet sales shelf for DAKE products that are ready to purchase
through Stripe. The site must not become a loud sales landing page.

The public shelf shows only products whose canonical data is `available`, whose
`payment_status` is `stripe_ready`, and whose Stripe Payment Link exists. BOOTH
is a parallel sales channel, not a public Store shelf condition. Products may
remain in generated data without being public Store products.

## Purchase Delivery

Single Desktop DAKE purchases may redirect to `/download/?session_id={CHECKOUT_SESSION_ID}`. A Pages Function retrieves the Checkout Session and its Payment Link from Stripe, verifies live mode, paid status, `metadata.dake_item_id`, the Desktop delivery allowlist, and the private R2 object before returning a ZIP.

- The browser supplies only the Checkout Session ID.
- `STRIPE_SECRET_KEY` exists only as a Cloudflare Secret.
- `DAKE_DESKTOP_RELEASES` is a private R2 binding. It has no public URL.
- The server maps `dake_item_id` to `desktop/<product_id>/current.zip`; client-supplied product IDs, object keys, filenames, and prices are ignored.
- Pack delivery remains `manual_email_private_download`.

## Technical Boundaries

- Public pages and assets live under `public/`; purchase verification and private delivery live under `functions/`.
- Product facts and URLs must come from their repository sources of truth.
- Do not invent availability, pricing, or release state.

## DAKE Network

- The registry source is `dakeapp-site/ORIGINAL.md`.
- Shared assets are served from `https://dakeapp.com/assets/`.
- Every public HTML page keeps a plain `すべてのDAKE` fallback link.
- Do not maintain a separate network list in this repository.

## Navigation Boundary

- Store is public and appears in the shared DAKE global footer.
- Store's existing local header, product display, purchase paths, Stripe URLs,
  and delivery flow are outside this navigation change and remain unchanged.

## Protected

- Do not alter product URLs or commercial status without source confirmation.
- Do not change DNS, Cloudflare settings, or Git remotes without an explicit
  instruction.

## Deploy

Push `main`, confirm the Cloudflare Pages deployment, then verify `/`, a product
page, and the shared DAKE navigation.
