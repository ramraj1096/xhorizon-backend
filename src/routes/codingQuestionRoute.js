import express from "express";
import {
  addCodingQuestion,
  editCodingQuestion,
  getCodingQuestion,
  getAllQuestionsByFaculty,
  deleteCodingQuestion,
} from "../controllers/codingQuestionController.js";
import {
  addCodingQuestionValidator,
  editCodingQuestionValidator,
} from "../middlewares/codingQuestionValidator.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";
import { authentiFaculty } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/",
  authentiFaculty,
  addCodingQuestionValidator,
  handleValidationErrors,
  addCodingQuestion
);
router.put(
  "/:id",
  authentiFaculty,
  editCodingQuestionValidator,
  handleValidationErrors,
  editCodingQuestion
);
router.get("/:id", authentiFaculty, getCodingQuestion);
router.get("/faculty/:facultyId", authentiFaculty, getAllQuestionsByFaculty);
router.delete("/:id", authentiFaculty, deleteCodingQuestion);

export default router;
