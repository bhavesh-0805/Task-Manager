const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error in Register API" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // match password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    // token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error in Login API" });
  }
};