import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const EngagementChart = ({ department }) => {
  const [timeChartData, setTimeChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Avg Time Spent (Seconds)",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  });

  const [scoreChartData, setScoreChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Avg Score",
        data: [0,20,40,60,80,100],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    const fetchEngagementData = async () => {
      try {
        const { data } = await axios.post(
          `http://localhost:4000/api/admin/analysis`,
          { department }
        );
        if (data.status === "success") {
          const teams = data.data;
          const labels = teams.map((team) => team.team);
          const avgTimeSpent = teams.map((team) => team.avgTimeSpent);
          const avgScore = teams.map((team) => team.avgScore);

          setTimeChartData((prevData) => ({
            ...prevData,
            labels,
            datasets: [
              {
                ...prevData.datasets[0],
                data: avgTimeSpent,
              },
            ],
          }));

          setScoreChartData((prevData) => ({
            ...prevData,
            labels,
            datasets: [
              {
                ...prevData.datasets[0],
                data: avgScore,
              },
            ],
          }));
        }
      } catch (error) {
        console.error("Error fetching engagement data", error);
      }
    };

    if (department) {
      fetchEngagementData();
    }
  }, [department]);

  return (
    <div>
      <div style={{ marginBottom: "30px" }}>
        <h3>Average Time Spent Of All Teams (Seconds)</h3>
        <Bar
          data={timeChartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
      <div>
        <h3>Average Score Of All Teams</h3>
        <Bar
          data={scoreChartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default EngagementChart;
