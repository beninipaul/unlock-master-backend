const { Schema, model } = require("mongoose");
const { entityStatus } = require("../helpers/constants");

const serviceSchema = Schema({
  name: { type: String, require: true },
  description: { type: String },
  status: { type: String, default: entityStatus.ACTIVE },
});

serviceSchema.set("timestamps", true);

const Service = model("Service", serviceSchema);

module.exports = Service;
