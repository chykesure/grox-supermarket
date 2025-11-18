const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  updateUser,
  resetPassword,
} = require("../controllers/accountsController");
const { protect } = require("../middleware/authMiddleware");

// All routes protected
router.use(protect);

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.put("/:id/reset-password", resetPassword);

module.exports = router;
