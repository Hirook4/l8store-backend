import { Request, Response, NextFunction } from "express";
import { getUserIdByToken } from "../services/user";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "missing authorization header" });
    return;
  }
  const tokenSplit = authHeader.split("Bearer ");
  if (!tokenSplit[1]) {
    res.status(401).json({ error: "invalid authorization header format" });
    return;
  }

  const token = tokenSplit[1];

  const userId = await getUserIdByToken(token);
  if (!userId) {
    res.status(401).json({ error: "invalid token" });
    return;
  }

  (req as any).userId = userId;
  next();
};
