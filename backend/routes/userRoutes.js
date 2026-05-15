// routes/userRoutes.js
const express = require("express");
const { getAllUsers,getPublicStats} = require("../controllers/userController");
const { requireSignIn } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", getPublicStats);

router.get("/users", requireSignIn, getAllUsers);



module.exports = router;