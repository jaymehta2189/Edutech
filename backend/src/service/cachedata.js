import RedisClient from "./redisconfig.js";
import User from "../model/user.model.js";
import ApiError from "../util/ApiError.js";
import Course from "../model/course.model.js";

export const preCacheUsers = async () => {
    const limit = 20;
    let page = 0;
    try {
        while (true) {
            const users = await User.find().skip(page * limit).limit(limit);
            if (users.length === 0) break;
            await cacheUsers(...users);
            page++;
        }
    } catch (error) {
        console.error('Error pre-caching users:', error);
    }
}
export const cacheUsers = async (...users) => {
    try {
        const pipeline = RedisClient.pipeline();
        users.forEach(user => {
            pipeline.hset(`user:${user._id}`, '_id', user._id, 'name', user.name, 'email', user.email, 'role', user.role);
            pipeline.sadd(`user:role:${user.role}`, user._id);
        });
        await pipeline.exec();
        console.log('Users cached successfully');

    } catch (error) {
        console.error('Error caching users:', error);
    }
}

export const getCachedUser = async (userId) => {
    try {
        const user = await RedisClient.hgetall(`user:${userId}`);
        if (!user) {
            console.error('User not found in cache:', userId);
            return null;
        }
        return user;
    } catch (error) {
        console.error('Error retrieving cached user:', error);
        throw new ApiError(500, 'Internal server error');
    }
};

export const preCacheCourses = async () => {
    const limit = 20;
    let page = 0;
    try {
        while (true) {
            const courses = await Course.find().skip(page * limit).limit(limit);
            if (courses.length === 0) break;
            await cacheCourses(...courses);
            page++;
        }
        return true;
    } catch (error) {
        console.error('Error pre-caching courses:', error);
    }
}

export const cacheCourses = async (...courses) => {
    try {
        const pipeline = RedisClient.pipeline();
        courses.forEach(course => {
            if (course.endDate > new Date()) {
                pipeline.call("JSON.SET", `course:${course._id}`, '$', JSON.stringify(course));
                pipeline.sadd(`course:Ids`, course._id);
            }
            // pipeline.call("JSON.SET", `course:Fulldata`, '$', JSON.stringify(course));
            pipeline.sadd(`course:Ids:Fulldata`, course._id);
        });
        await pipeline.exec();
        console.log('Courses cached successfully');
    } catch (error) {
        console.error('Error caching courses:', error);
    }
};

export const getCachedCourse = async (field, courseId) => {
    try {
        const course = await RedisClient.call("JSON.GET", `course:${courseId}`, field);
        if (!course) {
            console.error('Course not found in cache:', courseId);
            return null;
        }
        
        return JSON.parse(course)[0];
    } catch (error) {
        console.error('Error retrieving cached course:', error);
        throw new ApiError(500, 'Internal server error');
    }
};
export const getCurrentCachedCourses = async () => {
    try {
        const courseIds = await RedisClient.smembers(`course:Ids`);
        if (!courseIds || courseIds.length === 0) {
            console.error('No current courses found in cache');
            return [];
        }
        const courses = await Promise.all(
            courseIds.map(courseId => RedisClient.call("JSON.GET", `course:${courseId}`, "$"))
        ).then(courses=>courses.map(course => JSON.parse(course)))
        .then(courses=>courses.flat());
        await Promise.all(courses.map(async(course) => {course.instructor=await RedisClient.hgetall(`user:${course.instructor}`)}))
        return courses;
    } catch (error) {
        console.error('Error retrieving cached course:', error);
        throw new ApiError(500, 'Internal server error');
    }
};
export const getAllCachedCourses = async () => {
    try {
        // const courses = await RedisClient.call("JSON.GET", `course:Fulldata`,"$");
        const courseIds = await RedisClient.smembers(`course:Ids:Fulldata`);

        if (!courseIds) {
            console.error('No courses found in cache');
            return [];
        }
        const courses = await Promise.all(courseIds.map(courseId => RedisClient.call("JSON.GET", `course:${courseId}`, "$")))
            .then(courses => courses.map(course => JSON.parse(course)))
            .then(courses=>courses.flat())

        await Promise.all(courses.map(async(course) => {course.instructor=await RedisClient.hgetall(`user:${course.instructor}`)}))
        return courses;
    } catch (error) {
        console.error('Error retrieving cached course:', error);
        throw new ApiError(500, 'Internal server error');
    }
}
export const getCachedUserOnRole = async (role) => {
    const userIds = await RedisClient.smembers(`user:role:${role}`);
    if (!userIds || userIds.length === 0) {
        console.error(`No users found with role: ${role}`);
        return [];
    }
    const users = await Promise.all(
        userIds.map(userId => RedisClient.hgetall(`user:${userId}`))
    );
    return users;
};
export const ClearAllCacheSYNC = RedisClient.ClearRedisSync;

export const ClearAllCacheASYNC = RedisClient.ClearRedisAsync;