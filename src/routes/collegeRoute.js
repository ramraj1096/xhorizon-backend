import express from "express";
import {
  registerCollege,
  loginCollege,
  editCollege,
  getCollege,
  getAllColleges,
  logoutCollege,
  getCollegeProfile,
  meCollege,
} from "../controllers/collegeController.js";
import {
  loginCollegeValidation,
  registerCollegeValidator,
} from "../middlewares/collegeValidations.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";
import { authenticateCollege } from "../middlewares/auth.js";
import { adminlogin } from "../controllers/facultyController.js";

const router = express.Router();

router.post('/admin-login',adminlogin);
router.post(
  "/register",
  registerCollegeValidator,
  handleValidationErrors,
  registerCollege
);
router.post(
  "/login",
  loginCollegeValidation,
  handleValidationErrors,
  loginCollege
);
router.put("/:id", authenticateCollege, editCollege);
router.get("/:id", getCollege);
router.get("/", getAllColleges);

// Route to handle College logout
router.post("/logout", logoutCollege);

// Route to fetch the college profile (protected route)
router.get("/profile", authenticateCollege, getCollegeProfile);

// Route to get the logged-in college’s data (protected route)
router.get("/me", authenticateCollege, meCollege);

export default router;
