import express from 'express';
// const { auth } = require('../middleware/auth');
import {auth, isAdmin, isInstructor } from '../middleware/auth.js';
import * as courseController from '../controller/course.controller.js';
import upload from '../middleware/multer.js'; // Adjust the import path as necessary
// Course
const router = express.Router();
router.post('/', auth, isInstructor, courseController.createCourse);                            // Create course
router.get('/all', courseController.getAllCourses);                                   // Get all courses
router.get('/current', courseController.getCurrentCourses);                       // Get current courses
router.post('/enroll/:courseId', auth, courseController.enrollInCourse);            // Enroll in course
router.get('/user/:userId', auth, courseController.getCoursesByUserId);                 // Get courses by userId
router.post('/:courseId/content', auth, isInstructor,upload.single("file"), courseController.addContentToCourse); // Add content to course
export default router;
