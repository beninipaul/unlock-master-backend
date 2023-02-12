const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.verifyCurrentPassword = async (req, res, next) => {
  const user = await User.findById(req.body.userId);
  if (!user)
    return res.status(400).json({ success: false, message: "User not Found" });

  const isPasswordMatched = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );
  if (!isPasswordMatched)
    return res
      .status(401)
      .json({ success: false, message: "Incorrect current password" });
  req.user = user;
  next();
};

exports.isVerificationCodeExpired = async (req, res, next) => {
  const user = await User.findOne({
    verificationCode: req.body.verificationCode,
    verificationCodeExpires: { $gt: Date.now() },
  });
  if (!user)
    return res.status(400).json({
      success: false,
      message: "Verification code is invalid or expired",
    });
  const hashedPassword = await bcrypt.hash(req.body.newPassword, 12);
  user.password = hashedPassword;
  user.verificationCode = null;
  user.verificationCodeExpires = null;
  req.user = user;
  next();
};
