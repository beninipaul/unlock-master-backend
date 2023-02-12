const Role = require("../models/Role");

exports.isThisRoleExisted = async (req, res, next) => {
  const role = await Role.findById(req.body.role);
  if (!role)
    return res.status(400).json({ success: false, message: "Role not Found" });
  next();
};
