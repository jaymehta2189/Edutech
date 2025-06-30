// routes/ai.route.js
import express from "express";
import { askAboutCourseGemini } from "../controller/ai.controller.js";
const router = express.Router();

router.post("/ask/:courseId", askAboutCourseGemini);

export default router;
