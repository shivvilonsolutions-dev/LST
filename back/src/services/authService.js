import bcrypt
from "bcryptjs";

import LocalUser
from "../models/local/User.js";

import AtlasUser
from "../models/atlas/User.js";

import generateToken
from "../utils/generateToken.js";

import generateOTP
from "../utils/generateOTP.js";

import sendEmail
from "../utils/sendEmail.js";


export const loginService =
  async ({
    id,
    password,
  }) => {

    const user =
      await LocalUser.findOne({
        email: id,
      });

    if (!user) {

      throw new Error(
        "User not found"
      );
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      throw new Error(
        "Invalid password"
      );
    }

    const token =
      generateToken(user);

    return {
      token,

      user: {
        name:
          user.name,

        email:
          user.email,
      },
    };
  };


export const sendOtpService =
  async (email) => {

    const user =
      await LocalUser.findOne({
        email,
      });

    if (!user) {

      throw new Error(
        "User not found"
      );
    }

    const otp =
      generateOTP();

    user.otp = otp;

    user.otpExpiry =
      new Date(
        Date.now() +
        5 * 60 * 1000
      );

    await user.save();

    const atlasUser =
      await AtlasUser.findOne({
        email,
      });

    if (atlasUser) {

      atlasUser.otp = otp;

      atlasUser.otpExpiry =
        user.otpExpiry;

      await atlasUser.save();
    }

    await sendEmail(

      email,

      "Password Reset OTP",

      `Your OTP is ${otp}`
    );
  };


export const resetPasswordService =
  async ({
    email,
    otp,
    password,
  }) => {

    const user =
      await LocalUser.findOne({
        email,
      });

    if (!user) {

      throw new Error(
        "User not found"
      );
    }

    if (
      user.otp !== otp
    ) {

      throw new Error(
        "Invalid OTP"
      );
    }

    if (
      new Date() >
      user.otpExpiry
    ) {

      throw new Error(
        "OTP expired"
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    user.password =
      hashedPassword;

    user.otp = "";

    await user.save();

    const atlasUser =
      await AtlasUser.findOne({
        email,
      });

    if (atlasUser) {

      atlasUser.password =
        hashedPassword;

      atlasUser.otp = "";

      await atlasUser.save();
    }
  };