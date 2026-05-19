import mongoose from "mongoose";

const quotationSummarySchema =
  new mongoose.Schema(
    {
      quotationNo: String,

      quotationDate: Date,

      status: String,

      materials: [
        {
          size: String,

          piece: String,

          gauge: String,
        },
      ],
    },
    { _id: false }
  );

const clientSchema = new mongoose.Schema(
    {
      cliId: {
        type: String,
        required: true,
        unique: true,
      },

      cliName: {
        type: String,
        required: true,
      },

      mobile: {
        type: String,
        required: true,
        unique: true,
      },

      whatsapp: {
        type: String,
        required: true,
        unique: true,
      },

      dateOfJoin: {
        type: Date,
        default: Date.now,
      },

      quotationList: [
        quotationSummarySchema,
      ],

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

export default clientSchema;