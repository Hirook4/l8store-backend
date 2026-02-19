import { RequestHandler } from "express";
import { cartMountSchema } from "../schemas/cart-mount-schema";
import { getProduct } from "../services/product";
import { getAbsoluteImageUrl } from "../utils/get-absolute-image-url";
import { calculateShippingSchema } from "../schemas/calculate-shipping-schema";

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
  const { zipcode } = parseResult.data;
  res.json({ error: null, zipcode, cost: 10, days: 5 });
};
