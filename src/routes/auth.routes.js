const { Router } = require("express");
const {
  signup,
  login,
  verifySpecificUser,
  getNewAccessToken,
  logout,
  requestResetPassword,
  changePassword,
  completePasswordReset,
} = require("../controllers/auth.controllers");
const {
  inputUserValidation: signUpUserValidation,
  loginUserValidation,
  resetPasswordValidation,
  changingPasswordValidation,
  resettingPasswordValidation,
} = require("../validations/auth.validations");
const {
  verifyCurrentPassword,
  isVerificationCodeExpired,
} = require("../middlewares/verifyUserPassword.middlewares");

const { authenticate } = require("../middlewares/auth.middlewares");
const {
  isThisRoleExisted,
} = require("../middlewares/isRoleExisted.middlewares");

const router = Router();
//Define routes related to auth

//for refreshing token
router.post("/refreshToken", getNewAccessToken);
//for signing up
router.post("/signup", signUpUserValidation, isThisRoleExisted, signup);
//for logging
router.post("/login", loginUserValidation, login);
//for resetting password
router.post("/reset-password", resetPasswordValidation, requestResetPassword);
//for changing password
router.post(
  "/change-password",
  authenticate,
  changingPasswordValidation,
  verifyCurrentPassword,
  changePassword
);
//for updating password
router.post(
  "/update-password",
  resettingPasswordValidation,
  isVerificationCodeExpired,
  completePasswordReset
);
//for activating user's account
router.put("/activate/:userId", verifySpecificUser);
//for logging out
router.delete("/logout", authenticate, loginUserValidation, logout);

module.exports = router;
