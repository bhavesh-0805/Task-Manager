const User = require("../models/userModel");
const Project = require("../models/projectModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching users",
    });
  }
};

exports.getPublicStats = async (req, res) => {
  try {
    const users = await User.countDocuments();

    const projects = await Project.countDocuments();

    const totalMembers = await Project.aggregate([
      {
        $project: {
          memberCount: { $size: "$members" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$memberCount" },
        },
      },
    ]);

    res.status(200).send({
      success: true,
      users,
      projects,
      members: totalMembers[0]?.total || 0,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error fetching stats",
    });
  }
};