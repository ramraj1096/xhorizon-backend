import { generateToken } from "../middlewares/auth.js";
import College from "../models/collegeSchema.js";
import Faculty from "../models/FacultySchema.js";
import { uploadFile } from "../utils/uploadFile.js";
import bcrypt from "bcrypt";

export const adminlogin=async (req,res)=>{
  try{
    const {email,password}=req.body;
    console.log(req.body);
    if(email==="xhorizonadmin@gmail.com" && password==="qwerty123")
    {
      res.json({success:true,message:"Login Successful",token:"Admin Token"});
    }
  }
  catch(error)
  {
    console.error("Error While Logging The Admin");
    res.json({success:false,message:"Error While Logging The admin"});
  }
}

export const addFaculty = async (req, res) => {
  try {
    const { name, email, password, subject, description, experience, college } =
      req.body;

    const currentCollege = await College.findById(college);
    if (!currentCollege) {
      return res.status(400).json({
        success: false,
        message: "Invalid college ID",
      });
    }

    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({
        success: false,
        message: "Faculty with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFaculty = new Faculty({
      name,
      email,
      password: hashedPassword,
      subject,
      description,
      experience,
      college,
    });

    await newFaculty.save();

    currentCollege.faculties.push(newFaculty);
    await currentCollege.save();

    return res.status(201).json({
      success: true,
      message: "Faculty added successfully",
      faculty: newFaculty,
    });
  } catch (error) {
    console.error("Error adding faculty:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getFaculty = async (req, res) => {
  try {
    const facultyId = req.params.id;

    if (!facultyId) {
      return res.status(400).json({
        success: false,
        message: "Faculty ID is required",
      });
    }

    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Faculty retrieved successfully",
      faculty,
    });
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const editFaculty = async (req, res) => {
  try {
    const facultyId = req.params.id;

    if (!facultyId) {
      return res.status(400).json({
        success: false,
        message: "Faculty ID is required",
      });
    }

    const existingFaculty = await Faculty.findById(facultyId);
    if (!existingFaculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    // Handle file upload
    const imageFile = req.file;
    if (imageFile) {
      const isPDF = imageFile.mimetype === "application/pdf";
      const uploadedUrl = await uploadFile(imageFile, isPDF ? "raw" : "image");
      existingFaculty.image = uploadedUrl || existingFaculty.image;
    }

    // Fields allowed to be updated
    const allowedFields = [
      "name",
      "email",
      "subject",
      "description",
      "experience",
    ];
    const updateFields = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    // Handle password separately
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updateFields.password = hashedPassword;
    }

    // Apply updates
    Object.assign(existingFaculty, updateFields);
    const updatedFaculty = await existingFaculty.save();

    return res.status(200).json({
      success: true,
      message: "Faculty updated successfully",
      faculty: updatedFaculty,
    });
  } catch (error) {
    console.error("Error updating faculty:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existingFaculty = await Faculty.findOne({ email });

    if (!existingFaculty) {
      return res.status(401).json({
        success: false,
        message: "Faculty not found",
      });
    }

    if (!existingFaculty.password) {
      console.error("No password hash found for faculty:", existingFaculty);
      return res.status(500).json({
        success: false,
        pass: existingFaculty.password || "null",
        message: "Internal error: No password set for this faculty",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingFaculty.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken({
      facultyId: existingFaculty._id,
      email: existingFaculty.email,
    });

    res.cookie("faculty_token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${existingFaculty.name}`,
      faculty: existingFaculty,
      token,
    });
  } catch (error) {
    console.error("Error logging in faculty:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAllFacultyByCollege = async (req, res) => {
  try {
    const collegeId = req.params.collegeId;

    const facultyList = await Faculty.find({ college: collegeId });

    res.status(200).json({
      success: true,
      message: "Faculty list fetched successfully",
      faculty: facultyList,
    });
  } catch (error) {
    console.error("Error fetching faculty list:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutFaculty = async (req, res) => {
  try {
    res.clearCookie("faculty_token", {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error during faculty logout:", error);
    return res.status(500).json({
      success: false,
      message: "Error during faculty logout",
    });
  }
};

// Get Faculty Profile
export const getFacultyProfile = async (req, res) => {
  try {
    const id = req.facultyId;

    // Fetch faculty details using the facultyId stored in the request (assuming facultyId is set after login)
    const facultyData = await Faculty.findById(id).select("-password");

    if (!facultyData) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    return res.status(200).json({
      success: true,
      faculty: facultyData,
    });
  } catch (error) {
    console.log("Error while fetching the faculty profile:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching the faculty profile",
    });
  }
};

// Me Endpoint for Faculty (Similar to the student "me" endpoint)
export const meFaculty = async (req, res) => {
  try {
    // Return the logged-in faculty's information from the request object
    return res.status(200).json({
      success: true,
      faculty: req.faculty,
    });
  } catch (error) {
    console.log("Error while fetching faculty data:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching faculty data",
    });
  }
};
