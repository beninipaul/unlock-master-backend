const { Schema, model } = require("mongoose");
const { userStatus } = require("../helpers/constants");

const userSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    // dropDups: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  status: {
    type: String,
    default: userStatus.INACTIVE,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  verifiedAt: {
    type: Date,
  },
  verificationCode: { type: String, default: null },
  verificationCodeExpires: { type: Date, default: null },
});

userSchema.set("timestamps", true);

module.exports = new model("User", userSchema);
