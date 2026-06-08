import express from "express";
import checkAuth from "../middleware/auth.js";
import {
  getUserInfo,
  userLogin,
  userLogout,
  userLogoutAll,
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
router.post("/logout", checkAuth, userLogout);

// User logout All
router.post("/logout-all", checkAuth, userLogoutAll);

export default router;
