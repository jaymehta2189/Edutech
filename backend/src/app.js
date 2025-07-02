import express  from "express";
import cors from "cors";
import "dotenv/config";
import rateLimit from "express-rate-limit";
const app = express();
app.use(cors(
    {
        origin:"http://localhost:5173", // Update this to match your frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    }
));
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') return next()
  express.json()(req, res, next)
})

// app.use(express.urlencoded({ extended: false }));

const Limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later"
});
app.use(Limiter);

import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import courseRoutes from "./routes/course.route.js";
import aiRoutes from "./routes/ai.route.js";
import ApiError from "./util/ApiError.js";
import paymentroute from "./routes/payment.route.js";

import *as cacheConfig from "./service/cachedata.js";
import RedisClient from "./service/redisconfig.js";
RedisClient.on('ready', async() => {
    await cacheConfig.ClearAllCacheASYNC();
    const [CourseCacheResult] = await Promise.all([
        cacheConfig.preCacheCourses(),
        cacheConfig.preCacheUsers(),
    ]);
    if (CourseCacheResult) {
        console.log("Courses pre-cached successfully.");
    } else {
        console.log("No courses to pre-cache.");
    }

    console.log("Redis is ready.");
});

RedisClient.on('error', (error) => {
    console.log("Redis error: ", error);
    exit(1);
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payment", paymentroute);


app.use((err,req, res, next) => {
    if(err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    else{
        res.status(500).json({ message: "Internal Server Error" });
    }
});
export default app;