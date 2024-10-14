import React, { useEffect, useState } from "react";
import axios from "axios";
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
import "../../style/DashboardEmp.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SpentTime = () => {
  const [timeSpentData, setTimeSpentData] = useState([]);
  const [user, setUser] = useState(null);


  // Fetch time spent data from the API
  const fetchTimeSpent = async (employeeId) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/dashboard/employee/spentTime",
        { employeeId }
      );
      setTimeSpentData(data.timeSpentPerCourse); // Set fetched data into state
    } catch (error) {
      console.error("Error fetching time spent:", error);
    }
  };

  useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
   
     if (storedUser) {
       setUser(storedUser);
     }
    fetchTimeSpent(storedUser.EmployeeID); // Fetch time spent for employeeId 1
  }, []);

  // Prepare data for vertical bar chart
  const chartData = {
    labels: timeSpentData.map((course) => course.courseName), // Course names as labels
    datasets: [
      {
        label: "Time Spent (Seconds)", // Label for the dataset
        data: timeSpentData.map((course) => course.totalTimeSpent/60), // Time spent data
        backgroundColor: "rgba(153, 102, 255, 0.6)", // Bar color
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          callback: function (value, index, values) {
            // Optionally truncate long names
            const label = this.getLabelForValue(value);
            return label.length > 10 ? `${label.slice(0, 20)}...` : label;
          },
        },
      },
      y: {
        beginAtZero: true, // Ensure the y-axis starts at 0
        ticks: {
          callback: function (value) {
            return `${value} min`; // Add "sec" suffix to y-axis labels
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Total Time Spent on Courses",
      },
    },
  };
  

  return (
    <div className="dashboard-emp">
      <h2>Time spent on Courses</h2>
      {timeSpentData.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p>Loading time spent data...</p>
      )}
    </div>
  );
};

export default SpentTime;
