import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Avatar,
  CardHeader,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { FaSlideshare } from "react-icons/fa";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import EventIcon from "@mui/icons-material/Event";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const EventCard = ({ event, onApply }) => (
  <Card
    sx={{
      width: "20rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      boxShadow: 3,
      borderRadius: 4,
      p: 2,
      transition: "transform 0.2s",
      "&:hover": {
        transform: "scale(1.03)",
      },
    }}
  >
    <CardHeader
      avatar={
        <Avatar sx={{ bgcolor: "primary.main" }}>
          <EventIcon />
        </Avatar>
      }
      title={
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {event.name}
        </Typography>
      }
      subheader={`Date: ${new Date(event.date).toLocaleDateString()} at ${
        event.hour
      }`}
    />
    <CardContent>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        <strong>Description:</strong> {event.description}
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: "center" }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => onApply(event)}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
        }}
      >
        Apply Now
      </Button>
    </CardActions>
  </Card>
);

function UserDashboard() {
  const [username, setUsername] = useState(null);
  const [events, setEvents] = useState([]);
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("date");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  const [eventsPage, setEventsPage] = useState(0);
  const [eventsRowsPerPage, setEventsRowsPerPage] = useState(6);

  const [appliedPage, setAppliedPage] = useState(0);
  const [appliedRowsPerPage, setAppliedRowsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/events")
      .then((response) => {
        setEvents(response.data);
        setFilteredEvents(response.data);
      })
      .catch((error) => console.error("Error fetching events:", error));

    if (username) {
      axios
        .get(`http://localhost:8080/api/registrations/by/${username}`)
        .then((response) => {
          setAppliedEvents(response.data.map((reg) => reg.event));
        })
        .catch((error) =>
          console.error("Error fetching registrations:", error)
        );
    }
  }, [username]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      Cookies.remove("username");
      navigate("/login");
    }
  };

  const handleApplyEvent = async (event) => {
    const confirmApply = window.confirm(
      `Do you want to apply for the event "${event.name}"?`
    );

    if (confirmApply) {
      const registrationData = {
        username: username,
        id: event.id,
      };

      try {
        await axios.post(
          "http://localhost:8080/api/registrations",
          registrationData
        );
        alert("You have successfully applied for the event!");
        setAppliedEvents((prev) => [...prev, event]);
      } catch (error) {
        console.error("Error applying for event:", error);
        alert("An error occurred while applying for the event.");
      }
    }
  };

  useEffect(() => {
    let updatedEvents = tabIndex === 0 ? [...events] : [...appliedEvents];

    if (searchTerm) {
      updatedEvents = updatedEvents.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    updatedEvents.sort((a, b) => {
      if (sortCriteria === "date") return new Date(a.date) - new Date(b.date);
      if (sortCriteria === "title") return a.name.localeCompare(b.name);
      return 0;
    });

    setFilteredEvents(updatedEvents);
  }, [searchTerm, sortCriteria, tabIndex, events, appliedEvents]);

  const handleEventsPageChange = (event, newPage) => {
    setEventsPage(newPage);
  };

  const handleEventsRowsPerPageChange = (event) => {
    setEventsRowsPerPage(parseInt(event.target.value, 10));
    setEventsPage(0);
  };

  const handleAppliedPageChange = (event, newPage) => {
    setAppliedPage(newPage);
  };

  const handleAppliedRowsPerPageChange = (event) => {
    setAppliedRowsPerPage(parseInt(event.target.value, 10));
    setAppliedPage(0);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <StyledAppBar position="absolute">
        <Toolbar sx={{ display: "flex" }}>
          <IconButton color="inherit">
            <FaSlideshare />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            User Dashboard
          </Typography>
          <Typography variant="body1" color="inherit" sx={{ marginRight: 2 }}>
            Hello, {username}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Tabs
            value={tabIndex}
            // Continuing the code...

            onChange={(event, newValue) => setTabIndex(newValue)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="All Events" />
            <Tab label="Applied Events" />
          </Tabs>
        </Box>
        {tabIndex !== 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              my: 3,
            }}
          >
            <TextField
              label="Search Events"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, maxWidth: 400 }}
            />
            <FormControl variant="outlined" sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="title">Title</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
        {tabIndex === 1 ? (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="applied events table">
                <TableHead>
                  <TableRow>
                    <TableCell>Event Name</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Time</TableCell>
                    <TableCell align="right">Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appliedEvents
                    .slice(
                      appliedPage * appliedRowsPerPage,
                      appliedPage * appliedRowsPerPage + appliedRowsPerPage
                    )
                    .map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.name}</TableCell>
                        <TableCell align="right">
                          {new Date(event.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">{event.hour}</TableCell>
                        <TableCell align="right">{event.description}</TableCell>
                      </TableRow>
                    ))}
                  {appliedEvents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        You haven't applied for any events.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={appliedEvents.length}
              page={appliedPage}
              onPageChange={handleAppliedPageChange}
              rowsPerPage={appliedRowsPerPage}
              onRowsPerPageChange={handleAppliedRowsPerPageChange}
            />
          </>
        ) : (
          <>
            <Grid container spacing={3}>
              {filteredEvents
                .slice(
                  eventsPage * eventsRowsPerPage,
                  eventsPage * eventsRowsPerPage + eventsRowsPerPage
                )
                .map((event) => (
                  <Grid item key={event.id}>
                    <EventCard event={event} onApply={handleApplyEvent} />
                  </Grid>
                ))}
            </Grid>
            <TablePagination
              component="div"
              count={filteredEvents.length}
              page={eventsPage}
              onPageChange={handleEventsPageChange}
              rowsPerPage={eventsRowsPerPage}
              onRowsPerPageChange={handleEventsRowsPerPageChange}
            />
          </>
        )}
      </Container>
    </Box>
  );
}

export default UserDashboard;
