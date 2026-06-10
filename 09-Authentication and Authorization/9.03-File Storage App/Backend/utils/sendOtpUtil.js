import nodemailer from "nodemailer";
import OTP from "../models/otpModel.js";

export async function sendOtpUtil(email) {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  await OTP.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true },
  );

  const html = `
    <div style="font-family:sans-serif;">
        <h2>Your OTP is: ${otp}</h2>
        <p>This OTP is valid for 10 minutes.</p>
    </div>
  `;

  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Verify SMTP Connection
  try {
    await transporter.verify();
    console.log("SMTP Connection Succesfull");

    // Send Email
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Storage App OTP",
      html,
    });

    return { success: true, msg: "OTP sent successfully" };
  } catch (err) {
    await OTP.findOneAndDelete({ email });
    console.log(err);
    return { success: false, msg: "Error while sending mail" };
  }
}
