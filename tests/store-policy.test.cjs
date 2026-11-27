const assert = require("node:assert/strict");

const {
  state,
  isPublicProduct,
  isPackProduct,
  purchaseAction,
  deliveryNotice,
  includedItemsSection,
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

assert.equal(generated.items.length, 47);

const discontinuedIds = [
  "DAKE_Pack_Memo",
  "dake_mail_kikuta",
  "dake_booth_assist",
  "video_shorts_cut",
  "dake_pdf_merge_mini",
  "dake_image_receiver",
  "DAKE_App_Doko",
  "dake_launcher",
  "game_alien_road",
  "game_diver_catch",
];
for (const discontinuedId of discontinuedIds) {
  assert.equal(
    generated.items.some((item) => item.id === discontinuedId),
    false,
    `Discontinued product should not be in catalog: ${discontinuedId}`,
  );
}

const shimarisu = generated.items.find((item) => item.id === "SHIMARISU_Pack");
assert.ok(shimarisu);
assert.equal(isPackProduct(shimarisu), true);
assert.match(deliveryNotice(shimarisu), /Pack ZIPをダウンロード/);
assert.match(includedItemsSection(shimarisu), /ShimarisuKun\.exe/);

const packMail = generated.items.find((item) => item.id === "DAKE_Pack_Mail");
assert.ok(packMail);
assert.equal(isPackProduct(packMail), true);
assert.equal(packMail.included_items.length, 3);
assert.match(includedItemsSection(packMail), /Dakeメールリスト/);
assert.match(includedItemsSection(packMail), /Dakeメール下書き/);

const pdfMerge = generated.items.find((item) => item.id === "dake_pdf_merge");
assert.ok(pdfMerge);
assert.match(pdfMerge.title, /応援購入版/);
assert.match(pdfMerge.description, /無料配布版と同一機能/);

const batchPdf = generated.items.find((item) => item.id === "DAKE_Image_BatchPDF");
assert.ok(batchPdf);
assert.equal(batchPdf.status, "available");

console.log("store-policy=passed");
