import mongoose
from "mongoose";


const UserSchema =
  new mongoose.Schema({

    userId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      default: "",
    },

    otpExpiry: {
      type: Date,
    },

  }, {
    timestamps: true,
  });

export default UserSchema;