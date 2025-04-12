import Assessment from "../models/AssessmentSchema.js";
import Submission from "../models/assessmentSubmissionSchema.js";

// Add Assessment
export const addAssessment = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      courseId,
      createdBy,
      dueDate,
      totalMarks,
      questions,
    } = req.body;

    const newAssessment = new Assessment({
      title,
      description,
      type,
      courseId,
      createdBy,
      dueDate,
      totalMarks,
      questions,
    });

    await newAssessment.save();

    res.status(201).json({
      success: true,
      message: "Assessment created successfully",
      assessment: newAssessment,
    });
  } catch (error) {
    console.error("Error creating assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Edit Assessment
export const editAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.id;

    const allowedFields = [
      "title",
      "description",
      "type",
      "dueDate",
      "totalMarks",
      "questions",
    ];
    const updateFields = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const updated = await Assessment.findByIdAndUpdate(
      assessmentId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Assessment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Assessment updated successfully",
      assessment: updated,
    });
  } catch (error) {
    console.error("Error updating assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Single Assessment
export const getAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.id;

    const assessment = await Assessment.findById(assessmentId)
      .populate("courseId")
      .populate("createdBy");

    if (!assessment) {
      return res
        .status(404)
        .json({ success: false, message: "Assessment not found" });
    }

    res.status(200).json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error("Error fetching assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Assessments
export const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find()
      .populate("courseId", "title")
      .populate("createdBy", "name");

    res.status(200).json({
      success: true,
      assessments,
    });
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Assessment
export const deleteAssessment = async (req, res) => {
  try {
    const deleted = await Assessment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Assessment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Assessment deleted successfully",
      assessment: deleted,
    });
  } catch (error) {
    console.error("Error deleting assessment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Assessments By Course ID
export const getAssessmentsByCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const assessments = await Assessment.find({ courseId }).populate(
      "createdBy",
      "name"
    );

    res.status(200).json({
      success: true,
      assessments,
    });
  } catch (error) {
    console.error("Error fetching course assessments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Submissions for an Assessment
export const getAssessmentSubmissions = async (req, res) => {
  try {
    const assessmentId = req.params.assessmentId;

    const submissions = await Submission.find({ assessmentId }).populate(
      "studentId",
      "name email"
    );

    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
