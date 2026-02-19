import { RequestHandler } from "express";
import { getAllBanners } from "../services/banner";
import { getAbsoluteImageUrl } from "../utils/get-absolute-image-url";

export const getBanners: RequestHandler = async (req, res) => {
  /* Busca todos os banners */
  const banners = await getAllBanners();

  /* Transforma todos os caminhos em URL absoluta */
  const bannerWithAbsoluteUrl = banners.map((banner: { img: string }) => ({
    ...banner,
    img: getAbsoluteImageUrl(banner.img),
  }));

  res.json({ banners: bannerWithAbsoluteUrl });
};
