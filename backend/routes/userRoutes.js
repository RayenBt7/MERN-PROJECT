import express from "express";
import { register, login, getUsers, updateUser, deleteUser } from "../controllers/authController.js";
import { adminOnly } from "../middleware/admin.js";

const router = express.Router();
// User routes
router.post("/register", register);
router.post("/login", login);

// Admin routes
router.get("/", adminOnly, getUsers);
router.put("/:id", adminOnly, updateUser);
router.delete("/:id", adminOnly, deleteUser);

export default router;
