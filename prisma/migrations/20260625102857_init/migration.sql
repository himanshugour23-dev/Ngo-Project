/*
  Warnings:

  - Added the required column `motto` to the `Ngo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ngo" ADD COLUMN     "motto" TEXT NOT NULL;
