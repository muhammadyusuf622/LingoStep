/*
  Warnings:

  - Added the required column `page_order` to the `quiz_questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quiz_questions" ADD COLUMN     "page_order" INTEGER NOT NULL;
