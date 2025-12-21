import User from "../models/User.js";
import jwt from "jsonwebtoken";

// ----------------------------
// REGISTER
// ----------------------------
export const register = async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User exists" });
    }

    // Create user (Mongoose pre-save will hash the password)
    const user = await User.create({
      username,
      email,
      password,
      isAdmin: isAdmin === true, // accept admin creation
    });

    res.status(201).json({
      message: "Registered",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------
// LOGIN
// ----------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check password
    const match = await user.comparePassword(password);
    if (!match)
      return res.status(400).json({ message: "Wrong password" });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Logged in",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------
// GET USERS (ADMIN ONLY)
// ----------------------------
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------
// UPDATE USER (ADMIN ONLY)
// ----------------------------
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, isAdmin } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, isAdmin },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------
// DELETE USER (ADMIN ONLY)
// ----------------------------
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
