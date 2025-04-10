import bcrypt from "bcrypt";
import User from "../models/userSchema.js";
import { sendEmail } from "./otpController.js";
import { generateToken } from "../middlewares/auth.js";
import { uploadImage } from "../utils/uploadImage.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
      return res.status(409).json({
        success: false,
        message: "User already Exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // await sendEmail(
    //   {
    //     name: name,
    //     email: email,
    //     otp: "",
    //     useCase: "registerSuccessfull",
    //   },
    //   res
    // );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUserExists = await User.findOne({ email });

    if (!isUserExists) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      isUserExists.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Credentials",
      });
    }

    const token = generateToken({
      userId: isUserExists.id,
      email: isUserExists.email,
    });

    res.setHeader("Authorization", `Bearer ${token}`);
    res.cookie("auth_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({
      success: true,
      message: `Welcome back ${isUserExists.name}`,
      user: isUserExists,
      token: token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUserExists = await User.findOne({ email });

    if (!isUserExists) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    isUserExists.password = hashedPassword;
    await isUserExists.save();

    await sendEmail(
      {
        email: email,
        otp: "",
        useCase: "passwordResetSuccessfull",
      },
      res
    );

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  const isUserExists = await User.findOne({ email });

  if (!isUserExists) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (req.file) {
    isUserExists.image = (await uploadImage(req.file)) || isUserExists.image;
  }

  if (name) isUserExists.name = name || isUserExists.name;

  await isUserExists.save();

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: isUserExists,
  });
};

export const me = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};
