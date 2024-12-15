// import React from "react";
// import { Button, Box, Typography, Container, Paper } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";

// const PRIMARY_COLOR = "#3f51b5";
// const SECONDARY_COLOR = "#f50057";
// const TEXT_COLOR_LIGHT = "#ffffff";
// const TEXT_COLOR_DARK = "#333333";
// const TEXT_COLOR_MUTED = "#666666";

// // Main Section Container
// const SectionContainer = styled(Box)(({ theme }) => ({
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   height: "100vh", // Full viewport height
//   textAlign: "center",
//   backgroundColor: "#ffffff", // No background color for the section
//   padding: theme.spacing(4),
// }));

// // Paper Container for the Main Content
// const PaperContainer = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   borderRadius: 8,
//   boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
//   textAlign: "center",
//   width: "100%",
//   maxWidth: "600px", // Centered card style
// }));

// // Typography styles
// const HeroText = styled(Typography)(({ theme }) => ({
//   color: TEXT_COLOR_DARK,
//   fontWeight: 700,
//   fontSize: "2.5rem", // Adjust size to fit all text in one section
//   marginBottom: theme.spacing(2),
// }));

// const HeroSubText = styled(Typography)(({ theme }) => ({
//   color: TEXT_COLOR_MUTED,
//   fontWeight: 400,
//   fontSize: "1.2rem",
//   marginBottom: theme.spacing(3),
// }));

// const HeroButton = styled(Button)(({ theme }) => ({
//   backgroundColor: SECONDARY_COLOR,
//   color: TEXT_COLOR_LIGHT,
//   fontWeight: 600,
//   padding: theme.spacing(2, 4),
//   fontSize: "1.2rem",
//   textTransform: "none",
//   "&:hover": {
//     backgroundColor: "#d4004c", // Darker shade on hover
//   },
//   [theme.breakpoints.down("sm")]: {
//     fontSize: "1rem",
//     padding: theme.spacing(1.5, 3),
//   },
// }));

// // LandingPage Component
// function LandingPage() {
//   const navigate = useNavigate();

//   return (
//     <SectionContainer>
//       <PaperContainer elevation={5}>
//         {/* Hero Section */}
//         <HeroText variant="h1" component="h1">
//           Welcome to EventHub
//         </HeroText>
//         <HeroSubText variant="h6">
//           Register to host or apply for an event. Connecting people, ideas, and opportunities.
//         </HeroSubText>
//         <HeroButton onClick={() => navigate("/register")}>Get Started</HeroButton>

//         {/* Additional Content */}
//         <Box mt={5}>
//           <Typography variant="h4" color={TEXT_COLOR_DARK}>
//             Join a Community of Event Enthusiasts
//           </Typography>
//           <Typography variant="body1" color={TEXT_COLOR_MUTED} mt={2}>
//             Whether you're looking to attend events or host your own, EventHub provides an easy-to-use platform for seamless event management.
//           </Typography>
//           <Box mt={3}>
//             <Button
//               variant="outlined"
//               color="primary"
//               onClick={() => navigate("/login")}
//               sx={{ padding: "10px 30px", fontSize: "1.1rem", textTransform: "none" }}
//             >
//               Login
//             </Button>
//           </Box>
//         </Box>
//       </PaperContainer>
//     </SectionContainer>
//   );
// }

// export default LandingPage;
