import { RequestHandler } from "express";
import { getAllBanners } from "../services/banner";
import { getAbsoluteImageUrl } from "../utils/get-absolute-image-url";

export const getBanners: RequestHandler = async (req, res) => {
  const banners = await getAllBanners();
  const bannerWithAbsoluteUrl = banners.map((banner: { img: string }) => ({
    ...banner,
    img: getAbsoluteImageUrl(banner.img),
  }));
  res.json({ banners: bannerWithAbsoluteUrl });
};

export function getProducts(arg0: string, getProducts: any) {
  throw new Error("function not implemented.");
}
