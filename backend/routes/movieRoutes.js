import express from "express";
import { createMovie, getMovies, getMovie, getByCategory, updateMovie, deleteMovie, upload } from "../controllers/movieController.js";
import auth from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";

const router = express.Router();

router.post("/", auth, upload.fields([{ name: 'img', maxCount: 1 }, { name: 'video', maxCount: 1 }]), createMovie);
router.get("/", getMovies);
router.get("/category/:category", getByCategory);
router.get("/:id", getMovie);

// Admin routes
router.put("/:id", adminOnly, upload.fields([{ name: 'img', maxCount: 1 }, { name: 'video', maxCount: 1 }]), updateMovie);
router.delete("/:id", adminOnly, deleteMovie);

export default router;
