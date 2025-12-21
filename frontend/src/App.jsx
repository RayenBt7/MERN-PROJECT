import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegister";
import AddMovie from "./pages/AddMovie";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {/* Navbar uniquement sur certaines pages si souhaité */}
      {location.pathname !== "/login" && location.pathname !== "/" && <Navbar />}

      <Routes>
        {/* Landing page accessible à tout le monde */}
        <Route path="/" element={<LandingPage />} />

        {/* Home (protected) */}
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />

        {/* Login / Register */}
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginRegister /> : <Navigate to="/home" />}
        />

        {/* Profile (protected) */}
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Admin Dashboard (admin only) */}
        <Route
          path="/admin"
          element={
            isAuthenticated && user?.isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        {/* Add Movie (admin only) */}
        <Route
          path="/add-movie"
          element={
            isAuthenticated && user?.isAdmin ? <AddMovie /> : <Navigate to="/" />
          }
        />

        {/* 404 */}
        <Route path="*" element={<p>Page introuvable</p>} />
      </Routes>
    </>
  );
}

export default App;
