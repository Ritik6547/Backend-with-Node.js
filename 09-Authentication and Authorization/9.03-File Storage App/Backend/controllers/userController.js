import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import mongoose from "mongoose";

export const userRegister = async (req, res, next) => {
  const { name, email, password } = req.body;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const rootDirId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    await Directory.create(
      [
        {
          _id: rootDirId,
          name: `root-${email}`,
          userId,
        },
      ],
      { session }
    );

    await User.create(
      [
        {
          _id: userId,
          name,
          email,
          password,
          rootDirId,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json({ msg: "User Registered Successfully" });
  } catch (err) {
    await session.abortTransaction();
    if (err.code === 121) {
      return res.status(400).json({ error: "Invalid Field Data" });
    } else if (err.code === 11000 && err.keyValue.email) {
      return res.status(409).json({
        error: "This email already exists",
        msg: "A user with this email address already exists.",
      });
    } else {
      next(err);
    }
  } finally {
    await session.endSession();
  }
};

export const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password }).lean();

  if (!user) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }

  const cookiePayload = JSON.stringify({
    id: user._id.toString(),
    expiry: Math.round(Date.now() / 1000 + 60),
  });

  // const signature = crypto
  //   .createHmac("sha256", secretKey)
  //   .update(cookiePayload)
  //   .digest("base64url");

  // const signedCookiePayload = `${Buffer.from(cookiePayload).toString(
  //   "base64url"
  // )}.${signature}`;

  res.cookie("token", Buffer.from(cookiePayload).toString("base64url"), {
    httpOnly: true,
    signed: true,
    maxAge: 60 * 60 * 24 * 7 * 1000,
  });

  res.json({ msg: "Logged In" });
};

export const getUserInfo = (req, res) => {
  const { name, email } = req.user;

  res.status(200).json({ name, email });
};

export const userLogout = (req, res) => {
  // res.cookie("uid", "", {
  //   maxAge: 0,
  // });
  res.clearCookie("uid");

  res.status(200).json({ msg: "Logged Out" });
};
