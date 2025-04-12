import { body } from "express-validator";

export const submitCodingQuestionValidator = [
  body("student")
    .notEmpty()
    .withMessage("Student ID is required")
    .isMongoId()
    .withMessage("Invalid student ID"),

  body("question")
    .notEmpty()
    .withMessage("Question ID is required")
    .isMongoId()
    .withMessage("Invalid question ID"),

  body("code")
    .notEmpty()
    .withMessage("Code is required")
    .isString()
    .withMessage("Code must be a string"),

  body("language")
    .notEmpty()
    .withMessage("Language is required")
    .isString()
    .withMessage("Language must be a string"),

  body("output").optional().isString(),

  body("passedTestCases")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Passed test cases must be a number"),

  body("totalTestCases")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Total test cases must be a positive number"),

  body("isSuccessful")
    .optional()
    .isBoolean()
    .withMessage("isSuccessful must be true or false"),
];
