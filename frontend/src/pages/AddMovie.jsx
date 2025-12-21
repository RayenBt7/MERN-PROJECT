import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/AddMovie.css";

const COMMON_CATEGORIES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western"
];

export default function AddMovie() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [limit, setLimit] = useState("");
  const [isSeries, setIsSeries] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }
  }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setMessage("Title is required");
    if (!desc.trim()) return setMessage("Description is required");
    if (!img) return setMessage("Image file is required");
    if (!videoUrl) return setMessage("Video file is required");
    if (!category.trim()) return setMessage("Category is required");
    if (!year || isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) return setMessage("Valid year is required");
    if (!limit || isNaN(limit) || limit < 0) return setMessage("Valid limit is required");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("img", img);
      formData.append("video", videoUrl);
      formData.append("category", category);
      formData.append("year", year);
      formData.append("limit", limit);
      formData.append("isSeries", isSeries);

      await axios.post("/movies", formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });

      setMessage("Movie added successfully!");
      setTitle(""); setDesc(""); setImg(null); setVideoUrl(null); setCategory(""); setYear(""); setLimit(""); setIsSeries(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding movie");
    }
  };

  return (
    <div className="add-movie-container">
      <h2 className="add-movie-title">Add Movie</h2>
      {message && <p className={`add-movie-message ${message.includes("successfully") ? "success" : "error"}`}>{message}</p>}
      <form onSubmit={handleSubmit} className="add-movie-form">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="add-movie-input" />
        <textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} className="add-movie-input" />
        <input type="file" onChange={(e) => setImg(e.target.files[0])} className="add-movie-file-input" />
        <input type="file" onChange={(e) => setVideoUrl(e.target.files[0])} className="add-movie-file-input" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="add-movie-input">
          <option value="">Select Category</option>
          {COMMON_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} className="add-movie-input" />
        <input type="number" placeholder="Age Limit" value={limit} onChange={(e) => setLimit(e.target.value)} className="add-movie-input" />
        <label className="add-movie-checkbox-container">
          Is Series:
          <input type="checkbox" checked={isSeries} onChange={(e) => setIsSeries(e.target.checked)} className="add-movie-checkbox" />
        </label>
        <button type="submit" className="add-movie-submit-btn">Add Movie</button>
      </form>
    </div>
  );
}
