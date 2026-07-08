-- CreateEnum
CREATE TYPE "category" AS ENUM ('education', 'health', 'environment', 'animalWelfare', 'disasterRelief', 'povertyAlleviation', 'communityDevelopment', 'artsAndCulture', 'humanRights', 'other');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'inProgress', 'resolved');

-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('admin', 'volunteer', 'moderator');

-- CreateEnum
CREATE TYPE "Types" AS ENUM ('trust', 'society', 'section8');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taskCompleted" INTEGER NOT NULL DEFAULT 0,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "city" TEXT NOT NULL DEFAULT 'Indore',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "skills" TEXT[],
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "role" "userRole" NOT NULL DEFAULT 'volunteer',
    "preferredCategories" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ngo" (
    "id" TEXT NOT NULL,
    "ngoName" TEXT NOT NULL,
    "type" "Types" NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Indore',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "eightyGNumber" TEXT,
    "twelveGNumber" TEXT,
    "Address" TEXT NOT NULL,
    "yearOfEstablishment" TIMESTAMP(3) NOT NULL,
    "registrationCertificate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Ngo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityNeeds" (
    "id" TEXT NOT NULL,
    "ngoId" TEXT NOT NULL,
    "ProblemDescription" TEXT NOT NULL,
    "ProblemCategory" "category" NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "urgencyLevel" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "voulenteersWorking" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "images" TEXT[],

    CONSTRAINT "CommunityNeeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskAssignment" (
    "assignmentId" TEXT NOT NULL,
    "needId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "assignedToUserId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskAssignment_pkey" PRIMARY KEY ("assignmentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TaskAssignment_needId_assignedToUserId_key" ON "TaskAssignment"("needId", "assignedToUserId");

-- AddForeignKey
ALTER TABLE "CommunityNeeds" ADD CONSTRAINT "CommunityNeeds_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "Ngo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAssignment" ADD CONSTRAINT "TaskAssignment_needId_fkey" FOREIGN KEY ("needId") REFERENCES "CommunityNeeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAssignment" ADD CONSTRAINT "TaskAssignment_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
