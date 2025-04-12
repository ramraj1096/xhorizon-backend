import { body } from "express-validator";

export const addAssessmentValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["quiz", "assignment", "coding"])
    .withMessage("Type must be quiz, assignment, or coding"),

  body("courseId")
    .notEmpty()
    .withMessage("Course ID is required")
    .isMongoId()
    .withMessage("Invalid Course ID"),

  body("createdBy")
    .notEmpty()
    .withMessage("Faculty ID is required")
    .isMongoId()
    .withMessage("Invalid Faculty ID"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  body("totalMarks")
    .notEmpty()
    .withMessage("Total marks is required")
    .isNumeric()
    .withMessage("Total marks must be a number"),

  body("questions")
    .isArray({ min: 1 })
    .withMessage("Questions must be a non-empty array"),

  body("questions.*.questionText")
    .notEmpty()
    .withMessage("Each question must have a questionText"),

  body("questions.*.type")
    .isIn(["mcq", "short-answer", "code"])
    .withMessage("Invalid question type"),

  body("questions.*.options")
    .optional()
    .isArray()
    .withMessage("Options must be an array"),

  body("questions.*.correctAnswer").optional().isString(),

  body("questions.*.codeTemplate").optional().isString(),

  body("questions.*.testCases").optional().isArray(),
];

export const editAssessmentValidation = [
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),

  body("description").optional().isString(),

  body("type").optional().isIn(["quiz", "assignment", "coding"]),

  body("dueDate").optional().isISO8601(),

  body("totalMarks").optional().isNumeric(),

  body("questions").optional().isArray(),

  body("questions.*.questionText").optional().isString(),

  body("questions.*.type").optional().isIn(["mcq", "short-answer", "code"]),

  body("questions.*.options").optional().isArray(),

  body("questions.*.correctAnswer").optional().isString(),

  body("questions.*.codeTemplate").optional().isString(),

  body("questions.*.testCases").optional().isArray(),
];
