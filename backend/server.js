import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
// Connection DB
connectDB();

// Simple test route
app.get("/", (req, res) => {
  res.send("API NeuroFlix CLONE is running...");
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
