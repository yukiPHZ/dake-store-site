const assert = require("node:assert/strict");

const {
  state,
  isPublicProduct,
  purchaseAction,
  productCard,
  findProduct,
} = require("../public/assets/js/store.js");
const generated = require("../public/assets/data/store_products.generated.json");

const stripeReady = {
  id: "stripe-ready",
  type: "app",
  status: "available",
  payment_status: "stripe_ready",
  stripe_payment_link: "https://buy.stripe.com/fixture",
  title: "Stripe-ready product",
  description: "Ready to purchase.",
  price: 300,
};

const boothOnly = {
  ...stripeReady,
  id: "booth-only",
  payment_status: "booth_only",
  stripe_payment_link: null,
  booth_url: "https://example.booth.pm/items/1",
};

const preparing = {
  ...stripeReady,
  id: "preparing",
  payment_status: "preparing",
  stripe_payment_link: null,
};

const downloadOnly = {
  ...stripeReady,
  id: "download-only",
  payment_status: "free_download",
  stripe_payment_link: null,
  download_url: "https://github.com/example/release",
};

const missingLink = {
  ...stripeReady,
  id: "missing-link",
  stripe_payment_link: null,
};

assert.equal(isPublicProduct(stripeReady), true);
assert.equal(isPublicProduct(boothOnly), false);
assert.equal(isPublicProduct(preparing), false);
assert.equal(isPublicProduct(downloadOnly), false);
assert.equal(isPublicProduct(missingLink), false);

const publicGeneratedItems = generated.items.filter(isPublicProduct);
assert.ok(publicGeneratedItems.length > 0);
assert.ok(publicGeneratedItems.every((item) => item.status === "available"));
assert.ok(publicGeneratedItems.every((item) => item.payment_status === "stripe_ready"));
assert.ok(publicGeneratedItems.every((item) => Boolean(item.stripe_payment_link)));
assert.ok(generated.items.some((item) => item.payment_status !== "stripe_ready"));

state.products = [stripeReady, boothOnly, preparing, downloadOnly, missingLink].filter(isPublicProduct);
assert.equal(findProduct("stripe-ready"), stripeReady);
assert.equal(findProduct("booth-only"), null);
assert.equal(findProduct("preparing"), null);
assert.equal(findProduct("download-only"), null);
assert.equal(findProduct("missing-link"), null);

const action = purchaseAction({
  ...stripeReady,
  booth_url: "https://example.booth.pm/items/1",
  download_url: "https://github.com/example/release",
});
assert.match(action, />購入する<\/a>/);
assert.match(action, /href="https:\/\/buy\.stripe\.com\/fixture"/);
assert.doesNotMatch(action, /Stripeで購入|BOOTHで見る|取得する|example\.booth|github\.com/);
assert.equal(purchaseAction(boothOnly), "");

const card = productCard(stripeReady);
assert.doesNotMatch(card, /Stripe対応|payment-pill|BOOTHで見る|取得する/);

console.log("store-policy=passed");
