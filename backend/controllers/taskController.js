const Task = require("../models/taskModel");

// CREATE TASK (Admin only)
exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      dueDate,
    });

    await task.save();

    res.status(201).send({
      success: true,
      message: "Task created",
      task,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error creating task",
    });
  }
};

// GET TASKS BY PROJECT
exports.getTasksByProject = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    let filter = { project: req.params.projectId };

    // If Member → only their tasks
    if (req.user.role !== "Admin") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email");

    res.status(200).send({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching tasks",
    });
  }
};

// UPDATE TASK STATUS (Member/Admin)
exports.updateTaskStatus = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const { status } = req.body;

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    // SECURITY CHECK
    if (
      req.user.role !== "Admin" &&
      task.assignedTo.toString() !== req.user._id
    ) {
      return res.status(403).send({
        message: "Not allowed to update this task",
      });
    }

    task.status = status;
    await task.save();

    res.status(200).send({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).send({ message: "Error updating task" });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    let tasks;

    // Role-based
    if (req.user.role === "Admin") {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({
        assignedTo: req.user._id,
      });
    }

    const now = new Date();

    let total = tasks.length;
    let completed = 0;
    let pending = 0;
    let overdue = 0;

    tasks.forEach((t) => {
      const isOverdue =
        t.dueDate &&
        new Date(t.dueDate) < now &&
        t.status !== "Completed";

      if (t.status === "Completed") {
        completed++;
      } else if (isOverdue) {
        overdue++; // correct overdue
      } else {
        pending++; // only non-overdue pending
      }
    });

    res.status(200).send({
      total,
      completed,
      pending,
      overdue,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching dashboard",
    });
  }
};

// GET MY TASKS
exports.getMyTasks = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const tasks = await Task.find({
      assignedTo: userId,
    })
      .populate("project", "name")
      .sort({ dueDate: 1 });

    res.status(200).send({
      success: true,
      tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching my tasks",
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    // only admin allowed
    if (req.user.role !== "Admin") {
      return res.status(403).send({
        message: "Access denied",
      });
    }

    const tasks = await Task.find()
      .populate("assignedTo", "name")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching all tasks",
    });
  }
};

// DELETE TASK (Admin only)
exports.deleteTask = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).send({
        message: "Only admin can delete tasks",
      });
    }

    const task = await Task.findByIdAndDelete(req.params.taskId);

    if (!task) {
      return res.status(404).send({
        message: "Task not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Task deleted successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error deleting task",
    });
  }
};