import {
  importQuotationFolderService,
} from "../services/importQuotationService.js";


export const importQuotationFolder =
  async (
    req,
    res
  ) => {

    try {

      const {
        folderPath,
      } = req.body;


      const response =
        await importQuotationFolderService(
          folderPath
        );


      res.status(200).json(
        response
      );

    }

    catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message,
      });
    }
  };