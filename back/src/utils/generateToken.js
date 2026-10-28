import jwt
from "jsonwebtoken";


const generateToken =
  (user) => {

    return jwt.sign({

      userId:
        user.userId,

      email:
        user.email,

    },

    process.env.JWT_SECRET,

    {
      expiresIn: "30d", // 30 days - no auto logout
    });
  };

export default generateToken;