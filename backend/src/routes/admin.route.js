import express from 'express';
import {auth, isAdmin, isInstructor } from '../middleware/auth.js';
import * as adminController from '../controller/admin.controller.js';
const router = express.Router();
// Promote user to instructor
router.put('/promote/:id', auth, isAdmin, adminController.promoteUser);
router.get('/allInstructors', auth, isAdmin, adminController.getAllInstructors); // Get all users
export default router;