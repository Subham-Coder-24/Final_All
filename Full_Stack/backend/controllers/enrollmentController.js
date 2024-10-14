const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new enrollment
const createEnrollment = async (req, res) => {
  const { EmployeeID, CourseID } = req.body;
  // console.log(req.body);

  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        EnrollDate: new Date(), // Automatically set to the current date
        EmployeeID,
        CourseID: parseInt(CourseID),
      },
    });
    res.status(201).json({ success: true, enrollment: true });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check if the employee is enrolled in the course
const checkEnrollment = async (req, res) => {
  const { EmployeeID, CourseID } = req.body;

  try {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        EmployeeID: EmployeeID,
        CourseID: parseInt(CourseID),
      },
    });

    if (enrollment) {
      // Employee is enrolled in the course
      return res.status(201).json({ success: true, enrollment: true });
    } else {
      // Employee is not enrolled in the course
      return res.status(201).json({ success: true, enrollment: false });
    }
  } catch (error) {
    console.error("Error checking enrollment:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while checking enrollment.",
    });
  }
};

// Export the controller methods
module.exports = {
  createEnrollment,
  checkEnrollment,
};
