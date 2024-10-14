const express = require("express");
const {
  getDepartmentsAndTeams,
  departmentAnalysis,
  TeamAnalysis,
  getTotals,
  getCourseFeedback
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/deparments", getDepartmentsAndTeams);

router.post("/analysis", departmentAnalysis);

router.post("/analysis/team", TeamAnalysis);
router.get("/card", getTotals);

router.get("/getCourseFeedback/:courseId", getCourseFeedback);

module.exports = router;
