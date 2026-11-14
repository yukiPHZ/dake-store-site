const STRIPE_API_BASE = "https://api.stripe.com/v1";

export const DESKTOP_DELIVERIES = Object.freeze({
  DAKE_Mail_Draft: Object.freeze({
    title: "Dakeメール下書き",
    objectKey: "desktop/DAKE_Mail_Draft/current.zip",
    fileName: "DAKE_Mail_Draft.zip",
  }),
});

class PurchaseError extends Error {
  constructor(status) {
    super("purchase_not_verified");
    this.status = status;
  }
}

const errorResponse = (status) =>
  Response.json(
    { error: "purchase_not_verified" },
    {
      status,
      headers: {
        "Cache-Control": "private, no-store",
        "Referrer-Policy": "no-referrer",
      },
    },
  );

const sessionIdFrom = (request) => {
  const sessionId = new URL(request.url).searchParams.get("session_id") || "";
  if (!/^cs_(?:live|test)_[A-Za-z0-9_]+$/.test(sessionId)) {
    throw new PurchaseError(400);
  }
  return sessionId;
};

const stripeObject = async (path, secret, fetchStripe) => {
  let response;
  try {
    response = await fetchStripe(`${STRIPE_API_BASE}${path}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${secret}` },
    });
  } catch (_error) {
    throw new PurchaseError(502);
  }
  if (response.status === 404) throw new PurchaseError(404);
  if (!response.ok) throw new PurchaseError(502);
  try {
    return await response.json();
  } catch (_error) {
    throw new PurchaseError(502);
  }
};

const verifyPurchase = async (request, env, fetchStripe) => {
  const sessionId = sessionIdFrom(request);
  const secret = env.STRIPE_SECRET_KEY || "";
  if (!/^sk_live_[A-Za-z0-9_]+$/.test(secret)) throw new PurchaseError(503);

  const session = await stripeObject(
    `/checkout/sessions/${encodeURIComponent(sessionId)}`,
    secret,
    fetchStripe,
  );
  if (session.livemode !== true || session.payment_status !== "paid") {
    throw new PurchaseError(403);
  }

  const paymentLinkId =
    typeof session.payment_link === "string" ? session.payment_link : session.payment_link?.id;
  if (!/^plink_[A-Za-z0-9]+$/.test(paymentLinkId || "")) {
    throw new PurchaseError(403);
  }
  const paymentLink = await stripeObject(
    `/payment_links/${encodeURIComponent(paymentLinkId)}`,
    secret,
    fetchStripe,
  );
  if (paymentLink.livemode !== true) throw new PurchaseError(403);

  const itemId = paymentLink.metadata?.dake_item_id || "";
  if (
    !itemId ||
    paymentLink.metadata?.purchase_delivery_method !== "stripe_session_private_r2"
  ) {
    throw new PurchaseError(403);
  }
  if (session.metadata?.dake_item_id && session.metadata.dake_item_id !== itemId) {
    throw new PurchaseError(403);
  }

  const delivery = DESKTOP_DELIVERIES[itemId];
  if (!delivery) throw new PurchaseError(403);
  if (!env.DAKE_DESKTOP_RELEASES) throw new PurchaseError(503);
  return delivery;
};

export const handleDownloadStatus = async (request, env, fetchStripe = fetch) => {
  try {
    const delivery = await verifyPurchase(request, env, fetchStripe);
    const object = await env.DAKE_DESKTOP_RELEASES.head(delivery.objectKey);
    if (!object) throw new PurchaseError(404);
    return Response.json(
      { title: delivery.title },
      {
        headers: {
          "Cache-Control": "private, no-store",
          "Referrer-Policy": "no-referrer",
        },
      },
    );
  } catch (error) {
    return errorResponse(error instanceof PurchaseError ? error.status : 502);
  }
};

export const handleDownload = async (request, env, fetchStripe = fetch) => {
  try {
    const delivery = await verifyPurchase(request, env, fetchStripe);
    const object = await env.DAKE_DESKTOP_RELEASES.get(delivery.objectKey);
    if (!object) throw new PurchaseError(404);
    return new Response(object.body, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="${delivery.fileName}"`,
        "Content-Type": "application/zip",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return errorResponse(error instanceof PurchaseError ? error.status : 502);
  }
};
