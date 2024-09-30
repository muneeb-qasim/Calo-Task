import fetch from "node-fetch";
import { createApi } from "unsplash-js";
import { config } from "dotenv";
import { v4 as uuidv4 } from "uuid";

import { fetchJobs, saveJobs } from "../utils/fileUtils.js";

config();

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch: fetch,
});

let listeners = [];
console.log("🚀 ~ listeners:", listeners);

export const watchJobStatus = (callback) => {
  listeners.push(callback);
};

const notifyJobUpdate = (jobId) => {
  listeners.forEach((listener) => listener(jobId));
};

export const createJob = async () => {
  const jobs = fetchJobs();
  const jobId = uuidv4();
  const jobEntry = {
    id: jobId,
    result: null,
    status: "pending",
  };

  jobs.push(jobEntry);
  saveJobs(jobs);

  const delay = (Math.floor(Math.random() * 11) + 5) * 1000;

  setTimeout(async () => {
    try {
      const response = await unsplash.photos.getRandom({
        query: "food",
      });
      console.log("response:", response);

      if (response.errors) {
        console.error(`Error fetching image: ${response.errors.join(", ")}`);
      } else {
        jobEntry.status = "resolved";
        jobEntry.result = response.response.urls.regular;
        saveJobs(jobs);
        notifyJobUpdate(jobId);
      }
    } catch (error) {
      console.error(`Error retrieving image: ${error.message}`);
    }
  }, delay);

  return jobId;
};

export const getJobs = () => {
  const jobs = fetchJobs();

  return jobs.map(({ id, status }) => ({
    id,
    status,
    result:
      status === "resolved" ? jobs.find((job) => job.id === id).result : null,
  }));
};

export const getJobById = (id) => {
  const jobs = fetchJobs();
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    throw new Error("Job not found");
  }
  return job;
};
