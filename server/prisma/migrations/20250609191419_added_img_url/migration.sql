/*
  Warnings:

  - You are about to drop the `TelegramNote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `definition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `translate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "definition" DROP CONSTRAINT "definition_languageId_fkey";

-- DropForeignKey
ALTER TABLE "definition" DROP CONSTRAINT "definition_translateId_fkey";

-- DropForeignKey
ALTER TABLE "pages" DROP CONSTRAINT "pages_name_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "imgUrl" VARCHAR(150) DEFAULT 'https://cdn-icons-png.freepik.com/256/18238/18238419.png';

-- DropTable
DROP TABLE "TelegramNote";

-- DropTable
DROP TABLE "definition";

-- DropTable
DROP TABLE "language";

-- DropTable
DROP TABLE "pages";

-- DropTable
DROP TABLE "translate";

-- CreateTable
CREATE TABLE "telegramNote" (
    "id" UUID NOT NULL,
    "chatId" INTEGER NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(100) NOT NULL,
    "language_code" VARCHAR(10) NOT NULL,
    "message" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telegramNote_pkey" PRIMARY KEY ("id")
);
