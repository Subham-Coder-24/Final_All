const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createCourseWithModules = async (req, res) => {
  try {
    // Extract course details and modules from the request body
    const { courseName, courseDescription, author, image, modules } = req.body;

    // Create the course
    const createdCourse = await prisma.course.create({
      data: {
        CourseName: courseName,
        CourseDescription: courseDescription,
        Author: author,
        Image: image || null, // Optional image
        Modules: {
          create: modules.map((module) => ({
            ModuleName: module.moduleName,
            ModuleDescription: module.moduleDescription,
          })),
        },
      },
      include: {
        Modules: true, // Include the related modules
      },
    });

    // Return the created course with its modules
    res.status(201).json({
      message: "Course and modules created successfully",
      course: createdCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create course and modules",
      error: error.message,
    });
  }
};
const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        Modules: true, // Include related modules if needed
      },
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};
const getCourseById = async (req, res) => {
  const { id } = req.params;
  console.log("ok");

  try {
    // Find the course by ID
    const course = await prisma.course.findUnique({
      where: {
        CourseID: parseInt(id),
      },
      include: {
        Modules: true,
      },
    });
    const moduleStatus = [];

    for (const module of course.Modules) {
      const engagement = await prisma.engagement.findFirst({
        where: {
          ModuleID: module.ModuleID,
          EmployeeID: req.user.EmployeeID,
        },
        select: {
          IsCompleted: true,
        },
      });
      moduleStatus.push({
        module_id: module.ModuleID,
        is_completed: engagement ? engagement.IsCompleted : false,
      });
    }

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Return the found course
    // res.status(200).json(course);
    return res.status(200).json({
      courseDetails: course,
      moduleCompletion: moduleStatus,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      message: "Failed to fetch course details",
      error: error.message,
    });
  }
};
const startEngagement = async (req, res) => {
  const { employeeId, moduleId, courseId, startTime } = req.body;

  try {
    // Check if an engagement already exists
    const existingEngagement = await prisma.engagement.findFirst({
      where: {
        EmployeeID: employeeId,
        ModuleID: moduleId,
        CourseID: parseInt(courseId),
      },
    });

    if (existingEngagement) {
      // Update existing engagement
      const updatedEngagement = await prisma.engagement.update({
        where: {
          EngagementID: existingEngagement.EngagementID,
        },
        data: {
          TimeStart: new Date(startTime), // Update start time
          TimeEnd: null, // Remove end time
          IsCompleted: true,
        },
      });

      return res.status(200).json(updatedEngagement);
    } else {
      // Create a new engagement
      const engagement = await prisma.engagement.create({
        data: {
          TimeStart: new Date(startTime), // Current time
          IsCompleted: false,
          EmployeeID: employeeId,
          ModuleID: moduleId,
          CourseID: parseInt(courseId),
        },
      });

      return res.status(201).json(engagement);
    }
  } catch (error) {
    console.error("Error starting engagement:", error);
    res
      .status(500)
      .json({ message: "Failed to start engagement", error: error.message });
  }
};
const endEngagement = async (req, res) => {
  const { engagementId } = req.params;
  const { endTime } = req.body;

  try {
    // First, retrieve the existing engagement to get the TimeStart and TimeSpent
    const existingEngagement = await prisma.engagement.findUnique({
      where: {
        EngagementID: parseInt(engagementId),
      },
    });

    if (!existingEngagement) {
      return res.status(404).json({ message: "Engagement not found" });
    }

    // Calculate time spent
    const timeSpent = existingEngagement.TimeSpent || 0; // Default to 0 if undefined
    const timeStart = new Date(existingEngagement.TimeStart);
    const timeEnd = new Date(endTime); // Current time
    const timeDifference = Math.floor((timeEnd - timeStart) / 1000); // Time difference in seconds

    // Update the engagement record
    const updatedEngagement = await prisma.engagement.update({
      where: {
        EngagementID: parseInt(engagementId),
      },
      data: {
        TimeEnd: timeEnd, // Current time
        IsCompleted: true,
        TimeSpent: timeSpent + timeDifference, // Update TimeSpent
      },
    });

    res.status(200).json(updatedEngagement);
  } catch (error) {
    console.error("Error ending engagement:", error);
    res
      .status(500)
      .json({ message: "Failed to end engagement", error: error.message });
  }
};
const getCourseCompletionPercentage = async (req, res) => {
  const { employeeId, courseId } = req.params;

  try {
    // Step 1: Get total number of modules in the course
    const totalModules = await prisma.module.count({
      where: {
        CourseID: parseInt(courseId),
      },
    });
    const engagementStats = await prisma.engagement.aggregate({
      where: {
        EmployeeID: parseInt(employeeId),
        CourseID: parseInt(courseId),
        IsCompleted: true,
      },
      _sum: {
        TimeSpent: true, // Sum of TimeSpent
      },
      _count: {
        EngagementID: true, // Count of completed modules
      },
    });
    const totalTimeSpent = engagementStats._sum.TimeSpent || 0;
    const completedModuleCount = engagementStats._count.EngagementID || 0;

    // Step 3: Calculate the completion percentage
    const completionPercentage = (completedModuleCount / totalModules) * 100;

    res.status(200).json({
      totalModules,
      totalTimeSpent,
      completionPercentage: completionPercentage.toFixed(2), // Format percentage to 2 decimal places
    });
  } catch (error) {
    console.error("Error calculating course completion:", error);
    res.status(500).json({
      message: "Failed to calculate course completion",
      error: error.message,
    });
  }
};
const addQuiz = async (req, res) => {
  try {
    const { CourseID, Quiz } = req.body;

    // Check if the course exists
    const courseExists = await prisma.course.findUnique({
      where: { CourseID: parseInt(CourseID) },
    });

    if (!courseExists) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update the course with the quiz
    const updatedCourse = await prisma.course.update({
      where: { CourseID: parseInt(CourseID) },
      data: { Quiz: Quiz }, // Assuming Quiz is a JSON field or string
    });

    res.status(201).json({ success: true, updatedCourse });
  } catch (error) {
    console.error("Error adding quiz:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
const updateQuizScore = async (req, res) => {
  const { CourseID, QuizScore } = req.body;

  const EmployeeID = req.user.EmployeeID;

  try {
    // Check if the enrollment exists based on EmployeeID and CourseID
    const enrollmentExists = await prisma.enrollment.findFirst({
      where: {
        EmployeeID: EmployeeID,
        CourseID: parseInt(CourseID),
      },
    });

    if (!enrollmentExists) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Update the quiz score for the enrollment using EnrollmentID
    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        EnrollmentID: enrollmentExists.EnrollmentID,
      },
      data: { QuizScore },
    });

    res.status(200).json({ success: true, updatedEnrollment });
  } catch (error) {
    console.error("Error updating quiz score:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateCourseWithModules = async (req, res) => {
  try {
    // Extract course ID and updated details from the request body
    const { CourseId, CourseName, CourseDescription, Author, Image, Modules } =
      req.body;
    // console.log(req.body);

    // Update the course
    const updatedCourse = await prisma.course.update({
      where: { CourseID: 1 }, // Assuming 'id' is the primary key for courses
      data: {
        CourseName,
        CourseDescription,
        Author,
        Image: Image || null, // Optional image
        Modules: {
          // Update modules: delete existing, add new, or update existing
          deleteMany: {}, // Delete all existing modules (you can modify this logic as needed)
          create: Modules.map((module) => ({
            ModuleName: module.ModuleName,
            ModuleDescription: module.ModuleDescription,
          })),
        },
      },
      include: {
        Modules: true, // Include the related modules
      },
    });

    // Return the updated course with its modules
    res.status(200).json({
      message: "Course and modules updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update course and modules",
      error: error.message,
    });
  }
};

module.exports = {
  createCourseWithModules,
  getAllCourses,
  getCourseById,
  startEngagement,
  endEngagement,
  getCourseCompletionPercentage,
  addQuiz,
  updateQuizScore,
  updateCourseWithModules,
};
