import localConnection
from "../../config/localDb.js";

import clientSchema
from "../../schemas/ClientSchema.js";

const Client =
  localConnection.model(
    "Client",
    clientSchema
  );

export default Client;