import { body } from "express-validator";

export const submitAssessmentValidation = [
  body("assessmentId")
    .notEmpty()
    .withMessage("Assessment ID is required")
    .isMongoId()
    .withMessage("Invalid Assessment ID"),

  body("studentId")
    .notEmpty()
    .withMessage("Student ID is required")
    .isMongoId()
    .withMessage("Invalid Student ID"),

  body("answers")
    .isArray({ min: 1 })
    .withMessage("Answers must be a non-empty array"),

  body("answers.*.questionId")
    .notEmpty()
    .withMessage("Each answer must have a questionId")
    .isMongoId()
    .withMessage("Invalid questionId format"),

  body("answers.*.selectedOption").optional().isString(),

  body("answers.*.writtenAnswer").optional().isString(),

  body("answers.*.codeAnswer").optional().isString(),
];
