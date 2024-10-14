-- CreateTable
CREATE TABLE "Feedback" (
    "FeedbackID" SERIAL NOT NULL,
    "Rating" INTEGER NOT NULL DEFAULT 0,
    "Comment" TEXT,
    "SubmittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "EmployeeID" INTEGER NOT NULL,
    "CourseID" INTEGER NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("FeedbackID")
);

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_EmployeeID_fkey" FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("EmployeeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_CourseID_fkey" FOREIGN KEY ("CourseID") REFERENCES "Course"("CourseID") ON DELETE RESTRICT ON UPDATE CASCADE;
