const express = require("express");
const {
  getSubmissionsOfProblem,
  addSubmissionToProblem,
} = require("../controllers/submission.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/:id", getSubmissionsOfProblem);
router.post("/:id", addSubmissionToProblem);

module.exports = router;
