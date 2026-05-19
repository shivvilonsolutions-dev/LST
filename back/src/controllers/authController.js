import {
  loginService,
  sendOtpService,
  resetPasswordService,
} from "../services/authService.js";


export const login =
  async (req, res) => {

    try {

      const data =
        await loginService(
          req.body
        );

      res.status(200).json({
        success: true,
        ...data,
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };


export const sendOtp =
  async (req, res) => {

    try {

      await sendOtpService(
        req.body.email
      );

      res.status(200).json({
        success: true,
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };


export const resetPassword =
  async (req, res) => {

    try {

      await resetPasswordService(
        req.body
      );

      res.status(200).json({
        success: true,
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };