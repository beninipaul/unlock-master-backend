const serviceServices = require("../services/service.services");
const { validationResult } = require("express-validator");

const add = async (req, res) => {
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
    const service = await serviceServices.addService({ name, description });
    return res.status(201).json({ success: true, message: "Created", service });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed", error: error });
  }
};

const get = async (req, res) => {
  try {
    const services = await serviceServices.getService();
    if (services.length > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Found", services });
    }
    return res.status(200).json({ success: false, message: "No content" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const getOne = async (req, res) => {
  try {
    const service = await serviceServices.getSpecificService(
      req.params.serviceId
    );
    if (service.length !== null) {
      return res.status(200).json({ success: true, message: "Found", service });
    }
    return res.status(200).json({ success: false, message: "No content" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};
const update = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation Error",
      errors: errors.array(),
    });
  }

  try {
    const { serviceId } = req.params;
    const updatedService = await serviceServices.updateService(
      serviceId,
      req.body
    );
    if (updatedService === null) {
      return res.status(200).json({
        success: false,
        message: "Cannot update",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Updated", service: updatedService });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

module.exports = { add, get, getOne, update };
