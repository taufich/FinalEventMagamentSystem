import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  Divider,
  Link,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Alert,
} from "@mui/material";
import { FaSlideshare } from "react-icons/fa"; // Import Slideshare Icon
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import axios from "axios"; // Import axios for making API requests

function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [role, setRole] = useState(""); // State for role selection
  const [firstName, setfirstName] = useState(""); // New state for name
  const [lastName, setlastName] = useState(""); // New state for name
  const [username, setUsername] = useState(""); // New state for username
  const [contactNumber, setContactNumber] = useState(""); // New state for contact number
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false); // Error state for confirm password
  const [roleError, setRoleError] = useState(false); // State for role validation
  const [firstNameError, setfirstNameError] = useState(false); // Error state for first name
  const [lastNameError, setlastNameError] = useState(false); // Error state for last name
  const [usernameError, setUsernameError] = useState(false); // Error state for username
  const [contactNumberError, setContactNumberError] = useState(false); // Error state for contact number
  const [backendError, setBackendError] = useState(""); // State to capture backend errors
  const [loading, setLoading] = useState(false); // Loading state for submit button

  const navigate = useNavigate(); // Use navigate for routing

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error states
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
    setRoleError(false);
    setfirstNameError(false);
    setlastNameError(false);
    setUsernameError(false);
    setContactNumberError(false);
    setBackendError("");

    // Front-end validation
    if (email === "") setEmailError(true);
    if (firstName === "") setfirstNameError(true);
    if (lastName === "") setlastNameError(true);
    if (username === "") setUsernameError(true);
    if (contactNumber === "") setContactNumberError(true);
    if (password === "") setPasswordError(true);
    if (confirmPassword === "" || password !== confirmPassword) {
      setConfirmPasswordError(true);
    }
    if (role === "") setRoleError(true);

    if (
      email &&
      firstName &&
      lastName &&
      username &&
      contactNumber &&
      password &&
      confirmPassword &&
      password === confirmPassword &&
      role
    ) {
      setLoading(true); 
      try {
        const userData = {
          firstName,
          lastName,
          username,
          email,
          password,
          role,
          contactNumber,
        };

        const response = await axios.post(
          "http://localhost:8080/api/users/register",
          userData
        );

        if (response.status === 200) {
          navigate("/login"); // Redirect to login page
        }
      } catch (error) {
        if (error.response && error.response.data) {
          setBackendError(
            error.response.data.message || "Error occurred while creating account."
          );
        }
      } finally {
        setLoading(false); // Disable loading state
      }
    }
  };

  const navigateToLogin = () => {
    navigate("/login"); // Redirect to the Login page
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
          <FaSlideshare
            size={80}
            color="#008080"
            style={{ marginBottom: 30 }}
          />
          <Typography variant="h5" gutterBottom>
            Create Account
          </Typography>

          {backendError && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {backendError}
            </Alert>
          )}

          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              label="First Name"
              value={firstName}
              error={firstNameError}
              helperText={firstNameError ? "First Name is required" : ""}
              onChange={(e) => setfirstName(e.target.value)}
              sx={{ marginBottom: 2 }}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={lastName}
              error={lastNameError}
              helperText={lastNameError ? "Last Name is required" : ""}
              onChange={(e) => setlastName(e.target.value)}
              sx={{ marginBottom: 2 }}
              fullWidth
            />
            <TextField
              label="Username"
              value={username}
              error={usernameError}
              helperText={usernameError ? "Username is required" : ""}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ marginBottom: 2 }}
              fullWidth
            />
            <TextField
              label="Email"
              value={email}
              error={emailError}
              helperText={emailError ? "Email is required" : ""}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: 2 }}
              fullWidth
            />
            <TextField
              label="Contact Number"
              value={contactNumber}
              error={contactNumberError}
              helperText={contactNumberError ? "Contact Number is required" : ""}
              onChange={(e) => setContactNumber(e.target.value)}
              sx={{ marginBottom: 2 }}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              error={passwordError}
              helperText={passwordError ? "Password is required" : ""}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: 2 }}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              error={confirmPasswordError}
              helperText={confirmPasswordError ? "Passwords must match" : ""}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ marginBottom: 2 }}
              fullWidth
            />
            <FormControl fullWidth error={roleError} sx={{ marginBottom: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="Organizer">Organizer</MenuItem>
                <MenuItem value="Attendee">Attendee</MenuItem>
              </Select>
              {roleError && <FormHelperText>Role is required</FormHelperText>}
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? " " : "Create Account"}
            </Button>
          </form>

          <Divider sx={{ marginTop: 2, marginBottom: 2 }}>OR</Divider>

          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link href="/" onClick={navigateToLogin} sx={{ fontWeight: 600 }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default CreateAccount;
