const express = require("express");
const serviceController = require("../controllers/service.controllers");
const serviceValidation = require("../validations/service.validations");
const { authenticate, isAdmin } = require("../middlewares/auth.middlewares");

const router = express.Router();

router.post(
  "/services",
  authenticate,
  isAdmin,
  serviceValidation,
  serviceController.add
);
router.get("/services", serviceController.get);
router.put(
  "/services/:serviceId",
  authenticate,
  isAdmin,
  serviceValidation,
  serviceController.update
);
router.get("/services/:serviceId", serviceController.getOne);

module.exports = router;
