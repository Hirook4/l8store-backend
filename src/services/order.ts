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
