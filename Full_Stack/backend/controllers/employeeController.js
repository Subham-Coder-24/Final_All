const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Controller function to handle the request
const Score = async (req, res) => {
  const { EmployeeID } = req.body; // Extract EmployeeID from the request body

  try {
    // Query to find all enrollments by EmployeeID, including QuizScore
    const enrollments = await prisma.enrollment.findMany({
      where: {
        EmployeeID: parseInt(EmployeeID), // Match based on EmployeeID
      },
      include: {
        Course: {
          select: {
            CourseID: true,
            CourseName: true, // Include CourseID and CourseName fields
          },
        },
      },
    });

    // Map to include CourseID, CourseName, and QuizScore in the response
    const responseData = enrollments.map((enrollment) => ({
      CourseID: enrollment.Course.CourseID,
      CourseName: enrollment.Course.CourseName,
      QuizScore: enrollment.QuizScore, // Include QuizScore
    }));

    // Send the result back in the response
    res.status(200).json({
      status: "success",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({
      status: "error",
      message: "Could not fetch enrollments",
    });
  }
};
const participationPercentage = async (req, res) => {
  const { employeeId } = req.body; // Get employeeId from request body

  try {
    // Get all the courses that the employee is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: {
        EmployeeID: parseInt(employeeId),
      },
      include: {
        Course: true, // Fetch course details as well
      },
    });

    if (!enrollments.length) {
      return res
        .status(404)
        .json({ message: "No courses found for this employee." });
    }

    // Prepare an array to hold participation percentages for each course
    const participationRates = await Promise.all(
      enrollments.map(async (enrollment) => {
        const courseId = enrollment.CourseID;

        // Get total number of discussions for the specific course
        const totalDiscussions = await prisma.discussion.count({
          where: {
            CourseID: courseId,
          },
        });

        // Get number of discussions by this employee for that course
        const employeeDiscussions = await prisma.discussion.count({
          where: {
            CourseID: courseId,
            EmployeeID: parseInt(employeeId),
          },
        });

        // Calculate participation percentage
        const participationRate =
          totalDiscussions > 0
            ? (employeeDiscussions / totalDiscussions) * 100
            : 0;

        return {
          courseId,
          courseName: enrollment.Course.CourseName, // Assuming you have a CourseName field
          totalDiscussions,
          employeeDiscussions,
          participationRate: participationRate.toFixed(2), // Limit to 2 decimal places
        };
      })
    );

    // Return the participation rates for all courses
    res.json({
      employeeId,
      participationRates,
    });
  } catch (error) {
    console.error("Error calculating participation percentage: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const spentTime = async (req, res) => {
  let { employeeId } = req.body; // Get employeeId from request body

  try {
    // Get all the courses that the employee is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: {
        EmployeeID: parseInt(employeeId), // Convert employeeId to integer
      },
      include: {
        Course: true, // Fetch course details along with enrollment
      },
    });
    

    if (!enrollments.length) {
      return res
        .status(404)
        .json({ message: "No courses found for this employee." });
    }

    // Prepare an array to hold total time spent for each course
    const timeSpentPerCourse = await Promise.all(
      enrollments.map(async (enrollment) => {
        const courseId = enrollment.CourseID;

        // Get all engagements by the employee for this course
        const engagements = await prisma.engagement.findMany({
          where: {
            CourseID: courseId,
            EmployeeID: parseInt(employeeId),
          },
          include: {
            Module: true, // Fetch course details along with enrollment
          },
        });

        // Calculate total time spent for this course
        const totalTimeSpent = engagements.reduce(
          (acc, engagement) => acc + engagement.TimeSpent,
          0
        );

        return {
          courseId,
          engagements,
          courseName: enrollment.Course.CourseName, // Assuming Course model has CourseName
          CourseImage: enrollment.Course.Image,
          totalTimeSpent,
        };
      })
    );

    // Return the time spent for all courses
    res.json({
      employeeId,
      timeSpentPerCourse,
    });
  } catch (error) {
    console.error("Error calculating total time spent: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const percentageAndScoreSingleCourse = async (req, res) => {
  const { courseId, employeeId } = req.body; // Get courseId and employeeId from request body

  try {
    // Get total number of discussions for the specified course
    const totalDiscussions = await prisma.discussion.count({
      where: {
        CourseID: parseInt(courseId),
      },
    });
    const employeeDiscussions = await prisma.discussion.count({
      where: {
        CourseID: parseInt(courseId),
        EmployeeID: parseInt(employeeId),
      },
    });
    const participationRate =
      totalDiscussions > 0 ? (employeeDiscussions / totalDiscussions) * 100 : 0;
    //get score

    const enrollments = await prisma.enrollment.findFirst({
      where: {
        CourseID: parseInt(courseId),
        EmployeeID: parseInt(employeeId),
      },
    });

    // Return the result
    res.status(200).json({
      score: enrollments.QuizScore,
      participationRate: participationRate.toFixed(2), // Limit to 2 decimal places
    });
  } catch (error) {
    console.error("Error calculating participation percentage: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    const employeeId = req.user.EmployeeID; // Assuming the employee is authenticated

    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { CourseID: parseInt(courseId) },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if the employee is enrolled in the course (optional logic)
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        CourseID:  parseInt(courseId),
        EmployeeID: employeeId,
      },
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'You are not enrolled in this course' });
    }

    // Create feedback for the course
    const feedback = await prisma.feedback.create({
      data: {
        Rating: rating,
        Comment: comment,
        EmployeeID: parseInt(employeeId),
        CourseID:  parseInt(courseId),
      },
    });

    return res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
//for indivisual

module.exports = {
  Score,
  participationPercentage,
  spentTime,
  percentageAndScoreSingleCourse,
  submitFeedback
};
