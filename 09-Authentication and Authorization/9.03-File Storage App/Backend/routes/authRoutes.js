import express from "express";
import { sendOTP, verifyOTP } from "../controllers/authController.js";

const router = express.Router();

// send otp
router.post("/send-otp", sendOTP);

// verify otp
router.post("/verify-otp", verifyOTP);

export default router;
