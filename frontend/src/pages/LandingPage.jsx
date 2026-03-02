import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="landing-page">
        <div className="landing-overlay">
          <div className="landing-content">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <div className="landing-overlay">
        <div className="landing-content">
          <h1>Bienvenue sur NeuroFlix</h1>
          <p>Regardez vos films et séries préférés</p>
          <div className="landing-buttons">
            <button className="btn-login" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn-signup" onClick={() => navigate("/login")}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
