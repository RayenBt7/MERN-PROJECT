/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";

export default function Profile() {
  const { user, token, login } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [userStats, setUserStats] = useState({ moviesWatched: 0, favoriteGenre: "N/A" });
  const navigate = useNavigate();

  // Redirection si admin essaie de visiter /profile
  useEffect(() => {
    if (user?.isAdmin) {
      navigate("/admin");
      return;
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const res = await axios.get("/movies", { headers: { Authorization: `Bearer ${token}` } });
      const movies = res.data;
      setUserStats({
        moviesWatched: movies.length,
        favoriteGenre: getFavoriteGenre(movies),
      });
    } catch (err) {
      console.error("Error fetching user stats:", err);
    }
  };

  const getFavoriteGenre = (movies) => {
    const genreCount = {};
    movies.forEach(movie => {
      genreCount[movie.category] = (genreCount[movie.category] || 0) + 1;
    });
    return Object.keys(genreCount).reduce((a, b) => genreCount[a] > genreCount[b] ? a : b, "N/A");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/users/profile", { username, email }, { headers: { Authorization: `Bearer ${token}` } });
      login(res.data.user, token);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating profile");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!user) return (
    <div className="profile-container">
      <div className="profile-header"><h2 className="profile-title">Loading...</h2></div>
    </div>
  );

  return (
    <div className="profile-container">
      <Link to="/" className="back-btn">← Back to Home</Link>
      <div className="profile-header">
        <div className="profile-avatar">{user.username.charAt(0).toUpperCase()}</div>
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">Manage your NeuroFlix account</p>
      </div>
      <div className="profile-content">
        <div className="profile-card">
          <h3>Account Information</h3>
          {message && <p className={`profile-message ${message.includes("success") ? "success" : "error"}`}>{message}</p>}
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="profile-input-group">
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="profile-input" />
            </div>
            <div className="profile-input-group">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="profile-input" />
            </div>
            <button type="submit" className="profile-btn">Update Profile</button>
          </form>
        </div>

        <div className="profile-card">
          <h3>Viewing Statistics</h3>
          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-number">{userStats.moviesWatched}</div>
              <div className="stat-label">Movies Watched</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{userStats.favoriteGenre}</div>
              <div className="stat-label">Favorite Genre</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
