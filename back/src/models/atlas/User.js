import atlasConnection
from "../../config/atlasDb.js";

import UserSchema
from "../../schemas/UserSchema.js";


const AtlasUser =
  atlasConnection.model(
    "User",
    UserSchema
  );

export default AtlasUser;