import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/login.css";
import login from "../assets/login.jpg";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("Data"); // Default selected value for department
  const [team, setTeam] = useState("ETL"); // Default selected value for team

  const navigate = useNavigate();

  // Arrays for Departments and Teams
  const departments = [
    { value: "Data", label: "Data" },
    { value: "Engineering", label: "Engineering" },
    { value: "Sales", label: "Sales" },
    { value: "Human Resources", label: "Human Resources" },
  ];

  const teams = [
    { value: "Inside Sales Team", label: "Inside Sales Team" },
    { value: "Outside Sales Team", label: "Outside Sales Team" },
    { value: "Recruitment Team", label: "Recruitment Team" },
    { value: "Management Team", label: "Management Team" },
    { value: "Backend Development Team", label: "Backend Development Team" },
    { value: "Frontend Development Team", label: "Frontend Development Team" },
    { value: "ETL", label: "ETL" },
    { value: "Azure", label: "Azure" },
    { value: "ML/OPS", label: "ML/OPS" },
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/register",
        {
          email,
          password,
          name,
          department,  // Send selected department
          team,        // Send selected team
        }
      );
      console.log("Registration successful:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="LoginSignUpContainer">
      <img src={login} alt="" />
      <div className="login-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Dropdown for Department */}
          <div>
            <label>Department:</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown for Team */}
          <div>
            <label>Team:</label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              required
            >
              {teams.map((team) => (
                <option key={team.value} value={team.value}>
                  {team.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
