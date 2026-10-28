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


export const createUser =
  async (data) => {

    try {

      const response =
        await api.post(

          "/auth/create-user",

          data
        );

      return response.data;

    }

    catch (error) {

      console.log(error);

      return {

        success: false,

        message:
          error.response?.data?.message ||
          "User creation failed",
      };
    }
  };

export const getAllUsersApi = async () => {
  try {
    const response = await api.get("/auth/users");
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch users",
      users: [],
    };
  }
};

export const deleteUserApi = async (userId) => {
  try {
    const response = await api.delete(`/auth/users/${userId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete user",
    };
  }
};

export const updateUserApi = async (userId, data) => {
  try {
    const response = await api.put(`/auth/users/${userId}`, data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update user",
    };
  }
};