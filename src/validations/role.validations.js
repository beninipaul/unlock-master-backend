const { body } = require("express-validator");
const Role = require("../models/Role");

exports.roleInputValidation = [
  body("name")
    .isLength({ min: 4 })
    .withMessage("Please provide at least 4 characters")
    .isAlpha()
    .withMessage("Please provide only alphabetic characters.")
    .trim()
    .custom((name) => {
      return Role.findOne({ name }).then((role) => {
        if (role) {
          return Promise.reject("This role is already existed.");
        }
      });
    }),
];
