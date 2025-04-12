import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CourseSchema = new Schema(
  {
    title: { type: String, required: true }, // e.g., "Operating Systems"
    code: { type: String, required: true, unique: true }, // e.g., "CS301"
    description: { type: String }, // Optional course intro
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    semester: { type: String }, // e.g., "5th Semester"
    department: { type: String }, // e.g., "CSE"
    enrolledStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }], // student list
  },
  {
    timestamps: true,
  }
);

const Course = model("Course", CourseSchema);
export default Course;
