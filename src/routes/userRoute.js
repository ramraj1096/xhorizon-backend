import { Router } from "express";
import {
  loginUserValidations,
  registerUserValidations,
  resetPasswordValidations,
} from "../middlewares/userValidations.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";
import {
  getProfile,
  loginUser,
  logout,
  me,
  registerUser,
  resetPassword,
  updateUser,
} from "../controllers/userController.js";
import upload from "../middlewares/upload.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = Router();

router.post(
  "/register",
  registerUserValidations,
  handleValidationErrors,
  registerUser
);

router.post("/login", loginUserValidations, handleValidationErrors, loginUser);

router.post(
  "/resetpassword",
  resetPasswordValidations,
  handleValidationErrors,
  resetPassword
);

router.put("/update-user", authenticateUser, upload.single("image"), updateUser);

router.get("/get-profile", authenticateUser, getProfile);

router.post("/logout", logout);

router.get("/get-profile",authenticateUser,getProfile);

export default router;
