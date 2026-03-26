import { prisma } from "../libs/prisma";
import { Address } from "../types/address";
import { CartItem } from "../types/cart-item";
import { getProduct } from "./product";

type CreateOrderParams = {
  userId: number;
  address: Address;
  shippingCost: number;
  shippingDays: number;
  cart: CartItem[];
};

export const createOrder = async ({
  userId,
  address,
  shippingCost,
  shippingDays,
  cart,
}: CreateOrderParams) => {
  let subTotal = 0;
  let orderItems = [];

  /* Loop no Carrinho */
  for (let cartItem of cart) {
    const product = await getProduct(cartItem.productId);
    if (product) {
      subTotal += product.price * cartItem.quantity;
      orderItems.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: product.price,
      });
    }
  }

  /* Cria Pedido */
  const order = await prisma.order.create({
    data: {
      userId,
      total: subTotal + shippingCost,
      shippingCost,
      shippingDays,
      shippingCountry: address.country,
      shippingZipCode: address.zipCode,
      shippingState: address.state,
      shippingCity: address.city,
      shippingStreet: address.street,
      shippingNumber: address.number,
      shippingComplement: address.complement,
      orderItems: {
        create: orderItems,
      },
    },
  });

  if (!order) {
    return null;
  }

  return order.id;
};

export const updateOrderStatus = async (
  orderId: number,
  status: "paid" | "cancelled",
) => {
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

export const getUserOrders = async (userId: number) => {
  return await prisma.order.findMany({
    where: { userId },
    select: {
      id: true,
      status: true,
      total: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getOrderById = async (id: number, userId: number) => {
  const order = await prisma.order.findFirst({
    where: { id, userId },
    select: {
      id: true,
      status: true,
      total: true,
      shippingCost: true,
      shippingDays: true,
      shippingCountry: true,
      shippingZipCode: true,
      shippingState: true,
      shippingCity: true,
      shippingStreet: true,
      shippingNumber: true,
      shippingComplement: true,
      createdAt: true,
      orderItems: {
        select: {
          id: true,
          quantity: true,
          price: true,
          product: {
            select: {
              id: true,
              label: true,
              price: true,
              images: {
                take: 1,
                orderBy: { id: "asc" },
              },
            },
          },
        },
      },
    },
  });
  if (!order) {
    return null;
  }
  return {
    ...order,
    orderItems: order.orderItems.map((item) => ({
      ...item,
      product: {
        ...item.product,
        image: item.product.images[0]
          ? `media/products/${item.product.images[0].url}`
          : null,
      },
    })),
  };
};
