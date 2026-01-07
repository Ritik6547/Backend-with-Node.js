import express from "express";
import checkAuth from "../middleware/auth.js";
import {
  getUserInfo,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/userController.js";

const router = express.Router();

// User registration
router.post("/register", userRegister);

// User login
router.post("/login", userLogin);

// Get user details
router.get("/", checkAuth, getUserInfo);

// User logout
router.post("/logout", userLogout);

export default router;
