const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const { requireSignIn, isAdmin } = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();

import cors from "cors";

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://task-manager-wfw8.onrender.com/"
  ],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.get("/api/test", requireSignIn, (req, res) => {
  res.send("Protected route working");
});

app.get("/api/admin", requireSignIn, isAdmin, (req, res) => {
  res.send("Admin route working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});