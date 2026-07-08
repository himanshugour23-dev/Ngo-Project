-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('volunteer', 'ngo');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'approved', 'rejected', 'assigned', 'declined');

-- AlterTable
ALTER TABLE "CommunityNeeds" ADD COLUMN     "isAcceptingInvites" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "TaskAssignment" ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "requestType" "RequestType" NOT NULL DEFAULT 'volunteer';
