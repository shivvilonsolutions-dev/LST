import {
  loginService,
  sendOtpService,
  resetPasswordService,
  createUserService,
  getAllUsersService,
  deleteUserService,
  updateUserService,
} from "../services/authService.js";

export const login =
  async (req, res) => {

    console.log(req.body);

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
      console.log(error);
      
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

export const createUser =
  async (req, res) => {

    try {

      const data =
        await createUserService(
          req.body
        );

      res.status(201).json({

        success: true,

        ...data,
      });

    }

    catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message,
      });
    }
  };

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const data = await deleteUserService(req.params.userId);
    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const data = await updateUserService(req.params.userId, req.body);
    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};