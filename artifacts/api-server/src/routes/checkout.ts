import { ReplitConnectors } from "@replit/connectors-sdk";
import {
  CreateCheckoutSessionBody,
  CreateCheckoutSessionResponse,
  GetCheckoutSessionParams,
  GetCheckoutSessionResponse,
} from "@workspace/api-zod";
import { Router, type IRouter } from "express";

type StoreProduct = {
  name: string;
  description: string;
  unitAmount: number;
};

type StripeList<T> = { data: T[] };
type StripeProduct = {
  id: string;
  metadata?: Record<string, string>;
};
type StripePrice = {
  id: string;
  unit_amount: number | null;
  currency: string;
};
type StripeCheckoutSession = {
  id: string;
  url: string | null;
  payment_status: "paid" | "unpaid" | "no_payment_required";
  amount_total: number | null;
  currency: string | null;
  client_reference_id: string | null;
  customer_details?: { name?: string | null } | null;
  metadata?: Record<string, string>;
};

const CATALOG = new Map<string, StoreProduct>([
  ["luna-dress", { name: "Luna Ribbon Dress", description: "Rosewater midi dress with ribbon ties.", unitAmount: 11800 }],
  ["cloud-cardigan", { name: "Cloudberry Cardigan", description: "Soft sage button-front cardigan.", unitAmount: 8600 }],
  ["petal-blouse", { name: "Petal Tie Blouse", description: "Vanilla tie-neck blouse with gathered sleeves.", unitAmount: 7200 }],
  ["meadow-skirt", { name: "Meadow Bias Skirt", description: "Dusty rose satin-feel bias skirt.", unitAmount: 9400 }],
  ["moonlight-knit", { name: "Moonlight Knit", description: "Oat pointelle knit with gathered sleeves.", unitAmount: 7800 }],
  ["ribbon-cami", { name: "Ribbon Cami", description: "Berry satin cami with adjustable straps.", unitAmount: 5400 }],
  ["fawn-trousers", { name: "Fawn Wide Trousers", description: "Toasted almond wide-leg trousers.", unitAmount: 10200 }],
  ["bow-bag", { name: "Little Bow Bag", description: "Structured moss shoulder bag with a bow.", unitAmount: 6400 }],
]);

class StripeRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function stripeRequest<T>(
  path: string,
  options: { method?: string; body?: URLSearchParams } = {},
): Promise<T> {
  const connectors = new ReplitConnectors();
  const response = await connectors.proxy("stripe", path, {
    method: options.method ?? "GET",
    body: options.body,
    headers: options.body
      ? { "Content-Type": "application/x-www-form-urlencoded" }
      : undefined,
  });
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as Record<string, unknown>) : {};

  if (!response.ok) {
    const error = payload.error as { message?: string } | undefined;
    throw new StripeRequestError(
      error?.message ?? "Stripe could not complete the request.",
      response.status,
    );
  }

  return payload as T;
}

async function findOrCreatePrice(
  productId: string,
  product: StoreProduct,
  stripeProducts: StripeProduct[],
): Promise<string> {
  let stripeProduct = stripeProducts.find(
    (item) => item.metadata?.store_sku === productId,
  );

  if (!stripeProduct) {
    const body = new URLSearchParams();
    body.set("name", product.name);
    body.set("description", product.description);
    body.set("metadata[store]", "luna_belle");
    body.set("metadata[store_sku]", productId);
    stripeProduct = await stripeRequest<StripeProduct>("/v1/products", {
      method: "POST",
      body,
    });
    stripeProducts.push(stripeProduct);
  }

  const prices = await stripeRequest<StripeList<StripePrice>>(
    `/v1/prices?active=true&limit=100&product=${encodeURIComponent(stripeProduct.id)}`,
  );
  const matchingPrice = prices.data.find(
    (price) =>
      price.unit_amount === product.unitAmount && price.currency === "usd",
  );
  if (matchingPrice) return matchingPrice.id;

  const body = new URLSearchParams();
  body.set("product", stripeProduct.id);
  body.set("currency", "usd");
  body.set("unit_amount", String(product.unitAmount));
  const price = await stripeRequest<StripePrice>("/v1/prices", {
    method: "POST",
    body,
  });
  return price.id;
}

async function ensureCoupon(): Promise<string> {
  try {
    await stripeRequest(`/v1/coupons/LUNA15`);
    return "LUNA15";
  } catch (error) {
    if (!(error instanceof StripeRequestError) || error.status !== 404) {
      throw error;
    }
  }

  const body = new URLSearchParams();
  body.set("id", "LUNA15");
  body.set("name", "Luna Belle 15%");
  body.set("percent_off", "15");
  body.set("duration", "once");
  await stripeRequest("/v1/coupons", { method: "POST", body });
  return "LUNA15";
}

