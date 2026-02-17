import { RequestHandler } from "express";
import {
  getAllProducts,
  getProduct,
  getProductsFromSameCategory,
  incrementProductView,
} from "../services/product";
import { getProductSchema } from "../schemas/get-product-schemas";
import { getAbsoluteImageUrl } from "../utils/get-absolute-image-url";
import { getOneProductSchema } from "../schemas/get-one-product-schema";
import { getCategory } from "../services/category";
import { getRelatedProductsSchema } from "../schemas/get-related-products-schema";
import { getRelatedProductsQuerySchema } from "../schemas/get-one-product-query-schema";

/* Busca todos os produtos */
export const getProducts: RequestHandler = async (req, res) => {
  const parseResult = getProductSchema.safeParse(req.query);
  if (!parseResult.success) {
    res.status(400).json({ error: "invalid query parameters" });
    return;
  }

  const { metadata, orderBy, limit } = parseResult.data;

  const parsedLimit = limit ? parseInt(limit) : undefined;
  const parsedMetadata = metadata ? JSON.parse(metadata) : undefined;

  const products = await getAllProducts({
    metadata: parsedMetadata,
    order: orderBy,
    limit: parsedLimit,
  });

  const productsWithAbsoluteUrl = products.map((product) => ({
    ...product,
    image: product.image ? getAbsoluteImageUrl(product.image) : null,
    liked: false,
  }));

  res.json({ error: null, products: productsWithAbsoluteUrl });
};

/* Busca um único produto */
export const getOneProduct: RequestHandler = async (req, res) => {
  const paramsResult = getOneProductSchema.safeParse(req.params);
  if (!paramsResult.success) {
    res.status(400).json({ error: "invalid product id" });
    return;
  }

  const { id } = paramsResult.data;
  const product = await getProduct(parseInt(id));
  if (!product) {
    res.json({ error: "product not found" });
    return;
  }

  const productWithAbsoluteImages = {
    ...product,
    images: product.images.map((img) => getAbsoluteImageUrl(img)),
  };

  const category = await getCategory(product.categoryId);

  await incrementProductView(product.id);

  res.json({
    error: null,
    product: productWithAbsoluteImages,
    category,
  });
};

export const getRelatedProducts: RequestHandler = async (req, res) => {
  const paramsResult = getRelatedProductsSchema.safeParse(req.params);
  const queryResult = getRelatedProductsQuerySchema.safeParse(req.query);
  if (!paramsResult.success || !queryResult.success) {
    res.status(400).json({ error: "invalid parameters" });
    return;
  }

  const { id } = paramsResult.data;
  const { limit } = queryResult.data;

  const products = await getProductsFromSameCategory(
    parseInt(id),
    limit ? parseInt(limit) : undefined,
  );

  const productsWithAbsoluteUrl = products.map((product) => ({
    ...product,
    image: product.image ? getAbsoluteImageUrl(product.image) : null,
    liked: false,
  }));

  res.json({ error: null, products: productsWithAbsoluteUrl });
};
