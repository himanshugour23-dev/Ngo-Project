-- AlterTable
ALTER TABLE "CommunityNeeds" ADD COLUMN     "maxVolunteers" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "TaskAssignment" ADD COLUMN     "completedAt" TIMESTAMP(3);
