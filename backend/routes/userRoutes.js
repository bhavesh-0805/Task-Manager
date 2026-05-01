// routes/userRoutes.js
const express = require("express");
const { getAllUsers } = require("../controllers/userController");
const { requireSignIn } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", requireSignIn, getAllUsers);

module.exports = router;