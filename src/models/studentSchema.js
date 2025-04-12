import mongoose from "mongoose";
import validator from "validator";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    image: {
      type: String,
      default: "https://assets.leetcode.com/users/default_avatar.jpg",
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: true, // hide by default in queries
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Not Selected"],
      default: "Not Selected",
    },

    dob: {
      type: String,
      default: "Not Selected",
    },

    phone: {
      type: String,
      default: "0000000000",
    },

    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zip: { type: String, default: "" },
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },

    branch: {
      type: String,
      default: "CSE",
    },

    semester: {
      type: String,
      default: "1",
    },

    resumeUrl: {
      type: String,
      default: "",
    },

    codingTracks: [
      {
        trackName: String, // e.g., "DSA"
        progress: Number, // e.g., 50 for 50%
        streak: { type: Number, default: 0 },
      },
    ],

    // AI Resume Generator Fields
    skills: [
      {
        skillName: {
          type: String,
          required: true,
        },
        proficiency: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
          required: true,
        },
      },
    ],

    achievements: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    projects: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        technologies: [String], // e.g., ["React", "Node.js"]
        link: {
          type: String,
          default: "",
        },
      },
    ],

    certifications: [
      {
        title: {
          type: String,
          required: true,
        },
        issuingOrganization: {
          type: String,
          required: true,
        },
        issueDate: {
          type: Date,
          required: true,
        },
        expirationDate: {
          type: Date,
        },
        credentialId: {
          type: String,
        },
        credentialUrl: {
          type: String,
        },
      },
    ],

    languages: [
      {
        language: {
          type: String,
          required: true,
        },
        proficiency: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Native"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
