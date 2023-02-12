const { Schema, model } = require("mongoose");

const userTokenSchema = Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  role: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 7 * 86400 },
});

const UserToken = model("UserToken", userTokenSchema);

module.exports = UserToken;
