import { RequestHandler } from "express";
import { cartMountSchema } from "../schemas/cart-mount-schema";
import { getProduct } from "../services/product";
import { getAbsoluteImageUrl } from "../utils/get-absolute-image-url";
import { calculateShippingSchema } from "../schemas/calculate-shipping-schema";
import { cartFinishSchema } from "../schemas/cart-finish-schema";
import { getAddressById } from "../services/user";
import { createOrder } from "../services/order";
import { createPaymentLink } from "../services/payment";

export const cartMount: RequestHandler = async (req, res) => {
  const parseResult = cartMountSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "invalid cart mount parameters" });
    return;
  }
  const { ids } = parseResult.data;

  let products = [];
  for (const id of ids) {
    const product = await getProduct(id);
    if (product) {
      products.push({
        id: product.id,
        label: product.label,
        price: product.price,
        image: product.images[0]
          ? getAbsoluteImageUrl(product.images[0])
          : null,
      });
    }
  }
  res.json({ message: "cart mounted", products });
};

/* Calcula frete (por enquanto o frete é fixo) */
export const calculateShipping: RequestHandler = (req, res) => {
  const parseResult = calculateShippingSchema.safeParse(req.query);
  if (!parseResult.success) {
    res.status(400).json({ error: "invalid shipping parameters" });
    return;
  }
  const { zipCode } = parseResult.data;
  res.json({ error: null, zipCode, cost: 10, days: 5 });
};

/* Finaliza compra */
export const finish: RequestHandler = async (req, res) => {
  const userId = (req as any).userId;
  if (!userId) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  const result = cartFinishSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "invalid finish cart parameters" });
    return;
  }

  const { cart, addressId } = result.data;

  const address = await getAddressById(userId, addressId);
  if (!address) {
    res.status(400).json({ error: "invalid address id" });
    return;
  }

  /* TODO */
  const shippingCost = 10;
  const shippingDays = 5;

  const orderId = await createOrder({
    userId,
    address,
    shippingCost,
    shippingDays,
    cart,
  });

  /* Pagamento */
  if (!orderId) {
    res.status(400).json({ error: "failed to create order" });
    return;
  }
  const url = await createPaymentLink({
    cart,
    shippingCost,
    orderId,
  });

  if (!url) {
    res.status(400).json({ error: "failed to create payment link" });
    return;
  }
  res.status(201).json({ error: null, url });
};
