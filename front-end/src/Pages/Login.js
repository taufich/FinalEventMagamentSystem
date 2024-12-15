import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import { FaSlideshare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { loginUser } from "../api/userService";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    setLoading(true); // Set loading to true

    try {
      const response = await loginUser(username, password);
      console.log("Login successful:", response);

      Cookies.set("username", username, { expires: 7 });
      Cookies.set("role", response.role, { expires: 7 }); // Save role

      navigate("/otp", { state: { username, password, role: response.role } });
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid username or password.");
    } finally {
      setLoading(false); // Reset loading to false
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
          <FaSlideshare size={80} color="#008080" style={{ marginBottom: 30 }} />
          <Typography variant="h5" gutterBottom>
            Login
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
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ marginBottom: 2 }}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: 2 }}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading} // Disable button while loading
              startIcon={loading && <CircularProgress size={20} />} // Show spinner
            >
              {loading ? " " : "Login"} {/* Change text while loading */}
            </Button>
          </form>

          {/* Links for Sign Up and Forgot Password */}
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{" "}
              <Link href="/create-account" variant="body2" sx={{ textDecoration: "none" }}>
                Sign Up
              </Link>
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
              <Link href="/forgot-password" variant="body2" sx={{ textDecoration: "none" }}>
                Forgot Password?
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
