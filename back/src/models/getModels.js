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


    if (
      !localConnection ||
      !atlasConnection
    ) {

      throw new Error(
        "Database connections not initialized"
      );
    }


    return {

      // LOCAL MODELS

      LocalClient:

        localConnection.models.Client ||

        localConnection.model(
          "Client",
          clientSchema
        ),


      LocalInventory:

        localConnection.models.Inventory ||

        localConnection.model(
          "Inventory",
          inventorySchema
        ),


      LocalQuotation:

        localConnection.models.Quotation ||

        localConnection.model(
          "Quotation",
          quotationSchema
        ),


      LocalSettings:

        localConnection.models.Settings ||

        localConnection.model(
          "Settings",
          settingsSchema
        ),


      LocalUser:

        localConnection.models.User ||

        localConnection.model(
          "User",
          UserSchema
        ),


      // ATLAS MODELS

      AtlasClient:

        atlasConnection.models.Client ||

        atlasConnection.model(
          "Client",
          clientSchema
        ),


      AtlasInventory:

        atlasConnection.models.Inventory ||

        atlasConnection.model(
          "Inventory",
          inventorySchema
        ),


      AtlasQuotation:

        atlasConnection.models.Quotation ||

        atlasConnection.model(
          "Quotation",
          quotationSchema
        ),


      AtlasSettings:

        atlasConnection.models.Settings ||

        atlasConnection.model(
          "Settings",
          settingsSchema
        ),


      AtlasUser:

        atlasConnection.models.User ||

        atlasConnection.model(
          "User",
          UserSchema
        ),
    };
  };


export default
  getModels;