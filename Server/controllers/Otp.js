import { Otp } from "../models/OTP.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt'
import { sendMail } from "../utils/Emails.js";

// pmle rgpa vzhi bbzl
const sendOtp = async (req, res) => {
    try {

    const { email , password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    const otpEntry = new Otp({
        email,
        password,
        otp,
        expiresAt: Date.now() + 1 * 60 * 1000 // 1 minute expiration
    });
    console.log(otpEntry);
    await otpEntry.save();

    // Send OTP to user's email
     // Send OTP via email
    await sendMail(
      email,
      "Your OTP Code",
      `<h2>Your OTP is: <b>${otp}</b></h2><p>It will expire in 1 minute.</p>`
    );
    
    res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpEntry = await Otp.findOne({ email, otp });
        if (!otpEntry) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Check if OTP is expired
        if (otpEntry.expiresAt < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        const hashedPassword=await bcrypt.hash(otpEntry.password,10)
        // OTP is valid, proceed with user registration or login
            // If user doesn't exist, create a new user
            const newUser = new User({
                email,
                password: hashedPassword
            });
            await newUser.save();

        // OTP is valid and user is registered
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to verify OTP" });
    }
};

export { sendOtp, verifyOtp };