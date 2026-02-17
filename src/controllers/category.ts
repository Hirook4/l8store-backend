import { RequestHandler } from "express";
import { getCategoryBySlug, getCategoryMetadata } from "../services/category";

export const getCategoryWithMetadata: RequestHandler<{ slug: string }> = async (
  req,
  res,
) => {
  const { slug } = req.params;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    res.json({ error: "category not found" });
    return;
  }

  const metadata = await getCategoryMetadata(category.id);

  res.json({ error: null, category, metadata });
};
