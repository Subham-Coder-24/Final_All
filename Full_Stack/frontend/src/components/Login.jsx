// pages/Login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/login.css";
import login from "../assets/login.jpg";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const config = {
    // withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password); // Debugging line
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/login",
        {
          email,
          password,
        },
        config
      );
      const { user, token } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      if (setUser) {
        setUser(user);
      }
      if(user?.Role=='Admin'){
        navigate("/admin");
      }else{
        navigate("/")
      }

      
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="LoginSignUpContainer">
      <img src={login} alt="" />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
