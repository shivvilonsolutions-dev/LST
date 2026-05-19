import {
  getSettingsService,

  updateSettingsService,
} from "../services/settingsService.js";


export const getSettings =
  async (req, res) => {

    try {

      const settings =
        await getSettingsService();

      res.status(200).json({
        success: true,

        data: settings,
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };


export const updateSettings =
  async (req, res) => {

    try {

      const settings =
        await updateSettingsService(
          req.body
        );

      res.status(200).json({
        success: true,

        data: settings,
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };