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
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const showToastMessage = (type, msg) => {
    if (type === "success") {
      toast.success(msg, {
        position: "top-center",
        autoClose: 3000,
      });
    } else if (type === "error") {
      toast.error(msg, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email) {
      showToastMessage("error", "Email is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        showToastMessage("success", "Password reset link sent successfully!");
        navigate("/login");
      } else {
        const data = await response.json();
        showToastMessage("error", data.message || "Unable to send reset link.");
      }
    } catch (err) {
      console.error("Error sending reset email:", err);
      showToastMessage("error", "Something went wrong. Please try again.");
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
      < ToastContainer/>
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
          <FaEnvelope size={80} color="#008080" style={{ marginBottom: 30 }} />
          <Typography variant="h5" gutterBottom>
            Forgot Password
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
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? " " : "Send Reset Link"}
            </Button>
          </form>
        </Paper>
        <ToastContainer />
      </Container>
    </Box>
  );
}

export default ForgotPassword;
