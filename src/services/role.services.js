const Role = require("../models/Role");

// Method for creating a single user
const createRole = async (role) => {
  return await new Role(role).save();
};

// Method for retrieving all roles
const getRoles = async () => {
  return await Role.find();
};

// Method for retrieving all roles
const getRole = async (roleId) => {
  return await Role.findById(roleId);
};

// Method for updating role
const updateRole = async (roleId, role) => {
  return await Role.findByIdAndUpdate(roleId, role, {
    new: true,
    nModified: true,
  });
};

module.exports = { createRole, getRoles, getRole, updateRole };
