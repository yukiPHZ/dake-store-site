import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  handleDownload,
  handleDownloadStatus,
} from "../functions/_lib/private-download.mjs";

const SESSION_ID = "cs_live_fixture";
const PAYMENT_LINK_ID = "plink_fixture";
const EXPECTED_KEY = "desktop/DAKE_Mail_Draft/current.zip";

const session = (overrides = {}) => ({
  id: SESSION_ID,
  livemode: true,
  payment_status: "paid",
  payment_link: PAYMENT_LINK_ID,
  metadata: { dake_item_id: "DAKE_Mail_Draft" },
  ...overrides,
});

const paymentLink = (overrides = {}) => ({
  id: PAYMENT_LINK_ID,
  livemode: true,
  metadata: {
    dake_item_id: "DAKE_Mail_Draft",
    purchase_delivery_method: "stripe_session_private_r2",
  },
  ...overrides,
});

const stripeFetch = ({ sessionValue = session(), paymentLinkValue = paymentLink() } = {}) => {
  const calls = [];
  const fetch = async (url, options) => {
    calls.push({ url, options });
    if (url.includes("/checkout/sessions/")) {
      if (sessionValue === null) return Response.json({}, { status: 404 });
      return Response.json(sessionValue);
    }
    if (url.includes("/payment_links/")) {
      if (paymentLinkValue === null) return Response.json({}, { status: 404 });
      return Response.json(paymentLinkValue);
    }
    return Response.json({}, { status: 404 });
  };
  return { fetch, calls };
};

const environment = ({ hasObject = true } = {}) => {
  const calls = [];
  const bucket = {
    async head(key) {
      calls.push(["head", key]);
      return hasObject ? { key } : null;
    },
    async get(key) {
      calls.push(["get", key]);
      return hasObject ? { body: new TextEncoder().encode("mock zip") } : null;
    },
  };
  return {
    env: {
      STRIPE_SECRET_KEY: "sk_live_fixture",
      DAKE_DESKTOP_RELEASES: bucket,
    },
    calls,
  };
};

const request = (query = `session_id=${SESSION_ID}`) =>
  new Request(`https://store.dakeapp.com/api/download?${query}`);

test("paid live Desktop purchase returns the fixed private R2 object", async () => {
  const stripe = stripeFetch();
  const r2 = environment();
  const response = await handleDownload(request(), r2.env, stripe.fetch);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "mock zip");
  assert.equal(response.headers.get("Content-Type"), "application/zip");
  assert.match(response.headers.get("Content-Disposition"), /DAKE_Mail_Draft\.zip/);
  assert.deepEqual(r2.calls, [["get", EXPECTED_KEY]]);
  assert.equal(stripe.calls.length, 2);
  assert.ok(stripe.calls.every((call) => call.options.method === "GET"));
});

test("status verifies the purchase and R2 object without returning the ZIP", async () => {
  const stripe = stripeFetch();
  const r2 = environment();
  const response = await handleDownloadStatus(request(), r2.env, stripe.fetch);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { title: "Dakeメール下書き" });
  assert.deepEqual(r2.calls, [["head", EXPECTED_KEY]]);
});

test("unpaid purchase is rejected", async () => {
  const stripe = stripeFetch({ sessionValue: session({ payment_status: "unpaid" }) });
  const r2 = environment();
  const response = await handleDownload(request(), r2.env, stripe.fetch);
  assert.equal(response.status, 403);
  assert.deepEqual(r2.calls, []);
});

test("test mode purchase is rejected", async () => {
  const stripe = stripeFetch({ sessionValue: session({ livemode: false }) });
  const r2 = environment();
  const response = await handleDownload(request("session_id=cs_test_fixture"), r2.env, stripe.fetch);
  assert.equal(response.status, 403);
  assert.deepEqual(r2.calls, []);
});

test("missing Session is rejected", async () => {
  const stripe = stripeFetch({ sessionValue: null });
  const r2 = environment();
  const response = await handleDownload(request(), r2.env, stripe.fetch);
  assert.equal(response.status, 404);
  assert.deepEqual(r2.calls, []);
});

test("missing DAKE metadata is rejected", async () => {
  const stripe = stripeFetch({ paymentLinkValue: paymentLink({ metadata: {} }) });
  const r2 = environment();
  const response = await handleDownload(request(), r2.env, stripe.fetch);
  assert.equal(response.status, 403);
  assert.deepEqual(r2.calls, []);
});

test("unknown product and Pack are outside the Desktop allowlist", async () => {
  for (const itemId of ["unknown_product", "DAKE_Pack_Mail"]) {
    const stripe = stripeFetch({
      sessionValue: session({ metadata: { dake_item_id: itemId } }),
      paymentLinkValue: paymentLink({
        metadata: {
          dake_item_id: itemId,
          purchase_delivery_method:
            itemId === "DAKE_Pack_Mail"
              ? "manual_email_private_download"
              : "stripe_session_private_r2",
        },
      }),
    });
    const r2 = environment();
    const response = await handleDownload(request(), r2.env, stripe.fetch);
    assert.equal(response.status, 403);
    assert.deepEqual(r2.calls, []);
  }
});

test("client R2 key injection cannot change the server mapping", async () => {
  const stripe = stripeFetch();
  const r2 = environment();
  const response = await handleDownload(
    request(`session_id=${SESSION_ID}&r2_key=desktop/other/current.zip&product_id=other`),
    r2.env,
    stripe.fetch,
  );
  assert.equal(response.status, 200);
  assert.deepEqual(r2.calls, [["get", EXPECTED_KEY]]);
});

test("missing private R2 object returns not found", async () => {
  const stripe = stripeFetch();
  const r2 = environment({ hasObject: false });
  const response = await handleDownload(request(), r2.env, stripe.fetch);
  assert.equal(response.status, 404);
  assert.deepEqual(r2.calls, [["get", EXPECTED_KEY]]);
});

test("the same Session can be downloaded again without mutation", async () => {
  const stripe = stripeFetch();
  const r2 = environment();
  const first = await handleDownload(request(), r2.env, stripe.fetch);
  const second = await handleDownload(request(), r2.env, stripe.fetch);
  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.deepEqual(r2.calls, [
    ["get", EXPECTED_KEY],
    ["get", EXPECTED_KEY],
  ]);
  assert.ok(r2.calls.every(([operation]) => operation === "get"));
});

test("client assets contain no Stripe Secret or private object mapping", async () => {
  const html = await readFile(new URL("../public/download/index.html", import.meta.url), "utf8");
  const js = await readFile(new URL("../public/assets/js/download.js", import.meta.url), "utf8");
  const client = `${html}\n${js}`;
  assert.doesNotMatch(client, /STRIPE_SECRET_KEY|sk_live_|desktop\/DAKE_Mail_Draft\/current\.zip/);
});
