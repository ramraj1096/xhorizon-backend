import mongoose from "mongoose";

const { Schema, model } = mongoose;

const collegeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "https://assets.leetcode.com/users/default_avatar.jpg",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // hide by default in queries (good for auth)
    },
    branches: {
      type: [String],
      default: [],
    },

    faculties: [
      {
        type: Schema.Types.ObjectId,
        ref: "Faculty",
      },
    ],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    jobs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // if you want to include virtual fields
    toObject: { virtuals: true },
  }
);

// Optional: Virtual field to count total people
collegeSchema.virtual("totalMembers").get(function () {
  return (this.students?.length || 0) + (this.faculties?.length || 0);
});

const College = model("College", collegeSchema);
export default College;
