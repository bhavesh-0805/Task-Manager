const Project = require("../models/projectModel");
const Task = require("../models/taskModel");

// CREATE PROJECT (Admin only)
exports.createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const project = new Project({
      name,
      description,
      createdBy: req.user._id,
      members,
    });

    await project.save();

    res.status(201).send({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error creating project",
    });
  }
};

// GET ALL PROJECTS (for logged-in user)
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user._id },
        { members: req.user._id },
      ],
    }).populate("members", "name email");

    res.status(200).send({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching projects",
    });
  }
};

// GET SINGLE PROJECT
exports.getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email");

    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }

    res.status(200).send({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching project",
    });
  }
};

// ADD MEMBER TO PROJECT
exports.addMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }

    // avoid duplicates
    if (project.members.includes(userId)) {
      return res.status(400).send({ message: "User already added" });
    }

    project.members.push(userId);
    await project.save();

    res.status(200).send({
      success: true,
      message: "Member added",
      project,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error adding member" });
  }
};

// REMOVE MEMBER
exports.removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    // REMOVE MEMBER FROM PROJECT
    project.members = project.members.filter(
      (m) => m.toString() !== memberId
    );

    await project.save();

    // REMOVE USER FROM ALL TASKS IN THIS PROJECT
    await Task.deleteMany({
      project: projectId,
      assignedTo: memberId,
    });

    res.status(200).send({
      success: true,
      message: "Member removed & tasks updated",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error removing member",
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    await Project.findByIdAndDelete(projectId);

    // OPTIONAL (recommended): also delete related tasks
    await Task.deleteMany({ project: projectId });

    res.status(200).send({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error deleting project",
    });
  }
};