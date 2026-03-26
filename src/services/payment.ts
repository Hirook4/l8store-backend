import { CartItem } from "../types/cart-item";
import {
  createStripeCheckoutSession,
  getStripeCheckoutSession,
} from "../libs/stripe";

type createPaymentLinkParams = {
  cart: CartItem[];
  shippingCost: number;
  orderId: number;
};

export const createPaymentLink = async ({
  cart,
  shippingCost,
  orderId,
}: createPaymentLinkParams) => {
  try {
    const session = await createStripeCheckoutSession({
      cart,
      shippingCost,
      orderId,
    });
    if (!session) {
      return null;
    }
    return session;
  } catch (error) {
    return null;
  }
};

export const getOrderIdFromSession = async (sessionId: string) => {
  try {
    const session = await getStripeCheckoutSession(sessionId);
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      return null;
    }
    return parseInt(orderId);
  } catch {
    return null;
  }
};
