import Client
  from "../models/local/Client.js";

import {
  syncAfterLocalSave,
} from "./syncService.js";

export const createClientService =
  async (data) => {

    const existingClient =
      await Client.findOne({
        mobile: data.mobile,
      });

    if (existingClient) {
      throw new Error(
        "Client already exists"
      );
    }

    const client =
      await Client.create({
        cliId: `CLI_${Date.now()}`,

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

    return client;
  };

export const getAllClientsService =
  async () => {
    return await Client.find().sort({
      createdAt: -1,
    });
  };

export const getSingleClientService =
  async (cliId) => {
    return await Client.findOne({
      cliId,
    });
  };

export const deleteClientService =
  async (cliId) => {
    return await Client.findOneAndDelete({
      cliId,
    });
  };

export const updateClientService =
  async (cliId, data) => {

    const updatedClient =
      await Client.findOneAndUpdate(
        { cliId },

        {
          cliName: data.cliName,

          mobile: data.mobile,

          whatsapp: data.whatsapp,
        },

        {
          new: true,
        }
      );

      await syncAfterLocalSave(
        updatedClient,
        "client"
      );

    return updatedClient;
  };