const express = require("express");
const {
  createTodo,
  getMyTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create", protect, createTodo);
router.get("/fetch", protect, getMyTodo);
router.put("/update/:id", protect, updateTodo);
router.delete("/delete/:id", protect, deleteTodo);

module.exports = router;
