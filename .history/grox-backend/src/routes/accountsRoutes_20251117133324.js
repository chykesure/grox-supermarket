import express from "express";
import {
  createUser,
  getUsers,
  updateUser,
  resetPassword,
  deleteUser, // <-- import this
  loginUser,
} from "../controllers/accountsController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.put("/:id", updateUser);
router.put("/reset-password/:id", resetPassword);
router.delete("/:id", deleteUser); // <-- add this
router.post("/login", loginUser);

export default router;
