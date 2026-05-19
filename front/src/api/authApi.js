import api from "./axios";


export const loginUser =
  async (data) => {

    try {

      const response =
        await api.post(
          "/auth/login",
          data
        );

      return response.data;

    } catch (error) {

      console.log(error);

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Login failed",
      };
    }
  };

export const sendOtp =
  async (email) => {

    try {

      const response =
        await api.post(
          "/auth/send-otp",
          { email }
        );

      return response.data;

    } catch (error) {

      console.log(error);

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to send OTP",
      };
    }
  };


export const resetPassword =
  async (data) => {

    try {

      const response =
        await api.post(
          "/auth/reset-password",
          data
        );

      return response.data;

    } catch (error) {

      console.log(error);

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Reset failed",
      };
    }
  };