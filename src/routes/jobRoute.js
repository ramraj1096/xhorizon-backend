import express from "express";
import {
  addJob,
  applyToJob,
  getAllJobs,
  getJobApplicants,
  getAllJobsAppliedByStudent,
} from "../controllers/jobController.js";
import {
  addJobValidation,
  applyJobValidation,
} from "../middlewares/jobValidation.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

// POST /api/jobs → Add a new job
router.post("/", addJobValidation, handleValidationErrors, addJob);

// POST /api/jobs/:jobId/apply → Apply to a job
router.post(
  "/:jobId/apply",
  authenticateUser,
  applyJobValidation,
  handleValidationErrors,
  applyToJob
);

// GET /api/jobs → Get all jobs
router.get("/", authenticateUser, getAllJobs);

// GET /api/jobs/:jobId/applicants → Get applicants for a job
router.get("/:jobId/applicants", authenticateUser, getJobApplicants);

// GET /api/jobs/applied/:studentId → Get all jobs applied by student
router.get("/applied/:studentId", authenticateUser, getAllJobsAppliedByStudent);

export default router;
