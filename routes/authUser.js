const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token || token === null)
    return res.status(401).send({ message: "Authriaztion token required" });

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res
          .status(403)
          .send({ message: "Token is expired. Please login again." });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(400).send({ message: "Invalid token" });
  }
};

module.exports = { authenticateToken };
