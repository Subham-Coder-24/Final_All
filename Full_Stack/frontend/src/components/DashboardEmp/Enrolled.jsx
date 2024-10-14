import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../style/Enrolled.css";

const Enrolled = () => {
  const [employeeId, setemployeeId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setemployeeId(storedUser.EmployeeID);
    }
  }, []);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [score, setScore] = useState("");
  const [percentage, setPercentage] = useState("");

  // Fetch the enrolled courses and the time spent data
  const fetchTimeSpent = async (employeeId) => {
    if (employeeId) {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/dashboard/employee/spentTime",
          { employeeId }
        );
        setCourses(response.data.timeSpentPerCourse);
      } catch (error) {
        console.error("Error fetching time spent:", error);
      }
    }
  };
  const fetchPercentageAndScoreSingleCourse = async (employeeId, courseId) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/dashboard/employee/percentageAndScoreSingleCourse",
        {
          employeeId, // Pass the employeeId in the request body
          courseId, // Pass the courseId in the request body
        }
      );
      setScore(data.score);
      setPercentage(data.participationRate);
    } catch (error) {
      console.error("Error fetching percentage and score:", error);
      // Handle the error
    }
  };

  // Handle course click to select a course
  const handleCourseClick = (course) => {
    setSelectedCourse(course); // Set the selected course
    fetchPercentageAndScoreSingleCourse(employeeId, course.courseId);
  };

  useEffect(() => {
    fetchTimeSpent(employeeId);
  }, [employeeId]);

  // if (!courses.length) {
  //   return "No enrolled course found";
  // }

  return (
    <div className="enroll_main">
      <h1>All Enrolled Courses</h1>
      {!courses.length && <p>No enrolled course found </p>}
      <div className="course-list">
        {courses.map((course) => (
          <div
            key={course.courseId}
            className="course-item"
            onClick={() => handleCourseClick(course)}
          >
            <img
              src={course.CourseImage}
              alt={course.courseName}
              className="course-image"
            />
            <h3>{course.courseName.slice(0, 35)}...</h3>
          </div>
        ))}
      </div>

      {/* Show selected course details */}
      {selectedCourse && (
        <CourseDetails1
          score={score}
          percentage={percentage}
          course={selectedCourse}
        />
      )}
    </div>
  );
};

export default Enrolled;

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CourseDetails1 = ({ course, score, percentage }) => {
  // Prepare the data for the horizontal bar chart
  const truncateName = (name, maxLength = 15) => {
    return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
  };

  // Prepare the data for the horizontal bar chart
  const labels = course.engagements.map((engagement) =>
    truncateName(engagement.Module.ModuleName)
  );
  const timeSpentData = course.engagements.map(
    (engagement) => engagement.TimeSpent / 60
  );

  const data = {
    labels: labels, // Module names on the y-axis
    datasets: [
      {
        label: "Time Spent (min)",
        data: timeSpentData, // Time spent per module
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Bar color
        borderColor: "rgba(75, 192, 192, 1)", // Border color
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y", // This option makes the chart horizontal
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `${value} min`; // Append " min" to each tick label
          },
        },
      },
    },
  };

  return (
    <div className="course-details">
      <div className="chart-section">
        <h2>
          Time Spent on each Modules in course <em>"{course.courseName}"</em>
        </h2>
        <Bar data={data} options={options} />
      </div>
      <div className="">
        <div className="score-card">
          <h3>Participation Rates</h3>
          <div className="score-details">
            <h3>{percentage}%</h3>
          </div>
        </div>
        <div className="score-card">
          <h3>Score</h3>
          <div className="score-details">
            <h3>{score ? score : "N/A"}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
