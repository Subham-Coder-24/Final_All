const participationPercentageOfSingleCourse = async (req, res) => {
  const { courseId, employeeId } = req.body; // Get courseId and employeeId from request body

  try {
    // Get total number of discussions for the specified course
    const totalDiscussions = await prisma.discussion.count({
      where: {
        CourseID: courseId,
      },
    });

    // Get number of discussions by the specific employee for that course
    const employeeDiscussions = await prisma.discussion.count({
      where: {
        CourseID: courseId,
        EmployeeID: employeeId,
      },
    });

    // Calculate participation percentage
    const participationRate =
      totalDiscussions > 0 ? (employeeDiscussions / totalDiscussions) * 100 : 0;

    // Return the result
    res.json({
      courseId,
      employeeId,
      totalDiscussions,
      employeeDiscussions,
      participationRate: participationRate.toFixed(2), // Limit to 2 decimal places
    });
  } catch (error) {
    console.error("Error calculating participation percentage: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};