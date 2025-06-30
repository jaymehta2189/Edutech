import jwt from 'jsonwebtoken';
import User  from '../model/user.model.js';
import ApiError from '../util/ApiError.js';
import asynchandler from '../util/AsyncHandler.js';

export const auth = asynchandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new ApiError(401, 'Authentication token is missing');
    }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

    req.user = user;
    next();
});

export const isAdmin = asynchandler(async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        throw new ApiError(403, 'Access denied. Admins only.');
    }
    next();
});
export const isInstructor = asynchandler(async (req, res, next) => {
    if (!req.user || req.user.role !== 'instructor') {
        throw new ApiError(403, 'Access denied. Instructors only.');
    }
    next();
});

export const generateToken = (user) => {
    const token= jwt.sign({id:user._id, role: user.role ,email:user.email}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
    console.log("Token generated:", token);
    return token;
};