const jwt = require("jsonwebtoken");
let token = null;
let decoded = null;
const authenticate = async (req, res, next) => {
  token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: "Please sign in" });
  }
  try {
    token = token.split(" ")[1];
    decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .send({ success: false, message: "Invalid", error: error.message });
  }
};

const isAdmin = (_, res, next) => {
  const grantedRoles = ["Admin", "ADMIN", "admin", "Administrator"];
  if (token) {
    if (grantedRoles.includes(decoded.role)) {
      next();
    } else {
      return res
        .status(403)
        .send({ success: false, message: "Lack of permission" });
    }
  }
};

module.exports = { authenticate, isAdmin };
