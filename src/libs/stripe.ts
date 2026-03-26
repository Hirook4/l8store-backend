import Stripe from "stripe";
import { getProduct } from "../services/product";
import { CartItem } from "../types/cart-item";
import { getStripeSecretKey } from "../utils/get-stripe-secret-key";
import { getFrontendUrl } from "../utils/get-frontend-url";
import { error } from "console";

export const stripe = new Stripe(getStripeSecretKey() || "", {});

type StripeCheckoutSessionParams = {
  cart: CartItem[];
  shippingCost: number;
  orderId: number;
};

export const createStripeCheckoutSession = async ({
  cart,
  shippingCost,
  orderId,
}: StripeCheckoutSessionParams) => {
  let stripeLineItems = [];
  for (let cartItem of cart) {
    const product = await getProduct(cartItem.productId);
    if (product) {
      stripeLineItems.push({
        price_data: {
          currency: "BRL",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.label,
          },
        },
        quantity: cartItem.quantity,
      });
    }
  }
  if (shippingCost > 0) {
    stripeLineItems.push({
      price_data: {
        currency: "BRL",
        unit_amount: Math.round(shippingCost * 100),
        product_data: {
          name: "Shipping Cost",
        },
      },
      quantity: 1,
    });
  }

  /* Criando Sessão */
  const session = await stripe.checkout.sessions.create({
    line_items: stripeLineItems,
    mode: "payment",
    metadata: {
      orderId: orderId.toString(),
    },
    success_url: `${getFrontendUrl()}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getFrontendUrl()}/my-orders`,
  });

  return session.url;
};

/* Pega o evento */
export const getConstructEvent = (
  rawBody: string,
  sig: string,
  webhookKey: string,
) => {
  try {
    return stripe.webhooks.constructEvent(rawBody, sig, webhookKey);
  } catch (err) {
    return null;
  }
};

export const getStripeCheckoutSession = async (sessionId: string) => {
  return await stripe.checkout.sessions.retrieve(sessionId);
};
