import express from "express";
import {
  addAssessment,
  deleteAssessment,
  editAssessment,
  getAllAssessments,
  getAssessment,
  getAssessmentsByCourseId,
  getAssessmentSubmissions,
} from "../controllers/assesmentsController.js";

import handleValidationErrors from "../middlewares/handleValidationErrors.js";
import { authentiFaculty } from "../middlewares/auth.js";
import {
  addAssessmentValidation,
  editAssessmentValidation,
} from "../middlewares/assessmentValidator.js";

const router = express.Router();

router.post(
  "/",
  authentiFaculty,
  addAssessmentValidation,
  handleValidationErrors,
  addAssessment
);
router.put(
  "/:id",
  authentiFaculty,
  editAssessmentValidation,
  handleValidationErrors,
  editAssessment
);
router.get("/:id", authentiFaculty, getAssessment);
router.get("/", authentiFaculty, getAllAssessments);
router.delete("/:id", authentiFaculty, deleteAssessment);
router.get("/course/:courseId", authentiFaculty, getAssessmentsByCourseId);
router.get(
  "/submissions/:assessmentId",
  authentiFaculty,
  getAssessmentSubmissions
);

export default router;
