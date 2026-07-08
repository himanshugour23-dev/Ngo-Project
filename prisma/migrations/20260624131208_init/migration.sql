-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "CommunityNeeds_ngoId_idx" ON "CommunityNeeds"("ngoId");

-- CreateIndex
CREATE INDEX "CommunityNeeds_status_idx" ON "CommunityNeeds"("status");

-- CreateIndex
CREATE INDEX "CommunityNeeds_ProblemCategory_idx" ON "CommunityNeeds"("ProblemCategory");

-- CreateIndex
CREATE INDEX "CommunityNeeds_urgencyLevel_idx" ON "CommunityNeeds"("urgencyLevel");

-- CreateIndex
CREATE INDEX "CommunityNeeds_ngoId_status_idx" ON "CommunityNeeds"("ngoId", "status");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "TaskAssignment_assignedToUserId_idx" ON "TaskAssignment"("assignedToUserId");

-- CreateIndex
CREATE INDEX "TaskAssignment_needId_idx" ON "TaskAssignment"("needId");

-- CreateIndex
CREATE INDEX "TaskAssignment_approvalStatus_idx" ON "TaskAssignment"("approvalStatus");

-- CreateIndex
CREATE INDEX "TaskAssignment_assignedToUserId_approvalStatus_idx" ON "TaskAssignment"("assignedToUserId", "approvalStatus");

-- CreateIndex
CREATE INDEX "VolunteerRating_volunteerId_idx" ON "VolunteerRating"("volunteerId");

-- CreateIndex
CREATE INDEX "VolunteerRating_ngoId_idx" ON "VolunteerRating"("ngoId");
