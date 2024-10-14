import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import "../style/adminlayout.css";

const AdminLayout = ({ Role = "User" }) => {
  const [activeLink, setActiveLink] = useState("/admin");

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <>
      {Role && Role === "Admin" ? (
        <div className="admin-layout">
          <button className="go_back">
            <Link to="/">Go Back</Link>
          </button>
          <div className="sidebar">
            <h1 className="admin">Admin Dashboard</h1>
            <ul>
              <li>
                <Link
                  to="/admin"
                  className={activeLink === "/admin" ? "active" : ""}
                  onClick={() => handleLinkClick("/admin")}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/analysis"
                  className={activeLink === "/analysis" ? "active" : ""}
                  onClick={() => handleLinkClick("/analysis")}
                >
                  Analysis
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className={activeLink === "/create" ? "active" : ""}
                  onClick={() => handleLinkClick("/create")}
                >
                  Create
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/feedback"
                  className={activeLink === "/admin/feedback" ? "active" : ""}
                  onClick={() => handleLinkClick("/admin/feedback")}
                >
                  Feedback
                </Link>
              </li>
            </ul>
          </div>
          <div className="dashboard_main_layout">
            <Outlet /> {/* This is where nested routes will be rendered */}
          </div>
        </div>
      ) : (
        <div className="admin-layout">
          <button className="go_back">
            <Link to="/">Go Back</Link>
          </button>
          <div className="sidebar">
            <h1 className="admin">User Dashboard</h1>
            <ul>
              <li>
                <Link
                  to="/dashboard/enrolled"
                  className={
                    activeLink === "/dashboard/enrolled" ? "active" : ""
                  }
                  onClick={() => handleLinkClick("/dashboard/enrolled")}
                >
                  Enrolled
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className={activeLink === "/dashboard" ? "active" : ""}
                  onClick={() => handleLinkClick("/dashboard")}
                >
                  Participation Rates
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/time"
                  className={activeLink === "/dashboard/time" ? "active" : ""}
                  onClick={() => handleLinkClick("/dashboard/time")}
                >
                  Time Spent
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/feedback"
                  className={
                    activeLink === "/dashboard/feedback" ? "active" : ""
                  }
                  onClick={() => handleLinkClick("/dashboard/feedback")}
                >
                  Feedback
                </Link>
              </li>
            </ul>
          </div>
          <div className="dashboard_main_layout">
            <Outlet /> {/* This is where nested routes will be rendered */}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLayout;
