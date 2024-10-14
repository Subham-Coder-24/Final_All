const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Ask a question
const askQuestion = async (req, res) => {
  const { Text, CourseID, EmployeeID, DiscussionID } = req.body;
  const employeeID = req.user.EmployeeID; // Ensure this is the ID of the employee posting the discussion
  // console.log(employeeID);

  try {
    const question = await prisma.discussion.create({
      data: {
        Text,
        CourseID,
        EmployeeID: parseInt(employeeID), // Assuming req.user.EmployeeID is valid
        Parent_Dis_ID: DiscussionID || null, // Set to null if not provided
      },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all discussions for a course
const getDiscussionsByCourse = async (req, res) => {
  const { CourseID } = req.params;
  try {
    const discussions = await prisma.discussion.findMany({
      where: { CourseID: parseInt(CourseID) },
      include: {
        Employee: true,
      },
    });
    const filteredDiscussions = discussions.filter(
      (discussion) => discussion.Parent_Dis_ID === null
    );

    // Create ansList for each filtered discussion using the discussions array
    const enhancedDiscussions = filteredDiscussions.map((discussion) => {
      // Find answers related to the current discussion based on QusID
      const ansList = discussions.filter(
        (ans) =>
          ans.Parent_Dis_ID === discussion.DiscussionID &&
          ans.Parent_Dis_ID !== null
      );

      // Return the discussion with ansList added
      return {
        ...discussion,
        ansList, // Add ansList to the discussion
      };
    });
    // console.log(filteredDiscussions);

    res.json({ success: true, discussions: enhancedDiscussions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  askQuestion,
  // postAnswer,
  getDiscussionsByCourse,
};
