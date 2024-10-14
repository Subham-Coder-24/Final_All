/*
  Warnings:

  - You are about to drop the column `AnsID` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `QusID` on the `Discussion` table. All the data in the column will be lost.
  - Added the required column `EmployeeID` to the `Discussion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_AnsID_fkey";

-- DropForeignKey
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_QusID_fkey";

-- AlterTable
ALTER TABLE "Discussion" DROP COLUMN "AnsID",
DROP COLUMN "QusID",
ADD COLUMN     "EmployeeID" INTEGER NOT NULL,
ADD COLUMN     "Parent_Dis_ID" INTEGER;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_EmployeeID_fkey" FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("EmployeeID") ON DELETE RESTRICT ON UPDATE CASCADE;
