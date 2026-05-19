import mongoose from "mongoose";

const settingsSchema =
  new mongoose.Schema(
    {
      offlinePdfPath: {
        type: String,
        default: "",
      },

      isSynced: {
        type: Boolean,
        default: false,
      },

      lastSyncedAt: Date,
    },
    {
      timestamps: true,
    }
  );

export default settingsSchema;