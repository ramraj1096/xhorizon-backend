import express from "express";
import {
  evaluateSubmission,
  getSingleSubmission,
  getSubmissionsByStudent,
  submitAssessment,
} from "../controllers/submissionsController.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/submit", authenticateUser, submitAssessment);
router.get("/student/:studentId", authenticateUser, getSubmissionsByStudent);
router.get("/:id", authenticateUser, getSingleSubmission);
router.put("/evaluate/:submissionId", evaluateSubmission);

export default router;
