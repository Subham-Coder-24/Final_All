
const express = require("express");
const {
    Score,
    participationPercentage,
    spentTime,
    percentageAndScoreSingleCourse,submitFeedback
} = require("../controllers/employeeController.js");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/score", Score);
router.post("/participationPercetage",protect,participationPercentage );
router.post("/spentTime",protect,spentTime );
router.post("/percentageAndScoreSingleCourse",protect, percentageAndScoreSingleCourse);
router.post("/submitFeedback",protect, submitFeedback);

module.exports = router;
