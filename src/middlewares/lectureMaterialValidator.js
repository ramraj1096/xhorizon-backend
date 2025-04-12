import { body } from "express-validator";

export const addLectureMaterialValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["video", "pdf", "link", "document", "slide"])
    .withMessage("Invalid material type"),

  body("fileUrl")
    .notEmpty()
    .withMessage("URL is required")
    .isURL()
    .withMessage("Invalid URL"),

  body("courseId")
    .notEmpty()
    .withMessage("Course ID is required")
    .isMongoId()
    .withMessage("Invalid Course ID"),

  body("uploadedBy")
    .notEmpty()
    .withMessage("Uploader ID is required")
    .isMongoId()
    .withMessage("Invalid Uploader ID"),
];

export const editLectureMaterialValidator = [
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),

  body("type")
    .optional()
    .isIn(["video", "pdf", "link", "document", "slide"])
    .withMessage("Invalid material type"),

  body("url").optional().isURL().withMessage("Invalid URL"),
];
