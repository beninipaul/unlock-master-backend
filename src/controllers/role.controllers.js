const roleService = require("../services/role.services");
const { validationResult } = require("express-validator");

const createRole = async (req, res) => {
  const errors = validationResult(req);
  const { name, description } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation Error",
      errors: errors.array(),
    });
  }

  try {
    const roleSaved = await roleService.createRole({
      name,
      description,
    });
    return res.status(201).json({
      success: true,
      message: "Saved.",
      role: roleSaved,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error", error });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const allRoles = await roleService.getRoles();
    if (allRoles.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Not Found",
      });
    }
    return res.status(200).json({
      status: res.statusCode,
      success: true,
      message: "Found",
      roles: allRoles,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getSpecificRole = async (req, res) => {
  try {
    const roleId = req.params.roleId;
    const role = await roleService.getRole(roleId);
    if (role === null) {
      return res.status(200).json({
        success: false,
        message: "Not Found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Found.",
      role,
    });
  } catch (error) {
    return res.json({
      status: res.statusCode,
      success: false,
      error: error.message,
    });
  }
};

const updateRole = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation Error",
      errors: errors.array(),
    });
  }

  try {
    const roleId = req.params.roleId;
    const { name, description } = req.body;
    const role = await roleService.updateRole(roleId, { name, description });
    if (role === null) {
      return res.status(200).json({
        success: false,
        message: "Cannot update",
      });
    }
    return res.status(200).json({ success: true, message: "Updated", role });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error", error: error.message });
  }
};

module.exports = { createRole, getAllRoles, getSpecificRole, updateRole };
