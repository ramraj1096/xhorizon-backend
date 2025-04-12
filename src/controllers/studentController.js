import bcrypt from "bcrypt";
import Student from "../models/studentSchema.js";
import { sendEmail } from "./otpController.js";
import { generateToken } from "../middlewares/auth.js";
import { uploadFile } from "../utils/uploadFile.js";

export const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isStudentExists = await Student.findOne({ email });

    if (isStudentExists) {
      return res.status(409).json({
        success: false,
        message: "Student already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = await Student.create({
      name,
      email,
      password: hashedPassword,
    });

    await newStudent.save();

    await sendEmail(
      {
        name: name,
        email: email,
        otp: "",
        useCase: "registerSuccessfull",
      },
      res
    );

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: newStudent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Student not found",
      });
    }

    // DEBUG LOGGING TO IDENTIFY ISSUE
    console.log("Received password from body:", password);
    console.log("Password from DB:", student.password);

    if (!student.password) {
      return res.status(400).json({
        success: false,
        message: "Password not set for this account",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, student.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect credentials",
      });
    }

    const token = generateToken({
      studentId: student.id,
      email: student.email,
    });

    res.setHeader("Authorization", `Bearer ${token}`);
    res.cookie("auth_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({
      success: true,
      message: `Welcome back ${student.name}`,
      student,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isStudentExists = await Student.findOne({ email });

    if (!isStudentExists) {
      return res.status(401).json({
        success: false,
        message: "Student not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    isStudentExists.password = hashedPassword;
    await isStudentExists.save();

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

export const updateStudent = async (req, res) => {
  const id = req.studentId;
  const {
    name,
    phone,
    address,
    dob,
    gender,
    skills,
    achievements,
    projects,
    certifications,
    languages,
  } = req.body;

  if (!name || !phone || !address || !dob || !gender) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const parsedAddress = JSON.parse(address);

  await Student.findByIdAndUpdate(id, {
    name,
    phone,
    address: parsedAddress,
    dob,
    gender,
    skills,
    achievements,
    projects,
    certifications,
    languages,
  });

  const imageFile = req.file;
  const isPDF = file.mimetype === "application/pdf";
  const studentDetails = await Student.findById(id);

  if (imageFile) {
    studentDetails.image =
      uploadFile(file, isPDF ? "raw" : "image") || studentDetails.image;
    await studentDetails.save();
  }

  return res.status(200).json({
    success: true,
    message: "Student updated successfully",
    student: studentDetails,
  });
};

export const getProfile = async (req, res) => {
  try {
    const id = req.studentId;
    const studentData = await Student.findById(id).select("-password");
    if (!studentData) {
      return res.json({ success: false, message: "Student not found" });
    }
    return res.json({ success: true, student: studentData });
  } catch (error) {
    console.log("Error while fetching the student profile:", error);
    res.json({
      success: false,
      message: "Error while fetching the student profile",
    });
  }
};

export const me = async (req, res) => {
  res.status(200).json({
    success: true,
    student: req.student,
  });
};
