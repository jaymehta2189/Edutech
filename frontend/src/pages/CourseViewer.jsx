import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api'; // Adjust the import path as necessary
import { 
  ArrowLeft, 
  Play, 
  Video, 
  Lock,
  BookOpen,
  User,
  Calendar
} from 'lucide-react';

const CourseViewer = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  const [videoKey, setVideoKey] = useState(0); // Key to force video re-render

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  // Update video key when selected content changes to force re-render
  useEffect(() => {
    if (selectedContent) {
      setVideoKey(prev => prev + 1);
    }
  }, [selectedContent]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/api/courses/user/${user._id}`);
      const foundCourse = response.data.find(c => c._id === courseId);
      
      // Check if user is enrolled in this course
      if (!foundCourse || !foundCourse.students?.includes(user._id)) {
        navigate('/unauthorized');
        return;
      }
      
      setCourse(foundCourse);
      
      // Set first content as selected by default
      if (foundCourse.content && foundCourse.content.length > 0) {
        setSelectedContent(foundCourse.content[0]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentSelect = (content) => {
    setSelectedContent(content);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-4">You need to be enrolled in this course to view its content.</p>
          <button
            onClick={() => navigate('/courses')}
            className="text-blue-600 hover:text-blue-500"
          >
            Browse courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/my-courses')}
              className="flex items-center text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to my courses
            </button>
            <div className="text-sm text-gray-600">
              {course.content?.length || 0} videos available
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Content Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-6">
              <div className="px-6 py-4 bg-blue-600 text-white">
                <h2 className="text-lg font-semibold">Course Videos</h2>
                <p className="text-blue-100 text-sm">{course.content?.length || 0} videos</p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {!course.content || course.content.length === 0 ? (
                  <div className="p-6 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No videos available yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {course.content.map((content, index) => (
                      <button
                        key={index}
                        onClick={() => handleContentSelect(content)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedContent === content ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Video className="h-5 w-5 text-red-500" />
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                              {content.title}
                            </h3>
                            <p className="text-xs text-gray-500">Video {index + 1}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {selectedContent ? (
                <>
                  {/* Content Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">{selectedContent.title}</h1>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Video className="h-4 w-4 text-red-500" />
                            <span>Video</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(selectedContent.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Video Player */}
                  <div className="p-6">
                    {selectedContent.url ? (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                          key={videoKey} // Force re-render when content changes
                          controls
                          className="w-full h-full"
                          poster="/api/placeholder/800/450"
                        >
                          <source src={selectedContent.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Video not available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to {course.title}</h3>
                  <p className="text-gray-600 mb-6">Select a video from the sidebar to start learning</p>
                  <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
                    <div className="flex items-center space-x-3 mb-4">
                      <User className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Instructor: {course.instructor?.name || 'Course Instructor'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Video className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {course.content?.length || 0} videos available
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;