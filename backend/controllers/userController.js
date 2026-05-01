const User = require("../models/userModel");

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