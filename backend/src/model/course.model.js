import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    content: [
    {
      title: String,
      type: {
        type: String, // "video", "pdf", "text"
        enum: ['video', 'pdf', 'text'],
        required: true
      },
      url: String, // S3, Cloudinary, etc.
    //   text: String, // For plain text
      uploadedAt: { type: Date, default: Date.now },
    }
  ]
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);
export default Course;
