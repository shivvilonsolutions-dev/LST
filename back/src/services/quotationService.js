import Quotation
  from "../models/local/Quotation.js";

import Client
  from "../models/local/Client.js";

import {
  syncAfterLocalSave,
} from "./syncService.js";

export const createQuotationService =
  async (data) => {

    let client =
      await Client.findOne({
        mobile: data.mobile,
      });


    // DUPLICATE MOBILE CHECK
    if (client) {

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
        await Client.create({
          cliId:
            `CLI_${Date.now()}`,

          cliName: data.cliName,

          mobile: data.mobile,

          whatsapp: data.whatsapp,

          dateOfJoin: new Date(),

          quotationList: [],
        });

      await syncAfterLocalSave(
        client,
        "client"
      );
    }

    // GENERATE QUOTATION NUMBER
    const quotationNo =
      `Q_${data.mobile}_${Date.now()}`;

    // CREATE QUOTATION
    const quotation =
      await Quotation.create({
        quotationNo,

        cliId: client.cliId,

        cliName: data.cliName,

        mobile: data.mobile,

        whatsapp: data.whatsapp,

        quotationDate: new Date(),

        materials: data.materials,

        rateB1: data.rateB1,

        rateB2: data.rateB2,

        bending: data.bending,

        laserCutting:
          data.laserCutting,

        add: data.add,

        status:
          data.status || "PENDING",
      });

    await syncAfterLocalSave(
      quotation,
      "quotation"
    );

    // UPDATE CLIENT SUMMARY CACHE
    client.quotationList.push({
      quotationNo,

      quotationDate:
        quotation.quotationDate,

      status: quotation.status,

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
    return await Quotation.find().sort({
      createdAt: -1,
    });
  };

export const getSingleQuotationService =
  async (quotationNo) => {

    return await Quotation.findOne({
      quotationNo,
    });
  };

export const updateQuotationService =
  async (quotationNo, data) => {

    const updatedQuotation =
      await Quotation.findOneAndUpdate(
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
      await Client.findOne({
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

    const quotation =
      await Quotation.findOne({
        quotationNo,
      });

    if (!quotation) {
      throw new Error(
        "Quotation not found"
      );
    }

    // DELETE QUOTATION
    await Quotation.findOneAndDelete({
      quotationNo,
    });

    // REMOVE FROM CLIENT CACHE
    const client =
      await Client.findOne({
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