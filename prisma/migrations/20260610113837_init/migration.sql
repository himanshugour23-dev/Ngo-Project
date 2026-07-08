-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "VolunteerRating" (
    "id" TEXT NOT NULL,
    "ngoId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolunteerRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerRating_assignmentId_key" ON "VolunteerRating"("assignmentId");

-- AddForeignKey
ALTER TABLE "VolunteerRating" ADD CONSTRAINT "VolunteerRating_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "Ngo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerRating" ADD CONSTRAINT "VolunteerRating_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "TaskAssignment"("assignmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerRating" ADD CONSTRAINT "VolunteerRating_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
