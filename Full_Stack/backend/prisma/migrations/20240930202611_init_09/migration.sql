/*
  Warnings:

  - Added the required column `CourseID` to the `Discussion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "CourseID" INTEGER NOT NULL,
ALTER COLUMN "PostDate" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_CourseID_fkey" FOREIGN KEY ("CourseID") REFERENCES "Course"("CourseID") ON DELETE RESTRICT ON UPDATE CASCADE;
