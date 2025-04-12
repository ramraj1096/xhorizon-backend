import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CodingQuestionSubmissionSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "CodingQuestion",
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    output: {
      type: String,
    },
    passedTestCases: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
    isSuccessful: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const CodingQuestionSubmission = model(
  "CodingQuestionSubmission",
  CodingQuestionSubmissionSchema
);
export default CodingQuestionSubmission;
