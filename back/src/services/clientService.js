import getModels from "../models/getModels.js";

import {
  syncAfterLocalSave,
} from "./syncService.js";

export const createClientService =
  async (data) => {

    const {
      LocalClient
    } = getModels();

    const existingClient =
      await LocalClient.findOne({
        mobile: data.mobile,
      });

    if (existingClient) {
      throw new Error(
        "Client already exists"
      );
    }

    const client =
      await LocalClient.create({
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

    const {
      LocalClient
    } = getModels();

    return await LocalClient.find().sort({
      createdAt: -1,
    });
  };

export const getSingleClientService =
  async (cliId) => {

    const {
      LocalClient
    } = getModels();

    return await LocalClient.findOne({
      cliId,
    });
  };

export const deleteClientService =
  async (cliId) => {

    const {
      LocalClient
    } = getModels();

    return await LocalClient.findOneAndDelete({
      cliId,
    });
  };

export const updateClientService =
  async (cliId, data) => {

    const {
      LocalClient
    } = getModels();


    const updatedClient =
      await LocalClient.findOneAndUpdate(
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