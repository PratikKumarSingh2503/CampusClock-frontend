import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Classroom from "./pages/Classroom";
import ClassroomDetails from "./pages/ClassroomDetails";
import Community from "./pages/Community";
import CommunityDetails from "./pages/CommunityDetails";
import CalendarPage from "./pages/Calendar";
import Profile from "./pages/Profile";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import Users from "./pages/admin/Users";
import Classrooms from "./pages/admin/Classrooms";
import Communities from "./pages/admin/Communities";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ThemeProvider>
                <MainLayout />
              </ThemeProvider>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="classroom" element={<Classroom />} />
          <Route path="classroom/:id" element={<ClassroomDetails />} />
          <Route path="community" element={<Community />} />
          <Route path="/community/:id" element={<CommunityDetails />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/classrooms" element={<Classrooms />} />
          <Route path="/admin/communities" element={<Communities />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Layout from "./components/Layout";
// import Dashboard from "./pages/Dashboard";
// import Classroom from "./pages/Classroom";
// import Community from "./pages/Community";
// import Calendar from "./pages/Calendar";
// import Profile from "./pages/Profile";
// import ProtectedRoute from "./components/ProtectedRoute";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Landing />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/classroom" element={<Classroom />} />
//           <Route path="/community" element={<Community />} />
//           <Route path="/calendar" element={<Calendar />} />
//           <Route path="/profile" element={<Profile />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
