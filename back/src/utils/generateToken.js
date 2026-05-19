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
      expiresIn: "7d",
    });
  };

export default generateToken;