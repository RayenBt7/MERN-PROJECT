import Movie from "../models/Movie.js";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
export { upload };

export const createMovie = async (req, res) => {
  try {
    const { title, desc, category, year, limit, isSeries } = req.body;
    const img = req.files?.img ? req.files.img[0].path : req.body.img;
    const videoUrl = req.files?.video ? req.files.video[0].path : req.body.videoUrl;
    const movie = await Movie.create({ title, desc, img, videoUrl, category, year, limit, isSeries });
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getByCategory = async (req, res) => {
  try {
    const movies = await Movie.find({ category: req.params.category });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { title, desc, category, year, limit, isSeries } = req.body;
    // Server-side validation
    if (title && !title.trim()) return res.status(400).json({ message: "Title cannot be empty" });
    if (desc && !desc.trim()) return res.status(400).json({ message: "Description cannot be empty" });
    if (category && !category.trim()) return res.status(400).json({ message: "Category cannot be empty" });
    if (year && (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1)) return res.status(400).json({ message: "Valid year is required" });
    if (limit && (isNaN(limit) || limit < 0)) return res.status(400).json({ message: "Valid limit is required" });
    const img = req.files?.img ? req.files.img[0].path : req.body.img;
    const videoUrl = req.files?.video ? req.files.video[0].path : req.body.videoUrl;
    const movie = await Movie.findByIdAndUpdate(req.params.id, { title, desc, img, videoUrl, category, year, limit, isSeries }, { new: true });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
