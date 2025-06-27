import express  from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getAllSubmissions, getSubmissionForProblem, getAllTheSubmissionsForProblem } from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions);
submissionRoutes.get("/get-submission/:problemId", authMiddleware, getSubmissionForProblem);
submissionRoutes.get("/get-submissions-count/:problemId", authMiddleware, getAllTheSubmissionsForProblem)

export default submissionRoutes;