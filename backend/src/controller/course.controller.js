import Course from "../model/course.model.js";
import asynchandler from "../util/AsyncHandler.js";
import ApiError from "../util/ApiError.js";
import * as cacheData from "../service/cachedata.js";
import RedisClient from "../service/redisconfig.js";
export const createCourse = asynchandler(async (req, res) => {
    const { title, description, duration, price, category, startDate, endDate } = req.body;

    const newCourse = await Course.create({
        title,
        description,
        duration,
        price,
        category,
        startDate,
        endDate,
        instructor: req.user._id,
    });
    cacheData.cacheCourses(newCourse);
    res.status(201).json({ message: "Course created", course: newCourse });

});

export const getCurrentCourses = asynchandler(async (req, res) => {
    // const courses = await Course.find().populate("instructor", "name email");
    const courses = await cacheData.getCurrentCachedCourses();
    res.json(courses);
});
export const getAllCourses = asynchandler(async (req, res) => {
    const courses = await cacheData.getAllCachedCourses();
    // console.log("All courses fetched from cache:", courses);
    res.json(courses);
})

export const enrollInCourse = asynchandler(async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    const course = await cacheData.getCachedCourse( "$", courseId);
    console.log("Course fetched from cache:", course);
    if (!course) throw new ApiError(404, "Course not found");

    if (course.students.map(String).includes(String(userId))) {
        return res.status(400).json({ message: "Already enrolled in this course" });
    }
    console.log("Enrolling user:", userId, "in course:", courseId);
    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $push: { students: userId } },
        { new: true }
    );
    console.log("Updated course after enrollment:", updatedCourse);

    if (!updatedCourse) throw new ApiError(500, "Failed to enroll in course");

    await RedisClient.call("JSON.SET", `course:${courseId}`, "$", JSON.stringify(updatedCourse));

    res.status(200).json({ message: "Enrolled in course successfully" });
});


export const getCoursesByUserId = asynchandler(async (req, res) => {
    const userId = req.params.userId;

    let courses;
    try {
        console.log("Fetching courses from cache for user:", userId);
        courses = await cacheData.getAllCachedCourses();
        console.log("Courses fetched from cache:", courses);
    } catch (err) {
        console.warn("Fallback to DB: ", err.message);
        courses = await Course.find({ students: userId }).populate("instructor", "name email");
        return res.json(courses);
    }

    // Filter from cache manually
    const filteredCourses = courses.filter(course =>
        course.students && course.students.includes(userId)
    );
    console.log("fil",filteredCourses);

    res.json(filteredCourses);
});

export const getCoursesByInstructorId = asynchandler(async (req, res) => {
    const instructorId = req.params.userId;

    let courses;
    try {
        courses = await cacheData.getAllCachedCourses(); 
    } catch (err) {
        console.warn("Fallback to DB: ", err.message);
        courses = await Course.find({ instructor: instructorId }).populate("instructor", "name");
        return res.json(courses);
    }

    const instructorCourses = courses.filter(course =>
        course.instructor == instructorId || course.instructor._id === instructorId
    );

    res.json(instructorCourses);
});

export const addContentToCourse = asynchandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, type, text } = req.body;
  
//   const course = await Course.findById(courseId);
    const course = await cacheData.getCachedCourse("$", courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const content = {
    title,
    type,
    text: type === "text" ? text : undefined,
    url: type !== "text" ? req.file.location : undefined, // if uploaded to S3/Cloudinary
  };

  course.content.push(content);
  await course.save();

  res.json({ message: "Content uploaded successfully", content });
});



