const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String, required: true },
    status: { type: String, default: "pending" },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("todo", todoSchema);
