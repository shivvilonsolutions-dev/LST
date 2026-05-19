import {
  upsertInventoryService,
  getAllInventoriesService,
  getSingleInventoryService,
  deleteInventoryService,
  deletePropertyService,
} from "../services/inventoryService.js";

export const upsertInventory =
  async (req, res) => {
    // console.log(
    //   "REQ BODY:",
    //   req.body
    // );

    try {
      const inventory =
        await upsertInventoryService(
          req.body
        );

      res.status(201).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getAllInventories =
  async (req, res) => {
    try {
      const inventories =
        await getAllInventoriesService();

      res.status(200).json({
        success: true,
        data: inventories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getSingleInventory =
  async (req, res) => {
    try {
      const inventory =
        await getSingleInventoryService(
          req.params.id
        );

      res.status(200).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const deleteInventory =
  async (req, res) => {
    try {
      await deleteInventoryService(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Inventory deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const deleteProperty =
  async (req, res) => {
    try {
      const inventory =
        await deletePropertyService(
          req.params.inventoryId,
          req.params.propertyId
        );

      res.status(200).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };