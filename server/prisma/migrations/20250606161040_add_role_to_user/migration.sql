-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'ADMIN', 'SUPPER_ADMIN');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'USER';
