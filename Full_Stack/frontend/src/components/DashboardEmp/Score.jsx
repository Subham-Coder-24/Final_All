import { useEffect, useState } from "react";
import axios from "axios";
import "../../style/DashboardEmp.css"; // Adjust the path as needed

const CourseScoreTable = () => {
  const [scoreData, setScoreData] = useState([]);

  const fetchScore = async (employeeId) => {
    try {
      const response = await axios.post('http://localhost:4000/api/dashboard/employee/score', { EmployeeID: employeeId });
      const scores = response.data.data;
      setScoreData(scores);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    fetchScore(storedUser.EmployeeID);
  }, []);

  return (
    <div className="score-table">
      <h2>Course Quiz Scores</h2>
      {scoreData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Score (Out of 100)</th>
            </tr>
          </thead>
          <tbody>
            {scoreData.map((course) => (
              <tr key={course.CourseID}>
                <td>{course.CourseID}</td>
                <td>{course.CourseName}</td>
                <td>{course.QuizScore !== null ? course.QuizScore : "Not Taken"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading score data...</p>
      )}
    </div>
  );
};

export default CourseScoreTable;
