import getModels from "../models/getModels.js";

import {
  syncAfterLocalSave,
} from "./syncService.js";

export const createQuotationService =
  async (data) => {

    console.log(
      "REQ TOTAL PIECES:",
      data.totalPieces
    );

    console.log(
      "REQ BODY:",
      data
    );

    const {
      LocalClient,
      LocalQuotation
    } = getModels();

    let client =
      await LocalClient.findOne({
        mobile: data.mobile,
      });


    // DUPLICATE MOBILE CHECK
    if (
      client &&
      !data.skipDuplicateValidation
    ) {

      const existingName =
        client.cliName
          .trim()
          .toLowerCase();

      const incomingName =
        data.cliName
          .trim()
          .toLowerCase();

      // SAME NUMBER BUT DIFFERENT NAME
      if (
        existingName !==
        incomingName
      ) {

        throw new Error(
          `Mobile number already belongs to '${client.cliName}'`
        );
      }
    }

    // AUTO CREATE CLIENT
    if (!client) {

      client =
        await LocalClient.create({

          cliId:
            data.cliId ||
            `CLI_${Date.now()}`,

          cliName:
            data.cliName,

          mobile:
            data.mobile,

          whatsapp:
            data.whatsapp,

          dateOfJoin:
            new Date(),

          quotationList:
            [],
        });

      await syncAfterLocalSave(
        client,
        "client"
      );
    }

    // GENERATE QUOTATION NUMBER
    const quotationNo =
      data.quotationNo ||
      `Q_${data.mobile}_${Date.now()}`;

    // CREATE QUOTATION
    const quotation =
      await LocalQuotation.create({
        quotationNo,

        cliId:
          client.cliId,

        cliName:
          data.cliName,

        mobile:
          data.mobile,

        whatsapp:
          data.whatsapp,

        quotationDate:
          data.quotationDate
          || new Date(),

        materials:
          data.materials,

        rateB1:
          data.rateB1,

        rateB2:
          data.rateB2,

        bending:
          data.bending,

        laserCutting:
          data.laserCutting,

        add:
          data.add,

        totalPieces:
          data.totalPieces,

        status:
          data.status || "PENDING",

        isImported:
          data.isImported || false,

        isSynced:
          data.isSynced ?? false,

        sourceFileName:
          data.sourceFileName || "",

        excelPath:
          data.excelPath || "",

        pdfPath:
          data.pdfPath || "",
      });

    if (
      !quotation.isImported
    ) {

      await syncAfterLocalSave(
        quotation,
        "quotation"
      );
    }

    // UPDATE CLIENT SUMMARY CACHE
    client.quotationList.push({
      quotationNo,
      quotationDate:
        quotation.quotationDate,
      status:
        quotation.status,
      materials:
        quotation.materials,
    });

    await client.save();

    await syncAfterLocalSave(
      client,
      "client"
    );

    return quotation;
  };

export const getAllQuotationsService =
  async () => {

    const {
      LocalQuotation
    } = getModels();

    return await LocalQuotation.find().sort({
      createdAt: -1,
    });
  };

export const getSingleQuotationService =
  async (quotationNo) => {

    const {
      LocalQuotation
    } = getModels();

    return await LocalQuotation.findOne({
      quotationNo,
    });
  };

export const updateQuotationService =
  async (quotationNo, data) => {

    const {
      LocalClient,
      LocalQuotation
    } = getModels();

    const updatedQuotation =
      await LocalQuotation.findOneAndUpdate(
        { quotationNo },

        {
          ...data,
        },

        {
          new: true,
        }
      );

    // UPDATE CLIENT CACHE
    const client =
      await LocalClient.findOne({
        cliId:
          updatedQuotation.cliId,
      });

    if (client) {

      client.quotationList =
        client.quotationList.map(
          (q) => {

            if (
              q.quotationNo ===
              quotationNo
            ) {

              return {
                quotationNo:
                  updatedQuotation.quotationNo,

                quotationDate:
                  updatedQuotation.quotationDate,

                status:
                  updatedQuotation.status,

                materials:
                  updatedQuotation.materials,
              };
            }

            return q;
          }
        );

      await client.save();

      await syncAfterLocalSave(
        updatedQuotation,
        "quotation"
      );

      await syncAfterLocalSave(
        client,
        "client"
      );
    }

    return updatedQuotation;
  };

export const deleteQuotationService =
  async (quotationNo) => {

    const {
      LocalClient,
      LocalQuotation
    } = getModels();

    const quotation =
      await LocalQuotation.findOne({
        quotationNo,
      });

    if (!quotation) {
      throw new Error(
        "Quotation not found"
      );
    }

    // DELETE QUOTATION
    await LocalQuotation.findOneAndDelete({
      quotationNo,
    });

    // REMOVE FROM CLIENT CACHE
    const client =
      await LocalClient.findOne({
        cliId: quotation.cliId,
      });

    if (client) {

      client.quotationList =
        client.quotationList.filter(
          (q) =>
            q.quotationNo !==
            quotationNo
        );

      await client.save();

      await syncAfterLocalSave(
        client,
        "client"
      );
    }

    return quotation;
  };

export const updateQuotationStatusService =
  async (
    quotationNo,
    status
  ) => {

    const {
      LocalQuotation,
      LocalClient,
    } = getModels();


    const quotation =
      await LocalQuotation.findOneAndUpdate(
        {
          quotationNo,
        },
        {
          status,
          isSynced:
            false,
        },
        {
          new: true,
        }
      );


    if (!quotation) {

      throw new Error(
        "Quotation not found"
      );
    }


    // UPDATE CLIENT CACHE
    await LocalClient.updateOne(
      {
        cliId:
          quotation.cliId,

        "quotationList.quotationNo":
          quotationNo,
      },

      {
        $set: {

          "quotationList.$.status":
            status,
        },
      }
    );


    // LIGHTWEIGHT SYNC
    await syncAfterLocalSave(
      quotation,
      "quotation"
    );


    return quotation;
  };