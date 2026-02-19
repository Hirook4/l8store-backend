import { RequestHandler } from "express";
import { getCategoryBySlug, getCategoryMetadata } from "../services/category";

/* Busca categoria e metadata */
export const getCategoryWithMetadata: RequestHandler<{ slug: string }> = async (
  req,
  res,
) => {
  /* Extrai o parâmetro slug da URL */
  const { slug } = req.params;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    res.json({ error: "category not found" });
    return;
  }

  const metadata = await getCategoryMetadata(category.id);

  res.json({ error: "category with metadata", category, metadata });
};
