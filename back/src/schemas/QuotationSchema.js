import mongoose from "mongoose";

const materialSchema =
  new mongoose.Schema(
    {
      size: String,

      piece: String,

      gauge: String,
    },
    { _id: false }
  );

const quotationSchema =
  new mongoose.Schema(
    {
      quotationNo: {
        type: String,
        required: true,
        unique: true,
      },

      cliId: {
        type: String,
        required: true,
      },

      cliName: {
        type: String,
        required: true,
      },

      mobile: {
        type: String,
        required: true,
      },

      whatsapp: {
        type: String,
        required: true,
      },

      quotationDate: {
        type: Date,
        default: Date.now,
      },

      materials: [
        materialSchema
      ],

      rateB1: String,

      rateB2: String,

      bending: String,

      laserCutting: String,

      add: String,

      status: {
        type: String,
        enum: [
          "PENDING",
          "CONFIRM",
        ],
        default: "PENDING",
      },

      excelPath: {
        type: String,
      },

      pdfPath: {
        type: String,
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

export default quotationSchema;