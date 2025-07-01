// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import axios from 'axios';
// import api from '../../utils/api'; // Adjust the import path as necessary
// import { 
//   BookOpen, 
//   Plus, 
//   Users, 
//   Clock, 
//   DollarSign,
//   Edit,
//   Trash2,
//   Eye
// } from 'lucide-react';

// const InstructorCourses = () => {
//   const { user } = useAuth();
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (user) {
//       fetchInstructorCourses();
//     }
//   }, [user]);

//   const fetchInstructorCourses = async () => {
//     try {
//       // Since your backend doesn't have a specific instructor courses endpoint,
//       // we'll fetch all courses and filter by instructor
//       const response = await api.get('/api/courses/all');
//       const instructorCourses = response.data.filter(course => 
//         course.instructor === user._id || course.instructor?._id === user._id
//       );
//       setCourses(instructorCourses);
//     } catch (error) {
//       console.error('Error fetching instructor courses:', error);
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
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-4">My Teaching</h1>
//               <p className="text-gray-600">Manage your courses and track student progress</p>
//             </div>
//             <Link
//               to="/instructor/create-course"
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
//             >
//               <Plus className="h-5 w-5" />
//               <span>Create New Course</span>
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <BookOpen className="h-8 w-8 text-blue-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Courses</p>
//                 <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <Users className="h-8 w-8 text-green-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Students</p>
//                 <p className="text-2xl font-semibold text-gray-900">
//                   {courses.reduce((total, course) => total + (course.students?.length || 0), 0)}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <DollarSign className="h-8 w-8 text-yellow-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//                 <p className="text-2xl font-semibold text-gray-900">
//                   ₹{courses.reduce((total, course) => total + (course.price * (course.students?.length || 0)), 0).toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <Clock className="h-8 w-8 text-purple-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Hours</p>
//                 <p className="text-2xl font-semibold text-gray-900">
//                   {courses.reduce((total, course) => total + course.duration, 0)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {courses.length === 0 ? (
//           <div className="text-center py-12">
//             <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses created yet</h3>
//             <p className="text-gray-600 mb-6">Start sharing your knowledge by creating your first course</p>
//             <Link
//               to="/instructor/create-course"
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
//             >
//               <Plus className="h-5 w-5" />
//               <span>Create Your First Course</span>
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {courses.map((course) => (
//               <div key={course._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
//                 <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 relative">
//                   <div className="absolute top-4 left-4">
//                     <span className="bg-white text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                       {course.category}
//                     </span>
//                   </div>
//                   <div className="absolute top-4 right-4">
//                     <span className="bg-white text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                       Active
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
//                     {course.title}
//                   </h3>
//                   <p className="text-gray-600 mb-4 line-clamp-3">
//                     {course.description}
//                   </p>
                  
//                   <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
//                     <div className="flex items-center space-x-1 text-gray-600">
//                       <Users className="h-4 w-4" />
//                       <span>{course.students?.length || 0} students</span>
//                     </div>
//                     <div className="flex items-center space-x-1 text-gray-600">
//                       <Clock className="h-4 w-4" />
//                       <span>{course.duration} hours</span>
//                     </div>
//                     <div className="flex items-center space-x-1 text-green-600 font-semibold">
//                       <DollarSign className="h-4 w-4" />
//                       <span>₹{course.price}</span>
//                     </div>
//                     <div className="text-gray-600">
//                       Revenue: ₹{(course.price * (course.students?.length || 0)).toLocaleString()}
//                     </div>
//                   </div>

//                   <div className="flex space-x-2">
//                     <Link
//                       to={`/courses/${course._id}`}
//                       className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center flex items-center justify-center space-x-1"
//                     >
//                       <Eye className="h-4 w-4" />
//                       <span>View</span>
//                     </Link>
//                     <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-1">
//                       <Edit className="h-4 w-4" />
//                       <span>Edit</span>
//                     </button>
//                     <button className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center space-x-1">
//                       <Trash2 className="h-4 w-4" />
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

// export default InstructorCourses;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api'; // Adjust the import path as necessary
import { 
  BookOpen, 
  Plus, 
  Users, 
  Clock, 
  DollarSign,
  Edit,
  Trash2,
  Eye,
  FileText,
  Settings
} from 'lucide-react';

const InstructorCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInstructorCourses();
    }
  }, [user]);

  const fetchInstructorCourses = async () => {
    try {
      // Since your backend doesn't have a specific instructor courses endpoint,
      // we'll fetch all courses and filter by instructor
      const response = await api.get(`/api/courses/instructor/${user._id}`);
      console.log('Fetched courses:', response);
      const instructorCourses = response.data.filter(course => 
        course.instructor === user._id || course.instructor?._id === user._id
      );
      setCourses(instructorCourses);
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">My Teaching</h1>
              <p className="text-gray-600">Manage your courses and track student progress</p>
            </div>
            <Link
              to="/instructor/create-course"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Course</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {courses.reduce((total, course) => total + (course.students?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{courses.reduce((total, course) => total + (course.price * (course.students?.length || 0)), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {courses.reduce((total, course) => total + course.duration, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses created yet</h3>
            <p className="text-gray-600 mb-6">Start sharing your knowledge by creating your first course</p>
            <Link
              to="/instructor/create-course"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Course</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 relative">
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white bg-opacity-90 rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-600 mb-1">Content</div>
                      <div className="text-sm font-semibold text-gray-900">
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
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{course.students?.length || 0} students</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration} hours</span>
                    </div>
                    <div className="flex items-center space-x-1 text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4" />
                      <span>₹{course.price}</span>
                    </div>
                    <div className="text-gray-600">
                      Revenue: ₹{(course.price * (course.students?.length || 0)).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/courses/${course._id}`}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center flex items-center justify-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Link>
                    <Link
                      to={`/instructor/courses/${course._id}/content`}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-1"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Content</span>
                    </Link>
                    <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-1">
                      <Settings className="h-4 w-4" />
                    </button>
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

export default InstructorCourses;