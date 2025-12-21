/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/admin.css";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAdmin, setNewAdmin] = useState({ username: "", email: "", password: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }
    fetchUsers();
    fetchMovies();
  }, [user]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [users, searchTerm]);

  useEffect(() => {
    setFilteredMovies(
      movies.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [movies, searchTerm]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users", { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMovies = async () => {
    try {
      const res = await axios.get("/movies", { headers: { Authorization: `Bearer ${token}` } });
      setMovies(res.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/users/register", { ...newAdmin, isAdmin: true }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Admin user created successfully!");
      setNewAdmin({ username: "", email: "", password: "" });
      setTimeout(() => setMessage(""), 3000);
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating admin user");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/users/${editingUser._id}`, {
        username: editingUser.username,
        email: editingUser.email,
        isAdmin: editingUser.isAdmin
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("User updated successfully!");
      setEditingUser(null);
      setTimeout(() => setMessage(""), 3000);
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating user");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("User deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting user");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editingMovie.title);
      formData.append("desc", editingMovie.desc);
      formData.append("category", editingMovie.category);
      formData.append("year", editingMovie.year);
      formData.append("limit", editingMovie.limit);
      formData.append("isSeries", editingMovie.isSeries);

      await axios.put(`/movies/${editingMovie._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setMessage("Movie updated successfully!");
      setEditingMovie(null);
      setTimeout(() => setMessage(""), 3000);
      fetchMovies();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating movie");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await axios.delete(`/movies/${movieId}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Movie deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
      fetchMovies();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting movie");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!user || !user.isAdmin) return <div>Access denied. Admin privileges required.</div>;

  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.isAdmin).length;
  const totalMovies = movies.length;
  const totalSeries = movies.filter(m => m.isSeries).length;

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            👥 Users ({totalUsers})
          </button>
          <button
            className={activeTab === "movies" ? "active" : ""}
            onClick={() => setActiveTab("movies")}
          >
            🎬 Movies ({totalMovies})
          </button>
        </nav>
        <Link to="/" className="back-btn">← Back to Home</Link>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <h1>
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "users" && "User Management"}
            {activeTab === "movies" && "Movie Management"}
          </h1>
          {message && <p className={`admin-message ${message.includes("success") ? "success" : "error"}`}>{message}</p>}
        </div>

        <div className="admin-content">
          {activeTab === "overview" && (
            <div className="overview-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Admin Users</h3>
                <p className="stat-number">{totalAdmins}</p>
              </div>
              <div className="stat-card">
                <h3>Total Movies</h3>
                <p className="stat-number">{totalMovies}</p>
              </div>
              <div className="stat-card">
                <h3>Series</h3>
                <p className="stat-number">{totalSeries}</p>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <>
              <div className="admin-controls">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button
                  className="admin-btn primary"
                  onClick={() => setEditingUser({ username: "", email: "", isAdmin: false })}
                >
                  + Add Admin
                </button>
              </div>

              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id}>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.isAdmin ? "admin" : "user"}`}>
                            {u.isAdmin ? "Admin" : "User"}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => setEditingUser(u)} className="action-btn edit">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteUser(u._id)} className="action-btn delete">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "movies" && (
            <>
              <div className="admin-controls">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <Link to="/add-movie" className="admin-btn primary">
                  + Add Movie
                </Link>
              </div>

              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Year</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovies.map((movie) => (
                      <tr key={movie._id}>
                        <td>{movie.title}</td>
                        <td>{movie.category}</td>
                        <td>{movie.year}</td>
                        <td>
                          <span className={`type-badge ${movie.isSeries ? "series" : "movie"}`}>
                            {movie.isSeries ? "Series" : "Movie"}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => setEditingMovie(movie)} className="action-btn edit">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteMovie(movie._id)} className="action-btn delete">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>{editingUser._id ? "Edit User" : "Create Admin User"}</h3>
            <form onSubmit={editingUser._id ? handleUpdateUser : handleCreateAdmin}>
              <input
                type="text"
                placeholder="Username"
                value={editingUser._id ? editingUser.username : newAdmin.username}
                onChange={(e) => editingUser._id
                  ? setEditingUser({ ...editingUser, username: e.target.value })
                  : setNewAdmin({ ...newAdmin, username: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={editingUser._id ? editingUser.email : newAdmin.email}
                onChange={(e) => editingUser._id
                  ? setEditingUser({ ...editingUser, email: e.target.value })
                  : setNewAdmin({ ...newAdmin, email: e.target.value })
                }
                required
              />
              {!editingUser._id && (
                <input
                  type="password"
                  placeholder="Password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  required
                />
              )}
              <label>
                <input
                  type="checkbox"
                  checked={editingUser._id ? editingUser.isAdmin : true}
                  onChange={(e) => editingUser._id
                    ? setEditingUser({ ...editingUser, isAdmin: e.target.checked })
                    : null
                  }
                  disabled={!editingUser._id}
                />
                Admin privileges
              </label>
              <div className="modal-actions">
                <button type="submit">{editingUser._id ? "Update" : "Create"}</button>
                <button type="button" onClick={() => {
                  setEditingUser(null);
                  setNewAdmin({ username: "", email: "", password: "" });
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Movie Modal */}
      {editingMovie && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>Edit Movie</h3>
            <form onSubmit={handleUpdateMovie}>
              <input
                type="text"
                placeholder="Title"
                value={editingMovie.title}
                onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={editingMovie.desc}
                onChange={(e) => setEditingMovie({ ...editingMovie, desc: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={editingMovie.category}
                onChange={(e) => setEditingMovie({ ...editingMovie, category: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Year"
                value={editingMovie.year}
                onChange={(e) => setEditingMovie({ ...editingMovie, year: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Age Limit"
                value={editingMovie.limit}
                onChange={(e) => setEditingMovie({ ...editingMovie, limit: e.target.value })}
                required
              />
              <label>
                <input
                  type="checkbox"
                  checked={editingMovie.isSeries}
                  onChange={(e) => setEditingMovie({ ...editingMovie, isSeries: e.target.checked })}
                />
                Is Series
              </label>
              <div className="modal-actions">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditingMovie(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
