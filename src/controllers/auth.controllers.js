const { compare, hash } = require("bcrypt");
const { validationResult } = require("express-validator");
const { generateJWT, validateRefreshToken } = require("../helpers/jwt-token");
const UserToken = require("../models/UserToken");
const { getDigitalCode } = require("node-verification-code");
const { sendEmail, retrieveTemplate } = require("../helpers/sendEmail");
const { userStatus } = require("../helpers/constants");
const {
  createUserService,
  loginUserService,
  verifyUserService,
  resetPasswordService,
  finalizePasswordResetService,
  updatePasswordService,
} = require("../services/user.services");
const jwt = require("jsonwebtoken");

//Method that allows a user to signup
const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { email, password, confirmPassword, role } = req.body;
    if (password === confirmPassword) {
      const passwordHashed = await hash(password, 12);
      const user = await createUserService({
        email,
        password: passwordHashed,
        role,
      });

      const html = retrieveTemplate("../templates/account-activation.hbs", {
        activationLink: `${process.env.BASE_URL}/activate/${user._id}`,
      });

      await sendEmail(email, "Activate Account", html);
      return res.status(201).json({
        success: true,
        message: "Saved",
        user,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed", error: error.message });
  }
};

//Method that allows a user to login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { email, password } = req.body;
    const user = await loginUserService(email);
    if (user === null)
      return res.status(400).json({
        success: false,
        message: "Please, check your credentials.",
      });

    if (user.status.toString() !== userStatus.ACTIVE) {
      return res.status(401).json({ success: false, message: user.status });
    }

    if (!(await compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "passwords do not match" });
    }

    const { accessToken, refreshToken } = await generateJWT({
      userId: user._id,
      role: user.role.name,
    });

    return res.status(200).json({
      success: true,
      user: { _id: user._id },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Login Failed", error: error });
  }
};

const verifySpecificUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const verifiedUser = await verifyUserService(userId, {
      status: userStatus.ACTIVE,
      isVerified: true,
    });

    if (verifiedUser === null) {
      return res.status(400).json({
        success: false,
        message: "Not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User has been verified",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//Method that allows a user to refresh token
const getNewAccessToken = (req, res) => {
  validateRefreshToken(req.body.token)
    .then((tokenContent, reject) => {
      const payload = tokenContent.token;
      return jwt.sign(payload, process.env.JWT_TOKEN_SECRET_KEY);
    })
    .then((accessToken) => {
      return res.status(200).json({ success: true, accessToken });
    })
    .catch((error) =>
      res.status(500).json({ success: false, error: error.message })
    );
};

//Method that allows a user to request for reset password
const requestResetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  try {
    const emailObj = req.body;
    const emailVerificationCodeBuffer = getDigitalCode(6);
    const verificationCode = emailVerificationCodeBuffer.toString();

    const passwordWasReset = await resetPasswordService(
      emailObj,
      verificationCode
    );
    if (passwordWasReset === null)
      res.status(400).json({ success: false, message: "Not found" });

    const html = retrieveTemplate("../templates/reset-password.hbs", {
      customer: emailObj.email.split("@")[0],
      verificationCode: verificationCode,
    });

    await sendEmail(emailObj.email, "Verification Code", html);
    return res.status(200).json({ success: true, message: "Updated" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//Method that completes the request for reset password process
const completePasswordReset = async (req, res) => {
  try {
    const passwordReset = await finalizePasswordResetService(req.user);
    if (passwordReset === null)
      res.status(400).json({ success: false, message: "Not found" });
    return res.status(200).json({ success: true, message: "Updated" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//Method that user to change their password
const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { newPassword } = req.body;
    const { _id: userId, ...rest } = req.user;
    const hashedPassword = await hash(newPassword, 12);

    const userPasswordChanged = await updatePasswordService({
      _id: userId,
      password: hashedPassword,
    });
    if (userPasswordChanged === null)
      return res.status(400).json({ success: false, message: "Not found" });
    return res.status(200).json({ success: true, message: "Updated" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//Method that allows a user to logout
const logout = async (req, res) => {
  try {
    const token = req.body.token;
    const userToken = await UserToken.findOne({ token });
    if (!userToken)
      return res
        .status(400)
        .json({ success: false, message: "No token to delete" });

    await userToken.remove();
    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  signup,
  login,
  verifySpecificUser,
  getNewAccessToken,
  logout,
  requestResetPassword,
  changePassword,
  completePasswordReset,
};
