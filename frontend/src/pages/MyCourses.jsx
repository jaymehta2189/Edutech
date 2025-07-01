// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
// import api from '../utils/api'; // Adjust the import path as necessary
// import { 
//   BookOpen, 
//   Clock, 
//   Calendar, 
//   User,
//   Play,
//   CheckCircle
// } from 'lucide-react';

// const MyCourses = () => {
//   const { user } = useAuth();
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (user) {
//       fetchMyCourses();
//     }
//   }, [user]);

//   const fetchMyCourses = async () => {
//     try {
//       const response = await api.get(`/api/courses/user/${user._id}`);
//       setCourses(response.data);
//     } catch (error) {
//       console.error('Error fetching my courses:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">My Courses</h1>
//           <p className="text-gray-600">Continue your learning journey</p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {courses.length === 0 ? (
//           <div className="text-center py-12">
//             <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
//             <p className="text-gray-600 mb-6">Start your learning journey by enrolling in a course</p>
//             <Link
//               to="/courses"
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//             >
//               Browse Courses
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {courses.map((course) => (
//               <div key={course._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
//                 <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 relative">
//                   <div className="absolute top-4 left-4">
//                     <span className="bg-white text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                       Enrolled
//                     </span>
//                   </div>
//                   <div className="absolute top-4 right-4">
//                     <span className="bg-white text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                       {course.category}
//                     </span>
//                   </div>
//                   <div className="absolute bottom-4 left-4">
//                     <div className="bg-white bg-opacity-90 rounded-lg px-3 py-2">
//                       <div className="text-xs text-gray-600 mb-1">Progress</div>
//                       <div className="w-24 bg-gray-200 rounded-full h-2">
//                         <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
//                       </div>
//                       <div className="text-xs text-gray-600 mt-1">65% Complete</div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
//                     {course.title}
//                   </h3>
//                   <p className="text-gray-600 mb-4 line-clamp-3">
//                     {course.description}
//                   </p>
                  
//                   <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//                     <div className="flex items-center space-x-1">
//                       <User className="h-4 w-4" />
//                       <span>{course.instructor?.name || 'Instructor'}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <Clock className="h-4 w-4" />
//                       <span>{course.duration} hours</span>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
//                     <div className="flex items-center space-x-1">
//                       <Calendar className="h-4 w-4" />
//                       <span>Started {new Date(course.startDate).toLocaleDateString()}</span>
//                     </div>
//                   </div>

//                   <div className="flex space-x-3">
//                     <Link
//                       to={`/courses/${course._id}`}
//                       className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center flex items-center justify-center space-x-2"
//                     >
//                       <Play className="h-4 w-4" />
//                       <span>Continue</span>
//                     </Link>
//                     <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2">
//                       <CheckCircle className="h-4 w-4" />
//                       <span>Mark Complete</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyCourses;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  User,
  Play,
  CheckCircle,
  FileText
} from 'lucide-react';

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyCourses();
    }
  }, [user]);

  const fetchMyCourses = async () => {
    try {
      const response = await api.get(`/api/courses/user/${user._id}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching my courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Courses</h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
            <p className="text-gray-600 mb-6">Start your learning journey by enrolling in a course</p>
            <Link
              to="/courses"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 relative">
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Enrolled
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white bg-opacity-90 rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-600 mb-1">Progress</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">65% Complete</div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-white bg-opacity-90 rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-600 mb-1">Content</div>
                      <div className="text-sm font-semibold text-gray-900 flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        {course.content?.length || 0} lessons
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{course.instructor?.name || 'Instructor'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration} hours</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Started {new Date(course.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/course-viewer/${course._id}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center flex items-center justify-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Continue Learning</span>
                    </Link>
                    <Link
                      to={`/courses/${course._id}`}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;