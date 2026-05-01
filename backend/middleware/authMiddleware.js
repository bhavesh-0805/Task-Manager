const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// check login
exports.requireSignIn = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;

    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
};

// Check admin
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // ADD THIS CHECK
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "Admin") {
      return res.status(403).send({
        success: false,
        message: "Access denied. Admin only",
      });
    }

    next();
  } catch (error) {
    console.log("ADMIN ERROR:", error); 
    res.status(500).send({
      message: "Error in admin middleware",
    });
  }
};