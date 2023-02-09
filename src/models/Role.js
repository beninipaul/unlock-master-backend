const { Schema, model, models } = require("mongoose");
const { entityStatus } = require("../helpers/constants");

const roleSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: entityStatus.ACTIVE,
  },
});

roleSchema.set("timestamps", true);

module.exports = new model("Role", roleSchema);
