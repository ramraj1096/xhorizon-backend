import { Router } from "express";
import {
  loginUserValidations,
  registerUserValidations,
  resetPasswordValidations,
} from "../middlewares/userValidations.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

import upload from "../middlewares/upload.js";
import { authenticateUser } from "../middlewares/auth.js";
import {
  getProfile,
  loginStudent,
  logout,
  registerStudent,
  resetPassword,
  updateStudent,
} from "../controllers/studentController.js";

const router = Router();

router.post(
  "/register",
  registerUserValidations,
  handleValidationErrors,
  registerStudent
);

router.post(
  "/login",
  loginUserValidations,
  handleValidationErrors,
  loginStudent
);

router.post(
  "/resetpassword",
  resetPasswordValidations,
  handleValidationErrors,
  resetPassword
);

router.put(
  "/update-user",
  authenticateUser,
  upload.single("image"),
  updateStudent
);

router.get("/get-profile", authenticateUser, getProfile);

router.post("/logout", logout);

router.get("/get-profile", authenticateUser, getProfile);

export default router;
