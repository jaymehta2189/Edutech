import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  ArrowLeft, 
  Play, 
  FileText, 
  Video, 
  FileIcon,
  Download,
  Clock,
  CheckCircle,
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
  const [completedContent, setCompletedContent] = useState(new Set());

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

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

  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'pdf':
        return <FileIcon className="h-5 w-5 text-blue-500" />;
      case 'text':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAsCompleted = (contentIndex) => {
    setCompletedContent(prev => new Set([...prev, contentIndex]));
  };

  const calculateProgress = () => {
    if (!course?.content || course.content.length === 0) return 0;
    return Math.round((completedContent.size / course.content.length) * 100);
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
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Progress: {calculateProgress()}%
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
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
                <h2 className="text-lg font-semibold">Course Content</h2>
                <p className="text-blue-100 text-sm">{course.content?.length || 0} lessons</p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {!course.content || course.content.length === 0 ? (
                  <div className="p-6 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No content available yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {course.content.map((content, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedContent(content)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedContent === content ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getContentIcon(content.type)}
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                {content.title}
                              </h3>
                              <p className="text-xs text-gray-500 capitalize">{content.type}</p>
                            </div>
                          </div>
                          {completedContent.has(index) && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
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
                            {getContentIcon(selectedContent.type)}
                            <span className="capitalize">{selectedContent.type}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(selectedContent.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => markAsCompleted(course.content.indexOf(selectedContent))}
                        disabled={completedContent.has(course.content.indexOf(selectedContent))}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                          completedContent.has(course.content.indexOf(selectedContent))
                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>
                          {completedContent.has(course.content.indexOf(selectedContent)) 
                            ? 'Completed' 
                            : 'Mark Complete'
                          }
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Content Display */}
                  <div className="p-6">
                    {selectedContent.type === 'text' && (
                      <div className="prose max-w-none">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {selectedContent.text}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedContent.type === 'video' && selectedContent.url && (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                          controls
                          className="w-full h-full"
                          poster="/api/placeholder/800/450"
                        >
                          <source src={selectedContent.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}

                    {selectedContent.type === 'pdf' && selectedContent.url && (
                      <div className="text-center py-12">
                        <FileIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Document</h3>
                        <p className="text-gray-600 mb-6">Click below to view or download the PDF</p>
                        <div className="flex justify-center space-x-4">
                          <a
                            href={selectedContent.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                          >
                            <Play className="h-5 w-5" />
                            <span>View PDF</span>
                          </a>
                          <a
                            href={selectedContent.url}
                            download
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center space-x-2"
                          >
                            <Download className="h-5 w-5" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to {course.title}</h3>
                  <p className="text-gray-600 mb-6">Select a lesson from the sidebar to start learning</p>
                  <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
                    <div className="flex items-center space-x-3 mb-4">
                      <User className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Instructor: {course.instructor?.name || 'Course Instructor'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Duration: {course.duration} hours
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