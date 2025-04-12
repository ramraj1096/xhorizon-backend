import { body } from "express-validator";

//Add Job Validation
export const addJobValidation = [
  body("title").notEmpty().withMessage("Job title is required"),

  body("description").notEmpty().withMessage("Job description is required"),

  body("skills")
    .isArray({ min: 1 })
    .withMessage("Skills must be a non-empty array"),

  body("company").notEmpty().withMessage("Company name is required"),

  body("location").notEmpty().withMessage("Job location is required"),

  body("salaryRange.min")
    .optional()
    .isNumeric()
    .withMessage("Minimum salary must be a number"),

  body("salaryRange.max")
    .optional()
    .isNumeric()
    .withMessage("Maximum salary must be a number"),

  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Deadline must be a valid date"),

  body("postedBy")
    .notEmpty()
    .withMessage("PostedBy (College ID) is required")
    .isMongoId()
    .withMessage("Invalid postedBy ID"),
];

//Apply to Job Validation
export const applyJobValidation = [
  body("studentId")
    .notEmpty()
    .withMessage("Student ID is required")
    .isMongoId()
    .withMessage("Invalid Student ID"),

  body("resumeUrl")
    .notEmpty()
    .withMessage("Resume URL is required")
    .isURL()
    .withMessage("Resume must be a valid URL"),
];
