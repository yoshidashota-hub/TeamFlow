-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "startDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "tasks_startDate_idx" ON "tasks"("startDate");
