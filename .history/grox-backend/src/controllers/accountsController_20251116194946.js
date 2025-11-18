import User from "../models/User.js";
import Role from "../models/Role.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Create new user
export const createUser = async (req, res) => {
    try {
        const { username, role, status } = req.body;

        if (!username || !role) {
            return res.status(400).json({ message: "Username and role are required" });
        }

        // Check role exists
        let roleDoc = await Role.findOne({ name: role });
        if (!roleDoc) {
            roleDoc = await Role.create({ name: role, permissions: [] }); // create role if missing
        }

        // Check user existence
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // Create user
        const user = await User.create({
            username,
            role: roleDoc._id,
            status: status || "Active",
            password: "defaultpassword123", // default password for first setup
            forcePasswordChange: true, // force change on first login
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({ message: "User created", user, token });
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
