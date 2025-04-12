import CodingQuestion from "../models/CodingQuestionSchema.js";

// Add Coding Question
export const addCodingQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      starterCode,
      language,
      testCases,
      createdBy,
      track,
    } = req.body;

    const question = new CodingQuestion({
      title,
      description,
      difficulty,
      tags,
      starterCode,
      language,
      testCases,
      createdBy,
      track,
    });

    await question.save();

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      question,
    });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit Coding Question
export const editCodingQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;

    const allowedFields = [
      "title",
      "description",
      "difficulty",
      "tags",
      "starterCode",
      "language",
      "testCases",
      "track",
    ];

    const updateFields = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const updated = await CodingQuestion.findByIdAndUpdate(
      questionId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question: updated,
    });
  } catch (error) {
    console.error("Error editing question:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Get One Coding Question
export const getCodingQuestion = async (req, res) => {
  try {
    const question = await CodingQuestion.findById(req.params.id).populate(
      "createdBy",
      "name"
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Questions by Faculty
export const getAllQuestionsByFaculty = async (req, res) => {
  try {
    const questions = await CodingQuestion.find({
      createdBy: req.params.facultyId,
    });

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Coding Question
export const deleteCodingQuestion = async (req, res) => {
  try {
    const deleted = await CodingQuestion.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
      question: deleted,
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Server error" });
  }
};
