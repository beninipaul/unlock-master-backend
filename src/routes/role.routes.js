const express = require("express");
const router = express.Router();
const {
  getAllRoles,
  createRole,
  getSpecificRole,
  updateRole,
} = require("../controllers/role.controllers");
const { roleInputValidation } = require("../validations/role.validations");

//for getting all roles
router.get("/roles", getAllRoles);
//for creating a role
router.post("/roles", roleInputValidation, createRole);
//for getting a specific role
router.get("/roles/:roleId", getSpecificRole);
//for updating a role
router.put("/roles/:roleId", roleInputValidation, updateRole);

module.exports = router;
