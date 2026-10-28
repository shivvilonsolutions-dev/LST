import jwt from "jsonwebtoken";
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

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