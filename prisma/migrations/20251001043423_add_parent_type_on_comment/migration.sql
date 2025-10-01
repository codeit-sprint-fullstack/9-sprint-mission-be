/*
  Warnings:

  - Added the required column `parent` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ParentType" AS ENUM ('Article', 'Product');

-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "parent" "public"."ParentType" NOT NULL;
