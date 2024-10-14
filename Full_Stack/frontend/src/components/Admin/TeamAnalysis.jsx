import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const TeamAnalysis = ({ department, team }) => {
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
        data: [],
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
          `http://localhost:4000/api/admin/analysis/team`,
          { department, team }
        );
        if (data.status === "success") {
          const labels = data.data.map(item => item.employeeName          ); // Assuming each item has a 'team' property
          const timeSpent = data.data.map(item => item.avgTimeSpent);
          const scores = data.data.map(item => item.avgScore);

          setTimeChartData((prevData) => ({
            ...prevData,
            labels, // Set labels for time chart
            datasets: [
              {
                ...prevData.datasets[0],
                data: timeSpent,
              },
            ],
          }));

          setScoreChartData((prevData) => ({
            ...prevData,
            labels, // Set labels for score chart
            datasets: [
              {
                ...prevData.datasets[0],
                data: scores,
              },
            ],
          }));
        }
      } catch (error) {
        console.error("Error fetching engagement data", error);
      }
    };

    if (department && team) {
      fetchEngagementData();
    }
  }, [department, team]);

  return (
    <div>
      <h2>Engagement Data</h2>
      <div style={{ marginBottom: "30px" }}>
        <h3>Average Time Spent Of Every Employee (Seconds)</h3>
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
        <h3>Average Score Of Every Employee</h3>
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

export default TeamAnalysis;
