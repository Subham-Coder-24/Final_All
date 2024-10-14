-- DropForeignKey
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_AnsID_fkey";

-- AlterTable
ALTER TABLE "Discussion" ALTER COLUMN "AnsID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_AnsID_fkey" FOREIGN KEY ("AnsID") REFERENCES "Employee"("EmployeeID") ON DELETE SET NULL ON UPDATE CASCADE;
