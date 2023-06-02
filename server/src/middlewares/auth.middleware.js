const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../lib/constants");

const authMiddleware = (req, _res, next) => {
  try {
    // Get the token from the request headers, query parameter, or request body
    const token = req.headers.authorization;

    // Check if token exists
    if (!token) {
      const err = new Error("Authentication token not provided");
      err.statusCode = 401;
      throw err;
    }

    // Verify the token
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    // Attach the decoded token to the request object for further use
    req.user = decodedToken;

    next();
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};

module.exports = authMiddleware;
