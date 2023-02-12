const User = require("../models/User");

// Method for creating a single user
const createUserService = async (user) => {
  const userObj = new User(user);
  return await userObj.save();
};

// Method for retrieving all users
const getUsersService = async () => {
  return await User.find().populate("role").exec();
};

// Method for retrieving all users
const getUserService = async (userId) => {
  return await User.findById(userId).populate("role").exec();
};

// Method for verifying user after signed up
const verifyUserService = async (id, infoTOUpdate) => {
  return User.findByIdAndUpdate(id, infoTOUpdate);
};

// Method for updating user's infos
const updateUserService = async (userId, user) => {
  return await User.findByIdAndUpdate(userId, user, { new: true });
};

// Method for requesting a password reset
const resetPasswordService = async (email, verificationCode) => {
  return await User.findOneAndUpdate(
    email,
    {
      $set: { verificationCode, verificationCodeExpires: Date.now() + 300000 },
    },
    { new: true }
  );
};

// Method for finalizing a password reset process
const finalizePasswordResetService = async (user) => {
  return User.findByIdAndUpdate(user._id, user);
};

// Method for updating a password
const updatePasswordService = async (user) => {
  return await User.findByIdAndUpdate(
    user._id,
    { $set: { password: user.password } },
    { new: true }
  );
};

// Method for logging in as a user on the app
const loginUserService = async (email) => {
  return await User.findOne({ email: email })
    .populate("role", { name: 1, description: 1 })
    .exec();
};

module.exports = {
  createUserService,
  getUsersService,
  getUserService,
  verifyUserService,
  updateUserService,
  loginUserService,
  resetPasswordService,
  updatePasswordService,
  finalizePasswordResetService,
};
