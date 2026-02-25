import { RequestHandler } from "express";
import { registerSchema } from "../schemas/register-schema";
import {
  createAddress,
  createUser,
  getAddressesFromUserId,
  logUser,
} from "../services/user";
import { loginSchema } from "../schemas/login-schema";
import { addAddressSchema } from "../schemas/add-address-schema";

/* Cadastra Usuário */
export const register: RequestHandler = async (req, res) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: "invalid request body" });
    return;
  }

  const { name, email, password } = result.data;

  const user = await createUser(name, email, password);
  if (!user) {
    res.status(400).json({ error: "failed to create user" });
    return;
  }

  res.status(201).json({ error: null, user });
};

/* Faz login */
export const login: RequestHandler = async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: "invalid request body" });
    return;
  }

  const { email, password } = result.data;
  const token = await logUser(email, password);
  if (!token) {
    res.status(401).json({ error: "invalid email or password" });
    return;
  }
  res.json({ error: null, token });
};

/* Registra novo endereço */
export const addAddress: RequestHandler = async (req, res) => {
  const userId = (req as any).userId;

  if (!userId) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  const result = addAddressSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: "invalid request body" });
    return;
  }

  const address = await createAddress(userId, result.data);

  if (!address) {
    res.status(400).json({ error: "failed to add address" });
    return;
  }

  res.status(201).json({ error: null, message: "address added successfully" });
};

/* Busca endereços do usuário logado */
export const getAddresses: RequestHandler = async (req, res) => {
  const userId = (req as any).userId;

  if (!userId) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  const addresses = await getAddressesFromUserId(userId);

  res.json({ error: null, addresses });
};
