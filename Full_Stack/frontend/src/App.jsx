import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import CreateCourse from "./components/CreateCourse";
import Course from "./components/Course";
import CourseDetail from "./components/CourseDetail";
import Quiz from "./components/Quiz";
import DashboardEmp from "./components/DashboardEmp/DashboardEmp";
import Main from "./components/Admin/Main";
import Layout from "./components/Layout";
import Home from "./components/Home";
import AdminLayout from "./components/AdminLayout.jsx";
import Enrolled from "./components/DashboardEmp/Enrolled.jsx";
import SpentTime from "./components/DashboardEmp/SpentTime.jsx";
import Admin from "./components/Admin/Admin.jsx";
import UpdateCourse from "./components/Admin/UpdateCourse.jsx";
import axios from "axios";
import Feedback from "./components/DashboardEmp/Feedback.jsx";
import AdminFeedback from "./components/Admin/AdminFeedback.jsx";
function App() {
  const [user, setUser] = useState(null);
  
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };
  axios.interceptors.request.use(
    (config) => {
      config.headers = {
        ...config.headers,
        ...getAuthHeader(),
      };
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={user? <Layout />:<Login setUser={setUser} />}>
          <Route
            path="/"
            element={user ? <Home /> : <Login setUser={setUser} />}
          />
          <Route path="/courses" element={<Course />} />
          <Route path="/course/:id" element={<CourseDetail />} />
        </Route>

        <Route element={user? <AdminLayout />:<Login setUser={setUser} />}>
          <Route path="/dashboard" element={<DashboardEmp  />} />
          <Route path="/dashboard/enrolled" element={<Enrolled />} />
          <Route path="/dashboard/time" element={<SpentTime />} />
          <Route path="/dashboard/feedback" element={<Feedback />} />
        </Route>

        <Route path="/profile" element={<Profile />} />
        <Route path="/quiz/:courseID" element={<Quiz />} />
        <Route path="/update" element={<UpdateCourse />} />

        <Route element={user && user.Role === 'Admin' ? <AdminLayout Role={user.Role} /> : <Login setUser={setUser} />}>
          <Route path="/analysis" element={<Main />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/create" element={<CreateCourse />} />
          <Route path="/admin/feedback" element={<AdminFeedback/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
