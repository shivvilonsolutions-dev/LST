import atlasConnection
from "../../config/atlasDb.js";

import inventorySchema
from "../../schemas/InventorySchema.js";

const Inventory =
  atlasConnection.model(
    "Inventory",
    inventorySchema
  );

export default Inventory;