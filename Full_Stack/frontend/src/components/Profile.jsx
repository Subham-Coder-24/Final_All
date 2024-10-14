import axios from 'axios';
import React, { useState, useEffect } from 'react';

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

function App() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const config = {
    headers: getAuthHeader(),
  };
  useEffect(() => {
    // Fetch the user profile when the component mounts using Axios
    axios.get('http://localhost:4000/api/users/profile',config)
      .then((response) => {
        setProfile(response.data); // Store profile data in state
      })
      .catch((error) => {
        setError(error.response ? error.response.data.message : error.message); // Handle any errors
      });
  }, []); // Empty array means this runs only once, when the component mounts

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      {/* <h2>{profile.username}</h2>
      <p>Email: {profile.email}</p> */}
      {/* Add more fields as per your API response */}
    </div>
  );
}

export default App;
