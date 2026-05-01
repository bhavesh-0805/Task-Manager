const express = require("express");
const {
  createTask,
  getTasksByProject,
  updateTaskStatus,
  getDashboardStats,
  getMyTasks,
  getAllTasks,
  deleteTask,
} = require("../controllers/taskController");

const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// create task (admin only)
router.post("/create", requireSignIn, isAdmin, createTask);

router.get("/all", requireSignIn, getAllTasks);

router.get("/dashboard/stats", requireSignIn, getDashboardStats);

router.get("/my", requireSignIn, getMyTasks);

// get tasks by project
router.get("/:projectId", requireSignIn, getTasksByProject);

// update status
router.put("/update/:taskId", requireSignIn, updateTaskStatus);

router.delete("/delete/:taskId", requireSignIn, deleteTask);






module.exports = router;