const router: IRouter = Router();

router.post("/checkout/session", async (req, res) => {
  const parsed = CreateCheckoutSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please check your checkout details." });
    return;
  }

  try {
    const uniqueIds = [...new Set(parsed.data.items.map((item) => item.productId))];
    const invalidId = uniqueIds.find((id) => !CATALOG.has(id));
    if (invalidId) {
      res.status(400).json({ error: "Your bag contains an unavailable item." });
      return;
    }

    const productsResponse =
      await stripeRequest<StripeList<StripeProduct>>("/v1/products?active=true&limit=100");
    const priceIds = new Map<string, string>();
    for (const id of uniqueIds) {
      const product = CATALOG.get(id);
      if (!product) continue;
      priceIds.set(
        id,
        await findOrCreatePrice(id, product, productsResponse.data),
      );
    }

    const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const forwardedHost = req.get("x-forwarded-host")?.split(",")[0]?.trim();
    const baseUrl = `${forwardedProto ?? req.protocol}://${forwardedHost ?? req.get("host")}`;
    const orderNumber = `LB-${Date.now().toString().slice(-8)}`;
    const body = new URLSearchParams();
    body.set("mode", "payment");
    body.set("submit_type", "pay");
    body.set("success_url", `${baseUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`);
    body.set("cancel_url", `${baseUrl}/checkout?cancelled=1`);
    body.set("customer_email", parsed.data.customer.email);
    body.set("client_reference_id", orderNumber);
    body.set("billing_address_collection", "required");
    body.set("phone_number_collection[enabled]", "true");
    ["SA", "AE", "US", "GB", "CA", "AU"].forEach((country) =>
      body.append("shipping_address_collection[allowed_countries][]", country),
    );
    body.set("metadata[store]", "Luna Belle");
    body.set(
      "metadata[customer_name]",
      `${parsed.data.customer.firstName} ${parsed.data.customer.lastName}`,
    );
    body.set("metadata[cart]", JSON.stringify(parsed.data.items).slice(0, 490));

    parsed.data.items.forEach((item, index) => {
      const priceId = priceIds.get(item.productId);
      if (!priceId) return;
      body.set(`line_items[${index}][price]`, priceId);
      body.set(`line_items[${index}][quantity]`, String(item.quantity));
    });

    const subtotal = parsed.data.items.reduce((sum, item) => {
      const product = CATALOG.get(item.productId);
      return sum + (product?.unitAmount ?? 0) * item.quantity;
    }, 0);
    const shippingAmount = subtotal >= 12000 ? 0 : 800;
    body.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
    body.set(
      "shipping_options[0][shipping_rate_data][fixed_amount][amount]",
      String(shippingAmount),
    );
    body.set(
      "shipping_options[0][shipping_rate_data][fixed_amount][currency]",
      "usd",
    );
    body.set(
      "shipping_options[0][shipping_rate_data][display_name]",
      shippingAmount === 0 ? "Free shipping" : "Standard shipping",
    );

    if (parsed.data.promoCode?.trim()) {
      if (parsed.data.promoCode.trim().toUpperCase() !== "LUNA15") {
        res.status(400).json({ error: "That promo code is not valid." });
        return;
      }
      body.set("discounts[0][coupon]", await ensureCoupon());
    }

    const session = await stripeRequest<StripeCheckoutSession>(
      "/v1/checkout/sessions",
      { method: "POST", body },
    );
    if (!session.url) throw new Error("Stripe did not return a checkout URL.");

    res.json(
      CreateCheckoutSessionResponse.parse({
        sessionId: session.id,
        url: session.url,
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Unable to create Stripe checkout session");
    res.status(502).json({
      error:
        error instanceof StripeRequestError
          ? error.message
          : "Secure checkout is temporarily unavailable. Please try again.",
    });
  }
});

router.get("/checkout/session/:sessionId", async (req, res) => {
  const parsed = GetCheckoutSessionParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid checkout session." });
    return;
  }

  try {
    const session = await stripeRequest<StripeCheckoutSession>(
      `/v1/checkout/sessions/${encodeURIComponent(parsed.data.sessionId)}`,
    );
    res.json(
      GetCheckoutSessionResponse.parse({
        paymentStatus: session.payment_status,
        customerName:
          session.customer_details?.name ??
          session.metadata?.customer_name ??
          "Lovely customer",
        amountTotal: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
        orderNumber: session.client_reference_id ?? session.id,
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Unable to read Stripe checkout session");
    res.status(error instanceof StripeRequestError && error.status === 404 ? 404 : 502).json({
      error: "We could not confirm this payment yet.",
    });
  }
});

export default router;