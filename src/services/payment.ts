import { prisma } from "../libs/prisma";

export const createPaymentLink = async (orderId: number) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });
};
