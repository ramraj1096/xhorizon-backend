import College from "../models/collegeSchema.js";
import bcrypt from "bcrypt";
import { uploadFile } from "../utils/uploadFile.js";
import { generateToken } from "../middlewares/auth.js";

//  Register College
export const registerCollege = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingCollege = await College.findOne({ email });
    if (existingCollege) {
      return res.status(409).json({
        success: false,
        message: "College already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCollege = new College({
      name,
      email,
      password: hashedPassword,
    });

    await newCollege.save();

    const token = generateToken({
      collegeId: newCollege.id,
      email: newCollege.email,
    });

    res.cookie("college_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "College registered successfully",
      college: newCollege,
      token,
    });
  } catch (error) {
    console.error("Error registering college:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 🔐 Login College
export const loginCollege = async (req, res) => {
  try {
    const { email, password } = req.body;

    const college = await College.findOne({ email }).select("+password");
    if (!college) {
      return res
        .status(401)
        .json({ success: false, message: "College not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, college.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect credentials" });
    }

    const token = generateToken({
      collegeId: college.id,
      email: college.email,
    });

    res.cookie("college_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${college.name}`,
      college,
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Edit College
export const editCollege = async (req, res) => {
  try {
    const collegeId = req.params.id || req.user?.collegeId;

    if (!collegeId) {
      return res
        .status(400)
        .json({ success: false, message: "College ID not provided" });
    }

    const allowedFields = ["name", "email", "branches", "courses"];
    const updateFields = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    if (req.file) {
      const isPDF = req.file.mimetype === "application/pdf";
      const uploadedUrl = await uploadFile(req.file, isPDF ? "raw" : "image");
      if (uploadedUrl) updateFields.image = uploadedUrl;
    }

    const updatedCollege = await College.findByIdAndUpdate(
      collegeId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedCollege) {
      return res
        .status(404)
        .json({ success: false, message: "College not found" });
    }

    return res.status(200).json({
      success: true,
      message: "College updated successfully",
      college: updatedCollege,
    });
  } catch (error) {
    console.error("Error updating college:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// 🔍 Get Single College
export const getCollege = async (req, res) => {
  try {
    const collegeId = req.params.id || req.user?.collegeId;

    const college = await College.findById(collegeId)
      .populate("faculties")
      .populate("students")
      .populate("courses");

    if (!college) {
      return res
        .status(404)
        .json({ success: false, message: "College not found" });
    }

    return res.status(200).json({
      success: true,
      message: "College fetched successfully",
      college,
    });
  } catch (error) {
    console.error("Error fetching college:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// 📋 Get All Colleges (Optional Admin Panel)
export const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find().select("-password");
    return res.status(200).json({
      success: true,
      message: "All colleges fetched successfully",
      colleges,
    });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Logout College
export const logoutCollege = async (req, res) => {
  try {
    res.clearCookie("college_token", {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error during college logout:", error);
    return res.status(500).json({
      success: false,
      message: "Error during college logout",
    });
  }
};

// Get College Profile
export const getCollegeProfile = async (req, res) => {
  try {
    const id = req.collegeId;

    // Fetch college details using the collegeId stored in the request (assuming collegeId is set after login)
    const collegeData = await College.findById(id).select("-password");

    if (!collegeData) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      college: collegeData,
    });
  } catch (error) {
    console.log("Error while fetching the college profile:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching the college profile",
    });
  }
};

// Me Endpoint for College (Similar to the student "me" endpoint)
export const meCollege = async (req, res) => {
  try {
    // Return the logged-in college's information from the request object
    return res.status(200).json({
      success: true,
      college: req.college,
    });
  } catch (error) {
    console.log("Error while fetching college data:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching college data",
    });
  }
};
