import mongoose
from "mongoose";


const UserSchema =
  new mongoose.Schema({

    userId: {
      type: String,
      required: true,
      unique: true,
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

    isSynced: {
      type: Boolean,
      default: false
    },

    lastSyncedAt: {
      type: Date
    }

  }, {
    timestamps: true,
  });

export default UserSchema;