-- AlterTable
ALTER TABLE "CommunityNeeds" ADD COLUMN     "deadLine" TIMESTAMP(3),
ADD COLUMN     "hasDeadline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "peopleAffected" INTEGER;
