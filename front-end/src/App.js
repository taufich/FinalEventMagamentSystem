import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import Login from "./Pages/Login";
import CreateAccount from "./Pages/CreateAccount";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import UserTable from "./Pages/userTable";
import OtpPage from "./Pages/OtpPage.js";
import ForgotPassword from "./Pages/ForgotPassword.js";
import CreateNewPassword from "./Pages/CreateNewPassword.js";
import UserDashboard from "./Pages/Dashboard/UserDashboard.js";
import OrganizerDashboard from "./Pages/Dashboard/OrganizerDashboard.js";
// import LandingPage from "./Pages/LandingPage.js";


// Create a custom theme with the required styles
const theme = createTheme({
  typography: {
    fontFamily: "Quicksand",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
  palette: {
    primary: {
      main: "#008080", // Deep teal primary color
    },
    secondary: {
      main: "#00bfae", // Lighter teal for hover/active states
    },
    background: {
      default: "#121212", // Dark gray background
      paper: "#1e1e1e", // Dark card background
    },
    text: {
      primary: "#fff", // White text
      secondary: "#bbb", // Muted gray for secondary text
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        // Set default styles for all buttons
        variant: "contained",
        color: "primary",
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          height: 50,
          borderRadius: 5,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
        required: true,
      },
      styleOverrides: {
        root: {
          marginBottom: 16,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#008080", // Input border color
            },
            "&:hover fieldset": {
              borderColor: "#00bfae", // Input border on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00bfae", // Focused input border color
            },
          },
          "& .MuiInputLabel-root": {
            color: "#fff", // Label color
          },
          "& .MuiInputBase-input": {
            color: "#fff", // Input text color
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#444", // Dark divider color
          marginY: 16,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontSize: 14,
          color: "#bbb", // Forgot password link color
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/user-table" element={<UserTable />} />
            <Route path="/otp" element={<OtpPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<CreateNewPassword />} />
          </Routes>
        </Router>
    </ThemeProvider>
  );
}

export default App;
