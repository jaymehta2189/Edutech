// // controller/ai.controller.js
// import { OpenAI } from "openai";
// import Course from "../model/course.model.js";
// import ApiError from "../util/ApiError.js";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export const askAboutCourse = async (req, res, next) => {
//     const { courseId } = req.params;
//     const { question } = req.body;
//     console.log("Received question:", question, "for course ID:", courseId);
//     try {
//         const course = await Course.findById(courseId);
//         console.log("Course fetched from database:", course);
//         if (!course) throw new ApiError(404, "Course not found");
//         const context = `
//             You are an AI assistant helping users understand online courses and decide if a course is right for them.

//             Here is the course information:
//             - Title: ${course.title}
//             - Description: ${course.description}
//             - Instructor ID: ${course.instructor}
//             - Duration: ${course.duration} hours
//             - Price: ₹${course.price}
//             - Category: ${course.category}
//             - Start Date: ${new Date(course.startDate).toDateString()}
//             - End Date: ${new Date(course.endDate).toDateString()}

//             The user is asking:
//             "${question}"

//             Answer in a helpful, friendly, and clear way.
//             If it's about prerequisites or course level, base it only on the given description.
//             If it’s unrelated, politely mention that you can only answer based on this course info.
//             Limit the response to 3-5 sentences.
//             `;
//         console.log("Context for OpenAI:", context);
//         const response = await openai.chat.completions.create({
//             model: "gpt-4o",
//             messages: [
//                 { role: "system", content: "You are a helpful course assistant." },
//                 { role: "user", content: context }
//             ],
//             temperature: 0.7,
//         });
//         console.log("OpenAI response:", response);

//         const answer = response.choices[0].message.content;
//         res.json({ answer });

//     } catch (err) {
//     console.error("OpenAI error:", err.response?.data || err.message || err);
//         next(err);
//     }
// };


// controller/ai.controller.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import Course from "../model/course.model.js";
import ApiError from "../util/ApiError.js";

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askAboutCourseGemini = async (req, res, next) => {
    const { courseId } = req.params;
    const { question } = req.body;
    console.log("Received question:", question, "for course ID:", courseId);
    
    try {
        const course = await Course.findById(courseId);
        console.log("Course fetched from database:", course);
        if (!course) throw new ApiError(404, "Course not found");

        const context = `
You are an AI assistant helping users understand online courses and decide if a course is right for them.

Here is the course information:
- Title: ${course.title}
- Description: ${course.description}
- Instructor ID: ${course.instructor}
- Duration: ${course.duration} hours
- Price: ₹${course.price}
- Category: ${course.category}
- Start Date: ${new Date(course.startDate).toDateString()}
- End Date: ${new Date(course.endDate).toDateString()}

The user is asking:
"${question}"

Answer in a helpful, friendly, and clear way.
If it's about prerequisites or course level, base it only on the given description.
If it's unrelated, politely mention that you can only answer based on this course info.
Limit the response to 3-5 sentences.
        `;

        console.log("Context for Gemini:", context);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(context);
        const response = await result.response;
        const answer = response.text();

        console.log("Gemini response:", answer);
        res.json({ answer });

    } catch (err) {
        console.error("Gemini error:", err.response?.data || err.message || err);
        next(err);
    }
};
