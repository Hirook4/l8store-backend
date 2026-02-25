import { prisma } from "../libs/prisma";

/* Busca todos os banners */
export const getAllBanners = async () => {
  const banners = await prisma.banner.findMany({
    select: { img: true, link: true },
  });
  return banners.map((banner: { img: string }) => ({
    ...banner,
    image: `media/banners/${banner.img}`,
  }));
};
