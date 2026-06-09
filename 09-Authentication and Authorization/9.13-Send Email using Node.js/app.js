import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER, //
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection
try {
  await transporter.verify();
  console.log("SMTP connection successful");
} catch (err) {
  console.error("Verification failed:", err);
}

// Send a message
try {
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM, // sender address
    to: "test@gmail.com", // list of recipients
    subject: "Testing", // subject line
    text: "Hello from backend test", // plain text body
    html: "<h2>Hello from backend test</h2>", // HTML body
  });

  console.log("Message sent: %s", info.messageId);
} catch (err) {
  console.error("Error while sending mail:", err);
}
