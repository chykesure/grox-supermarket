import User from "../models/User.js";
import Role from "../models/Role.js";

// Create new user
export const createUser = async (req, res) => {
  try {
    const { username, email, password, roleId, status } = req.body;

    if (!username || !email || !password || !roleId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const role = await Role.findById(roleId);
    if (!role) return res.status(400).json({ message: "Role not found" });

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      username,
      email,
      password,
      role: role._id,
      status: status || "Active",
    });

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// List users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role", "name permissions");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, roleId, status, forcePasswordChange } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;

    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) return res.status(400).json({ message: "Role not found" });
      user.role = role._id;
    }

    if (status) user.status = status;

    if (forcePasswordChange !== undefined)
      user.forcePasswordChange = forcePasswordChange;

    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, forceChange } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;

    if (forceChange !== undefined)
      user.forcePasswordChange = forceChange;

    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
