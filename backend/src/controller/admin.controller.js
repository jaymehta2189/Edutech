import User from "../model/user.model.js";
import asynchandler from "../util/AsyncHandler.js";
import ApiError from "../util/ApiError.js";
import RedisClient from "../service/redisconfig.js";
import * as cachedata from "../service/cachedata.js";
export const promoteUser = asynchandler(async (req, res) => {
      const userId = req.params.id;
      console.log("Promoting user with ID:", userId);
      const updated = await User.findByIdAndUpdate(
        userId,
        { role: "instructor" },
        { new: true }
      );

      if (!updated)  throw new ApiError(404, "User not found");
      await RedisClient.hset(`user:${userId}`,"_id",updated._id, 'name', updated.name, 'email', updated.email, 'role', updated.role);
      await RedisClient.sadd(`user:role:instructor`, userId);
      await RedisClient.srem(`user:role:user`, updated._id);
      res.json({ message: "User promoted to instructor", user: updated });
}); 
export const getAllInstructors = asynchandler(async (req, res) => {
      // const instructors = await User.find({ role: "instructor" });
      console.log("Fetching all instructors");
      const instructors=await cachedata.getCachedUserOnRole("instructor");
      console.log("Instructors fetched:", instructors);
      res.json(instructors);
});



