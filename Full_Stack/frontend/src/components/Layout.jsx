import { Outlet, Link, useNavigate } from "react-router-dom";
import "../style/layout.css"; // We'll create this CSS file for styling
import { useEffect, useState } from "react";

const Layout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">LearnSync</Link>
        </div>
        <ul className="navbar-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/courses">Courses</Link>
          </li>
          <li>
            <Link to="/dashboard/enrolled">Dashboard</Link>
          </li>
          {user && user.role == "ADMIN" && (
            <li>
              <Link to="/admin">Dashboard</Link>
            </li>
          )}
        </ul>
        <div className="navbar-user">
          <div>
            <Link to="/profile">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/006/487/917/small/man-avatar-icon-free-vector.jpg"
                alt=""
              />
            </Link>
          </div>
          <div onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout
          </div>
        </div>
      </nav>
      <main className="content">
        <Outlet /> {/* This is where nested routes will be rendered */}
      </main>
      {/* <footer className="footer">
        <p>&copy; 2024 Event Planner. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default Layout;
