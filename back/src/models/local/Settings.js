import localConnection
from "../../config/localDb.js";

import settingsSchema
from "../../schemas/SettingsSchema.js";

const Settings =
  localConnection.model(
    "Settings",
    settingsSchema
  );

export default Settings;