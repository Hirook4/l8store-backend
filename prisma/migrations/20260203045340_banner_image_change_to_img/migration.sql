/*
  Warnings:

  - You are about to drop the column `image` on the `Banner` table. All the data in the column will be lost.
  - Added the required column `img` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "image",
ADD COLUMN     "img" TEXT NOT NULL;
