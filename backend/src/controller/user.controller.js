import User from "../model/user.model.js";
import asynchandler from "../util/AsyncHandler.js";
import ApiError from "../util/ApiError.js";
import bcrypt from "bcrypt";
import { generateToken } from "../middleware/auth.js";
import * as cacheData from "../service/cachedata.js";
import RedisClient from "../service/redisconfig.js";

export const register = asynchandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(400, "Email already exists");

    const newUser = new User({ name, email, password, role });
    await newUser.save();
    cacheData.cacheUsers(newUser);
    res.status(201).json({ message: "User registered successfully", user: newUser });
});


export const login = asynchandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(400, "Invalid credentials");
    console.log("User found:", user);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    if (!isMatch) throw new ApiError(400, "Invalid credentials");

    const token = generateToken(user);
    res.json({ message: "Login successful", token, user });

});

export const getAllUsers = asynchandler(async (req, res) => {
    // const users = await User.find({ role: "user" });
    const users =await cacheData.getCachedUserOnRole("user");
    console.log("Users fetched:", users);
    res.json(users);
});

export const getUserById = asynchandler(async (req, res) => {
    // const user = await User.findById(req.params.id);
    const user = await cacheData.getCachedUser(req.params.id);
    if (!user) throw new ApiError(404, "User not found");
    res.json(user);
});


