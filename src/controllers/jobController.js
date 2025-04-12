import Job from "../models/jobSchema.js";

export const addJob = async (req, res) => {
  try {
    const {
      title,
      description,
      skills,
      company,
      location,
      salaryRange,
      deadline,
      postedBy,
    } = req.body;

    const existingJob = await Job.findOne({ title, company });
    if (existingJob) {
      return res.status(400).json({
        message: "Job with this title already exists for this company",
      });
    }

    const newJob = new Job({
      title,
      description,
      skills,
      company,
      location,
      salaryRange,
      deadline,
      postedBy,
    });

    await newJob.save();

    res.status(201).json({
      message: "Job posted successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { studentId, resumeUrl } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const alreadyApplied = job.applicants.some(
      (app) => app.student.toString() === studentId
    );
    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You already applied to this job" });
    }

    job.applicants.push({
      student: studentId,
      resumeUrl,
    });

    await job.save();

    res.status(200).json({
      message: "Application submitted successfully",
      job,
    });
  } catch (error) {
    console.error("Error applying to job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate(
      "applicants.student",
      "name email resumeUrl"
    );

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json({
      success: true,
      applicants: job.applicants,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllJobsAppliedByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Find all jobs where this student is in the applicants array
    const jobs = await Job.find({
      "applicants.student": studentId,
    })
      .select("title company applicants")
      .populate("postedBy", "name")
      .lean(); // returns plain JS objects

    // Filter only the current student’s application details
    const formattedJobs = jobs.map((job) => {
      const application = job.applicants.find(
        (app) => app.student.toString() === studentId
      );

      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        postedBy: job.postedBy?.name || "Unknown",
        resumeUrl: application?.resumeUrl,
        appliedAt: application?.appliedAt,
      };
    });

    res.status(200).json({
      success: true,
      applications: formattedJobs,
    });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};
