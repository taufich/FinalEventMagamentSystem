import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function CreateNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  // Extract the token from the URL query parameters
  const getTokenFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!password || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const token = getTokenFromUrl();

    if (!token) {
      setError("Invalid or expired token.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/users/reset-password", {
        token,
        password,
      });

      setMessage("Password reset successfully. Redirecting to login...");
      setTimeout(() => {
        navigate("/login"); // Redirect to home page after 2 seconds
      }, 2000);
    } catch (err) {
      console.error("Error resetting password:", err);
      setError(err.response?.data || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <FaLock size={80} color="#008080" style={{ marginBottom: 30 }} />
          <Typography variant="h5" gutterBottom>
            Create New Password
          </Typography>

          {message && (
            <Typography variant="body1" color="success.main" sx={{ mb: 2 }}>
              {message}
            </Typography>
          )}

          {error && (
            <Typography variant="body1" color="error.main" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? " " : "Reset Password"}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default CreateNewPassword;
