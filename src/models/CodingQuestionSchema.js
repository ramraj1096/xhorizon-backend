import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CodingQuestionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    tags: {
      type: [String],
      default: [], // e.g., ['arrays', 'recursion']
    },
    starterCode: {
      type: String,
      default: "",
    },
    language: {
      type: [String],
      default: ["cpp", "python", "js"],
    },
    testCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    track: {
      type: String, // e.g., 'DSA', 'Web Dev'
      default: "General",
    },
  },
  {
    timestamps: true,
  }
);

const CodingQuestion = model("CodingQuestion", CodingQuestionSchema);
export default CodingQuestion;
