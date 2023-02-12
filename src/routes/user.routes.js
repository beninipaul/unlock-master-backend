const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSpecificUser,
} = require("../controllers/user.controllers");
const { authenticate, isAdmin } = require("../middlewares/auth.middlewares");

//Define routes related to users

//for getting all users
router.get("/users", authenticate, isAdmin, getAllUsers);
//for getting a specific user
router.get("/users/:userId", authenticate, isAdmin, getSpecificUser);

module.exports = router;
