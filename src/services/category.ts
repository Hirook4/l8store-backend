import { prisma } from "../libs/prisma";

/* Busca uma única categoria */
export const getCategory = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
  return category;
};

/* Busca categoria pelo slug */
export const getCategoryBySlug = async (slug: string) => {
  const category = await prisma.category.findFirst({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
  return category;
};

/* Busca metadados de uma categoria */
export const getCategoryMetadata = async (id: number) => {
  const metadata = await prisma.categoryMetadata.findMany({
    where: { categoryId: id },
    select: {
      id: true,
      name: true,
      values: { select: { id: true, label: true } },
    },
  });
  return metadata;
};
