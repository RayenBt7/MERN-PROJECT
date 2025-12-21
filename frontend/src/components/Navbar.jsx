import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="navbar-link">
          NeuroFlix
        </Link>
      </div>
      <div className="navbar-links">
        {token ? (
          <>
           
            <button onClick={handleLogout} className="navbar-logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
