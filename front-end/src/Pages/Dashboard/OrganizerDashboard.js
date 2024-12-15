import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  IconButton,
  styled,
  TablePagination,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Edit,
  Search,
  Print,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { Delete, PeopleAlt } from '@mui/icons-material'; 

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

function OrganizerDashboard() {
  const [username, setUsername] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formEvent, setFormEvent] = useState({
    id: null,
    name: "",
    date: "",
    hour: "",
    description: "",
    maxAttendees: "",
    by: "",
  });
  const [usersDialogOpen, setUsersDialogOpen] = useState(false); // State to control Users Dialog
  const [users, setUsers] = useState([]); // Store users applied for an event

  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
      fetchEventsByUsername(storedUsername);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchEventsByUsername = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/events/by/${username}`
      );
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      Cookies.remove("username");
      navigate("/");
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredEvents(
      events.filter(
        (e) => Object.values(e).join(" ").toLowerCase().includes(term) // Search in all columns
      )
    );
  };

  const handleOpenDialog = (event = null) => {
    setFormEvent(
      event || {
        id: null,
        name: "",
        date: "",
        hour: "",
        description: "",
        maxAttendees: "",
        by: username,
      }
    );
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormEvent({
      id: null,
      name: "",
      date: "",
      hour: "",
      description: "",
      maxAttendees: "",
      by: username,
    });
  };

  const handleFormChange = (e) => {
    setFormEvent({ ...formEvent, [e.target.name]: e.target.value });
  };

  const handleSaveEvent = async () => {
    try {
      if (formEvent.id) {
        await axios.put(
          `http://localhost:8080/api/events/edit/${formEvent.id}`,
          formEvent
        );
      } else {
        await axios.post(
          "http://localhost:8080/api/events/addEvent",
          formEvent
        );
      }
      fetchEventsByUsername(username);
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/events/delete/${eventId}`
        );
        fetchEventsByUsername(username);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const fetchUsersByEvent = async (eventId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/registrations/event/${eventId}/users`
      );
      setUsers(response.data);
      setUsersDialogOpen(true);
    } catch (error) {
      console.error("Error fetching users for the event:", error);
    }
  };

  // Handle Pagination Change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Print Functionality
  const handlePrint = () => {
    const printContent = document
      .getElementById("users-table")
      .getElementsByTagName("tbody")[0].innerHTML;

    // Open a new window
    const newWindow = window.open();

    // Write the HTML content to the new window
    newWindow.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            .table-container {
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border: 1px solid #ddd;
            }
            th {
              background-color: #4CAF50;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            h1 {
              text-align: center;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Applied Users List</h1>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Contact Number</th>
                </tr>
              </thead>
              <tbody>
                ${printContent}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `);

    // Close the document to finish the writing process
    newWindow.document.close();

    // Trigger the print dialog
    newWindow.print();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <StyledAppBar position="absolute">
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Organizer Dashboard
          </Typography>
          <Typography variant="body1" color="inherit" sx={{ marginRight: 2 }}>
            Hello, {username}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </StyledAppBar>

      <br />
      <br />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4">My Events</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Add Event
          </Button>
        </Box>

        <TextField
          label="Search Events"
          value={searchTerm}
          onChange={handleSearch}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* Updated Table with Pagination */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Hour</TableCell>
                <TableCell>Max Attendees</TableCell>
                <TableCell colSpan={2}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>
                      {new Date(event.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{event.hour}</TableCell>
                    <TableCell>{event.maxAttendees}</TableCell>
                    <TableCell colSpan={2}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {/* Edit Icon Button */}
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenDialog(event)}
                        >
                          <Edit />
                        </IconButton>

                        {/* Delete Icon Button */}
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Delete />
                        </IconButton>

                        {/* Applied Users Icon Button */}
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => fetchUsersByEvent(event.id)} // Open Users dialog
                        >
                          <PeopleAlt />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEvents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>

      {/* Users Dialog */}
      <Dialog open={usersDialogOpen} onClose={() => setUsersDialogOpen(false)}>
        <DialogTitle>Users Applied for Event</DialogTitle>
        <DialogActions>
          <Button onClick={handlePrint} startIcon={<Print />} color="primary">
            Print
          </Button>
          <Button onClick={() => setUsersDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
        <DialogContent>
          <div id="users-table">
            {users.length === 0 ? (
              <Typography variant="body1">
                No users have applied for this event.
              </Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Contact Number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.firstName}</TableCell>
                        <TableCell>{user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.contactNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Form Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{formEvent.id ? "Edit Event" : "Add Event"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Event Name"
            name="name"
            value={formEvent.name}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Event Date"
            name="date"
            type="date"
            value={formEvent.date}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Event Hour"
            name="hour"
            type="time"
            value={formEvent.hour}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            name="description"
            value={formEvent.description}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            multiline
            rows={4}
          />
          <TextField
            label="Max Attendees"
            name="maxAttendees"
            value={formEvent.maxAttendees}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEvent} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default OrganizerDashboard;
