import Inventory
  from "../models/local/Inventory.js";

import {
  syncAfterLocalSave,
} from "./syncService.js";

export const upsertInventoryService = async (data) => {
  const {
    inventoryName,
    properties,
  } = data;

  const property = properties?.[0];

  if (!property) {
    throw new Error(
      "Property data is required"
    );
  }

  const existingInventory =
    await Inventory.findOne({
      inventoryName,
    });

  // INVENTORY EXISTS
  if (existingInventory) {

    const thicknessExists =
      existingInventory.properties.some(
        (p) =>
          p.thickness.toLowerCase() ===
          property.thickness.toLowerCase()
      );

    if (thicknessExists) {
      throw new Error(
        "Thickness already exists in inventory"
      );
    }

    // STATUS AUTO CALCULATION
    if (
      property.quantity <= property.minQuantity
    ) {
      property.status = "LOW";
    }

    if (property.quantity === 0) {
      property.status = "OUT_OF_STOCK";
    }

    existingInventory.properties.push(
      property
    );

    await existingInventory.save();

    await syncAfterLocalSave(
      existingInventory,
      "inventory"
    );

    return existingInventory;
  }

  // NEW INVENTORY
  if (property.quantity <= property.minQuantity) {
    property.status = "LOW";
  }

  if (property.quantity === 0) {
    property.status = "OUT_OF_STOCK";
  }

  const newInventory =
    await Inventory.create({
      inventoryId:
        `INV_${Date.now()}`,

      inventoryName,

      dateOfInventory: new Date(),

      properties: [property],
    });

  await syncAfterLocalSave(
    newInventory,
    "inventory"
  );

  return newInventory;
};

export const getAllInventoriesService =
  async () => {
    return await Inventory.find().sort({
      createdAt: -1,
    });
  };

export const getSingleInventoryService =
  async (id) => {
    return await Inventory.findOne({
      inventoryId: id,
    });
  };

export const deleteInventoryService =
  async (inventoryId) => {
    return await Inventory.findOneAndDelete({
      inventoryId,
    });
  };

export const deletePropertyService =
  async (
    inventoryId,
    propertyId
  ) => {
    const inventory =
      await Inventory.findOne({
        inventoryId,
      });

    if (!inventory) {
      throw new Error(
        "Inventory not found"
      );
    }

    inventory.properties =
      inventory.properties.filter(
        (p) =>
          p.propertyId !== propertyId
      );

    await inventory.save();

    await syncAfterLocalSave(
      inventory,
      "inventory"
    );

    return inventory;
  };