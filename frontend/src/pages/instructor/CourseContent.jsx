import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api'; // Adjust the import path as necessary
import { 
  ArrowLeft, 
  Plus, 
  Upload, 
  Video, 
  Trash2,
  Edit,
  Calendar,
  Eye
} from 'lucide-react';

const CourseContent = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddContent, setShowAddContent] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [contentForm, setContentForm] = useState({
    title: '',
    file: null
  });

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/api/courses/instructor/${user._id}`);
      const foundCourse = response.data.find(c => c._id === courseId);
      
      // Check if user is the instructor of this course
      if (!foundCourse || (foundCourse.instructor !== user._id && foundCourse.instructor?._id !== user._id)) {
        navigate('/unauthorized');
        return;
      }
      
      setCourse(foundCourse);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setContentForm(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (!contentForm.file) {
        alert('Please select a video file to upload');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', contentForm.title);
      formData.append('type', 'video');
      formData.append('file', contentForm.file);

      await api.post(`/api/courses/${courseId}/content`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Video uploaded successfully!');
      setShowAddContent(false);
      setContentForm({
        title: '',
        file: null
      });
      fetchCourse(); // Refresh course data
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Course not found</h3>
          <button
            onClick={() => navigate('/instructor/courses')}
            className="text-blue-600 hover:text-blue-500"
          >
            Back to my courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/instructor/courses')}
            className="flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to my courses
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mt-2">Manage course videos and materials</p>
            </div>
            <button
              onClick={() => setShowAddContent(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Video</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{course.content?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{course.students?.length || 0}</div>
              <div className="text-sm text-gray-600">Enrolled Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{course.duration}</div>
              <div className="text-sm text-gray-600">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">₹{course.price}</div>
              <div className="text-sm text-gray-600">Price</div>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Course Videos</h2>
          </div>
          
          {!course.content || course.content.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos uploaded yet</h3>
              <p className="text-gray-600 mb-6">Start building your course by uploading video content</p>
              <button
                onClick={() => setShowAddContent(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Upload Your First Video</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {course.content.map((content, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Video className="h-6 w-6 text-red-500" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            VIDEO
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(content.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {content.url && (
                        <a
                          href={content.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Preview</span>
                        </a>
                      )}
                      <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors flex items-center space-x-1">
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors flex items-center space-x-1">
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Video Modal */}
      {showAddContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Upload New Video</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Video Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={contentForm.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter video title"
                />
              </div>

              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Video File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    accept="video/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="file"
                    className="cursor-pointer text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Click to upload video
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    MP4, AVI, MOV, WMV files supported
                  </p>
                  {contentForm.file && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {contentForm.file.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddContent(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Upload className="h-5 w-5" />
                  <span>{uploading ? 'Uploading...' : 'Upload Video'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseContent;