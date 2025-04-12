import Assessment from "../models/AssessmentSchema.js";
import Submission from "../models/assessmentSubmissionSchema.js";

// 1. Submit Assessment
export const submitAssessment = async (req, res) => {
  try {
    const { assessmentId, studentId, answers } = req.body;

    // Prevent duplicate submission
    const existing = await Submission.findOne({ assessmentId, studentId });
    if (existing) {
      return res.status(400).json({ message: "Submission already exists" });
    }

    let totalMarks = 0;
    let marksObtained = 0;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment)
      return res.status(404).json({ message: "Assessment not found" });

    totalMarks = assessment.totalMarks;

    // Auto-grade MCQs (optional feature)
    let correctCount = 0;
    assessment.questions.forEach((q, i) => {
      const studentAnswer = answers.find(
        (a) => a.questionId === q._id.toString()
      );
      if (
        q.type === "mcq" &&
        studentAnswer?.selectedOption === q.correctAnswer
      ) {
        correctCount++;
      }
    });

    // Basic scoring logic: each MCQ worth equal marks
    const perQuestionMark = assessment.questions.length
      ? Math.floor(totalMarks / assessment.questions.length)
      : 1;

    marksObtained = correctCount * perQuestionMark;

    const newSubmission = new Submission({
      studentId,
      assessmentId,
      answers,
      marksObtained,
      graded: true,
    });

    await newSubmission.save();

    res.status(201).json({
      success: true,
      message: "Submission successful",
      submission: newSubmission,
    });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Get All Submissions by Student
export const getSubmissionsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const submissions = await Submission.find({ studentId })
      .populate("assessmentId", "title")
      .populate("studentId", "name");

    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Get Single Submission
export const getSingleSubmission = async (req, res) => {
  try {
    const submissionId = req.params.id;

    const submission = await Submission.findById(submissionId)
      .populate("studentId", "name email")
      .populate("assessmentId", "title");

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

// 4. Re-evaluate Submission (Optional Admin Feature)
export const evaluateSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    const assessment = await Assessment.findById(submission.assessmentId);
    if (!assessment)
      return res.status(404).json({ message: "Assessment not found" });

    let correctCount = 0;
    assessment.questions.forEach((q) => {
      const studentAnswer = submission.answers.find(
        (a) => a.questionId === q._id.toString()
      );
      if (
        q.type === "mcq" &&
        studentAnswer?.selectedOption === q.correctAnswer
      ) {
        correctCount++;
      }
    });

    const perQuestionMark = assessment.questions.length
      ? Math.floor(assessment.totalMarks / assessment.questions.length)
      : 1;

    submission.marksObtained = correctCount * perQuestionMark;
    submission.graded = true;

    await submission.save();

    res.status(200).json({
      success: true,
      message: "Submission evaluated successfully",
      submission,
    });
  } catch (error) {
    console.error("Error evaluating submission:", error);
    res.status(500).json({ message: "Server error" });
  }
};
