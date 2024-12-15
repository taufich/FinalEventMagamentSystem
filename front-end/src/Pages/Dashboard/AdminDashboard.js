import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Grid,
  Paper,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  ListItem,
  TextField,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  // Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  NotificationsActive as NotificationsIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { getAllUsers } from "../../api/userService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FaSlideshare } from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Importing axios for API calls
import { Delete as DeleteIcon } from "@mui/icons-material";

const drawerWidth = 240;

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
  },
}));

const StatCard = ({ title, value, icon: Icon }) => (
  <Paper
    sx={{
      p: 2,
      display: "flex",
      flexDirection: "column",
      height: 140,
      backgroundColor: "background.paper",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: -10,
        right: -10,
        opacity: 0.2,
        transform: "rotate(-10deg)",
      }}
    >
      <Icon sx={{ fontSize: 100 }} />
    </Box>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {title}
    </Typography>
    <Typography component="p" variant="h4">
      {value}
    </Typography>
  </Paper>
);

const RecentActivityCard = () => (
  <Paper sx={{ p: 2, height: "100%", backgroundColor: "background.paper" }}>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      Recent Activity
    </Typography>
    <List>
      {[
        'New event "Tech Conference 2024" created',
        "User John Doe registered",
        'Event "Workshop" updated',
        "New feedback received",
      ].map((activity, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={activity}
            secondary={`${index + 1} hour ago`}
          />
        </ListItem>
      ))}
    </List>
  </Paper>
);

const UsersContent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
        setFilteredUsers(data); // Initialize the filtered list
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle search input changes
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter((user) => {
      return (
        user.firstName.toLowerCase().includes(value) ||
        user.lastName.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.contactNumber.toLowerCase().includes(value) ||
        user.role.toLowerCase().includes(value)
      );
    });

    setFilteredUsers(filtered);
  };

  if (loading) {
    return (
      <Typography variant="h5" component="div" sx={{ p: 2 }}>
        Loading...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h5" component="div" sx={{ p: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h5" component="div" sx={{ p: 2 }}>
        User Management Section
      </Typography>

      {/* Search Input */}
      <Box sx={{ mb: 2, px: 2 }}>
        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name, email, contact, or role"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.contactNumber}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const EventsContent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:8080/api/events/delete/${eventId}`
        );
        setEvents(events.filter((event) => event.id !== eventId)); // Remove the event from the state
        setFilteredEvents(
          filteredEvents.filter((event) => event.id !== eventId)
        ); // Update filtered list
        alert("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete the event.");
      }
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/events");
        setEvents(response.data);
        setFilteredEvents(response.data); // Initialize the filtered events list
      } catch (err) {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle search input changes
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = events.filter((event) => {
      return (
        event.name.toLowerCase().includes(value) ||
        event.description.toLowerCase().includes(value) ||
        event.hour.toLowerCase().includes(value)
      );
    });

    setFilteredEvents(filtered);
  };

  if (loading) {
    return (
      <Typography variant="h5" component="div" sx={{ p: 2 }}>
        Loading...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h5" component="div" sx={{ p: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h5" component="div" sx={{ p: 2 }}>
        Event Management Section
      </Typography>

      {/* Search Input */}
      <Box sx={{ mb: 2, px: 2 }}>
        <TextField
          label="Search Events"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name, description, or time"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Max Attendees</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>
                  {new Date(event.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{event.description}</TableCell>
                <TableCell>{event.maxAttendees}</TableCell>
                <TableCell>{event.hour}</TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

// const SettingsContent = () => (
//   <Typography variant="h5" component="div" sx={{ p: 2 }}>
//     Settings Management Section
//   </Typography>
// );

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard"); // State to track active tab
  const [username, setUsername] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [activeEvents, setActiveEvents] = useState(null);
  const [newUsers] = useState(18); // Default value
  const [notifications] = useState(7); // Default value
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = Cookies.get("username"); // Get username from cookies
    if (storedUsername) {
      setUsername(storedUsername); // Set the username in state
    } else {
      navigate("/login"); // Redirect to login if no username found
    }
  }, [navigate]);

  // Fetch dynamic data for the Dashboard (Users, Events)
  useEffect(() => {
    if (activeTab === "Dashboard") {
      axios
        .get("http://localhost:8080/api/users/total")
        .then((response) => {
          setTotalUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching total users:", error);
        });

      axios
        .get("http://localhost:8080/api/events/total")
        .then((response) => {
          setActiveEvents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching active events:", error);
        });
    }
  }, [activeTab]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      Cookies.remove("username"); // Remove username from cookies
      navigate("/"); // Redirect to login page
    }
  };

  if (!username) {
    return <div>Loading...</div>; // Show a loading state until username is set
  }

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, content: "Dashboard" },
    { text: "Manage Users", icon: <PeopleIcon />, content: <UsersContent /> },
    { text: "Manage Events", icon: <EventIcon />, content: <EventsContent /> },
    // { text: "My Profile", icon: <SettingsIcon />, content: <SettingsContent /> },
  ];

  const renderContent = () => {
    if (activeTab === "Dashboard") {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={totalUsers}
              icon={PeopleIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Events"
              value={activeEvents}
              icon={EventIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="New Users" value={newUsers} icon={PeopleIcon} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Notifications"
              value={notifications}
              icon={NotificationsIcon}
            />
          </Grid>
          <Grid item xs={12}>
            <RecentActivityCard />
          </Grid>
        </Grid>
      );
    }
    return menuItems.find((item) => item.text === activeTab)?.content || null;
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      <StyledAppBar position="absolute">
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
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
            Admin Dashboard
          </Typography>

          <Typography variant="body1" color="inherit" sx={{ marginRight: 2 }}>
            Hello, {username}
          </Typography>

          {/* Right-aligned Logout button */}
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </StyledAppBar>

      <StyledDrawer variant="permanent">
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => setActiveTab(item.text)}
              sx={{
                backgroundColor:
                  activeTab === item.text
                    ? "rgba(0, 128, 128, 0.1)"
                    : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(0, 128, 128, 0.2)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeTab === item.text ? "primary.main" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </StyledDrawer>

      <Box
        component="main"
        sx={{
          backgroundColor: "background.default",
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
