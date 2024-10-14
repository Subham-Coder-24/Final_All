-- CreateTable
CREATE TABLE "Employee" (
    "EmployeeID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Department" TEXT NOT NULL,
    "Role" TEXT NOT NULL,
    "DateJoined" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("EmployeeID")
);

-- CreateTable
CREATE TABLE "Course" (
    "CourseID" SERIAL NOT NULL,
    "CourseName" TEXT NOT NULL,
    "CourseDescription" TEXT NOT NULL,
    "CreationDate" TIMESTAMP(3) NOT NULL,
    "QuizData" JSONB,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("CourseID")
);

-- CreateTable
CREATE TABLE "Module" (
    "ModuleID" SERIAL NOT NULL,
    "ModuleName" TEXT NOT NULL,
    "ModuleDescription" TEXT NOT NULL,
    "CourseID" INTEGER NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("ModuleID")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "EnrollmentID" SERIAL NOT NULL,
    "EnrollDate" TIMESTAMP(3) NOT NULL,
    "QuizScore" DOUBLE PRECISION,
    "EmployeeID" INTEGER NOT NULL,
    "CourseID" INTEGER NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("EnrollmentID")
);

-- CreateTable
CREATE TABLE "Engagement" (
    "EngagementID" SERIAL NOT NULL,
    "TimeStart" TIMESTAMP(3) NOT NULL,
    "TimeEnd" TIMESTAMP(3) NOT NULL,
    "TimeSpent" INTEGER NOT NULL,
    "IsCompleted" BOOLEAN NOT NULL,
    "EmployeeID" INTEGER NOT NULL,
    "ModuleID" INTEGER NOT NULL,
    "CourseID" INTEGER NOT NULL,

    CONSTRAINT "Engagement_pkey" PRIMARY KEY ("EngagementID")
);

-- CreateTable
CREATE TABLE "Discussion" (
    "DiscussionID" SERIAL NOT NULL,
    "Text" TEXT NOT NULL,
    "PostDate" TIMESTAMP(3) NOT NULL,
    "QusID" INTEGER NOT NULL,
    "AnsID" INTEGER NOT NULL,

    CONSTRAINT "Discussion_pkey" PRIMARY KEY ("DiscussionID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_Email_key" ON "Employee"("Email");

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_CourseID_fkey" FOREIGN KEY ("CourseID") REFERENCES "Course"("CourseID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_EmployeeID_fkey" FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("EmployeeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_CourseID_fkey" FOREIGN KEY ("CourseID") REFERENCES "Course"("CourseID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_EmployeeID_fkey" FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("EmployeeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_ModuleID_fkey" FOREIGN KEY ("ModuleID") REFERENCES "Module"("ModuleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_CourseID_fkey" FOREIGN KEY ("CourseID") REFERENCES "Course"("CourseID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_QusID_fkey" FOREIGN KEY ("QusID") REFERENCES "Employee"("EmployeeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_AnsID_fkey" FOREIGN KEY ("AnsID") REFERENCES "Employee"("EmployeeID") ON DELETE RESTRICT ON UPDATE CASCADE;
