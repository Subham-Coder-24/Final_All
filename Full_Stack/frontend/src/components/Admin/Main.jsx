import  { useState, useEffect } from "react";
import axios from "axios";
import EngagementChart from "./EngagementChart";
import TeamAnalysis from "./TeamAnalysis";
import "../../style/Main.css"
const Main = () => {
  const [departments, setDepartments] = useState([]); // Store all departments
  const [teams, setTeams] = useState([]); // Store teams based on selected department
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Store the selected department
  const [selectedTeam, setSelectedTeam] = useState(""); // Store the selected team

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/admin/deparments"
        );
        setDepartments(data.data); // Set the array of department objects
      } catch (error) {
        console.error("Error fetching departments", error);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch teams when a department is selected
  useEffect(() => {
    if (selectedDepartment) {
      const selectedDept = departments.find(
        (dept) => dept.department === selectedDepartment
      );
      if (selectedDept) {
        setTeams(selectedDept.teams);
      }
    }
  }, [selectedDepartment, departments]);

  // Handle department selection
  const handleDepartmentChange = async (event) => {
    setSelectedDepartment(event.target.value);
    setSelectedTeam(""); // Reset team selection when department changes
  };

  // Handle team selection and perform another API call when both department and team are selected
  const handleTeamChange = async (event) => {
    const team = event.target.value;
    setSelectedTeam(team);
  };

  return (
    <div className="dropdown-container-parent">
      <h2>Select Department and Team</h2>
  
      {/* Dropdown Container with Flexbox */}
      <div className="dropdown-container">
        {/* Department Dropdown */}
        <div className="dropdown-item">
          <label htmlFor="department">Department: </label>
          <select
            id="department"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
          >
            <option value="">Select a department</option>
            {departments.map((dept) => (
              <option key={dept.department} value={dept.department}>
                {dept.department}
              </option>
            ))}
          </select>
        </div>
  
        {/* Team Dropdown (Appears only when a department is selected) */}
        {selectedDepartment && (
          <div className="dropdown-item">
            <label htmlFor="team">Team: </label>
            <select id="team" value={selectedTeam} onChange={handleTeamChange}>
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
  
      {/* Dashboard Section (Appears below the dropdowns) */}
      <div className="dashboard-section">
        {!selectedTeam && selectedDepartment && (
          <EngagementChart department={selectedDepartment} />
        )}
        {selectedTeam && (
          <TeamAnalysis department={selectedDepartment} team={selectedTeam} />
        )}
      </div>
    </div>
  );
  
};

export default Main;
