/*
  Warnings:

  - The values [assigned,declined] on the enum `ApprovalStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ApprovalStatus_new" AS ENUM ('pending', 'approved', 'rejected', 'completed');
ALTER TABLE "public"."TaskAssignment" ALTER COLUMN "approvalStatus" DROP DEFAULT;
ALTER TABLE "TaskAssignment" ALTER COLUMN "approvalStatus" TYPE "ApprovalStatus_new" USING ("approvalStatus"::text::"ApprovalStatus_new");
ALTER TYPE "ApprovalStatus" RENAME TO "ApprovalStatus_old";
ALTER TYPE "ApprovalStatus_new" RENAME TO "ApprovalStatus";
DROP TYPE "public"."ApprovalStatus_old";
ALTER TABLE "TaskAssignment" ALTER COLUMN "approvalStatus" SET DEFAULT 'pending';
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0;
