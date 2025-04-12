import { body } from "express-validator";

export const addCourseValidation = [
  body("title")
    .notEmpty()
    .withMessage("Course title is required")
    .isLength({ min: 3 })
    .withMessage("Course title must be at least 3 characters"),

  body("code")
    .notEmpty()
    .withMessage("Course code is required")
    .isLength({ min: 2 })
    .withMessage("Course code must be at least 2 characters"),

  body("description").notEmpty().withMessage("Course description is required"),

  body("faculty")
    .notEmpty()
    .withMessage("Faculty ID is required")
    .isMongoId()
    .withMessage("Invalid faculty ID"),

  body("semester").notEmpty().withMessage("Semester is required"),

  body("department").notEmpty().withMessage("Department is required"),
];

export const editCourseValidation = [
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Course title must be at least 3 characters"),

  body("code")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Course code must be at least 2 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("faculty").optional().isMongoId().withMessage("Invalid faculty ID"),

  body("semester")
    .optional()
    .isString()
    .withMessage("Semester must be a string"),

  body("department")
    .optional()
    .isString()
    .withMessage("Department must be a string"),
];
