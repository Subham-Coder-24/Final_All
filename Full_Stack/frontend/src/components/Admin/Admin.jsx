import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../style/Dashboard.css"; // Add a custom CSS file for styling the cards
import video from "../../assets/admin.mp4";
const Admin = () => {
  const [totals, setTotals] = useState({
    totalEmployees: 0,
    totalTeams: 0,
    totalDepartments: 0,
    totalCourses: 0,
  });

  const fetchTotals = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/admin/card");
      if (data.status === "success") {
        setTotals(data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard totals", error);
    }
  };

  useEffect(() => {
    fetchTotals();
  }, []);

  return (
    <div className="admin_card">
      <div className="parent_card">
        <div className="card">
          <h3>Total Employees</h3>
          <p>{totals.totalEmployees}</p>
        </div>
        <div className="card">
          <h3>Total Teams</h3>
          <p>{totals.totalTeams}</p>
        </div>
        <div className="card">
          <h3>Total Departments</h3>
          <p>{totals.totalDepartments}</p>
        </div>
        <div className="card">
          <h3>Total Courses</h3>
          <p>{totals.totalCourses}</p>
        </div>
      </div>
      <video width="600" height="500" autoPlay muted loop>
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Admin;
