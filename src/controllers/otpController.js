import NodeCache from "node-cache";
import nodemailer from "nodemailer";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "../utils/emailTemplates.js";
import { transporter } from "../configurations/nodeMailerConfig.js";
import User from "../models/studentSchema.js";

//cache to store otp's
const otpCache = new NodeCache({ stdTTL: 300 });

//otp generation
const generateOtp = (key) => {
  const min = 100000;
  const max = 999999;

  const otp = Math.floor(Math.random() * (max - min + 1)) + min;

  otpCache.set(key, otp);
  return otp.toString();
};

const getOtp = (key) => {
  const res = otpCache.get(key);

  if (!res) return null;
  return res;
};

// removes the key, value pair of email and OTP from cache

const clearOtp = (key) => {
  otpCache.del(key);
};

export const sendEmail = async (req, res) => {
  try {
    const { email, name, useCase } = req;

    let htmlTemplate = `<h1>Error</h1>`;
    const otp = useCase !== "blockEmail" ? req.otp : "";
    let subjectMessage = "";

    if (useCase === "register") {
      (subjectMessage = "OTP for Registering !"),
        (htmlTemplate = VERIFICATION_EMAIL_TEMPLATE(otp));
    } else if (useCase === "resetPassword") {
      (subjectMessage = "OTP for Reset Your Password !"),
        (htmlTemplate = PASSWORD_RESET_REQUEST_TEMPLATE(otp));
    } else if (useCase === "registerSuccessfull") {
      (subjectMessage = "Wellcome To Our Platform !"),
        (htmlTemplate = WELCOME_EMAIL_TEMPLATE(name));
    } else if (useCase === "passwordResetSuccessfull") {
      (subjectMessage = "Wellcome To Our Platform !"),
        (htmlTemplate = PASSWORD_RESET_SUCCESS_TEMPLATE);
    } else {
      (subjectMessage = "Password Reset Successfull !"),
        (htmlTemplate = WELCOME_EMAIL_TEMPLATE(name));
    }

    var mailOptions = {
      to: email,
      subject: subjectMessage,
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email, useCase } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please give email",
      });
    }

    const isUserExists = await User.findOne({ email });

    if (useCase === "register" && isUserExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    if (useCase === "resetPassword" && !isUserExists) {
      return res.status(401).json({
        success: false,
        message: "User not exists",
      });
    }

    const otp = generateOtp(email);
    console.log("OTP generated", otp);

    await sendEmail(
      {
        email: email,
        otp: otp,
        useCase: useCase,
      },
      res
    );

    return res.status(200).json({
      success: true,
      otpInfo: otp,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    //error handling
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please give email and otp",
      });
    }

    // converting the user entered otp to integer
    const userOtp = parseInt(otp, 10);

    // this is the correct OTP, fetching from cache
    const correctOtp = getOtp(email);

    console.log({
      email: email,
      userOTP: userOtp,
      correctOTP: correctOtp,
    });

    // is OTP is expired after some time, or already verified
    if (!correctOtp || correctOtp === undefined) {
      return res.status(400).json({
        success: false,
        message: "OTP is expired",
      });
    }

    const isValid = userOtp === correctOtp;

    if (isValid) {
      clearOtp(email);
    }

    if (isValid) {
      return res.status(200).json({
        success: true,
        message: "OTP Verified Successfully",
      });
    }

    return res.status(200).json({
      success: false,
      message: "Invalid OTP",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
