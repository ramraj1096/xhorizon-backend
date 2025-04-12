import mongoose from "mongoose";

const { Schema, model } = mongoose;

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: "Remote",
      trim: true,
    },
    company: {
      type: String,
      default: "Unknown",
      trim: true,
    },
    salaryRange: {
      min: { type: Number, default: 0 },
      max: { type: Number },
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "College", // or Admin if you add one later
    },
    applicants: [
      {
        student: { type: Schema.Types.ObjectId, ref: "Student" },
        resumeUrl: String,
        appliedAt: { type: Date, default: Date.now },
      },
    ],
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobSchema.virtual("totalApplicants").get(function () {
  return this.applicants?.length || 0;
});

const Job = model("Job", jobSchema);

export default Job;
