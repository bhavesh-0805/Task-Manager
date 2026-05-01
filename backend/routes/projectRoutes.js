const express = require("express");
const {
  createProject,
  getProjects,
  getSingleProject,
  addMember,
  removeMember,
  deleteProject
} = require("../controllers/projectController");

const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// create project (admin only)
router.post("/create", requireSignIn, isAdmin, createProject);

// get projects
router.get("/all", requireSignIn, getProjects);

router.get("/single/:id", requireSignIn, getSingleProject);

// ADD MEMBER TO PROJECT (Admin only)
router.put("/add-member", requireSignIn, isAdmin, addMember);

router.put("/remove-member/:id", requireSignIn, isAdmin, removeMember);

router.delete("/delete/:id", requireSignIn, isAdmin, deleteProject);


module.exports = router;