import getModels from "../models/getModels.js";

import {
  syncAfterLocalSave,
} from "./syncService.js";

export const createQuotationService = async (data) => {
  console.log("REQ TOTAL PIECES:", data.totalPieces);
  console.log("REQ BODY:", data);

  // Validate required fields
  if (!data.cliName || !data.cliName.trim()) {
    throw new Error("Client name is required");
  }

  if (!data.mobile || !data.mobile.trim()) {
    throw new Error("Mobile number is required");
  }

  const {
    LocalClient,
    LocalQuotation,
    AtlasClient,
    AtlasQuotation
  } = getModels();

  let client = null;
  try {
    if (LocalClient) {
      client = await LocalClient.findOne({ mobile: data.mobile });
    }
  } catch (err) {
    console.log("LocalClient findOne failed:", err.message);
  }

  // Only fallback to Atlas if LocalClient is completely missing/failed
  if (!client && !LocalClient && AtlasClient) {
    try {
      client = await AtlasClient.findOne({ mobile: data.mobile });
    } catch (err) {
      console.log("AtlasClient findOne fallback failed:", err.message);
    }
  }

  // DUPLICATE MOBILE CHECK
  if (client && !data.skipDuplicateValidation) {
    const existingName = (client.cliName || "").trim().toLowerCase();
    const incomingName = (data.cliName || "").trim().toLowerCase();

    if (existingName && incomingName && existingName !== incomingName) {
      throw new Error(`Mobile number already belongs to '${client.cliName}'`);
    }
  }

  // AUTO CREATE CLIENT IF MISSING
  if (!client) {
    const clientData = {
      cliId: data.cliId || `CLI_${Date.now()}`,
      cliName: data.cliName,
      mobile: data.mobile,
      whatsapp: data.whatsapp || data.mobile, // Use mobile as fallback for whatsapp
      dateOfJoin: new Date(),
      quotationList: [],
    };

    try {
      if (LocalClient) {
        client = await LocalClient.create(clientData);
        if (AtlasClient) {
          await syncAfterLocalSave(client, "client");
        }
      }
    } catch (err) {
      console.log("LocalClient create failed:", err.message);
    }

    if (!client && !LocalClient && AtlasClient) {
      try {
        client = await AtlasClient.create(clientData);
      } catch (err) {
        console.log("AtlasClient create fallback failed:", err.message);
      }
    }
  }

  // GENERATE QUOTATION NUMBER
  const quotationNo = data.quotationNo || `Q_${data.mobile}_${Date.now()}`;

  const quotationData = {
    quotationNo,
    userId: data.userId || "ADMIN001", // Use actual userId if provided
    cliId: client ? client.cliId : (data.cliId || `CLI_${Date.now()}`),
    cliName: data.cliName,
    mobile: data.mobile,
    whatsapp: data.whatsapp || data.mobile,
    quotationDate: data.quotationDate || new Date(),
    materials: data.materials,
    rateB1: data.rateB1,
    rateB2: data.rateB2,
    bending: data.bending,
    laserCutting: data.laserCutting,
    add: data.add,
    totalPieces: data.totalPieces,
    status: data.status || "PENDING",
    isImported: data.isImported || false,
    isSynced: data.isSynced ?? false,
    sourceFileName: data.sourceFileName || "",
    excelPath: data.excelPath || "",
    pdfPath: data.pdfPath || "",
  };

  let quotation = null;
  try {
    if (LocalQuotation) {
      quotation = await LocalQuotation.create(quotationData);
      if (AtlasQuotation) {
        await syncAfterLocalSave(quotation, "quotation");
      }
    }
  } catch (err) {
    console.log("LocalQuotation create failed:", err.message);
  }

  if (!quotation && !LocalQuotation && AtlasQuotation) {
    try {
      quotation = await AtlasQuotation.create(quotationData);
    } catch (err) {
      console.log("AtlasQuotation create fallback failed:", err.message);
    }
  }

  // UPDATE CLIENT SUMMARY CACHE
  if (client) {
    if (!client.quotationList) client.quotationList = [];
    client.quotationList.push({
      quotationNo,
      quotationDate: quotation ? quotation.quotationDate : new Date(),
      status: quotation ? quotation.status : "PENDING",
      materials: quotation ? quotation.materials : [],
    });

    try {
      await client.save();
      if (AtlasClient) {
        await syncAfterLocalSave(client, "client");
      }
    } catch (err) {
      console.log("Client update/sync failed:", err.message);
    }
  }

  return quotation;
};

export const getAllQuotationsService = async () => {
  const { LocalQuotation, AtlasQuotation } = getModels();
  try {
    if (LocalQuotation) {
      const list = await LocalQuotation.find().sort({ quotationDate: -1, createdAt: -1 });
      if (list && list.length > 0) return list;
    }
  } catch (err) {
    console.log("LocalQuotation.find failed:", err.message);
  }

  if (AtlasQuotation) {
    try {
      return await AtlasQuotation.find().sort({ quotationDate: -1, createdAt: -1 });
    } catch (err) {
      console.log("AtlasQuotation.find failed:", err.message);
    }
  }

  return [];
};

