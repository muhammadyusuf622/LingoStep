/*
  Warnings:

  - Added the required column `imgUrl` to the `quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quiz" ADD COLUMN     "imgUrl" VARCHAR(150) NOT NULL;

-- AlterTable
ALTER TABLE "quiz_questions" ADD COLUMN     "img_url" VARCHAR(150);
