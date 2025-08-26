import express from "express";
import { signup, login, verifyOtp, resendOtp, forgotPassword, resetPassword, logout, checkAuth } from '../controllers/Auth.js'
import { verifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();


router
    .post("/signup",signup)
    .post('/login',login)
    .post("/verify-otp",verifyOtp)
    .post("/resend-otp",resendOtp)
    .post("/forgot-password",forgotPassword)
    .post("/reset-password",resetPassword)
    .get("/check-auth",verifyToken,checkAuth)
    .get('/logout',logout)


export default router