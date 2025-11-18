import express from "express";
import {
  createUser,
  getUsers,
  updateUser,
  resetPassword,
} from "../controllers/accountsController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createUser);
router.get("/", protect, getUsers);
router.put("/:id", protect, updateUser);
router.put("/reset-password/:id", protect, resetPassword);

export default router;
