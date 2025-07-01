// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import Navbar from './components/Navbar';

// // Pages
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Courses from './pages/Courses';
// import CourseDetail from './pages/CourseDetail';
// import MyCourses from './pages/MyCourses';
// import Unauthorized from './pages/Unauthorized';

// // Instructor Pages
// import InstructorCourses from './pages/instructor/InstructorCourses';
// import CreateCourse from './pages/instructor/CreateCourse';

// // Admin Pages
// import AdminPanel from './pages/admin/AdminPanel';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="min-h-screen bg-gray-50">
//           <Navbar />
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/courses" element={<Courses />} />
//             <Route path="/courses/:id" element={<CourseDetail />} />
//             <Route path="/unauthorized" element={<Unauthorized />} />

//             {/* Protected Routes - Any authenticated user */}
//             <Route 
//               path="/my-courses" 
//               element={
//                 <ProtectedRoute>
//                   <MyCourses />
//                 </ProtectedRoute>
//               } 
//             />

//             {/* Instructor Only Routes */}
//             <Route 
//               path="/instructor/courses" 
//               element={
//                 <ProtectedRoute requiredRole="instructor">
//                   <InstructorCourses />
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/instructor/create-course" 
//               element={
//                 <ProtectedRoute requiredRole="instructor">
//                   <CreateCourse />
//                 </ProtectedRoute>
//               } 
//             />

//             {/* Admin Only Routes */}
//             <Route 
//               path="/admin" 
//               element={
//                 <ProtectedRoute requiredRole="admin">
//                   <AdminPanel />
//                 </ProtectedRoute>
//               } 
//             />
//           </Routes>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import MyCourses from './pages/MyCourses';
import CourseViewer from './pages/CourseViewer';
import Unauthorized from './pages/Unauthorized';

// Instructor Pages
import InstructorCourses from './pages/instructor/InstructorCourses';
import CreateCourse from './pages/instructor/CreateCourse';
import CourseContent from './pages/instructor/CourseContent';

// Admin Pages
import AdminPanel from './pages/admin/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes - Any authenticated user */}
            <Route 
              path="/my-courses" 
              element={
                <ProtectedRoute>
                  <MyCourses />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/course-viewer/:courseId" 
              element={
                <ProtectedRoute>
                  <CourseViewer />
                </ProtectedRoute>
              } 
            />

            {/* Instructor Only Routes */}
            <Route 
              path="/instructor/courses" 
              element={
                <ProtectedRoute requiredRole="instructor">
                  <InstructorCourses />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/create-course" 
              element={
                <ProtectedRoute requiredRole="instructor">
                  <CreateCourse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/courses/:courseId/content" 
              element={
                <ProtectedRoute requiredRole="instructor">
                  <CourseContent />
                </ProtectedRoute>
              } 
            />

            {/* Admin Only Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;