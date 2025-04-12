import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SubmissionSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId },
        answerText: String,
        selectedOption: String,
        codeSolution: String,
        passedTestCases: Number,
      },
    ],
    marksObtained: Number,
    graded: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Submission = model("Submission", SubmissionSchema);
export default Submission;
