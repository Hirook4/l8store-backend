import { RequestHandler } from "express";
import { getOrderBySessionIdSchema } from "../schemas/get-order-by-session-id-schema";
import { getOrderIdFromSession } from "../services/payment";
import { getOrderById, getUserOrders } from "../services/order";
import { getOrderSchema } from "../schemas/get-order-schema";
import { getAbsoluteImageUrl } from "../utils/get-absolute-image-url";

export const getOrderBySessionId: RequestHandler = async (req, res) => {
  const result = getOrderBySessionIdSchema.safeParse(req.query);
  if (!result.success) {
    res.status(400).json({ error: "invalid query parameters" });
    return;
  }
  const { session_id } = result.data;

  const orderId = await getOrderIdFromSession(session_id);
  if (!orderId) {
    res.status(404).json({ error: "order not found for this session" });
    return;
  }
  res.json({ error: "not implemented yet", orderId });
};

export const listOrders: RequestHandler = async (req, res) => {
  const userId = (req as any).userId;
  if (!userId) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  const orders = await getUserOrders(userId);
  res.json(orders);
};

export const getOrder: RequestHandler = async (req, res) => {
  const userId = (req as any).userId;
  if (!userId) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  const result = getOrderSchema.safeParse(req.params);
  if (!result.success) {
    res.status(400).json({ error: "invalid order id" });
    return;
  }
  const { id } = result.data;

  const order = await getOrderById(parseInt(id), userId);
  if (!order) {
    res.status(404).json({ error: "order not found" });
    return;
  }

  const itemsWithAbsoluteUrl = order.orderItems.map((item) => ({
    ...item,
    product: {
      ...item.product,
      image: item.product.image
        ? getAbsoluteImageUrl(item.product.image)
        : null,
    },
  }));
  res.json({
    error: null,
    order: { ...order, orderItems: itemsWithAbsoluteUrl },
  });
};
