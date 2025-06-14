/*
  Warnings:

  - A unique constraint covering the columns `[chatId]` on the table `telegramNote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `telegramNote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `telegramNote` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "telegramNote" ALTER COLUMN "chatId" SET DATA TYPE BIGINT,
ALTER COLUMN "message" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "telegramNote_chatId_key" ON "telegramNote"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "telegramNote_username_key" ON "telegramNote"("username");

-- CreateIndex
CREATE UNIQUE INDEX "telegramNote_phone_number_key" ON "telegramNote"("phone_number");
