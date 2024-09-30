import * as jobService from "../services/jobService.js";

export const createJob = async (req, res) => {
  try {
    const jobId = await jobService.createJob();
    return res.status(201).json({ jobId });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create job." });
  }
};

export const getJobs = (req, res) => {
  try {
    const jobs = jobService.getJobs();
    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch jobs." });
  }
};

export const getJobById = (req, res) => {
  const { id } = req.params;
  try {
    const job = jobService.getJobById(id);
    return res.status(200).json(job);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
