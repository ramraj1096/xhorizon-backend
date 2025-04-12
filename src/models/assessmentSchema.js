import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AssessmentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ["quiz", "assignment", "coding"],
      default: "quiz",
    },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    dueDate: { type: Date },
    totalMarks: { type: Number },

    questions: [
      {
        questionText: { type: String, required: true },
        type: {
          type: String,
          enum: ["mcq", "short-answer", "code"],
          default: "mcq",
        },
        options: [String],
        correctAnswer: String,
        codeTemplate: String,
        testCases: [
          {
            input: String,
            expectedOutput: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Assessment = model("Assessment", AssessmentSchema);
export default Assessment;
