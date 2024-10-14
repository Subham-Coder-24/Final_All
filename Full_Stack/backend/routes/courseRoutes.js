const express = require("express");
const {
  createCourseWithModules,
  getAllCourses,
  getCourseById,
  startEngagement,
  endEngagement,
  getCourseCompletionPercentage,
  addQuiz,
  updateQuizScore,
  updateCourseWithModules
} = require("../controllers/courseController.js");

const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", createCourseWithModules);
router.put('/courses/:courseId', updateCourseWithModules);


router.get("/",protect, getAllCourses);
router.get("/details/:id",protect, getCourseById);

router.put("/engagement/start",protect, startEngagement);

// End Engagement Route
router.put("/engagement/end/:engagementId",protect, endEngagement);

router.get("/completion/:employeeId/:courseId",protect, getCourseCompletionPercentage);

router.post("/addQuiz", addQuiz);
router.post("/quiz/score", protect, updateQuizScore);

module.exports = router;
