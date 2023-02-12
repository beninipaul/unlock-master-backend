const {
  getUsersService,
  getUserService,
  updateUserService,
} = require("../services/user.services");
const { validationResult } = require("express-validator");

//Method that allows to get all users
const getAllUsers = async (_, res) => {
  try {
    const allUsers = await getUsersService();
    if (allUsers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Found",
      users: allUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//Method that allows to get a specific user
const getSpecificUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await getUserService(userId);
    if (user.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Found",
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

//Method that allows to update a user
const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  //to implement in the future
};

module.exports = {
  getAllUsers,
  getSpecificUser,
  updateUser,
};
