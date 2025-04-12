import mongoose from "mongoose";

const { Schema, model } = mongoose;

const facultySchema = new Schema(
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
      select: true, // Hide by default in queries for security
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    college: {
      type: Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Optional: Virtual field for displaying a full profile summary
facultySchema.virtual("profile").get(function () {
  return `${this.name} | ${this.subject} | ${this.experience}+ yrs experience`;
});

const Faculty = model("Faculty", facultySchema);

export default Faculty;
