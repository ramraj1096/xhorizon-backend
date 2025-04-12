import mongoose from "mongoose";

const { Schema, model } = mongoose;

const LectureMaterialSchema = new Schema(
  {
    title: { type: String, required: true }, // e.g., "Stacks & Queues - Lecture Notes"
    type: {
      type: String,
      enum: ["pdf", "video", "ppt", "link", "other"],
      default: "pdf",
    },
    fileUrl: { type: String, required: true }, // Can be a URL or file path
    uploadedBy: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    topic: { type: String }, // Optional: "Week 2", "Unit 4"
    description: { type: String }, // Optional additional notes
  },
  {
    timestamps: true,
  }
);

const LectureMaterial = model("LectureMaterial", LectureMaterialSchema);
export default LectureMaterial;
