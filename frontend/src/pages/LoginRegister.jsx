import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/loginRegister.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

export default function LoginRegister() {
  const { login } = useAuth();
  const [isActive, setIsActive] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await axios.post("/users/register", { username, email, password });
      
      if (res.data) {
        // After successful registration, switch to login form
        setIsActive(false);
        setError("");
        setUsername("");
        setEmail("");
        setPassword("");
        // Optionally show success message
        alert("Registered successfully! Please login.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Error registering";
      setError(errorMessage);
      console.error("Registration error:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      const res = await axios.post("/users/login", { email, password });
      const loggedUser = res.data.user;
      const token = res.data.token;

      if (!loggedUser || !token) {
        setError("Invalid response from server");
        return;
      }

      login(loggedUser, token);

      // Redirection selon role
      if (loggedUser.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login error";
      setError(errorMessage);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-page">
      <div className={`login-container ${isActive ? "active" : ""}`}>
        {/* SIGN UP */}
        <div className="form-container sign-up">
          <form onSubmit={handleRegister}>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a><FaGoogle /></a>
              <a><FaFacebookF /></a>
              <a><FaGithub /></a>
              <a><FaLinkedinIn /></a>
            </div>
            <span>or use your email for registration</span>
            {error && <p className="error">{error}</p>}
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* SIGN IN */}
        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a><i className="fab fa-google"></i></a>
              <a><i className="fab fa-facebook-f"></i></a>
              <a><i className="fab fa-github"></i></a>
              <a><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your email password</span>
            {error && <p className="error">{error}</p>}
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <a href="#">Forget your password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* RIGHT / LEFT PANEL */}
        <div className="lr-toggle-container">
          <div className="lr-toggle">
            <div className="lr-toggle-panel lr-toggle-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="lr-hidden" onClick={() => setIsActive(false)}>Sign In</button>
            </div>
            <div className="lr-toggle-panel lr-toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button className="lr-hidden" onClick={() => setIsActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
