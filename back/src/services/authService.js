import bcrypt from "bcryptjs";
import getModels from "../models/getModels.js";
import generateToken from "../utils/generateToken.js";
import generateOTP from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";
import checkInternet from "../utils/checkInternet.js"
import { connectUserDatabases } from "../config/setDatabase.js";
import fs
  from "fs";

import path
  from "path";
  
export const loginService =
  async ({
    id,
    password,
  }) => {

    // ALWAYS LOGIN FROM ADMIN DB
    await connectUserDatabases(
      "ADMIN001"
    );

    const {
      LocalUser,
    } = getModels();

    console.log({
      id,
      password,
    });

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

    // SWITCH TO USER DB
    await connectUserDatabases(
      user.userId
    );

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

    const {
      LocalUser,
      AtlasUser,
    } = getModels();

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

    const isOnline =
      await checkInternet();

    if (isOnline) {
      await sendEmail(

        email,

        "Password Reset OTP",

        `Your OTP is ${otp}`
      );
    };
  }


export const resetPasswordService =
  async ({
    email,
    otp,
    password,
  }) => {

    const {
      LocalUser,
      AtlasUser,
    } = getModels();

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


export const createUserService =
  async ({
    name,
    email,
    password,
  }) => {

    const {
      LocalUser,
      AtlasUser,
    } = getModels();


    // CHECK EXISTING USER

    const existingUser =
      await LocalUser.findOne({
        email,
      });

    if (existingUser) {

      throw new Error(
        "User already exists"
      );
    }


    // HASH PASSWORD

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // GENERATE USER ID

    const cleanName =
      name
        .replace(/\s+/g, "")
        .toUpperCase();


    const existingUsers =
      await LocalUser.find({

        userId: {

          $regex:
            `^${cleanName}`
        }
      });


    const nextNumber =
      String(
        existingUsers.length + 1
      ).padStart(3, "0");


    const userId =
      `${cleanName}${nextNumber}`;


    console.log(
      "NEW USER DB:",
      `lst_local_${userId}`
    );


    console.log(
      "NEW ATLAS DB:",
      `lst_atlas_${userId}`
    );


    // USER DATA

    const userData = {
      name,
      userId,
      email,
      password:
        hashedPassword,
    };


    // SAVE USER IN ADMIN DB

    await LocalUser.create(
      userData
    );


    await AtlasUser.create({

      ...userData,

      isSynced: true,

      lastSyncedAt:
        new Date(),
    });


    // CONNECT TO TENANT DB

    await connectUserDatabases(
      userId
    );


    // GET TENANT MODELS

    const {

      LocalUser:
      TenantLocalUser,

      AtlasUser:
      TenantAtlasUser,

      LocalSettings,

    } = getModels();


    // CREATE USER INSIDE TENANT LOCAL DB

    await TenantLocalUser.create(
      userData
    );


    // CREATE USER INSIDE TENANT ATLAS DB

    await TenantAtlasUser.create({

      ...userData,

      isSynced: true,

      lastSyncedAt:
        new Date(),
    });


    // DEFAULT STORAGE PATH

    const defaultStoragePath =
      path.join(

        "D:\\LST_Local_Files",

        userId
      );


    // CREATE ROOT STORAGE FOLDER

    if (
      !fs.existsSync(
        defaultStoragePath
      )
    ) {

      fs.mkdirSync(

        defaultStoragePath,

        {
          recursive: true,
        }
      );
    }


    // CREATE DEFAULT SETTINGS

    await LocalSettings.findOneAndUpdate(

      {},

      {
        offlinePdfPath:
          defaultStoragePath,

        isSynced: false,
      },

      {
        upsert: true,

        new: true,
      }
    );


    // RECONNECT BACK TO ADMIN DB

    await connectUserDatabases(
      "ADMIN001"
    );


    return {

      message:
        "User created successfully",
    };
  };