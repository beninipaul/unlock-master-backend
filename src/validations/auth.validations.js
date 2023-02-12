const { check } = require("express-validator");
const User = require("../models/User");

exports.inputUserValidation = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .trim()
    .normalizeEmail()
    .custom((email) => {
      return User.findOne({ email }, { password: 0 }).then((user) => {
        if (user) {
          return Promise.reject("Email already used");
        }
      });
    }),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Please provide at least 6 characters."),
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirm does not match password");
    }
    return true;
  }),
];

exports.resetPasswordValidation = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .trim()
    .normalizeEmail()
    .custom((email) => {
      return User.findOne({ email }, { password: 0 }).then((user) => {
        if (!user) {
          return Promise.reject("Email cannot be found");
        }
      });
    }),
];

exports.changingPasswordValidation = [
  check("currentPassword")
    .isLength({ min: 6 })
    .withMessage("Please provide at least 6 characters."),
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Please provide at least 6 characters."),
  check("confirmNewPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password confirm does not match password");
    }
    return true;
  }),
];

exports.resettingPasswordValidation = [
  check("verificationCode")
    .isNumeric()
    .isLength({ min: 6 })
    .withMessage("Please provide at least 6 digits."),
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Please provide at least 6 characters."),
  check("confirmNewPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password confirm does not match password");
    }
    return true;
  }),
];

exports.loginUserValidation = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .trim()
    .normalizeEmail(),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Please provide at least 6 characters."),
];
