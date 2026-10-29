import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";

const generateToken = (user) => {
  const secret = envConfig?.JWT_SECRET || process.env.JWT_SECRET || "supersecretjwtkey12345";

  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
    },
    secret,
    {
      expiresIn: "30d", // 30 days - no auto logout
    }
  );
};

export default generateToken;
