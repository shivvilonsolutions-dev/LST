import localConnection
from "../../config/localDb.js";

import UserSchema
from "../../schemas/UserSchema.js";


const LocalUser =
  localConnection.model(
    "User",
    UserSchema
  );

export default LocalUser;