//////////////////////
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("Auth Middleware - Headers:", req.headers);

  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("Auth Middleware - No token provided");
    return res
      .status(401)
      .json({ message: "No authentication token, access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth Middleware - Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Auth Middleware - Token verification failed:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
///////////////////////////
