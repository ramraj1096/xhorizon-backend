import { body } from "express-validator";

export const addCodingQuestionValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters"),

  body("description").notEmpty().withMessage("Description is required"),

  body("difficulty")
    .notEmpty()
    .withMessage("Difficulty is required")
    .isIn(["Easy", "Medium", "Hard"])
    .withMessage("Difficulty must be Easy, Medium, or Hard"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),

  body("starterCode").optional().isString(),

  body("language")
    .isArray({ min: 1 })
    .withMessage("Language must be a non-empty array"),

  body("testCases")
    .isArray({ min: 1 })
    .withMessage("Test cases must be a non-empty array"),

  body("testCases.*.input")
    .notEmpty()
    .withMessage("Each test case must have an input"),

  body("testCases.*.expectedOutput")
    .notEmpty()
    .withMessage("Each test case must have an expected output"),

  body("createdBy")
    .notEmpty()
    .withMessage("Faculty ID is required")
    .isMongoId()
    .withMessage("Invalid Faculty ID"),

  body("track").optional().isString(),
];

export const editCodingQuestionValidator = [
  body("title").optional().isLength({ min: 5 }),

  body("description").optional().isString(),

  body("difficulty").optional().isIn(["Easy", "Medium", "Hard"]),

  body("tags").optional().isArray(),

  body("starterCode").optional().isString(),

  body("language").optional().isArray(),

  body("testCases").optional().isArray(),

  body("testCases.*.input").optional().isString(),

  body("testCases.*.expectedOutput").optional().isString(),

  body("track").optional().isString(),
];
