import React, { useState, useRef } from "react";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../api/userService"; // Backend API for OTP verification

function OtpPage() {
  const [otp, setOtp] = useState(new Array(6).fill("")); // State for 6-character OTP
  const [error, setError] = useState(null);
  const otpRefs = useRef([]); // Refs for each input field
  const location = useLocation();
  const navigate = useNavigate();

  const { username, password, role } = location.state || {};

  if (!username || !password || !role) {
    navigate("/"); // Redirect if username, password, or role is not provided
    return null;
  }

  const handleChange = (e, index) => {
    const { value } = e.target;

    // Allow only numeric values and update the OTP array
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1); // Take only the last character
      setOtp(newOtp);

      // Move focus to the next input if available
      if (value && index < otpRefs.current.length - 1) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace to clear and move focus to the previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const fullOtp = otp.join(""); // Combine OTP array into a single string
    if (fullOtp.length < 6) {
      setError("Please complete the OTP.");
      return;
    }

    try {
      const response = await verifyOtp(username, password, fullOtp);
      console.log("OTP Verified:", response);

      // Navigate based on user role after successful OTP verification
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "Attendee") {
        navigate("/user-dashboard");
      }else if (role === "Organizer") {
        navigate("/organizer-dashboard");
      }
       else {
        navigate("/"); // Redirect to login if role is not recognized
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError("Invalid OTP. Please try again.");
    }
  };

  const isOtpComplete = otp.every((char) => char); // Check if all fields are filled

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={5}
          sx={{
            padding: 4,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Verifying OTP
          </Typography>

          {error && (
            <div
              style={{
                color: "red",
                border: "1px solid red",
                padding: "10px",
                height: "30px",
                borderRadius: "4px",
                backgroundColor: "#ffe6e6",
              }}
            >
              {error}
            </div>
          )}
          <br />

          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                marginBottom: 2,
              }}
            >
              {otp.map((value, index) => (
                <TextField
                  key={index}
                  value={value}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  inputProps={{
                    maxLength: 1, // Allow only one character
                    style: { textAlign: "center", fontSize: "1.5rem" },
                  }}
                  inputRef={(el) => (otpRefs.current[index] = el)} // Set ref for each input
                  sx={{ width: "3rem" }}
                />
              ))}
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!isOtpComplete} // Enable button only if OTP is complete
            >
              Verify OTP
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default OtpPage;
