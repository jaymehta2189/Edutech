import express from 'express';
import {auth, isAdmin, isInstructor } from '../middleware/auth.js';
const router = express.Router();
import * as userController from '../controller/user.controller.js';
// User Auth
router.post('/register', userController.register);
router.post('/login', userController.login);

// User Data
router.get('/all', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);

export default router;
