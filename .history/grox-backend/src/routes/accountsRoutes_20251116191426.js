// accountsRoutes.js
import express from "express";
const router = express.Router();
const {
  createUser,
  getUsers,
  updateUser,
  resetPassword,
} = require("../controllers/accountsController.js");


import { protect } from "../middleware/authMiddleware.js";

// All routes protected
router.use(protect);

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.put("/:id/reset-password", resetPassword);

export default router;
