import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import mongoose from "mongoose";
import Session from "../models/sessionModel.js";

export const userRegister = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Transaction Session
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
      { session },
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
      { session },
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

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ error: "Invalid Credentials" });
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Invalid Credentials" });
  }

  // Restrict Multiple Device Access
  const allSessions = await Session.find({ userId: user._id }).sort({
    createdAt: 1,
  });
  if (allSessions.length >= 2) {
    await allSessions[0].deleteOne();
  }

  const session = await Session.create({ userId: user._id });

  res.cookie("sid", session.id, {
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

export const userLogout = async (req, res) => {
  // res.cookie("sid", "", {
  //   maxAge: 0,
  // });
  const { sid } = req.signedCookies;
  await Session.findByIdAndDelete(sid);
  res.clearCookie("sid");

  res.status(200).json({ msg: "Logged Out" });
};

export const userLogoutAll = async (req, res) => {
  const { sid } = req.signedCookies;
  const session = await Session.findById(sid);
  await Session.deleteMany({ userId: session.userId });
  res.clearCookie("sid");

  res.status(200).json({ msg: "Logged Out" });
};
