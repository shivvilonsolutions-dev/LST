import atlasConnection
from "../../config/atlasDb.js";

import settingsSchema
from "../../schemas/SettingsSchema.js";

const Settings =
  atlasConnection.model(
    "Settings",
    settingsSchema
  );

export default Settings;