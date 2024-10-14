const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Controller to get all unique departments and their teams
const getDepartmentsAndTeams = async (req, res) => {
  try {
    // Fetch all unique departments
    const departments = await prisma.employee.findMany({
      where: {
        Department: {
          not: null, // Exclude records where Department is null
        },
      },
      select: {
        Department: true,
      },
      distinct: ["Department"], // Ensures only unique departments are returned
    });
    

    // Fetch teams for each department
    const departmentTeams = await Promise.all(
      departments.map(async (department) => {
        const teams = await prisma.employee.findMany({
          where: {
            Department: department.Department,
          },
          select: {
            Team: true,
          },
          distinct: ["Team"], // Ensures unique teams per department
        });

        return {
          department: department.Department,
          teams: teams.map((team) => team.Team).filter(Boolean), // Filter out null/undefined values for teams
        };
      })
    );

    // Return departments and their teams
    res.status(200).json({
      status: "success",
      data: departmentTeams,
    });
  } catch (error) {
    console.error("Error fetching departments and teams:", error);
    res.status(500).json({
      status: "error",
      message: "Could not fetch departments and teams",
    });
  }
};

const departmentAnalysis = async (req, res) => {
  const { department } = req.body; // Get department from request parameters
  console.log(department);

  try {
    // Step 1: Get all teams in the department
    const teams = await prisma.employee.findMany({
      where: { Department: department },
      distinct: ["Team"],
      select: {
        Team: true,
      },
    });

    // Step 2: Calculate average metrics for each team
    const teamData = await Promise.all(
      teams.map(async (teamObj) => {
        const team = teamObj.Team;

        // Avg Time Spent (Engagement)
        const avgTimeSpent = await prisma.engagement.aggregate({
          _avg: { TimeSpent: true },
          where: { Employee: { Team: team, Department: department } },
        });

        // Avg Quiz Score (from Enrollments)
        const avgScore = await prisma.enrollment.aggregate({
          _avg: { QuizScore: true },
          where: { Employee: { Team: team, Department: department } },
        });

        // Returning calculated averages for each team
        return {
          team,
          avgTimeSpent: avgTimeSpent._avg.TimeSpent || 0,
          avgScore: avgScore._avg.QuizScore || 0,
        };
      })
    );

    // Step 3: Send the response
    res.status(200).json({
      status: "success",
      data: teamData,
    });
  } catch (error) {
    console.error("Error fetching team data:", error);
    res.status(500).json({
      status: "error",
      message: "Could not fetch team data",
    });
  }
};

const TeamAnalysis = async (req, res) => {
  const { team, department } = req.body; // Get team and department from the request body

  try {
    // Fetch all employees in the specified team and department
    const employees = await prisma.employee.findMany({
      where: {
        Team: team,
        Department: department,
      },
    });

    // Create an array to hold the analysis data
    const analysisResults = [];

    // Iterate through each employee to calculate avg time spent and avg score
    for (const employee of employees) {
      const avgTimeSpent = await prisma.engagement.aggregate({
        _avg: { TimeSpent: true },
        where: { EmployeeID: employee.EmployeeID },
      });

      const avgScore = await prisma.enrollment.aggregate({
        _avg: { QuizScore: true },
        where: { EmployeeID: employee.EmployeeID },
      });

      analysisResults.push({
        employeeId: employee.EmployeeID,
        employeeName: employee.Name,
        avgTimeSpent: avgTimeSpent._avg.TimeSpent || 0, // Default to 0 if no engagements found
        avgScore: avgScore._avg.QuizScore || 0, // Default to 0 if no scores found
      });
    }

    // Respond with the analysis data
    res.status(200).json({
      status: 'success',
      data: analysisResults,
    });
  } catch (error) {
    console.error("Error fetching team analysis:", error);
    res.status(500).json({
      status: 'error',
      message: 'Could not fetch team analysis data',
    });
  }
};

const getTotals = async (req, res) => {
  try {
    // Get total number of employees
    const totalEmployees = await prisma.employee.count();

    // Get total number of teams (unique team values)
    const totalTeams = await prisma.employee.findMany({
      where: { Team: { not: null } },
      distinct: ['Team'],
    });

    // Get total number of departments (unique department values)
    const totalDepartments = await prisma.employee.findMany({
      distinct: ['Department'],
    });

    // Get total number of courses
    const totalCourses = await prisma.course.count();

    // Send the response
    res.status(200).json({
      status: "success",
      data: {
        totalEmployees,
        totalTeams: totalTeams.length,
        totalDepartments: totalDepartments.length,
        totalCourses,
      },
    });
  } catch (error) {
    console.error("Error fetching totals:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching totals",
    });
  }
};

// GET: /api/admin/feedback/:courseId
const getCourseFeedback = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { CourseID: parseInt(courseId) },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get feedback for the selected course, including employee names, rating, and comments
    const feedback = await prisma.feedback.findMany({
      where: {
        CourseID: parseInt(courseId),
      },
      select: {
        Rating: true,
        Comment: true,
        Employee: {
          select: {
            Name: true,
          },
        },
      },
    });

    if (feedback.length === 0) {
      return res.status(200).json({ message: 'No feedback available for this course.' });
    }

    // Return feedback along with employee names
    res.status(200).json({
      courseName: course.CourseName,
      feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching feedback' });
  }
};



module.exports = {
  getDepartmentsAndTeams,
  departmentAnalysis,
  TeamAnalysis,
  getTotals,
  getCourseFeedback
};
