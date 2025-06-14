/*
  Warnings:

  - You are about to drop the column `saved_page_order` on the `user_progress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_progress" DROP COLUMN "saved_page_order";

-- CreateTable
CREATE TABLE "savedPagWithUser" (
    "id" UUID NOT NULL,
    "saved_page_order" INTEGER NOT NULL DEFAULT 1,
    "userId" UUID NOT NULL,
    "bookId" UUID NOT NULL,

    CONSTRAINT "savedPagWithUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "savedPagWithUser" ADD CONSTRAINT "savedPagWithUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savedPagWithUser" ADD CONSTRAINT "savedPagWithUser_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
