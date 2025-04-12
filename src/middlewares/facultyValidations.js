import { body } from "express-validator";

export const addFacultyValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("subject").notEmpty().withMessage("Subject is required"),

  body("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("experience")
    .notEmpty()
    .withMessage("Experience is required")
    .isNumeric()
    .withMessage("Experience must be a number")
    .isInt({ min: 0 })
    .withMessage("Experience cannot be negative"),

  body("college")
    .notEmpty()
    .withMessage("College ID is required")
    .withMessage("Invalid college ID"),
];

export const editFacultyValidation = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email").optional().isEmail().withMessage("Invalid email format"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("subject").optional().isString().withMessage("Subject must be a string"),

  body("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("experience")
    .optional()
    .isNumeric()
    .withMessage("Experience must be a number")
    .isInt({ min: 0 })
    .withMessage("Experience cannot be negative"),

  body("college").optional().isMongoId().withMessage("Invalid college ID"),
];
