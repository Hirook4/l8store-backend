import { v4 } from "uuid";
import { prisma } from "../libs/prisma";
import { compare, hash } from "bcryptjs";
import { Address } from "../types/address";

/* Registra usuário */
export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return null;
  const hashPassword = await hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), password: hashPassword },
  });
  return user;
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email };
};

/* Faz login */
export const logUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return null;

  const validPassword = await compare(password, user.password);

  if (!validPassword) return null;

  const token = v4();
  await prisma.user.update({ where: { id: user.id }, data: { token } });

  return token;
};

/* Busca usuário de acordo com token */
export const getUserIdByToken = async (token: string) => {
  const user = await prisma.user.findFirst({ where: { token } });
  if (!user) return null;
  return user.id;
};

/* Cadastra novo endereço */
export const createAddress = async (userId: number, address: Address) => {
  return await prisma.userAddress.create({
    data: {
      ...address,
      userId,
    },
  });
};

/* Busca endereços do usuário logado */
export const getAddressesFromUserId = async (userId: number) => {
  return await prisma.userAddress.findMany({
    where: { userId },
    select: {
      id: true,
      country: true,
      state: true,
      city: true,
      zipCode: true,
      street: true,
      number: true,
      complement: true,
    },
  });
};
