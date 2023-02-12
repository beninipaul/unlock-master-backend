const jwt = require("jsonwebtoken");
const UserToken = require("../models/UserToken");

const generateJWT = async (user) => {
  try {
    const accessToken = jwt.sign(
      user,
      process.env.JWT_TOKEN_SECRET_KEY,
      {
        expiresIn: "15m",
      } //15 mns
    );
    const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: "7d", //7 days
    });

    const userToken = await UserToken.findOne({ userId: user.userId });
    if (userToken) await userToken.remove();

    await new UserToken({ ...user, token: refreshToken }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (error) {
    return Promise.reject(error);
  }
};

const validateRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    UserToken.findOne({ token }, (err, doc) => {
      if (!doc.isEmpty)
        return reject({
          success: false,
          message: "Invalid refresh token",
          error: err,
        });
    });

    jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET_KEY,
      (err, tokenContent) => {
        if (err)
          return reject({ success: false, message: "Invalid refresh token" });

        resolve({
          success: true,
          message: "Valid refresh",
          token: tokenContent,
        });
      }
    );
  });
};

module.exports = {
  generateJWT,
  validateRefreshToken,
};