export const getSingleQuotationService = async (quotationNo) => {
  const { LocalQuotation, AtlasQuotation } = getModels();
  try {
    if (LocalQuotation) {
      const item = await LocalQuotation.findOne({ quotationNo });
      if (item) return item;
    }
  } catch (err) {
    console.log("LocalQuotation.findOne failed:", err.message);
  }

  if (AtlasQuotation) {
    try {
      return await AtlasQuotation.findOne({ quotationNo });
    } catch (err) {
      console.log("AtlasQuotation.findOne failed:", err.message);
    }
  }

  return null;
};

export const updateQuotationService = async (quotationNo, data) => {
  const {
    LocalClient,
    LocalQuotation,
    AtlasClient,
    AtlasQuotation
  } = getModels();

  let updatedQuotation = null;
  try {
    if (LocalQuotation) {
      updatedQuotation = await LocalQuotation.findOneAndUpdate(
        { quotationNo },
        { ...data },
        { new: true }
      );
    }
  } catch (err) {
    console.log("LocalQuotation findOneAndUpdate failed:", err.message);
  }

  if (!updatedQuotation && AtlasQuotation) {
    try {
      updatedQuotation = await AtlasQuotation.findOneAndUpdate(
        { quotationNo },
        { ...data },
        { new: true }
      );
    } catch (err) {}
  }

  if (updatedQuotation) {
    let client = null;
    try {
      if (LocalClient) {
        client = await LocalClient.findOne({ cliId: updatedQuotation.cliId });
      }
    } catch (err) {}

    if (!client && AtlasClient) {
      try {
        client = await AtlasClient.findOne({ cliId: updatedQuotation.cliId });
      } catch (err) {}
    }

    if (client) {
      if (client.quotationList) {
        client.quotationList = client.quotationList.map((q) => {
          if (q.quotationNo === quotationNo) {
            return {
              quotationNo: updatedQuotation.quotationNo,
              quotationDate: updatedQuotation.quotationDate,
              status: updatedQuotation.status,
              materials: updatedQuotation.materials,
            };
          }
          return q;
        });
      }

      try {
        await client.save();
        await syncAfterLocalSave(updatedQuotation, "quotation");
        await syncAfterLocalSave(client, "client");
      } catch (err) {}
    }
  }

  return updatedQuotation;
};

export const deleteQuotationService = async (quotationNo) => {
  const {
    LocalClient,
    LocalQuotation,
    AtlasClient,
    AtlasQuotation
  } = getModels();

  let quotation = null;
  try {
    if (LocalQuotation) {
      quotation = await LocalQuotation.findOne({ quotationNo });
    }
  } catch (err) {}

  if (!quotation && AtlasQuotation) {
    try {
      quotation = await AtlasQuotation.findOne({ quotationNo });
    } catch (err) {}
  }

  if (!quotation) {
    throw new Error("Quotation not found");
  }

  // DELETE QUOTATION
  try {
    if (LocalQuotation) {
      await LocalQuotation.findOneAndDelete({ quotationNo });
    }
  } catch (err) {}

  if (AtlasQuotation) {
    try {
      await AtlasQuotation.findOneAndDelete({ quotationNo });
    } catch (err) {}
  }

  // REMOVE FROM CLIENT CACHE
  let client = null;
  try {
    if (LocalClient) {
      client = await LocalClient.findOne({ cliId: quotation.cliId });
    }
  } catch (err) {}

  if (!client && AtlasClient) {
    try {
      client = await AtlasClient.findOne({ cliId: quotation.cliId });
    } catch (err) {}
  }

  if (client) {
    if (client.quotationList) {
      client.quotationList = client.quotationList.filter(
        (q) => q.quotationNo !== quotationNo
      );
    }
    try {
      await client.save();
      await syncAfterLocalSave(client, "client");
    } catch (err) {}
  }

  return quotation;
};

export const updateQuotationStatusService = async (quotationNo, status) => {
  const {
    LocalQuotation,
    LocalClient,
    AtlasQuotation,
    AtlasClient
  } = getModels();

  let quotation = null;
  try {
    if (LocalQuotation) {
      quotation = await LocalQuotation.findOneAndUpdate(
        { quotationNo },
        { status, isSynced: false },
        { new: true }
      );
    }
  } catch (err) {}

  if (!quotation && AtlasQuotation) {
    try {
      quotation = await AtlasQuotation.findOneAndUpdate(
        { quotationNo },
        { status, isSynced: true },
        { new: true }
      );
    } catch (err) {}
  }

  if (!quotation) {
    throw new Error("Quotation not found");
  }

  // UPDATE CLIENT CACHE
  try {
    if (LocalClient) {
      await LocalClient.updateOne(
        { cliId: quotation.cliId, "quotationList.quotationNo": quotationNo },
        { $set: { "quotationList.$.status": status } }
      );
    }
  } catch (err) {}

  if (AtlasClient) {
    try {
      await AtlasClient.updateOne(
        { cliId: quotation.cliId, "quotationList.quotationNo": quotationNo },
        { $set: { "quotationList.$.status": status } }
      );
    } catch (err) {}
  }

  // Sync in background - don't block the status update
  setTimeout(async () => {
    try {
      await syncAfterLocalSave(quotation, "quotation");
    } catch (err) {
      console.log("Background sync error after status update:", err);
    }
  }, 200);

  return quotation;
};