const STRIPE_API_BASE = "https://api.stripe.com/v1";

export const DESKTOP_DELIVERIES = Object.freeze({
  "DAKE_Backup": Object.freeze({
    title: "Dakeバックアップ",
    objectKey: "desktop/DAKE_Backup/current.zip",
    fileName: "DAKE_Backup.zip",
  }),
  "DAKE_Git_Memo": Object.freeze({
    title: "DakeGitメモ",
    objectKey: "desktop/DAKE_Git_Memo/current.zip",
    fileName: "DAKE_Git_Memo.zip",
  }),
  "DAKE_Image_BatchPDF": Object.freeze({
    title: "Dake画像まとめPDF",
    objectKey: "desktop/DAKE_Image_BatchPDF/current.zip",
    fileName: "DAKE_Image_BatchPDF.zip",
  }),
  "DAKE_Image_PasteA4": Object.freeze({
    title: "貼る",
    objectKey: "desktop/DAKE_Image_PasteA4/current.zip",
    fileName: "DAKE_Image_PasteA4.zip",
  }),
  "DAKE_Mail_Address_Format": Object.freeze({
    title: "Dakeメールアドレス整形",
    objectKey: "desktop/DAKE_Mail_Address_Format/current.zip",
    fileName: "DAKE_Mail_Address_Format.zip",
  }),
  "DAKE_Mail_Draft": Object.freeze({
    title: "Dakeメール下書き",
    objectKey: "desktop/DAKE_Mail_Draft/current.zip",
    fileName: "DAKE_Mail_Draft.zip",
  }),
  "DAKE_Maji_Memo": Object.freeze({
    title: "マジでメモ",
    objectKey: "desktop/DAKE_Maji_Memo/current.zip",
    fileName: "DAKE_Maji_Memo.zip",
  }),
  "DAKE_Sticky_Memo": Object.freeze({
    title: "付箋メモ",
    objectKey: "desktop/DAKE_Sticky_Memo/current.zip",
    fileName: "DAKE_Sticky_Memo.zip",
  }),
  "DAKE_Yesterday_Task_Memo": Object.freeze({
    title: "Dake昨日タスクメモ",
    objectKey: "desktop/DAKE_Yesterday_Task_Memo/current.zip",
    fileName: "DAKE_Yesterday_Task_Memo.zip",
  }),
  "dake_column_memo": Object.freeze({
    title: "ずっとメモ",
    objectKey: "desktop/dake_column_memo/current.zip",
    fileName: "dake_column_memo.zip",
  }),
  "dake_document_cover": Object.freeze({
    title: "Dake書類送付状",
    objectKey: "desktop/dake_document_cover/current.zip",
    fileName: "dake_document_cover.zip",
  }),
  "dake_fax_cover": Object.freeze({
    title: "DakeFAX送付状",
    objectKey: "desktop/dake_fax_cover/current.zip",
    fileName: "dake_fax_cover.zip",
  }),
  "dake_folder_list": Object.freeze({
    title: "Dakeフォルダ一覧",
    objectKey: "desktop/dake_folder_list/current.zip",
    fileName: "dake_folder_list.zip",
  }),
  "dake_image_heictojpg": Object.freeze({
    title: "HEIC→JPG変換",
    objectKey: "desktop/dake_image_heictojpg/current.zip",
    fileName: "dake_image_heictojpg.zip",
  }),
  "dake_image_iphonetopc": Object.freeze({
    title: "Dake画像iPhoneToPC",
    objectKey: "desktop/dake_image_iphonetopc/current.zip",
    fileName: "dake_image_iphonetopc.zip",
  }),
  "dake_image_resize": Object.freeze({
    title: "Dake画像リサイズ",
    objectKey: "desktop/dake_image_resize/current.zip",
    fileName: "dake_image_resize.zip",
  }),
  "dake_image_topdf": Object.freeze({
    title: "DakeImageToPDF",
    objectKey: "desktop/dake_image_topdf/current.zip",
    fileName: "dake_image_topdf.zip",
  }),
  "dake_mail_allstaff": Object.freeze({
    title: "Dake全社員メール起動",
    objectKey: "desktop/dake_mail_allstaff/current.zip",
    fileName: "dake_mail_allstaff.zip",
  }),
  "dake_mail_list": Object.freeze({
    title: "Dakeメールリスト",
    objectKey: "desktop/dake_mail_list/current.zip",
    fileName: "dake_mail_list.zip",
  }),
  "dake_mansion_schedule": Object.freeze({
    title: "マンション工程表",
    objectKey: "desktop/dake_mansion_schedule/current.zip",
    fileName: "dake_mansion_schedule.zip",
  }),
  "dake_pdf_checkstamp": Object.freeze({
    title: "Dake確認印",
    objectKey: "desktop/dake_pdf_checkstamp/current.zip",
    fileName: "dake_pdf_checkstamp.zip",
  }),
  "dake_pdf_compress": Object.freeze({
    title: "DakePDF圧縮",
    objectKey: "desktop/dake_pdf_compress/current.zip",
    fileName: "dake_pdf_compress.zip",
  }),
  "dake_pdf_crop": Object.freeze({
    title: "DakePDFトリミング",
    objectKey: "desktop/dake_pdf_crop/current.zip",
    fileName: "dake_pdf_crop.zip",
  }),
  "dake_pdf_extract": Object.freeze({
    title: "DakePDF抽出",
    objectKey: "desktop/dake_pdf_extract/current.zip",
    fileName: "dake_pdf_extract.zip",
  }),
  "dake_pdf_lookhere": Object.freeze({
    title: "DakePDFここ見て",
    objectKey: "desktop/dake_pdf_lookhere/current.zip",
    fileName: "dake_pdf_lookhere.zip",
  }),
  "dake_pdf_marker": Object.freeze({
    title: "DakePDFマーカー",
    objectKey: "desktop/dake_pdf_marker/current.zip",
    fileName: "dake_pdf_marker.zip",
  }),
  "dake_pdf_merge": Object.freeze({
    title: "DakePDF結合（応援購入版）",
    objectKey: "desktop/dake_pdf_merge/current.zip",
    fileName: "dake_pdf_merge.zip",
  }),
  "dake_pdf_overview_rename": Object.freeze({
    title: "DakePDF俯瞰名前変更",
    objectKey: "desktop/dake_pdf_overview_rename/current.zip",
    fileName: "dake_pdf_overview_rename.zip",
  }),
  "dake_pdf_rename": Object.freeze({
    title: "DakePDFファイル名整理",
    objectKey: "desktop/dake_pdf_rename/current.zip",
    fileName: "dake_pdf_rename.zip",
  }),
  "dake_pdf_reorder": Object.freeze({
    title: "DakePDFページ並べ替え",
    objectKey: "desktop/dake_pdf_reorder/current.zip",
    fileName: "dake_pdf_reorder.zip",
  }),
  "dake_pdf_splitone": Object.freeze({
    title: "DakePDF分割One",
    objectKey: "desktop/dake_pdf_splitone/current.zip",
    fileName: "dake_pdf_splitone.zip",
  }),
  "dake_pdf_splitselect": Object.freeze({
    title: "DakePDF分割Select",
    objectKey: "desktop/dake_pdf_splitselect/current.zip",
    fileName: "dake_pdf_splitselect.zip",
  }),
  "dake_pdf_toimages": Object.freeze({
    title: "DakePDFto画像",
    objectKey: "desktop/dake_pdf_toimages/current.zip",
    fileName: "dake_pdf_toimages.zip",
  }),
  "dake_pdf_viewer": Object.freeze({
    title: "DakePDF見る",
    objectKey: "desktop/dake_pdf_viewer/current.zip",
    fileName: "dake_pdf_viewer.zip",
  }),
  "dake_price_apportionment": Object.freeze({
    title: "Dake価格按分",
    objectKey: "desktop/dake_price_apportionment/current.zip",
    fileName: "dake_price_apportionment.zip",
  }),
  "dake_price_fixedtax": Object.freeze({
    title: "Dake固都税計算",
    objectKey: "desktop/dake_price_fixedtax/current.zip",
    fileName: "dake_price_fixedtax.zip",
  }),
  "dake_reform_progress": Object.freeze({
    title: "リフォーム進捗管理",
    objectKey: "desktop/dake_reform_progress/current.zip",
    fileName: "dake_reform_progress.zip",
  }),
  "dake_screen_webp": Object.freeze({
    title: "DakeScreen_WebP",
    objectKey: "desktop/dake_screen_webp/current.zip",
    fileName: "dake_screen_webp.zip",
  }),
  "dake_screenshot_print": Object.freeze({
    title: "Dakeスクショ印刷",
    objectKey: "desktop/dake_screenshot_print/current.zip",
    fileName: "dake_screenshot_print.zip",
  }),
  "dake_two_person_memo": Object.freeze({
    title: "Dake二人メモ",
    objectKey: "desktop/dake_two_person_memo/current.zip",
    fileName: "dake_two_person_memo.zip",
  }),
  "dake_work_calendar": Object.freeze({
    title: "Dake工程カレンダー",
    objectKey: "desktop/dake_work_calendar/current.zip",
    fileName: "dake_work_calendar.zip",
  }),
  "dake_year_age": Object.freeze({
    title: "Dake築年数",
    objectKey: "desktop/dake_year_age/current.zip",
    fileName: "dake_year_age.zip",
  }),
  "dake_year_notice": Object.freeze({
    title: "Dake今年の注意点",
    objectKey: "desktop/dake_year_notice/current.zip",
    fileName: "dake_year_notice.zip",
  }),
  "time_advanced_timer": Object.freeze({
    title: "Dakeアドバンスドタイマー",
    objectKey: "desktop/time_advanced_timer/current.zip",
    fileName: "time_advanced_timer.zip",
  }),
  "DAKE_Pack_Document": Object.freeze({
    title: "DAKE 書類整理パック",
    objectKey: "desktop/DAKE_Pack_Document/current.zip",
    fileName: "DAKE_Pack_Document.zip",
  }),
  "DAKE_Pack_Mail": Object.freeze({
    title: "DAKE メール準備パック",
    objectKey: "desktop/DAKE_Pack_Mail/current.zip",
    fileName: "DAKE_Pack_Mail.zip",
  }),
  "SHIMARISU_Pack": Object.freeze({
    title: "しまりすくん 実務判断Pack",
    objectKey: "desktop/SHIMARISU_Pack/current.zip",
    fileName: "SHIMARISU_Pack.zip",
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
