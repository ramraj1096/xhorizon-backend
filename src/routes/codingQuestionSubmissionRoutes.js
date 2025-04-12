import express from "express";
import {
  submitCodingQuestion,
  getAllSubmissionsByStudent,
  getSubmissionsForQuestion,
  getSingleSubmission,
} from "../controllers/codingQuestionSubmissionController.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";
import { submitCodingQuestionValidator } from "../middlewares/codingQuestionSubmissionValidator.js";
import { authenticateUser, authentiFaculty } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  submitCodingQuestionValidator,
  handleValidationErrors,
  submitCodingQuestion
);
router.get("/student/:studentId", authenticateUser, getAllSubmissionsByStudent);
router.get(
  "/question/:questionId",
  authenticateUser,
  getSubmissionsForQuestion
);
router.get("/:id", authenticateUser, getSingleSubmission);

export default router;
