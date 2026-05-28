import localConnection
from "../../config/localDb.js";

import inventorySchema
from "../../schemas/InventorySchema.js";

const Inventory =
  localConnection.model(
    "Inventory",
    inventorySchema
  );

export default Inventory;