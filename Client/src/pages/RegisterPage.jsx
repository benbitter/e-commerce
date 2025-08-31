import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    let temp = {};

    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) temp.email = "Email is required";
    else if (!emailRegex.test(email)) temp.email = "Invalid email format";

    // Password
    if (!password) temp.password = "Password is required";
    else if (password.length < 6)
      temp.password = "Password must be at least 6 characters long";

    // Confirm Password
    if (!confirmPassword) temp.confirmPassword = "Confirm password is required";
    else if (password !== confirmPassword)
      temp.confirmPassword = "Passwords do not match";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSendOtp = () => {
    if (validate()) {
      const registerUser = async () => {
        try {
          const response = await axios.post(`https://ecommercebackend-8w7r.onrender.com/api/v1/otp/send-otp`, {
            email,
            password,
          });
          if (response.status === 201) {
            alert("User already exists");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
          } else if (response.status === 200) {
            alert("OTP sent successfully");
            setOtpDialogOpen(true);
          } else {
            alert("Failed to send OTP");
            navigate(0);
          }
          // console.log("User registered successfully:", response.data);
        } catch (error) {
          console.error("Registration error:", error);
        }
      };
      registerUser();
      console.log("Sending OTP to:", email);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 6) {
      try {
        const verify = async() => {

          const response = await axios.post(`https://ecommercebackend-8w7r.onrender.com/api/v1/otp/verify-otp`, {
            email,
            otp,
          });
          if (response.status === 200) {
            alert("OTP verified successfully");
            navigate("/");
            navigate(0);
          }
          else if(response.status === 202)
          {
            alert("OTP expired");
            navigate(0);
          }
        };
        verify();
      } catch (error) {
        navigate(0);
        console.error("OTP verification error:", error);
      }
      setOtpDialogOpen(false);
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={5}
        sx={{ p: 4, mt: 10, borderRadius: 3, textAlign: "center" }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Register
        </Typography>

        {/* Email */}
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />

        {/* Password */}
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
        />

        {/* Confirm Password */}
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5 }}
          onClick={handleSendOtp}
        >
          Send OTP
        </Button>
      </Paper>

      {/* OTP Dialog */}
      <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <TextField
            label="6-digit OTP"
            fullWidth
            margin="dense"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputProps={{ maxLength: 6 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOtpDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleVerifyOtp} variant="contained" color="primary">
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default RegisterPage
