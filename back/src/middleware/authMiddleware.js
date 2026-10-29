import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";
import { connectUserDatabases } from "../config/setDatabase.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = envConfig?.JWT_SECRET || process.env.JWT_SECRET || "supersecretjwtkey12345";

    const decoded = jwt.verify(token, secret);

    req.user = decoded;

    if (decoded.userId) {
      await connectUserDatabases(decoded.userId);
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authMiddleware;
