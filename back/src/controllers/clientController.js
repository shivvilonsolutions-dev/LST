import {
  createClientService,
  getAllClientsService,
  getSingleClientService,
  deleteClientService,
  updateClientService,
} from "../services/clientService.js";

export const createClient =
  async (req, res) => {
    try {

      const client =
        await createClientService(
          req.body
        );

      res.status(201).json({
        success: true,
        data: client,
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getAllClients =
  async (req, res) => {
    try {

      const clients =
        await getAllClientsService();

      res.status(200).json({
        success: true,
        data: clients,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getSingleClient =
  async (req, res) => {
    try {

      const client =
        await getSingleClientService(
          req.params.id
        );

      res.status(200).json({
        success: true,
        data: client,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const updateClient =
  async (req, res) => {
    try {

      const updatedClient =
        await updateClientService(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        data: updatedClient,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const deleteClient =
  async (req, res) => {
    try {

      await deleteClientService(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Client deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };