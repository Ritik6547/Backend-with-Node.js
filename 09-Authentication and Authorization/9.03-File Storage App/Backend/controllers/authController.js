import OTP from "../models/otpModel.js";
import { sendOtpUtil } from "../utils/sendOtpUtil.js";

export const sendOTP = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ msg: "Email is required" });
  }
  const { email } = req.body;

  const result = await sendOtpUtil(email);
  if (result.success) {
    return res.status(200).json(result);
  }
  res.status(500).json(result);
};

export const verifyOTP = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ msg: "Email and OTP is required" });
  }

  const { email, otp } = req.body;
  const otpData = await OTP.findOne({ email, otp });

  if (!otpData) {
    return res.status(401).json({ msg: "Invalid or Expired OTP" });
  }

  res.status(200).json({ msg: "OTP verified" });
};
