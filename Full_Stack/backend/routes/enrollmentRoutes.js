const {
  createEnrollment,
  checkEnrollment,
} = require("../controllers/enrollmentController.js");

const express = require("express");
const router = express.Router();

// Define routes
router.post("/", createEnrollment);
router.post("/check", checkEnrollment);

// Export the router
module.exports = router;
