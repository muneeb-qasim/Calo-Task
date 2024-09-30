import fs from "fs";
import path from "path";

const jobsFilePath = path.join(process.cwd(), "app/jobs.json");

export const fetchJobs = () => {
  if (fs.existsSync(jobsFilePath)) {
    const fileContent = fs.readFileSync(jobsFilePath, "utf-8").trim();

    if (fileContent === "") {
      return [];
    }

    try {
      return JSON.parse(fileContent);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return [];
    }
  }
  return [];
};

export const saveJobs = (jobsList) => {
  const jsonData = JSON.stringify(jobsList, null, 2);
  fs.writeFileSync(jobsFilePath, jsonData, "utf-8");
};
