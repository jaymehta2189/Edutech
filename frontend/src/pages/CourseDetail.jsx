import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import api from '../utils/api'; // Adjust the import based on your API setup
import { 
  Clock, 
  DollarSign, 
  Star, 
  Users, 
  Calendar,
  BookOpen,
  User,
  MessageCircle,
  Send,
  ArrowLeft,
  CreditCard,
  ShoppingCart
} from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [askingAI, setAskingAI] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await api.get('/api/courses/all');
      const foundCourse = response.data.find(c => c._id === id);
      setCourse(foundCourse);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollFree = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/api/courses/enroll/${id}`);
      alert('Successfully enrolled in the course!');
      fetchCourse();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll in course');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await api.post(`/api/courses/enroll/${id}`);
      alert('Payment successful! You are now enrolled in the course.');
      fetchCourse();
    } catch (error) {
      console.error('Error enrolling after payment:', error);
      alert('Payment successful but enrollment failed. Please contact support.');
    }
  };

  const handleAskAI = async () => {
    if (!question.trim()) return;

    setAskingAI(true);
    try {
      const response = await api.post(`/api/ai/ask/${id}`, { question });
      setAiResponse(response.data.answer);
    } catch (error) {
      setAiResponse('Sorry, I could not process your question at the moment.');
    } finally {
      setAskingAI(false);
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
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Course not found</h3>
          <button
            onClick={() => navigate('/courses')}
            className="text-blue-600 hover:text-blue-500"
          >
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  const isEnrolled = course.students?.includes(user?._id);
  const isFree = course.price === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to courses
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Course Header */}
              <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                <div className="absolute top-6 left-6">
                  <span className="bg-white text-blue-800 text-sm font-medium px-3 py-1 rounded">
                    {course.category}
                  </span>
                </div>
                <div className="absolute top-6 right-6">
                  <div className="flex items-center space-x-1 bg-white rounded px-3 py-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-700 font-medium">4.8</span>
                  </div>
                </div>
                {isFree && (
                  <div className="absolute bottom-6 left-6">
                    <span className="bg-green-500 text-white text-sm font-medium px-3 py-1 rounded">
                      FREE COURSE
                    </span>
                  </div>
                )}
              </div>

              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {course.title}
                </h1>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>By {course.instructor?.name || 'Instructor'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration} hours</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students?.length || 0} students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(course.startDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="prose max-w-none mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">About this course</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-900">Start Date:</span>
                      <span className="ml-2 text-gray-700">
                        {new Date(course.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">End Date:</span>
                      <span className="ml-2 text-gray-700">
                        {new Date(course.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Duration:</span>
                      <span className="ml-2 text-gray-700">{course.duration} hours</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Category:</span>
                      <span className="ml-2 text-gray-700">{course.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
                Ask about this course
              </h3>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask any question about this course..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                  />
                  <button
                    onClick={handleAskAI}
                    disabled={askingAI || !question.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{askingAI ? 'Asking...' : 'Ask'}</span>
                  </button>
                </div>
                
                {aiResponse && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-900">{aiResponse}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="text-center mb-6">
                {isFree ? (
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    FREE
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ₹{course.price}
                  </div>
                )}
                <p className="text-gray-600">
                  {isFree ? 'Free course' : 'One-time payment'}
                </p>
              </div>

              {user ? (
                isEnrolled ? (
                  <div className="text-center">
                    <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-4">
                      ✓ You are enrolled in this course
                    </div>
                    <button 
                      onClick={() => navigate(`/course-viewer/${course._id}`)}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Continue Learning
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {isFree ? (
                      <button
                        onClick={handleEnrollFree}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <BookOpen className="h-5 w-5" />
                        <span>Enroll for Free</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <CreditCard className="h-5 w-5" />
                        <span>Buy Now</span>
                      </button>
                    )}
                  </div>
                )
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Login to Enroll
                </button>
              )}

              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-gray-900">This course includes:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    {course.duration} hours of content
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                    Comprehensive curriculum
                  </li>
                  <li className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-600" />
                    Community access
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-blue-600" />
                    Certificate of completion
                  </li>
                </ul>
              </div>

              {!isFree && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-800">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-sm font-medium">30-day money-back guarantee</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        course={course}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CourseDetail;