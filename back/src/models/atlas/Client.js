import atlasConnection
from "../../config/atlasDb.js";

import clientSchema
from "../../schemas/ClientSchema.js";

const Client =
  atlasConnection.model(
    "Client",
    clientSchema
  );

export default Client;