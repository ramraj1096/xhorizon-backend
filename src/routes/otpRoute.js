import { Router } from "express";
import { sendEmail, sendOtp, verifyOTP } from "../controllers/otpController.js";

const router = Router();

router.post("/sendOTP", sendOtp);

router.post("/verifyOTP", verifyOTP);

export default router;
