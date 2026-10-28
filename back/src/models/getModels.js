import clientSchema
from "../schemas/ClientSchema.js";

import inventorySchema
from "../schemas/InventorySchema.js";

import quotationSchema
from "../schemas/QuotationSchema.js";

import settingsSchema
from "../schemas/SettingsSchema.js";

import UserSchema
from "../schemas/UserSchema.js";


import {
  getConnections,
} from "../config/setDatabase.js";


const getModels =
  () => {

    const {
      localConnection,
      atlasConnection,
    } = getConnections();

    if (!localConnection) {
      throw new Error(
        "Local database connection not initialized"
      );
    }

    const models = {
      // LOCAL MODELS (always required)
      LocalClient: localConnection.models.Client || localConnection.model("Client", clientSchema),
      LocalInventory: localConnection.models.Inventory || localConnection.model("Inventory", inventorySchema),
      LocalQuotation: localConnection.models.Quotation || localConnection.model("Quotation", quotationSchema),
      LocalSettings: localConnection.models.Settings || localConnection.model("Settings", settingsSchema),
      LocalUser: localConnection.models.User || localConnection.model("User", UserSchema),
    };

    // ATLAS MODELS (optional - only if Atlas is configured)
    if (atlasConnection) {
      models.AtlasClient = atlasConnection.models.Client || atlasConnection.model("Client", clientSchema);
      models.AtlasInventory = atlasConnection.models.Inventory || atlasConnection.model("Inventory", inventorySchema);
      models.AtlasQuotation = atlasConnection.models.Quotation || atlasConnection.model("Quotation", quotationSchema);
      models.AtlasSettings = atlasConnection.models.Settings || atlasConnection.model("Settings", settingsSchema);
      models.AtlasUser = atlasConnection.models.User || atlasConnection.model("User", UserSchema);
    }

    return models;
  };


export default
  getModels;