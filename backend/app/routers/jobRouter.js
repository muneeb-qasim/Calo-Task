import express from "express";
import * as jobController from "../controllers/jobController.js";

const router = express.Router();

router.route("").get(jobController.getJobs).post(jobController.createJob);
router.route("/:id").get(jobController.getJobById);

export default router;
