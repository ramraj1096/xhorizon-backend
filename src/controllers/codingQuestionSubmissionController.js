import CodingQuestionSubmission from "../models/CodingQuestionSubmissionSchema.js";

// ✅ Submit Coding Question
export const submitCodingQuestion = async (req, res) => {
  try {
    const {
      student,
      question,
      code,
      language,
      output,
      passedTestCases,
      totalTestCases,
      isSuccessful,
    } = req.body;

    const submission = new CodingQuestionSubmission({
      student,
      question,
      code,
      language,
      output,
      passedTestCases,
      totalTestCases,
      isSuccessful,
    });

    await submission.save();

    res.status(201).json({
      success: true,
      message: "Submission recorded successfully",
      submission,
    });
  } catch (error) {
    console.error("Error submitting code:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧑‍🎓 Get All Submissions By Student
export const getAllSubmissionsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const submissions = await CodingQuestionSubmission.find({
      student: studentId,
    }).populate("question", "title difficulty");

    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧑‍🏫 Get All Submissions For a Question (Faculty View)
export const getSubmissionsForQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;

    const submissions = await CodingQuestionSubmission.find({
      question: questionId,
    }).populate("student", "name email");

    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Error fetching submissions for question:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📄 Get One Submission (Details View)
export const getSingleSubmission = async (req, res) => {
  try {
    const submissionId = req.params.id;

    const submission = await CodingQuestionSubmission.findById(submissionId)
      .populate("student", "name email")
      .populate("question", "title");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error("Error fetching submission:", error);
    res.status(500).json({ message: "Server error" });
  }
};
