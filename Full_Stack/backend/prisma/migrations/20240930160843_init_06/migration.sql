/*
  Warnings:

  - You are about to drop the column `QuizData` on the `Course` table. All the data in the column will be lost.
  - Added the required column `Author` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "QuizData",
ADD COLUMN     "Author" TEXT NOT NULL,
ADD COLUMN     "Image" TEXT,
ALTER COLUMN "CreationDate" SET DEFAULT CURRENT_TIMESTAMP;
