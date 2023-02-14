const { body } = require("express-validator");
const Service = require("../models/Service");

const serviceValidation = [
  body("name")
    .isString()
    .withMessage("Provide only alphabetic characters")
    .isLength({ min: 4 })
    .withMessage("Please provide at least 4 characters")
    .trim()
    .custom(async (name) => {
      return await Service.findOne({ name }).then((service) => {
        if (service) {
          return Promise.reject("This name is already existed");
        }
      });
    }),
  body("description")
    .trim()
    .isString()
    .withMessage("Provide only string of characters"),
];

module.exports = serviceValidation;
