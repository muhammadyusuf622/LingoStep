/*
  Warnings:

  - You are about to drop the column `page` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `page_order` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `saved_page_order` on the `writeBookTypeng` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `writeBookTypeng` table. All the data in the column will be lost.
  - Added the required column `imgUrl` to the `book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `page` to the `writeBookTypeng` table without a default value. This is not possible if the table is not empty.
  - Added the required column `page_order` to the `writeBookTypeng` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "writeBookTypeng" DROP CONSTRAINT "writeBookTypeng_user_id_fkey";

-- AlterTable
ALTER TABLE "book" DROP COLUMN "page",
DROP COLUMN "page_order",
ADD COLUMN     "imgUrl" VARCHAR(150) NOT NULL;

-- AlterTable
ALTER TABLE "user_progress" ADD COLUMN     "saved_page_order" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "writeBookTypeng" DROP COLUMN "saved_page_order",
DROP COLUMN "user_id",
ADD COLUMN     "page" TEXT NOT NULL,
ADD COLUMN     "page_order" INTEGER NOT NULL,
ALTER COLUMN "audio_url" DROP NOT NULL;
