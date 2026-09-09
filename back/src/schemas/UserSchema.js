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
      default: ""
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

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN"],
      default: "ADMIN"
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