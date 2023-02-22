const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const cors = require("cors");
const connectDB = require("./config/db");

const useRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

connectDB();

app.get("/", (req, res) => res.send("Server running"));

app.use("/api/v1/user", useRoutes);
app.use("/api/v1/todo", todoRoutes);

app.listen(PORT, (req, res) =>
  console.log(`server running on port ${PORT}`.green)
);
