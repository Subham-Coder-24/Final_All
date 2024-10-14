import  { useEffect, useState } from "react";
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

const ParticipationRates = () => {
  const [participationRates, setParticipationRates] = useState([]);
console.log(participationRates);

  const fetchParticipationPercentage = async (employeeId) => {

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/dashboard/employee/participationPercetage",
        {
          employeeId,
        }
      );
      // console.log(data.participationRates);

      setParticipationRates(data.participationRates); // Set fetched data into state
    } catch (error) {
      console.error("Error calculating participation percentage:", error);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    fetchParticipationPercentage(storedUser.EmployeeID); // Fetch participation for employeeId 1
  
  }, []);

  // Prepare data for horizontal bar chart
  const chartData = {
    labels: participationRates.map((course) => {
      // Truncate course name and add ellipsis if necessary
      return course.courseName.length > 20 
        ? `${course.courseName.slice(0, 20)}...` 
        : course.courseName;
    }), // Course names as labels// Course names as labels
    datasets: [
      {
        label: "Participation Percentage",
        data: participationRates.map((course) => course.participationRate), // Participation percentages as data
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar color
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y", // Set indexAxis to 'y' to make it horizontal
    scales: {
      x: {
        beginAtZero: true, // Ensure the x-axis starts at 0
        max: 100, // Maximum value for percentage
      },
      y: {
        barPercentage: 0.1, // Adjust this value to reduce the width of the bars (0.5 is 50% of available space)
        categoryPercentage: 0.1, // Adjust this value for overall category width (0.5 is 50% of available space)
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Employee Course Participation",
      },
    },
  };

  return (
    <div className="dashboard-emp">
      <h2>Participation Rates</h2>
      {participationRates.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p>Loading participation data...</p>
      )}
    </div>
  );
};

export default ParticipationRates;
