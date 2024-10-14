const express = require("express");
const {
  askQuestion,
  postAnswer,
  getDiscussionsByCourse,
} = require("../controllers/discussController.js");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Ask a question
router.post("/ask", protect, askQuestion);

// Get all discussions for a course
router.get("/discussions/:CourseID",protect, getDiscussionsByCourse);
module.exports = router;
