import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaBars,
  FaTimes,
  FaFilter,
  FaTimesCircle,
} from "react-icons/fa";
import "../styles/home.css";
import MovieHero from "../components/MovieHero";

const COMMON_CATEGORIES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime",
  "Documentary", "Drama", "Family", "Fantasy", "Horror",
  "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"
];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);

  const videoPlayerRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vous devez vous connecter pour voir les films");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("/movies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMovies(res.data);
        setError("");
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        } else {
          setError("Erreur lors de la récupération des films");
        }
      }
    };

    fetchMovies();
  }, [navigate, logout]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredMovies =
    selectedCategories.length === 0
      ? movies
      : movies.filter((m) => selectedCategories.includes(m.category));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openVideoPlayer = (movie) => {
    setSelectedMovie(movie);
    setIsVideoPlayerOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeVideoPlayer = () => {
    setIsVideoPlayerOpen(false);
    setSelectedMovie(null);
    document.body.style.overflow = "unset";
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
      videoPlayerRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (!isVideoPlayerOpen) return;
    const handleEscape = (e) => e.key === "Escape" && closeVideoPlayer();
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isVideoPlayerOpen]);

  if (error) {
    return (
      <div className="error-container">
        <h2 className="error-message">{error}</h2>
        <button onClick={() => navigate("/login")} className="login-btn">
          Login maintenant
        </button>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Sidebar */}
      <div
        className={`sidebar ${sidebarOpen ? "open" : ""} ${
          sidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <div className="sidebar-header">
          <h2>NeuroFlix</h2>
          <button
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>

        <button className="profile-btn" onClick={() => navigate("/profile")}>
          <FaUser /> My Profile
        </button>

        <ul>
          <li>
            <a href="#home" onClick={(e) => e.preventDefault()}>
              <FaHome /> Home
            </a>
          </li>
          <li>
            <a href="#settings" onClick={(e) => e.preventDefault()}>
              <FaCog /> Settings
            </a>
          </li>
          <li>
            <a href="#logout" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Mobile toggle */}
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* Main content */}
      <div
        className={`main-content ${sidebarCollapsed ? "collapsed" : ""} ${
          sidebarOpen ? "shifted" : ""
        }`}
      >
        {/* Filter */}
        <div className="filter-section">
          <button className="filter-toggle" onClick={() => setShowFilter(!showFilter)}>
            <FaFilter /> Filter Categories
          </button>

          {showFilter && (
            <div className="filter-options">
              {COMMON_CATEGORIES.map((cat) => (
                <label key={cat}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Movies */}
        <div className="movie-hero-list">
          {filteredMovies.map((movie) => (
            <MovieHero
              key={movie._id}
              movie={movie}
              onPlayMovie={openVideoPlayer}
            />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlayerOpen && selectedMovie && (
        <div className="video-player-modal" onClick={closeVideoPlayer}>
          <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
            <button className="video-player-close" onClick={closeVideoPlayer}>
              <FaTimesCircle />
            </button>

            <video
              ref={videoPlayerRef}
              controls
              autoPlay
              className="video-player"
              src={
                selectedMovie.videoUrl.startsWith("http")
                  ? selectedMovie.videoUrl
                  : `http://localhost:5000/${selectedMovie.videoUrl}`
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
