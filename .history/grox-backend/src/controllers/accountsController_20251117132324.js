import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { email, role, status } = req.body;

    if (!email || !role || !status) {
      return res.status(400).json({ message: "Please fill all fields correctly" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Create username automatically from email
    const username = email.split("@")[0];

    const user = await User.create({
      username,
      email,
      password: "1234",
      role: role.trim(), // store role name directly
      status,
      forcePasswordChange: true,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// List users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // no populate needed
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role, status } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update email
    if (email) user.email = email.trim();

    // Update role as name directly
    if (role) user.role = role.trim();

    // Update status
    if (status) user.status = status;

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
